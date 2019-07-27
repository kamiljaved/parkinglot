from django.shortcuts import render
from .models import Slot, Customer
from notifications.models import Notification
from django.http import JsonResponse
from datetime import datetime, date, timedelta, time
from django.utils import timezone
from django.db.models import Q
from records.models import DailyRecord
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt


# import for using celery task
# from notifications.tasks import show_notification

deleting_notification = False

def homepage(request):
    standard_slots = Slot.objects.filter(slot_type=Slot.Standard)
    vip_slots = Slot.objects.filter(slot_type=Slot.VIP)
    customers = Customer.objects.filter(is_active=True)
    # calculate customer eta (if eta is negative then set eta = 0)
    
    for cust in customers:

        # elapsed_hrs = datetime.now().time().hour - cust.entry_time.time().hour
        # elapsed_mins = datetime.now().time().minute - cust.entry_time.time().minute

        # total_elapsed_minutes = elapsed_hrs*60 + elapsed_mins
        # total_eta_minutes = cust.alloted_minutes - total_elapsed_minutes

        # totElapsedSeconds = (datetime.now() - cust.entry_time.replace(tzinfo=None)).total_seconds()
        totElapsedMinutes = divmod((datetime.now() - cust.entry_time.replace(tzinfo=None)).total_seconds(), 60)[0]
        # totalEtaSeconds = float(cust.alloted_minutes*60.0) - totElapsedSeconds
        totalEtaMinutes = int(float(cust.alloted_minutes) - totElapsedMinutes)

        if totalEtaMinutes <= 0:
            totalEtaMinutes = 0
            cust.eta = "0 mins"
        else:
            eta_minutes = totalEtaMinutes % 60
            eta_hours = int((totalEtaMinutes - eta_minutes)/60)
            
            if eta_hours == 0:
                cust.eta = f'{eta_minutes} mins'
            else:
                cust.eta = f'{eta_hours} hrs {eta_minutes} mins'

        cust.eta_minutes = totalEtaMinutes
        cust.save()

        if cust.eta_minutes == 0:
            notif = Notification.objects.get(customer_id = cust.pk)
            notif.ready_to_show = True
            notif.save()

    notifications = Notification.objects.filter(ready_to_show=True)

    context = {
        "standard_slots": standard_slots,
        "vip_slots": vip_slots,
        "customers": customers.order_by('eta_minutes'),
        "notifications": notifications,
        "notif_count": notifications.count(),
    }
    return render(request, "parking/index.html", context)

@csrf_exempt
def add_vehicle(request):
    if request.method=='POST':
        reg = request.POST['reg']
        lot = request.POST['lot']
        time = request.POST['time']
        time = int(time)
        hrs = int(request.POST['hrs'])
        mins = int(request.POST['mins'])

        error_vehicle_exists = False
        added = False
        notification_pushed = False
        added_to_record = False

        slot = Slot.objects.filter(pk=lot)[0]

        if Customer.objects.filter(Q(vehicle_reg_no=reg)&Q(is_active=True)).count() > 0:
            error_vehicle_exists = True
        elif not slot.occupied:
            customer = Customer(vehicle_reg_no=reg, slot=slot, alloted_minutes = time)
            customer.save()
            slot.occupied = True
            slot.save()

            added = True
            
            strTime = ''
            if hrs == 0:
                strTime = f'{mins} mins'
            else:
                strTime = f'{hrs} hrs {mins} mins'

            notifContent = f'{strTime} up for {reg} - Slot {slot.slot_num} ({Slot.SLOT_TYPES[slot.slot_type-1][1]})'
            notif = Notification(content = notifContent, slot_id=slot.id, customer_id=customer.id)
            notif.save()
            notification_pushed = True

            customer.notification_id = notif.id
            customer.save()
            # un-comment for using celery
            # push notification to celery
            # minutes = time
            # show_notification.apply_async((notif.id, 0), eta=datetime.now() + timedelta(minutes=minutes))

            # create today's record if it does not exist
            todaysRecord = DailyRecord.objects.filter(date=date.today())
            if todaysRecord.count() == 0:
                todaysRecord = DailyRecord()
                todaysRecord.save()
            else:
                todaysRecord = todaysRecord[0]

            todaysRecord.customers.add(customer)

            # add customer to today's record

        data = {
            'error_vehicle_exists': error_vehicle_exists,
            'added': added,
            'notification_pushed': notification_pushed,
            'added_to_record': added_to_record,
        }
        return JsonResponse(data)


@csrf_exempt
def delete_notifications(request):
    if request.method=='POST':
        delete_list = request.POST.getlist('delete_list[]')

        for pk in delete_list:
            notif = Notification.objects.get(id=pk)
            notif.ready_to_show = False

            customer = Customer.objects.get(id=notif.customer_id)
            customer.is_active = False
            customer.notification_id = None
            customer.save()

            slot = Slot.objects.get(id=notif.slot_id)
            slot.occupied = False
            slot.save()
            
            notif.delete()
    
    return JsonResponse({
            'notif_count': Notification.objects.filter(ready_to_show=True).count(),
        })

from django.shortcuts import render
from django.urls import reverse
from .models import Settings
from django.views.generic import UpdateView
from django.contrib import messages
from parking.models import Slot

class SettingsUpdateView(UpdateView):
    model = Settings
    fields = ['default_email', 'auto_email', 'num_standard_slots', 'num_vip_slots',]

    def get_success_url(self):
        return reverse('home')
    
    def get_object(self):
        return Settings.load()
    
    def form_valid(self, form):
        if form.instance.num_standard_slots > Settings.max_num_slots_of_a_type or form.instance.num_vip_slots > Settings.max_num_slots_of_a_type:
            messages.error(self.request, f'Maximum Number of Slots: 1000', extra_tags="danger")
            return super().form_invalid(form)
        else:
            return super().form_valid(form)
    
    def post(self, request, **kwargs):

        nStandardSlots = int(request.POST['num_standard_slots'])
        nVIPSlots = int(request.POST['num_vip_slots'])
        nMaxSlots = Settings.max_num_slots_of_a_type

        if  nStandardSlots <= nMaxSlots and  nVIPSlots <= nMaxSlots:
            
            nPresStandardSlots = Slot.objects.filter(slot_type=Slot.Standard).count()
            nPresVIPSlots = Slot.objects.filter(slot_type=Slot.VIP).count()

            # if values are not same as old            
            if nPresStandardSlots != nStandardSlots or nPresVIPSlots != nVIPSlots:

                # make request.POST object mutable
                request.POST = request.POST.copy()
                
                # update slots
                initialize_slots(nStandardSlots, nVIPSlots)

                # put actual slot count in settings
                request.POST['num_standard_slots'] = str(Slot.objects.filter(slot_type=Slot.Standard).count())
                request.POST['num_vip_slots'] = str(Slot.objects.filter(slot_type=Slot.VIP).count())

                return super(SettingsUpdateView, self).post(request, **kwargs)
        
        return super(SettingsUpdateView, self).post(request, **kwargs)


def about(request):
    return render(request, "common/about.html")


def initialize_slots(nStandardSlots, nVIPSlots):

    Slot.objects.all().delete()

    for i in range(nStandardSlots):
        slot = Slot(slot_type=Slot.Standard)
        slot.slot_num = i+1
        slot.save()

    for i in range(nVIPSlots):
        slot = Slot(slot_type=Slot.VIP)
        slot.slot_num = i+1+nStandardSlots
        slot.save()
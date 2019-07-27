from __future__ import unicode_literals
from django.shortcuts import render, redirect
from .models import DailyRecord
from datetime import datetime, date, timedelta, time
from django.http import JsonResponse
from django.db.models import Q

from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils.text import slugify

from weasyprint import HTML, CSS
from weasyprint.fonts import FontConfiguration
from django.conf import settings
from shutil import rmtree
import os
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from common.models import Settings
from django.core.mail.message import EmailMessage


def clear_media():
    folder = settings.MEDIA_ROOT
    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            # elif os.path.isdir(file_path): shutil.rmtree(file_path)
        except Exception as e:
            print(e)


def record_pdf_view(request, pk):

    response = HttpResponse(content_type="application/pdf")

    record = DailyRecord.objects.get(pk=pk)

    response['Content-Disposition'] = "inline; filename={date}-record-detail-{count}.pdf".format(
        date=record.date.strftime('%Y-%m-%d'),
        count=slugify(record.customers.all().count()),
    )
    html = render_to_string("records/record_pdf.html", {
        'record': record,
    })

    stylesheets = [
        settings.BASE_DIR + '/pdf-css/form.css',
        settings.BASE_DIR + '/pdf-css/bootstrap.min.css',
    ]

    font_config = FontConfiguration()
    HTML(string=html).write_pdf(
        response, stylesheets=stylesheets, font_config=font_config)

    return response


def record_pdf_download(request, pk):

    response = HttpResponse(content_type="application/pdf")

    record = DailyRecord.objects.get(pk=pk)

    response['Content-Disposition'] = "attachment; filename={date}-record-detail-{count}.pdf".format(
        date=record.date.strftime('%Y-%m-%d'),
        count=slugify(record.customers.all().count()),
    )
    html = render_to_string("records/record_pdf.html", {
        'record': record,
    })

    stylesheets = [
        settings.BASE_DIR + '/pdf-css/form.css',
        settings.BASE_DIR + '/pdf-css/bootstrap.min.css',
    ]

    font_config = FontConfiguration()
    HTML(string=html).write_pdf(
        response, stylesheets=stylesheets, font_config=font_config)

    return response


def record_pdf_file(pk):

    clear_media()

    record = DailyRecord.objects.get(pk=pk)

    html = render_to_string("records/record_pdf.html", {
        'record': record,
    })

    filename = "{date}-{name}-record-detail.pdf".format(
        date=record.date.strftime('%Y-%m-%d'),
        name=slugify(record.customers.all().count()),
    )

    stylesheets = [
        settings.BASE_DIR + '/pdf-css/form.css',
        settings.BASE_DIR + '/pdf-css/bootstrap.min.css',
    ]

    html = HTML(string=html)
    html.write_pdf(target=settings.MEDIA_ROOT+"/"+filename, stylesheets=stylesheets)

    return settings.MEDIA_ROOT+"/"+filename


def record_email(request):

    todaysRecord = DailyRecord.objects.filter(date=date.today())

    if todaysRecord.count() == 0:
        todaysRecord = None
    else:
        todaysRecord = todaysRecord[0]

    prevRecords = DailyRecord.objects.filter(~Q(date=date.today()))

    context = {
        'todays_record': todaysRecord,
        'prev_records': prevRecords,
        'settings': Settings.load(),
    }
    return render(request, "records/record_email.html", context)


@csrf_exempt
def record_email_send(request):

    email_invalid = False
    email_sent = False

    if request.method == 'POST':
        pk = int(request.POST['recid'])
        record = DailyRecord.objects.get(pk=pk)
        to_email = request.POST['email']

        # check validity of email
        if validateEmail(to_email):
            email_invalid = False

            # genarate email
            email = EmailMessage()

            email.subject = "Parking Lot Record: " + str(record.date)
            email.body = "PDF Attachment for Customer Record on " + str(record.date) + "."
            email.from_email = "Parking Lot Records <no-reply@parkinglot.com>"
            email.to = [ to_email, ]

            # generate and attach pdf
            email.attach_file(record_pdf_file(record.pk))
            clear_media()

            # send email
            email.send()
            email_sent = True
        else:
            email_invalid = True

    data = {
        'email_invalid': email_invalid,
        'email_sent': email_sent
    }
    return JsonResponse(data)


def validateEmail(email):
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False


def record_list(request):

    todaysRecord = DailyRecord.objects.filter(date=date.today())

    if todaysRecord.count() == 0:
        todaysRecord = None
    else:
        todaysRecord = todaysRecord[0]

    prevRecords = DailyRecord.objects.filter(~Q(date=date.today()))

    context = {
        'todays_record': todaysRecord,
        'prev_records': prevRecords,
    }
    return render(request, "records/record_list.html", context)


def record_detail(request, pk):

    back_url = "/records/"
    record = DailyRecord.objects.get(pk=pk)
    context = {
        'record': record,
        'back_url': back_url,
    }
    return render(request, "records/record_detail.html", context)


def record_current(request):

    record = DailyRecord.objects.filter(date=date.today())

    if record.count() == 0:
        record = None
    else:
        record = record[0]

    if record is None:
        messages.info(request, 'Record does not exist.')
        return redirect('home')
    else:
        context = {
            'record': record,
            'back_url': "/",
        }
        return render(request, "records/record_detail.html", context)


@csrf_exempt
def record_delete(request):
    deleted = False
    if request.method == 'POST':
        pk = int(request.POST['recid'])
        record = DailyRecord.objects.get(pk=pk)

        # delete record customers
        record.customers.all().delete()

        record.delete()
        deleted = True
    return JsonResponse({
        'deleted': deleted,
    })

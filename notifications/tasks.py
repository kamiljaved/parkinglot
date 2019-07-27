import logging
 
from .models import Notification
from parkinglot.celery import app

# uncomment for using celery

# @app.task
# def show_notification(notif_id, extra):
#     notif = Notification.objects.get(id=notif_id)
#     notif.ready_to_show = True
#     notif.save()

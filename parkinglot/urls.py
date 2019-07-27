"""parkinglot URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from parking.models import Slot
from parking import views as parking_views
from notifications import views as notification_views
from records import views as record_views
from common import views as common_views
from common.models import Settings

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('', parking_views.homepage, name='home'),
    path('park/', parking_views.add_vehicle, name='park'),
    
    path('notifications/', parking_views.homepage, name='notifications'),
    path('notifications/delete/', parking_views.delete_notifications, name='notifications-delete'),


    path('records/', record_views.record_list, name='records'),
    path('records/<int:pk>/', record_views.record_detail, name='record-detail'),
    path('records/current/', record_views.record_current, name='todays-record'),
    path('records/delete/', record_views.record_delete, name='record-delete'),
    path('records/groupdelete/', record_views.record_groupdelete, name='record-groupdelete'),
    path('records/email/', record_views.record_email, name='records-email'),
    path('records/email/send/', record_views.record_email_send, name='records-email-send'),
    path('records/<int:pk>/pdf/', record_views.record_pdf_view, name='record-pdf'),
    path('records/<int:pk>/pdf/download/', record_views.record_pdf_download, name='record-pdf-download'),

    path('settings/', common_views.SettingsUpdateView.as_view() , name='settings'),
    path('about/', common_views.about , name='about'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


#----------------------
#   Initialization
#----------------------

# Slot.objects.all().delete()

# for i in range(Slot.nVIPSlots):
#     slot = Slot(slot_type=1)
#     slot.save()
# for i in range(Slot.nVIPSlots):
#     slot = Slot(slot_type=2)
#     slot.save()

# for slot in Slot.objects.all():
#     slot.occupied = False
#     slot.save()

# my_i = 1
# for slot in Slot.objects.all():
#     slot.occupied = False
#     slot.slot_num = my_i 
#     slot.save()
#     my_i += 1

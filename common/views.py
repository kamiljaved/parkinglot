from django.shortcuts import render
from django.urls import reverse
from .models import Settings
from django.views.generic import UpdateView

class SettingsUpdateView(UpdateView):
    model = Settings
    fields = ['default_email', 'auto_email', 'num_standard_slots', 'num_vip_slots',]

    def get_success_url(self):
        return reverse('home')
    
    def get_object(self):
        return Settings.load() 

def about(request):
    return render(request, "common/about.html")
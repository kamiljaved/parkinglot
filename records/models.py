from django.db import models
from parking.models import Customer
import datetime
from django.utils.translation import gettext_lazy as _


class DailyRecord(models.Model):
    date = models.DateField(_("Date"), default=datetime.date.today)
    customers = models.ManyToManyField(Customer, blank=True, related_name="in_records")

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']



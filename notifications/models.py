from django.db import models
from parking.models import Customer, Slot

class Notification(models.Model):
    content = models.TextField(blank=True, null=True)
    ready_to_show = models.BooleanField(default=False)

    customer_id = models.PositiveIntegerField(default=0)
    slot_id = models.PositiveIntegerField(default=0)
    
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.content}'

    class Meta:
        ordering = ['-updated']
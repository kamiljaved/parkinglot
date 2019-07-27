from django.db import models
from django.utils import timezone



class Slot(models.Model):
    Standard = 1
    VIP = 2

    SLOT_TYPES = [
        (1, 'Standard'),
        (2, 'VIP'),
    ]

    slot_type = models.PositiveIntegerField(choices=SLOT_TYPES, default=Standard)
    occupied = models.BooleanField(default=False)
    slot_num = models.PositiveIntegerField(blank=True, null=True)
    
    class Meta:
        ordering = ['pk']

    def __str__(self):
        return f'Parking Slot # {self.slot_num} Type-{self.SLOT_TYPES[self.slot_type-1][1]}'



class Customer(models.Model):
    vehicle_reg_no = models.CharField(max_length=8)
    entry_time = models.DateTimeField(default=timezone.now)
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE)
    
    # remaining time in text-form
    eta = models.CharField(blank=True, null=True, max_length=20, default="0 mins")
    
    # total (incl. hours and minutes)
    alloted_minutes = models.PositiveIntegerField(default=0)
    eta_minutes = models.PositiveIntegerField(default=0)

    # is customer active or part of a record
    is_active = models.BooleanField(default=True)
    notification_id = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        ordering = ['entry_time']

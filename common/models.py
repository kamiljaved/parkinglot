from django.db import models
from django.core.cache import cache

class SingletonModel(models.Model):

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super(SingletonModel, self).save(*args, **kwargs)
        self.set_cache()

    @classmethod
    def load(cls):
        if cache.get(cls.__name__) is None:
            obj, created = cls.objects.get_or_create(pk=1)
            if not created:
                obj.set_cache()
        return cache.get(cls.__name__)

    def delete(self, *args, **kwargs):
        pass

    def set_cache(self):
        cache.set(self.__class__.__name__, self)

class Settings(SingletonModel):
    default_email = models.EmailField(default='kamiljaved98@gmail.com', verbose_name='Default Email')
    auto_email = models.BooleanField(default=False, verbose_name='Auto-Mail Daily Record')
    num_standard_slots = models.PositiveIntegerField(default=27, verbose_name='No. of Standard Slots')
    num_vip_slots = models.PositiveIntegerField(default=27, verbose_name='No. of VIP Slots')

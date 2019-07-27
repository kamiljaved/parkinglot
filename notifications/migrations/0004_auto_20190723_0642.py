# Generated by Django 2.2.3 on 2019-07-23 06:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0003_notification_ready_to_show'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='customer_id',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='notification',
            name='slot_id',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
# Generated by Django 2.2.3 on 2019-07-23 05:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='content',
            field=models.TextField(blank=True, null=True),
        ),
    ]
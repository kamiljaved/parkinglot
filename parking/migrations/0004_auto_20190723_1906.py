# Generated by Django 2.2.3 on 2019-07-23 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('parking', '0003_customer_alloted_minutes'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='customer',
            options={'ordering': ['eta_minutes']},
        ),
        migrations.AddField(
            model_name='customer',
            name='eta_minutes',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='customer',
            name='eta',
            field=models.CharField(blank=True, default='0 mins', max_length=20, null=True),
        ),
    ]

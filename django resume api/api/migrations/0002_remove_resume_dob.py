# Generated by Django 4.1.1 on 2022-10-03 19:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='resume',
            name='dob',
        ),
    ]

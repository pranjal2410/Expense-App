# Generated by Django 3.1 on 2020-08-22 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expense_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='username',
            field=models.EmailField(max_length=254, unique=True),
        ),
    ]

from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class MyUser(AbstractUser):
    username = models.EmailField(unique=True, null=False)
    flat_no = models.CharField(max_length=100, blank=True, verbose_name="Flat no.")
    society = models.CharField(max_length=100, blank=True, verbose_name="Society")
    ph_no = models.CharField(max_length=13, verbose_name="Phone no.")
    full_name = models.CharField(max_length=100, blank=True, verbose_name="Full Name")
    photo = models.FileField(upload_to='photos/', blank=True, verbose_name='Photo')
    net_income = models.IntegerField(blank=True, verbose_name='Net Income', default=0)
    net_expense = models.IntegerField(blank=True, verbose_name='Net Expense', default=0)

    def __str__(self):
        return self.username


class Income(models.Model):
    source_choices = (('Salary', 'Salary'), ('Rent', 'Rent'), ('Side-Business', 'Side-Business'),
                      ('Tuition', 'Tuition'), ('Part-time Job', 'Part-time Job'), ('Interest', 'Interest'),
                      ('Other', 'Other'))
    date = models.DateField(blank=True, verbose_name="Date")
    amount = models.PositiveIntegerField(verbose_name="Amount", blank=True)
    source = models.CharField(max_length=100, blank=True, choices=source_choices, verbose_name='source')
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, blank=True)

    def __str__(self):
        return self.user.username


class Expense(models.Model):
    info = models.CharField(max_length=100, blank=True, verbose_name='Info')
    amount = models.PositiveIntegerField(blank=True, verbose_name='Amount')
    date = models.DateField(blank=True, verbose_name='Date')
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, blank=True)

    def __str__(self):
        return self.user.username


class Source(models.Model):
    type_choices = (('Income', 'Income'), ('Expense', 'Expense'))
    user = models.ForeignKey(MyUser, blank=True, on_delete=models.CASCADE)
    source = models.CharField(max_length=100, blank=True, verbose_name='source')
    type = models.CharField(max_length=100, blank=True, verbose_name='Source Type', choices=type_choices)

    def __str__(self):
        return self.source

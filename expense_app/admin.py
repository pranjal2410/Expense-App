from django.contrib import admin
from .models import MyUser, Income, Source, Expense
from django.contrib.auth.models import User

# Register your models here.
admin.site.register(MyUser)
admin.site.register(Income)
admin.site.register(Expense)
admin.site.register(Source)

from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.core.validators import MinValueValidator
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.validators import UniqueTogetherValidator

from . import models
from .models import *


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['full_name', 'username', 'password', 'email', 'ph_no', 'flat_no', 'society', 'photo']
        validators = [
            UniqueTogetherValidator(
                queryset=MyUser.objects.all(),
                fields=['username']
            )
        ]

    def create(self, validated_data):
        user = MyUser.objects.create(username=validated_data['username'],
                                     email=validated_data['username'],
                                     full_name=validated_data['full_name'],
                                     ph_no=validated_data['ph_no'],
                                     flat_no=validated_data['flat_no'],
                                     society=validated_data['society'])
        user.set_password(validated_data['password'])
        user.save()
        user.password = '**hidden**'
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    username = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        username = data.get("username", None)
        password = data.get("password", None)
        user = MyUser.objects.get(username=username, password=password)
        if user is None:
            raise serializers.ValidationError(
                'A user with this email and password is not found.'
            )
        try:
            token, created = Token.objects.get_or_create(user=user)
            update_last_login(None, user)
        except MyUser.DoesNotExist:
            raise serializers.ValidationError(
                'User with given email and password does not exists'
            )
        return {
            'username': user.username,
            'token': token
        }


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['source', 'amount', 'date']


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ['source', 'pk']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['full_name', 'email', 'ph_no', 'flat_no', 'society', 'photo']


class IncomeForm(forms.ModelForm):
    source = forms.CharField(widget=forms.Select(), required=True)
    date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    amount = forms.IntegerField(validators=[MinValueValidator(limit_value=0)])

    def __init__(self, *args, **kwargs):
        choices = kwargs.pop('choices')
        super(IncomeForm, self).__init__(*args, **kwargs)
        self.fields['source'].widget.choices = choices

    class Meta:
        model = Income
        fields = ['source', 'amount', 'date']


class UpdateIncomeForm(forms.Form):
    source = forms.CharField(widget=forms.Select(), required=True)
    amount = forms.IntegerField(validators=[MinValueValidator(limit_value=0)])
    date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))

    def __init__(self, *args, **kwargs):
        choices = kwargs.pop('choices')
        super(UpdateIncomeForm, self).__init__(*args, **kwargs)
        self.fields['source'].widget.choices = choices


class UpdateProfileForm(forms.ModelForm):
    class Meta:
        model = MyUser
        fields = ['email', 'ph_no', 'flat_no', 'society', 'photo']


class ExpenseForm(forms.ModelForm):
    info = forms.CharField(widget=forms.Select(), required=True)
    amount = forms.IntegerField(validators=[MinValueValidator(limit_value=0)], required=True)
    date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), required=True)

    def __init__(self, *args, **kwargs):
        choices = kwargs.pop('choices')
        super(ExpenseForm, self).__init__(*args, **kwargs)
        self.fields['info'].widget.choices = choices

    class Meta:
        model = Expense
        fields = ['info', 'amount', 'date']


class UpdateExpenseForm(forms.Form):
    info = forms.CharField(widget=forms.Select(), required=True)
    amount = forms.IntegerField(validators=[MinValueValidator(limit_value=0)], required=True)
    date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), required=True)

    def __init__(self, *args, **kwargs):
        choices = kwargs.pop('choices')
        super(UpdateExpenseForm, self).__init__(*args, **kwargs)
        self.fields['info'].widget.choices = choices


class SourceForm(forms.Form):
    type_choice = (('Income', 'Income'), ('Expense', 'Expense'))
    type = forms.CharField(widget=forms.Select(choices=type_choice), required=True)
    source = forms.CharField(max_length=100, required=True)

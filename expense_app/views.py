from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse_lazy
from django.views import generic
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import *
from .models import MyUser, Income, Expense, Source
from django import forms
from django.contrib import auth
from rest_framework.authtoken.models import Token
from rest_framework.authentication import BasicAuthentication, TokenAuthentication, get_authorization_header
from rest_framework_jwt.utils import jwt_decode_handler
import jwt


class UserViewSet(viewsets.ModelViewSet):
    queryset = MyUser.objects.all()
    serializer_class = UserSerializer


class SignUpView(CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [AllowAny, ]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = authenticate(username=request.data['username'], password=request.data['password'])
            token, created = Token.objects.get_or_create(user=user)
            response = {
                'message': 'Registered Successfully!',
                'token': token.key,
                'success': True
            }

            return Response(response, status=status.HTTP_201_CREATED)

        response = {
            'message': 'User already Registered!',
            'success': False
        }

        return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class LoginView(CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            response = {
                'success': 'True',
                'status code': status.HTTP_200_OK,
                'message': 'User logged in successfully',
                'token': serializer.data['token'],
                'isAuthenticated': True,
            }
            status_code = status.HTTP_200_OK

            return Response(response, status=status_code)
        else:
            response = {
                'success': 'False',
                'status code': status.HTTP_401_UNAUTHORIZED,
                'message': 'Invalid Credentials! Please try again',
            }
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)


def logout_view(request):
    auth.logout(request)
    return redirect('login')


@api_view(['GET', 'POST'])
def update_profile(request):
    if request.method == 'POST':
        form = UpdateProfileForm(request.POST, request.FILES)
        if form.is_valid():
            profile = MyUser.objects.get(username=request.user.username)
            profile.email = form.cleaned_data['email']
            profile.ph_no = form.cleaned_data['ph_no']
            profile.flat_no = form.cleaned_data['flat_no']
            profile.society = form.cleaned_data['society']
            if form.cleaned_data['photo'] is not None:
                profile.photo = form.cleaned_data['photo']
            profile.save()
            return redirect('home')
    else:
        token = Token.objects.get(key=request.headers['Authorization'])
        profile = MyUser.objects.get(pk=token.user_id)
        serialized_profile = ProfileSerializer(profile)
        return JsonResponse(data={'profile': serialized_profile.data})


class AddIncome(generic.View):
    model = Income

    def post(self, request):
        profile = MyUser.objects.get(username=request.user.username)
        choices = [(source.source, source.source) for source in Source.objects.filter(user=profile,
                                                                                      type='Income')]
        form = IncomeForm(request.POST, choices=choices)
        if form.is_valid():
            income = Income.objects.create(source=form.cleaned_data['source'],
                                           date=form.cleaned_data['date'],
                                           amount=form.cleaned_data['amount'],
                                           user=MyUser.objects.get(username=request.user.username))
            income.save()
            profile.net_income += income.amount
            profile.save()
            return redirect('income')


def home_view(request):
    profile = MyUser.objects.get(username=request.user.username)
    profile_dict = {
        'username': profile.username,
        'email': profile.email,
        'password': profile.password,
        'flat_no': profile.flat_no,
        'society': profile.society,
        'ph_no': profile.ph_no,
        'full_name': profile.full_name,
    }
    user_incomes = Income.objects.filter(user=profile)
    return JsonResponse(data={'profile': profile_dict})


def update_income(request, pk):
    if request.method == 'POST':
        user_profile = MyUser.objects.get(username=request.user.username)
        choices = [(source.source, source.source) for source in Source.objects.filter(user=user_profile,
                                                                                      type='Income')]
        form = UpdateIncomeForm(request.POST, choices=choices)
        if form.is_valid():
            income = Income.objects.get(pk=pk)
            user_profile.net_income -= income.amount
            income.source = form.cleaned_data.get('source')
            income.date = form.cleaned_data.get('date')
            income.amount = form.cleaned_data.get('amount')
            income.save()
            user_profile.net_income += income.amount
            user_profile.save()
            return redirect('income')


def delete_income(request, pk):
    income = Income.objects.get(pk=pk)
    profile = MyUser.objects.get(username=request.user.username)
    profile.net_income -= income.amount
    profile.save()
    income.delete()
    return redirect('income')


def update_expense(request, pk):
    if request.method == 'POST':
        profile = MyUser.objects.get(username=request.user.username)
        choices = [(source.source, source.source) for source in Source.objects.filter(user=profile,
                                                                                      type='Expense')]
        form = UpdateExpenseForm(request.POST, choices=choices)
        if form.is_valid():
            expense = Expense.objects.get(pk=pk)
            profile.net_expense -= expense.amount
            expense.info = form.cleaned_data['info']
            expense.amount = form.cleaned_data['amount']
            expense.date = form.cleaned_data['date']
            profile.net_expense += expense.amount
            profile.save()
            expense.save()
            return redirect('expense')


def delete_expense(request, pk):
    expense = Expense.objects.get(pk=pk)
    profile = MyUser.objects.get(username=request.user.username)
    profile.net_expense -= expense.amount
    profile.save()
    expense.delete()
    return redirect('expense')


def add_expense(request):
    profile = MyUser.objects.get(username=request.user.username)
    choices = [(source.source, source.source) for source in Source.objects.filter(user=profile,
                                                                                  type='Expense')]
    form = ExpenseForm(request.POST, choices=choices)
    if request.method == 'POST':
        if form.is_valid():
            profile.net_expense += form.cleaned_data['amount']
            profile.save()
            expense = Expense.objects.create(info=form.cleaned_data['info'],
                                             amount=form.cleaned_data['amount'],
                                             date=form.cleaned_data['date'],
                                             user=profile)
            expense.save()
            return redirect('expense')


@api_view(['GET', 'POST'])
def income_report(request):
    if request.method == 'GET':
        profile = request.user
        incomes = Income.objects.filter(user=profile)
        incomes = incomes.order_by('date')
        income_sources = Source.objects.filter(user=profile, type='Income')
        serialized_incomes = IncomeSerializer(incomes, many=True)
        serialized_sources = SourceSerializer(income_sources, many=True)
        return JsonResponse({'Incomes': serialized_incomes.data, 'min_amount': 0,
                             'max_amount': 100, 'sources': serialized_sources.data, 'username': profile.username})


def expense_report(request):
    profile = MyUser.objects.get(username=request.user.username)
    expenses = Expense.objects.filter(user=profile).order_by('date')
    return render(request, 'expenseReport.html', {'profile': profile, 'expenses': expenses, 'min_amount': 0,
                                                  'max_amount': 100})


def update_source(request, pk, name):
    profile = MyUser.objects.get(username=request.user.username)
    source = Source.objects.get(pk=pk)
    if name == 'income':
        incomes = Income.objects.filter(source=source.source)
        for income in incomes:
            income.source = request.POST['source']
            income.save()
    else:
        expenses = Expense.objects.filter(info=source.source)
        for expense in expenses:
            expense.info = request.POST['source']
            expense.save()
    source.source = request.POST['source']
    source.save()
    return redirect('sources')


def delete_source(request, pk, ):
    profile = MyUser.objects.get(username=request.user.username)
    source = Source.objects.get(pk=pk)
    for i in Income.objects.filter(user=profile, source=source.source):
        profile.net_income -= i.amount
    for i in Expense.objects.filter(user=profile, info=source.source):
        profile.net_expense -= i.amount
    profile.save()
    Income.objects.filter(user=profile, source=source.source).delete()
    Expense.objects.filter(user=profile, info=source.source).delete()
    source.delete()
    return redirect('sources')


def create_source(request):
    profile = MyUser.objects.get(username=request.user.username)
    form = SourceForm(request.POST)
    if request.method == 'POST':
        if form.is_valid():
            Source.objects.create(user=profile,
                                  type=form.cleaned_data['type'],
                                  source=form.cleaned_data['source']).save()
            return redirect('sources')

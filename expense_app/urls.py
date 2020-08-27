from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('Login/', views.LoginView.as_view(), name='login'),
    path('SignUp/', views.SignUpView.as_view(), name='signup'),
    path('Home/', views.home_view, name='home'),
    path('Logout/', views.logout_view, name='logout'),
    path('UpdateProfile/', views.update_profile, name='update'),
    path('UpdateIncome/<int:pk>/', views.update_income, name='update-income'),
    path('DeleteIncome/<int:pk>/', views.delete_income, name='delete-income'),
    path('AddIncome/', views.AddIncome.as_view(), name='add-income'),
    path('UpdateExpense/<int:pk>/', views.update_expense, name='update-expense'),
    path('DeleteExpense/<int:pk>/', views.delete_expense, name='delete-expense'),
    path('AddExpense/', views.add_expense, name='add-expense'),
    path('Income/', views.IncomeReport.as_view(), name='income-report'),
    path('ExpenseReport/', views.expense_report, name='expense-report'),
    path('UpdateSource/<int:pk>/<str:name>/', views.update_source, name='update-source'),
    path('DeleteSource/<int:pk>/', views.delete_source, name='delete-source'),
    path('AddSource/', views.create_source, name='add-source'),
]

# backend/employee_portail/urls.py
from django.urls import path
from .views import EmployeeDashboardView

urlpatterns = [
    path('dashboard/', EmployeeDashboardView.as_view(), name='employee_dashboard'),
    
]
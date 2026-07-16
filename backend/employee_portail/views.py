# backend/employee_portail/views.py
import datetime
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from admin_portail.models import Document, Payslip, LeaveRequest, DocumentRequest
from admin_portail.serializers import (
    DocumentSerializer, PayslipSerializer, 
    LeaveRequestSerializer, DocumentRequestSerializer
)


class EmployeeDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'message': 'Bienvenue dans l’espace personnel employé',
            'user': request.user.email,
        })


class EmployeeDocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user).order_by('-created_at')


class EmployeePayslipListView(generics.ListAPIView):
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payslip.objects.filter(user=self.request.user).order_by('-year', '-month')


class EmployeeLeaveRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LeaveRequest.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']
        
        # Calculer le nombre de jours ouvrables (lundi au vendredi)
        daygenerator = (start_date + datetime.timedelta(x + 1) for x in range((end_date - start_date).days))
        working_days = sum(1 for day in daygenerator if day.weekday() < 5) + (1 if start_date.weekday() < 5 else 0)
        
        serializer.save(user=self.request.user, working_days=working_days)


class EmployeeDocumentRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DocumentRequest.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
from rest_framework import viewsets
from .models import (
    EmployeeProfile,
    LeaveRequest,
    EmployeeDocument,
    Payslip,
    DocumentRequest,
)
from .serializers import (
    EmployeeProfileSerializer,
    LeaveRequestSerializer,
    EmployeeDocumentSerializer,
    PayslipSerializer,
    DocumentRequestSerializer,
)


class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer


class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer


class EmployeeDocumentViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDocument.objects.all()
    serializer_class = EmployeeDocumentSerializer


class PayslipViewSet(viewsets.ModelViewSet):
    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer


class DocumentRequestViewSet(viewsets.ModelViewSet):
    queryset = DocumentRequest.objects.all()
    serializer_class = DocumentRequestSerializer
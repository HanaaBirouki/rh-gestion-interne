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
    queryset = LeaveRequest.objects.all().order_by("-created_at")
    serializer_class = LeaveRequestSerializer


class EmployeeDocumentViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDocument.objects.all().order_by("-date_ajout")
    serializer_class = EmployeeDocumentSerializer


class PayslipViewSet(viewsets.ModelViewSet):
    queryset = Payslip.objects.all().order_by("-annee", "-id")
    serializer_class = PayslipSerializer


class DocumentRequestViewSet(viewsets.ModelViewSet):
    queryset = DocumentRequest.objects.all().order_by("-date_demande")
    serializer_class = DocumentRequestSerializer
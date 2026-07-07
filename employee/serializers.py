from rest_framework import serializers
from .models import (
    EmployeeProfile,
    LeaveRequest,
    EmployeeDocument,
    Payslip,
    DocumentRequest,
)


class EmployeeProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = EmployeeProfile
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "matricule",
            "poste",
            "departement",
            "telephone",
            "adresse",
            "photo",
        ]


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = "__all__"


class EmployeeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocument
        fields = "__all__"


class PayslipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payslip
        fields = "__all__"


class DocumentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentRequest
        fields = "__all__"
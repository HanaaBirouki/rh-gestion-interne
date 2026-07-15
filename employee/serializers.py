from rest_framework import serializers

from .models import (
    EmployeeProfile,
    LeaveRequest,
    EmployeeDocument,
    Payslip,
    DocumentRequest,
)


class EmployeeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeProfile
        fields = "__all__"


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source="employee.__str__",
        read_only=True
    )

    class Meta:
        model = LeaveRequest
        fields = "__all__"
        read_only_fields = ["statut", "created_at"]

    def validate(self, data):
        date_debut = data.get("date_debut")
        date_fin = data.get("date_fin")

        if date_debut and date_fin and date_fin < date_debut:
            raise serializers.ValidationError(
                {
                    "date_fin": "La date de fin doit être après la date de début."
                }
            )

        return data


class EmployeeDocumentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source="employee.__str__",
        read_only=True
    )

    class Meta:
        model = EmployeeDocument
        fields = "__all__"


class PayslipSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source="employee.__str__",
        read_only=True
    )

    class Meta:
        model = Payslip
        fields = "__all__"


class DocumentRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source="employee.__str__",
        read_only=True
    )

    class Meta:
        model = DocumentRequest
        fields = "__all__"
        read_only_fields = ["statut", "date_demande", "fichier"]
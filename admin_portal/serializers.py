from rest_framework import serializers
from .models import Document, Payslip, LeaveRequest, DocumentRequest


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'user', 'name', 'type', 'file_url', 'created_at']
        read_only_fields = ['id', 'created_at']
class PayslipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payslip
        fields = ['id', 'user', 'month', 'year', 'file_url', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_month(self, value):
        if value < 1 or value > 12:
            raise serializers.ValidationError("Le mois doit être entre 1 et 12.")
        return value
class LeaveRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'user', 'user_name', 'type', 'start_date', 'end_date',
            'working_days', 'reason', 'status', 'admin_comment', 'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'working_days']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
class DocumentRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = DocumentRequest
        fields = [
            'id', 'user', 'user_name', 'type', 'status',
            'file_url', 'admin_comment', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
# backend/admin_portail/serializers.py
from rest_framework import serializers
from .models import Document, Payslip, LeaveRequest, DocumentRequest


# ==========================================
# SÉRIALISEUR: DOCUMENTS
# ==========================================

class DocumentSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'user', 'user_email', 'user_name', 'name', 'type', 
            'file_url', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_user_email(self, obj):
        return obj.user.email
    
    def get_user_name(self, obj):
        return obj.user.get_full_name()


# ==========================================
# SÉRIALISEUR: BULLETINS DE PAIE
# ==========================================

class PayslipSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Payslip
        fields = [
            'id', 'user', 'user_email', 'user_name', 'month', 'year', 
            'file_url', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']

    def validate_month(self, value):
        if value < 1 or value > 12:
            raise serializers.ValidationError("Le mois doit être entre 1 et 12.")
        return value
    
    def validate_year(self, value):
        import datetime
        current_year = datetime.datetime.now().year
        if value < 2000 or value > current_year + 1:
            raise serializers.ValidationError(
                f"L'année doit être entre 2000 et {current_year + 1}."
            )
        return value
    
    def get_user_email(self, obj):
        return obj.user.email
    
    def get_user_name(self, obj):
        return obj.user.get_full_name()


# ==========================================
# SÉRIALISEUR: DEMANDES DE CONGÉS
# ==========================================

class LeaveRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    
    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'user', 'user_name', 'user_email', 'type', 'start_date', 
            'end_date', 'working_days', 'reason', 'status', 'admin_comment', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'working_days']

    def get_user_name(self, obj):
        return obj.user.get_full_name()
    
    def get_user_email(self, obj):
        return obj.user.email
    
    def validate(self, data):
        """Vérifie que la date de début est avant la date de fin"""
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                "La date de début doit être antérieure à la date de fin."
            )
        
        return data


# ==========================================
# SÉRIALISEUR: DEMANDES DE DOCUMENTS
# ==========================================

class DocumentRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    type_display = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentRequest
        fields = [
            'id', 'user', 'user_name', 'user_email', 'type', 'type_display',
            'status', 'status_display', 'file_url', 'admin_comment', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_user_name(self, obj):
        return obj.user.get_full_name()
    
    def get_user_email(self, obj):
        return obj.user.email
    
    def get_type_display(self, obj):
        return obj.get_type_display()
    
    def get_status_display(self, obj):
        return obj.get_status_display()
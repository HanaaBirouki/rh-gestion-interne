# backend/employee_portail/serializers.py
from rest_framework import serializers
from .models import EmployeeProfile


class EmployeeProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = EmployeeProfile
        fields = [
            'id', 'user', 'user_email', 'user_name', 'matricule',
            'poste', 'departement', 'telephone', 'adresse', 'photo',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_user_email(self, obj):
        return obj.user.email
    
    def get_user_name(self, obj):
        return obj.user.get_full_name()
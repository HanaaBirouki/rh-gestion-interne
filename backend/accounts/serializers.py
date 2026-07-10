from rest_framework import serializers
from .models import User


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role',
            'contract_type', 'position', 'department', 'hire_date',
            'is_active_employee', 'phone',
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'role', 'contract_type',
            'phone', 'address', 'position', 'department', 'hire_date',
            'end_date', 'salary', 'annual_leave_days',
        ]

    def create(self, validated_data):
        user = User(**validated_data)
        user.username = validated_data['email']
        user.set_unusable_password()
        user.save()
        return user
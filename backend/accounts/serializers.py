from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from .models import LeaveRequest, Document, Payslip, DocumentRequest

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'full_name',
                 'role', 'phone', 'address', 'avatar_url', 'contract_type', 
                 'position', 'department', 'hire_date', 'end_date', 'salary',
                 'annual_leave_days', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()

class UserCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création d'un utilisateur sans mot de passe"""
    
    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'role', 
                 'phone', 'address', 'contract_type', 'position', 'department',
                 'hire_date', 'end_date', 'salary', 'annual_leave_days']
    
    def validate(self, data):
        # Un stagiaire/freelance n'a pas besoin de compte actif
        if data.get('role') in ['STAGIAIRE', 'FREELANCE']:
            data['is_active'] = False
        else:
            data['is_active'] = True
        return data
    
    def create(self, validated_data):
        # Créer l'utilisateur sans mot de passe
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email']),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'EMPLOYE'),
            password=None,  # Pas de mot de passe
            **{k: v for k, v in validated_data.items() 
               if k not in ['email', 'username', 'first_name', 'last_name', 'role']}
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise serializers.ValidationError("Email et mot de passe requis")
        
        user = authenticate(email=email, password=password)
        
        if not user:
            raise serializers.ValidationError("Email ou mot de passe incorrect")
        
        if not user.can_login():
            raise serializers.ValidationError(
                "Vous n'avez pas les droits pour vous connecter. "
                "Seuls les administrateurs et employés peuvent accéder à l'application."
            )
        
        if not user.is_active:
            raise serializers.ValidationError("Ce compte est désactivé")
        
        refresh = RefreshToken.for_user(user)
        
        return {
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if not user.can_login():
                raise serializers.ValidationError(
                    "Cet utilisateur n'a pas le droit de se connecter"
                )
            if not user.is_active:
                raise serializers.ValidationError("Ce compte est désactivé")
        except User.DoesNotExist:
            raise serializers.ValidationError("Aucun utilisateur avec cet email")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Les mots de passe ne correspondent pas"})
        return data

class LeaveRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = LeaveRequest
        fields = ['id', 'user', 'user_name', 'type', 'start_date', 'end_date',
                 'working_days', 'reason', 'status', 'admin_comment', 'created_at']
        read_only_fields = ['id', 'user', 'status', 'admin_comment', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.get_full_name()

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

class DocumentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentRequest
        fields = ['id', 'user', 'type', 'status', 'file_url', 'admin_comment', 'created_at']
        read_only_fields = ['id', 'status', 'file_url', 'admin_comment', 'created_at']
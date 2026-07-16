# backend/accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

User = get_user_model()


# ==========================================
# SÉRIALISEURS POUR L'UTILISATEUR
# ==========================================

class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur complet pour afficher les informations d'un utilisateur"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'address', 'avatar_url', 'contract_type', 
            'position', 'department', 'hire_date', 'end_date', 'salary',
            'annual_leave_days', 'is_active', 'is_active_employee', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class UserListSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour la liste des utilisateurs"""
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role',
            'contract_type', 'position', 'department', 'hire_date',
            'is_active', 'is_active_employee', 'phone',
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création d'un utilisateur sans mot de passe"""
    username = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'role',
            'phone', 'address', 'contract_type', 'position', 'department',
            'hire_date', 'end_date', 'salary', 'annual_leave_days',
        ]
        read_only_fields = ['id']
    
    def validate(self, data):
        # Un stagiaire/freelance n'a pas besoin de compte actif
        if data.get('role') in ['STAGIAIRE', 'FREELANCE']:
            data['is_active'] = False
            data['is_active_employee'] = False
        else:
            data['is_active'] = True
            data['is_active_employee'] = True
        return data
    
    def create(self, validated_data):
        # Créer l'utilisateur sans mot de passe
        user = User(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email']),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'EMPLOYE'),
            is_active=validated_data.get('is_active', True),
            is_active_employee=validated_data.get('is_active_employee', True),
        )
        
        # Définir les autres champs
        for field in ['phone', 'address', 'contract_type', 'position', 
                      'department', 'hire_date', 'end_date', 'salary', 
                      'annual_leave_days']:
            if field in validated_data:
                setattr(user, field, validated_data[field])
        
        user.set_unusable_password()  # Pas de mot de passe pour le moment
        user.save()
        return user


# ==========================================
# SÉRIALISEURS POUR L'AUTHENTIFICATION
# ==========================================

class LoginSerializer(serializers.Serializer):
    """Sérialiseur pour la connexion"""
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
    """Sérialiseur pour la demande de réinitialisation de mot de passe"""
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
    """Sérialiseur pour la confirmation de réinitialisation de mot de passe"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError(
                {"password_confirm": "Les mots de passe ne correspondent pas"}
            )
        return data
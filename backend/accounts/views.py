from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.shortcuts import get_object_or_404

import logging

from .serializers import (
    UserSerializer, UserCreateSerializer, LoginSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
)
from .permissions import IsAdmin

# Configurer le logger
logger = logging.getLogger(__name__)

User = get_user_model()


# ==========================================
# AUTHENTIFICATION
# ==========================================

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Déconnexion réussie'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'message': 'Erreur lors de la déconnexion'}, 
                          status=status.HTTP_400_BAD_REQUEST)


# backend/accounts/views.py
class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email=email)
                
                # Générer le token
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                
                # ✅ CORRIGER LE LIEN - Utiliser le bon port (5173)
                reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"
                
                # Envoyer l'email
                send_mail(
                    'Réinitialisation de votre mot de passe',
                    f"""
                    Bonjour {user.get_full_name()},
                    
                    Vous avez demandé la réinitialisation de votre mot de passe.
                    Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :
                    
                    {reset_link}
                    
                    Ce lien est valable 24h.
                    
                    Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
                    
                    Cordialement,
                    L'équipe WAMA INVEST
                    """,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
                
                return Response({
                    'message': '✅ Un email de réinitialisation a été envoyé à votre adresse email.'
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({
                    'message': '❌ Aucun compte trouvé avec cet email.'
                }, status=status.HTTP_404_NOT_FOUND)
                
            except Exception as e:
                print(f"❌ Erreur: {e}")
                return Response({
                    'message': '❌ Erreur lors de l\'envoi de l\'email.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': '❌ Lien invalide'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not default_token_generator.check_token(user, token):
            return Response({'error': '❌ Token invalide ou expiré'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user.set_password(serializer.validated_data['password'])
            user.save()
            
            logger.info(f"✅ Mot de passe réinitialisé pour {user.email}")
            
            return Response({
                'message': '✅ Mot de passe réinitialisé avec succès'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = UserSerializer(
            request.user,
            context={"request": request}
        )
        return Response(serializer.data)

    def update_profile(self, request):
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def put(self, request):
        return self.update_profile(request)

    def patch(self, request):
        return self.update_profile(request)


class RefreshTokenView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            refresh = RefreshToken(refresh_token)
            return Response({
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Token invalide'}, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# GESTION DES UTILISATEURS (ADMIN)
# ==========================================

class UserListView(generics.ListCreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = UserCreateSerializer
    queryset = User.objects.all().order_by('-created_at')
    
    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.query_params.get('role')
        contract_type = self.request.query_params.get('contract_type')
        is_active = self.request.query_params.get('is_active')
        
        if role:
            queryset = queryset.filter(role=role)
        if contract_type:
            queryset = queryset.filter(contract_type=contract_type)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset
    
    def perform_create(self, serializer):
        user = serializer.save()
        if user.role == 'EMPLOYE' and user.email:
            self.send_invitation_email(user)
    
    def send_invitation_email(self, user):
        """Envoie un email d'invitation à l'employé"""
        try:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
            
            subject = '📧 Création de votre compte employé - WAMA INVEST'
            
            message = f"""
Bonjour {user.get_full_name()},

Votre compte a été créé dans l'application WAMA INVEST.

🔗 Veuillez cliquer sur le lien ci-dessous pour définir votre mot de passe :

{reset_link}

⏰ Ce lien est valable 48 heures.

Cordialement,
L'équipe WAMA INVEST
"""
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            logger.info(f"✅ Email d'invitation envoyé à {user.email}")
            
        except Exception as e:
            logger.error(f"❌ Erreur d'envoi d'invitation à {user.email}: {str(e)}")


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    
    def perform_update(self, serializer):
        user = serializer.save()
        if user.role == 'EMPLOYE' and not user.has_usable_password():
            self.send_invitation_email(user)
    
    def send_invitation_email(self, user):
        try:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
            
            send_mail(
                '📧 Activation de votre compte - WAMA INVEST',
                f"""
Bonjour {user.get_full_name()},

Votre compte a été activé.

🔗 Veuillez cliquer sur le lien ci-dessous pour définir votre mot de passe :

{reset_link}

Cordialement,
L'équipe WAMA INVEST
""",
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            logger.info(f"✅ Email d'activation envoyé à {user.email}")
            
        except Exception as e:
            logger.error(f"❌ Erreur d'envoi d'activation à {user.email}: {str(e)}")


class UserActivationView(APIView):
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        is_active = request.data.get('is_active')
        
        if is_active is None:
            return Response({'error': 'is_active requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_active = is_active
        user.save()
        
        return Response({
            'message': f"Compte {'activé' if is_active else 'désactivé'} avec succès",
            'is_active': user.is_active
        })
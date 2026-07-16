# backend/admin_portail/views.py
from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import logging

from accounts.models import User
from accounts.serializers import UserListSerializer, UserCreateSerializer
from accounts.permissions import IsAdmin
from .models import LeaveRequest, Document, Payslip, DocumentRequest
from .serializers import (
    LeaveRequestSerializer, DocumentSerializer, PayslipSerializer,
    DocumentRequestSerializer
)

logger = logging.getLogger(__name__)


# ==========================================
# FONCTIONS UTILITAIRES
# ==========================================

def is_admin(user):
    """Vérifie si l'utilisateur est un administrateur"""
    return user.is_authenticated and user.role == 'ADMIN'


def send_invitation_email(user):
    """Envoie un email d'invitation à un employé"""
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
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur d'envoi d'invitation à {user.email}: {str(e)}")
        return False


# ==========================================
# DASHBOARD ADMIN
# ==========================================

class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]
    
    def get(self, request):
        data = {
            'nb_employes': User.objects.filter(role='EMPLOYE').count(),
            'nb_stagiaires': User.objects.filter(role='STAGIAIRE').count(),
            'nb_freelances': User.objects.filter(role='FREELANCE').count(),
            'nb_demandes_attente': LeaveRequest.objects.filter(status='PENDING').count(),
            'nb_documents_attente': DocumentRequest.objects.filter(status='PENDING').count(),
            'nb_total_collaborateurs': User.objects.exclude(role='ADMIN').count(),
        }
        return Response(data)


# ==========================================
# GESTION DES COLLABORATEURS
# ==========================================

class CollaboratorListView(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'contract_type', 'is_active', 'is_active_employee']
    
    def get_queryset(self):
        return User.objects.exclude(role='ADMIN').order_by('-created_at')


class CollaboratorCreateView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [IsAdmin]
    
    def perform_create(self, serializer):
        user = serializer.save()
        
        # Si c'est un employé, envoyer un email d'invitation
        if user.role == 'EMPLOYE' and user.email:
            send_invitation_email(user)
        
        logger.info(f"✅ Collaborateur créé: {user.email} ({user.role})")


class CollaboratorDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'
    
    def get_queryset(self):
        return User.objects.exclude(role='ADMIN')


class CollaboratorToggleActiveView(APIView):
    permission_classes = [IsAdmin]
    
    def patch(self, request, id):
        user = get_object_or_404(User.objects.exclude(role='ADMIN'), id=id)
        
        # Basculer le statut
        user.is_active_employee = not user.is_active_employee
        user.is_active = user.is_active_employee  # Synchroniser
        user.save()
        
        logger.info(f"✅ Collaborateur {'activé' if user.is_active_employee else 'désactivé'}: {user.email}")
        
        return Response({
            'id': str(user.id),
            'is_active_employee': user.is_active_employee,
            'is_active': user.is_active,
            'message': f"Compte {'activé' if user.is_active_employee else 'désactivé'} avec succès"
        })


# ==========================================
# GESTION DES DOCUMENTS
# ==========================================

class DocumentUploadView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        user_id = self.request.data.get('user')
        if user_id:
            user = get_object_or_404(User, id=user_id)
            serializer.save(user=user)
        else:
            user = self.request.user
            serializer.save(user=user)
        
        doc = serializer.instance
        logger.info(f"✅ Document uploadé: {doc.name}")
        
        # Envoyer une notification par email à l'employé
        try:
            send_mail(
                subject='📄 Nouveau document disponible - WAMA INVEST',
                message=f"""Bonjour {doc.user.get_full_name()},

Un nouveau document vous a été assigné dans l'application WAMA INVEST.

📂 Nom du document : {doc.name}
🗂️ Type : {doc.get_type_display() if hasattr(doc, 'get_type_display') else doc.type}

Vous pouvez le consulter en vous connectant à votre espace personnel.

Cordialement,
L'équipe WAMA INVEST""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[doc.user.email],
                fail_silently=False,
            )
            logger.info(f"✅ Email de notification document envoyé à {doc.user.email}")
        except Exception as e:
            logger.error(f"❌ Erreur d'envoi d'email document à {doc.user.email}: {str(e)}")


class DocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'user']
    
    def get_queryset(self):
        return Document.objects.all().order_by('-created_at')


class DocumentDetailView(generics.RetrieveAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Document.objects.all()


class DocumentDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAdmin]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Document.objects.all()


# ==========================================
# GESTION DES BULLETINS DE PAIE
# ==========================================

class PayslipUploadView(generics.CreateAPIView):
    serializer_class = PayslipSerializer
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        user_id = self.request.data.get('user')
        if user_id:
            user = get_object_or_404(User, id=user_id)
            serializer.save(user=user)
        else:
            user = self.request.user
            serializer.save(user=user)
        
        payslip = serializer.instance
        logger.info(f"✅ Bulletin de paie uploadé: {payslip.month}/{payslip.year}")
        
        # Envoyer une notification par email à l'employé
        try:
            MONTHS_FR = {
                1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril',
                5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août',
                9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'
            }
            month_name = MONTHS_FR.get(payslip.month, str(payslip.month))
            send_mail(
                subject=f'💰 Bulletin de paie {month_name} {payslip.year} disponible - WAMA INVEST',
                message=f"""Bonjour {payslip.user.get_full_name()},

Votre bulletin de paie est maintenant disponible dans votre espace personnel.

📅 Période : {month_name} {payslip.year}

Connectez-vous à l'application WAMA INVEST pour le consulter et le télécharger.

Cordialement,
L'équipe WAMA INVEST""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[payslip.user.email],
                fail_silently=False,
            )
            logger.info(f"✅ Email de notification bulletin de paie envoyé à {payslip.user.email}")
        except Exception as e:
            logger.error(f"❌ Erreur d'envoi d'email bulletin de paie à {payslip.user.email}: {str(e)}")


class PayslipListView(generics.ListAPIView):
    serializer_class = PayslipSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'year', 'month']
    
    def get_queryset(self):
        return Payslip.objects.all().order_by('-year', '-month')


class PayslipDetailView(generics.RetrieveAPIView):
    serializer_class = PayslipSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Payslip.objects.all()


class PayslipDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAdmin]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Payslip.objects.all()


# ==========================================
# GESTION DES DEMANDES DE CONGÉS
# ==========================================

class LeaveRequestListView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'type', 'user']
    
    def get_queryset(self):
        status = self.request.query_params.get('status')
        if status:
            return LeaveRequest.objects.filter(status=status).order_by('-created_at')
        return LeaveRequest.objects.filter(status='PENDING').order_by('-created_at')


class LeaveRequestDetailView(generics.RetrieveAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'
    
    def get_queryset(self):
        return LeaveRequest.objects.all()


class LeaveRequestReviewView(APIView):
    permission_classes = [IsAdmin]
    
    def patch(self, request, id):
        leave_request = get_object_or_404(LeaveRequest, id=id)
        
        new_status = request.data.get('status')
        comment = request.data.get('admin_comment', '')
        
        if new_status not in ['APPROVED', 'REJECTED']:
            return Response(
                {'error': "Statut invalide. Utilisez 'APPROVED' ou 'REJECTED'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        leave_request.status = new_status
        if comment:
            leave_request.admin_comment = comment
        leave_request.save()
        
        # Envoyer un email de notification
        try:
            send_mail(
                f"📋 Demande de congé {new_status.lower()} - WAMA INVEST",
                f"""
Bonjour {leave_request.user.get_full_name()},

Votre demande de congé du {leave_request.start_date} au {leave_request.end_date}
a été {new_status.lower()}.

{"💬 Commentaire: " + comment if comment else ""}

Cordialement,
L'équipe WAMA INVEST
""",
                settings.DEFAULT_FROM_EMAIL,
                [leave_request.user.email],
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f"❌ Erreur d'envoi d'email de congé: {str(e)}")
        
        logger.info(f"✅ Demande de congé {new_status.lower()}: {leave_request.user.email}")
        
        return Response(LeaveRequestSerializer(leave_request).data)


# ==========================================
# GESTION DES DEMANDES DE DOCUMENTS
# ==========================================

class DocumentRequestListView(generics.ListAPIView):
    serializer_class = DocumentRequestSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'type', 'user']
    
    def get_queryset(self):
        status = self.request.query_params.get('status')
        if status:
            return DocumentRequest.objects.filter(status=status).order_by('-created_at')
        return DocumentRequest.objects.filter(status='PENDING').order_by('-created_at')


class DocumentRequestDetailView(generics.RetrieveAPIView):
    serializer_class = DocumentRequestSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'
    
    def get_queryset(self):
        return DocumentRequest.objects.all()


class DocumentRequestProcessView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]
    
    def patch(self, request, id):
        doc_request = get_object_or_404(DocumentRequest, id=id)
        
        action = request.data.get('action', 'READY')
        comment = request.data.get('admin_comment', '')
        file = request.FILES.get('file_url')
        
        if action not in ['READY', 'REJECTED']:
            return Response(
                {'error': "Action invalide. Utilisez 'READY' ou 'REJECTED'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        doc_request.status = action
        if comment:
            doc_request.admin_comment = comment
        if file:
            doc_request.file_url = file
        doc_request.save()
        
        # Envoyer un email de notification
        try:
            message = f"""
Bonjour {doc_request.user.get_full_name()},

Votre demande de {doc_request.get_type_display()} a été {action.lower()}.

{"💬 Commentaire: " + comment if comment else ""}
"""
            if doc_request.file_url:
                message += f"📎 Téléchargez votre document: {doc_request.file_url.url}"
            
            send_mail(
                f"📄 Demande de document {action.lower()} - WAMA INVEST",
                message,
                settings.DEFAULT_FROM_EMAIL,
                [doc_request.user.email],
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f"❌ Erreur d'envoi d'email de document: {str(e)}")
        
        logger.info(f"✅ Demande de document {action.lower()}: {doc_request.user.email}")
        
        return Response(DocumentRequestSerializer(doc_request).data)
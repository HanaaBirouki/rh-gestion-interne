# backend/admin_portail/models.py
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
import uuid


# ==========================================
# VALIDATEURS
# ==========================================

def validate_pdf_file(file):
    """Valide que le fichier est un PDF et ne dépasse pas 5 Mo"""
    if not file.name.lower().endswith('.pdf'):
        raise ValidationError("Seuls les fichiers PDF sont autorisés.")
    if file.size > 5 * 1024 * 1024:  # 5 Mo
        raise ValidationError("Le fichier ne doit pas dépasser 5 Mo.")


# ==========================================
# MODÈLE: DEMANDES DE CONGÉS
# ==========================================

class LeaveRequest(models.Model):
    class LeaveType(models.TextChoices):
        PAID = 'PAID', 'Congé payé'
        RTT = 'RTT', 'RTT'
        UNPAID = 'UNPAID', 'Sans solde'
        SICK = 'SICK', 'Maladie'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        APPROVED = 'APPROVED', 'Validée'
        REJECTED = 'REJECTED', 'Refusée'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='leave_requests')
    type = models.CharField(max_length=20, choices=LeaveType.choices, default=LeaveType.PAID)
    start_date = models.DateField()
    end_date = models.DateField()
    working_days = models.IntegerField(verbose_name="Jours ouvrables")
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    admin_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Demande de congé"
        verbose_name_plural = "Demandes de congés"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.type} ({self.status})"


# ==========================================
# MODÈLE: DOCUMENTS OFFICIELS
# ==========================================

class Document(models.Model):
    class DocumentType(models.TextChoices):
        CONTRACT = 'CONTRACT', 'Contrat'
        ADDENDUM = 'ADDENDUM', 'Avenant'
        OTHER = 'OTHER', 'Autre'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=255, verbose_name="Nom du fichier")
    type = models.CharField(max_length=20, choices=DocumentType.choices, default=DocumentType.CONTRACT)
    file_url = models.FileField(
        upload_to='admin_portail/documents/%Y/%m/',
        validators=[validate_pdf_file]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Document"
        verbose_name_plural = "Documents"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.user.email}"


# ==========================================
# MODÈLE: BULLETINS DE PAIE
# ==========================================

class Payslip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payslips')
    month = models.IntegerField(verbose_name="Mois")
    year = models.IntegerField(verbose_name="Année")
    file_url = models.FileField(
        upload_to='admin_portail/payslips/%Y/%m/',
        validators=[validate_pdf_file]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Bulletin de paie"
        verbose_name_plural = "Bulletins de paie"
        ordering = ['-year', '-month']
        unique_together = ['user', 'month', 'year']

    def __str__(self):
        return f"Bulletin {self.month}/{self.year} - {self.user.email}"


# ==========================================
# MODÈLE: DEMANDES DE DOCUMENTS
# ==========================================

class DocumentRequest(models.Model):
    class RequestType(models.TextChoices):
        WORK_CERTIFICATE = 'WORK_CERTIFICATE', 'Attestation de travail'
        SALARY_CERTIFICATE = 'SALARY_CERTIFICATE', 'Attestation de salaire'
        WORK_CONTRACT_CERT = 'WORK_CONTRACT_CERT', 'Certificat de travail'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        READY = 'READY', 'Prêt'
        REJECTED = 'REJECTED', 'Refusée'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='document_requests')
    type = models.CharField(max_length=30, choices=RequestType.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    file_url = models.FileField(
        upload_to='admin_portail/documents_requests/%Y/%m/',
        blank=True,
        null=True,
        validators=[validate_pdf_file]
    )
    admin_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Demande de document"
        verbose_name_plural = "Demandes de documents"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type} - {self.user.email} ({self.status})"
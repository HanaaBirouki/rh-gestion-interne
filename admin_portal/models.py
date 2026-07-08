from django.db import models
from django.conf import settings
import uuid
from django.core.exceptions import ValidationError


def validate_pdf_file(file):
    if not file.name.lower().endswith('.pdf'):
        raise ValidationError("Seuls les fichiers PDF sont autorisés.")
    if file.size > 5 * 1024 * 1024:  # 5 Mo
        raise ValidationError("Le fichier ne doit pas dépasser 5 Mo.")

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
    type = models.CharField(max_length=20, choices=LeaveType.choices)
    start_date = models.DateField()
    end_date = models.DateField()
    working_days = models.IntegerField()
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    admin_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.type} ({self.status})"


class Document(models.Model):
    class DocumentType(models.TextChoices):
        CONTRACT = 'CONTRACT', 'Contrat'
        ADDENDUM = 'ADDENDUM', 'Avenant'
        WORK_CERT = 'WORK_CERT', 'Attestation de travail'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=DocumentType.choices)
    file_url = models.FileField(upload_to='documents/', validators=[validate_pdf_file])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.user}"


class Payslip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payslips')
    month = models.IntegerField()
    year = models.IntegerField()
    file_url = models.FileField(upload_to='payslips/', validators=[validate_pdf_file])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bulletin {self.month}/{self.year} - {self.user}"


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
    file_url = models.FileField(upload_to='document_requests/', blank=True, null=True)
    admin_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.user} ({self.status})"
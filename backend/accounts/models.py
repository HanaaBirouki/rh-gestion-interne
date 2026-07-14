from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('EMPLOYE', 'Employé'),
        ('STAGIAIRE', 'Stagiaire'),
        ('FREELANCE', 'Freelance'),
        
    )
    
    CONTRACT_CHOICES = (
        ('CDI', 'CDI'),
        ('CDD', 'CDD'),
        ('STAGE', 'Stage'),
        ('FREELANCE', 'Freelance'),
    )
    
    # Champs obligatoires
    email = models.EmailField(unique=True, verbose_name="Email professionnel")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='EMPLOYE')
    first_name = models.CharField(max_length=150, verbose_name="Prénom")
    last_name = models.CharField(max_length=150, verbose_name="Nom")
    
    # Champs optionnels
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Téléphone")
    address = models.TextField(blank=True, null=True, verbose_name="Adresse")
    avatar_url = models.URLField(blank=True, null=True, verbose_name="Photo")
    
    # Champs professionnels
    contract_type = models.CharField(max_length=20, choices=CONTRACT_CHOICES, default='CDI')
    position = models.CharField(max_length=100, blank=True, null=True, verbose_name="Poste")
    department = models.CharField(max_length=100, blank=True, null=True, verbose_name="Département")
    hire_date = models.DateField(null=True, blank=True, verbose_name="Date d'embauche")
    end_date = models.DateField(null=True, blank=True, verbose_name="Date de fin")
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Salaire brut")
    annual_leave_days = models.IntegerField(default=18, verbose_name="Jours de congés annuels")
    
    # Champs de statut
    is_active = models.BooleanField(default=True, verbose_name="Compte actif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} - {self.role}"
    
    def can_login(self):
        """Vérifie si l'utilisateur peut se connecter"""
        return self.role in ['ADMIN', 'EMPLOYE'] and self.is_active
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_admin(self):
        return self.role == 'ADMIN'
    
    @property
    def is_employee(self):
        return self.role == 'EMPLOYE'
    
    @property
    def is_stagiaire(self):
        return self.role == 'STAGIAIRE'
    
    @property
    def is_freelance(self):
        return self.role == 'FREELANCE'

# Modèles pour les demandes de congés
class LeaveRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'En attente'),
        ('APPROVED', 'Validée'),
        ('REJECTED', 'Refusée'),
    )
    
    TYPE_CHOICES = (
        ('PAID', 'Congé payé'),
        ('RTT', 'RTT'),
        ('UNPAID', 'Congé sans solde'),
        ('SICK', 'Congé maladie'),
    )
    
    id = models.UUIDField(primary_key=True, default=None, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leave_requests')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='PAID')
    start_date = models.DateField()
    end_date = models.DateField()
    working_days = models.IntegerField(verbose_name="Jours ouvrables")
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    admin_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Demande de congé"
        verbose_name_plural = "Demandes de congés"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.type} - {self.status}"

# Modèles pour les documents officiels
class Document(models.Model):
    TYPE_CHOICES = (
        ('CONTRACT', 'Contrat'),
        ('ADDENDUM', 'Avenant'),
        ('OTHER', 'Autre'),
    )
    
    id = models.UUIDField(primary_key=True, default=None, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=255, verbose_name="Nom du fichier")
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='CONTRACT')
    file_url = models.FileField(upload_to='documents/%Y/%m/')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Document"
        verbose_name_plural = "Documents"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.user.email}"

# Modèles pour les bulletins de paie
class Payslip(models.Model):
    id = models.UUIDField(primary_key=True, default=None, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payslips')
    month = models.IntegerField(verbose_name="Mois")
    year = models.IntegerField(verbose_name="Année")
    file_url = models.FileField(upload_to='payslips/%Y/%m/')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Bulletin de paie"
        verbose_name_plural = "Bulletins de paie"
        ordering = ['-year', '-month']
        unique_together = ['user', 'month', 'year']
    
    def __str__(self):
        return f"{self.user.email} - {self.month}/{self.year}"

# Modèles pour les demandes de documents
class DocumentRequest(models.Model):
    TYPE_CHOICES = (
        ('WORK_CERTIFICATE', 'Attestation de travail'),
        ('SALARY_CERTIFICATE', 'Attestation de salaire'),
        ('WORK_CERTIFICATE_CESSATION', 'Certificat de travail'),
    )
    
    STATUS_CHOICES = (
        ('PENDING', 'En attente'),
        ('READY', 'Prêt'),
        ('REJECTED', 'Refusé'),
    )
    
    id = models.UUIDField(primary_key=True, default=None, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='document_requests')
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    file_url = models.FileField(upload_to='documents_requests/%Y/%m/', blank=True, null=True)
    admin_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Demande de document"
        verbose_name_plural = "Demandes de documents"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.type} - {self.status}"
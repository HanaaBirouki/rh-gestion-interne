from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        EMPLOYE = 'EMPLOYE', 'Employé'
        STAGIAIRE = 'STAGIAIRE', 'Stagiaire'

    class ContractType(models.TextChoices):
        CDI = 'CDI', 'CDI'
        CDD = 'CDD', 'CDD'
        STAGE = 'STAGE', 'Stage'
        FREELANCE = 'FREELANCE', 'Freelance'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=Role.choices)
    contract_type = models.CharField(max_length=20, choices=ContractType.choices)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    avatar_url = models.ImageField(upload_to='avatars/', blank=True, null=True)
    position = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    hire_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    annual_leave_days = models.IntegerField(default=18)
    is_active_employee = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

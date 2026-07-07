from django.db import models
from django.conf import settings


class EmployeeProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    matricule = models.CharField(max_length=50, unique=True)
    poste = models.CharField(max_length=100)
    departement = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20, blank=True)
    adresse = models.TextField(blank=True)
    photo = models.ImageField(upload_to="employees/photos/", blank=True, null=True)

    def __str__(self):
        return self.user.email


class LeaveRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "En attente"),
        ("approved", "Validée"),
        ("rejected", "Refusée"),
    ]

    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    type_conge = models.CharField(max_length=100)
    date_debut = models.DateField()
    date_fin = models.DateField()
    nombre_jours = models.PositiveIntegerField()
    motif = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee} - {self.type_conge}"


class EmployeeDocument(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    titre = models.CharField(max_length=150)
    fichier = models.FileField(upload_to="employees/documents/")
    date_ajout = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.titre


class Payslip(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    mois = models.CharField(max_length=30)
    annee = models.IntegerField()
    fichier_pdf = models.FileField(upload_to="employees/payslips/")

    def __str__(self):
        return f"Bulletin {self.mois} {self.annee}"


class DocumentRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "En attente"),
        ("ready", "Prêt"),
        ("rejected", "Refusé"),
    ]

    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    type_document = models.CharField(max_length=100)
    date_demande = models.DateField(auto_now_add=True)
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    fichier = models.FileField(upload_to="employees/requested_documents/", blank=True, null=True)

    def __str__(self):
        return self.type_document
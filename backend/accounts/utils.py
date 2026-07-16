# backend/accounts/utils.py
import uuid
from datetime import datetime, timedelta
from dateutil import parser
from django.db import models
from django.utils import timezone


def generate_uuid():
    """Génère un UUID pour les modèles"""
    return uuid.uuid4()


def calculate_working_days(start_date, end_date):
    """
    Calcule le nombre de jours ouvrables entre deux dates
    (hors samedi, dimanche et jours fériés Maroc)
    """
    start = parser.parse(start_date) if isinstance(start_date, str) else start_date
    end = parser.parse(end_date) if isinstance(end_date, str) else end_date
    
    # Jours fériés au Maroc (à compléter selon le calendrier)
    morocco_holidays = [
        # Dates fixes 2024
        # datetime(2024, 1, 1),    # Nouvel An
        # datetime(2024, 1, 11),   # Manifeste de l'Indépendance
        # datetime(2024, 5, 1),    # Fête du Travail
        # datetime(2024, 7, 30),   # Fête du Trône
        # datetime(2024, 8, 14),   # Oued Ed-Dahab
        # datetime(2024, 8, 20),   # Révolution du Roi et du Peuple
        # datetime(2024, 8, 21),   # Fête de la Jeunesse
        # datetime(2024, 11, 6),   # Marche Verte
        # datetime(2024, 11, 18),  # Fête de l'Indépendance
    ]
    
    current = start
    working_days = 0
    
    while current <= end:
        # Samedi (5) ou Dimanche (6) - jours non ouvrables
        if current.weekday() < 5:  # 0=Lundi, 4=Vendredi
            # Vérifier si c'est un jour férié
            is_holiday = False
            for holiday in morocco_holidays:
                if current.date() == holiday.date():
                    is_holiday = True
                    break
            if not is_holiday:
                working_days += 1
        current += timedelta(days=1)
    
    return working_days


def get_days_remaining(user):
    """
    Calcule les jours de congés restants pour un employé
    Retourne un dictionnaire avec les statistiques
    """
    from .models import LeaveRequest
    
    if user.role != 'EMPLOYE':
        return {
            'total': 0,
            'used': 0,
            'pending': 0,
            'remaining': 0,
            'message': "Seuls les employés ont des congés"
        }
    
    total = user.annual_leave_days or 18
    
    # Congés approuvés (utilisés)
    approved = LeaveRequest.objects.filter(
        user=user,
        status='APPROVED',
        type='PAID'
    ).aggregate(total=models.Sum('working_days'))['total'] or 0
    
    # Congés en attente
    pending = LeaveRequest.objects.filter(
        user=user,
        status='PENDING',
        type='PAID'
    ).aggregate(total=models.Sum('working_days'))['total'] or 0
    
    return {
        'total': total,
        'used': approved,
        'pending': pending,
        'remaining': total - approved - pending,
    }


def get_leave_summary(user):
    """
    Retourne un résumé complet des congés pour un employé
    """
    from .models import LeaveRequest
    
    if user.role != 'EMPLOYE':
        return None
    
    # Tous les congés
    all_leaves = LeaveRequest.objects.filter(user=user)
    
    # Statistiques par statut
    pending_count = all_leaves.filter(status='PENDING').count()
    approved_count = all_leaves.filter(status='APPROVED').count()
    rejected_count = all_leaves.filter(status='REJECTED').count()
    
    # Jours restants
    days_remaining = get_days_remaining(user)
    
    return {
        'total_days': days_remaining['total'],
        'used_days': days_remaining['used'],
        'pending_days': days_remaining['pending'],
        'remaining_days': days_remaining['remaining'],
        'requests': {
            'pending': pending_count,
            'approved': approved_count,
            'rejected': rejected_count,
            'total': all_leaves.count(),
        }
    }


def is_working_day(date):
    """
    Vérifie si une date est un jour ouvrable
    (pas samedi, dimanche ou jour férié)
    """
    # Week-end
    if date.weekday() >= 5:  # 5=Samedi, 6=Dimanche
        return False
    
    # Jours fériés Maroc (à compléter)
    morocco_holidays = [
        # À compléter avec les dates
    ]
    
    for holiday in morocco_holidays:
        if date.date() == holiday.date():
            return False
    
    return True


def get_next_working_day(date):
    """
    Retourne le prochain jour ouvrable après une date
    """
    next_day = date + timedelta(days=1)
    while not is_working_day(next_day):
        next_day += timedelta(days=1)
    return next_day


def validate_date_range(start_date, end_date):
    """
    Valide qu'une plage de dates est correcte
    """
    if start_date > end_date:
        return False, "La date de début doit être antérieure à la date de fin."
    
    if start_date < timezone.now().date():
        return False, "La date de début ne peut pas être dans le passé."
    
    return True, "OK"


def check_leave_overlap(user, start_date, end_date, exclude_id=None):
    """
    Vérifie si une demande de congé chevauche une autre demande validée
    """
    from .models import LeaveRequest
    
    leaves = LeaveRequest.objects.filter(
        user=user,
        status='APPROVED'
    )
    
    if exclude_id:
        leaves = leaves.exclude(id=exclude_id)
    
    for leave in leaves:
        if not (end_date < leave.start_date or start_date > leave.end_date):
            return True, f"Cette période chevauche une demande du {leave.start_date} au {leave.end_date}"
    
    return False, "OK"
import uuid
from datetime import datetime, timedelta
from dateutil import parser
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
    
    # Jours fériés au Maroc (à compléter)
    morocco_holidays = [
        # Dates à ajouter selon le calendrier
        # Exemple: datetime(2024, 1, 1),  # Nouvel An
    ]
    
    current = start
    working_days = 0
    
    while current <= end:
        # Samedi (5) ou Dimanche (6)
        if current.weekday() < 5:  # 0=Lundi, 4=Vendredi
            if current not in morocco_holidays:
                working_days += 1
        current += timedelta(days=1)
    
    return working_days

def get_days_remaining(user):
    """Calcule les jours de congés restants pour un employé"""
    from .models import LeaveRequest
    
    if user.role != 'EMPLOYE':
        return 0
    
    total = user.annual_leave_days or 18
    
    # Congés approuvés
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
        'remaining': total - approved - pending
    }
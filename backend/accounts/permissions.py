# backend/accounts/permissions.py
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Permet uniquement aux administrateurs"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'


class IsEmployee(permissions.BasePermission):
    """Permet uniquement aux employés"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'EMPLOYE'


class IsAdminOrEmployee(permissions.BasePermission):
    """Permet aux administrateurs et aux employés"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['ADMIN', 'EMPLOYE']


class IsOwner(permissions.BasePermission):
    """Vérifie que l'utilisateur est le propriétaire de l'objet"""
    
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False


class IsAdminOrOwner(permissions.BasePermission):
    """Permet à l'admin ou au propriétaire"""
    
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN':
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False


class IsActiveEmployee(permissions.BasePermission):
    """Vérifie que l'utilisateur est un employé actif"""
    
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                request.user.role == 'EMPLOYE' and 
                request.user.is_active_employee)


class IsSelf(permissions.BasePermission):
    """Vérifie que l'utilisateur accède à ses propres données"""
    
    def has_object_permission(self, request, view, obj):
        # Si l'objet a un attribut 'user', comparer avec l'utilisateur
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # Si l'objet est l'utilisateur lui-même
        if hasattr(obj, 'id'):
            return obj.id == request.user.id
        return False
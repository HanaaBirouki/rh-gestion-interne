# backend/gestion_app/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# ==========================================
# DOCUMENTATION API SWAGGER
# ==========================================
schema_view = get_schema_view(
    openapi.Info(
        title="WAMA INVEST - API Gestion Employés",
        default_version='v1',
        description="""
        API pour la gestion des employés de WAMA INVEST.
        
        ## Authentification
        Utilisez le token JWT pour vous authentifier.
        
        ## Endpoints disponibles
        - `/api/auth/` - Authentification et gestion des utilisateurs
        - `/api/admin/` - Administration (dashboard, collaborateurs, documents, etc.)
        - `/api/employee/` - Espace personnel employé (congés, documents, etc.)
        """,
        terms_of_service="https://www.wamainvest.com/terms/",
        contact=openapi.Contact(
            email="contact@wamainvest.com",
            name="WAMA INVEST Support"
        ),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# ==========================================
# URLS PRINCIPALES
# ==========================================
urlpatterns = [
    # Administration Django
    path('admin/', admin.site.urls),
    
    # ==========================================
    # API - Authentification (accounts)
    # ==========================================
    path('api/auth/', include('accounts.urls')),
    
    # ==========================================
    # API - Administration (admin_portail)
    # ==========================================
    path('api/admin/', include('admin_portail.urls')),
    
    # ==========================================
    # API - Espace Personnel (employee_portail)
    # ==========================================
    path('api/employee/', include('employee_portail.urls')),
    
    # ==========================================
    # API - Documentation
    # ==========================================
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='api-docs'),
]

# ==========================================
# FICHIERS MEDIA EN MODE DÉVELOPPEMENT
# ==========================================
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
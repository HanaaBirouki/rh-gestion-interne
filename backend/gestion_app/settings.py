# backend/gestion_app/settings.py
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# ==========================================
# CHEMINS DU PROJET
# ==========================================
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

# ==========================================
# SÉCURITÉ
# ==========================================
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-default-key-change-me')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ==========================================
# APPLICATIONS INSTALLÉES
# ==========================================
INSTALLED_APPS = [
    # Applications Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Bibliothèques externes
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'drf_yasg',
    'django_filters',
    
    # Applications du projet
    'accounts',
    'admin_portail',
    'employee_portail',
]

# Modèle utilisateur personnalisé
AUTH_USER_MODEL = 'accounts.User'

# ==========================================
# MIDDLEWARE
# ==========================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Doit être en haut
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ==========================================
# URLS ET TEMPLATES
# ==========================================
ROOT_URLCONF = 'gestion_app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'gestion_app.wsgi.application'

# ==========================================
# BASE DE DONNÉES - PostgreSQL
# ==========================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'gestion_db'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'marwa123'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# ==========================================
# VALIDATION DES MOTS DE PASSE
# ==========================================
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 8},
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ==========================================
# LANGUE ET FUSEAU HORAIRE
# ==========================================
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Casablanca'
USE_I18N = True
USE_TZ = True

# ==========================================
# FICHIERS STATIQUES ET MÉDIAS
# ==========================================
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ==========================================
# CORS (Cross-Origin Resource Sharing)
# ==========================================
# Pour le développement - autorise toutes les origines
CORS_ALLOW_ALL_ORIGINS = True

# Pour la production, utilisez plutôt ceci :
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://localhost:5173",
#     "http://localhost:5174",
#     "https://votre-domaine.com",
# ]
# CORS_ALLOW_CREDENTIALS = True

# ==========================================
# DJANGO REST FRAMEWORK
# ==========================================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
}

# ==========================================
# JWT (JSON Web Tokens)
# ==========================================
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ==========================================
# CONFIGURATION EMAIL
# ==========================================
# Option 1: Console (pour le développement - affiche les emails dans le terminal)
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Option 2: Gmail SMTP (pour l'envoi d'emails réels)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# ==========================================
# TYPE DES IDENTIFIANTS AUTOMATIQUES
# ==========================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==========================================
# LOGGING (pour le débogage)
# ==========================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'accounts': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'admin_portail': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'employee_portail': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
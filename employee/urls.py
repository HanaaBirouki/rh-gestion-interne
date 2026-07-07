from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeProfileViewSet,
    LeaveRequestViewSet,
    EmployeeDocumentViewSet,
    PayslipViewSet,
    DocumentRequestViewSet,
)

router = DefaultRouter()
router.register("profiles", EmployeeProfileViewSet)
router.register("leaves", LeaveRequestViewSet)
router.register("documents", EmployeeDocumentViewSet)
router.register("payslips", PayslipViewSet)
router.register("requests", DocumentRequestViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
]
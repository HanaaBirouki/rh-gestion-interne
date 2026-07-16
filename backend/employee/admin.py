from django.contrib import admin
from .models import (
    EmployeeProfile,
    LeaveRequest,
    EmployeeDocument,
    Payslip,
    DocumentRequest,
)

admin.site.register(EmployeeProfile)
admin.site.register(LeaveRequest)
admin.site.register(EmployeeDocument)
admin.site.register(Payslip)
admin.site.register(DocumentRequest)
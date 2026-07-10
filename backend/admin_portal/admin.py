from django.contrib import admin
from .models import LeaveRequest, Document, Payslip, DocumentRequest
admin.site.register(LeaveRequest)
admin.site.register(Document)
admin.site.register(Payslip)
admin.site.register(DocumentRequest)
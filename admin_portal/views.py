from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status
from django_filters.rest_framework import DjangoFilterBackend
from accounts.models import User
from accounts.serializers import UserListSerializer, UserCreateSerializer
from .models import LeaveRequest
from rest_framework.parsers import MultiPartParser, FormParser


def is_admin(user):
    return user.is_authenticated and user.role == User.Role.ADMIN


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if not is_admin(request.user):
        return Response({'error': "Accès réservé à l'administrateur."}, status=403)

    data = {
        'nb_employes': User.objects.filter(role=User.Role.EMPLOYE).count(),
        'nb_stagiaires': User.objects.filter(role=User.Role.STAGIAIRE, contract_type=User.ContractType.STAGE).count(),
        'nb_freelances': User.objects.filter(role=User.Role.STAGIAIRE, contract_type=User.ContractType.FREELANCE).count(),
        'nb_demandes_attente': LeaveRequest.objects.filter(status=LeaveRequest.Status.PENDING).count(),
    }
    return Response(data)


class CollaboratorListView(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'contract_type', 'is_active_employee']

    def get_queryset(self):
        if not is_admin(self.request.user):
            return User.objects.none()
        return User.objects.exclude(role=User.Role.ADMIN)


class CollaboratorCreateView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if not is_admin(request.user):
            return Response({'error': "Accès réservé à l'administrateur."}, status=403)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # TODO: si role = EMPLOYE, envoyer l'email d'invitation "mot de passe oublié"
        # (à coordonner avec la collègue en charge de l'authentification)

        return Response(UserCreateSerializer(user).data, status=status.HTTP_201_CREATED)
class CollaboratorDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        if not is_admin(self.request.user):
            return User.objects.none()
        return User.objects.exclude(role=User.Role.ADMIN)
class CollaboratorToggleActiveView(generics.GenericAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        if not is_admin(request.user):
            return Response({'error': "Accès réservé à l'administrateur."}, status=403)

        try:
            user = User.objects.exclude(role=User.Role.ADMIN).get(id=id)
        except User.DoesNotExist:
            return Response({'error': "Collaborateur introuvable."}, status=404)

        user.is_active_employee = not user.is_active_employee
        user.save()

        return Response({
            'id': str(user.id),
            'is_active_employee': user.is_active_employee,
        })
from .models import Document
from .serializers import DocumentSerializer


class DocumentUploadView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if not is_admin(request.user):
            return Response({'error': "Accès réservé à l'administrateur."}, status=403)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
from .serializers import PayslipSerializer


class PayslipUploadView(generics.CreateAPIView):
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if not is_admin(request.user):
            return Response({'error': "Accès réservé à l'administrateur."}, status=403)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer


class LeaveRequestListView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not is_admin(self.request.user):
            return LeaveRequest.objects.none()
        return LeaveRequest.objects.filter(status=LeaveRequest.Status.PENDING).order_by('-created_at')


class LeaveRequestReviewView(generics.GenericAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        if not is_admin(request.user):
            return Response({'error': "Accès réservé à l'administrateur."}, status=403)

        try:
            leave_request = LeaveRequest.objects.get(id=id)
        except LeaveRequest.DoesNotExist:
            return Response({'error': "Demande introuvable."}, status=404)

        new_status = request.data.get('status')
        if new_status not in [LeaveRequest.Status.APPROVED, LeaveRequest.Status.REJECTED]:
            return Response({'error': "Statut invalide."}, status=400)

        leave_request.status = new_status
        leave_request.admin_comment = request.data.get('admin_comment', '')
        leave_request.save()

        return Response(LeaveRequestSerializer(leave_request).data)
from .models import DocumentRequest
from .serializers import DocumentRequestSerializer


class DocumentRequestListView(generics.ListAPIView):
    serializer_class = DocumentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not is_admin(self.request.user):
            return DocumentRequest.objects.none()
        return DocumentRequest.objects.filter(status=DocumentRequest.Status.PENDING).order_by('-created_at')


class DocumentRequestProcessView(generics.GenericAPIView):
    serializer_class = DocumentRequestSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, id):
        if not is_admin(request.user):
            return Response({'error': "Accès réservé à l'administrateur."}, status=403)

        try:
            doc_request = DocumentRequest.objects.get(id=id)
        except DocumentRequest.DoesNotExist:
            return Response({'error': "Demande introuvable."}, status=404)

        doc_request.status = DocumentRequest.Status.READY
        if 'file_url' in request.data:
            doc_request.file_url = request.data['file_url']
        doc_request.admin_comment = request.data.get('admin_comment', '')
        doc_request.save()

        return Response(DocumentRequestSerializer(doc_request).data)
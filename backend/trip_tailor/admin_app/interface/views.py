import calendar
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from admin_app.interface.serializers import ( 
    AdminLoginSerializer, PlatformFeeSerializer, AdminDashboardMetricsSerializer, SalesReportSerializer
)
from admin_app.repository.sales_report_repository import SalesReportRepository
from admin_app.utils.sales_report_pdf import generate_sales_report_pdf

from user_auth.repository.user_repository import UserRepository
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from user_auth.domain.models import CustomUser
from user_auth.interface.views import CustomUserSerializer
from agency_app.repository.agency_repository import AgencyRepository
from bookings.repositories.booking_repository import BookingRepository
from payments.repository.payment_repository import PaymentRepository
from core.pagination import StandardResultsSetPagination

from agency_app.models import AgencyProfile
from payments.repository.payment_repository import PaymentRepository

from django.utils.dateparse import parse_date
from django.contrib.auth import get_user_model
from django.http import HttpResponse

from openpyxl import Workbook

User = get_user_model()


# Create your views here.

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = AdminLoginSerializer(data = request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = UserRepository.authenticate_user(username, password)

            if user and user.is_superuser:
                refresh = RefreshToken.for_user(user)
                response = Response({'message' : 'Login succesful'})
                access_token = str(refresh.access_token)
                refresh_token  = str(refresh)
                response.set_cookie(
                    key= 'access_token',
                    value= access_token,
                    httponly= True,
                    secure= False,
                    samesite= 'Lax',
                    max_age= 3600,
                )
                response.set_cookie(
                    key= 'refresh_token',
                    value= refresh_token,
                    httponly= True,
                    secure= False,
                    samesite= 'Lax',
                    max_age= 86400,
                )

                print("login success and cookie set")
                return response
            else:
                return Response({'detail': 'Invalid credentials or not admin'}, status= status.HTTP_401_UNAUTHORIZED)
            
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
class AdminProfileView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):
        return Response({
            'username': request.user.username,
            'email': request.user.email
        })

class AdminLogoutView(APIView):
    def post(self, request):
        response = Response({'message': 'Logged out'})
        response.delete_cookie(
            key='access_token',
            path='/',
            samesite='Lax',
        )
        response.delete_cookie(
            key='refresh_token',
            path='/',
            samesite='Lax',
        )
        return response
    

class UserListView(generics.ListAPIView):
    queryset = UserRepository.get_all_users()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StandardResultsSetPagination
    

class AgencyListView(generics.ListAPIView):
    queryset = AgencyRepository.get_all_agencies_with_profiles()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StandardResultsSetPagination
    
class AgencyDetailsView(APIView):
    permission_classes= [IsAdminUser]
    
    def get(self, request, pk):
        try:
            user = AgencyRepository.get_agency_by_id(pk=pk)
            profile = user.agency_profile

            data = CustomUserSerializer(user).data
            data.update({
                'profile_completed': all([
                    profile.agency_name,
                    profile.profile_pic,
                    profile.address,
                    profile.phone_number,
                    profile.license_document,
                    profile.description,
                ]),
                'agency_name': profile.agency_name,
                'agency_id':profile.id,
                'phone_number': profile.phone_number,
                'profile_pic': profile.profile_pic,
                'license_document': profile.license_document, 
                'address': profile.address,
                'description': profile.description,
                'status': profile.status,
                'rejection_reason': profile.rejection_reason,
            })

            return Response(data)
        
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Agency not found'}, status=404)
        
        
class AgencyVerifyView(APIView):
    permission_classes= [IsAdminUser]

    def post(self, request, pk):
        try:
            user = AgencyRepository.get_agency_by_id(pk=pk)
            profile = user.agency_profile

            if not profile:
                return Response({'detail': 'Agency profile not found'}, status=status.HTTP_404_NOT_FOUND)

            if profile.status == AgencyProfile.Status.VERIFIED:
                return Response({'detail': 'Agency already verified'}, status=status.HTTP_400_BAD_REQUEST)
            if profile.status == AgencyProfile.Status.REJECTED:
                return Response({'detail': 'Agency already rejected'}, status=status.HTTP_400_BAD_REQUEST)
            
            required_fields = [
                profile.agency_name,
                profile.profile_pic,
                profile.address,
                profile.phone_number,
                profile.license_document,
                profile.description,
            ]
            if not all(required_fields):
                return Response({'detail': 'Incomplete profile, cannot verify'}, status=status.HTTP_400_BAD_REQUEST)

            profile.status = AgencyProfile.Status.VERIFIED
            profile.rejection_reason = None
            profile.save()

            return Response({'message': 'Agency successfully verified'}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({'detail': 'Agency not found'}, status=status.HTTP_404_NOT_FOUND)
        
class AgencyRejectView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            user = AgencyRepository.get_agency_by_id(pk = pk)
            profile = user.agency_profile

            if profile.status == AgencyProfile.Status.VERIFIED:
                return Response({'detail': 'Cannot reject a verified agency'}, status= status.HTTP_400_BAD_REQUEST)
            
            if profile.status == AgencyProfile.Status.REJECTED:
                return Response({'detail': 'Agency already rejected'}, status=status.HTTP_400_BAD_REQUEST)
            
            reason = request.data.get('reason', '').strip() or None

            profile.status = AgencyProfile.Status.REJECTED
            profile.rejection_reason = reason
            profile.save()

            return Response({'message': 'Agency rejected', 'reason': reason}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'detail': 'Agency not found'}, status=status.HTTP_404_NOT_FOUND)

class PlatformFeeView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        fee = PaymentRepository.get_current_fee()
        return Response({
            "percentage":fee.percentage,
            "minimum_fee":fee.minimum_fee
        })
    
    def post(self, request):
        fee, _ = PaymentRepository.get_or_create_fee(id=1)
        serializer = PlatformFeeSerializer(fee, data= request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Platform fee updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AdminDashboardMetricsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        transaction_data = PaymentRepository.total_earning_and_total_platform_fee()

        monthly_qs = BookingRepository.monthly_booking_stats()

        monthly_bookings = []
        for item in monthly_qs:
            month_name = calendar.month_abbr[item["month"].month]
            monthly_bookings.append({
                "month": month_name,
                "bookings": item["bookings"]
            })

        payload = {
            "total_users": UserRepository.count_of_all_users(),
            "total_agencies": AgencyRepository.count_of_all_agencies(),
            "total_bookings": BookingRepository.count_of_bookings(),
            "total_earnings": transaction_data["total_earning"],
            "total_platform_fee": transaction_data["total_platform_fee"],
            "monthly_bookings": monthly_bookings,
        }

        serializer = AdminDashboardMetricsSerializer(payload)
        return Response(serializer.data)
    
class AdminSalesReportView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if start_date:
            start_date = parse_date(start_date)
            if not start_date:
                return Response(
                    {"detail": "Invalid start_date format. use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        if end_date:
            end_date = parse_date(end_date)
            if not end_date:
                return Response(
                    {"detail": "Invalid end_date format. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        if start_date and end_date and start_date > end_date:
            return Response(
                {"detail": "start_date connot after end_date"},
                status=status.HTTP_400_BAD_REQUEST
            )

        report_data = SalesReportRepository.generate_report(
            start_date=start_date, end_date=end_date
        )
        serializer = SalesReportSerializer(report_data)

        return Response(serializer.data)
    
class AdminSalesReportExcelExportView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if start_date:
            start_date = parse_date(start_date)
            if not start_date:
                return Response(
                    {"detail": "Invalid start_date format. use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        if end_date:
            end_date = parse_date(end_date)
            if not end_date:
                return Response(
                    {"detail": "Invalid end_date format. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        if start_date and end_date and start_date > end_date:
            return Response(
                {"detail": "start_date connot after end_date"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        report = SalesReportRepository.generate_report(
            start_date=start_date, end_date=end_date
        )["metrics"]

        wb = Workbook()
        ws = wb.active
        ws.title = "Sales Report"

        ws.append(["Metric", "Value"])

        ws.append(["Total Bookings", report["total_bookings"]])
        ws.append(["Total Amount Transferred", report["total_amount_transferred"]])
        ws.append(["Total Platform Fee Collected", report["total_platform_fee_collected"]])
        ws.append(["New Users", report["new_users_count"]])
        ws.append(["New Agencies", report["new_agencies_count"]])
        ws.append(["Average Booking Price", report["average_booking_price"]])
        ws.append(["Aveage Platform Fee", report["average_platform_fee"]])
        
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        filename = "sales_report.xlsx"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'

        wb.save(response)
        return response
    
class AdminSalesReportPDFView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if start_date:
            start_date = parse_date(start_date)
            if not start_date:
                return Response(
                    {"detail": "Invalid start_date format. use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        if end_date:
            end_date = parse_date(end_date)
            if not end_date:
                return Response(
                    {"detail": "Invalid end_date format. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        if start_date and end_date and start_date > end_date:
            return Response(
                {"detail": "start_date connot after end_date"},
                status=status.HTTP_400_BAD_REQUEST
            )

        report_data = SalesReportRepository.generate_report(
            start_date=start_date,
            end_date=end_date
        )

        pdf_bytes = generate_sales_report_pdf(report_data)

        response = HttpResponse(
            pdf_bytes,
            content_type="application/pdf"
        )

        response["Content-Disposition"] = (
            'attachment; filename="sales_report.pdf"'
        )

        return response
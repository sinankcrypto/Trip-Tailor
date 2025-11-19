from ..models import EmailOTP
import logging
from django.utils import timezone

logger = logging.getLogger(__name__)

class EmailOTPRepository:
    @staticmethod
    def get_latest_by_email(email):
        """Get the most recent OTP for this email"""
        try:
            email_clean = email.lower().strip()
            otp_obj = EmailOTP.objects.filter(email__iexact=email_clean).first()
            logger.debug(f"fetched latest OTP for {email}")
            return otp_obj
        except EmailOTP.DoesNotExist:
            logger.info(f"No OTP found for this email: {email}")
            return None
        
    @staticmethod
    def create(email: str, otp: str, validity_minutes: int=10):
        """Delete old OTPs and create a fresh one (only one active at a time)"""
        email = email.lower().strip()

        deleted_count,_ = EmailOTP.objects.filter(email__iexact=email).delete()
        if deleted_count > 0:
            logger.info(f"Deleted {deleted_count} old OTP record(s) for {email}")
        
        expires_at = timezone.now() + timezone.timedelta(minutes=validity_minutes)

        otp_obj = EmailOTP.objects.create(
            email=email,
            otp=otp,
            expires_at=expires_at,
            resend_attempts=0
        )
        logger.info(f"New OTP created succesfully for {email} | Expires at: {expires_at}")
        
        return otp_obj
    
    @staticmethod
    def increment_resend_attempts(email: str):
        """Increment resend counter on latest OTP. Returns True if succesfull"""

        otp_obj = EmailOTPRepository.get_latest_by_email(email) 
        if not otp_obj:
            return False
        
        otp_obj.resend_attempts +=1

        otp_obj.save(update_fields=['resend_attempts'])
        logger.info(f"Resend attempts incremented for {email} -> {otp_obj.resend_attempts}")
        return True
    
    @staticmethod
    def delete_by_email(email: str):
        """Delete all OPT records for this email (useful after succesful verification)"""
        count,_ = EmailOTP.objects.filter(email__iexact=email.strip()).delete()
        if count>0:
            logger.info(f"Deleted {count} OTP records for {email} after succesfull use")

        return count
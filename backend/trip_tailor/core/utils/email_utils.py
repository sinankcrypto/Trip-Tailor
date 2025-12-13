from django.core.mail import send_mail

def send_email(subject, message, recipient_list):
    send_mail(
        subject= subject,
        message= message,
        from_email= "triptailor.boss@gmail.com",
        recipient_list= recipient_list,
        fail_silently= False,
    )

def send_otp_email(email, otp):
    subject = "Your Trip Tailor OTP"
    message = f"""
    Dear User,

    Thank you for signing up with Trip Tailor!

    To complete your verification process, please use the One-Time Password (OTP) below. 
    This code is valid for the next 10 minutes.

    🔒 Your OTP: {otp}

    Please do not share this code with anyone. Trip Tailor representatives will never ask 
    for your OTP or password.

    If you did not request this verification, please ignore this email.

    Best regards,  
    The Trip Tailor Team  
    support@triptailor.com  
    """
    send_email(subject, message, [email])

def send_booking_confirmation_email(booking):
    user = booking.user
    package = booking.package
    email = user.email

    subject = "Booking Confirmed - Trip Tailor"
    message = f"""
Hi {user.username},

Your booking for {package.title} is confirmed! 🎉
Trip Date: {booking.date}
Duration: {package.duration} days
Amount Paid: ₹{booking.amount}

Thank you for choosing Trip Tailor.
"""
    send_email(subject, message, [email])

def send_refund_success_email(
    *,
    user_email: str,
    user_name: str,
    package_name: str,
    amount: int,
):
    subject = "Your refund has been successfully processed"

    message = f"""
Hi {user_name},

Good news! 🎉

Your refund for the booking "{package_name}" has been successfully processed.

Refund details:
• Amount refunded: ₹{amount}

The refunded amount will be credited back to your original payment method.
Depending on your bank, it may take 5–7 business days to reflect.

If you have any questions, feel free to contact our support team.

Thank you for choosing Trip Tailor.

— Trip Tailor Team
""".strip()

    send_email(subject, message, [user_email])

def send_refund_failed_email(
    *,
    user_email: str,
    user_name: str,
    package_name: str,
    amount: int,
):
    subject = "Refund failed for your booking"

    message = f"""
Hi {user_name},

We’re sorry to inform you that the refund for your booking "{package_name}"
could not be processed successfully.

Refund details:
• Attempted amount: ₹{amount}

This may be due to a temporary issue with your bank or payment provider.
Our team has been notified and will review this shortly.

If the issue persists, please contact our support team.

Thank you for your patience.

— Trip Tailor Team
""".strip()

    send_email(subject, message, [user_email])

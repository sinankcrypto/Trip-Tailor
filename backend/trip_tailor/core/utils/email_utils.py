from django.core.mail import send_mail

def send_email(subject, message, recipient_list):
    send_mail(
        subject= subject,
        message= message,
        from_email= "triptailor.boss@gmail.com",
        recipient_list= recipient_list,
        fail_silently= False,
    )

def send_otp_email(email: str, otp: str, validity_minutes: int = 10):
    subject = "Your Trip Tailor OTP"
    message = f"""
Dear User,

Thank you for choosing Trip Tailor!

To proceed, please use the One-Time Password (OTP) below.
This OTP is valid for the next {validity_minutes} minutes.

🔒 Your OTP: {otp}

For your security:
• Do not share this OTP with anyone
• Trip Tailor staff will never ask for your OTP or password

If you did not request this, please ignore this email.

Best regards,
The Trip Tailor Team
support@triptailor.com
"""

    send_email(
        subject=subject,
        message=message,
        recipient_list=[email]
    )

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

def send_refund_initiated_email(
    *,
    user_email: str,
    user_name: str,
    package_name: str,
    amount: int,
):
    subject = "Refund initiated"

    message = f"""
Hi {user_name},

Your refund for the booking "{package_name}" has been initiated.

Refund Amount: ₹{amount}

The amount will be credited back to your original payment method within 3–7 business days.

We’ll notify you once the refund is completed.

– Trip Tailor Support
""".strip()
    
    send_email(subject, message, [user_email])

def send_agency_booking_notification_email(booking):
    agency = booking.package.agency
    package = booking.package
    user = booking.user

    email = agency.user.email  

    subject = "New Booking Received – Trip Tailor"
    message = f"""
Hi {agency.agency_name},

You have received a new booking on Trip Tailor 🎉

Booking Details:
- Booking ID: {booking.id}
- Package: {package.title}
- Travel Duration: {package.duration} days
- Price: ₹{booking.amount}

Customer Information:
- Name: {user.username}
- Email: {user.email}

Booking Date:
- {booking.created_at.strftime('%d %b %Y')}

Please review this booking and prepare accordingly.
You can manage this booking from your agency dashboard.

Thank you for partnering with Trip Tailor.

Best regards,
The Trip Tailor Team
support@triptailor.com
"""

    send_email(subject, message, [email])

def send_booking_cancellation_email(booking):
    user = booking.user
    package = booking.package
    email = user.email

    subject = "Booking Cancelled - Trip Tailor"
    message = f"""
Hi {user.username},

Your booking for {package.title} has been cancelled.

Booking Details:
Trip Date: {booking.date}
Duration: {package.duration} days
Amount: ₹{booking.amount}

If a refund is applicable, it will be processed as per our cancellation policy.

If you have any questions or believe this was a mistake, please contact our support team.

Thank you for choosing Trip Tailor.
"""
    send_email(subject, message, [email])

def send_agency_booking_cancellation_email(booking):
    agency = booking.package.agency
    user = booking.user
    package = booking.package
    email = agency.user.email

    subject = "Booking Cancelled - Trip Tailor"
    message = f"""
Hi {agency.agency_name},

A booking for your package "{package.title}" has been cancelled.

Booking Details:
Booking ID: {booking.id}
Customer Name: {user.username}
Trip Date: {booking.date}
Duration: {package.duration} days
Amount: ₹{booking.amount}

Please update your internal records accordingly.

If you have any questions or need assistance, feel free to reach out to the Trip Tailor support team.

Thank you for partnering with Trip Tailor.
"""
    send_email(subject, message, [email])

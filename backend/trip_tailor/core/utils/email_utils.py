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
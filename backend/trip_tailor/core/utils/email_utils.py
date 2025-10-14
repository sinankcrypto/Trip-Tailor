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
    message = f"Your OTP is: {otp}. Please verify to login to Trip Tailor."
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
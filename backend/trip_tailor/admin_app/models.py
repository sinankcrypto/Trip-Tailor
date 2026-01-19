from django.db import models

# Create your models here.

class PlatformFee(models.Model):
    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=10,
        help_text="Percentage of total amount charged as platform fee"
    )
    minimum_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=100.00,
        help_text="Minimum fee charged if percentage is lower."
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Platform Fee"
        verbose_name_plural = "Platform Fees"

    def __str__(self):
        return f"{self.percentage}% or ₹{self.minimum_fee} (whichever is higher)"
    
    def calculate_fee(self, amount):
        percentage_fee = (self.percentage/100)*amount
        return max(percentage_fee,self.minimum_fee)
    
    @classmethod
    def get_current_fee(cls):
        return cls.objects.first()

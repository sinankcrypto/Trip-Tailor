from enum import Enum

class PaymentMethod(str, Enum):
    ON_HAND = "ON_HAND"
    ONLINE = "ONLINE"

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"

class BookingStatus(str, Enum):
    ACTIVE = "ACTIVE"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"

class TransactionStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

def choices(enum_cls):
    """Convert Enum into Django choices tuple."""
    return [(item.value, item.name.title()) for item in enum_cls]
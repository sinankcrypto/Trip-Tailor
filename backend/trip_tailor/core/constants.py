from enum import StrEnum

def to_choices(enum_cls):
    return [(item.value, item.value.replace("_", " ").title()) for item in enum_cls]


class PaymentMethod(StrEnum):
    ON_HAND = "ON_HAND"
    ONLINE = "ONLINE"

    @classmethod
    def choices(cls):
        return to_choices(cls)


class PaymentStatus(StrEnum):
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    REFUND_PENDING = "REFUND_PENDING"
    REFUNDED = "REFUNDED"
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
    REFUND_FAILED = "REFUND_FAILED"

    @classmethod
    def choices(cls):
        return to_choices(cls)


class BookingStatus(StrEnum):
    ACTIVE = "ACTIVE"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"

    @classmethod
    def choices(cls):
        return to_choices(cls)


class TransactionStatus(StrEnum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

    @classmethod
    def choices(cls):
        return to_choices(cls)
    
class RefundStatus(StrEnum):
    PENDING = "PENDING"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"

    @classmethod
    def choices(cls):
        return to_choices(cls)
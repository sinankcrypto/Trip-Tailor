from dataclasses import dataclass
from typing import Optional

@dataclass
class UserProfileEntity:
    id: Optional[int]
    user_id: int
    first_name: str
    last_name: str
    place: Optional[str] = None
    profile_pic: Optional[str] = None

    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
    
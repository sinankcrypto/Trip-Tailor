from abc import ABC, abstractmethod

class AbstractProfileRepository(ABC):

    @abstractmethod
    def create_profile(self, user, data: dict): ...
    
    @abstractmethod
    def update_profile(self, user, data: dict): ...
    
    @abstractmethod
    def get_profile_by_user_id(self, user_id): ...
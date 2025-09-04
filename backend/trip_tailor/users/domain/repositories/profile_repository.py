from abc import ABC, abstractmethod

class AbstractProfileRepository(ABC):

    @abstractmethod
    def create_profile(self, user, data: dict): ...
    
    @abstractmethod
    def update_profile(self, user, data: dict): ...
    
    @abstractmethod
    def get_profile(self, user_id): ...
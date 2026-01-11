from recommendations.models import Interest

class InterestRepository:
    @staticmethod
    def get_all():
        return Interest.objects.all()
    
    @staticmethod
    def get_by_slugs(slugs):
        return Interest.objects.fiter(slug__in=slugs)
    
    @staticmethod
    def create(name:str):
        return Interest.objects.create(name=name)
    
    @staticmethod
    def bulk_create(names: list[str]):
        interests = [
            Interest(name=name)
            for name in names
        ]
        return Interest.objects.bulk_create(
            interests,
            ignore_conflicts=True
        )
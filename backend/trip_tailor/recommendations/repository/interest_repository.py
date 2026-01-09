from recommendations.models import Interest

class InterestRepository:
    @staticmethod
    def get_all():
        return Interest.objects.all()
    
    @staticmethod
    def get_by_slugs(slugs):
        return Interest.objects.fiter(slug__in=slugs)
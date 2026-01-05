from recommendations.models import Interest

class InterestRepository:
    def get_all(self):
        return Interest.objects.all()
    
    def get_by_slugs(self, slugs):
        return Interest.objects.fiter(slug__in=slugs)
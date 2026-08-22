from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ConcernViewSet, ProductViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("concerns", ConcernViewSet, basename="concern")
router.register("products", ProductViewSet, basename="product")

urlpatterns = router.urls
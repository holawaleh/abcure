from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ConcernViewSet, ProductViewSet,
    AdminCategoryViewSet, AdminProductViewSet, AdminProductImageViewSet,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("concerns", ConcernViewSet, basename="concern")
router.register("products", ProductViewSet, basename="product")

admin_router = DefaultRouter()
admin_router.register("categories", AdminCategoryViewSet, basename="admin-category")
admin_router.register("products", AdminProductViewSet, basename="admin-product")
admin_router.register("product-images", AdminProductImageViewSet, basename="admin-product-image")

urlpatterns = router.urls

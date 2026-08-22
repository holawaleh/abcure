from rest_framework import viewsets, filters, permissions, parsers
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Concern, Product, ProductImage
from .serializers import (
    CategorySerializer, ConcernSerializer,
    ProductListSerializer, ProductDetailSerializer,
    CategoryAdminSerializer, ProductAdminSerializer,
    ProductImageSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer


class ConcernViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Concern.objects.all()
    serializer_class = ConcernSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_published=True).select_related("category").prefetch_related("concerns", "images")
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__tradition", "category__slug", "form", "is_featured"]
    search_fields = ["name", "brief", "search_terms"]
    ordering_fields = ["price_kobo", "created_at"]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        page_size = self.request.query_params.get("page_size")
        if page_size:
            self.paginator.page_size = int(page_size)
        return queryset


class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategoryAdminSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related("category").prefetch_related("concerns", "images")
    serializer_class = ProductAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "is_published"]
    search_fields = ["name", "sku"]


class AdminProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

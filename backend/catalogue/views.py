from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Concern, Product
from .serializers import (
    CategorySerializer, ConcernSerializer,
    ProductListSerializer, ProductDetailSerializer,
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
    filterset_fields = ["category__tradition", "category__slug", "form"]
    search_fields = ["name", "brief", "search_terms"]
    ordering_fields = ["price_kobo", "created_at"]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductDetailSerializer
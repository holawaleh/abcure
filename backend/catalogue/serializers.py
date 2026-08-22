from rest_framework import serializers
from .models import Category, Concern, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "tradition"]


class ConcernSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concern
        fields = ["id", "name", "slug"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "order"]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight — for the catalogue grid, not the full detail page."""
    category = CategorySerializer(read_only=True)
    price_naira = serializers.ReadOnlyField()
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "brief", "strapline", "category",
                  "price_naira", "is_featured", "thumbnail"]

    def get_thumbnail(self, obj):
        first_image = obj.images.first()
        if first_image:
            request = self.context.get("request")
            url = first_image.image.url
            return request.build_absolute_uri(url) if request else url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full product page — everything from the content template."""
    category = CategorySerializer(read_only=True)
    concerns = ConcernSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    price_naira = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        exclude = ["price_kobo", "compare_at_price_kobo", "search_terms"]
        # price_kobo hidden on purpose — customers see price_naira, not raw kobo.
        # search_terms is internal, never shown on the page.
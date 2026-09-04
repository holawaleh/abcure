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
        fields = ["id", "product", "image", "alt_text", "order"]
        extra_kwargs = {"product": {"write_only": True}}


class ProductListSerializer(serializers.ModelSerializer):
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
    category = CategorySerializer(read_only=True)
    concerns = ConcernSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    price_naira = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        exclude = ["price_kobo", "compare_at_price_kobo", "search_terms"]


class CategoryAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "tradition", "is_active"]
        read_only_fields = ["slug"]


class ProductAdminSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    price_naira = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["slug", "created_at", "updated_at"]

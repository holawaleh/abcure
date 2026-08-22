from django.contrib import admin
from .models import Category, Concern, Product, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "tradition", "is_active")
    list_filter = ("tradition", "is_active")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Concern)
class ConcernAdmin(admin.ModelAdmin):
    list_display = ("name",)
    prepopulated_fields = {"slug": ("name",)}


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price_naira", "stock", "is_published", "is_low_stock")
    list_filter = ("category__tradition", "category", "is_published", "form")
    search_fields = ("name", "sku", "search_terms")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]
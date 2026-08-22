from django.db import models
from django.utils.text import slugify


class Tradition(models.TextChoices):
    CHRISTIAN = "christian", "Christian product"
    ISLAMIC = "islamic", "Islamic product"
    HERBAL = "herbal", "Herbal product"
    GENERAL = "general", "General product"


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=110, unique=True, blank=True)
    tradition = models.CharField(max_length=20, choices=Tradition.choices, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["tradition", "name"]

    def __str__(self):
        return f"{self.name} ({self.get_tradition_display()})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Concern(models.Model):
    name = models.CharField(max_length=60, unique=True)
    slug = models.SlugField(max_length=70, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
        
from django.core.validators import MinValueValidator


class Product(models.Model):
    class Form(models.TextChoices):
        SOAP = "soap", "Soap"
        OIL = "oil", "Oil"
        POWDER = "powder", "Powder"
        CAPSULE = "capsule", "Capsule"
        TEA = "tea", "Tea"
        CREAM = "cream", "Cream"
        LIQUID = "liquid", "Liquid"
        OTHER = "other", "Other"

    class SizeUnit(models.TextChoices):
        G = "g", "g"
        KG = "kg", "kg"
        ML = "ml", "ml"
        L = "l", "l"
        PIECE = "piece", "piece"

    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    concerns = models.ManyToManyField(Concern, blank=True, related_name="products")
    strapline = models.CharField(max_length=30, blank=True)
    form = models.CharField(max_length=20, choices=Form.choices)
    size_value = models.DecimalField(max_digits=8, decimal_places=2)
    size_unit = models.CharField(max_length=10, choices=SizeUnit.choices)

    brief = models.CharField(max_length=140)
    description = models.TextField()
    supports = models.CharField(max_length=200, blank=True)

    ingredients = models.TextField()
    how_to_use = models.TextField()
    precautions = models.TextField()
    storage = models.CharField(max_length=200, blank=True)
    origin = models.CharField(max_length=120, blank=True)
    method_note = models.CharField(max_length=200, blank=True)

    sku = models.CharField(max_length=40, unique=True)
    price_kobo = models.PositiveIntegerField(help_text="Price in kobo (₦1 = 100 kobo)")
    compare_at_price_kobo = models.PositiveIntegerField(null=True, blank=True)
    stock = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    low_stock_threshold = models.PositiveIntegerField(default=5)
    nafdac_number = models.CharField(max_length=40, blank=True)
    is_published = models.BooleanField(default=False, db_index=True)
    is_featured = models.BooleanField(default=False)

    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=300, blank=True)
    search_terms = models.CharField(max_length=300, blank=True)
    related_products = models.ManyToManyField("self", blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["category", "is_published"]),
            models.Index(fields=["is_published", "-created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.meta_title:
            self.meta_title = f"{self.name} — AB Cure"
        if not self.meta_description:
            self.meta_description = self.brief
        super().save(*args, **kwargs)

    @property
    def price_naira(self):
        return self.price_kobo / 100

    @property
    def is_low_stock(self):
        return self.stock <= self.low_stock_threshold


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/%Y/%m/")
    alt_text = models.CharField(max_length=200)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.product.name} — image {self.order}"
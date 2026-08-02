from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class RetailerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    business_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    display_password = models.CharField(max_length=255, blank=True, null=True) # For display as requested in original

    def __str__(self):
        return self.user.username

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Laptops', 'Laptops'),
        ('Desktop PCs', 'Desktop PCs'),
        ('Computer Accessories', 'Computer Accessories'),
        ('Networking', 'Networking'),
        ('Storage Devices', 'Storage Devices'),
        ('Service Items', 'Service Items'),
        ('General', 'General'),
    ]
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.FloatField()
    stock_quantity = models.IntegerField(default=0)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='General')
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Deal(models.Model):
    CATEGORY_CHOICES = [
        ('Laptops', 'Laptops'),
        ('Desktop PCs', 'Desktop PCs'),
        ('Computer Accessories', 'Computer Accessories'),
        ('Networking', 'Networking'),
        ('Storage Devices', 'Storage Devices'),
        ('Service Items', 'Service Items'),
        ('General', 'General'),
    ]
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='General')
    description = models.TextField()
    original_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_percentage = models.FloatField()
    valid_until = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]
    retailer = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    item_name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    total_amount = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.item_name}"

class Query(models.Model):
    retailer = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    item_name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=100)
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='Open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request {self.id} - {self.item_name}"

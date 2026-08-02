from rest_framework import serializers
from django.contrib.auth.models import User
from .models import RetailerProfile, Deal, Order, Query, Product

class RetailerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerProfile
        fields = ['business_name', 'phone', 'address', 'display_password']

class UserSerializer(serializers.ModelSerializer):
    profile = RetailerProfileSerializer()
    role = serializers.SerializerMethodField()
    business_name = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    display_password = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile', 'role', 'business_name', 'phone', 'address', 'display_password']

    def get_role(self, obj):
        return "ADMIN" if obj.is_staff else "RETAILER"

    def get_business_name(self, obj):
        return getattr(obj.profile, 'business_name', '') if hasattr(obj, 'profile') else ''

    def get_phone(self, obj):
        return getattr(obj.profile, 'phone', '') if hasattr(obj, 'profile') else ''

    def get_address(self, obj):
        return getattr(obj.profile, 'address', '') if hasattr(obj, 'profile') else ''

    def get_display_password(self, obj):
        return getattr(obj.profile, 'display_password', '') if hasattr(obj, 'profile') else ''

class UserCreateSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(required=False)
    phone = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'business_name', 'phone', 'address']

    def create(self, validated_data):
        profile_data = {
            'business_name': validated_data.pop('business_name', ''),
            'phone': validated_data.pop('phone', ''),
            'address': validated_data.pop('address', ''),
            'display_password': validated_data.get('password') # As per original requirements
        }
        user = User.objects.create_user(**validated_data)
        RetailerProfile.objects.create(user=user, **profile_data)
        return user

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    retailer_name = serializers.ReadOnlyField(source='retailer.username')
    product_details = ProductSerializer(source='product', read_only=True)
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['retailer', 'total_amount', 'status']

class QuerySerializer(serializers.ModelSerializer):
    retailer_name = serializers.ReadOnlyField(source='retailer.username')
    product_details = ProductSerializer(source='product', read_only=True)
    class Meta:
        model = Query
        fields = '__all__'
        read_only_fields = ['retailer', 'status']

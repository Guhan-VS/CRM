from django.shortcuts import render
from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import RetailerProfile, Deal, Order, Query, Product
from .serializers import (
    UserSerializer, UserCreateSerializer, DealSerializer, 
    OrderSerializer, QuerySerializer, ProductSerializer
)
from django.utils import timezone
from django.db.models import Sum
from django.shortcuts import redirect

def frontend_redirect(request):
    """Redirects port 8000 root to the Vite dev server during development."""
    return redirect('http://127.0.0.1:5173/')

# Custom Token View to match app.js
class CustomTokenObtainView(views.APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access_token': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Current User View
class UserMeView(views.APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        return User.objects.filter(is_staff=False)

    def perform_update(self, serializer):
        user = serializer.save()
        if 'password' in self.request.data:
            user.set_password(self.request.data['password'])
            user.save()
            profile = user.profile
            profile.display_password = self.request.data['password']
            profile.save()

# Product ViewSet
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

# Deal ViewSet
class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

# Order ViewSet
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(retailer=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(retailer=self.request.user)

# Query ViewSet
class QueryViewSet(viewsets.ModelViewSet):
    queryset = Query.objects.all()
    serializer_class = QuerySerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Query.objects.all().order_by('-created_at')
        return Query.objects.filter(retailer=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(retailer=self.request.user)

# Approve Query View
class ApproveQueryView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            query_obj = Query.objects.get(pk=pk)
            action = request.data.get('action', 'approve')
            
            if action == 'reject':
                query_obj.status = 'Rejected'
                query_obj.save()
                return Response({'status': 'rejected'})
            
            # Automatically find matching deal for price
            from .models import Deal
            matching_deal = Deal.objects.filter(title__icontains=query_obj.item_name).first()
            price = matching_deal.discounted_price if matching_deal else 0
            
            # Create order from query
            qty_str = str(query_obj.quantity).split()[0]
            try:
                qty = int(qty_str)
            except:
                qty = 0

            Order.objects.create(
                retailer=query_obj.retailer,
                product=query_obj.product,
                item_name=query_obj.item_name,
                quantity=qty,
                total_amount=qty * float(price),
                status='Pending'
            )
            
            query_obj.status = 'Approved'
            query_obj.save()
            
            return Response({'status': 'approved'})
        except Query.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

# Analytics View
class AnalyticsView(views.APIView):
    def get(self, request):
        timeframe = request.GET.get('timeframe', 'year')
        now = timezone.now()
        target_year = int(request.GET.get('year', now.year))
        target_month = int(request.GET.get('month', now.month))
        
        if request.user.is_staff:
            orders = Order.objects.select_related('retailer').all()
        else:
            orders = Order.objects.select_related('retailer').filter(retailer=request.user)
            
        if timeframe == 'year':
            orders = orders.filter(created_at__year=target_year)
        elif timeframe == 'month':
            orders = orders.filter(created_at__year=target_year, created_at__month=target_month)
        
        total_sales = orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        order_count = orders.count()
        
        data_by_time_outlet = {}
        raw_times = set()
        
        for order in orders:
            if timeframe == 'year':
                time_val = order.created_at.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                time_label = order.created_at.strftime("%Y-%b")
            else:
                time_val = order.created_at.replace(hour=0, minute=0, second=0, microsecond=0)
                time_label = order.created_at.strftime("%b %d")
                
            raw_times.add(time_val)
            outlet = order.retailer.username
            
            if outlet not in data_by_time_outlet:
                data_by_time_outlet[outlet] = {}
            data_by_time_outlet[outlet][time_label] = data_by_time_outlet[outlet].get(time_label, 0) + order.total_amount
            
        sorted_times_dt = sorted(list(raw_times))
        if timeframe == 'year':
            time_labels = [dt.strftime("%Y-%b") for dt in sorted_times_dt]
        else:
            time_labels = [dt.strftime("%b %d") for dt in sorted_times_dt]
        
        outlets_data = {}
        for outlet, t_data in data_by_time_outlet.items():
            outlets_data[outlet] = []
            for t_label in time_labels:
                outlets_data[outlet].append(t_data.get(t_label, 0))
            
        return Response({
            'total_sales': total_sales,
            'order_count': order_count,
            'labels': time_labels,
            'outlets': outlets_data
        })

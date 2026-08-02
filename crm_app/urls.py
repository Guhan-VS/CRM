from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter(trailing_slash=False)
router.register(r'users', views.UserViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'deals', views.DealViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'queries', views.QueryViewSet)

urlpatterns = [
    path('', views.frontend_redirect, name='frontend_redirect'),
    path('api/token', views.CustomTokenObtainView.as_view(), name='token_obtain'),
    path('api/users/me', views.UserMeView.as_view(), name='user_me'),
    path('api/queries/<int:pk>/approve', views.ApproveQueryView.as_view(), name='approve_query'),
    path('api/analytics', views.AnalyticsView.as_view(), name='analytics'),
    path('api/', include(router.urls)),
]

from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from . import views
urlpatterns = [
    path("register/", views.Register.as_view(), name='register'),
    path("login/", views.Login.as_view(), name='login'),
    path("edit_user_details/<int:pk>", views.edit_user_details.as_view(), name='edit_user_details'),
    path("logout/", views.Logout, name='logout'),
    path("show_post/", views.show_post.as_view(), name='show_post'),
    path("get_user_details/", views.get_user_details.as_view(), name='get_user_details'),

    path('api/token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

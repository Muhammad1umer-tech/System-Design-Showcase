from django.urls import path
from . import views  
urlpatterns = [
    path('home/', views.home.as_view(), name ='home'),
    path('test/', views.GoogleAuth.as_view(), name ='test'),
]

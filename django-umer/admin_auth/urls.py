from django.urls import path
from . import views

urlpatterns = [
    # path("register/", views.Register.as_view()),
    path("login/", views.Login.as_view()),
    # path("edit_user_details/<int:pk>", views.edit_user_details.as_view()),
    # path("logout/", views.Logout),
]

from django.apps import AppConfig


class GoogleAuthConfig(AppConfig):
    """
    AppConfig for the google_auth app (Google OAuth login/signup).
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'google_auth'

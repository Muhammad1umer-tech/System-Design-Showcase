from django.apps import AppConfig


class AdminAuthConfig(AppConfig):
    """
    AppConfig for the admin_auth app (login for admins/creators/editors on the admin dashboard).
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'admin_auth'

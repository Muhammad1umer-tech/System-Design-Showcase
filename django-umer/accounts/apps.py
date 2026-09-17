from django.apps import AppConfig


class AccountsConfig(AppConfig):
    """
    AppConfig for the accounts app (register/login/logout, JWT tokens).
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

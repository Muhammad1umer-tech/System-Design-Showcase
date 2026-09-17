"""
app.py
"""
from django.apps import AppConfig
class CoreConfig(AppConfig):
    """
    Configuration class for the core application.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        """
        Method called when the application is ready.
        """
        import core.signals

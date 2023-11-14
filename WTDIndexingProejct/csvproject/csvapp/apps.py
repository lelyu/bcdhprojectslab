from django.apps import AppConfig


class CsvappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'csvapp'

class dataConfig(AppConfig):
    name = 'csvapp'
    def ready(self):
        from . import views
        views.load_data_into_memory()
from django.urls import path
from .views import chat, floats_nearby

urlpatterns = [
    path("chat/", chat),
    path("floats/", floats_nearby),
]

from django.db import models

class ChatMessage(models.Model):
    session_id = models.CharField(max_length=64)
    role = models.CharField(max_length=10)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

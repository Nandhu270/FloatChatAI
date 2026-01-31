from django.apps import AppConfig
from vectorstore.bootstrap import bootstrap_rag
bootstrap_rag()

class ChatConfig(AppConfig):
    name = 'chat'

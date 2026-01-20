from rest_framework import serializers
from .models import ArgoProfile

class ArgoProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArgoProfile
        fields = "__all__"

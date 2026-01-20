from django.db import models

class ArgoProfile(models.Model):
    float_id = models.CharField(max_length=50)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField()

    depth = models.FloatField()
    temperature = models.FloatField()
    salinity = models.FloatField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["float_id"]),
            models.Index(fields=["timestamp"]),
        ]

    def __str__(self):
        return f"{self.float_id} | {self.timestamp}"

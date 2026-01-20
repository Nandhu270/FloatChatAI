from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ArgoProfile
from rag.rag_pipeline import run_rag

@api_view(["POST"])
def chat(request):
    question = request.data.get("message")
    result = run_rag(question)

    return Response({
        "answer": result["answer"],
        "sql": result["sql"],
        "data": result["rows"],
    })

@api_view(["GET"])
def floats_nearby(request):
    lat = float(request.GET.get("lat"))
    lon = float(request.GET.get("lon"))

    qs = ArgoProfile.objects.filter(
        latitude__range=(lat - 2, lat + 2),
        longitude__range=(lon - 2, lon + 2)
    )[:50]

    return Response(list(qs.values()))

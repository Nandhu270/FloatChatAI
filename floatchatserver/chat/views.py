import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from chat.services.interaction import process_interaction


@csrf_exempt
def chat_api(request):
    try:
        data = json.loads(request.body)
        message = data.get("message")

        if not message:
            return JsonResponse(
                {"reply": "Message is required."},
                status=400
            )

        response = process_interaction(message)
        return JsonResponse(response)

    except Exception:
        import traceback
        traceback.print_exc()
        return JsonResponse(
            {"reply": "Internal server error."},
            status=500
        )

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from api.serializers import ResumeSerializer
from api.renderers import ResumeRenderer
from api.models import Resume

from api.models import STATE_CHOICE

class ResumeView(APIView):

    renderer_classes = [ResumeRenderer]

    def post(self, request, format=None):
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'uploaded','status':'success','candidate':serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        candidate = Resume.objects.all()
        states = STATE_CHOICE
        serializer = ResumeSerializer(candidate, many=True)
        return Response({'status':'success','states':states,'candidate':serializer.data}, status=status.HTTP_200_OK)

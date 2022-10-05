from rest_framework import serializers
from api.models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id','name','email','dob','state','gender','location','userimage','userdoc']

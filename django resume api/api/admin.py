from django.contrib import admin
from api.models import Resume

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['id','name','email','dob','state','gender','location','userimage','userdoc']

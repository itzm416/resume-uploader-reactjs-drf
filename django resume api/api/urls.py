from django.urls import path
from api.views import ResumeView

urlpatterns = [
    path('upload/', ResumeView.as_view(), name='upload'),
    path('list/', ResumeView.as_view(), name='list'),
]

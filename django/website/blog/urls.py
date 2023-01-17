from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('get-a-quote/', views.get_a_quote, name='get-a-quote')
]
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('get-a-quote/', views.get_a_quote, name='get-a-quote'),
    path('contact', views.contact, name='contact'),
    path('partners/sign-up', views.partners_sign_up, name='partners-sign-up')
]
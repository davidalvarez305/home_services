from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('get-a-quote/', views.get_a_quote, name='get-a-quote'),
    path('contact', views.contact, name='contact'),
    path('partners/work-with-us', views.work_with_us, name='work-with-us'),
    path('about', views.about, name='about'),
    path('lp/<service:slug>', views.lp, name='lp')
]
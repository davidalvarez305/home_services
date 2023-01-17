from datetime import date
import os
from django.shortcuts import render

# Environment Variables
DOMAIN = str(os.environ.get('DOMAIN'))
SITE_NAME = str(os.environ.get('SITE_NAME'))
CURRENT_YEAR = date.today().year

def home(request):
    return render(request, 'blog/service.html')

def get_a_quote(request):
    return render(request, 'blog/get-a-quote.html')

def contact(request):
    return render(request, 'blog/contact.html')

def  partners_sign_up(request):
    return render(request, 'blog/partners-sign-up.html')
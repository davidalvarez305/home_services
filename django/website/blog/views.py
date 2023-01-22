from datetime import date
import os
from django.shortcuts import render
from blog.models import LandingPage

# Environment Variables
DOMAIN = str(os.environ.get('DOMAIN'))
SITE_NAME = str(os.environ.get('SITE_NAME'))
CURRENT_YEAR = date.today().year
CRM_DOMAIN = str(os.environ.get('CRM_DOMAIN'))

def home(request):
    context = {
        "domain": DOMAIN,
        "crm_domain": CRM_DOMAIN,
        "current_year": CURRENT_YEAR,
        "site_name": SITE_NAME
    }
    return render(request, 'blog/service.html', context)

def get_a_quote(request):
    context = {
        "domain": DOMAIN,
        "crm_domain": CRM_DOMAIN,
        "current_year": CURRENT_YEAR,
        "site_name": SITE_NAME
    }
    return render(request, 'blog/get-a-quote.html', context)

def contact(request):
    context = {
        "domain": DOMAIN,
        "crm_domain": CRM_DOMAIN,
        "current_year": CURRENT_YEAR,
        "site_name": SITE_NAME
    }
    return render(request, 'blog/contact.html', context)

def  work_with_us(request):
    context = {
        "domain": DOMAIN,
        "crm_domain": CRM_DOMAIN,
        "current_year": CURRENT_YEAR,
        "site_name": SITE_NAME
    }
    return render(request, 'blog/work-with-us.html', context)

def about(request):
    context = {
        "domain": DOMAIN,
        "crm_domain": CRM_DOMAIN,
        "current_year": CURRENT_YEAR,
        "site_name": SITE_NAME
    }
    return render(request, 'blog/about.html', context)

def lp(request, **kwargs):
    slug = kwargs['service']
    print('request: ', request.GET.dict())

    content = LandingPage.objects.get(slug=slug)

    context = {
        "domain": DOMAIN,
        "crm_domain": CRM_DOMAIN,
        "current_year": CURRENT_YEAR,
        "site_name": SITE_NAME,
        "content": content
    }
    return render(request, 'blog/lp.html', context)
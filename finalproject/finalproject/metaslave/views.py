from django.shortcuts import render, HttpResponse, HttpResponseRedirect, reverse
from django.utils.html import escape
from django.http import JsonResponse
import datetime
from django.contrib.auth.decorators import login_required

import simplejson as json
from .forms import *
from django.contrib.auth import authenticate, login

# Create your views here.
def index(request):
    context = {
        'page_name':"Home",
    }
    return render(request, 'home.html', context)

def register(request):
    if request.method=='POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            user = authenticate(username=form.cleaned_data.get('username'), password=form.cleaned_data.get('password1'))
            print(login(request, user))
            return HttpResponseRedirect('/')

    else:
        form = RegisterForm()
    context = {
        'form':form
    }
    return render(request,'register.html',context)

@login_required(login_url="/login")
def gamestart(request):
    context = {
        'page_name':"Metaslave"
    }
    return render(request,'gamestart.html', context)

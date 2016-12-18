from django.shortcuts import render, HttpResponse, HttpResponseRedirect, reverse
from django.utils.html import escape
from django.http import JsonResponse
import datetime
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers

import simplejson as json
from .forms import *
from django.contrib.auth import authenticate, login
from .models import GameSave

# Create your views here.
@login_required(login_url="/login/")
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

@csrf_exempt
def gamesave(request):
    #data= request.POST.get('data')
    data = request.POST
    #data = json.loads(data)
    #print(data)
    try:
        save = GameSave.objects.create(
            user = request.user,
            name = data['name'],
            x_position = int(data['x_position']),
            y_position = int(data['y_position']),
            currentGameMap = int(data['currentGameMap'])
        )
        #save.save()
        response = {
            'status': 1,
            'message': 'Game saved successfully'
        }
        return HttpResponse(response, content_type='application/json')

    except Exception as e:

         # Something went wrong
         response = {
             'status': 0,
             'message': 'Something went wrong - ' +str(e)
         }
         print(response)
    return HttpResponse(response)

def savedata(request):
    if request.method == 'GET':
        objects = GameSave.objects.filter(user=request.user)[:3]
        data = [ob.as_json() for ob in objects]
        response = {
            'status': 1,
            'data' : data
        }
        #print(data)
    else:
        response = {
            'status': 0,
            'data' : {}
        }
    #print(response)
    return HttpResponse(json.dumps(response), content_type='application/json')

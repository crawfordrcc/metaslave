from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$',views.index, name='index'),
    url(r'register$',views.register,name='register'),
    url(r'gamestart$',views.gamestart,name='gamestart'),
    url(r'game/save/?$', views.gamesave, name='gamesave'),
]

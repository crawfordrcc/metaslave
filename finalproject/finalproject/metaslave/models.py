from django.db import models

from django.contrib.auth.models import User

class Player(models.Model):
    name=models.CharField(max_length=16)
    level=models.IntegerField(default=1)
    attack=models.IntegerField(default=5)
    defense=models.IntegerField(default=5)
    hp=models.IntegerField(default=20)
    money=models.IntegerField(default=100)
    user=models.ForeignKey(User, on_delete=models.CASCADE)

class Inventory(models.Model):
    player=models.ForeignKey(Player, on_delete=models.CASCADE)

class Item(models.Model):
    name=models.CharField(max_length=16)
    description=models.CharField(max_length=32)
    effect=models.IntegerField()
    value=models.IntegerField()

class ItemInstance(models.Model):
    item=models.ForeignKey(Item, on_delete=models.CASCADE)
    inventory=models.ForeignKey(Inventory, on_delete=models.CASCADE)




# Create your models here.

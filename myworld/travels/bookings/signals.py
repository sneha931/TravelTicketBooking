from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Bus,Seats

@receiver(post_save,sender=Bus)
def create_seats(sender,instance,created,**kwargs):
    if created:
        for i in range(1,instance.number_seats+1):
            Seats.objects.create(bus=instance,seat_number=f"S{i}")
from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Bus(models.Model):
    bus_name=models.CharField(max_length=100)
    bus_number=models.CharField(max_length=20,unique=True)
    start=models.CharField(max_length=50)
    destination=models.CharField(max_length=50)
    features=models.TextField()
    start_time=models.TimeField()
    reach_time=models.TimeField()
    number_seats=models.PositiveBigIntegerField()
    price=models.DecimalField(max_digits=10,decimal_places=2 )
    
    def __str__(self):
        return f"{self.bus_name} ({self.bus_number}) from {self.start} to {self.destination}"

class Seats(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=10)
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"Seat {self.seat_number} on {self.bus}"


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bus=models.ForeignKey(Bus, on_delete=models.CASCADE)    
    seat = models.ForeignKey(Seats, on_delete=models.CASCADE)
    booking_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} booked {self.seat.seat_number} --{self.bus.start}--{self.bus.destination}"
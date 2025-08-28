from rest_framework import serializers
from . models import Bus,Seats,Booking
from django.contrib.auth.models import User

class UserRegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)

    class Meta:
        model=User
        fields=['username','email','password']


    def create(self,validate_data):
        user=User.objects.create_user(
            username=validate_data['username'],
            email=validate_data['email'],
            password=validate_data['password']
        )
        return user
class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seats
        fields = ['id', 'seat_number', 'is_booked', 'bus']


class BusSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True)
    available_seats = serializers.SerializerMethodField()
    
    class Meta:
        model = Bus
        fields = '__all__'
    
    def get_available_seats(self, obj):
        # Count seats that are not booked
        return obj.seats.filter(is_booked=False).count()



class BookingSerializer(serializers.ModelSerializer):
    bus=BusSerializer()
    seat=SeatSerializer()
    user=serializers.StringRelatedField()
    origin=serializers.CharField(source='bus.start', read_only=True)
    destination=serializers.CharField(source='bus.destination', read_only=True)
    price=serializers.DecimalField(source='bus.price', max_digits=10, decimal_places=2, read_only=True)
    booking_time=serializers.DateTimeField(source='booking_date', read_only=True)
    
    class Meta:
        model=Booking
        fields=['id', 'user', 'bus', 'seat', 'origin', 'destination', 'price', 'booking_time']
        read_only_fields=['user','booking_time','bus','seat']

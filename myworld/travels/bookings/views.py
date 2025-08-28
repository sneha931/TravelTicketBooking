from django.shortcuts import render
from .serializers import UserRegisterSerializer,BusSerializer,BookingSerializer,SeatSerializer
# Create your views here.

from django.contrib.auth import authenticate,login,logout 
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token 
from rest_framework import status,generics
from rest_framework.views import APIView 
from rest_framework.response import Response
from . models import Bus,Seats,Booking

class RegisterView(APIView):
    def post(self,request):
        serializer=UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            token,created=Token.objects.get_or_create(user=user)
            return Response({'token':token.key},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self,request):
        username=request.data.get('username')
        password=request.data.get('password')
        user=authenticate(request,username=username,password=password)
        if user:
            token,created=Token.objects.get_or_create(user=user)
            return Response({'token':token.key,'user_id':user.id},status=status.HTTP_201_CREATED)
        return Response({'error':'Invalid Credentials'},status=status.HTTP_401_UNAUTHORIZED)
    
class BusListCreateView(generics.ListCreateAPIView):
    queryset=Bus.objects.all()
    serializer_class=BusSerializer

class BusDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=Bus.objects.all()
    serializer_class=BusSerializer

class BookingListView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        seat_id=request.data.get('seat')
        try:
            seat=Seats.objects.get(id=seat_id)
            if seat.is_booked:
                return Response({'error':'Seat already booked'},status=status.HTTP_400_BAD_REQUEST)
            seat.is_booked=True
            seat.save()
            bookings=Booking.objects.create(user=request.user, bus=seat.bus,seat=seat)
            serializer=BookingSerializer(bookings)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        except Seats.DoesNotExist:
            return Response({'error':'Seat does not exist'},status=status.HTTP_400_BAD_REQUEST)
        
class UserBookingView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,user_id):
        if request.user.id != user_id:
            return Response({"error":"Unauthorized"},status=status.HTTP_401_UNAUTHORIZED)
        bookings=Booking.objects.filter(user_id=user_id)
        serializer=BookingSerializer(bookings,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class SeatSelectionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, bus_id):
        """Get all seats for a specific bus with their status"""
        try:
            bus = Bus.objects.get(id=bus_id)
            seats = Seats.objects.filter(bus=bus).order_by('seat_number')
            
            # If no seats exist, create them automatically
            if not seats.exists():
                seats = self._create_seats_for_bus(bus)
            
            seat_data = []
            for seat in seats:
                seat_data.append({
                    'id': seat.id,
                    'seat_number': seat.seat_number,
                    'is_booked': seat.is_booked,
                    'is_selected': False  # Will be managed on frontend
                })
            
            return Response({
                'bus': {
                    'id': bus.id,
                    'bus_name': bus.bus_name,
                    'bus_number': bus.bus_number,
                    'start': bus.start,
                    'destination': bus.destination,
                    'start_time': bus.start_time,
                    'reach_time': bus.reach_time,
                    'price': bus.price,
                    'features': bus.features
                },
                'seats': seat_data,
                'total_seats': len(seat_data),
                'available_seats': len([s for s in seat_data if not s['is_booked']])
            })
        except Bus.DoesNotExist:
            return Response({'error': 'Bus not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def _create_seats_for_bus(self, bus):
        """Create seats for a bus if they don't exist"""
        seats = []
        # Create 20 seats (2 columns × 10 rows as per the image)
        for i in range(1, 21):
            seat_number = f"{i:02d}"  # 01, 02, 03, etc.
            seat, created = Seats.objects.get_or_create(
                bus=bus,
                seat_number=seat_number,
                defaults={'is_booked': False}
            )
            seats.append(seat)
        return seats
    


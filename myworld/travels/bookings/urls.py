
from django.urls import path
from .views import RegisterView,LoginView,BusListCreateView,BusDetailView,BookingListView,UserBookingView,SeatSelectionView   

urlpatterns = [
    path('buses/', BusListCreateView.as_view(), name='bus-list-create'),
    path('register/',RegisterView.as_view(),name='register'),
    path('login/',LoginView.as_view(),name='login'),
    path('bookings/',BookingListView.as_view(),name='booking-list' ),
    path('userbooking/<int:user_id>/',UserBookingView.as_view(),name='user-booking' ),
    path('buses/<int:pk>/',BusDetailView.as_view(),name='bus-detail'),
    path('seats/<int:bus_id>/',SeatSelectionView.as_view(),name='seat-selection'),
]

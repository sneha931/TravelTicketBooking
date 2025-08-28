import React, { useEffect, useState } from 'react';

const UserBookings = ({ token, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !userId) {
      console.log('Missing token or userId:', { token: !!token, userId: !!userId });
      setLoading(false);
      return;
    }

    console.log('Fetching bookings for user:', userId);
    console.log('Using token:', token);

    fetch(`https://travelticketbooking.onrender.com/api/userbooking/${userId}/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Bookings Data:', data);
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching bookings:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [token, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Bookings</div>
        <div className="text-gray-600">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Bookings</h1>
        <p className="text-gray-600">Manage and track all your bus reservations</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Found</h3>
          <p className="text-gray-500">You haven't made any bus reservations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {booking.bus ? booking.bus.bus_name : 'Bus Name N/A'}
                    </h3>
                    <p className="text-indigo-100 text-sm">
                      Bus No: {booking.bus ? booking.bus.bus_number : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Route Information */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center flex-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">From</p>
                      <p className="font-semibold text-gray-800">{booking.origin || 'N/A'}</p>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="w-16 h-px bg-gray-300 relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">To</p>
                      <p className="font-semibold text-gray-800">{booking.destination || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      Seat Number
                    </span>
                    <span className="font-semibold text-gray-800">
                      {booking.seat ? booking.seat.seat_number : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                      Price
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      ₹{booking.price || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Booked On
                    </span>
                    <span className="font-medium text-gray-800 text-sm">
                      {new Date(booking.booking_time).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    onClick={() => console.log(`Proceeding to payment for booking ${booking.id}`)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                    Pay Now
                  </button>
                  <button
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => console.log(`View details for booking ${booking.id}`)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;

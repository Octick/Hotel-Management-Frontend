// app/dashboard/customer/ExploreRooms/page.tsx
"use client";

import { useState, useEffect } from "react";
import CustomerLayout from "../../../components/layout/CustomerLayout";
import NewBookingModal from "../NewBooking/NewBookingModal";
import { auth } from "@/app/lib/firebase";

export default function ExploreRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Fetch Rooms from Backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : "";
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        
        // Fetch only available rooms
        const response = await fetch(`${API_URL}/api/rooms?status=Available`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            setRooms(data);
        } else {
            console.error("Failed to fetch rooms");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for auth to be ready
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) fetchRooms();
    });
    return () => unsubscribe();
  }, []);

  const handleBookNow = (room: any) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleBookingComplete = () => {
    setIsBookingModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <CustomerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Explore Our Rooms</h1>

        {loading ? (
          <div className="text-center py-12">Loading rooms...</div>
        ) : rooms.length === 0 ? (
           <div className="text-center py-12 text-gray-500">No rooms available right now.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-blue-50 flex items-center justify-center">
                    <span className="text-blue-200 text-4xl font-bold">{room.roomNumber}</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Room {room.roomNumber}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{room.status}</span>
                  </div>
                  <p className="text-gray-600 capitalize mb-4">{room.type} Room</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-gray-900">${room.rate}<span className="text-sm font-normal text-gray-500">/night</span></span>
                    <button
                      onClick={() => handleBookNow(room)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isBookingModalOpen && (
          <NewBookingModal
            onClose={() => setIsBookingModalOpen(false)}
            onComplete={handleBookingComplete}
            selectedRoom={selectedRoom} // Pass the selected room!
          />
        )}
      </div>
    </CustomerLayout>
  );
}
"use client";

import { useState, useEffect, useContext } from "react";
import CustomerLayout from "../../components/layout/CustomerLayout";
import { Calendar, CheckCircle, Star, Plus, Bed, Loader2 } from "lucide-react";
import NewBookingModal from "./NewBooking/NewBookingModal";
import { AuthContext } from "@/app/context/AuthContext";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  rate: number;
}

interface Booking {
  _id: string;
  roomId: Room | string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;
}

// Helper functions
const getBookingStatus = (status: string) => {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case "confirmed":
      return {
        text: "Confirmed",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      };
    case "pending":
      return {
        text: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: Calendar,
      };
    case "checkedout":
    case "checked-out":
      return {
        text: "Completed",
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
      };
    case "checkedin":
    case "checked-in":
      return {
        text: "Checked In",
        color: "bg-purple-100 text-purple-800",
        icon: CheckCircle,
      };
    default:
      return {
        text: status,
        color: "bg-gray-100 text-gray-800",
        icon: Calendar,
      };
  }
};

const getRoomTypeIcon = (type: string) => {
  const normalized = type?.toLowerCase() || "";
  if (normalized.includes("suite") || normalized.includes("deluxe")) {
    return <Star className="h-4 w-4 text-blue-600" />;
  }
  return <Bed className="h-4 w-4 text-blue-600" />;
};

export default function CustomerDashboard() {
  const { user, profile, token } = useContext(AuthContext);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const handleNewBooking = () => {
    setIsBookingModalOpen(true);
  };

  const handleBookingComplete = () => {
    setIsBookingModalOpen(false);
    // Refresh bookings after creating a new one
    fetchBookings();
    toast.success("Booking created successfully!");
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {profile?.name || user?.displayName || "Guest"}!
            </h2>
            <p className="text-blue-100">
              Manage your bookings and explore our services
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {bookings.length}
              </div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {bookings.filter((b) => b.status.toLowerCase() === "checkedout" || b.status.toLowerCase() === "checked-out").length}
              </div>
              <div className="text-sm text-gray-600">Completed Stays</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Bookings
              </h3>
              <button
                onClick={handleNewBooking}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </button>
            </div>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No bookings yet. Create your first booking!</p>
                </div>
              ) : (
                bookings.slice(0, 3).map((booking) => {
                  const room = typeof booking.roomId === 'object' ? booking.roomId : null;
                  const status = getBookingStatus(booking.status);
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={booking._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getRoomTypeIcon(room?.type || "standard")}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {room
                                ? `Room ${room.roomNumber}`
                                : `Booking #${booking._id.slice(-6)}`}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                              {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.text}
                          </span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            ${booking.totalAmount}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* New Booking Modal */}
        {isBookingModalOpen && (
          <NewBookingModal
            onClose={() => setIsBookingModalOpen(false)}
            onComplete={handleBookingComplete}
          />
        )}
      </div>
    </CustomerLayout>
  );
}

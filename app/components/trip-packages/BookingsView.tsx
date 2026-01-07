"use client";

import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { format } from "date-fns";

export default function BookingsView() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const fetchBookings = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/trips/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setBookings(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Listen for refresh events (from parent modal add)
    const handleRefresh = () => fetchBookings();
    window.addEventListener("refreshTripBookings", handleRefresh);
    return () => window.removeEventListener("refreshTripBookings", handleRefresh);
  }, []);

  // Calculate Real Stats
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'Pending' || b.status === 'Requested').length;
  const confirmed = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Approved').length;
  const completed = bookings.filter(b => b.status === 'Completed').length;

  const stats = [
    { label: "Total Bookings", value: total.toString() },
    { label: "Pending", value: pending.toString() },
    { label: "Confirmed", value: confirmed.toString() },
    { label: "Completed", value: completed.toString() }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
      case "Requested":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if(loading) return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Trip Bookings</h3>
        {bookings.length === 0 ? (
             <div className="p-6 border border-dashed rounded-lg text-center text-gray-500 bg-gray-50">
                 No bookings found.
             </div>
        ) : (
            bookings.map((booking) => (
            <div key={booking._id} className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                        {booking.packageName || "Custom Trip"} 
                        {booking.packageId?.name && ` - ${booking.packageId.name}`}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium text-gray-900">{booking.requestedBy?.name}</span> • 
                        {booking.location || booking.packageId?.location} • 
                        {booking.participants} participant{booking.participants > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Date: {booking.tripDate ? format(new Date(booking.tripDate), 'PPP') : 'Date not set'}
                    </p>
                </div>
                <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                    </span>
                    <div className="text-lg font-bold text-gray-900 mt-2">
                        ${booking.totalPrice?.toLocaleString()}
                    </div>
                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
}
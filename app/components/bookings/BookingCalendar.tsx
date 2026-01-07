"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

// Redefined locally to avoid circular dependencies
export interface Booking {
  id: string;
  guestId: { name: string; email: string } | string;
  roomId: { roomNumber: string; type: string } | string;
  checkIn: string;
  checkOut: string;
  status: 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled' | string;
  source: string;
  totalAmount: number;
}

interface BookingCalendarProps {
  bookings: Booking[];
  onDateClick?: (date: Date) => void;
  onBookingClick?: (booking: Booking | any) => void;
}

export default function BookingCalendar({
  bookings,
  onDateClick,
  onBookingClick
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/50 border border-gray-100" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const dayBookings = bookings.filter(b => {
        // Ensure strictly date part comparison
        const bDate = new Date(b.checkIn).toISOString().split('T')[0];
        return bDate === dateStr;
      });

      days.push(
        <div 
          key={day} 
          onClick={() => onDateClick?.(new Date(currentYear, currentMonth, day))}
          className="h-32 border border-gray-100 bg-white p-2 transition-colors hover:bg-gray-50 cursor-pointer overflow-y-auto"
        >
          <div className="text-sm font-medium text-gray-700 mb-1">{day}</div>
          <div className="space-y-1">
            {dayBookings.map(booking => {
              let colorClass = "bg-blue-100 text-blue-700 border-blue-200";
              if (booking.status === 'Confirmed') colorClass = "bg-green-100 text-green-700 border-green-200";
              if (booking.status === 'CheckedIn') colorClass = "bg-purple-100 text-purple-700 border-purple-200";
              if (booking.status === 'CheckedOut') colorClass = "bg-gray-100 text-gray-700 border-gray-200";
              if (booking.status === 'Cancelled') colorClass = "bg-red-100 text-red-700 border-red-200";
              if (booking.status === 'Pending') colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";

              const guestName = typeof booking.guestId === 'object' && booking.guestId !== null 
                ? booking.guestId.name 
                : "Guest";

              return (
                <div 
                  key={booking.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookingClick?.(booking);
                  }}
                  className={`text-xs p-1.5 rounded border ${colorClass} truncate cursor-pointer shadow-sm`}
                >
                  {guestName}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 bg-gray-50 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 bg-gray-200 gap-px">
        {generateCalendarDays()}
      </div>
    </div>
  );
}
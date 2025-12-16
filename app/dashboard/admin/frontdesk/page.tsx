"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import AdminReceptionistLayout from "../../../components/layout/AdminReceptionistLayout";
import FrontDeskModal from "../../../components/frontdesk/frontdeskmodel";

type Status = "due-in" | "checked-out" | "due-out" | "checked-in" | "all";

interface GuestBooking {
  id: string;
  name: string;
  roomNumber: string;
  status: Status;
  startDate: Date;
  endDate: Date;
  colorClass: string;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function FrontDeskPage() {
  const [activeTab, setActiveTab] = useState<Status>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [guestBookings, setGuestBookings] = useState<GuestBooking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date();

  // Add API endpoint here
  const API = "/api/front-desk/bookings";
  // mock data - remove when API is add
  useEffect(() => {
    /*
    const fetchGuestBookings = async () => {
      try {
        const response = await fetch(API);
        if (response.ok) {
          const data = await response.json();
          setGuestBookings(data);
        } else {
          console.log("Failed to fetch guest bookings");
          // Fallback to mock data if API fails
          setGuestBookings(getMockGuestBookings());
        }
      } catch (error) {
        console.log("Failed to fetch guest bookings", error);
        // Fallback to mock data if API fails
        setGuestBookings(getMockGuestBookings());
      }
    };
    
    fetchGuestBookings();
    */

    // mock data - remove when API is add
    setGuestBookings(getMockGuestBookings());
  }, []);

  // Function to get mock guest bookings (temporary - remove when API is add)
  const getMockGuestBookings = (): GuestBooking[] => {
    const currentDate = new Date();
    return [
      {
        id: "1",
        name: "Lewis",
        roomNumber: "101",
        status: "due-in",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        colorClass: "bg-yellow-100 text-yellow-800"
      },
      {
        id: "2",
        name: "Mark",
        roomNumber: "102",
        status: "checked-out",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 6),
        colorClass: "bg-blue-100 text-blue-800"
      },
      {
        id: "3",
        name: "Tate",
        roomNumber: "103",
        status: "due-out",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3),
        colorClass: "bg-indigo-100 text-indigo-800"
      },
      {
        id: "4",
        name: "Manson",
        roomNumber: "104",
        status: "due-in",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 7),
        colorClass: "bg-orange-100 text-orange-800"
      },
      {
        id: "5",
        name: "Mike",
        roomNumber: "105",
        status: "checked-in",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 6),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
        colorClass: "bg-sky-100 text-sky-800"
      },
      {
        id: "6",
        name: "Bruce",
        roomNumber: "106",
        status: "due-out",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
        colorClass: "bg-rose-100 text-rose-800"
      },
      {
        id: "7",
        name: "Otis",
        roomNumber: "107",
        status: "due-in",
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        colorClass: "bg-amber-100 text-amber-800"
      },
    ];
  };

  // Get current year and month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday,)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push(date);
    }

    return days;
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToPreviousYear = () => {
    setCurrentDate(new Date(currentYear - 1, currentMonth, 1));
  };

  const goToNextYear = () => {
    setCurrentDate(new Date(currentYear + 1, currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  // Check if a date has guest bookings
  const getBookingsForDate = (date: Date | null) => {
    if (!date) return [];

    return guestBookings.filter(booking => {
      if (activeTab !== "all" && booking.status !== activeTab) return false;

      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      return date >= start && date <= end;
    });
  };


  // Sort bookings by status order for "All" view
  const getSortedBookingsForDate = (date: Date | null) => {
    const bookings = getBookingsForDate(date);

    if (activeTab !== "all") return bookings;

    // Define the order of statuses for sorting
    const statusOrder: Record<string, number> = {
      'due-in': 1,
      'checked-in': 2,
      'due-out': 3,
      'checked-out': 4,
      'all': 5
    };

    return bookings.sort((a, b) => {
      return (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const calendarDays = generateCalendarDays();

  return (
    <AdminReceptionistLayout role="admin">
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* filter Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm text-gray-400 mb-2">Front desk</h2>
            <div className="flex items-center gap-2">
              {/* All Button */}
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${activeTab === "all"
                  ? "bg-gray-200 text-gray-900 border border-gray-300"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                All
              </button>

              <button
                onClick={() => setActiveTab("due-in")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${activeTab === "due-in" ? "bg-yellow-200 text-yellow-900" : "bg-yellow-50 text-yellow-700"
                  }`}
              >
                Due in
              </button>

              <button
                onClick={() => setActiveTab("checked-out")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${activeTab === "checked-out" ? "bg-blue-200 text-blue-900" : "bg-blue-50 text-blue-700"
                  }`}
              >
                Checked out
              </button>

              <button
                onClick={() => setActiveTab("due-out")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${activeTab === "due-out" ? "bg-rose-200 text-rose-900" : "bg-rose-50 text-rose-700"
                  }`}
              >
                Due out
              </button>

              <button
                onClick={() => setActiveTab("checked-in")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${activeTab === "checked-in" ? "bg-emerald-200 text-emerald-900" : "bg-emerald-50 text-emerald-700"
                  }`}
              >
                Checked in
              </button>
            </div>
          </div>

          {/* Search & Create booking */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by room number"
                className="text-black w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
            >
              <Calendar className="h-4 w-4" />
              Create booking
            </button>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Today
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousYear}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>

                <div className="text-xl font-bold text-gray-800 w-24 text-center">
                  {currentYear}
                </div>

                <button
                  onClick={goToNextYear}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>

                <div className="text-2xl font-bold text-gray-800 w-40 text-center">
                  {MONTHS[currentMonth]}
                </div>

                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Month Selector */}
              <div className="relative">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentDate(new Date(currentYear, parseInt(e.target.value), 1))}
                  className="text-black pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
                >
                  {MONTHS.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Year Selector */}
              <div className="relative">
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentMonth, 1))}
                  className="text-black pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
                >
                  {Array.from({ length: 11 }, (_, i) => currentYear - 5 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg overflow-hidden">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 bg-gray-100 border-b">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((date, index) => {
                const bookings = getSortedBookingsForDate(date);

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] border-r border-b p-2 ${date ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                      } ${date && isToday(date) ? 'bg-blue-50' : ''
                      } ${date && isSelected(date) ? 'ring-2 ring-blue-500 ring-inset' : ''
                      }`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        {/* Date Number */}
                        <div className="flex justify-between items-start mb-2">
                          <div className={`text-sm font-medium ${isToday(date) ? 'text-blue-600' : 'text-gray-700'
                            }`}>
                            {date.getDate()}
                          </div>

                          {isToday(date) && (
                            <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              Today
                            </div>
                          )}
                        </div>

                        {/* Guest Bookings */}
                        <div className="space-y-1">
                          {bookings.map((booking) => (
                            <div
                              key={booking.id}
                              className={`${booking.colorClass} rounded px-2 py-1 text-xs truncate`}
                              title={`${booking.name} - Room ${booking.roomNumber} (${booking.status.replace('-', ' ')})`}
                            >
                              <div className="font-medium truncate">{booking.name}</div>
                              <div className="text-xs opacity-75">Room {booking.roomNumber}</div>
                              {activeTab === "all" && (
                                <div className="text-xs opacity-75 mt-0.5">
                                  {booking.status.replace('-', ' ')}
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Show more indicator if there are more than 2 bookings */}
                          {bookings.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{bookings.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Selected Date</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="text-right">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Bookings for this date</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {getBookingsForDate(selectedDate).length} bookings
                </p>
              </div>
            </div>

            {/* Booking Details for Selected Date */}
            {getBookingsForDate(selectedDate).length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Booking Details:</h4>
                {getSortedBookingsForDate(selectedDate).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <span className="text-black font-medium">{booking.name}</span>
                      <span className="text-sm text-gray-600 ml-2">(Room {booking.roomNumber})</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${booking.status === 'due-in' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'checked-out' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'due-out' ? 'bg-rose-100 text-rose-800' :
                          'bg-emerald-100 text-emerald-800'
                      }`}>
                      {booking.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <FrontDeskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            console.log("Booking created successfully");
          }}
        />
      </div>
    </AdminReceptionistLayout>
  );
}
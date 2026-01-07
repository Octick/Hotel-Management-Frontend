"use client";

import { useState, useEffect } from "react";
import { auth } from "@/app/lib/firebase";
import toast from "react-hot-toast";
import { Search, Plus, X, User as UserIcon, Calendar } from "lucide-react";

interface Booking {
  id?: string;
  _id?: string;
  roomId: string | { _id: string; number: string; [key: string]: any };
  guestId: string | { _id: string; name: string; email: string; [key: string]: any };
  checkIn: string;
  checkOut: string;
}

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBooking?: Booking | null;
  onUpdateBooking?: () => void;
}

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  rate: number;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function NewBookingModal({
  isOpen,
  onClose,
  editingBooking,
  onUpdateBooking,
}: NewBookingModalProps) {
  // Form State
  const [formData, setFormData] = useState({
    roomId: "",
    checkIn: "",
    checkOut: "",
    guestId: "", 
  });
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "new">("search");
  
  // Data State
  const [guests, setGuests] = useState<UserProfile[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  
  // New Guest Form
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "" });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // --- 1. Load Initial Data (Guests & Rooms) ---
  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Guests
      const usersRes = await fetch(`${API_URL}/api/users`, { headers });
      if (usersRes.ok) {
        const data = await usersRes.json();
        setGuests(data);
      }

      // Fetch Rooms
      const roomsRes = await fetch(`${API_URL}/api/rooms`, { headers });
      if (roomsRes.ok) {
        const data = await roomsRes.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  // --- 2. Handle Edit Mode Pre-fill ---
  useEffect(() => {
    if (editingBooking && isOpen) {
      const getID = (field: any) => (typeof field === 'object' && field !== null ? field._id : field);
      const safeDate = (dateStr: string) => {
        try { return dateStr ? new Date(dateStr).toISOString().split('T')[0] : ""; } 
        catch (e) { return ""; }
      };

      const gId = getID(editingBooking.guestId);
      
      setFormData({
        roomId: getID(editingBooking.roomId) || "",
        checkIn: safeDate(editingBooking.checkIn),
        checkOut: safeDate(editingBooking.checkOut),
        guestId: gId || "",
      });

      // If we have the guest loaded, set the search query to their name
      if (gId && guests.length > 0) {
        const found = guests.find(g => g._id === gId);
        if (found) setSearchQuery(found.name);
      }
    } else if (!isOpen) {
        setFormData({ roomId: "", checkIn: "", checkOut: "", guestId: "" });
        setSearchQuery("");
        setAvailableRooms([]);
    }
  }, [editingBooking, isOpen, guests]); // Added guests to dependency to sync name

  // --- 3. Filter Guests ---
  useEffect(() => {
    if (!searchQuery) {
      setFilteredGuests([]);
      return;
    }
    const lower = searchQuery.toLowerCase();
    setFilteredGuests(
      guests.filter(g => 
        g.name.toLowerCase().includes(lower) || 
        g.email.toLowerCase().includes(lower)
      )
    );
  }, [searchQuery, guests]);

  // --- 4. Check Room Availability ---
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && rooms.length > 0) {
        checkAvailability();
    }
  }, [formData.checkIn, formData.checkOut, rooms]);

  const checkAvailability = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        // Get all bookings to check conflicts
        const res = await fetch(`${API_URL}/api/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
            const bookings: any[] = await res.json();
            const start = new Date(formData.checkIn).getTime();
            const end = new Date(formData.checkOut).getTime();

            const occupiedIds = new Set();
            bookings.forEach(b => {
                // Ignore the current booking if we are editing it
                const bId = b._id || b.id;
                const editId = editingBooking?._id || editingBooking?.id;
                if (editId && bId === editId) return;

                if (b.status === 'cancelled' || b.status === 'checked-out') return;

                const bStart = new Date(b.checkIn).getTime();
                const bEnd = new Date(b.checkOut).getTime();

                // Overlap check
                if (start < bEnd && end > bStart) {
                    const rId = typeof b.roomId === 'object' ? b.roomId._id : b.roomId;
                    occupiedIds.add(rId);
                }
            });

            setAvailableRooms(rooms.filter(r => !occupiedIds.has(r._id)));
        }
    } catch (e) {
        console.error("Availability check failed", e);
    }
  };

  const handleConfirmBooking = async () => {
    if(!formData.roomId || (!formData.guestId && !newGuest.email) || !formData.checkIn || !formData.checkOut) {
        toast.error("Please fill in all fields");
        return;
    }

    try {
      setIsSubmitting(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in.");
        return;
      }
      const token = await user.getIdToken();
      
      let finalGuestId = formData.guestId;

      // Handle New Guest Creation
      if (activeTab === 'new') {
        const regRes = await fetch(`${API_URL}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...newGuest, role: 'customer' })
        });
        
        if (regRes.ok) {
            const createdUser = await regRes.json();
            finalGuestId = createdUser._id || createdUser.id;
        } else {
             // Fallback: try to find by email if it existed
             const findRes = await fetch(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` }});
             const allUsers = await findRes.json();
             const found = allUsers.find((u:any) => u.email === newGuest.email);
             if(found) finalGuestId = found._id;
             else throw new Error("Could not register or find new guest");
        }
      }

      // Submit Booking
      const isEdit = !!editingBooking;
      const method = isEdit ? "PUT" : "POST";
      const bookingId = editingBooking?.id || editingBooking?._id;
      const endpoint = isEdit ? `${API_URL}/api/bookings/${bookingId}` : `${API_URL}/api/bookings`;

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, guestId: finalGuestId })
      });

      if (res.ok) {
        toast.success(isEdit ? "Booking updated" : "Booking created");
        if (onUpdateBooking) onUpdateBooking();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save booking");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editingBooking ? "Edit Booking" : "New Booking"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
           
           {/* Section 1: Dates */}
           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                        type="date" 
                        className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    />
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                        type="date" 
                        className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    />
                </div>
             </div>
           </div>

           {/* Section 2: Room Selection */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Select Room</label>
             {!formData.checkIn || !formData.checkOut ? (
                <div className="p-3 bg-gray-50 border border-dashed rounded-lg text-center text-sm text-gray-500">Select dates to see available rooms</div>
             ) : availableRooms.length === 0 ? (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center text-sm text-red-600">No rooms available for these dates</div>
             ) : (
                <div className="grid grid-cols-3 gap-3 max-h-40 overflow-y-auto p-1">
                    {availableRooms.map(room => (
                        <button
                            key={room._id}
                            onClick={() => setFormData({...formData, roomId: room._id})}
                            className={`p-2 border rounded-lg text-left text-sm transition-all ${
                                formData.roomId === room._id 
                                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                                : 'hover:border-blue-300'
                            }`}
                        >
                            <div className="font-bold text-gray-900">Room {room.roomNumber}</div>
                            <div className="text-gray-500 text-xs">${room.rate}/night</div>
                        </button>
                    ))}
                </div>
             )}
           </div>

           {/* Section 3: Guest Selection */}
           <div className="border-t pt-4">
             <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Guest Details</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => { setActiveTab('search'); setFormData({...formData, guestId: ""}); }}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'search' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                    >Search</button>
                    <button 
                        onClick={() => { setActiveTab('new'); setFormData({...formData, guestId: ""}); }}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'new' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                    >New Guest</button>
                </div>
             </div>

             {activeTab === 'search' ? (
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search guest by name or email..."
                        className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setFormData({...formData, guestId: ""}); // Reset selection on type
                        }}
                    />
                    {/* Results Dropdown */}
                    {searchQuery && !formData.guestId && filteredGuests.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredGuests.map(guest => (
                                <button
                                    key={guest._id}
                                    onClick={() => {
                                        setFormData({...formData, guestId: guest._id});
                                        setSearchQuery(guest.name);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                                >
                                    <div className="font-medium text-sm text-gray-900">{guest.name}</div>
                                    <div className="text-xs text-gray-500">{guest.email}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
             ) : (
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <input 
                        placeholder="Full Name"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        value={newGuest.name}
                        onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                    />
                    <input 
                        placeholder="Email Address"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                    />
                    <input 
                        placeholder="Phone Number"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        value={newGuest.phone}
                        onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                    />
                </div>
             )}
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isSubmitting ? "Processing..." : (editingBooking ? "Update Booking" : "Confirm Booking")}
          </button>
        </div>
      </div>
    </div>
  );
}
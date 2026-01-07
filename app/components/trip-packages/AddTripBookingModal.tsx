"use client";

import { useState, useEffect } from "react";
import { auth } from "@/app/lib/firebase";
import toast from "react-hot-toast";
import { X, Search, User, Calendar, MapPin, Users } from "lucide-react";

interface AddTripBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTripBookingModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTripBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [searchGuest, setSearchGuest] = useState("");
  
  const [formData, setFormData] = useState({
    guestId: "",
    packageId: "",
    tripDate: "",
    participants: 1,
    status: "Confirmed",
    notes: ""
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const [usersRes, tripsRes] = await Promise.all([
        fetch(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/trips`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (usersRes.ok) setGuests(await usersRes.json());
      if (tripsRes.ok) setPackages(await tripsRes.json());

    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  const handleSubmit = async () => {
    if (!formData.guestId || !formData.packageId || !formData.tripDate) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${API_URL}/api/trips/requests/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Booking created successfully");
        onSuccess();
        onClose();
        // Reset
        setFormData({ guestId: "", packageId: "", tripDate: "", participants: 1, status: "Confirmed", notes: "" });
      } else {
        toast.error("Failed to create booking");
      }
    } catch (e) {
      toast.error("Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchGuest.toLowerCase()) || 
    g.email.toLowerCase().includes(searchGuest.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">New Trip Booking</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-gray-500" /></button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* 1. Select Guest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Guest</label>
            <div className="relative">
                <input 
                    type="text"
                    placeholder="Search guest..."
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.guestId ? (guests.find(g => g._id === formData.guestId)?.name || searchGuest) : searchGuest}
                    onChange={(e) => {
                        setFormData({...formData, guestId: ""});
                        setSearchGuest(e.target.value);
                    }}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {searchGuest && !formData.guestId && (
                <div className="mt-1 border rounded-lg max-h-32 overflow-y-auto bg-white absolute z-10 w-full max-w-[calc(100%-3rem)] shadow-lg">
                    {filteredGuests.map(g => (
                        <div 
                            key={g._id} 
                            className="p-2 hover:bg-gray-50 cursor-pointer text-sm"
                            onClick={() => {
                                setFormData({...formData, guestId: g._id});
                                setSearchGuest("");
                            }}
                        >
                            <div className="font-medium text-gray-900">{g.name}</div>
                            <div className="text-xs text-gray-500">{g.email}</div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* 2. Select Package */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Trip Package</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {packages.map(pkg => (
                    <div 
                        key={pkg._id}
                        onClick={() => setFormData({...formData, packageId: pkg._id})}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            formData.packageId === pkg._id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'hover:border-gray-300'
                        }`}
                    >
                        <div className="font-medium text-gray-900 text-sm truncate">{pkg.name}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" /> {pkg.location}
                        </div>
                        <div className="text-sm font-semibold text-blue-600 mt-1">${pkg.price}</div>
                    </div>
                ))}
            </div>
          </div>

          {/* 3. Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                        type="date"
                        className="w-full pl-9 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.tripDate}
                        onChange={(e) => setFormData({...formData, tripDate: e.target.value})}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                        type="number"
                        min="1"
                        className="w-full pl-9 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.participants}
                        onChange={(e) => setFormData({...formData, participants: parseInt(e.target.value)})}
                    />
                </div>
            </div>
          </div>
          
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
                className="w-full p-2 border rounded-lg text-sm outline-none"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
          </div>

        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-200 rounded-lg">Cancel</button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
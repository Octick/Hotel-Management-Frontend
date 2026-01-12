/* */
"use client";

import React, { useState } from 'react';
import { X, Calendar, Mail, Phone } from 'lucide-react';
import { useAuth } from "../../context/AuthContext"; // ✅ Added

interface FrontDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FrontDeskModal({ isOpen, onClose, onSuccess }: FrontDeskModalProps) {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    roomType: 'Standard',
    adults: 1,
    children: 0,
    status: 'due-in',
    checkInDate: '',
    checkOutDate: '',
    mealPreference: 'regular',
  });

  const roomTypes = [
    { value: 'Standard', label: 'Standard Room', price: 150 },
    { value: 'Deluxe', label: 'Deluxe Room', price: 250 },
    { value: 'Suite', label: 'Suite', price: 400 },
    { value: 'VIP', label: 'VIP', price: 600 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const selectedRoom = roomTypes.find(room => room.value === formData.roomType);
    if (!selectedRoom || !formData.checkInDate || !formData.checkOutDate) return 0;
    const nights = Math.ceil(Math.abs(new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) / (1000 * 60 * 60 * 24));
    return selectedRoom.price * (nights || 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/bookings`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          guest: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
          },
          booking: {
            roomType: formData.roomType,
            status: formData.status === 'checked-in' ? 'checked-in' : 'confirmed',
            checkIn: formData.checkInDate,
            checkOut: formData.checkOutDate,
          }
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setStep(1);
        setFormData({
            firstName: '', lastName: '', email: '', phone: '', idNumber: '',
            roomType: 'Standard', adults: 1, children: 0, status: 'due-in',
            checkInDate: '', checkOutDate: '', mealPreference: 'regular'
        });
      } else {
        const err = await response.json();
        alert(err.error || "Failed to create booking");
      }
    } catch (error) {
      console.error(error);
      alert("Booking creation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">New Booking</h2>
            <button onClick={onClose}><X className="h-5 w-5 text-gray-500" /></button>
          </div>

          <div className="p-6 overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-700 border-b pb-2">Guest</h4>
                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full px-4 py-2 border rounded-lg text-black" required />
                        <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full px-4 py-2 border rounded-lg text-black" required />
                        <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full px-4 py-2 border rounded-lg text-black" required />
                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="w-full px-4 py-2 border rounded-lg text-black" required />
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-700 border-b pb-2">Room</h4>
                        <select name="roomType" value={formData.roomType} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg text-black">
                            {roomTypes.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                        <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg text-black" required />
                        <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg text-black" required />
                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg text-black">
                            <option value="due-in">Due In (Future)</option>
                            <option value="checked-in">Check In Now</option>
                        </select>
                    </div>
                </div>
              )}
              
              {step === 2 && (
                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <h3 className="text-lg font-bold text-blue-900">Confirm Booking</h3>
                      <p className="text-blue-800 mt-2">Guest: {formData.firstName} {formData.lastName}</p>
                      <p className="text-blue-800">Room: {formData.roomType}</p>
                      <p className="text-blue-800">Dates: {formData.checkInDate} to {formData.checkOutDate}</p>
                      <p className="text-xl font-bold mt-4 text-blue-900">Total: ${calculateTotal()}</p>
                  </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                  {step === 2 && <button type="button" onClick={() => setStep(1)} className="px-6 py-2 border rounded-lg text-black">Back</button>}
                  {step === 1 ? (
                      <button type="button" onClick={() => setStep(2)} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Next</button>
                  ) : (
                      <button type="submit" disabled={isLoading} className="px-6 py-2 bg-green-600 text-white rounded-lg">
                          {isLoading ? 'Creating...' : 'Confirm & Create'}
                      </button>
                  )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
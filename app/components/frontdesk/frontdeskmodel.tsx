"use client";

import React, { useState } from 'react';
import { X, Calendar, User, Phone, Mail } from 'lucide-react';

interface FrontDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type BookingStatus = "due-in" | "checked-out" | "due-out" | "checked-in";

export default function FrontDeskModal({ isOpen, onClose, onSuccess }: FrontDeskModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Guest Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idType: 'passport',
    idNumber: '',

    // Booking Details
    roomType: 'standard',
    adults: 1,
    children: 0,
    status: 'due-in' as BookingStatus,

    // Dates
    checkInDate: '',
    checkOutDate: '',

    // Meal Preference
    mealPreference: 'regular',
  });

  const roomTypes = [
    { value: 'standard', label: 'Standard Room', price: 150 },
    { value: 'deluxe', label: 'Deluxe Room', price: 250 },
    { value: 'suite', label: 'Suite', price: 400 },
    { value: 'executive', label: 'Executive Suite', price: 600 },
    { value: 'presidential', label: 'Presidential Suite', price: 1000 },
  ];

  const idTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'national-id', label: 'National ID' },
    { value: 'driving-license', label: 'Driving License' },
  ];

  const mealPreferences = [
    { value: 'regular', label: 'Regular' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Allow only digits for phone and ID number
    if (name === 'phone' || name === 'idNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: Math.max(0, value)
    }));
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const selectedRoom = roomTypes.find(room => room.value === formData.roomType);
    const nights = calculateNights();
    if (!selectedRoom) return 0;
    return selectedRoom.price * nights;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add API endpoint
      const API = "/api/front-desk/bookings";

      const response = await fetch(API, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            identification: {
              type: formData.idType,
              number: formData.idNumber
            }
          },
          booking: {
            roomType: formData.roomType,
            guests: {
              adults: formData.adults,
              children: formData.children
            },
            status: formData.status,
            checkIn: formData.checkInDate,
            checkOut: formData.checkOutDate,
            preferences: {
              meals: formData.mealPreference
            }
          }
        }),
      });

      if (response.ok) {
        const newBooking = await response.json();
        console.log("Booking created successfully:", newBooking);
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          idType: 'passport',
          idNumber: '',
          roomType: 'standard',
          adults: 1,
          children: 0,
          status: 'due-in',
          checkInDate: '',
          checkOutDate: '',
          mealPreference: 'regular',
        });
        setStep(1);
      } else {
        console.error("Failed to create booking");
        alert("Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking creation failed:", error);
      alert("Booking creation failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'due-in': return 'bg-yellow-100 text-yellow-800';
      case 'checked-out': return 'bg-blue-100 text-blue-800';
      case 'due-out': return 'bg-rose-100 text-rose-800';
      case 'checked-in': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 bg-opacity-50" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">New Booking</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Guest Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Details */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700 border-b pb-2">Personal Details</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          placeholder="Enter first name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          placeholder="Enter last name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            placeholder="guest@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            placeholder="1234567890"
                            pattern="[0-9]*"
                            inputMode="numeric"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Identification */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700 border-b pb-2">Identification</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Type
                        </label>
                        <select
                          name="idType"
                          value={formData.idType}
                          onChange={handleInputChange}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        >
                          {idTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Number
                        </label>
                        <input
                          type="text"
                          name="idNumber"
                          value={formData.idNumber}
                          onChange={handleInputChange}
                          required
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          placeholder="Enter ID number"
                          pattern="[0-9]*"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Booking Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Room & Dates */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700 border-b pb-2">Room & Dates</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Room Type *
                        </label>
                        <select
                          name="roomType"
                          value={formData.roomType}
                          onChange={handleInputChange}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        >
                          {roomTypes.map(room => (
                            <option key={room.value} value={room.value}>
                              {room.label} - ${room.price}/night
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-in Date *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="date"
                              name="checkInDate"
                              value={formData.checkInDate}
                              onChange={handleInputChange}
                              required
                              min={new Date().toISOString().split('T')[0]}
                              className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-out Date *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="date"
                              name="checkOutDate"
                              value={formData.checkOutDate}
                              onChange={handleInputChange}
                              required
                              min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                              className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          >
                            <option value="due-in">Due In</option>
                            <option value="checked-in">Checked In</option>
                            <option value="due-out">Due Out</option>
                            <option value="checked-out">Checked Out</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Guest Preferences */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700 border-b pb-2">Guest Details</h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adults *
                          </label>
                          <div className="text-black flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleNumberChange('adults', formData.adults - 1)}
                              className="text-black px-3 py-2 bg-gray-100 hover:bg-gray-200"
                              disabled={formData.adults <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              name="adults"
                              value={formData.adults}
                              onChange={handleInputChange}
                              min="1"
                              max="10"
                              className="w-full px-4 py-2 text-center border-0 focus:ring-0"
                            />
                            <button
                              type="button"
                              onClick={() => handleNumberChange('adults', formData.adults + 1)}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                              disabled={formData.adults >= 10}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Children
                          </label>
                          <div className="text-black flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleNumberChange('children', formData.children - 1)}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                              disabled={formData.children <= 0}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              name="children"
                              value={formData.children}
                              onChange={handleInputChange}
                              min="0"
                              max="10"
                              className="w-full px-4 py-2 text-center border-0 focus:ring-0"
                            />
                            <button
                              type="button"
                              onClick={() => handleNumberChange('children', formData.children + 1)}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                              disabled={formData.children >= 10}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meal Preference
                        </label>
                        <select
                          name="mealPreference"
                          value={formData.mealPreference}
                          onChange={handleInputChange}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        >
                          {mealPreferences.map(pref => (
                            <option key={pref.value} value={pref.value}>
                              {pref.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Booking Information Summary */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">Booking Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-blue-700">Nights</div>
                        <div className="text-xl font-bold text-blue-800">{calculateNights()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-700">Estimated Total</div>
                        <div className="text-xl font-bold text-blue-800">${calculateTotal()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-700">Guests</div>
                        <div className="text-xl font-bold text-blue-800">{formData.adults + formData.children}</div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-700">Status</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor(formData.status)}`}>
                          {formData.status.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={step === 1 ? onClose : prevStep}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>

              <div className="flex items-center gap-3">
                {step < 2 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Next
                  </button>
                )}

                {step === 2 && (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </span>
                    ) : (
                      'Create Booking'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
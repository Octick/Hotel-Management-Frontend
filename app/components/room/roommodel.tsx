"use client";

import React, { useState } from 'react';
import { X, Hash, Building, Bed, Wind, Tv, Wifi, Droplets, Coffee, Smartphone, Check, CheckCircle } from 'lucide-react';

interface RoomModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: any) => void;
}

export default function RoomModel({ isOpen, onClose, onSave }: RoomModelProps) {
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: '1',
    bedType: 'Single',
    roomType: 'Standard',
    price: '',
    facilities: [] as string[],
    status: 'Available' as 'Available' | 'Booked' | 'Reserved' | 'Waitlist' | 'Blocked',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bedTypes = ['Single', 'Double', 'Queen', 'King', 'VIP'];
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive', 'VIP'];
  const floors = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const statusOptions = ['Available', 'Booked', 'Reserved', 'Waitlist', 'Blocked'];
  
  const facilityOptions = [
    { id: 'ac', label: 'AC', icon: Wind },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'shower', label: 'Shower', icon: Droplets },
    { id: 'coffee', label: 'Coffee Maker', icon: Coffee },
    { id: 'phone', label: 'Phone', icon: Smartphone },
  ];

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFacilityToggle = (facilityId: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter(f => f !== facilityId)
        : [...prev.facilities, facilityId]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }

    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare API data
      const apiData = {
        ...formData,
        price: parseFloat(formData.price),
        facilities: formData.facilities.map(id => 
          facilityOptions.find(f => f.id === id)?.label || id
        ),
      };

      console.log('Saving room data:', apiData);

      // Add room add API
      /*
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save room');
      }
      
      const savedRoom = await response.json();
      */

      // TEMPORARY: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock saved room data
      const savedRoom = {
        ...apiData,
        id: Date.now().toString(), // Generate a temporary ID
        createdAt: new Date().toISOString()
      };

      // Call parent callback with the saved room data
      onSave(savedRoom);
      
      // Reset form and close modal
      setFormData({
        roomNumber: '',
        floor: '1',
        bedType: 'Single',
        roomType: 'Standard',
        price: '',
        facilities: [],
        status: 'Available',
      });
      setErrors({});
      
      onClose();
    } catch (error) {
      console.error('Failed to save room:', error);
      alert('Failed to save room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-200 rounded-t-xl p-6 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add New Room</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors group"
              aria-label="Close"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Room Number and Floor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Room Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Hash className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 101, 202"
                    className={`text-black w-full pl-10 pr-3 py-2.5 border ${errors.roomNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.roomNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Floor
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Building className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="text-black w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    disabled={isSubmitting}
                  >
                    {floors.map(floor => (
                      <option key={floor} value={floor}>Floor - {floor}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bed Type and Room Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Bed Type *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Bed className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="bedType"
                    value={formData.bedType}
                    onChange={handleInputChange}
                    className="text-black w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    disabled={isSubmitting}
                  >
                    {bedTypes.map(type => (
                      <option key={type} value={type}>{type} bed</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="text-black w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  disabled={isSubmitting}
                >
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Price per Night ($)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`text-black w-full pl-8 pr-3 py-2.5 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Status *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="text-black w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    disabled={isSubmitting}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                Room Facilities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {facilityOptions.map((facility) => {
                  const Icon = facility.icon;
                  const isSelected = formData.facilities.includes(facility.id);
                  return (
                    <button
                      type="button"
                      key={facility.id}
                      onClick={() => handleFacilityToggle(facility.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      <div className={`p-1.5 rounded ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{facility.label}</span>
                      {isSelected && (
                        <div className="ml-auto">
                          <Check className="h-4 w-4 text-blue-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Room'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
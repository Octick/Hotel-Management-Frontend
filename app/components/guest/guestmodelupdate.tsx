"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface GuestModelUpdateProps {
    isOpen: boolean;
    onClose: () => void;
    guestData: {
        name: string;
        registrationNumber: string;
        checkInDate: string;
        roomType: string;
        stay: string;
        discount: number;
        roomNumber?: string;
        totalAmount?: number;
        amountPaid?: number;
        status?: 'Clean' | 'Dirty' | 'Inspected' | 'Pick up';
    };
    onUpdate: (updatedData: any) => void;
}

export default function GuestModelUpdate({ isOpen, onClose, guestData, onUpdate }: GuestModelUpdateProps) {
    const [formData, setFormData] = useState({
        name: '',
        registrationNumber: '',
        roomNumber: '',
        checkInDate: '',
        roomType: '',
        stay: '',
        discount: 0,
        totalAmount: 0,
        amountPaid: 0,
        status: 'Clean' as 'Clean' | 'Dirty' | 'Inspected' | 'Pick up'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        if (guestData) {
            setFormData({
                name: guestData.name || '',
                registrationNumber: guestData.registrationNumber || '',
                roomNumber: guestData.roomNumber || '',
                checkInDate: guestData.checkInDate || '',
                roomType: guestData.roomType || '',
                stay: guestData.stay || '',
                discount: guestData.discount || 0,
                totalAmount: guestData.totalAmount || 0,
                amountPaid: guestData.amountPaid || 0,
                status: guestData.status || 'Clean'
            });
        }
    }, [guestData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'discount' || name === 'totalAmount' || name === 'amountPaid') {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate required fields
        if (!formData.name || !formData.registrationNumber || !formData.roomNumber) {
            setError("Please fill in all required fields");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            // Add API endpoint here
            const API = "";

            const response = await fetch(API, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const updatedGuest = await response.json();
                console.log("Guest updated successfully", updatedGuest);
                onUpdate(updatedGuest);
                onClose();
            } else {
                console.log("Failed to update guest");
                setError("Failed to update guest. Please try again.");
            }
        } catch (error) {
            console.log("Guest update failed", error);
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Update Guest Details</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Guest Name */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Guest name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className=" text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Registration Number */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Registration number *</label>
                            <input
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Room Number */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Room Number *</label>
                            <input
                                type="text"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Check-in Date */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Check in date</label>
                            <input
                                type="date"
                                name="checkInDate"
                                value={formData.checkInDate}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Room Type */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Room type</label>
                            <select
                                name="roomType"
                                value={formData.roomType}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                disabled={isSubmitting}
                            >
                                <option value="">Select room type</option>
                                <option value="Standard Room">Standard Room</option>
                                <option value="Deluxe Room">Deluxe Room</option>
                                <option value="Suite">Suite</option>
                                <option value="Executive Suite">Executive Suite</option>
                            </select>
                        </div>

                        {/* Stay Duration */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Stay</label>
                            <input
                                type="text"
                                name="stay"
                                value={formData.stay}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="e.g., 3 Nights"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Total Amount */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Total Amount ($)</label>
                            <input
                                type="number"
                                name="totalAmount"
                                value={formData.totalAmount}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                min="0"
                                step="0.01"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Amount Paid */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Amount Paid ($)</label>
                            <input
                                type="number"
                                name="amountPaid"
                                value={formData.amountPaid}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                min="0"
                                step="0.01"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Discount */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Discount ($)</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                min="0"
                                step="0.01"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                disabled={isSubmitting}
                            >
                                <option value="Clean">Clean</option>
                                <option value="Dirty">Dirty</option>
                                <option value="Inspected">Inspected</option>
                                <option value="Pick up">Pick up</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update Guest"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
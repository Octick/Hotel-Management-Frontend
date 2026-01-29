/* */
"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

interface GuestModelUpdateProps {
    isOpen: boolean;
    onClose: () => void;
    guestData: any;
    onUpdate: (updatedData: any) => void;
}

export default function GuestModelUpdate({ isOpen, onClose, guestData, onUpdate }: GuestModelUpdateProps) {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        checkInDate: '',
        roomType: '', // This is just visual in this modal unless we fetch rooms to change
        status: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (guestData) {
            setFormData({
                checkInDate: guestData.checkInDate || '',
                roomType: guestData.roomType || '',
                status: guestData.status || ''
            });
        }
    }, [guestData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/bookings/${guestData.mongoId}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({
                    checkIn: formData.checkInDate, // Mapping UI field to Backend field
                    status: formData.status
                }),
            });

            if (response.ok) {
                const updatedGuest = await response.json();
                onUpdate(updatedGuest);
                onClose();
            } else {
                throw new Error("Failed to update guest");
            }
        } catch (error) {
            console.error("Update failed", error);
            setError("Failed to update guest. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Update Guest Details</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full" disabled={isSubmitting}>
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Read Only Fields */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Guest Name</label>
                            <input type="text" value={guestData?.name} disabled className="w-full px-3 py-2 border bg-gray-100 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Room Number</label>
                            <input type="text" value={guestData?.roomNumber} disabled className="w-full px-3 py-2 border bg-gray-100 rounded-lg" />
                        </div>

                        {/* Editable Fields */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Check-in Date</label>
                            <input
                                type="date"
                                name="checkInDate"
                                value={formData.checkInDate}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                disabled={isSubmitting}
                            >
                                <option value="Clean">Clean</option>
                                <option value="Dirty">Dirty</option>
                                <option value="Inspected">Inspected</option>
                                <option value="Occupied">Occupied</option>
                                <option value="Cleaning">Cleaning</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Guest"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
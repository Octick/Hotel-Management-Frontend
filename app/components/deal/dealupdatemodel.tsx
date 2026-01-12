/* */
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // ✅ Added

interface DealUpdateModelProps {
  isOpen: boolean;
  onClose: () => void;
  dealData: any;
  onUpdate: (updatedData: any) => void;
  isUpdating: boolean;
}

export default function DealUpdateModel({ isOpen, onClose, dealData, onUpdate }: DealUpdateModelProps) {
  const { token } = useAuth();
  const [formData, setFormData] = useState<any>({});
  const [isLocalUpdating, setIsLocalUpdating] = useState(false);

  useEffect(() => {
    if (dealData) {
      setFormData({
        ...dealData,
        roomType: dealData.roomType || ""
      });
    }
  }, [dealData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!token) return;
    setIsLocalUpdating(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/deals/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update deal");
      }

      const data = await response.json();
      onUpdate(data);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update deal");
    } finally {
      setIsLocalUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"><X size={20} /></button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Update Deal</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Reference Number</label>
            <input type="text" name="referenceNumber" value={formData.referenceNumber || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-black" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Deal Name</label>
            <input type="text" name="dealName" value={formData.dealName || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-black" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Reservations Left</label>
            <input type="number" name="reservationsLeft" value={formData.reservationsLeft || 0} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-black" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">End Date</label>
            <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-black" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Room Type (comma separated)</label>
            <input type="text" name="roomType" value={formData.roomType || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-black" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Status</label>
            <select name="status" value={formData.status || 'Ongoing'} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-black">
              <option value="Ongoing">Ongoing</option>
              <option value="Full">Full</option>
              <option value="Inactive">Inactive</option>
              <option value="New">New</option>
              <option value="Finished">Finished</option>
            </select>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={isLocalUpdating} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
          {isLocalUpdating ? "Updating..." : "Update Deal"}
        </button>
      </div>
    </div>
  );
}
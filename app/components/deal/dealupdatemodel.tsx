"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface DealUpdateModelProps {
  isOpen: boolean;
  onClose: () => void;
  dealData: {
    id: string;
    referenceNumber: string;
    dealName: string;
    reservationsLeft: number;
    endDate: string;
    roomType: string;
    status: "Ongoing" | "Full" | "Inactive" | "New" | "Finished";
  } | null;
  onUpdate: (updatedData: any) => void;
  isUpdating: boolean;
}

export default function DealUpdateModel({
  isOpen,
  onClose,
  dealData,
  onUpdate,
  isUpdating,
}: DealUpdateModelProps) {
  const [formData, setFormData] = useState({
    id: "",
    referenceNumber: "",
    dealName: "",
    reservationsLeft: 0,
    endDate: "",
    roomType: "",
    status: "Ongoing" as
      | "Ongoing"
      | "Full"
      | "Inactive"
      | "New"
      | "Finished",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing deal data into form
  useEffect(() => {
    if (dealData) {
      setFormData({
        id: dealData.id || "",
        referenceNumber: dealData.referenceNumber || "",
        dealName: dealData.dealName || "",
        reservationsLeft: dealData.reservationsLeft || 0,
        endDate: dealData.endDate || "",
        roomType: dealData.roomType || "",
        status: dealData.status,
      });
    }
  }, [dealData]);

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "reservationsLeft" ? Number(value) : value,
    }));

    // Clear individual errors on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate Required Fields
  const validateForm = () => {
    let newErrors: Record<string, string> = {};

    if (!formData.referenceNumber)
      newErrors.referenceNumber = "Reference number is required";
    if (!formData.dealName)
      newErrors.dealName = "Deal name is required";
    if (formData.reservationsLeft < 0)
      newErrors.reservationsLeft = "Reservations cannot be negative";
    if (!formData.roomType)
      newErrors.roomType = "Room type is required";
    if (!formData.endDate)
      newErrors.endDate = "End date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Update Submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Prepare data to send
    const updatedDeal = {
      id: formData.id,
      referenceNumber: formData.referenceNumber,
      dealName: formData.dealName,
      reservationsLeft: formData.reservationsLeft,
      endDate: formData.endDate,
      roomType: formData.roomType,
      status: formData.status,
    };

    console.log("Final Update Payload:", updatedDeal);
    /*
    try {
      const response = await fetch(`/api/deals/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDeal),
      });

      if (!response.ok) {
        throw new Error("Failed to update deal");
      }

      const data = await response.json();
      console.log("Updated successfully:", data);
    } catch (error) {
      console.error("Update error:", error);
    }
    */

    // Pass updated data back to parent
    onUpdate(updatedDeal);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Update Deal
        </h2>
        <div className="space-y-4">
          {/* Reference Number */}
          <div>
            <label className="block text-sm text-gray-700">Reference Number</label>
            <input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              className="text-black w-full px-3 py-2 border rounded-lg"
            />
            {errors.referenceNumber && (
              <p className="text-red-500 text-sm">{errors.referenceNumber}</p>
            )}
          </div>

          {/* Deal Name */}
          <div>
            <label className="block text-sm text-gray-700">Deal Name</label>
            <input
              type="text"
              name="dealName"
              value={formData.dealName}
              onChange={handleChange}
              className="text-black w-full px-3 py-2 border rounded-lg"
            />
            {errors.dealName && (
              <p className="text-red-500 text-sm">{errors.dealName}</p>
            )}
          </div>

          {/* Reservations Left */}
          <div>
            <label className="block text-sm text-gray-700">Reservations Left</label>
            <input
              type="number"
              name="reservationsLeft"
              value={formData.reservationsLeft}
              onChange={handleChange}
              className="text-black w-full px-3 py-2 border rounded-lg"
            />
            {errors.reservationsLeft && (
              <p className="text-red-500 text-sm">{errors.reservationsLeft}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm text-gray-700">End Date</label>
            <input
              type="text"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="text-black w-full px-3 py-2 border rounded-lg"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate}</p>
            )}
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm text-gray-700">Room Type</label>
            <input
              type="text"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="text-black w-full px-3 py-2 border rounded-lg"
            />
            {errors.roomType && (
              <p className="text-red-500 text-sm">{errors.roomType}</p>
            )}
          </div>

          {/* Status Drop-down */}
          <div>
            <label className="block text-sm text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="text-black w-full px-3 py-2 border rounded-lg"
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Full">Full</option>
              <option value="Inactive">Inactive</option>
              <option value="New">New</option>
              <option value="Finished">Finished</option>
            </select>
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          {isUpdating ? "Updating..." : "Update Deal"}
        </button>
      </div>
    </div>
  );
}

/* */
import React, { useState } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // ✅ Added

interface DealModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dealData: any) => void;
}

export default function DealModel({ isOpen, onClose, onSave }: DealModelProps) {
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    dealName: "",
    referenceNumber: "",
    tags: [] as string[],
    price: "",
    description: "",
    roomType: [] as string[],
    discount: "",
    startDate: "",
    endDate: "",
    reservationsLeft: "20" // Added default
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // Track which dropdown is open
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tagOptions = ["Family", "Seasonal", "VIP", "Weekend", "Holiday", "Special Offer"];
  const roomTypeOptions = ["Single", "Double", "Triple", "VIP", "Suite", "Deluxe"];

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  // ✅ Fixed: Now allows multiple room types
  const handleRoomTypeToggle = (roomType: string) => {
    setFormData(prev => ({
      ...prev,
      roomType: prev.roomType.includes(roomType)
        ? prev.roomType.filter(t => t !== roomType)
        : [...prev.roomType, roomType]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);

    if (!formData.dealName || !formData.referenceNumber || !formData.price || !formData.startDate || !formData.endDate) {
      alert("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
        reservationsLeft: parseInt(formData.reservationsLeft) || 0,
        roomTypes: formData.roomType, // Backend expects 'roomTypes'
        status: "New",
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/deals`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        onSave(requestData);
        onClose();
        // Reset form
        setFormData({ 
            dealName: "", referenceNumber: "", tags: [], price: "", description: "", 
            roomType: [], discount: "", startDate: "", endDate: "", reservationsLeft: "20" 
        });
      } else {
        const err = await response.json();
        alert(err.error || "Failed to create deal");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create deal");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to close dropdowns when clicking outside
  const closeDropdowns = () => setActiveDropdown(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">Add New Deal</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name <span className="text-red-500">*</span></label>
                <input name="dealName" value={formData.dealName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. Summer Special" />
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference No <span className="text-red-500">*</span></label>
                <input name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. SUM-2026" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tags Dropdown */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <button 
                        type="button" 
                        onClick={() => setActiveDropdown(activeDropdown === 'tags' ? null : 'tags')} 
                        className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg bg-white flex justify-between items-center focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <span className="truncate">{formData.tags.length ? formData.tags.join(", ") : "Select Tags"}</span>
                        <ChevronDown size={16} className="text-gray-500"/>
                    </button>
                    
                    {activeDropdown === 'tags' && (
                        <>
                            {/* Backdrop to close on click outside */}
                            <div className="fixed inset-0 z-20 cursor-default" onClick={closeDropdowns}></div>
                            <div className="absolute z-30 w-full bg-white border border-gray-200 mt-1 shadow-xl rounded-lg max-h-48 overflow-y-auto">
                                {tagOptions.map(tag => (
                                    <div 
                                        key={tag} 
                                        onClick={() => handleTagToggle(tag)} 
                                        className={`px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-sm ${formData.tags.includes(tag) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    >
                                        {tag}
                                        {formData.tags.includes(tag) && <Check size={14} />}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) <span className="text-red-500">*</span></label>
                    <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="Details about the deal..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Room Type Dropdown */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                    <button 
                        type="button" 
                        onClick={() => setActiveDropdown(activeDropdown === 'room' ? null : 'room')} 
                        className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg bg-white flex justify-between items-center focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <span className="truncate">{formData.roomType.length ? formData.roomType.join(", ") : "Select Type"}</span>
                        <ChevronDown size={16} className="text-gray-500"/>
                    </button>
                    
                    {activeDropdown === 'room' && (
                        <>
                            <div className="fixed inset-0 z-20 cursor-default" onClick={closeDropdowns}></div>
                            <div className="absolute z-30 w-full bg-white border border-gray-200 mt-1 shadow-xl rounded-lg max-h-48 overflow-y-auto">
                                {roomTypeOptions.map(type => (
                                    <div 
                                        key={type} 
                                        onClick={() => handleRoomTypeToggle(type)} 
                                        className={`px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-sm ${formData.roomType.includes(type) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    >
                                        {type}
                                        {formData.roomType.includes(type) && <Check size={14} />}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Discount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input name="discount" type="number" value={formData.discount} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>

                {/* Reservations Left (New Field) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quota</label>
                    <input name="reservationsLeft" type="number" value={formData.reservationsLeft} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="20" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-red-500">*</span></label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700" />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center">
                    {isSubmitting ? "Saving..." : "Create Deal"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
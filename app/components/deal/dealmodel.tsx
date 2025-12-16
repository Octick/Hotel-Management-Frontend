import React, { useState } from "react";
import { X, Calendar, Tag, ChevronDown, ChevronUp } from "lucide-react";

interface DealModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dealData: DealFormData) => void;
}

interface DealFormData {
  dealName: string;
  referenceNumber: string;
  tags: string[];
  price: string;
  description: string;
  roomType: string[];
  discount: string;
  startDate: string;
  endDate: string;
}

export default function DealModel({ isOpen, onClose, onSave }: DealModelProps) {
  const [formData, setFormData] = useState<DealFormData>({
    dealName: "",
    referenceNumber: "",
    tags: [],
    price: "",
    description: "",
    roomType: [],
    discount: "",
    startDate: "",
    endDate: "",
  });

  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showRoomTypeDropdown, setShowRoomTypeDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCancel = () => onClose();
  const clearAllTags = () => setFormData(prev => ({ ...prev, tags: [] }));
  const clearAllRoomTypes = () => setFormData(prev => ({ ...prev, roomType: [] }));

  const tagOptions = ["Family", "Seasonal", "VIP", "Weekend", "Holiday", "Special Offer", "Last Minute"];
  const roomTypeOptions = ["Single", "Double", "Triple", "VIP", "Suite", "Deluxe", "Executive"];

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

  const handleRoomTypeToggle = (roomType: string) => {
    setFormData(prev => ({
      ...prev,
      roomType: [roomType]
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form validation
    if (!formData.dealName || !formData.referenceNumber || !formData.price || !formData.startDate || !formData.endDate) {
      console.log("Please fill all required fields");
      alert("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Add API endpoint here
      const API = "/api/deals";

      // Prepare data for API
      const requestData = {
        dealName: formData.dealName,
        referenceNumber: formData.referenceNumber,
        tags: formData.tags,
        price: parseFloat(formData.price),
        description: formData.description,
        roomTypes: formData.roomType,
        discount: parseFloat(formData.discount) || 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: "Ongoing",
        reservationsLeft: 0
      };

      const response = await fetch(API, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const newDeal = await response.json();
        console.log("Deal created successfully", newDeal);
        onSave(formData);
        onClose();
      } else {
        console.log("Failed to create deal");
        alert("Failed to create deal. Please try again.");
      }

      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("API would be called with:", requestData);
      console.log("API endpoint would be:", API);

      // Call the onSave callback with form data
      onSave(formData);
      onClose();

    } catch (error) {
      console.error("Deal creation failed", error);
      alert("Failed to create deal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Add New Deal</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors" type="button">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Deal Name Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Deal name</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter deal name</label>
                <input
                  type="text"
                  name="dealName"
                  value={formData.dealName}
                  onChange={handleInputChange}
                  placeholder="Enter deal name"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference number</label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleInputChange}
                  placeholder="Enter reference number"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tags and Price Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1"><div className="h-4 w-4" />Tags</span>
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTagDropdown(!showTagDropdown)}
                    className="w-full flex flex-wrap items-center gap-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[42px]"
                  >
                    {formData.tags.length === 0 ? (
                      <span className="text-gray-500">Select tags</span>
                    ) : (
                      formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTagToggle(tag);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}

                    <span className="ml-auto">
                      {showTagDropdown ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </span>
                  </button>

                  {showTagDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      <div className="text-black p-2">
                        {tagOptions.map(tag => (
                          <div
                            key={tag}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 rounded ${formData.tags.includes(tag) ? "bg-blue-50 text-blue-700" : ""
                              }`}
                            onClick={() => handleTagToggle(tag)}
                          >
                            <div className="flex items-center justify-between">
                              <span>{tag}</span>
                              {formData.tags.includes(tag) && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter the price of deal"
                    className="text-black w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Room Facility Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Room facility</label>
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a description...."
                rows={3}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Room Type and Discount Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room type</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRoomTypeDropdown(!showRoomTypeDropdown)}
                    className="w-full flex flex-wrap items-center gap-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[42px]"
                  >
                    {formData.roomType.length === 0 ? (
                      <span className="text-gray-500">Select room type</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {formData.roomType[0]}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearAllRoomTypes();
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    <span className="ml-auto">
                      {showRoomTypeDropdown ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </span>
                  </button>

                  {showRoomTypeDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      <div className="text-black p-2">
                        {roomTypeOptions.map(roomType => (
                          <div
                            key={roomType}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 rounded ${formData.roomType.includes(roomType) ? "bg-blue-50 text-blue-700" : ""
                              }`}
                            onClick={() => handleRoomTypeToggle(roomType)}
                          >
                            <div className="flex items-center justify-between">
                              <span>{roomType}</span>
                              {formData.roomType.includes(roomType) && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="Enter discount value"
                    className="text-black w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Start date</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />End date</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
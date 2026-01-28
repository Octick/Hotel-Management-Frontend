"use client";

import { auth } from "@/app/lib/firebase";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Package {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    maxParticipants: number;
    price: number;
    duration: string;
    vehicle: string;
    status: string;
    location: string;
    images?: string[]; // ✅ Added images field
}

interface AddPackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    packageData?: Package | null;
    isEditMode?: boolean;
    onUpdate?: (updatedPackage: any) => void;
}

export default function AddPackageModal({
    isOpen,
    onClose,
    packageData = null,
    isEditMode = false,
    onUpdate
}: AddPackageModalProps) {
    const [formData, setFormData] = useState({
        packageName: "",
        destination: "",
        duration: "1",
        basePrice: "",
        maxParticipants: "1",
        description: "",
        vehicleType: "Car",
        vehicleName: "",
        vehicleCapacity: "4",
        isActive: true,
        images: [] as string[] // ✅ Added images field
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Initialize form with package data when in edit mode
    useEffect(() => {
        if (isEditMode && packageData) {
            const durationNum = parseInt(packageData.duration) || 1;

            setFormData({
                packageName: packageData.name,
                destination: packageData.location,
                duration: durationNum.toString(),
                basePrice: packageData.price.toString(),
                maxParticipants: packageData.maxParticipants.toString(),
                description: packageData.description,
                vehicleType: "Car",
                vehicleName: packageData.vehicle,
                vehicleCapacity: "4",
                isActive: packageData.status === "Active",
                images: packageData.images || [] // ✅ Load images in edit mode
            });
        } else {
            setFormData({
                packageName: "",
                destination: "",
                duration: "1",
                basePrice: "",
                maxParticipants: "1",
                description: "",
                vehicleType: "Car",
                vehicleName: "",
                vehicleCapacity: "4",
                isActive: true,
                images: [] // ✅ Initialize empty images array
            });
        }
    }, [isEditMode, packageData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const token = await auth.currentUser?.getIdToken();
        if (!token) {
            toast.error("You must be logged in");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            name: formData.packageName,
            location: formData.destination,
            duration: `${formData.duration} day${formData.duration !== "1" ? "s" : ""}`,
            price: parseInt(formData.basePrice),
            maxParticipants: parseInt(formData.maxParticipants),
            description: formData.description,
            vehicle: formData.vehicleName,
            status: formData.isActive ? "Active" : "Inactive",
            images: formData.images // ✅ Include images in payload
        };

        try {
            if (isEditMode && packageData) {
                // Update
                const id = packageData._id || packageData.id;
                const response = await fetch(`${API_URL}/api/trips/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const updated = await response.json();
                    onUpdate?.(updated);
                    setShowSuccess(true);
                } else {
                    const err = await response.json();
                    toast.error(err.error || "Failed to update package");
                }
            } else {
                // Create
                const response = await fetch(`${API_URL}/api/trips`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    setShowSuccess(true);
                } else {
                    const err = await response.json();
                    toast.error(err.error || "Failed to create package");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onClose();
        // ✅ FIX: Dispatch event instead of reloading page
        window.dispatchEvent(new Event("refreshTripPackages"));
    };

    const handleModalClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    if (!isOpen) return null;

    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-lg w-full max-w-md p-6">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {isEditMode ? "Trip package updated!" : "New trip package created!"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {isEditMode
                                ? "Trip package has been successfully updated."
                                : "New package has been successfully created."
                            }
                        </p>
                        <button
                            onClick={handleSuccessClose}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 text-black">
                        {isEditMode ? "Edit Trip Package" : "Add New Trip Package"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Package Name *
                                </label>
                                <input
                                    type="text"
                                    name="packageName"
                                    value={formData.packageName}
                                    onChange={handleInputChange}
                                    placeholder="City Tour"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Destination *
                                </label>
                                <input
                                    type="text"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleInputChange}
                                    placeholder="City Center"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Duration (days) *
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Base Price *
                                    </label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        onChange={handleInputChange}
                                        placeholder="-"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Max Participants *
                                    </label>
                                    <input
                                        type="number"
                                        name="maxParticipants"
                                        value={formData.maxParticipants}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the trip package..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* ✅ Images Section */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Package Images (Max 4)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[0, 1, 2, 3].map((index) => (
                                        <input
                                            key={index}
                                            type="url"
                                            value={formData.images[index] || ""}
                                            onChange={(e) => {
                                                const newImages = [...formData.images];
                                                if (e.target.value) {
                                                    newImages[index] = e.target.value;
                                                } else {
                                                    newImages.splice(index, 1);
                                                }
                                                setFormData({ ...formData, images: newImages.filter(Boolean) });
                                            }}
                                            placeholder={`Image URL ${index + 1}`}
                                            disabled={isSubmitting}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4 text-black">Vehicle Type *</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-black mb-1">
                                    Vehicle Type
                                </label>
                                <select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    disabled={isSubmitting}
                                >
                                    <option value="Car">Car</option>
                                    <option value="Bus">Bus</option>
                                    <option value="Van">Van</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-black mb-1">
                                    Vehicle Name *
                                </label>
                                <input
                                    type="text"
                                    name="vehicleName"
                                    value={formData.vehicleName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Comfort Bus"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-black mb-1">
                                    Vehicle Capacity *
                                </label>
                                <input
                                    type="number"
                                    name="vehicleCapacity"
                                    value={formData.vehicleCapacity}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="isActive" className="ml-2 text-sm text-black">
                                    Active Package
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={handleModalClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {isSubmitting && (
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                )}
                                <span>
                                    {isSubmitting
                                        ? "Processing..."
                                        : isEditMode ? "Update Package" : "Create Package"
                                    }
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
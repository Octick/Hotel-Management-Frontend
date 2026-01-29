// app/dashboard/customer/RestaurantMenu/CustomOrderModal.tsx
"use client";

import { useState } from "react";

interface CustomOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderDetails: {
        description: string;
        specialInstructions: string;
        estimatedPrice?: number;
        dietaryRestrictions: string[];
        mealType: string;
        spiceLevel: string;
        portionSize: string;
        urgency: string;
        allergies: string;
    }) => void;
}

const commonDietaryRestrictions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Low-Sodium",
    "Keto",
    "Paleo",
    "Halal",
    "Kosher"
];

const mealTypes = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Beverage"
];

const spiceLevels = [
    "Mild",
    "Medium",
    "Spicy",
    "Very Spicy",
    "Custom Level"
];

const portionSizes = [
    "Small",
    "Regular",
    "Large",
    "Family Size"
];

const urgencyLevels = [
    "No Rush (30+ mins)",
    "Standard (20-30 mins)",
    "Quick (15-20 mins)",
    "Urgent (10-15 mins)"
];

export default function CustomOrderModal({ isOpen, onClose, onSubmit }: CustomOrderModalProps) {
    const [description, setDescription] = useState("");
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [estimatedPrice, setEstimatedPrice] = useState<number | "">("");
    const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState<string[]>([]);
    const [mealType, setMealType] = useState("");
    const [spiceLevel, setSpiceLevel] = useState("");
    const [portionSize, setPortionSize] = useState("");
    const [urgency, setUrgency] = useState("");
    const [allergies, setAllergies] = useState("");

    const handleSubmit = () => {
        if (!description.trim()) {
            alert("Please describe what you'd like to order");
            return;
        }

        if (!mealType) {
            alert("Please select a meal type");
            return;
        }

        onSubmit({
            description: description.trim(),
            specialInstructions: specialInstructions.trim(),
            estimatedPrice: estimatedPrice ? Number(estimatedPrice) : undefined,
            dietaryRestrictions: selectedDietaryRestrictions,
            mealType,
            spiceLevel,
            portionSize,
            urgency,
            allergies: allergies.trim()
        });

        // Reset form
        setDescription("");
        setSpecialInstructions("");
        setEstimatedPrice("");
        setSelectedDietaryRestrictions([]);
        setMealType("");
        setSpiceLevel("");
        setPortionSize("");
        setUrgency("");
        setAllergies("");
    };

    const toggleDietaryRestriction = (restriction: string) => {
        setSelectedDietaryRestrictions(prev =>
            prev.includes(restriction)
                ? prev.filter(r => r !== restriction)
                : [...prev, restriction]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Create Custom Order</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Tell us exactly what you're craving and we'll make it for you
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Meal Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Meal Type *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {mealTypes.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setMealType(type)}
                                    className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${mealType === type
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Describe Your Custom Dish *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Be as detailed as possible: What ingredients would you like? Any specific cooking style? Cultural influences? Example: 'I want a creamy pasta with grilled chicken, mushrooms, and a white wine sauce...'"
                            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            required
                        />
                    </div>

                    {/* Portion Size & Spice Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Portion Size */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Portion Size
                            </label>
                            <div className="space-y-2">
                                {portionSizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setPortionSize(size)}
                                        className={`w-full p-3 text-left text-sm font-medium rounded-lg border transition-all ${portionSize === size
                                                ? "border-green-500 bg-green-50 text-green-700"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Spice Level */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Spice Level
                            </label>
                            <div className="space-y-2">
                                {spiceLevels.map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setSpiceLevel(level)}
                                        className={`w-full p-3 text-left text-sm font-medium rounded-lg border transition-all ${spiceLevel === level
                                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dietary Restrictions */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Dietary Restrictions & Preferences
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {commonDietaryRestrictions.map((restriction) => (
                                <button
                                    key={restriction}
                                    type="button"
                                    onClick={() => toggleDietaryRestriction(restriction)}
                                    className={`p-3 text-xs font-medium rounded-lg border-2 transition-all ${selectedDietaryRestrictions.includes(restriction)
                                            ? "border-purple-500 bg-purple-50 text-purple-700"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {restriction}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Allergies */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Allergies or Serious Dietary Concerns
                        </label>
                        <input
                            type="text"
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                            placeholder="List any serious allergies or medical dietary requirements..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        />
                        <p className="text-xs text-gray-600 mt-2">
                            This information is critical for your safety. Please be specific.
                        </p>
                    </div>

                    {/* Special Instructions */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Additional Special Instructions
                        </label>
                        <textarea
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            placeholder="Any specific cooking methods, presentation preferences, ingredient substitutions, or other special requests..."
                            className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        />
                    </div>

                    {/* Estimated Price & Urgency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Estimated Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Estimated Budget (Optional)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-gray-700 font-medium">$</span>
                                <input
                                    type="number"
                                    value={estimatedPrice}
                                    onChange={(e) => setEstimatedPrice(e.target.value ? parseFloat(e.target.value) : "")}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                                Helps our chefs understand your budget expectations
                            </p>
                        </div>

                        {/* Urgency */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                How Soon Do You Need It?
                            </label>
                            <select
                                value={urgency}
                                onChange={(e) => setUrgency(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                            >
                                <option value="">Select timing...</option>
                                {urgencyLevels.map((level) => (
                                    <option key={level} value={level} className="text-gray-900">
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setDescription("");
                                setSpecialInstructions("");
                                setEstimatedPrice("");
                                setSelectedDietaryRestrictions([]);
                                setMealType("");
                                setSpiceLevel("");
                                setPortionSize("");
                                setUrgency("");
                                setAllergies("");
                            }}
                            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                        >
                            Clear Form
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!description.trim() || !mealType}
                            className="px-8 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Submit Custom Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
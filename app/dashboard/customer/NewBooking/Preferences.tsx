"use client";

import { BookingData } from "./NewBookingModal";

interface PreferencesProps {
  data: BookingData;
  updateData: (section: keyof BookingData, data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  onComplete?: () => void; // ✅ Added this
}

export default function Preferences({
  data,
  updateData,
  nextStep,
  prevStep,
}: PreferencesProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const bedTypes = [
    { value: "single", label: "Single" },
    { value: "double", label: "Double" },
    { value: "king", label: "King" },
    { value: "twin", label: "Twin" },
  ];

  const mealPlans = [
    "Select an Option",
    "Bed & Breakfast",
    "Half Board",
    "Full Board",
    "All Inclusive",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Bed Preference */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">
            Bed Preference *
          </label>
          <div className="space-y-2 sm:space-y-3">
            {bedTypes.map((bed) => (
              <label
                key={bed.value}
                className="flex items-center space-x-3 cursor-pointer py-1"
              >
                <input
                  type="radio"
                  name="bedType"
                  value={bed.value}
                  checked={data.preferences.bedType === bed.value}
                  onChange={(e) =>
                    updateData("preferences", { bedType: e.target.value })
                  }
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  required
                />
                <span className="text-sm sm:text-base text-gray-700">
                  {bed.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Meal Plan */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
            Meal Plan:
          </label>
          <select
            value={data.preferences.mealPlan || "Select an Option"}
            onChange={(e) =>
              updateData("preferences", { mealPlan: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
          >
            {mealPlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
            Special Requests
          </label>
          <textarea
            value={data.preferences.specialRequests || ""}
            onChange={(e) =>
              updateData("preferences", { specialRequests: e.target.value })
            }
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none text-black"
            placeholder="Any special requests or requirements..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6">
          <button
            type="button"
            onClick={prevStep}
            className="w-full sm:w-auto order-2 sm:order-1 bg-gray-100 text-gray-600 px-5 py-2.5 sm:py-2 text-sm rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto order-1 sm:order-2 bg-blue-500 text-white px-5 py-2.5 sm:py-2 text-sm rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm hover:shadow-md mb-3 sm:mb-0"
          >
            Next →
          </button>
        </div>
      </form>
    </div>
  );
}
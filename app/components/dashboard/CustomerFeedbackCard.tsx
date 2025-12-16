// ./app/components/dashboard/CustomerFeedbackCard.tsx

import React from "react";
import { MoreVertical } from "lucide-react";
import { mockFeedback } from "./mockData";

export default function CustomerFeedbackCard() {
    return (
        <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Customers feedback</h2>
                <MoreVertical className="h-5 w-5 text-gray-400 cursor-pointer" />
            </div>
            
            <div className="space-y-4 flex-grow">
                {mockFeedback.map((feedback, index) => (
                    <div key={index} className="flex justify-between items-start text-sm pb-4 border-b border-gray-100 last:border-b-0">
                        <div>
                            <p className="font-semibold text-gray-900">{feedback.guest}</p>
                            <p className="text-gray-600">{feedback.comment}</p>
                        </div>
                        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded ml-4 min-w-[40px] text-right">{feedback.room}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
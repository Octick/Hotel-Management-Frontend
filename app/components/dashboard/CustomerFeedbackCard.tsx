/* */
"use client";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

export default function CustomerFeedbackCard({ feedbacks: initialFeedbacks }: { feedbacks: any[] }) {
    const [feedbacks, setFeedbacks] = useState(initialFeedbacks || []);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const handleDelete = (index: number) => {
        setFeedbacks(feedbacks.filter((_, i) => i !== index));
        setOpenMenuId(null);
    };

    const toggleMenu = (index: number) => {
        setOpenMenuId(openMenuId === index ? null : index);
    };

    return (
        <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Customers feedback</h2>
            </div>
            <div className="space-y-4 flex-grow">
                {feedbacks.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No feedback yet.</p>
                ) : (
                    feedbacks.map((feedback, index) => (
                        <div key={index} className="flex justify-between items-start text-sm pb-4 border-b border-gray-100 last:border-b-0">
                            <div>
                                <p className="font-semibold text-gray-900">{feedback.guest}</p>
                                <p className="text-gray-600">{feedback.comment}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded min-w-[40px] text-right">{feedback.room}</span>
                                <div className="relative">
                                    <button
                                        onClick={() => toggleMenu(index)}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <MoreVertical className="h-4 w-4 text-gray-400 cursor-pointer" />
                                    </button>
                                    {openMenuId === index && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setOpenMenuId(null)}
                                            />
                                            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
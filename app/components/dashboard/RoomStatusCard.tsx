// ./app/components/dashboard/RoomStatusCard.tsx

import React from "react";
import { mockRoomStatus, RoomStats } from "./mockData";

export default function RoomStatusCard() {
    const { occupied, available } = mockRoomStatus;

    // Helper component to display a label and value aligned to the right.
    const StatusRow = ({ label, value }: { label: string, value: number }) => (
        <div className="flex justify-between items-center text-sm text-gray-700">
            {/* Label is regular weight */}
            <span className="text-gray-900">{label}</span>
            {/* Value is bold */}
            <span className="font-semibold text-gray-900">{value}</span>
        </div>
    );
    
    return (
        <div className="bg-white p-6 py-8 border border-gray-200 rounded-lg shadow-sm h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Room status</h2>
            <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                
                {/* 1. Occupied Rooms Status Column */}
                <div className="space-y-1">
                    {/* Header Row: Occupied rooms 104 */}
                    <div className="flex justify-between items-center pb-1 mb-2">
                        <p className="text-sm font-medium text-gray-800">Occupied rooms</p>
                        <p className="text-base font-semibold text-gray-900">{occupied.occupied}</p>
                    </div>
                    
                    {/* Status Breakdown */}
                    <div className="space-y-2">
                        <StatusRow label="Clean" value={occupied.clean} />
                        <StatusRow label="Dirty" value={occupied.dirty} />
                        <StatusRow label="Inspected" value={occupied.inspected} />
                    </div>
                </div>
                
                {/* 2. Available Rooms Status Column */}
                <div className="space-y-1">
                    {/* Header Row: Available rooms 20 */}
                    <div className="flex justify-between items-center pb-1 mb-2">
                        <p className="text-sm font-medium text-gray-800">Available rooms</p>
                        <p className="text-base font-semibold text-gray-900">{available.occupied}</p>
                    </div>
                    
                    {/* Status Breakdown */}
                    <div className="space-y-2">
                        <StatusRow label="Clean" value={available.clean} />
                        <StatusRow label="Dirty" value={available.dirty} />
                        <StatusRow label="Inspected" value={available.inspected} />
                    </div>
                </div>
            </div>
        </div>
    );
}
/* */
import React from "react";

const OverviewCard = ({ upperTitle, lowerTitle, value }: { upperTitle: string, lowerTitle: string, value: string | number }) => (
    <div className="flex flex-col px-4">
        <p className="text-xs text-gray-500 font-medium tracking-wide">{upperTitle}</p>
        <div className="flex items-baseline mt-1">
            <span className="text-2xl font-bold text-blue-600 mr-2">{value}</span>
            <span className="text-sm font-medium text-gray-800">{lowerTitle}</span>
        </div>
    </div>
);

export default function OverviewSection({ metrics }: { metrics: any }) {
    if (!metrics) return null;

    return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-x divide-gray-200">
                <OverviewCard upperTitle="Today's" lowerTitle="Check-in" value={metrics.todayCheckIns} />
                <OverviewCard upperTitle="Today's" lowerTitle="Check-out" value={metrics.todayCheckOuts} />
                <OverviewCard upperTitle="Total" lowerTitle="In hotel" value={metrics.totalInHotel} />
                <OverviewCard upperTitle="Total" lowerTitle="Available room" value={metrics.totalAvailableRoom} />
                <OverviewCard upperTitle="Total" lowerTitle="Occupied room" value={metrics.totalOccupiedRoom} />
            </div>
        </div>
    );
}
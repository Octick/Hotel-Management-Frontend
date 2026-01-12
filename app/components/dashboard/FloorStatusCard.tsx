/* */
import React from "react";

export default function FloorStatusCard({ data }: { data: any }) {
    if (!data) return null;
    const { percentage } = data;
    
    const radius = 60;
    const strokeWidth = 12;
    const halfCircumference = radius * Math.PI; 
    const progressLength = (percentage / 100) * halfCircumference;
    const progressOffset = halfCircumference - progressLength;
    const size = radius * 2 + strokeWidth;
    const svgHeight = radius + strokeWidth;

    return (
        <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Floor status</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
                <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                    <span>Completed</span>
                </div>
                <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-gray-300 mr-2"></span>
                    <span>Yet to Complete</span>
                </div>
            </div>

            <div className="flex items-center justify-center">
                <div className="relative" style={{ width: `${size}px`, height: `${svgHeight}px`, overflow: 'hidden' }}>
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} strokeDasharray={halfCircumference} strokeDashoffset={0} transform={`rotate(-180 ${size / 2} ${size / 2})`} strokeLinecap="round" />
                        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#3B82F6" strokeWidth={strokeWidth} strokeDasharray={halfCircumference} strokeDashoffset={progressOffset} transform={`rotate(-180 ${size / 2} ${size / 2})`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-4xl font-bold text-gray-900">{percentage}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
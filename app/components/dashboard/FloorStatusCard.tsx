// ./app/components/dashboard/FloorStatusCard.tsx

import React from "react";
import { mockFloorStatus } from "./mockData";

export default function FloorStatusCard() {
    const { percentage } = mockFloorStatus;
    
    const radius = 60;
    const strokeWidth = 12;
    const halfCircumference = radius * Math.PI; 

    // The amount of blue progress: 80% of the half-circumference.
    const progressLength = (percentage / 100) * halfCircumference;

    const trackGap = 2 * Math.PI * radius - halfCircumference; // half of the circle
    const progressOffset = halfCircumference - progressLength;

    const size = radius * 2 + strokeWidth;
    const svgHeight = radius + strokeWidth;

    return (
        <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
            {/* Card Header */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Floor status</h2>
            
            {/* Legend */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-8">
                <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                    <span>Competed</span>
                </div>
                <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-gray-300 mr-2"></span>
                    <span>Yet to Complete</span>
                </div>
            </div>

            {/* Main content: Half-circle progress indicator */}
            <div className="flex items-center justify-center">
                {/* Outer container to hide the bottom half (height=radius+strokeWidth) */}
                <div className="relative" style={{ width: `${size}px`, height: `${svgHeight}px`, overflow: 'hidden' }}>
                    
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        {/* Background track (gray semi-circle) */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth={strokeWidth}
                            strokeDasharray={halfCircumference} // Only dash the length of the visible arc
                            strokeDashoffset={0}
                            transform={`rotate(-180 ${size / 2} ${size / 2})`}
                            strokeLinecap="round"
                        />
                        
                        {/* Progress (blue semi-circle) */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth={strokeWidth}
                            strokeDasharray={halfCircumference} // Total arc length
                            strokeDashoffset={progressOffset} // The remaining percentage of the arc
                            transform={`rotate(-180 ${size / 2} ${size / 2})`} // Rotate to show bottom half
                            strokeLinecap="round"
                        />
                    </svg>
                    
                    {/* Percentage display */}
                    <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-4xl font-bold text-gray-900">{percentage}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
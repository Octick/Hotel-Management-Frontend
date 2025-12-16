// ./app/components/dashboard/OccupancyStatisticsCard.tsx

import React from "react";
import { Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { mockOccupancyData } from "./mockData";

export default function OccupancyStatisticsCard() {
    const data = mockOccupancyData;
    
    // Transform data for the chart
    const chartData = data.map(item => ({
        name: item.name,
        percentage: item.percentage
    }));

    return (
        <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Occupancy Statistics</h2>
                <button className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Monthly
                </button>
            </div>
            
            {/* Chart Container */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                        {/* Horizontal Grid Lines */}
                        <CartesianGrid 
                            horizontal={true} 
                            vertical={false} 
                            stroke="#E5E7EB"
                            strokeDasharray="3 3"
                        />
                        
                        {/* X-Axis - Months at the bottom */}
                        <XAxis 
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            interval={0}
                        />
                        
                        {/* Y-Axis - Percentage values on the left */}
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            tickFormatter={(value) => `${value}%`}
                            orientation="left"
                        />
                        
                        {/* Bar Chart */}
                        <Bar 
                            dataKey="percentage"
                            fill="#4C88F1"
                            radius={[2, 2, 0, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
/* */
"use client";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type TimeRange = 'monthly' | 'weekly' | 'yearly';

// Mock data for different time ranges
const monthlyData = [
    { name: 'Jan', percentage: 65 },
    { name: 'Feb', percentage: 78 },
    { name: 'Mar', percentage: 85 },
    { name: 'Apr', percentage: 72 },
    { name: 'May', percentage: 88 },
    { name: 'Jun', percentage: 92 },
];

const weeklyData = [
    { name: 'Mon', percentage: 70 },
    { name: 'Tue', percentage: 75 },
    { name: 'Wed', percentage: 82 },
    { name: 'Thu', percentage: 88 },
    { name: 'Fri', percentage: 95 },
    { name: 'Sat', percentage: 98 },
    { name: 'Sun', percentage: 90 },
];

const yearlyData = [
    { name: '2021', percentage: 68 },
    { name: '2022', percentage: 75 },
    { name: '2023', percentage: 82 },
    { name: '2024', percentage: 88 },
    { name: '2025', percentage: 92 },
    { name: '2026', percentage: 85 },
];

export default function OccupancyStatisticsCard({ data }: { data?: any[] }) {
    const [timeRange, setTimeRange] = useState<TimeRange>('monthly');

    // Select data based on time range
    const getChartData = () => {
        switch (timeRange) {
            case 'weekly':
                return weeklyData;
            case 'yearly':
                return yearlyData;
            case 'monthly':
            default:
                return data || monthlyData;
        }
    };

    const chartData = getChartData();

    return (
        <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Occupancy Statistics</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTimeRange('weekly')}
                        className={`px-3 py-1 text-sm rounded-lg flex items-center gap-1 transition-colors ${timeRange === 'weekly'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <Calendar className="h-4 w-4" />
                        Weekly
                    </button>
                    <button
                        onClick={() => setTimeRange('monthly')}
                        className={`px-3 py-1 text-sm rounded-lg flex items-center gap-1 transition-colors ${timeRange === 'monthly'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <Calendar className="h-4 w-4" />
                        Monthly
                    </button>
                    <button
                        onClick={() => setTimeRange('yearly')}
                        className={`px-3 py-1 text-sm rounded-lg flex items-center gap-1 transition-colors ${timeRange === 'yearly'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <Calendar className="h-4 w-4" />
                        Yearly
                    </button>
                </div>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid horizontal={true} vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} interval={0} />
                        <YAxis axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `${value}%`} orientation="left" />
                        <Bar dataKey="percentage" fill="#4C88F1" radius={[2, 2, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
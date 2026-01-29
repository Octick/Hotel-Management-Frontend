/* */
"use client";

import React, { useEffect, useState } from "react";
import AdminReceptionistLayout from "../../components/layout/AdminReceptionistLayout";
import OverviewSection from "../../components/dashboard/OverviewSection";
import RoomsSection from "../../components/dashboard/RoomsSection";
import RoomStatusCard from "../../components/dashboard/RoomStatusCard";
import FloorStatusCard from "../../components/dashboard/FloorStatusCard";
import OccupancyStatisticsCard from "../../components/dashboard/OccupancyStatisticsCard";
import CustomerFeedbackCard from "../../components/dashboard/CustomerFeedbackCard";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };
    fetchDashboardData();
  }, [token]);

  if (loading || !data) {
      return (
        <AdminReceptionistLayout role="admin">
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        </AdminReceptionistLayout>
      );
  }

  return (
    <AdminReceptionistLayout role="admin">
      <div className="space-y-6">
        {/* Row 1: Overview */}
        <OverviewSection metrics={data.metrics} />

        {/* Row 2: Rooms */}
        <RoomsSection rooms={data.roomTypes} />

        {/* Row 3 & 4: Status, Charts, and Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Room Status */}
            <div className="col-span-1 lg:col-span-2">
                <RoomStatusCard status={data.roomStatus} />
            </div>

            {/* Floor Status */}
            <div className="col-span-1 lg:col-span-1">
                <FloorStatusCard data={data.floorStatus} />
            </div>
            
            {/* Occupancy Statistics */}
            <div className="col-span-1 lg:col-span-2">
                <OccupancyStatisticsCard data={data.occupancyData} />
            </div>
            
            {/* Customers Feedback */}
            <div className="col-span-1 lg:col-span-1">
                <CustomerFeedbackCard feedbacks={data.feedback} />
            </div>
        </div>
      </div>
    </AdminReceptionistLayout>
  );
}
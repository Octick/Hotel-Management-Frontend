// ./app/dashboard/admin/page.tsx
"use client";

import React from "react";
import AdminReceptionistLayout from "../../components/layout/AdminReceptionistLayout";
import OverviewSection from "../../components/dashboard/OverviewSection";
import RoomsSection from "../../components/dashboard/RoomsSection";
import RoomStatusCard from "../../components/dashboard/RoomStatusCard";
import FloorStatusCard from "../../components/dashboard/FloorStatusCard";
import OccupancyStatisticsCard from "../../components/dashboard/OccupancyStatisticsCard";
import CustomerFeedbackCard from "../../components/dashboard/CustomerFeedbackCard";


export default function Dashboard() {
  return (
    <AdminReceptionistLayout role="admin">
      <div className="space-y-6">
        
        {/* Row 1: Overview */}
        <OverviewSection />

        {/* Row 2: Rooms */}
        <RoomsSection />

        {/* Row 3 & 4: Status, Charts, and Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Room Status (Takes 2/3 on large screens) */}
            <div className="col-span-1 lg:col-span-2">
                <RoomStatusCard />
            </div>

            {/* Floor Status (Takes 1/3 on large screens) */}
            <div className="col-span-1 lg:col-span-1">
                <FloorStatusCard />
            </div>
            
            {/* Occupancy Statistics (Chart - Takes 2/3 on large screens) */}
            <div className="col-span-1 lg:col-span-2">
                <OccupancyStatisticsCard />
            </div>
            
            {/* Customers Feedback (Takes 1/3 on large screens) */}
            <CustomerFeedbackCard />
        </div>

      </div>
    </AdminReceptionistLayout>
  );
}
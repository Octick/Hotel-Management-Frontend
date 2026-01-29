// ./app/components/dashboard/mockData.tsx

import { MoreVertical, Calendar } from "lucide-react";


export interface DashboardMetrics {
  todayCheckIns: number;
  todayCheckOuts: number;
  totalInHotel: number;
  totalAvailableRoom: number;
  totalOccupiedRoom: number;
}

export interface RoomData {
  type: string;
  deals: number;
  current: number;
  total: number;
  rate: number;
}

export interface RoomStats {
  occupied: number;
  clean: number;
  dirty: number;
  inspected: number;
}

export interface FloorStatus {
    percentage: number;
    status: { name: string; color: string; done: boolean }[];
}

export interface OccupancyData {
    name: string;
    percentage: number;
}

export interface Feedback {
  guest: string;
  comment: string;
  room: string;
}

// --- Mock Data matching the Screenshot values ---

export const mockDashboardMetrics: DashboardMetrics = {
  todayCheckIns: 23,
  todayCheckOuts: 13,
  totalInHotel: 60,
  totalAvailableRoom: 10,
  totalOccupiedRoom: 90,
};

export const mockRoomTypes: RoomData[] = [
  {
    type: "Single sharing",
    deals: 2,
    current: 2,
    total: 30,
    rate: 568,
  },
  {
    type: "Double sharing",
    deals: 2,
    current: 2,
    total: 35,
    rate: 1068,
  },
  {
    type: "Triple sharing",
    deals: 0,
    current: 2,
    total: 25,
    rate: 1568,
  },
  {
    type: "VIP Suit",
    deals: 0,
    current: 4,
    total: 10,
    rate: 2568,
  },
];

export const mockRoomStatus: { occupied: RoomStats; available: RoomStats } = {
  occupied: {
    occupied: 104,
    clean: 90,
    dirty: 4,
    inspected: 60,
  },
  available: {
    occupied: 20,
    clean: 30,
    dirty: 19,
    inspected: 30,
  },
};

export const mockFloorStatus: FloorStatus = {
    percentage: 80,
    status: [
        { name: "Completed", color: "text-blue-500", done: true },
        { name: "Yet to Complete", color: "text-gray-400", done: false },
    ]
};

export const mockOccupancyData: OccupancyData[] = [
    { name: "May", percentage: 95 },
    { name: "Jun", percentage: 75 },
    { name: "Jul", percentage: 85 },
    { name: "Aug", percentage: 50 },
    { name: "Sep", percentage: 100 },
    { name: "Oct", percentage: 85 },
    { name: "Nov", percentage: 80 },
    { name: "Dec", percentage: 90 },
    { name: "Jan", percentage: 95 },
    { name: "Feb", percentage: 100 },
];

export const mockFeedback: Feedback[] = [
    { guest: "Mark", comment: "Food could be better.", room: "A201" },
    { guest: "Christian", comment: "Facilities are not enough for amount paid.", room: "A101" },
    { guest: "Alexander", comment: "Room cleaning could be better.", room: "A301" },
];
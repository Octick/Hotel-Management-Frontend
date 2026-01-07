"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useAuth } from "@/app/context/AuthContext"; // Import useAuth

interface HeaderProps {
  dashboardType?: "customer" | "admin" | "receptionist";
  onSidebarToggle?: () => void;
}

export default function Header({
  dashboardType,
  onSidebarToggle,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, user } = useAuth(); // Get real user data

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const titleMap: Record<string, string> = {
    "/dashboard/admin": "Dashboard",
    "/dashboard/admin/rooms": "Room Management",
    "/dashboard/admin/bookings": "Bookings & Reservations",
    "/dashboard/admin/dining": "Dining & Menu",
    "/dashboard/admin/trip-packages": "Hotel Management",
    "/dashboard/admin/inventory": "Inventory Management",
    "/dashboard/admin/billing": "Billing",
    "/dashboard/admin/reports": "Reports & Analytics",
    "/dashboard/admin/settings": "Settings",
    "/dashboard/receptionist": "Dashboard",
    "/dashboard/receptionist/rooms": "Room Management",
    "/dashboard/receptionist/bookings": "Bookings & Reservations",
    "/dashboard/receptionist/dining": "Dining & Menu",
    "/dashboard/receptionist/trip-packages": "Hotel Management",
    "/dashboard/receptionist/billing": "Billing",
  };

  const title = titleMap[pathname] || "Hotel Management";

  // Get Display Name and Initials
  const displayName = profile?.name || user?.displayName || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const wrapperClasses =
    dashboardType === "customer"
      ? "bg-white border-b border-gray-200 px-6 py-4"
      : "bg-white border-b border-gray-200 px-6 py-4 lg:py-6";

  return (
    <header className={wrapperClasses}>
      <div className="flex items-center justify-between">
        
        {/* Left side: Title or Logo */}
        <div className="flex items-center gap-4">
          {dashboardType !== "customer" && (
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          )}

          {dashboardType === "customer" ? (
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">HM</span>
               </div>
               <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                HotelManager
               </span>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold text-gray-700">{title}</h1>
              <p className="text-sm text-gray-500">Welcome back, {displayName.split(' ')[0]}</p>
            </div>
          )}
        </div>

        {/* Right side: Notifications & Profile/Logout */}
        <div className="flex items-center space-x-4">
          <button className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors group">
            <Bell className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
            {/* Notification Dot - Conditionally render if you have notifications */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center space-x-3 bg-gray-100 rounded-xl p-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{initials}</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
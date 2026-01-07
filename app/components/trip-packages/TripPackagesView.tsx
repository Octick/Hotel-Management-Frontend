"use client";

import { useEffect, useState } from "react";
import { Clock, Users, Bus, Edit2, Power, Trash2 } from "lucide-react";
import AddPackageModal from "./AddPackageModal";
import { auth } from "@/app/lib/firebase";
import toast from "react-hot-toast";

interface Package {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  maxParticipants: number;
  price: number;
  duration: string;
  vehicle: string;
  status: string;
  location: string;
}

export default function TripPackagesView() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const fetchPackages = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const response = await fetch(`${API_URL}/api/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      } else {
        console.error('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    
    // ✅ FIX: Listen for custom refresh event
    const handleRefresh = () => fetchPackages();
    window.addEventListener("refreshTripPackages", handleRefresh);

    const unsubscribe = auth.onAuthStateChanged((user) => {
        if(user) fetchPackages();
    });

    return () => {
        unsubscribe();
        window.removeEventListener("refreshTripPackages", handleRefresh);
    };
  }, []);


  const handleEditClick = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsEditModalOpen(true);
  };

  const handleUpdatePackage = (updatedPackage: any) => {
    fetchPackages();
    setIsEditModalOpen(false);
    setEditingPackage(null);
  };

  const handleDeletePackage = async (packageId: string) => {
    if(!confirm("Are you sure you want to delete this package?")) return;

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const response = await fetch(`${API_URL}/api/trips/${packageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success("Package deleted successfully");
        setPackages(prev => prev.filter(pkg => (pkg._id || pkg.id) !== packageId));
      } else {
        toast.error('Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const handleToggleStatus = async (pkg: Package) => {
    const newStatus = pkg.status === "Active" ? "Inactive" : "Active";
    const pkgId = pkg._id || pkg.id;

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const response = await fetch(`${API_URL}/api/trips/${pkgId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        toast.success(`Status updated to ${newStatus}`);
        setPackages(prev => prev.map(packageItem => 
          (packageItem._id === pkgId || packageItem.id === pkgId) 
            ? { ...packageItem, status: newStatus } 
            : packageItem
        ));
      } else {
        toast.error('Failed to update package status');
      }
    } catch (error) {
      console.error('Error updating package status:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-black py-8">Loading packages...</div>
    );
  }

  if (packages.length === 0) {
      return (
          <div className="text-center text-gray-500 py-10">
              No trip packages found. Add one to get started!
          </div>
      )
  }

  return (
    <div className="text-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {packages.map((pkg) => {
            const pkgId = pkg._id || pkg.id;
            return (
          <div
            key={pkgId}
            className="bg-white rounded-2xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow border border-black"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <PackageIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base md:text-lg font-semibold truncate">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm truncate">
                    {pkg.location}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 md:px-3 py-1 rounded-full flex-shrink-0 ml-2 ${
                pkg.status === "Active" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-700"
              }`}>
                {pkg.status}
              </span>
            </div>

            <p className="text-gray-700 mb-4 text-xs md:text-sm leading-relaxed line-clamp-3">
              {pkg.description}
            </p>

            <div className="space-y-2 mb-4 text-gray-700 text-xs md:text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">{pkg.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-3 h-3 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">
                  Max {pkg.maxParticipants} participants
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Bus className="w-3 h-3 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">{pkg.vehicle}</span>
              </div>
            </div>

            <div className="text-blue-600 font-bold text-lg md:text-xl mb-4">
              ${pkg.price}
            </div>

            <div className="flex items-center justify-between">
              <button
                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                onClick={() => handleEditClick(pkg)}
              >
                <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button 
                className={`p-2 rounded-lg transition-colors ${
                  pkg.status === "Active" 
                    ? "bg-orange-50 text-orange-600 hover:bg-orange-100" 
                    : "bg-green-50 text-green-600 hover:bg-green-100"
                }`}
                onClick={() => handleToggleStatus(pkg)}
              >
                <Power className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button 
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                onClick={() => handleDeletePackage(pkgId!)}
              >
                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        )})}
      </div>

      <AddPackageModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPackage(null);
        }}
        packageData={editingPackage}
        isEditMode={true}
        onUpdate={handleUpdatePackage}
      />
    </div>
  );
}

function PackageIcon() {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#1954EB"
        className="w-4 h-4 md:w-5 md:h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6h9.75M10.5 6L6.75 18.75L12 13.5l2.25 2.25L18 9.75m-7.5-3.75H3.75"
        />
      </svg>
    )
}
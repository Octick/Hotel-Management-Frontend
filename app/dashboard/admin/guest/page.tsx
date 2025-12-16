"use client";

import { useState, useEffect } from "react";
import AdminReceptionistLayout from "../../../components/layout/AdminReceptionistLayout";
import { Search, Filter, MoreVertical } from "lucide-react";
import GuestModel from "../../../components/guest/guestmodel";
import GuestModelUpdate from "../../../components/guest/guestmodelupdate";


interface Reservation {
    id: string;
    name: string;
    roomNumber: string;
    totalAmount: number;
    amountPaid: number;
    status: 'Clean' | 'Dirty' | 'Inspected' | 'Pick up';
}

export default function Page() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'checkIn' | 'checkOut'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoading(true);
            //Add your API
            const API = "/api/reservations";
            try {
                // MOCK DATA
                const mockData: Reservation[] = [
                    { id: "#5644", name: "Alexander", roomNumber: "A647", totalAmount: 467, amountPaid: 200, status: 'Clean' },
                    { id: "#6112", name: "Pegasus", roomNumber: "A456", totalAmount: 645, amountPaid: 250, status: 'Dirty' },
                    { id: "#6141", name: "Martin", roomNumber: "A645", totalAmount: 686, amountPaid: 400, status: 'Dirty' },
                    { id: "#6535", name: "Cecil", roomNumber: "A684", totalAmount: 8413, amountPaid: 2500, status: 'Inspected' },
                    { id: "#6541", name: "Luke", roomNumber: "B464", totalAmount: 841, amountPaid: 400, status: 'Clean' },
                    { id: "#9846", name: "Yadrin", roomNumber: "C648", totalAmount: 684, amountPaid: 300, status: 'Clean' },
                    { id: "#4921", name: "Kland", roomNumber: "D644", totalAmount: 984, amountPaid: 513, status: 'Pick up' },
                    { id: "#4921", name: "Kland", roomNumber: "D644", totalAmount: 984, amountPaid: 513, status: 'Pick up' },
                    { id: "#9841", name: "Turen", roomNumber: "B641", totalAmount: 984, amountPaid: 600, status: 'Dirty' },
                    { id: "#9841", name: "Turen", roomNumber: "B641", totalAmount: 984, amountPaid: 600, status: 'Dirty' },
                ];
                setTimeout(() => {
                    setReservations(mockData);
                    setIsLoading(false);
                }, 300);

                /*
                const response = await fetch(API, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setReservations(data);
                } else {
                    console.log("Failed to fetch reservations");
                }
    
                setIsLoading(false);
                */
            } catch (error) {
                console.log("Error fetching reservations", error);
                setIsLoading(false);
            }
        };

        fetchReservations();
    }, []);

    // delete reservation
    const handleDelete = async (reservationId: string) => {
        if (!window.confirm("Are you sure you want to delete this reservation? This action cannot be undone.")) {
            setOpenMenu(null);
            return;
        }
        setIsDeleting(reservationId);
        setDeleteError(null);

        try {
            //Add API here
            const API = `/api/reservations/${reservationId}`;

            /*
            // Actual API call (commented out for now)
            const response = await fetch(API, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Success - update local state
                setReservations(prev => prev.filter(res => res.id !== reservationId));
                setShowDeleteSuccess(true);
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowDeleteSuccess(false);
                }, 3000);
            } else {
                // Handle API error
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete reservation");
            }
            */

            // Mock delete (remove this when add actual API above)
            setTimeout(() => {
                setReservations(prev => prev.filter(res => res.id !== reservationId));
                setShowDeleteSuccess(true);
                setTimeout(() => {
                    setShowDeleteSuccess(false);
                }, 3000);
                console.log(`Mock deleted reservation: ${reservationId}`);
            }, 500);

        } catch (error) {
            console.log("Delete failed", error);
            setDeleteError(error instanceof Error ? error.message : "Failed to delete reservation. Please try again.");

            setTimeout(() => {
                setDeleteError(null);
            }, 5000);
        } finally {
            setIsDeleting(null);
            setOpenMenu(null);
        }
    };

    // Filter reservations based on status and search
    const getFilteredReservations = () => {
        let filtered = reservations;

        // status filter
        if (activeFilter === 'checkIn') {
            filtered = filtered.filter(res => res.status === 'Clean' || res.status === 'Inspected');
        } else if (activeFilter === 'checkOut') {
            filtered = filtered.filter(res => res.status === 'Dirty' || res.status === 'Pick up');
        }

        // search filter (search by room number)
        if (searchQuery.trim()) {
            filtered = filtered.filter(res =>
                res.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    // Pagination logic
    const filteredReservations = getFilteredReservations();
    const totalPages = Math.max(1, Math.ceil(filteredReservations.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedReservations = filteredReservations.slice(startIndex, startIndex + itemsPerPage);

    // status color
    const getStatusColor = (status: Reservation['status']) => {
        switch (status) {
            case 'Clean':
                return 'bg-blue-100 text-blue-800';
            case 'Dirty':
                return 'bg-red-100 text-red-800';
            case 'Inspected':
                return 'bg-green-100 text-green-800';
            case 'Pick up':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Reset to page 1 when filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, searchQuery]);

    const handleViewGuest = (reservation: Reservation) => {
        setSelectedGuest({
            name: reservation.name,
            registrationNumber: reservation.id,
            roomNumber: reservation.roomNumber,
            checkInDate: "2025-01-10", // Mock Data
            roomType: "Deluxe Room",   // Mock Data
            stay: "3 Nights",          // Mock Data
            discount: 150,             // Mock Data
            totalAmount: reservation.totalAmount,
            amountPaid: reservation.amountPaid,
            status: reservation.status
        });
        setIsGuestModalOpen(true);
    };

    const handleUpdateGuest = (reservation: Reservation) => {
        setSelectedGuest({
            name: reservation.name,
            registrationNumber: reservation.id,
            roomNumber: reservation.roomNumber,
            checkInDate: "2025-01-10", // Mock Data
            roomType: "Deluxe Room",   // Mock Data
            stay: "3 Nights",          // Mock Data
            discount: 150,             // Mock Data
            totalAmount: reservation.totalAmount,
            amountPaid: reservation.amountPaid,
            status: reservation.status
        });
        setIsUpdateModalOpen(true);
    };

    return (
        <AdminReceptionistLayout role="admin">
            <div className="p-6 bg-gray-50 min-h-screen">

                {/* Success and Error Messages */}
                {showDeleteSuccess && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                        Reservation deleted successfully!
                    </div>
                )}

                {deleteError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {deleteError}
                    </div>
                )}

                {/* Filter Section with Search */}
                <div className="flex items-center justify-between mb-8">
                    {/* Filter Buttons */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeFilter === 'all'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveFilter('checkIn')}
                            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeFilter === 'checkIn'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Check in
                        </button>
                        <button
                            onClick={() => setActiveFilter('checkOut')}
                            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeFilter === 'checkOut'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Check out
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-3">
                        {/* Filter Button */}
                        <button className="text-black flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by room number"
                                className="text-black pl-10 pr-3 py-2.5 w-64 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    {/* Table Header */}
                    <div className="grid grid-cols-7 bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="text-sm font-medium text-gray-700">Reservation ID</div>
                        <div className="text-sm font-medium text-gray-700">Name</div>
                        <div className="text-sm font-medium text-gray-700">Room Number</div>
                        <div className="text-sm font-medium text-gray-700">Total amount</div>
                        <div className="text-sm font-medium text-gray-700">Amount paid</div>
                        <div className="text-sm font-medium text-gray-700">Status</div>
                        <div className="text-sm font-medium text-gray-700">Actions</div>
                    </div>

                    {/* Table Body */}
                    {isLoading ? (
                        <div className="py-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500">Loading reservations...</p>
                        </div>
                    ) : paginatedReservations.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                            {searchQuery ? `No reservations found for room "${searchQuery}"` : "No reservations found"}
                        </div>
                    ) : (
                        <div>
                            {paginatedReservations.map((reservation, index) => (
                                <div
                                    key={`${reservation.id}-${index}`}
                                    className="grid grid-cols-7 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 relative"
                                >
                                    <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                                    <div className="text-sm text-gray-700">{reservation.name}</div>
                                    <div className="text-sm text-gray-700">{reservation.roomNumber}</div>
                                    <div className="text-sm font-medium text-gray-900">
                                        $ {reservation.totalAmount.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        $ {reservation.amountPaid.toLocaleString()}
                                    </div>

                                    {/* Status badge */}
                                    <div>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                reservation.status
                                            )}`}
                                        >
                                            {reservation.status}
                                        </span>
                                    </div>

                                    {/* three Dot Menu */}
                                    <div className="relative">
                                        <MoreVertical
                                            onClick={() => setOpenMenu(openMenu === index ? null : index)}
                                            className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                                        />

                                        {openMenu === index && (
                                            <div className="absolute right-6 top-6 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-20">
                                                <button
                                                    className="text-black w-full text-left px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                                                    onClick={() => {
                                                        handleViewGuest(reservation);
                                                        setOpenMenu(null);
                                                    }}
                                                    disabled={isDeleting === reservation.id}
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="text-black w-full text-left px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                                                    onClick={() => {
                                                        handleUpdateGuest(reservation);
                                                        setOpenMenu(null);
                                                    }}
                                                    disabled={isDeleting === reservation.id}
                                                >
                                                    Update
                                                </button>

                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={() => handleDelete(reservation.id)}
                                                    disabled={isDeleting === reservation.id}
                                                >
                                                    {isDeleting === reservation.id ? (
                                                        <span className="flex items-center gap-1">
                                                            <span className="animate-spin h-3 w-3 border-b border-red-600 rounded-full"></span>
                                                            Deleting...
                                                        </span>
                                                    ) : (
                                                        "Delete"
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    </div>
                </div>
            </div>

            {/* Guest View Modal */}
            <GuestModel
                isOpen={isGuestModalOpen}
                onClose={() => setIsGuestModalOpen(false)}
                guestData={selectedGuest}
            />

            {/* Guest Update Modal */}
            <GuestModelUpdate
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                guestData={selectedGuest}
                onUpdate={(updatedData) => {
                    console.log("Updated data:", updatedData);
                }}
            />

        </AdminReceptionistLayout>
    );
}
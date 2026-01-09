"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext"; // Ensure this path is correct
import BillCard, { Bill } from "../../../components/billing/BillCard";
import AdminReceptionistLayout from "../../../components/layout/AdminReceptionistLayout";
import BillFilters from "../../../components/billing/BillFilters";
import QuickActions from "../../../components/billing/QuickActions";
import BillCreation from "../../../components/billing/BillCreation";

export default function Billing() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showBillForm, setShowBillForm] = useState(false);
  const [billToView, setBillToView] = useState<Bill | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // --- 1. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const token = await user.getIdToken();
        const headers = { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // A. Fetch Users (Guests)
        const userRes = await fetch(`${API_URL}/api/users`, { headers });
        const userData = await userRes.json();
        
        // Map Users for the Dropdown
        if (Array.isArray(userData)) {
            setGuests(userData.map((u: any) => ({
                id: u._id,
                name: u.name || u.email,
                email: u.email
            })));
        }

        // B. Fetch Bookings (for linking bills)
        const bookRes = await fetch(`${API_URL}/api/bookings`, { headers });
        const bookData = await bookRes.json();
        
        // Map Bookings
        if (Array.isArray(bookData)) {
            setBookings(bookData.map((b: any) => ({
                id: b._id,
                // Handle case where guestId is populated object OR string ID
                guestId: b.guestId?._id || b.guestId, 
                roomNumber: b.roomId?.roomNumber || "N/A"
            })));
        }

        // C. Fetch Invoices
        const invRes = await fetch(`${API_URL}/api/invoices`, { headers });
        const invData = await invRes.json();

        // Map Invoices to Bill interface
        if (Array.isArray(invData)) {
            const mappedBills: Bill[] = invData.map((inv: any) => ({
              id: inv._id,
              bookingId: inv.bookingId?._id || "N/A",
              // Use populated guest data if available
              guestId: inv.bookingId?.guestId?._id || inv.guestId || "Unknown",
              guestName: inv.bookingId?.guestId?.name || "Unknown Guest", 
              items: inv.lineItems.map((item: any) => ({
                description: item.description,
                quantity: item.qty || 1,
                rate: (item.amount / (item.qty || 1)), 
                amount: item.amount,
                category: item.category || 'other'
              })),
              subtotal: inv.subtotal,
              tax: inv.tax,
              total: inv.total,
              status: inv.status,
              createdAt: new Date(inv.createdAt),
              paidAt: inv.paidAt ? new Date(inv.paidAt) : undefined
            }));
            setBills(mappedBills);
        }

      } catch (error) {
        console.error("Failed to fetch billing data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, API_URL]);

  // --- 2. FILTER LOGIC ---
  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      // Find guest name for search (using local guest list or bill data)
      const guest = guests.find((g) => g.id === bill.guestId);
      const guestName = (guest?.name || (bill as any).guestName || "").toLowerCase();
      
      const matchesSearch =
        guestName.includes(searchTerm.toLowerCase()) ||
        bill.id.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus =
        statusFilter === "all" || bill.status === statusFilter;

      let matchesDate = true;
      const billDate = new Date(bill.createdAt);
      const now = new Date();
      
      if (dateFilter === "today") {
        matchesDate = billDate.toDateString() === now.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesDate = billDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        matchesDate = billDate >= monthAgo;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bills, guests, searchTerm, statusFilter, dateFilter]);

  // Stats Calculation
  const stats = {
    total: bills.length,
    pending: bills.filter((b) => b.status === "pending").length,
    paid: bills.filter((b) => b.status === "paid").length,
    totalRevenue: bills.filter((b) => b.status === "paid").reduce((sum, b) => sum + b.total, 0),
    pendingAmount: bills.filter((b) => b.status === "pending").reduce((sum, b) => sum + b.total, 0),
  };

  const getGuestForBill = (guestId: string) => {
     return guests.find((g) => g.id === guestId) || { id: guestId, name: 'Unknown', email: '', phone: '', bookingHistory: [] };
  }

  // --- 3. HANDLERS ---
  const handleCreateBillSubmit = async (newBillData: Bill) => {
    try {
        const token = await user?.getIdToken();
        const res = await fetch(`${API_URL}/api/invoices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                bookingId: newBillData.bookingId,
                items: newBillData.items.map(i => ({
                    description: i.description,
                    qty: i.quantity,
                    amount: i.amount,
                    category: i.category
                })),
                status: newBillData.status
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to create bill");
        }
        
        // Reload page to refresh data
        window.location.reload(); 
    } catch (err: any) {
        alert("Error creating bill: " + err.message);
    }
  };

  const handleMarkPaid = async (billToUpdate: Bill) => {
    try {
        const token = await user?.getIdToken();
        const res = await fetch(`${API_URL}/api/invoices/${billToUpdate.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'paid' })
        });

        if (res.ok) {
            setBills((prev) =>
              prev.map((b) =>
                b.id === billToUpdate.id
                  ? { ...b, status: "paid", paidAt: new Date() }
                  : b
              )
            );
        }
    } catch (err) {
        console.error("Failed to mark as paid", err);
    }
  };

  if (isLoading) {
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
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
            <p className="text-gray-600 mt-1">Manage guest bills and payments</p>
          </div>
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition group"
            onClick={() => { setBillToView(null); setShowBillForm(true); }}
          >
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
            Create Bill
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="border rounded-lg p-4 text-center shadow-sm bg-white border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600 font-medium">Total Bills</div>
          </div>
          <div className="border rounded-lg p-4 text-center shadow-sm bg-yellow-50 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-yellow-700 font-medium">Pending</div>
          </div>
          <div className="border rounded-lg p-4 text-center shadow-sm bg-green-50 border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.paid}</div>
            <div className="text-sm text-green-700 font-medium">Paid</div>
          </div>
          <div className="border rounded-lg p-4 text-center shadow-sm bg-green-50 border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-1">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-green-700 font-medium">Revenue</div>
          </div>
           <div className="border rounded-lg p-4 text-center shadow-sm bg-yellow-50 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600 mb-1">${stats.pendingAmount.toLocaleString()}</div>
            <div className="text-sm text-yellow-700 font-medium">Pending Amt</div>
          </div>
        </div>

        {/* Filters */}
        <BillFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusOptions={[
            { value: "all", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          dateOptions={[
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "week", label: "This week" },
            { value: "month", label: "This month" },
          ]}
          onClearFilters={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setDateFilter("all");
          }}
        />

        {/* Create/View Modal */}
        {showBillForm && (
          <BillCreation
            onClose={() => setShowBillForm(false)}
            guests={guests} // ✅ Correctly passing fetched guests
            bookings={bookings} // ✅ Correctly passing fetched bookings
            initialGuestId=""
            initialBookingId=""
            initialStatus="pending"
            mode={billToView ? "view" : "create"}
            billToView={billToView || undefined}
            onCreateBill={handleCreateBillSubmit}
          />
        )}

        {/* Bills Grid */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bills</h3>
          <p className="text-sm text-gray-600">Showing {filteredBills.length} of {bills.length} bills</p>
        </div>

        {filteredBills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                guest={getGuestForBill(bill.guestId)}
                onView={(b) => { setBillToView(b); setShowBillForm(true); }}
                onDownload={() => console.log('Download', bill)}
                onMarkPaid={handleMarkPaid}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
          </div>
        )}

        <QuickActions onCreateBillClick={() => { setBillToView(null); setShowBillForm(true); }} />
      </div>
    </AdminReceptionistLayout>
  );
}
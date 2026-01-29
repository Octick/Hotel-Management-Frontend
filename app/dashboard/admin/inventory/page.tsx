"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, Package, AlertTriangle } from "lucide-react";
import AdminReceptionistLayout from "../../../components/layout/AdminReceptionistLayout";
import InventoryCard from "../../../components/inventory/InventoryCard";
import ItemForm from "../../../components/inventory/ItemForm";
import ItemFilters from "../../../components/inventory/ItemFilters";
// CHANGE: Import from react-toastify to match your Layout
import { toast } from "react-toastify"; 
import QuickActions from "../../../components/inventory/QuickActions";
import { useAuth } from "@/app/context/AuthContext";

export interface InventoryItem {
  id: string;
  name: string;
  category: "food" | "beverage" | "cleaning" | "amenities" | "other";
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  cost: number;
  supplier?: string;
  lastRestocked?: Date;
}

export default function Inventory() {
  const { token } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    category: "food",
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: "pieces",
    cost: 0,
    supplier: "",
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Fetch Inventory Data from Backend
  const fetchInventory = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/inventory`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setInventoryItems(data);
      } else {
        console.error("Failed to fetch inventory");
      }
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.supplier &&
          item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      let matchesStock = true;
      if (stockFilter === "low") {
        matchesStock = item.currentStock <= item.minStock;
      } else if (stockFilter === "normal") {
        matchesStock =
          item.currentStock > item.minStock &&
          item.currentStock < item.maxStock * 0.9;
      } else if (stockFilter === "high") {
        matchesStock = item.currentStock >= item.maxStock * 0.9;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [inventoryItems, searchTerm, categoryFilter, stockFilter]);

  // Statistics Calculation
  const getInventoryStats = () => {
    const total = inventoryItems.length;
    const lowStock = inventoryItems.filter(
      (item) => item.currentStock <= item.minStock
    ).length;
    const highStock = inventoryItems.filter(
      (item) => item.currentStock >= item.maxStock * 0.9
    ).length;
    const categories = Array.from(
      new Set(inventoryItems.map((item) => item.category))
    ).length;
    const totalValue = inventoryItems.reduce(
      (sum, item) => sum + item.currentStock * item.cost,
      0
    );

    return { total, lowStock, highStock, categories, totalValue };
  };

  const stats = getInventoryStats();

  // --- ACTIONS IMPLEMENTATION ---

  // 1. Low Stock Alert (Popup Only)
  const handleLowStockAlert = () => {
    if (stats.lowStock > 0) {
      toast.error(`Alert: ${stats.lowStock} items are running low! Check the list.`, {
        autoClose: 5000,
      });
    } else {
      toast.success("Stock levels are good. No items are low.", {
        autoClose: 3000,
      });
    }
  };

  // 2. Stock Report (CSV Download)
  const handleStockReport = () => {
    if (inventoryItems.length === 0) {
      toast.error("No inventory data to export");
      return;
    }

    const headers = ["ID", "Name", "Category", "Current Stock", "Min Stock", "Max Stock", "Unit", "Cost", "Supplier", "Last Restocked"];
    const rows = inventoryItems.map(item => [
      item.id,
      item.name,
      item.category,
      item.currentStock,
      item.minStock,
      item.maxStock,
      item.unit,
      item.cost,
      item.supplier || "",
      item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Stock report downloaded");
  };

  // 3. Bulk Restock (Real Backend Update)
  const handleBulkRestock = async () => {
    if (!token) return;

    // Identify items that need restocking
    const itemsToRestock = inventoryItems.filter(item => item.currentStock <= item.minStock);

    if (itemsToRestock.length === 0) {
      toast.success("No items need restocking right now!");
      return;
    }

    if (!window.confirm(`Are you sure you want to restock ${itemsToRestock.length} items to their maximum level?`)) {
      return;
    }

    // React-toastify loading toast
    const toastId = toast.loading("Processing bulk restock...");
    let successCount = 0;

    try {
      // Update each item in the backend
      await Promise.all(itemsToRestock.map(async (item) => {
        const res = await fetch(`${API_URL}/api/inventory/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...item,
            currentStock: item.maxStock,
            lastRestocked: new Date()
          })
        });
        if (res.ok) successCount++;
      }));

      // Update the loading toast to success
      toast.update(toastId, {
        render: `Successfully restocked ${successCount} items`,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      
      fetchInventory(); // Refresh list from backend
    } catch (error) {
      // Update the loading toast to error
      toast.update(toastId, {
        render: "Some items failed to restock",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  // --- EXISTING HANDLERS (Connected to Backend) ---

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem(item);
    setShowAddForm(true);
  };

  const handleRestockItem = async (item: InventoryItem) => {
    if (!token) return;
    const newStock = item.maxStock;
    
    try {
      const res = await fetch(`${API_URL}/api/inventory/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...item,
          currentStock: newStock,
          lastRestocked: new Date()
        })
      });

      if (res.ok) {
        toast.success(`${item.name} restocked to ${newStock} ${item.unit}`);
        fetchInventory();
      } else {
        toast.error("Failed to restock item");
      }
    } catch (error) {
      toast.error("Error restocking item");
    }
  };

  const handleUpdateStock = async (item: InventoryItem, newStock: number) => {
    if (!token) return;
    const safeStock = Math.max(0, newStock);
    
    try {
        const res = await fetch(`${API_URL}/api/inventory/${item.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...item,
                currentStock: safeStock
            })
        });

        if (res.ok) {
            toast.success(`${item.name} stock updated to ${safeStock} ${item.unit}`);
            fetchInventory();
        } else {
            toast.error("Failed to update stock");
        }
    } catch (error) {
        toast.error("Error updating stock");
    }
  };

  const handleFormSave = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormErrors({});
    setNewItem({
      name: "",
      category: "food",
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: "pieces",
      cost: 0,
      supplier: "",
    });
    
    toast.success(editingItem ? "Item updated successfully" : "Item added successfully");
    fetchInventory();
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    if (!token) return;
    
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
        try {
            const res = await fetch(`${API_URL}/api/inventory/${item.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                toast.success(`${item.name} deleted successfully`);
                fetchInventory();
            } else {
                toast.error("Failed to delete item");
            }
        } catch (error) {
            toast.error("Error deleting item");
        }
    }
  };

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "food", label: "Food" },
    { value: "beverage", label: "Beverage" },
    { value: "cleaning", label: "Cleaning" },
    { value: "amenities", label: "Amenities" },
    { value: "other", label: "Other" },
  ];

  const stockOptions = [
    { value: "all", label: "All Stock Levels" },
    { value: "low", label: "Low Stock" },
    { value: "normal", label: "Normal Stock" },
    { value: "high", label: "High Stock" },
  ];

  if (loading) {
     return <AdminReceptionistLayout role="admin"><div className="flex justify-center items-center h-64">Loading inventory...</div></AdminReceptionistLayout>;
  }

  return (
    <AdminReceptionistLayout role="admin">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Inventory Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage hotel inventory items
            </p>
          </div>

          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition group"
            onClick={() => {
                setEditingItem(null);
                setNewItem({
                    name: "",
                    category: "food",
                    currentStock: 0,
                    minStock: 0,
                    maxStock: 0,
                    unit: "pieces",
                    cost: 0,
                    supplier: "",
                });
                setShowAddForm(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
            Add Item
          </button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition bg-white border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Items</div>
          </div>
          <div className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition bg-red-50 border-red-200">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {stats.lowStock}
            </div>
            <div className="text-sm text-red-700 font-medium">Low Stock</div>
          </div>
          <div className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition bg-green-50 border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.highStock}
            </div>
            <div className="text-sm text-green-700 font-medium">High Stock</div>
          </div>
          <div className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition bg-blue-50 border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.categories}
            </div>
            <div className="text-sm text-blue-700 font-medium">Categories</div>
          </div>
          <div className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition bg-yellow-50 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              ${stats.totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-yellow-700 font-medium">
              Total Value
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStock > 0 && (
          <div className="card bg-red-50 border border-red-200 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Low Stock Alert
                </h3>
                <p className="text-red-700">
                  {stats.lowStock} item{stats.lowStock !== 1 ? "s" : ""}{" "}
                  {stats.lowStock !== 1 ? "are" : "is"} running low on stock and
                  need{stats.lowStock === 1 ? "s" : ""} to be restocked.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div id="inventory-filters">
        <ItemFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          categoryOptions={categoryOptions}
          stockOptions={stockOptions}
          onClearFilters={() => {
            setSearchTerm("");
            setCategoryFilter("all");
            setStockFilter("all");
          }}
        />
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <ItemForm
            newItem={newItem}
            setNewItem={setNewItem}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            editingItem={editingItem}
            onClose={() => {
              setShowAddForm(false);
              setEditingItem(null);
            }}
            onSave={handleFormSave}
          />
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Inventory Items
          </h3>
          <p className="text-sm text-gray-600">
            Showing {filteredItems.length} of {inventoryItems.length} items
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onRestock={handleRestockItem}
                onUpdateStock={handleUpdateStock}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No inventory items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more items.
            </p>
          </div>
        )}

        {/* Quick Actions - Connected to Real Handlers */}
        <QuickActions
          onAddNewItem={() => {
            setEditingItem(null);
            setNewItem({
              name: "",
              category: "food",
              currentStock: 0,
              minStock: 0,
              maxStock: 0,
              unit: "pieces",
              cost: 0,
              supplier: "",
            });
            setShowAddForm(true);
          }}
          onBulkRestock={handleBulkRestock}
          onStockReport={handleStockReport}
          onLowStockAlert={handleLowStockAlert}
        />
      </div>
    </AdminReceptionistLayout>
  );
}
import React from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Edit,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

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

interface InventoryCardProps {
  item: InventoryItem;
  onEdit?: (item: InventoryItem) => void;
  onRestock?: (item: InventoryItem) => void;
  onUpdateStock?: (item: InventoryItem, newStock: number) => void;
  onDelete?: (item: InventoryItem) => void;
}

export default function InventoryCard({
  item,
  onEdit,
  onRestock,
  onUpdateStock,
  onDelete,
}: InventoryCardProps): React.ReactElement {
  // Category icon
  const getCategoryIcon = (category: InventoryItem["category"]) => {
    switch (category) {
      case "food":
        return "🍽️";
      case "beverage":
        return "🥤";
      case "cleaning":
        return "🧽";
      case "amenities":
        return "🛁";
      case "other":
        return "📦";
      default:
        return "📦";
    }
  };

  // Category colors
  const getCategoryColor = (category: InventoryItem["category"]) => {
    switch (category) {
      case "food":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "beverage":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cleaning":
        return "bg-green-100 text-green-800 border-green-200";
      case "amenities":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "other":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Stock status
  const getStockStatus = () => {
    if (item.currentStock <= item.minStock) {
      return {
        status: "low",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: <AlertTriangle className="h-4 w-4" />,
      };
    } else if (item.currentStock >= item.maxStock * 0.9) {
      return {
        status: "high",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: <TrendingUp className="h-4 w-4" />,
      };
    } else {
      return {
        status: "normal",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        icon: <Package className="h-4 w-4" />,
      };
    }
  };

  const stockStatus = getStockStatus();
  const stockPercentage = (item.currentStock / item.maxStock) * 100;

  return (
    <div
      className={`card flex flex-col justify-between h-full p-4 border-2 rounded-lg hover:shadow-lg transition-shadow ${stockStatus.bgColor} ${stockStatus.borderColor}`}
    >
      {/* Top Section */}
      <div className="flex-1 space-y-4">
        {/* Title & badges */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getCategoryIcon(item.category)}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {item.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
                <span
                  className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} ${stockStatus.bgColor} ${stockStatus.borderColor} border`}
                >
                  {stockStatus.icon}
                  <span className="ml-1 capitalize">
                    {stockStatus.status} stock
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Edit/Delete buttons */}
          <div className="flex items-center space-x-1">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Edit item"
              >
                <Edit className="h-4 w-4 text-gray-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="p-2 hover:bg-red-100 rounded-lg"
                title="Delete item"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            )}
          </div>
        </div>

        {/* Stock Level */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Current Stock</span>
            <span className="font-semibold text-lg text-gray-900">
              {item.currentStock} {item.unit}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                stockStatus.status === "low"
                  ? "bg-red-500"
                  : stockStatus.status === "high"
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Min: {item.minStock}</span>
            <span>Max: {item.maxStock}</span>
          </div>
        </div>

        {/* Cost & Supplier */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Cost per unit</span>
            <span className="font-medium text-gray-900">${item.cost}</span>
          </div>
          {item.supplier && (
            <div className="flex justify-between">
              <span className="text-gray-600">Supplier</span>
              <span className="font-medium text-gray-900">{item.supplier}</span>
            </div>
          )}
          {item.lastRestocked && (
            <div className="flex justify-between">
              <span className="text-gray-600">Last restocked</span>
              <span className="font-medium text-gray-900">
                {format(new Date(item.lastRestocked), "MMM dd, yyyy")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex space-x-2 mt-4">
        {onUpdateStock && (
          <>
            <button
              onClick={() =>
                onUpdateStock(item, Math.max(0, item.currentStock - 1))
              }
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => onUpdateStock(item, item.currentStock + 1)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </>
        )}
        {onRestock && (
          <button
            onClick={() => onRestock(item)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Restock
          </button>
        )}
      </div>
    </div>
  );
}

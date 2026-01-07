"use client";

import React from "react";
import RoomCard, { Room } from "./RoomCard";
import { Edit, Eye, Trash2 } from "lucide-react";
// Removed unnecessary imports (toast, auth) since this is now just a UI component

interface RoomsListProps {
  rooms: Room[];
  viewMode: "grid" | "list";
  onEdit: (room: Room) => void;
  onView: (room: Room) => void;
  onStatusChange: (roomId: string, status: any) => void;
  onCheckIn: (room: Room) => void;
  onCheckOut: (room: Room) => void;
  onDelete: (room: Room) => void;
}

export default function RoomsList({
  rooms,
  viewMode,
  onEdit,
  onView,
  onStatusChange,
  onCheckIn,
  onCheckOut,
  onDelete,
}: RoomsListProps): React.ReactElement {
  
  // ✅ FIX: Removed redundant handleDelete and handleStatusChange with API calls.
  // We now pass the props directly to the UI elements.
  
  if (rooms.length === 0)
    return (
      <div className="text-center py-12 text-gray-600">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No rooms found
        </h3>
        Try adjusting your filters to see more results.
      </div>
    );

  if (viewMode === "grid")
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.id || room._id}
            room={room}
            onEdit={onEdit}
            onView={onView}
            // Pass the parent's handler directly
            onStatusChange={onStatusChange}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
            onDelete={onDelete}
          />
        ))}
      </div>
    );

  // List / Table View
  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Room", "Type", "Status", "Rate", "Floor", "Actions"].map(
              (header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rooms.map((room) => {
             const roomId = room.id || room._id;
             return (
            <tr key={roomId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                Room {room.number || room.roomNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-900">
                {room.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    room.status?.toLowerCase() === "available"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : room.status?.toLowerCase() === "occupied"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : room.status?.toLowerCase() === "reserved"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : room.status?.toLowerCase() === "cleaning"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  {room.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${room.rate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {room.floor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                <button
                  onClick={() => onView(room)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  title="View Room"
                >
                  <Eye className="h-5 w-5 text-indigo-600" />
                </button>

                <button
                  onClick={() => onEdit(room)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  title="Edit Room"
                >
                  <Edit className="h-5 w-5 text-blue-600" />
                </button>
                {room.status?.toLowerCase() === "cleaning" && (
                  <button
                    onClick={() => onStatusChange(roomId!, "available")}
                    className="text-green-600 hover:text-green-800"
                  >
                    Mark Clean
                  </button>
                )}
                {/* Delete button: Simply calls the parent function */}
                <button
                  onClick={() => onDelete(room)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}
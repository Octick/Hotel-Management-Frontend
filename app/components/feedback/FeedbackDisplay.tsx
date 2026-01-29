"use client";

import { Star, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface FeedbackDisplayProps {
  feedback: any;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FeedbackDisplay({
  feedback,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}: FeedbackDisplayProps) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/feedback/${feedback._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        toast.success("Feedback deleted");
        onDelete?.();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete feedback");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Header with rating and actions */}
      <div className="flex justify-between items-start">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < feedback.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={onEdit}
              className="p-2 hover:bg-blue-50 rounded text-blue-600 transition-colors"
              title="Edit feedback"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-50 rounded text-red-600 transition-colors"
              title="Delete feedback"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <h4 className="font-semibold text-gray-900">{feedback.title}</h4>
        {feedback.isEdited && (
          <p className="text-xs text-gray-500">
            Edited on{" "}
            {new Date(feedback.editedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Comment */}
      <p className="text-gray-700 text-sm">{feedback.comment}</p>

      {/* Guest info and date (if shown by staff) */}
      {feedback.guestId && (
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
          <span>{feedback.guestId.name || "Guest"}</span>
          <span>
            {new Date(feedback.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )}
    </div>
  );
}

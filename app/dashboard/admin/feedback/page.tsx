"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import AdminReceptionistLayout from "../../../components/layout/AdminReceptionistLayout";
import { auth } from "@/app/lib/firebase";
import FeedbackDisplay from "../../../components/feedback/FeedbackDisplay";

interface Feedback {
  _id: string;
  bookingId: any;
  guestId: any;
  rating: number;
  title: string;
  comment: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        const res = await fetch(`${API_URL}/api/feedback`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setFeedback(data || []);
        } else {
          toast.error("Failed to load feedback");
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchFeedback();
    });
    return () => unsubscribe();
  }, []);

  const handleFeedbackDeleted = (feedbackId: string) => {
    setFeedback(feedback.filter(f => f._id !== feedbackId));
    toast.success("Feedback deleted");
  };

  // Filter and search
  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch = 
      item.guestId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === null || item.rating === filterRating;
    
    return matchesSearch && matchesRating;
  });

  const stats = {
    total: feedback.length,
    average: feedback.length > 0 
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 0,
    fiveStars: feedback.filter(f => f.rating === 5).length,
    fourStars: feedback.filter(f => f.rating === 4).length,
  };

  return (
    <AdminReceptionistLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
          <p className="text-gray-500 mt-1">View and manage guest feedback from completed bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Total Feedback</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="text-2xl font-bold text-yellow-500 mt-1">⭐ {stats.average}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">5-Star Reviews</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{stats.fiveStars}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">4-Star Reviews</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{stats.fourStars}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by guest name, title, or comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Rating
              </label>
              <select
                value={filterRating ?? ""}
                onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Ratings</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3">⭐⭐⭐ (3 Stars)</option>
                <option value="2">⭐⭐ (2 Stars)</option>
                <option value="1">⭐ (1 Star)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>{feedback.length === 0 ? "No feedback yet" : "No feedback matches your filters"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <FeedbackDisplay
                key={item._id}
                feedback={item}
                canDelete={true}
                onDelete={() => handleFeedbackDeleted(item._id)}
              />
            ))}
          </div>
        )}
      </div>
    </AdminReceptionistLayout>
  );
}

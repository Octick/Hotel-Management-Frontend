"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import FeedbackDisplay from "@/app/components/feedback/FeedbackDisplay";
import { auth } from "@/app/lib/firebase";

interface FeedbackListProps {
  onlyLive?: boolean;
}

export default function FeedbackList({ onlyLive = true }: FeedbackListProps) {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, [API_URL]);

  const handleFeedbackDeleted = (feedbackId: string) => {
    setFeedback(feedback.filter(f => f._id !== feedbackId));
    toast.success("Feedback deleted");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!feedback || feedback.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
        <p>No feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <FeedbackDisplay
          key={item._id}
          feedback={item}
          canDelete={true}
          onDelete={() => handleFeedbackDeleted(item._id)}
        />
      ))}
    </div>
  );
}

/* */
"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function NotificationsTab() {
  const { token } = useAuth();

  // State maps to backend fields
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true
  });

  // Fetch Preferences
  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch settings: ${res.status}`);
        }
        const data = await res.json();
        setPrefs({
          emailNotifications: data.emailNotifications ?? true,
          smsNotifications: data.smsNotifications ?? false,
          lowStockAlerts: data.lowStockAlerts ?? true
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, [token]);

  // Toggle Handler (Auto-save)
  const handleToggle = async (key: string, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs); // Optimistic UI update

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPrefs)
      });

      if (!res.ok) {
        throw new Error(`Failed to save preference: ${res.status}`);
      }
      toast.success("Preference saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save preference");
      setPrefs(prefs); // Revert on error
    }
  };

  const settingsItems = [
    { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
    { key: "smsNotifications", label: "SMS Notifications", desc: "Receive notifications via SMS" },
    { key: "lowStockAlerts", label: "Low Stock Alerts", desc: "Get notified when inventory is low" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
      {settingsItems.map((item) => (
        <div key={item.key} className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={prefs[item.key as keyof typeof prefs]}
              onChange={(e) => handleToggle(item.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-full" />
          </label>
        </div>
      ))}
    </div>
  );
}
/* */
"use client";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function ProfileTab() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ fullName: "", email: "", phone: "", role: "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirmPass: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }
        const data = await res.json();
        setProfile({
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.roles?.[0] || "admin"
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: profile.fullName, phone: profile.phone })
      });
      if (!res.ok) {
        throw new Error(`Failed to update profile: ${res.status}`);
      }
      toast.success("✅ Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "❌ Failed to update profile.");
    }
    finally { setLoading(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) return toast.error("Passwords do not match");
    if (!user) return;
    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email!, passwords.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwords.newPass);
      toast.success("🔒 Password updated successfully!");
      setPasswords({ current: "", newPass: "", confirmPass: "" });
    } catch (err: any) { toast.error(`❌ ${err.message}`); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={profile.email} disabled className="w-full border border-gray-300 bg-gray-100 cursor-not-allowed rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>
        <div className="mt-6"><button type="submit" disabled={loading} className="btn btn-primary flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Save className="h-4 w-4 mr-2" /> Save Changes</button></div>
      </form>
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="password" placeholder="Current Password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <input type="password" placeholder="New Password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <input type="password" placeholder="Confirm" value={passwords.confirmPass} onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div className="mt-6"><button type="submit" disabled={loading} className="btn btn-primary flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Save className="h-4 w-4 mr-2" /> Update Password</button></div>
      </form>
    </div>
  );
}
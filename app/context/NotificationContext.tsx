"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

export interface NotificationItem {
  id: string;
  type: 'BOOKING' | 'ORDER' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
  data?: any;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const { user, profile } = useAuth(); // ✅ Get Profile to check Role
    
    // Track when the page loaded to prevent old sounds from playing
    const mountTimeRef = useRef(Date.now());
    const soundUrl = '/sounds/notification.mp3'; 

    useEffect(() => {
        // 1. Security Check: Must be logged in
        if (!user || !profile) {
            setNotifications([]);
            return;
        }

        // 2. Role Filter: CUSTOMERS SHOULD NOT SEE STAFF NOTIFICATIONS
        const isStaff = ['admin', 'receptionist', 'manager', 'kitchen'].some(role => profile.roles?.includes(role));
        if (!isStaff) {
            // If it's a customer, do nothing (or listen to a separate 'customer_notifications' collection later)
            return; 
        }

        // 3. Query: Get last 50 notifications
        const q = query(
            collection(db, 'notifications'), 
            orderBy('createdAt', 'desc'), 
            limit(50)
        );

        console.log("🔔 [Staff] Listening for notifications...");

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newNotifications: NotificationItem[] = [];
            let shouldPlaySound = false;
            
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    const docTime = data.createdAt?.seconds * 1000 || Date.now();

                    // Sound Logic:
                    // 1. Unread
                    // 2. Created AFTER page load (No sound on reload)
                    // 3. Created within last 30 seconds
                    if (!data.read && docTime > mountTimeRef.current && (Date.now() - docTime) < 30000) {
                        shouldPlaySound = true;
                        
                        toast.success(data.title, {
                            duration: 5000,
                            position: 'top-right',
                            icon: '🔔',
                            style: { border: '1px solid #2563eb', color: '#333' }
                        });
                    }
                }
            });

            if (shouldPlaySound) playSound();

            snapshot.docs.forEach(doc => {
                newNotifications.push({ id: doc.id, ...doc.data() } as NotificationItem);
            });
            
            setNotifications(newNotifications);
        }, (error) => {
            // Silent fail for permission errors to avoid console spam if rules block access
            if (error.code !== 'permission-denied') {
                console.error("Listener Error:", error);
            }
        });

        return () => unsubscribe();
    }, [user, profile]); // Re-run when profile loads

    const playSound = () => {
        try {
            const audio = new Audio(soundUrl);
            audio.play().catch(() => {}); // Ignore auto-play blocks
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    const markAsRead = async (id: string) => {
        // 1. Optimistic Update (Instant UI change)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        
        // 2. Database Update (Persist change)
        try {
            const notifRef = doc(db, 'notifications', id);
            await updateDoc(notifRef, { read: true });
        } catch (err) {
            console.error("Failed to mark as read in DB:", err);
            // Revert on failure (optional)
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        unreadIds.forEach(async (id) => {
             try {
                await updateDoc(doc(db, 'notifications', id), { read: true });
             } catch (e) { console.error(e) }
        });
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
            <Toaster />
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within NotificationProvider");
    return context;
};
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext"; // ✅ IMPORT THIS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "A comprehensive system for managing hotel operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* WRAP AUTH PROVIDER FIRST, THEN NOTIFICATION PROVIDER */}
        <AuthProvider>
          <NotificationProvider>
            {children}
            {/* Keep your existing ToastContainer for other app alerts */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
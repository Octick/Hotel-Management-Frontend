"use client";

import Header from "../common/Header";
import Navbar from "../common/Navbar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header dashboardType="customer" />
      <Navbar />
      <main className="flex-1 p-4 sm:p-6 bg-gray-50">{children}</main>
    </div>
  );
}

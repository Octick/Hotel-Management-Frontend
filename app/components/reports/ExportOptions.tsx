"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";

interface ExportOptionsProps {
  handleExportReport: (type: string) => void;
  compact?: boolean;
}

export default function ExportOptions({
  handleExportReport,
  compact = false,
}: ExportOptionsProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const reports = [
    { label: "Occupancy Report", type: "occupancy" },
    { label: "Revenue Report", type: "revenue" },
    { label: "Guest Report", type: "guest" },
    { label: "Financial Report", type: "financial" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (compact) {
    return (
      <div ref={dropdownRef} className="relative inline-block">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition group"
        >
          <Download className="h-5 w-5 mr-2" />
          Export Report
          <ChevronDown
            className={`h-4 w-4 ml-2 transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
            {reports.map((report) => (
              <button
                key={report.type}
                onClick={() => {
                  handleExportReport(report.type);
                  setOpen(false); // close after click
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {report.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full grid export buttons (desktop layout)
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">
        Export Reports
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reports.map((report) => (
          <button
            key={report.type}
            onClick={() => handleExportReport(report.type)}
            className="flex flex-col items-center justify-center h-28 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl shadow-sm transition-all duration-200 border border-gray-200"
          >
            <Download className="h-7 w-7 mb-2 text-gray-700" />
            <span className="text-sm text-center">{report.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

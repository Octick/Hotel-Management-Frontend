import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  bgColor?: string; // general background color for icon container
  textColor?: string; // general text color for icon
  subtitle?: string;
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  bgColor = "bg-gray-400",
  textColor = "text-white",
  subtitle,
  onClick, // <-- already defined
}: StatsCardProps): React.ReactElement {
  const changeClasses = {
    positive: "text-green-700 bg-green-100",
    negative: "text-red-700 bg-red-100",
    neutral: "text-gray-700 bg-gray-100",
  };

  const getTrendIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />;
      case "negative":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  return (
    <div
      onClick={onClick} // <-- added here
      className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div
          className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${bgColor}`}
        >
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
      </div>

      {change && (
        <div
          className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${changeClasses[changeType]}`}
        >
          {getTrendIcon()}
          <span className="ml-1">{change}</span>
        </div>
      )}
    </div>
  );
}

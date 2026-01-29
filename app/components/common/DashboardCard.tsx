import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export default function DashboardCard({
  title,
  value,
  icon,
}: DashboardCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      {icon && <div className="text-gray-400 mt-3 sm:mt-0">{icon}</div>}
    </div>
  );
}

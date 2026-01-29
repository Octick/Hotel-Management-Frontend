import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ChartCardProps {
  title: string;
  type: "bar" | "pie";
  data: any[];
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
}

export default function ChartCard({
  title,
  type,
  data,
  dataKey = "value",
  nameKey = "name",
  colors = ["#3b82f6", "#10b981", "#f59e0b", "#6b7280"], // default neutral colors
}: ChartCardProps): React.ReactElement {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />{" "}
              {/* light gray grid */}
              <XAxis dataKey={nameKey} stroke="#6b7280" />{" "}
              {/* neutral gray axis */}
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  borderColor: "#e5e7eb",
                }}
              />
              <Bar dataKey={dataKey} fill={colors[0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(Number(percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill={colors[0]}
                dataKey={dataKey}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  borderColor: "#e5e7eb",
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

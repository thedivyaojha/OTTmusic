import React from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";

export const DSP = ({ getDSPRevenue }) => {
  return (
    <div>
      {" "}
      <div className="bg-white rounded-xl p-6 shadow-md border-[0.5] mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          DSP Reports
        </h2>
        <p className="text-gray-600 text-center mb-6">Revenue vs Store Name</p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={getDSPRevenue()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="store" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

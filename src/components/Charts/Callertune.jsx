import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import WorldPopulationMap from "./WorldHeatMap";
import WorldHeatMap from "./WorldHeatMap";

const Callertune = ({ getStreamingData, getCallerTuneData }) => {
  const [activeTab, setActiveTab] = useState("streaming");

  return (
    <div>
      <>
        <div className="flex gap-4 border-b mb-6">
          <button
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "streaming"
                ? "border-b-2 border-amber-600 text-amber-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("streaming")}
          >
            Streaming Trend
          </button>

          <button
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "caller"
                ? "border-b-2 border-amber-600 text-amber-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("caller")}
          >
            Caller Tune Overview
          </button>

          <button
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "country"
                ? "border-b-2 border-amber-600 text-amber-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("country")}
          >
            Country Trend
          </button>
        </div>

        {activeTab === "streaming" && (
          <div className="bg-white rounded-xl p-6 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Streaming Trend
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Quantity and Revenue
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={getStreamingData()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {getStreamingData().map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "caller" && (
          <div className="bg-white rounded-xl p-6 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Caller Tune Overview
            </h2>
            <p className="text-gray-600 text-center mb-6">
              JioTunes, airtel and VI Callertune
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getCallerTuneData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="vi"
                  stackId="a"
                  fill="#FDE047"
                  name="VI Callertune"
                />
                <Bar
                  dataKey="airtel"
                  stackId="a"
                  fill="#F87171"
                  name="airtel"
                />
                <Bar
                  dataKey="jioTunes"
                  stackId="a"
                  fill="#60A5FA"
                  name="JioTunes"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "country" && (
       
              <WorldHeatMap />
              
            
        )}
      </>
    </div>
  );
};

export default Callertune;

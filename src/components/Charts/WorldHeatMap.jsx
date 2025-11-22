import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import Papa from "papaparse";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// City coordinates mapping
const cityCoordinates = {
  "Kolkata": [88.3639, 22.5726],
  "Mumbai": [72.8777, 19.0760],
  "Delhi": [77.1025, 28.7041],
  "Bangalore": [77.5946, 12.9716],
  "Chennai": [80.2707, 13.0827],
  "Hyderabad": [78.4867, 17.3850],
  "Pune": [73.8567, 18.5204],
  "Ahmedabad": [72.5714, 23.0225],
  "Jaipur": [75.7873, 26.9124],
  "Lucknow": [80.9462, 26.8467],
  "Gurgaon": [77.0266, 28.4595],
  "Noida": [77.3910, 28.5355],
  "Chandigarh": [76.7794, 30.7333],
  "Indore": [75.8577, 22.7196],
  "Bhopal": [77.4126, 23.2599],
};

export default function IndiaHeatMap() {
  const [cityData, setCityData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [hoveredCity, setHoveredCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("india");

  const loadCSVData = async () => {
    try {
      const response = await fetch('/public/data/wynk-report.csv');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          processData(results.data);
        },
        error: (error) => {
          setError(`CSV parsing error: ${error.message}`);
          setLoading(false);
        }
      });
    } catch (err) {
      setError(`Failed to load CSV: ${err.message}. Make sure the file exists at public/data/wynk-report.csv`);
      setLoading(false);
    }
  };

  const processData = (data) => {
    const cityTotals = {};

    data.forEach(row => {
      const cityName = row.file_name?.trim();
      const streams = parseInt(row.total) || 0;
      const income = parseFloat(row.income) || 0;
      const royalty = parseFloat(row.royality) || 0;

      if (cityName && cityCoordinates[cityName]) {
        if (!cityTotals[cityName]) {
          cityTotals[cityName] = {
            name: cityName,
            coordinates: cityCoordinates[cityName],
            streams: 0,
            income: 0,
            royalty: 0,
            songs: 0
          };
        }
        cityTotals[cityName].streams += streams;
        cityTotals[cityName].income += income;
        cityTotals[cityName].royalty += royalty;
        cityTotals[cityName].songs += 1;
      }
    });

    const citiesArray = Object.values(cityTotals).sort((a, b) => b.streams - a.streams);
    setCityData(citiesArray);
    setLoading(false);
  };

  useEffect(() => {
    loadCSVData();
  }, []);

  const maxValue = cityData.length > 0 ? Math.max(...cityData.map(city => city.streams)) : 1;

  const getColor = (value) => {
    const intensity = value / maxValue;                 // 0 → 1
  
    const r = Math.round(255 * (1 - intensity));        // Red fades out
    const g = Math.round(120 * intensity);              // Green grows but stays dark (max 120)
    const b = 0;
  
    return `rgb(${r}, ${g}, ${b})`;
  };
  

  const getMarkerSize = (value) => {
    return 5 + (value / maxValue) * 15;
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Country Trend</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-gray-600 text-sm mt-2">
            Expected file location: public/data/wynk-report.csv
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-5">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          India Music Distribution Heat Map
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Wynk Music Streaming Analytics by City
        </p>

        <div className="flex justify-center mb-4">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="india">India View</option>
            <option value="world">World View</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={
              viewMode === "india"
                ? { center: [78, 22], scale: 1000 }
                : { center: [0, 20], scale: 140 }
            }
            width={800}
            height={500}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isIndia = geo.id === "IND";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isIndia ? "#f0f9ff" : "#f3f4f6"}
                      stroke="#cbd5e1"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {cityData.map((city) => (
              <Marker
                key={city.name}
                coordinates={city.coordinates}
                onMouseEnter={() => {
                  setHoveredCity(city.name);
                  setTooltipContent(
                    `${city.name}: ${city.streams.toLocaleString()} streams | ${city.songs} songs | ₹${city.income.toFixed(2)}`
                  );
                }}
                onMouseLeave={() => {
                  setHoveredCity(null);
                  setTooltipContent("");
                }}
              >
                <circle
                  r={getMarkerSize(city.streams)}
                  fill={getColor(city.streams)}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{
                    cursor: "pointer",
                    opacity: hoveredCity === city.name ? 1 : 0.8,
                    transition: "all 0.2s",
                  }}
                />
                {hoveredCity === city.name && (
                  <text
                    textAnchor="middle"
                    y={-20}
                    style={{
                      fontFamily: "system-ui",
                      fontSize: "12px",
                      fontWeight: "bold",
                      fill: "#1f2937",
                    }}
                  >
                    {city.name}
                  </text>
                )}
              </Marker>
            ))}
          </ComposableMap>
        </div>

        {tooltipContent && (
          <div className="mt-4 text-center text-white bg-gray-800 py-2 px-4 rounded-lg inline-block shadow-md">
            {tooltipContent}
          </div>
        )}

        <div className="mt-6 bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
            Top Cities by Streams
          </h3>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-gray-600 text-xs">Low</span>
            <div className="flex gap-1">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
                <div
                  key={val}
                  className="w-12 h-6 rounded"
                  style={{ backgroundColor: getColor(val * maxValue) }}
                />
              ))}
            </div>
            <span className="text-gray-600 text-xs">High</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            {cityData.slice(0, 6).map((city) => (
              <div key={city.name} className="bg-gray-50 p-3 rounded">
                <div className="font-semibold text-gray-800">{city.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  <div>{city.streams.toLocaleString()} streams</div>
                  <div>{city.songs} songs</div>
                  <div>₹{city.income.toFixed(2)} income</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
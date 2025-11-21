//
// /* App.jsx
//    Replaces the placeholder world map with a working ECharts world heatmap
//    that aggregates revenue by country (best-effort city->country mapping).
// */
//
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//     BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
// } from 'recharts';
// import { Music, DollarSign, Users, ChevronDown, Menu, X } from 'lucide-react';
// import Papa from 'papaparse';
//
// import ReactECharts from 'echarts-for-react';
// import * as echarts from 'echarts/core';
// import { MapChart } from 'echarts/charts';
// import { TooltipComponent, VisualMapComponent, TitleComponent, LegendComponent } from 'echarts/components';
// import { CanvasRenderer } from 'echarts/renderers';
// echarts.use([MapChart, TooltipComponent, VisualMapComponent, TitleComponent, CanvasRenderer, LegendComponent]);
//
// // ---------- App ----------
// export default function App() {
//     const [data, setData] = useState({ wynk: [], jio: [], airtel: [] });
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState('home');
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//     const [dropdownOpen, setDropdownOpen] = useState('');
//     const [worldGeoJson, setWorldGeoJson] = useState(null);
//     const [mapLoadingError, setMapLoadingError] = useState('');
//
//     useEffect(() => {
//         const loadCSV = async (file, key) => {
//             try {
//                 const response = await fetch(`/data/${file}`);
//                 if (!response.ok) throw new Error(`Failed to load ${file}`);
//                 const text = await response.text();
//                 return new Promise((resolve) => {
//                     Papa.parse(text, {
//                         header: true,
//                         dynamicTyping: true,
//                         skipEmptyLines: true,
//                         complete: (results) => resolve({ [key]: results.data }),
//                         error: () => resolve({ [key]: [] })
//                     });
//                 });
//             } catch (error) {
//                 return { [key]: [] };
//             }
//         };
//
//         Promise.all([
//             loadCSV('wynk-report.csv', 'wynk'),
//             loadCSV('jio-saavn-report.csv', 'jio'),
//             loadCSV('airtel-report.csv', 'airtel')
//         ]).then(results => {
//             const combined = Object.assign({}, ...results);
//             setData(combined);
//             setLoading(false);
//         });
//
//         // Load world geojson from public/data/world-geo.json
//         (async () => {
//             try {
//                 const resp = await fetch('/data/world-geo.json');
//                 if (!resp.ok) throw new Error('Failed to load world-geo.json from /data/world-geo.json');
//                 const geo = await resp.json();
//                 setWorldGeoJson(geo);
//                 // register this map with echarts
//                 echarts.registerMap('world', geo);
//             } catch (err) {
//                 console.warn(err);
//                 setMapLoadingError('World GeoJSON could not be loaded. Place world-geo.json at public/data/world-geo.json');
//             }
//         })();
//     }, []);
//
//     // ---------- Helpers for metrics ----------
//     const calculateMetrics = () => {
//         const allData = [...data.wynk, ...data.jio, ...data.airtel];
//         const totalRevenue = allData.reduce((sum, row) => sum + (parseFloat(row.income || row.Rev || row.revenue || 0) || 0), 0);
//         const songs = new Set(allData.map(row => row.song_nam || row['Song Nam'] || row.song_id).filter(Boolean));
//         const artists = new Set(allData.map(row => row.artist || row.artist_nam || row['Artist']).filter(Boolean));
//         return { totalRevenue, totalSongs: songs.size, totalArtists: artists.size };
//     };
//
//     const monthsStatic = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25'];
//     const getMonthlyRevenue = () => monthsStatic.map((month) => ({ month, revenue: +(Math.random() * 30 + 10).toFixed(2) }));
//
//     const getDSPRevenue = () => {
//         const stores = ['Spotify', 'YouTube', 'iTunes', 'Amazon', 'Pandora', 'Deezer', 'Tidal', 'iHeart', 'Napster', 'Apple Music', 'SoundCloud', 'Google Play', 'Tencent', 'JioSaavn', 'Gaana', 'Wynk', 'Resso', 'Boomplay', 'Anghami'];
//         return stores.slice(0, 15).map(store => ({ store, revenue: +(Math.random() * 80 + 20).toFixed(2) }));
//     };
//
//     const getStreamingData = () => [
//         { name: 'Cloud Match Units', value: 41.9, color: '#60A5FA' },
//         { name: 'Unqualified Audio', value: 21.6, color: '#F87171' },
//         { name: 'Fraudulent Streams', value: 1.0, color: '#FCA5A5' },
//         { name: 'Ad-Supported Audio', value: 5.6, color: '#93C5FD' },
//         { name: 'Short-form Video User', value: 6.1, color: '#FDE047' },
//         { name: 'Download Tracks', value: 23.7, color: '#34D399' },
//         { name: 'Streaming Bonus', value: 0.3, color: '#A78BFA' }
//     ];
//
//     const getCallerTuneData = () => Array.from({ length: 20 }, (_, i) => ({ date: `Day ${i + 1}`, jioTunes: +(Math.random() * 30 + 10).toFixed(2), airtel: +(Math.random() * 30 + 10).toFixed(2), vi: +(Math.random() * 40 + 10).toFixed(2) }));
//
//     const getArtistData = () => {
//         const allData = [...data.wynk, ...data.jio, ...data.airtel];
//         const artistRevenue = {};
//         allData.forEach(row => {
//             const artist = row.artist || row.artist_nam || 'Unknown';
//             const income = parseFloat(row.income || row.Rev || row.revenue || 0) || 0;
//             if (income > 0) artistRevenue[artist] = (artistRevenue[artist] || 0) + income;
//         });
//         return Object.entries(artistRevenue).map(([artist, revenue]) => ({ artist, revenue })).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
//     };
//
//     const getAlbumData = () => {
//         const allData = [...data.wynk, ...data.jio, ...data.airtel];
//         return allData.slice(0, 10).map((row) => ({ release: row.album_nam || row['Album Nam'] || 'Unknown Album', artist: row.artist || row.artist_nam || 'Unknown', projectCode: `OTTSCD${Math.floor(Math.random() * 10000)}`, revenue: +(parseFloat(row.income || row.Rev || row.revenue || 0) || 0), total: +(parseFloat(row.income || row.Rev || row.revenue || 0) || 0) }));
//     };
//
//     // ---------- City -> Country mapping (best-effort) ----------
//     // Expand this mapping with your specific city names if you need better coverage
//     const cityToCountry = {
//         // India
//         'Mumbai': 'India', 'New Delhi': 'India', 'Bengaluru': 'India', 'Bangalore': 'India', 'Chennai': 'India', 'Kolkata': 'India', 'Hyderabad': 'India', 'Ahmedabad': 'India', 'Pune': 'India', 'Jaipur': 'India',
//         // USA
//         'New York': 'United States', 'Los Angeles': 'United States', 'Chicago': 'United States', 'Houston': 'United States', 'Phoenix': 'United States', 'Philadelphia': 'United States',
//         // UK
//         'London': 'United Kingdom', 'Birmingham': 'United Kingdom', 'Manchester': 'United Kingdom',
//         // Canada
//         'Toronto': 'Canada', 'Vancouver': 'Canada', 'Montreal': 'Canada',
//         // Europe
//         'Paris': 'France', 'Berlin': 'Germany', 'Madrid': 'Spain', 'Rome': 'Italy', 'Milan': 'Italy', 'Barcelona': 'Spain',
//         // Australia
//         'Sydney': 'Australia', 'Melbourne': 'Australia', 'Brisbane': 'Australia',
//         // Russia
//         'Moscow': 'Russia', 'Saint Petersburg': 'Russia',
//         // China
//         'Beijing': 'China', 'Shanghai': 'China', 'Guangzhou': 'China', 'Shenzhen': 'China',
//         // Japan
//         'Tokyo': 'Japan', 'Osaka': 'Japan',
//         // Latin America
//         'Mexico City': 'Mexico', 'São Paulo': 'Brazil', 'Rio de Janeiro': 'Brazil',
//         // Middle East
//         'Dubai': 'United Arab Emirates', 'Abu Dhabi': 'United Arab Emirates', 'Doha': 'Qatar',
//         // Africa
//         'Cape Town': 'South Africa', 'Johannesburg': 'South Africa', 'Nairobi': 'Kenya',
//         // Add more as needed...
//     };
//
//     // Try to detect country from row fields or from city mapping
//     const detectCountryFromRow = (row) => {
//         // common possible fields
//         const fieldsToCheck = ['country', 'Country', 'territory', 'Territory', 'country_code', 'Country Code', 'location', 'Location', 'city', 'City', 'file_name', 'File_Name', 'file name'];
//         for (const f of fieldsToCheck) {
//             if (row[f]) {
//                 const val = String(row[f]).trim();
//                 if (!val) continue;
//                 // If value is a city name and present in mapping, use mapping
//                 if (cityToCountry[val]) return cityToCountry[val];
//                 // If the value looks like a country already (simple heuristics), return it
//                 // e.g., "India" or "IND" or "United States"
//                 // Normalize: if it contains spaces or capitalized, assume country
//                 if (val.length > 2 && /^[A-Za-z\s\-()]+$/.test(val) && val.split(' ').length <= 4) {
//                     return val;
//                 }
//             }
//         }
//
//         // Try specific city fields
//         const city = row.city || row.City || row.file_name || row.File_Name || row['file name'];
//         if (city) {
//             const c = String(city).trim();
//             if (cityToCountry[c]) return cityToCountry[c];
//             // try splitting by comma "City, Country"
//             if (c.includes(',')) {
//                 const parts = c.split(',').map(p => p.trim());
//                 const potentialCountry = parts[parts.length - 1];
//                 if (potentialCountry.length > 1) return potentialCountry;
//             }
//         }
//
//         return 'Unknown';
//     };
//
//     // ---------- Aggregate revenue by country ----------
//     const countryRevenue = useMemo(() => {
//         const allRows = [...data.wynk, ...data.jio, ...data.airtel];
//         const map = {};
//         allRows.forEach(row => {
//             const country = detectCountryFromRow(row);
//             const income = parseFloat(row.income || row.Rev || row.revenue || 0) || 0;
//             map[country] = (map[country] || 0) + income;
//         });
//
//         // Convert into array that ECharts expects: {name: countryName, value: revenue}
//         const arr = Object.entries(map).map(([name, value]) => ({ name, value: +value.toFixed(2) }));
//         return arr;
//     }, [data]);
//
//     // Build ECharts option
//     const chartOption = useMemo(() => {
//         // compute max / min for visualMap scale
//         const values = countryRevenue.filter(d => d.name !== 'Unknown' && d.value > 0).map(d => d.value);
//         const maxV = values.length ? Math.max(...values) : 0;
//         const minV = values.length ? Math.min(...values) : 0;
//
//         // color: India -> green highlight; others -> red gradient by value
//         // We implement this by adding a `selected` color for India via itemStyle in data, otherwise use `visualMap`.
//         const dataWithStyles = countryRevenue.map(d => {
//             if (!d.name || d.name === 'Unknown') return { ...d, itemStyle: { opacity: 0.4 } };
//             if (d.name.toLowerCase().includes('india') || d.name.toLowerCase() === 'india') {
//                 return { ...d, itemStyle: { color: '#16a34a' } }; // green for India
//             }
//             return d;
//         });
//
//         return {
//             title: {
//                 text: 'Country Trend',
//                 left: 'center',
//                 top: 10,
//                 textStyle: { fontSize: 18 }
//             },
//             tooltip: {
//                 trigger: 'item',
//                 formatter: function (params) {
//                     // params.value might be undefined or 0
//                     const val = params.value ?? 0;
//                     return `${params.name} <br/>Revenue: ₹ ${Number(val).toLocaleString()}`;
//                 }
//             },
//             visualMap: {
//                 min: minV,
//                 max: maxV || 1,
//                 left: 'left',
//                 bottom: '10%',
//                 calculable: true,
//                 inRange: {
//                     color: ['#ffefef', '#fca5a5', '#f87171', '#dc2626'] // light -> dark red
//                 },
//                 textStyle: { color: '#666' },
//             },
//             series: [
//                 {
//                     name: 'Revenue',
//                     type: 'map',
//                     map: 'world',
//                     roam: true,
//                     emphasis: {
//                         label: { show: false }
//                     },
//                     data: dataWithStyles,
//                     // neutral style for countries with no data
//                     itemStyle: {
//                         borderColor: '#999',
//                         borderWidth: 0.5
//                     }
//                 }
//             ]
//         };
//     }, [countryRevenue]);
//
//     // ---------- Small UI helpers ----------
//     const handlePage = (page) => { setCurrentPage(page); setMobileMenuOpen(false); setDropdownOpen(''); };
//     const metrics = calculateMetrics();
//
//     // ---------- Reusable UI components ----------
//     const Card = ({ title, subtitle, children, className = '' }) => (
//         <div className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 ${className}`}>
//             {title && <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{title}</h3>}
//             {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
//             {children}
//         </div>
//     );
//
//     const NavBar = () => (
//         <nav className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow">
//             <div className="max-w-7xl mx-auto px-4">
//                 <div className="flex items-center justify-between h-16">
//                     <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
//                             <Music className="w-6 h-6 text-orange-500" />
//                         </div>
//                         <span className="text-lg font-bold hidden sm:inline">TUNE O</span>
//                     </div>
//
//                     <div className="hidden md:flex items-center space-x-6">
//                         <button onClick={() => handlePage('home')} className={`hover:text-orange-200 ${currentPage === 'home' ? 'font-bold' : ''}`}>Home</button>
//
//                         <div className="relative">
//                             <button onClick={() => setDropdownOpen(dropdownOpen === 'reports' ? '' : 'reports')} className="flex items-center hover:text-orange-200">
//                                 Reports <ChevronDown className="w-4 h-4 ml-1" />
//                             </button>
//                             {dropdownOpen === 'reports' && (
//                                 <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-44 z-20">
//                                     <button onClick={() => handlePage('dsp')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">DSP</button>
//                                     <button onClick={() => handlePage('callertune')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Caller Tune</button>
//                                 </div>
//                             )}
//                         </div>
//
//                         <button onClick={() => handlePage('repertoire')} className={`hover:text-orange-200 ${currentPage === 'repertoire' ? 'font-bold' : ''}`}>Repertoire</button>
//
//                         <div className="relative">
//                             <button onClick={() => setDropdownOpen(dropdownOpen === 'newsongs' ? '' : 'newsongs')} className="flex items-center hover:text-orange-200">
//                                 New Songs <ChevronDown className="w-4 h-4 ml-1" />
//                             </button>
//                             {dropdownOpen === 'newsongs' && (
//                                 <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-44 z-20">
//                                     <button onClick={() => handlePage('artist')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Artist</button>
//                                     <button onClick={() => handlePage('album')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Album</button>
//                                     <button onClick={() => handlePage('track')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Track</button>
//                                 </div>
//                             )}
//                         </div>
//
//                         <button className="hover:text-orange-200">Resource</button>
//                         <button className="hover:text-orange-200">Contact</button>
//
//                         <div className="relative">
//                             <button className="flex items-center hover:text-orange-200">Account <ChevronDown className="w-4 h-4 ml-1" /></button>
//                         </div>
//                     </div>
//
//                     {/* Mobile burger */}
//                     <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
//                         {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//                     </button>
//                 </div>
//
//                 {/* Mobile menu */}
//                 {mobileMenuOpen && (
//                     <div className="md:hidden bg-white text-gray-800 mt-3 rounded-lg shadow p-4 space-y-2">
//                         <button onClick={() => handlePage('home')} className="w-full text-left py-2 border-b">Home</button>
//                         <button onClick={() => handlePage('dsp')} className="w-full text-left py-2 border-b pl-2">DSP Reports</button>
//                         <button onClick={() => handlePage('callertune')} className="w-full text-left py-2 border-b pl-2">Caller Tune</button>
//                         <button onClick={() => handlePage('artist')} className="w-full text-left py-2 border-b pl-2">Artist</button>
//                         <button onClick={() => handlePage('album')} className="w-full text-left py-2 pl-2">Album</button>
//                     </div>
//                 )}
//             </div>
//         </nav>
//     );
//
//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-gray-50">
//                 <div className="text-gray-700 text-lg animate-pulse">Loading Dashboard...</div>
//             </div>
//         );
//     }
//
//     // ---------- Main render ----------
//     return (
//         <div className="min-h-screen bg-gray-50">
//             <NavBar />
//
//             <div className="max-w-7xl mx-auto p-4 md:p-8">
//                 {currentPage === 'home' && (
//                     <>
//                         <div className="text-center mb-8">
//                             <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Live Dashboard</h1>
//                             <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
//                                 <Music className="w-12 h-12 text-white" />
//                             </div>
//                         </div>
//
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                             <Card title="Total Revenue" subtitle="Aggregated across all DSPs">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-2xl font-bold text-gray-800">₹{metrics.totalRevenue.toFixed(2)}</p>
//                                         <p className="text-sm text-gray-500">Revenue</p>
//                                     </div>
//                                     <div className="bg-blue-50 rounded-full p-3">
//                                         <DollarSign className="w-6 h-6 text-blue-600" />
//                                     </div>
//                                 </div>
//                             </Card>
//
//                             <Card title="Total Songs" subtitle="Unique titles in dataset">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-2xl font-bold text-gray-800">{metrics.totalSongs}</p>
//                                         <p className="text-sm text-gray-500">Songs</p>
//                                     </div>
//                                     <div className="bg-green-50 rounded-full p-3">
//                                         <Users className="w-6 h-6 text-green-600" />
//                                     </div>
//                                 </div>
//                             </Card>
//
//                             <Card title="Total Artists" subtitle="Distinct contributing artists">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-2xl font-bold text-gray-800">{metrics.totalArtists}</p>
//                                         <p className="text-sm text-gray-500">Artists</p>
//                                     </div>
//                                     <div className="bg-yellow-50 rounded-full p-3">
//                                         <Music className="w-6 h-6 text-yellow-600" />
//                                     </div>
//                                 </div>
//                             </Card>
//                         </div>
//
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             <Card title="Month Wise Revenue Trend" subtitle="Revenue vs Activity Period" className="min-h-[380px]">
//                                 <div className="w-full h-80">
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <BarChart data={getMonthlyRevenue()} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
//                                             <CartesianGrid strokeDasharray="3 3" />
//                                             <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -10 }} tick={{ fontSize: 12 }} />
//                                             <YAxis label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft', offset: 0 }} />
//                                             <Tooltip formatter={(value) => `₹${value}`} />
//                                             <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//                                         </BarChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                             </Card>
//
//                             <Card title="Top DSP Revenue" subtitle="Revenue by store (sample)" className="min-h-[380px]">
//                                 <div className="w-full h-80">
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <BarChart data={getDSPRevenue()} margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
//                                             <CartesianGrid strokeDasharray="3 3" />
//                                             <XAxis dataKey="store" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
//                                             <YAxis label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft', offset: 0 }} />
//                                             <Tooltip formatter={(value) => `₹${value}`} />
//                                             <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
//                                         </BarChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                             </Card>
//                         </div>
//                     </>
//                 )}
//
//                 {currentPage === 'dsp' && (
//                     <div className="space-y-6">
//                         <Card title="DSP Reports" subtitle="Revenue vs Store Name">
//                             <div className="w-full h-96">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <BarChart data={getDSPRevenue()} margin={{ top: 20, right: 20, bottom: 100, left: 20 }}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="store" angle={-45} textAnchor="end" height={80} />
//                                         <YAxis label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft', offset: 0 }} />
//                                         <Tooltip formatter={(value) => `₹${value}`} />
//                                         <Legend wrapperStyle={{ paddingTop: 10 }} />
//                                         <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//                                     </BarChart>
//                                 </ResponsiveContainer>
//                             </div>
//                         </Card>
//                     </div>
//                 )}
//
//                 {currentPage === 'callertune' && (
//                     <div className="space-y-6">
//                         <Card title="Streaming Trend" subtitle="Quantity and Revenue">
//                             <div className="w-full h-96">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <PieChart>
//                                         <Pie data={getStreamingData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label={(entry) => `${entry.name}: ${entry.value}%`}>
//                                             {getStreamingData().map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
//                                         </Pie>
//                                         <Tooltip />
//                                         <Legend layout="vertical" verticalAlign="middle" align="right" />
//                                     </PieChart>
//                                 </ResponsiveContainer>
//                             </div>
//                         </Card>
//
//                         <Card title="Caller Tune Overview" subtitle="JioTunes, Airtel & VI Callertune">
//                             <div className="w-full h-96">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <BarChart data={getCallerTuneData()} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -10 }} />
//                                         <YAxis label={{ value: 'Units', angle: -90, position: 'insideLeft' }} />
//                                         <Tooltip />
//                                         <Legend />
//                                         <Bar dataKey="vi" stackId="a" fill="#FDE047" name="VI" />
//                                         <Bar dataKey="airtel" stackId="a" fill="#F87171" name="Airtel" />
//                                         <Bar dataKey="jioTunes" stackId="a" fill="#60A5FA" name="JioTunes" />
//                                     </BarChart>
//                                 </ResponsiveContainer>
//                             </div>
//                         </Card>
//
//                         <Card title="Country Trend" subtitle="World Heat Map (revenue by country)">
//                             <div className="w-full h-[520px]">
//                                 {mapLoadingError && (
//                                     <div className="text-sm text-red-600 p-4">
//                                         {mapLoadingError}. The chart will still attempt to render if you add the GeoJSON.
//                                     </div>
//                                 )}
//                                 <div style={{ width: '100%', height: '100%' }}>
//                                     <ReactECharts
//                                         option={chartOption}
//                                         style={{ height: '100%', width: '100%' }}
//                                         notMerge={true}
//                                         lazyUpdate={true}
//                                     />
//                                 </div>
//                                 <div className="text-sm text-gray-500 mt-2">
//                                     Tip: Put <code>world-geo.json</code> in <code>public/data/world-geo.json</code>. If your CSV contains country names already, they will be used. If it only contains city names, a best-effort city→country mapping is used.
//                                 </div>
//                             </div>
//                         </Card>
//                     </div>
//                 )}
//
//                 {currentPage === 'artist' && (
//                     <Card title="Artist" subtitle="Top artists by revenue">
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-sm">
//                                 <thead>
//                                 <tr className="bg-blue-50 border-b-2">
//                                     <th className="p-3 text-left text-gray-700">Artist</th>
//                                     <th className="p-3 text-right text-gray-700">Revenue (₹)</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {getArtistData().map((item, idx) => (
//                                     <tr key={idx} className="border-b hover:bg-gray-50">
//                                         <td className="p-3">{item.artist}</td>
//                                         <td className="p-3 text-right">{item.revenue.toFixed(2)}</td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </Card>
//                 )}
//
//                 {currentPage === 'album' && (
//                     <Card title="Album" subtitle="Recent album revenue (sample)">
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-sm">
//                                 <thead>
//                                 <tr className="bg-blue-50 border-b-2">
//                                     <th className="p-3 text-left text-gray-700">Release</th>
//                                     <th className="p-3 text-left text-gray-700">Artist</th>
//                                     <th className="p-3 text-left text-gray-700">Project Code</th>
//                                     <th className="p-3 text-right text-gray-700">Revenue (₹)</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {getAlbumData().map((item, idx) => (
//                                     <tr key={idx} className="border-b hover:bg-gray-50">
//                                         <td className="p-3">{item.release}</td>
//                                         <td className="p-3">{item.artist}</td>
//                                         <td className="p-3">{item.projectCode}</td>
//                                         <td className="p-3 text-right">{item.revenue.toFixed(2)}</td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </Card>
//                 )}
//
//                 {currentPage === 'track' && (
//                     <Card title="Track" subtitle="Track listing coming soon...">
//                         <p className="text-center text-gray-600">Track listing will be available after data ingestion.</p>
//                     </Card>
//                 )}
//
//                 {currentPage === 'repertoire' && (
//                     <Card title="Repertoire" subtitle="Music repertoire management">
//                         <p className="text-center text-gray-600">Music repertoire management interface coming soon.</p>
//                     </Card>
//                 )}
//             </div>
//
//             <footer className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 mt-12">
//                 <div className="max-w-7xl mx-auto px-4 text-center">
//                     <div className="flex items-center justify-center space-x-2 mb-2">
//                         <Music className="w-6 h-6" />
//                         <span className="font-bold text-lg">TUNE O Music Analytics</span>
//                     </div>
//                     <p className="text-sm opacity-90">© 2025 All Rights Reserved</p>
//                 </div>
//             </footer>
//         </div>
//     );
// }

//second one*************************
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Music, DollarSign, Users, ChevronDown, Menu, X } from 'lucide-react';
import Papa from 'papaparse';

export default function App() {
    const [data, setData] = useState({ wynk: [], jio: [], airtel: [] });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState('');

    useEffect(() => {
        const loadCSV = async (file, key) => {
            try {
                const response = await fetch(`/data/${file}`);
                if (!response.ok) throw new Error(`Failed to load ${file}`);
                const text = await response.text();
                return new Promise((resolve) => {
                    Papa.parse(text, {
                        header: true,
                        dynamicTyping: true,
                        skipEmptyLines: true,
                        complete: (results) => resolve({ [key]: results.data }),
                        error: () => resolve({ [key]: [] })
                    });
                });
            } catch (error) {
                return { [key]: [] };
            }
        };

        Promise.all([
            loadCSV('wynk-report.csv', 'wynk'),
            loadCSV('jio-saavn-report.csv', 'jio'),
            loadCSV('airtel-report.csv', 'airtel')
        ]).then(results => {
            const combined = Object.assign({}, ...results);
            setData(combined);
            setLoading(false);
        });
    }, []);

    const calculateMetrics = () => {
        const allData = [...data.wynk, ...data.jio, ...data.airtel];
        const totalRevenue = allData.reduce((sum, row) => sum + (parseFloat(row.income || row.Rev || 0)), 0);
        const songs = new Set(allData.map(row => row.song_nam || row['Song Nam'] || row.song_id).filter(Boolean));
        const artists = new Set(allData.map(row => row.artist || row.artist_nam || row['Artist']).filter(Boolean));
        return { totalRevenue, totalSongs: songs.size, totalArtists: artists.size };
    };

    const getMonthlyRevenue = () => {
        const months = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25'];
        return months.map((month, idx) => ({
            month,
            revenue: Math.random() * 30 + 10
        }));
    };

    const getDSPRevenue = () => {
        const stores = ['Spotify', 'YouTube', 'iTunes', 'Amazon', 'Pandora', 'Deezer', 'Tidal', 'iHeart', 'Napster', 'Apple Music', 'SoundCloud', 'Google Play', 'Tencent', 'JioSaavn', 'Gaana', 'Wynk', 'Resso', 'Boomplay', 'Anghami'];
        return stores.slice(0, 15).map(store => ({
            store,
            revenue: Math.random() * 80 + 20
        }));
    };

    const getStreamingData = () => {
        return [
            { name: 'Cloud Match Units', value: 41.9, color: '#60A5FA' },
            { name: 'Unqualified Audio', value: 21.6, color: '#F87171' },
            { name: 'Fraudulent Streams', value: 1.0, color: '#FCA5A5' },
            { name: 'Ad-Supported Audio', value: 5.6, color: '#93C5FD' },
            { name: 'Short-form Video User', value: 6.1, color: '#FDE047' },
            { name: 'Download Tracks', value: 23.7, color: '#34D399' },
            { name: 'Streaming Bonus', value: 0.3, color: '#A78BFA' }
        ];
    };

    const getCallerTuneData = () => {
        const dates = Array.from({length: 20}, (_, i) => `Day ${i+1}`);
        return dates.map(date => ({
            date,
            jioTunes: Math.random() * 30 + 10,
            airtel: Math.random() * 30 + 10,
            vi: Math.random() * 40 + 10
        }));
    };

    const getArtistData = () => {
        const allData = [...data.wynk, ...data.jio, ...data.airtel];
        const artistRevenue = {};
        allData.forEach(row => {
            const artist = row.artist || row.artist_nam || 'Unknown';
            const income = parseFloat(row.income || row.Rev || 0);
            if (income > 0) artistRevenue[artist] = (artistRevenue[artist] || 0) + income;
        });
        return Object.entries(artistRevenue)
            .map(([artist, revenue]) => ({ artist, revenue, total: revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    };

    const getAlbumData = () => {
        const allData = [...data.wynk, ...data.jio, ...data.airtel];
        return allData.slice(0, 10).map(row => ({
            release: row.album_nam || row['Album Nam'] || 'Unknown Album',
            artist: row.artist || row.artist_nam || 'Unknown',
            projectCode: `OTTSCD${Math.floor(Math.random() * 10000)}`,
            revenue: parseFloat(row.income || row.Rev || 0),
            total: parseFloat(row.income || row.Rev || 0)
        }));
    };

    const NavBar = () => (
        <nav className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <Music className="w-6 h-6 text-orange-500" />
                        </div>
                        <span className="text-lg font-bold hidden sm:block">TUNE O</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={() => setCurrentPage('home')} className={`hover:text-orange-200 transition ${currentPage === 'home' ? 'font-bold' : ''}`}>Home</button>

                        <div className="relative">
                            <button onClick={() => setDropdownOpen(dropdownOpen === 'reports' ? '' : 'reports')} className="flex items-center hover:text-orange-200 transition">
                                Reports <ChevronDown className="w-4 h-4 ml-1" />
                            </button>
                            {dropdownOpen === 'reports' && (
                                <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-40">
                                    <button onClick={() => { setCurrentPage('dsp'); setDropdownOpen(''); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">DSP</button>
                                    <button onClick={() => { setCurrentPage('callertune'); setDropdownOpen(''); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Caller Tune</button>
                                </div>
                            )}
                        </div>

                        <button onClick={() => setCurrentPage('repertoire')} className={`hover:text-orange-200 transition ${currentPage === 'repertoire' ? 'font-bold' : ''}`}>Repertoire</button>

                        <div className="relative">
                            <button onClick={() => setDropdownOpen(dropdownOpen === 'newsongs' ? '' : 'newsongs')} className="flex items-center hover:text-orange-200 transition">
                                New Songs Release <ChevronDown className="w-4 h-4 ml-1" />
                            </button>
                            {dropdownOpen === 'newsongs' && (
                                <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-40">
                                    <button onClick={() => { setCurrentPage('artist'); setDropdownOpen(''); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Artist</button>
                                    <button onClick={() => { setCurrentPage('album'); setDropdownOpen(''); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Album</button>
                                    <button onClick={() => { setCurrentPage('track'); setDropdownOpen(''); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Track</button>
                                </div>
                            )}
                        </div>

                        <button className="hover:text-orange-200 transition">Resource</button>
                        <button className="hover:text-orange-200 transition">Contact</button>

                        <div className="relative">
                            <button className="flex items-center hover:text-orange-200 transition">
                                Account <ChevronDown className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block w-full text-left py-2">Home</button>
                        <button onClick={() => { setCurrentPage('dsp'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 pl-4">DSP Reports</button>
                        <button onClick={() => { setCurrentPage('callertune'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 pl-4">Caller Tune</button>
                        <button onClick={() => { setCurrentPage('artist'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 pl-4">Artist</button>
                        <button onClick={() => { setCurrentPage('album'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 pl-4">Album</button>
                    </div>
                )}
            </div>
        </nav>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-white text-xl animate-pulse">Loading Dashboard...</div>
            </div>
        );
    }

    const metrics = calculateMetrics();
    const COLORS = ['#60A5FA', '#34D399', '#FDE047', '#F87171', '#A78BFA'];

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {currentPage === 'home' && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Live Dashboard</h1>
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Music className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        {/* Month Wise Revenue Trend */}
                        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Month Wise Revenue Trend</h2>
                            <p className="text-gray-600 text-center mb-6">Revenue vs Activity Period</p>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={getMonthlyRevenue()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {currentPage === 'dsp' && (
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">DSP Reports</h2>
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
                )}

                {currentPage === 'callertune' && (
                    <>
                        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Streaming Trend</h2>
                            <p className="text-gray-600 text-center mb-6">Quantity and Revenue</p>
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
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Caller Tune Overview</h2>
                            <p className="text-gray-600 text-center mb-6">JioTunes, airtel and VI Callertune</p>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={getCallerTuneData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="vi" stackId="a" fill="#FDE047" name="VI Callertune" />
                                    <Bar dataKey="airtel" stackId="a" fill="#F87171" name="airtel" />
                                    <Bar dataKey="jioTunes" stackId="a" fill="#60A5FA" name="JioTunes" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Country Trend</h2>
                            <div className="flex justify-center items-center h-96">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🗺️</div>
                                    <p className="text-gray-600">World Heat Map Visualization</p>
                                    <p className="text-sm text-gray-400 mt-2">(India highlighted in green)</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentPage === 'artist' && (
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Artist</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-blue-50 border-b-2">
                                    <th className="p-3 text-left text-gray-700">Artist</th>
                                    <th className="p-3 text-right text-gray-700">Revenue</th>
                                    <th className="p-3 text-right text-gray-700">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {getArtistData().map((item, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{item.artist}</td>
                                        <td className="p-3 text-right">{item.revenue.toFixed(2)}</td>
                                        <td className="p-3 text-right">{item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {currentPage === 'album' && (
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Album</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-blue-50 border-b-2">
                                    <th className="p-3 text-left text-gray-700">Release</th>
                                    <th className="p-3 text-left text-gray-700">Artist</th>
                                    <th className="p-3 text-left text-gray-700">Project Code</th>
                                    <th className="p-3 text-right text-gray-700">Revenue</th>
                                    <th className="p-3 text-right text-gray-700">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {getAlbumData().map((item, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{item.release}</td>
                                        <td className="p-3">{item.artist}</td>
                                        <td className="p-3">{item.projectCode}</td>
                                        <td className="p-3 text-right">{item.revenue.toFixed(2)}</td>
                                        <td className="p-3 text-right">{item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {currentPage === 'track' && (
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Track</h2>
                        <p className="text-center text-gray-600">Track listing coming soon...</p>
                    </div>
                )}

                {currentPage === 'repertoire' && (
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Repertoire</h2>
                        <p className="text-center text-gray-600">Music repertoire management interface...</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <Music className="w-6 h-6" />
                        <span className="font-bold text-lg">TUNE O Music Analytics</span>
                    </div>
                    <p className="text-sm opacity-80">© 2025 All Rights Reserved</p>
                </div>
            </footer>
        </div>
    );
}


//Previous basic one ***************************************************
// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Music, TrendingUp, Users, DollarSign } from 'lucide-react';
// import Papa from 'papaparse';
//
// export default function App() {
//     const [data, setData] = useState({ wynk: [], jio: [], airtel: [] });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         const loadCSV = async (file, key) => {
//             try {
//                 const response = await fetch(`/data/${file}`);
//                 if (!response.ok) throw new Error(`Failed to load ${file}`);
//                 const text = await response.text();
//                 return new Promise((resolve) => {
//                     Papa.parse(text, {
//                         header: true,
//                         dynamicTyping: true,
//                         skipEmptyLines: true,
//                         complete: (results) => {
//                             console.log(`${key} loaded:`, results.data.length, 'rows');
//                             resolve({ [key]: results.data });
//                         },
//                         error: (err) => {
//                             console.error(`Parse error in ${file}:`, err);
//                             resolve({ [key]: [] });
//                         }
//                     });
//                 });
//             } catch (error) {
//                 console.error(`Error loading ${file}:`, error);
//                 return { [key]: [] };
//             }
//         };
//
//         Promise.all([
//             loadCSV('wynk-report.csv', 'wynk'),
//             loadCSV('jio-saavn-report.csv', 'jio'),
//             loadCSV('airtel-report.csv', 'airtel')
//         ]).then(results => {
//             const combined = Object.assign({}, ...results);
//             setData(combined);
//             setLoading(false);
//
//             // Check if data loaded
//             const totalRows = combined.wynk.length + combined.jio.length + combined.airtel.length;
//             if (totalRows === 0) {
//                 setError('No data loaded. Check if CSV files are in public/data/ folder');
//             }
//         }).catch(err => {
//             setError('Failed to load data');
//             setLoading(false);
//         });
//     }, []);
//
//     const calculateMetrics = () => {
//         const allData = [...data.wynk, ...data.jio, ...data.airtel];
//
//         // Handle different column names across CSVs
//         const totalRevenue = allData.reduce((sum, row) => {
//             const income = parseFloat(row.income || row.Rev || 0);
//             return sum + income;
//         }, 0);
//
//         const songs = new Set();
//         const artists = new Set();
//
//         allData.forEach(row => {
//             const songName = row.song_nam || row['Song Nam'] || row.song_id;
//             const artistName = row.artist || row.artist_nam || row['Artist'] || row.Artist_nam;
//
//             if (songName) songs.add(songName);
//             if (artistName) artists.add(artistName);
//         });
//
//         return {
//             totalRevenue,
//             totalSongs: songs.size,
//             totalArtists: artists.size
//         };
//     };
//
//     const getPlatformData = () => {
//         const wynkRev = data.wynk.reduce((sum, row) =>
//             sum + (parseFloat(row.income || row.Rev || 0)), 0);
//         const jioRev = data.jio.reduce((sum, row) =>
//             sum + (parseFloat(row.income || row.Rev || 0)), 0);
//         const airtelRev = data.airtel.reduce((sum, row) =>
//             sum + (parseFloat(row.income || row.Rev || 0)), 0);
//
//         return [
//             { platform: 'Wynk', revenue: wynkRev },
//             { platform: 'JioSaavn', revenue: jioRev },
//             { platform: 'Airtel', revenue: airtelRev }
//         ].filter(p => p.revenue > 0);
//     };
//
//     const getTopArtists = () => {
//         const allData = [...data.wynk, ...data.jio, ...data.airtel];
//         const artistRevenue = {};
//
//         allData.forEach(row => {
//             const artist = row.artist || row.artist_nam || row['Artist'] || row.Artist_nam || 'Unknown';
//             const income = parseFloat(row.income || row.Rev || 0);
//
//             if (income > 0) {
//                 artistRevenue[artist] = (artistRevenue[artist] || 0) + income;
//             }
//         });
//
//         return Object.entries(artistRevenue)
//             .map(([artist, revenue]) => ({ artist, revenue }))
//             .sort((a, b) => b.revenue - a.revenue)
//             .slice(0, 10);
//     };
//
//     const getLabelData = () => {
//         const allData = [...data.wynk, ...data.jio, ...data.airtel];
//         const labelRevenue = {};
//
//         allData.forEach(row => {
//             const label = row.label || row.Main_Labe || row['Main_Labe'] || 'Unknown';
//             const income = parseFloat(row.income || row.Rev || 0);
//
//             if (income > 0) {
//                 labelRevenue[label] = (labelRevenue[label] || 0) + income;
//             }
//         });
//
//         return Object.entries(labelRevenue)
//             .map(([label, revenue]) => ({ label, revenue }))
//             .sort((a, b) => b.revenue - a.revenue)
//             .slice(0, 5);
//     };
//
//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-gray-900">
//                 <div className="text-white text-xl animate-pulse">Loading Dashboard...</div>
//             </div>
//         );
//     }
//
//     if (error) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-gray-900">
//                 <div className="text-red-400 text-xl text-center p-8">
//                     <p className="mb-4">{error}</p>
//                     <p className="text-sm text-gray-400">Check browser console for details</p>
//                 </div>
//             </div>
//         );
//     }
//
//     const metrics = calculateMetrics();
//     const platformData = getPlatformData();
//     const topArtists = getTopArtists();
//     const labelData = getLabelData();
//     const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
//
//     return (
//         <div className="min-h-screen bg-gray-900 p-4 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 <div className="mb-8">
//                     <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Music Analytics Dashboard</h1>
//                     <p className="text-gray-400">Multi-platform revenue insights</p>
//                 </div>
//
//                 {/* Metric Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm opacity-80 mb-1">Total Revenue</p>
//                                 <p className="text-3xl font-bold">₹{metrics.totalRevenue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
//                             </div>
//                             <DollarSign className="w-12 h-12 opacity-50" />
//                         </div>
//                     </div>
//
//                     <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm opacity-80 mb-1">Total Songs</p>
//                                 <p className="text-3xl font-bold">{metrics.totalSongs.toLocaleString()}</p>
//                             </div>
//                             <Music className="w-12 h-12 opacity-50" />
//                         </div>
//                     </div>
//
//                     <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm opacity-80 mb-1">Total Artists</p>
//                                 <p className="text-3xl font-bold">{metrics.totalArtists.toLocaleString()}</p>
//                             </div>
//                             <Users className="w-12 h-12 opacity-50" />
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Charts Row */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                     {/* Platform Comparison */}
//                     <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
//                         <h2 className="text-xl font-bold text-white mb-4 flex items-center">
//                             <TrendingUp className="w-5 h-5 mr-2" />
//                             Revenue by Platform
//                         </h2>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <BarChart data={platformData}>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                                 <XAxis dataKey="platform" stroke="#9ca3af" />
//                                 <YAxis stroke="#9ca3af" />
//                                 <Tooltip
//                                     contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
//                                     labelStyle={{ color: '#fff' }}
//                                     formatter={(value) => `₹${value.toFixed(2)}`}
//                                 />
//                                 <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//
//                     {/* Label Distribution */}
//                     <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
//                         <h2 className="text-xl font-bold text-white mb-4">Top 5 Labels by Revenue</h2>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <PieChart>
//                                 <Pie
//                                     data={labelData}
//                                     dataKey="revenue"
//                                     nameKey="label"
//                                     cx="50%"
//                                     cy="50%"
//                                     outerRadius={100}
//                                     label={(entry) => entry.label.length > 15 ? entry.label.substring(0, 15) + '...' : entry.label}
//                                 >
//                                     {labelData.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip
//                                     contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
//                                     formatter={(value) => `₹${value.toFixed(2)}`}
//                                 />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//
//                 {/* Top Artists Table */}
//                 <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
//                     <h2 className="text-xl font-bold text-white mb-4">Top 10 Artists by Revenue</h2>
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left">
//                             <thead>
//                             <tr className="border-b border-gray-700">
//                                 <th className="pb-3 text-gray-400 font-medium">Rank</th>
//                                 <th className="pb-3 text-gray-400 font-medium">Artist</th>
//                                 <th className="pb-3 text-gray-400 font-medium text-right">Revenue</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {topArtists.map((artist, idx) => (
//                                 <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
//                                     <td className="py-3 text-white font-medium">#{idx + 1}</td>
//                                     <td className="py-3 text-white">{artist.artist}</td>
//                                     <td className="py-3 text-white text-right font-mono">
//                                         ₹{artist.revenue.toLocaleString('en-IN', {maximumFractionDigits: 2})}
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

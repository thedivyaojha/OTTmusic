import React, { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import Papa from "papaparse";
import Footer from "./components/Footer";
import NavBar from "./components/Navbar";
import { Home } from "./components/Home";

export default function App() {
    const [data, setData] = useState({ wynk: [], jio: [], airtel: [] });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState("home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState("");

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
                        error: () => resolve({ [key]: [] }),
                    });
                });
            } catch (error) {
                return { [key]: [] };
            }
        };

        Promise.all([
            loadCSV("wynk-report.csv", "wynk"),
            loadCSV("jio-saavn-report.csv", "jio"),
            loadCSV("airtel-report.csv", "airtel"),
        ]).then((results) => {
            const combined = Object.assign({}, ...results);
            setData(combined);
            setLoading(false);
        });
    }, []);

    const calculateMetrics = () => {
        const allData = [...data.wynk, ...data.jio, ...data.airtel];
        const totalRevenue = allData.reduce(
            (sum, row) => sum + parseFloat(row.income || row.Rev || 0),
            0
        );
        const songs = new Set(
            allData
                .map((row) => row.song_nam || row["Song Nam"] || row.song_id)
                .filter(Boolean)
        );
        const artists = new Set(
            allData
                .map((row) => row.artist || row.artist_nam || row["Artist"])
                .filter(Boolean)
        );
        return { totalRevenue, totalSongs: songs.size, totalArtists: artists.size };
    };

    const getMonthlyRevenue = () => {
        const months = [
            "Jan-25", "Feb-25", "Mar-25", "Apr-25", "May-25",
            "Jun-25", "Jul-25", "Aug-25", "Sep-25",
        ];
        return months.map((month) => ({
            month,
            revenue: Math.random() * 30 + 10,
        }));
    };

    const getDSPRevenue = () => {
        const stores = [
            "Spotify", "YouTube", "iTunes", "Amazon", "Pandora",
            "Deezer", "Tidal", "iHeart", "Napster", "Apple Music",
            "SoundCloud", "Google Play", "Tencent", "JioSaavn", "Gaana",
            "Wynk", "Resso", "Boomplay", "Anghami",
        ];
        return stores.slice(0, 15).map((store) => ({
            store,
            revenue: Math.random() * 80 + 20,
        }));
    };

    const getStreamingData = () => [
        { name: "Cloud Match Units", value: 41.9, color: "#60A5FA" },
        { name: "Unqualified Audio", value: 21.6, color: "#F87171" },
        { name: "Fraudulent Streams", value: 1.0, color: "#FCA5A5" },
        { name: "Ad-Supported Audio", value: 5.6, color: "#93C5FD" },
        { name: "Short-form Video User", value: 6.1, color: "#FDE047" },
        { name: "Download Tracks", value: 23.7, color: "#34D399" },
        { name: "Streaming Bonus", value: 0.3, color: "#A78BFA" },
    ];

    const getCallerTuneData = () => {
        const dates = Array.from({ length: 20 }, (_, i) => `Day ${i + 1}`);
        return dates.map((date) => ({
            date,
            jioTunes: Math.random() * 30 + 10,
            airtel: Math.random() * 30 + 10,
            vi: Math.random() * 40 + 10,
        }));
    };

    const getArtistData = () => {
        const allData = [...data.wynk, ...data.jio, ...data.airtel];
        const artistRevenue = {};
        allData.forEach((row) => {
            const artist = row.artist || row.artist_nam || "Unknown";
            const income = parseFloat(row.income || row.Rev || 0);
            if (income > 0)
                artistRevenue[artist] = (artistRevenue[artist] || 0) + income;
        });
        return Object.entries(artistRevenue)
            .map(([artist, revenue]) => ({ artist, revenue, total: revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    };

    const getAlbumData = () => {
        const allData = [...data.wynk, ...data.jio, ...data.airtel];
        return allData.slice(0, 10).map((row) => ({
            release: row.album_nam || row["Album Nam"] || "Unknown Album",
            artist: row.artist || row.artist_nam || "Unknown",
            projectCode: `OTTSCD${Math.floor(Math.random() * 10000)}`,
            revenue: parseFloat(row.income || row.Rev || 0),
            total: parseFloat(row.income || row.Rev || 0),
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-black text-xl animate-pulse flex justify-center items-center gap-2">
                    <LoaderCircle className="animate-spin text-4xl" />
                    Loading
                </div>
            </div>
        );
    }

    calculateMetrics();

    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-white via-amber-100 to-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                <NavBar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setDropdownOpen={setDropdownOpen}
                    dropdownOpen={dropdownOpen}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <Home
                    currentPage={currentPage}
                    getArtistData={getArtistData}
                    getAlbumData={getAlbumData}
                    getMonthlyRevenue={getMonthlyRevenue}
                    getDSPRevenue={getDSPRevenue}
                    getStreamingData={getStreamingData}
                    getCallerTuneData={getCallerTuneData}
                />

                <Footer />
            </div>
        </div>
    );
}

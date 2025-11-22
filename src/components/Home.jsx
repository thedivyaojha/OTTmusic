import { Disc3 } from "lucide-react";
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
import Callertune from "./Charts/Callertune";
import Artist from "./DSP/Artist";
import Track from "./DSP/Track";
import Repertoire from "./Repertoire";
import Album from "./DSP/Album";
import { DSP } from "./DSP/DSP";

export const Home = ({
                         currentPage,
                         getArtistData,
                         getAlbumData,
                         getMonthlyRevenue,
                         getDSPRevenue,
                         getStreamingData,
                         getCallerTuneData,
                     }) => {
    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto p-4 md:p-8">

                {/* HOME PAGE */}
                {currentPage === "home" && (
                    <>
                        {/* HEADER */}
                        <div className="text-center mb-8 min-h-150 flex flex-col justify-center items-center gap-6 md:gap-10">
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-gray-800">
                                Live Dashboard
                            </h1>

                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                                <Disc3 className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-spin" />
                            </div>
                        </div>

                        {/* MONTH WISE REVENUE */}
                        <div className="bg-linear-to-br from-indigo-100 via-green-100 to-pink-100 border-t-5 rounded-xl p-4 sm:p-6 shadow-md mb-8">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-thin text-gray-800 mb-3 text-center">
                                Month Wise Revenue Trend
                            </h2>
                            <p className="text-gray-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
                                Revenue vs Activity Period
                            </p>

                            <div className="w-full h-64 sm:h-72 md:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getMonthlyRevenue()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                )}

                {/* OTHER PAGES */}
                {currentPage === "dsp" && <DSP getDSPRevenue={getDSPRevenue} />}
                {currentPage === "callertune" && (
                    <Callertune
                        getStreamingData={getStreamingData}
                        getCallerTuneData={getCallerTuneData}
                    />
                )}
                {currentPage === "artist" && <Artist getArtistData={getArtistData} />}
                {currentPage === "album" && <Album getAlbumData={getAlbumData} />}
                {currentPage === "track" && <Track />}
                {currentPage === "repertoire" && <Repertoire />}
            </div>
        </div>
    );
};

import { ChevronDown, Menu, Music, X } from "lucide-react";
import React, { useState } from "react";

const NavBar = ({
                    currentPage,
                    setCurrentPage,
                    setDropdownOpen,
                    dropdownOpen,
                    mobileMenuOpen,
                    setMobileMenuOpen,
                }) => {
    const [mobileDropdown, setMobileDropdown] = useState("");

    return (
        <nav className="text-black p-4 sm:p-6">
            <div className="max-w-7xl mx-auto px-4">

                {/* TOP SECTION */}
                <div className="flex items-center justify-between h-16">

                    {/* LOGO */}
                    <div className="flex flex-col items-center space-y-1">
                        <div className="w-10 h-10 rounded-full bg-white border border-emerald-400 flex items-center justify-center">
                            <Music className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="hidden sm:flex mt-1 flex-col text-center leading-tight">
                            <span className="text-sm font-semibold">OTT</span>
                            <span className="text-sm font-semibold">Solutions</span>
                        </div>
                    </div>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex items-center space-x-8 font-semibold cursor-pointer">

                        <button
                            onClick={() => setCurrentPage("home")}
                            className={`${currentPage === "home" ? "font-bold text-red-500" : ""} hover:underline`}
                        >
                            Home
                        </button>

                        {/* REPORTS DROPDOWN */}
                        <div className="relative">
                            <button
                                onMouseEnter={() =>
                                    setDropdownOpen(dropdownOpen === "reports" ? "" : "reports")
                                }
                                className="flex items-center hover:underline"
                            >
                                Reports <ChevronDown className="w-4 h-4 ml-1" />
                            </button>

                            {dropdownOpen === "reports" && (
                                <div
                                    className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-40"
                                    onMouseLeave={() =>
                                        setDropdownOpen(dropdownOpen === "reports" ? "" : "reports")
                                    }
                                >
                                    <button
                                        onClick={() => {
                                            setCurrentPage("dsp");
                                            setDropdownOpen("");
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        DSP
                                    </button>

                                    <button
                                        onClick={() => {
                                            setCurrentPage("callertune");
                                            setDropdownOpen("");
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Caller Tune
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* SINGLE LINKS */}
                        <button
                            onClick={() => setCurrentPage("repertoire")}
                            className={`${currentPage === "repertoire" ? "font-bold text-red-500" : ""} hover:underline`}
                        >
                            Repertoire
                        </button>

                        {/* NEW SONGS DROPDOWN */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setDropdownOpen(dropdownOpen === "newsongs" ? "" : "newsongs")
                                }
                                className="flex items-center hover:underline"
                            >
                                New Songs Release <ChevronDown className="w-4 h-4 ml-1" />
                            </button>

                            {dropdownOpen === "newsongs" && (
                                <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-40">
                                    <button
                                        onClick={() => {
                                            setCurrentPage("artist");
                                            setDropdownOpen("");
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Artist
                                    </button>

                                    <button
                                        onClick={() => {
                                            setCurrentPage("album");
                                            setDropdownOpen("");
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Album
                                    </button>

                                    <button
                                        onClick={() => {
                                            setCurrentPage("track");
                                            setDropdownOpen("");
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Track
                                    </button>
                                </div>
                            )}
                        </div>

                        <button className="hover:underline">Resource</button>
                        <button className="hover:underline">Contact</button>
                        <button className="flex items-center hover:underline">
                            Account <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 space-y-2 font-semibold">

                        <button
                            onClick={() => {
                                setCurrentPage("home");
                                setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2"
                        >
                            Home
                        </button>

                        {/* MOBILE REPORTS DROPDOWN */}
                        <button
                            onClick={() =>
                                setMobileDropdown(mobileDropdown === "reports" ? "" : "reports")
                            }
                            className="block w-full text-left py-2"
                        >
                            Reports
                        </button>

                        {mobileDropdown === "reports" && (
                            <>
                                <button
                                    onClick={() => {
                                        setCurrentPage("dsp");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left py-2 pl-4"
                                >
                                    DSP
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentPage("callertune");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left py-2 pl-4"
                                >
                                    Caller Tune
                                </button>
                            </>
                        )}

                        {/* MOBILE NEW SONGS DROPDOWN */}
                        <button
                            onClick={() =>
                                setMobileDropdown(
                                    mobileDropdown === "newsongs" ? "" : "newsongs"
                                )
                            }
                            className="block w-full text-left py-2"
                        >
                            New Songs Release
                        </button>

                        {mobileDropdown === "newsongs" && (
                            <>
                                <button
                                    onClick={() => {
                                        setCurrentPage("artist");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left py-2 pl-4"
                                >
                                    Artist
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentPage("album");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left py-2 pl-4"
                                >
                                    Album
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentPage("track");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left py-2 pl-4"
                                >
                                    Track
                                </button>
                            </>
                        )}

                        <button className="block w-full text-left py-2">Resource</button>
                        <button className="block w-full text-left py-2">Contact</button>
                        <button className="block w-full text-left py-2">Account</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;

import { ChevronDown, Menu, Music } from "lucide-react";
import React from "react";

const NavBar = ({
  currentPage,
  setCurrentPage,
  setDropdownOpen,
  dropdownOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => (
  <nav className="  text-black p-8 ">
    <div className="max-w-7xl mx-auto px-7">
      <div className="flex items-center justify-start gap-20 h-16">
        <div className="flex items-center space-x-2 flex-col">
          <div className="w-10 h-10  rounded-full bg-white border border-emerald-400  flex items-center justify-center">
            <Music className="w-6 h-6  text-orange-500" />
          </div>
          <div className="flex mt-1 ">
            <span className="text-sm font-semibold   hidden sm:block">
              OTT
            </span>
            <span className="text-sm font-semibold   hidden sm:block">
              Solutions
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10 font-semibold cursor-pointer">
          <button
            onClick={() => setCurrentPage("home")}
            className={`cursor-pointer hover-bg-gray-100 hover:underline transition ${
              currentPage === "home" ? "font-bold text-red-500" : ""
            }`}
          >
            Home
          </button>

          <div className="relative ">
            <button
              
              onMouseEnter={() =>
                setDropdownOpen(dropdownOpen === "reports" ? "" : "reports")
              }
              
              className="flex items-center hover:underline cursor-pointer transition"
            >
              Reports <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {dropdownOpen === "reports" && (
              <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-40" onMouseLeave={() =>
                setDropdownOpen(dropdownOpen === "reports" ? "" : "reports")
              }>
                <button
                  onClick={() => {
                    setCurrentPage("dsp");
                    setDropdownOpen("");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  DSP
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("callertune");
                    setDropdownOpen("");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Caller Tune
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setCurrentPage("repertoire")}
            className={`cursor-pointer hover-bg-gray-100 hover:underline transition ${
              currentPage === "repertoire" ? "font-bold text-red-500" : ""
            }`}
          >
            Repertoire
          </button>

          <div className="relative">
            <button
              onClick={() =>
                setDropdownOpen(dropdownOpen === "newsongs" ? "" : "newsongs")
              }
              className="flex items-center hover:underline  transition"
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

          <button className="  transition hover:underline">Resource</button>
          <button className="  transition hover:underline">Contact</button>

          <div className="relative">
            <button className="flex items-center hover:underline  transition">
              Account <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pb-4 space-y-2">
          <button
            onClick={() => {
              setCurrentPage("home");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2"
          >
            Home
          </button>
          <button
            onClick={() => {
              setCurrentPage("dsp");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 pl-4"
          >
            DSP Reports
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
        </div>
      )}
    </div>
  </nav>
);

export default NavBar;

import { Music } from "lucide-react";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full pb-40 pt-10 bg-white">
      {/* Banner */}
      <div className="w-full min-h-30 flex justify-center mb-6 ">
        
      </div>



      {/* Footer Content */}
      <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto text-gray-700 bg-white">
        {/* Left Links */}
        <div className="flex flex-wrap gap-4 text-sm mb-6 md:mb-0">
          <a href="#" className="hover:text-black hover:underline">Home</a>
          <a href="#" className="hover:text-black hover:underline">Reports</a>
          <a href="#" className="hover:text-black hover:underline">Repertoire</a>
          <a href="#" className="hover:text-black hover:underline">New Songs Release</a>
          <a href="#" className="hover:text-black hover:underline">Resource</a>
          <a href="#" className="hover:text-black hover:underline">Contact</a>
          <a href="#" className="hover:text-black hover:underline">Account</a>
        </div>

        {/* Center Logo */}
        <div className="mb-6 md:mb-0">
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
        </div>

        {/* Right Text */}
        <div className="text-center md:text-right text-sm">
          <p className="font-semibold">OTT Solutions Private Limited</p>
          <p>Landline : +913335109301</p>
        </div>
      </div>
    </footer>
  );
}
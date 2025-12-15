import React from "react";
import { MenuIcon } from "./Icons";

export default function Topbar({ toggleSidebar }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded hover:bg-gray-100"
      >
        <MenuIcon className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      {/* Placeholder for right side user info */}
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
      </div>
    </header>
  );
}

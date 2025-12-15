import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SystemOverview from "./SystemOverview";
import UserManagement from "./UserManagement";
import Analytics from "./Analytics";
import { ChartBarIcon, CogIcon, UsersIcon } from "./Icons";

const API_BASE = 'http://localhost:5000/api';

const AdminDashboard = ({ currentUser, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("overview");
  const [systemStats, setSystemStats] = useState({});

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      // Mock system stats - in real app, get from API
      setSystemStats({
        totalUsers: 24,
        totalProjects: 45,
        activeProjects: 32,
        completedProjects: 13,
        systemHealth: "Excellent"
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const renderActiveView = () => {
    switch(activeView) {
      case "overview":
        return <SystemOverview stats={systemStats} />;
      case "users":
        return <UserManagement />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">System Settings</h2>
            <p className="text-gray-600">System configuration and settings would appear here.</p>
          </div>
        );
      default:
        return <SystemOverview stats={systemStats} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={onLogout} userRole="admin" />
      
      <div className={`flex-1 flex flex-col transition-all duration-300`} style={{ marginLeft: isSidebarOpen ? "16rem" : "0" }}>
        <Header 
          toggleSidebar={toggleSidebar} 
          currentUser={currentUser}
          onLogout={onLogout}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Admin Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => setActiveView("overview")}
              className={`p-4 rounded-xl text-left transition-colors ${
                activeView === "overview" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              <ChartBarIcon className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Overview</h3>
              <p className="text-sm opacity-75">System Overview</p>
            </button>

            <button
              onClick={() => setActiveView("users")}
              className={`p-4 rounded-xl text-left transition-colors ${
                activeView === "users" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              <UsersIcon className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Users</h3>
              <p className="text-sm opacity-75">User Management</p>
            </button>

            <button
              onClick={() => setActiveView("analytics")}
              className={`p-4 rounded-xl text-left transition-colors ${
                activeView === "analytics" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              <ChartBarIcon className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm opacity-75">System Analytics</p>
            </button>

            <button
              onClick={() => setActiveView("settings")}
              className={`p-4 rounded-xl text-left transition-colors ${
                activeView === "settings" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              <CogIcon className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Settings</h3>
              <p className="text-sm opacity-75">System Settings</p>
            </button>
          </div>

          {/* Active View Content */}
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
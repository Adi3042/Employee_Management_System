// import React from "react";
// import { ChartBarIcon, TrendingUpIcon, UsersIcon, CheckCircleIcon } from "./Icons";

// const Analytics = () => {
//   const analyticsData = {
//     projectCompletion: 75,
//     teamPerformance: 82,
//     taskEfficiency: 68,
//     userEngagement: 91
//   };

//   const recentActivities = [
//     { action: "Project Completed", user: "Alex Johnson", time: "2 hours ago", type: "success" },
//     { action: "New Task Assigned", user: "Sarah Wilson", time: "4 hours ago", type: "info" },
//     { action: "Progress Updated", user: "Mike Chen", time: "6 hours ago", type: "warning" },
//     { action: "New User Registered", user: "System", time: "1 day ago", type: "info" }
//   ];

//   const ProgressBar = ({ percentage, color = "indigo" }) => {
//     const colorClasses = {
//       indigo: "bg-indigo-600",
//       green: "bg-green-600",
//       yellow: "bg-yellow-600",
//       blue: "bg-blue-600"
//     };

//     return (
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div 
//           className={`h-2 rounded-full ${colorClasses[color]}`}
//           style={{ width: `${percentage}%` }}
//         ></div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Analytics Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           { label: "Project Completion", value: analyticsData.projectCompletion, icon: CheckCircleIcon, color: "green" },
//           { label: "Team Performance", value: analyticsData.teamPerformance, icon: UsersIcon, color: "blue" },
//           { label: "Task Efficiency", value: analyticsData.taskEfficiency, icon: TrendingUpIcon, color: "yellow" },
//           { label: "User Engagement", value: analyticsData.userEngagement, icon: ChartBarIcon, color: "indigo" }
//         ].map((item, index) => (
//           <div key={index} className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">{item.label}</p>
//                 <p className="text-2xl font-bold text-gray-900">{item.value}%</p>
//               </div>
//               <div className={`p-3 rounded-full bg-${item.color}-100 text-${item.color}-600`}>
//                 <item.icon className="w-6 h-6" />
//               </div>
//             </div>
//             <ProgressBar percentage={item.value} color={item.color} />
//           </div>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Performance Chart */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Trends</h3>
//           <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
//             <div className="text-center text-gray-500">
//               <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />
//               <p>Performance charts would be displayed here</p>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activities */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
//           <div className="space-y-4">
//             {recentActivities.map((activity, index) => (
//               <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                 <div className={`w-2 h-2 rounded-full ${
//                   activity.type === 'success' ? 'bg-green-500' :
//                   activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
//                 }`}></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-800">{activity.action}</p>
//                   <p className="text-xs text-gray-600">by {activity.user}</p>
//                 </div>
//                 <span className="text-xs text-gray-500">{activity.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Detailed Metrics */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Metrics</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="text-center p-4 border border-gray-200 rounded-lg">
//             <div className="text-2xl font-bold text-indigo-600">45</div>
//             <div className="text-sm text-gray-600">Total Projects</div>
//           </div>
//           <div className="text-center p-4 border border-gray-200 rounded-lg">
//             <div className="text-2xl font-bold text-green-600">32</div>
//             <div className="text-sm text-gray-600">Active Projects</div>
//           </div>
//           <div className="text-center p-4 border border-gray-200 rounded-lg">
//             <div className="text-2xl font-bold text-blue-600">24</div>
//             <div className="text-sm text-gray-600">Team Members</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;

import React, { useState, useEffect } from "react";
import { ChartBarIcon, TrendingUpIcon, UsersIcon, CheckCircleIcon } from "./Icons";

const API_BASE = 'http://localhost:5000';

const Analytics = () => {
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30days");

  useEffect(() => {
    fetchAnalyticsData();
    fetchSystemLogs();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/xapi/admin/analytics/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/xapi/admin/logs`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const exportData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE}/xapi/admin/export/data`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `Data Exported Successfully!\n\nUsers: ${data.users}\nEmployees: ${data.employees}\nProjects: ${data.projects}\nAssignments: ${data.assignments}`
        );
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data");
    }
  };

  const ProgressBar = ({ percentage, color = "indigo" }) => {
    const colors = {
      indigo: "bg-indigo-600",
      green: "bg-green-600",
      yellow: "bg-yellow-600",
      blue: "bg-blue-600"
    };

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">System Analytics</h2>
          <p className="text-gray-600">Monitor system performance and activities</p>
        </div>

        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>

          <button
            onClick={exportData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Analytics Overview Section (Old UI + New API Data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: stats.users?.total || 0, icon: UsersIcon, color: "blue" },
          { label: "Active Projects", value: stats.projects?.active || 0, icon: CheckCircleIcon, color: "green" },
          { label: "Recent Logins", value: stats.users?.recent_logins || 0, icon: TrendingUpIcon, color: "yellow" },
          { label: "System Uptime", value: stats.system?.uptime || "99.9", icon: ChartBarIcon, color: "indigo" },
        ].map((i, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">{i.label}</p>
                <p className="text-2xl font-bold text-gray-900">{i.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${i.color}-100 text-${i.color}-600`}>
                <i.icon className="w-6 h-6" />
              </div>
            </div>
            <ProgressBar percentage={Number(i.value) % 100} color={i.color} />
          </div>
        ))}
      </div>

      {/* Charts + Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Trends</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />
              <p>Charts would be displayed here</p>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">System Logs</h3>
            <p className="text-sm text-gray-600">Recent authentication, errors & updates</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Message</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">IP</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 text-xs rounded-full ${
                        log.level === "ERROR" ? "bg-red-100 text-red-800" :
                        log.level === "WARNING" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.action || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.message}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.ip_address || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {logs.length === 0 && (
              <div className="p-6 text-center text-gray-500">No logs available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-indigo-600">{stats.projects?.total || 0}</p>
            <p className="text-sm text-gray-600">Total Projects</p>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.projects?.active || 0}</p>
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.users?.employees || 0}</p>
            <p className="text-sm text-gray-600">Team Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

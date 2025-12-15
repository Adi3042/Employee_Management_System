// import React from "react";
// import { CheckCircleIcon, XCircleIcon, ClockIcon, UsersIcon } from "./Icons";

// const SystemOverview = ({ stats }) => {
//   const statCards = [
//     {
//       title: "Total Users",
//       value: stats.totalUsers || 0,
//       icon: UsersIcon,
//       color: "blue",
//       description: "Registered users in system"
//     },
//     {
//       title: "Total Projects",
//       value: stats.totalProjects || 0,
//       icon: CheckCircleIcon,
//       color: "green",
//       description: "All projects created"
//     },
//     {
//       title: "Active Projects",
//       value: stats.activeProjects || 0,
//       icon: ClockIcon,
//       color: "yellow",
//       description: "Currently ongoing projects"
//     },
//     {
//       title: "Completed Projects",
//       value: stats.completedProjects || 0,
//       icon: CheckCircleIcon,
//       color: "indigo",
//       description: "Successfully completed"
//     }
//   ];

//   const getColorClasses = (color) => {
//     const colors = {
//       blue: "bg-blue-100 text-blue-600",
//       green: "bg-green-100 text-green-600",
//       yellow: "bg-yellow-100 text-yellow-600",
//       indigo: "bg-indigo-100 text-indigo-600"
//     };
//     return colors[color] || colors.blue;
//   };

//   return (
//     <div className="space-y-6">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCards.map((stat, index) => (
//           <div key={index} className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
//                 <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
//               </div>
//               <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
//                 <stat.icon className="w-6 h-6" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* System Health */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">System Health</h2>
//         <div className="flex items-center space-x-4">
//           <div className={`p-3 rounded-full ${
//             stats.systemHealth === "Excellent" ? "bg-green-100 text-green-600" : 
//             stats.systemHealth === "Good" ? "bg-blue-100 text-blue-600" : 
//             "bg-red-100 text-red-600"
//           }`}>
//             {stats.systemHealth === "Excellent" ? (
//               <CheckCircleIcon className="w-6 h-6" />
//             ) : (
//               <XCircleIcon className="w-6 h-6" />
//             )}
//           </div>
//           <div>
//             <p className="text-lg font-medium text-gray-800">Status: {stats.systemHealth || "Unknown"}</p>
//             <p className="text-sm text-gray-600">All systems operational</p>
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
//         <div className="space-y-3">
//           {[
//             "System backup completed successfully",
//             "New user registered: John Doe",
//             "Project 'Website Redesign' marked as completed",
//             "Security audit passed"
//           ].map((activity, index) => (
//             <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span className="text-sm text-gray-700">{activity}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SystemOverview;

import React from "react";
import { ShieldIcon, DatabaseIcon, ServerIcon, ActivityIcon } from "./Icons";

const SystemOverview = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
        <p className="text-gray-600">Monitor system health and performance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers || 0}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <ShieldIcon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-green-600">Active: {stats.activeUsers || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProjects || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DatabaseIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-blue-600">Active: {stats.activeProjects || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completedProjects || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ActivityIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {stats.totalProjects > 0 
                ? `${Math.round((stats.completedProjects / stats.totalProjects) * 100)}% completion rate`
                : 'No projects'
              }
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">System Health</p>
              <p className="text-2xl font-bold text-green-600">{stats.systemHealth || 'Excellent'}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ServerIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">All systems operational</p>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                Run System Diagnostics
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                Backup Database
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                Clear Cache
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">System check completed - 5 min ago</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Database backup - 2 hours ago</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Security scan passed - 1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
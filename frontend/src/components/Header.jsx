// // src/components/Header.jsx
// import React, { useState, useEffect } from "react";
// import { MenuIcon, UserIcon } from "./Icons";

// const Header = ({ toggleSidebar, currentUser, onAssignProject }) => {
//   const [manager, setManager] = useState(null);
//   const [showTooltip, setShowTooltip] = useState(false);

//   useEffect(() => {
//     if (currentUser.role === 'employee') {
//       fetchManager();
//     }
//   }, [currentUser]);

//   // In the fetchManager function, change:
//   const fetchManager = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/employees/${currentUser.id}/manager`);
//       const data = await response.json();
//       if (data && data.name) { // Check if manager exists
//         setManager(data);
//       }
//     } catch (error) {
//       console.error('Error fetching manager:', error);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-10 flex items-center justify-between h-16 p-4 bg-white shadow-sm">
//       {/* Sidebar toggle button */}
//       <button
//         onClick={toggleSidebar}
//         className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded"
//       >
//         <MenuIcon className="w-6 h-6" />
//       </button>

//       {/* Page title */}
//       <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>

//       {/* User info and actions */}
//       <div className="flex items-center space-x-4">
//         {onAssignProject && (
//           <button
//             onClick={onAssignProject}
//             className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
//           >
//             Assign Project
//           </button>
//         )}
        
//         <div className="relative">
//           <span className="text-sm font-medium text-gray-700 sm:text-base">
//             Hi, {currentUser.name}
//           </span>
//           {manager && (
//             <div 
//               className="relative inline-block"
//               onMouseEnter={() => setShowTooltip(true)}
//               onMouseLeave={() => setShowTooltip(false)}
//             >
//               <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-full text-white cursor-pointer hover:bg-indigo-600 transition-colors ml-2">
//                 <UserIcon className="w-5 h-5" />
//               </div>
              
//               {showTooltip && (
//                 <div className="absolute right-0 z-20 w-48 p-3 mt-2 bg-white rounded-lg shadow-lg">
//                   <div className="text-sm text-gray-600">
//                     <p className="font-semibold">Manager:</p>
//                     <p>{manager.name}</p>
//                     <p className="text-xs text-gray-500">{manager.email}</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


// Update Header to accept onLogout and role-specific buttons
import React, { useState, useEffect } from "react";
import { MenuIcon, UserIcon } from "./Icons";

const Header = ({ toggleSidebar, currentUser, onAssignProject, onManageTeam, onLogout }) => {
  const [manager, setManager] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role === 'employee') {
      fetchManager();
    }
  }, [currentUser]);

  const fetchManager = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${currentUser.id}/manager`);
      const data = await response.json();
      if (data && data.name) {
        setManager(data);
      }
    } catch (error) {
      console.error('Error fetching manager:', error);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 p-4 bg-white shadow-sm">
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Page title with user role */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Dashboard {currentUser?.role && `- ${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}`}
        </h1>
      </div>

      {/* User info and actions */}
      <div className="flex items-center space-x-4">
        {/* Role-specific buttons */}
        {onAssignProject && (
          <button
            onClick={onAssignProject}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Assign Project
          </button>
        )}
        
        {onManageTeam && (
          <button
            onClick={onManageTeam}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Manage Team
          </button>
        )}

        {/* User menu */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700 sm:text-base">
              Hi, {currentUser?.name}
            </span>
            
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-full text-white cursor-pointer hover:bg-indigo-600 transition-colors">
                <UserIcon className="w-5 h-5" />
              </div>
              
              {/* Manager Tooltip */}
              {showTooltip && manager && (
                <div className="absolute right-0 z-20 w-48 p-3 mt-2 bg-white rounded-lg shadow-lg">
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold">Manager:</p>
                    <p>{manager.name}</p>
                    <p className="text-xs text-gray-500">{manager.email}</p>
                  </div>
                </div>
              )}

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 z-20 w-48 mt-2 bg-white rounded-lg shadow-lg">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-gray-600 border-b">
                      <p className="font-semibold">{currentUser?.name}</p>
                      <p className="text-xs capitalize">{currentUser?.role}</p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
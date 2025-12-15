import React from "react";
import { getIconComponent, LogOutIcon } from "./Icons";

const Sidebar = ({ isOpen, toggleSidebar, onLogout, userRole = "employee" }) => {
  const getNavItems = () => {
    const baseItems = [
      { name: "Dashboard", route: "/dashboard", current: true },
      { name: "Tasks", route: "/tasks", current: false },
      { name: "Messages", route: "/messages", current: false },
    ];

    if (userRole === "manager") {
      baseItems.push(
        { name: "Team", route: "/team", current: false },
        { name: "Reports", route: "/reports", current: false }
      );
    }

    if (userRole === "admin") {
      baseItems.push(
        { name: "Users", route: "/users", current: false },
        { name: "Analytics", route: "/analytics", current: false },
        { name: "Settings", route: "/settings", current: false }
      );
    }

    baseItems.push({ name: "Settings", route: "/settings", current: false });

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      <div
        className={`fixed inset-0 z-20 bg-black opacity-50 lg:hidden transition-opacity ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-slate-900 shadow-2xl transition-transform duration-300`}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 mb-6">
            <span className="text-xl font-extrabold text-indigo-400 tracking-wider">
              EMP DASH
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow space-y-2">
            {navItems.map((item) => {
              const IconComponent = getIconComponent(item.name);
              return (
                <a
                  key={item.name}
                  href={item.route}
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? "bg-slate-800 text-white shadow-md"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  onClick={() => {
                    if (toggleSidebar) toggleSidebar();
                  }}
                >
                  {IconComponent && <IconComponent className="w-5 h-5 mr-3" />}
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* User Role Badge */}
          <div className="p-3 mb-4 bg-slate-800 rounded-lg">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-sm font-medium text-white capitalize">{userRole}</p>
          </div>

          {/* Sign Out */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={onLogout}
              className="flex items-center w-full p-3 text-sm font-medium text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOutIcon className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
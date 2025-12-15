// // src/components/Icons.jsx
// import React from "react";

// export const Icon = ({ path, className = "w-5 h-5" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className={className}
//   >
//     <path d={path} />
//   </svg>
// );

// export const UserIcon = (props) => (
//   <Icon {...props} path="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
// );
// export const MenuIcon = (props) => (
//   <Icon {...props} path="M3 12h18M3 6h18M3 18h18" />
// );
// export const LayoutDashboardIcon = (props) => (
//   <Icon {...props} path="M4 4h16v16H4zM9 9h6v6H9z" />
// );
// export const CheckCircleIcon = (props) => (
//   <Icon {...props} path="M22 11.08V12a10 10 0 1 1-5.87-8.15" />
// );
// export const BellIcon = (props) => (
//   <Icon {...props} path="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
// );
// export const SettingsIcon = (props) => (
//   <Icon {...props} path="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
// );
// export const LogOutIcon = (props) => (
//   <Icon {...props} path="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3" />
// );

// // Add to existing Icons.jsx
// export const ChartBarIcon = (props) => (
//   <Icon {...props} path="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" />
// );

// export const UsersIcon = (props) => (
//   <Icon {...props} path="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
// );

// export const CogIcon = (props) => (
//   <Icon {...props} path="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
// );

// // Add to existing Icons.jsx
// export const PlusIcon = (props) => (
//   <Icon {...props} path="M12 5v14M5 12h14" />
// );

// export const EditIcon = (props) => (
//   <Icon {...props} path="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
// );

// export const TrashIcon = (props) => (
//   <Icon {...props} path="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
// );

// export const PhoneIcon = (props) => (
//   <Icon {...props} path="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
// );

// export const TrendingUpIcon = (props) => (
//   <Icon {...props} path="M23 6l-9.5 9.5-5-5L1 18" />
// );

// export const XCircleIcon = (props) => (
//   <Icon {...props} path="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6M9 9l6 6" />
// );

// export const getIconComponent = (name) => {
//   switch (name) {
//     case "Dashboard":
//       return LayoutDashboardIcon;
//     case "Tasks":
//       return CheckCircleIcon;
//     case "Reports":
//       return BellIcon;
//     case "Settings":
//       return SettingsIcon;
//     default:
//       return null;
//   }
// };

// src/components/Icons.jsx
import React from "react";

export const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={path} />
  </svg>
);

export const UserIcon = (props) => (
  <Icon {...props} path="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
);

export const MenuIcon = (props) => (
  <Icon {...props} path="M3 12h18M3 6h18M3 18h18" />
);

export const LayoutDashboardIcon = (props) => (
  <Icon {...props} path="M4 4h16v16H4zM9 9h6v6H9z" />
);

export const CheckCircleIcon = (props) => (
  <Icon {...props} path="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
);

export const BellIcon = (props) => (
  <Icon {...props} path="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
);

export const SettingsIcon = (props) => (
  <Icon {...props} path="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
);

export const LogOutIcon = (props) => (
  <Icon {...props} path="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3" />
);

export const ChartBarIcon = (props) => (
  <Icon {...props} path="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" />
);

export const UsersIcon = (props) => (
  <Icon {...props} path="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
);

export const CogIcon = (props) => (
  <Icon {...props} path="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
);

export const PlusIcon = (props) => (
  <Icon {...props} path="M12 5v14M5 12h14" />
);

export const EditIcon = (props) => (
  <Icon {...props} path="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
);

export const TrashIcon = (props) => (
  <Icon {...props} path="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
);

export const PhoneIcon = (props) => (
  <Icon {...props} path="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
);

export const TrendingUpIcon = (props) => (
  <Icon {...props} path="M23 6l-9.5 9.5-5-5L1 18" />
);

export const XCircleIcon = (props) => (
  <Icon {...props} path="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6M9 9l6 6" />
);

export const MailIcon = (props) => (
  <Icon {...props} path="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
);

export const ClockIcon = (props) => (
  <Icon {...props} path="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" />
);

// Add these to your Icons.jsx file

export const ShieldIcon = (props) => (
  <Icon {...props} path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
);

export const DatabaseIcon = (props) => (
  <Icon {...props} path="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
);

export const ServerIcon = (props) => (
  <Icon {...props} path="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
);

export const ActivityIcon = (props) => (
  <Icon {...props} path="M22 12h-4l-3 9L9 3l-3 9H2" />
);

export const KeyIcon = (props) => (
  <Icon {...props} path="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
);

export const EyeIcon = (props) => (
  <Icon {...props} path="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
);

export const getIconComponent = (name) => {
  switch (name) {
    case "Dashboard":
      return LayoutDashboardIcon;
    case "Tasks":
      return CheckCircleIcon;
    case "Reports":
      return ChartBarIcon;
    case "Settings":
      return SettingsIcon;
    case "Messages":
      return BellIcon;
    case "Team":
      return UsersIcon;
    case "Users":
      return UsersIcon;
    case "Analytics":
      return ChartBarIcon;
    default:
      return null;
  }
};
// Icons.jsx - COMPLETE VERSION
import React from "react";

// Base Icon Component
const Icon = ({ path, className = "w-5 h-5", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d={path} />
  </svg>
);

// Export ALL icons
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

export const UserGroupIcon = (props) => (
  <Icon {...props} path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
);

export const ClipboardCheckIcon = (props) => (
  <Icon {...props} path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
);

export const PencilIcon = (props) => (
  <Icon {...props} path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
);

export const EyeIcon = (props) => (
  <Icon {...props} path="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
);

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

export const DocumentTextIcon = (props) => (
  <Icon {...props} path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
);

export const CalendarIcon = (props) => (
  <Icon {...props} path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
);

export const ChatIcon = (props) => (
  <Icon {...props} path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
);

export const ArrowLeftIcon = (props) => (
  <Icon {...props} path="M10 19l-7-7m0 0l7-7m-7 7h18" />
);

export const ShieldCheckIcon = (props) => (
  <Icon {...props} path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
);

// Helper function to get icon by name
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
    case "UserGroup":
      return UserGroupIcon;
    case "ClipboardCheck":
      return ClipboardCheckIcon;
    case "Shield":
      return ShieldIcon;
    case "Database":
      return DatabaseIcon;
    case "Server":
      return ServerIcon;
    case "Activity":
      return ActivityIcon;
    case "Key":
      return KeyIcon;
    case "Mail":
      return MailIcon;
    case "Clock":
      return ClockIcon;
    case "Edit":
      return EditIcon;
    case "Trash":
      return TrashIcon;
    case "Plus":
      return PlusIcon;
    case "Eye":
      return EyeIcon;
    default:
      return null;
  }
};

// Default export
export default Icon;
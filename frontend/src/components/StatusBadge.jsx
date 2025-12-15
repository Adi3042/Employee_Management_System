// src/components/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  let colorClasses = "";
  switch (status) {
    case "In Progress": colorClasses = "bg-blue-100 text-blue-800"; break;
    case "Completed": colorClasses = "bg-green-100 text-green-800"; break;
    case "On Hold": colorClasses = "bg-yellow-100 text-yellow-800"; break;
    case "Overdue": colorClasses = "bg-red-100 text-red-800"; break;
    default: colorClasses = "bg-gray-100 text-gray-800";
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${colorClasses}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

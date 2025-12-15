// src/components/ProjectListItem.jsx
import React from "react";
import StatusBadge from "./StatusBadge";

const ProjectListItem = ({ title, status, progress, deadline }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 last:border-b-0 transition-all duration-150 hover:bg-gray-50 cursor-pointer">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-medium text-gray-800">{title}</span>
          <StatusBadge status={status} />
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Progress: {progress}%</span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <span>Deadline: {formatDate(deadline)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectListItem;
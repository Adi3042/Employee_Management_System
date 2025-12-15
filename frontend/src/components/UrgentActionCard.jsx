// src/components/UrgentActionCard.jsx
import React from "react";
import { BellIcon } from "./Icons";

const UrgentActionCard = () => (
  <div className="p-4 mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-xl shadow-md transition-shadow hover:shadow-lg">
    <div className="flex items-start">
      <BellIcon className="w-6 h-6 mt-1 mr-3 text-yellow-600" />
      <div>
        <h2 className="text-lg font-bold text-gray-900">Urgent Action Required</h2>
        <p className="mt-1 text-sm text-gray-600">
          Action Required: Complete your Q3 performance review by end of day Friday.
        </p>
      </div>
    </div>
    <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
      View Details
    </button>
  </div>
);

export default UrgentActionCard;

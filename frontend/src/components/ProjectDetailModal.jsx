// src/components/ProjectDetailModal.jsx
import React from "react";

const ProjectDetailModal = ({ project, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{project.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Status</h3>
                <p className="text-gray-600 capitalize">{project.status}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Deadline</h3>
                <p className="text-gray-600">{formatDate(project.deadline)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Created</h3>
                <p className="text-gray-600">{formatDate(project.created_at)}</p>
              </div>
            </div>

            {project.assignments && project.assignments.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Team Members</h3>
                <div className="space-y-2">
                  {project.assignments.map((assignment, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{assignment.employee_name}</p>
                        <p className="text-sm text-gray-600">
                          Assigned by {assignment.assigned_by} on {formatDate(assignment.assigned_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{assignment.progress}%</p>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${assignment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
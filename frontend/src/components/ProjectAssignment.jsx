import React, { useState, useEffect } from "react";
import { CheckIcon, XIcon } from "./Icons";

const API_BASE = 'http://localhost:5000/api';

const ProjectAssignment = ({ currentUser }) => {
  const [availableProjects, setAvailableProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Fetch available projects
      const projectsResponse = await fetch(`${API_BASE}/manager/available-projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch team members
      const teamResponse = await fetch(`${API_BASE}/manager/team`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (projectsResponse.ok && teamResponse.ok) {
        const projects = await projectsResponse.json();
        const team = await teamResponse.json();
        
        setAvailableProjects(projects);
        setTeamMembers(team);
        
        // Fetch existing assignments
        fetchAssignments(team.map(member => member.id));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (teamMemberIds) => {
    try {
      const token = localStorage.getItem('access_token');
      const allAssignments = [];
      
      for (const memberId of teamMemberIds) {
        const response = await fetch(`${API_BASE}/projects?employee_id=${memberId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const assignments = await response.json();
          allAssignments.push(...assignments.map(a => ({
            ...a,
            employee_id: memberId
          })));
        }
      }
      
      setAssignments(allAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleAssignProject = async () => {
    if (!selectedProject || !selectedEmployee) {
      alert('Please select both a project and an employee');
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/manager/projects/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_id: selectedProject.id,
          employee_id: selectedEmployee
        })
      });
      
      if (response.ok) {
        alert('Project assigned successfully!');
        setShowAssignmentModal(false);
        setSelectedProject(null);
        setSelectedEmployee("");
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to assign project');
      }
    } catch (error) {
      console.error('Error assigning project:', error);
      alert('Failed to assign project');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getProjectStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Project Assignment</h2>
          <p className="text-gray-600">Assign projects to your team members</p>
        </div>
        
        <button
          onClick={() => setShowAssignmentModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Assign New Project
        </button>
      </div>

      {/* Current Assignments */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Current Assignments</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => {
                const teamMember = teamMembers.find(m => m.id === assignment.employee_id);
                return (
                  <tr key={`${assignment.id}-${assignment.employee_id}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{assignment.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {assignment.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-indigo-600 text-sm font-semibold">
                            {teamMember?.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{teamMember?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{teamMember?.position || 'Employee'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getProjectStatusColor(assignment.status)}`}>
                        {assignment.status || 'Not Started'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${assignment.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{assignment.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(assignment.deadline)}
                    </td>
                  </tr>
                );
              })}
              
              {assignments.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No project assignments yet. Assign your first project to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Projects */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Available Projects</h3>
          <p className="text-sm text-gray-600">Projects available for assignment</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {availableProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-800">{project.title}</h4>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getProjectStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Priority:</span>
                  <span className={`font-medium ${
                    project.priority === 'High' ? 'text-red-600' :
                    project.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {project.priority}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Deadline:</span>
                  <span className="font-medium">{formatDate(project.deadline)}</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedProject(project);
                  setShowAssignmentModal(true);
                }}
                className="w-full mt-4 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm font-medium"
              >
                Assign to Team Member
              </button>
            </div>
          ))}
          
          {availableProjects.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <div className="text-gray-400 mb-4">📋</div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">No available projects</h4>
              <p className="text-gray-500">All projects are assigned or none are available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedProject ? `Assign: ${selectedProject.title}` : 'Assign Project'}
                </h3>
                <button
                  onClick={() => {
                    setShowAssignmentModal(false);
                    setSelectedProject(null);
                    setSelectedEmployee("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              
              {selectedProject && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">{selectedProject.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className={`px-2 py-1 rounded-full ${getProjectStatusColor(selectedProject.status)}`}>
                      {selectedProject.status}
                    </span>
                    <span className="text-gray-500">Priority: {selectedProject.priority}</span>
                    <span className="text-gray-500">Deadline: {formatDate(selectedProject.deadline)}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {!selectedProject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Project
                    </label>
                    <select
                      value={selectedProject?.id || ""}
                      onChange={(e) => {
                        const project = availableProjects.find(p => p.id === e.target.value);
                        setSelectedProject(project);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Choose a project...</option>
                      {availableProjects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.title} ({project.status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Team Member
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select team member...</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.position || 'Employee'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignmentModal(false);
                    setSelectedProject(null);
                    setSelectedEmployee("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignProject}
                  disabled={!selectedProject || !selectedEmployee}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    !selectedProject || !selectedEmployee
                      ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <CheckIcon className="w-5 h-5" />
                  Assign Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAssignment;
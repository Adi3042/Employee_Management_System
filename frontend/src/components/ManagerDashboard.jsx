import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import UrgentActionCard from "./UrgentActionCard";
import ProjectListItem from "./ProjectListItem";
import ChatSection from "./ChatSection";
import ProjectDetailModal from "./ProjectDetailModal";
import AssignProjectModal from "./AssignProjectModal";
import TeamManagement from "./TeamManagement";
import { CheckCircleIcon, UsersIcon } from "./Icons";
import { projectsAPI, employeesAPI } from "../api/api";

const API_BASE = 'http://localhost:5000/api';

const ManagerDashboard = ({ currentUser, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [activeView, setActiveView] = useState("projects"); // "projects" or "team"

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchAllProjects();
    fetchTeamMembers();
  }, [currentUser]);

  // const fetchAllProjects = async () => {
  //   try {
  //     const response = await fetch(`${API_BASE}/projects`);
  //     const data = await response.json();
  //     setProjects(data);
  //   } catch (error) {
  //     console.error('Error fetching projects:', error);
  //   }
  // };

  // const fetchTeamMembers = async () => {
  //   try {
  //     const response = await fetch(`${API_BASE}/employees`);
  //     const data = await response.json();
  //     // Filter to get only employees (not other managers or admins)
  //     const employees = data.filter(emp => emp.role === 'employee');
  //     setTeamMembers(employees);
  //   } catch (error) {
  //     console.error('Error fetching team members:', error);
  //   }
  // };

  // Use in your functions:
  const fetchAllProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await employeesAPI.getAll();
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleProjectClick = async (projectId) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}`);
      const data = await response.json();
      setSelectedProject(data);
      setShowProjectModal(true);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const handleAssignProject = async (projectData) => {
    try {
      await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      setShowAssignModal(false);
      fetchAllProjects();
    } catch (error) {
      console.error('Error assigning project:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={onLogout} userRole="manager" />
      
      <div className={`flex-1 flex flex-col transition-all duration-300`} style={{ marginLeft: isSidebarOpen ? "16rem" : "0" }}>
        <Header 
          toggleSidebar={toggleSidebar} 
          currentUser={currentUser}
          onLogout={onLogout}
          onAssignProject={() => setShowAssignModal(true)}
          onManageTeam={() => setShowTeamManagement(true)}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <UrgentActionCard />

          {/* View Toggle */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveView("projects")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeView === "projects" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              <CheckCircleIcon className="w-4 h-4 inline mr-2" />
              All Projects
            </button>
            <button
              onClick={() => setActiveView("team")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeView === "team" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              <UsersIcon className="w-4 h-4 inline mr-2" />
              Team Management
            </button>
          </div>

          {activeView === "projects" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Projects Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 mr-3 text-indigo-600" />
                      <h1 className="text-xl font-semibold text-gray-800">
                        All Projects ({projects.length})
                      </h1>
                    </div>
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                      Assign New Project
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {projects.map((project) => (
                      <div key={project.id} onClick={() => handleProjectClick(project.id)}>
                        <ProjectListItem
                          title={project.title}
                          status={project.status}
                          progress={project.progress}
                          deadline={project.deadline}
                          showTeam={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="lg:col-span-1">
                <ChatSection currentUser={currentUser} />
              </div>
            </div>
          )}

          {activeView === "team" && (
            <TeamManagement 
              teamMembers={teamMembers} 
              currentUser={currentUser}
              onRefresh={fetchTeamMembers}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {showProjectModal && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setShowProjectModal(false)}
          userRole="manager"
        />
      )}

      {showAssignModal && (
        <AssignProjectModal
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignProject}
          currentUser={currentUser}
          teamMembers={teamMembers}
        />
      )}

      {showTeamManagement && (
        <TeamManagement
          teamMembers={teamMembers}
          currentUser={currentUser}
          onClose={() => setShowTeamManagement(false)}
          onRefresh={fetchTeamMembers}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
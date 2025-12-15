import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import UrgentActionCard from "./UrgentActionCard";
import ProjectListItem from "./ProjectListItem";
import ChatSection from "./ChatSection";
import ProjectDetailModal from "./ProjectDetailModal";
import { CheckCircleIcon } from "./Icons";
import { projectsAPI } from "../api/api";

const EmployeeDashboard = ({ currentUser, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectsAPI.getAll(currentUser.id);
      
      // Ensure data is an array
      const data = response.data;
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data && typeof data === 'object') {
        // If it's a single object, wrap it in array
        setProjects([data]);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      // Handle demo mode - return mock data
      if (currentUser.id.includes('demo') || localStorage.getItem('demo_mode') === 'true') {
        const mockProjects = [
          {
            id: 'project1',
            title: 'Alpha Launch Phase 2',
            description: 'Complete the second phase of alpha product launch.',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'In Progress',
            progress: 45
          },
          {
            id: 'project2',
            title: 'Q4 Marketing Strategy',
            description: 'Develop and implement marketing strategy for Q4.',
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Completed',
            progress: 100
          }
        ];
        setProjects(mockProjects);
      } else {
        setError('Failed to load projects. Please try again.');
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (projectId) => {
    try {
      const response = await projectsAPI.getById(projectId);
      setSelectedProject(response.data);
      setShowProjectModal(true);
    } catch (error) {
      console.error('Error fetching project details:', error);
      alert('Failed to load project details');
    }
  };

  const updateProgress = async (projectId, progress) => {
    try {
      // This would call your backend API
      // await projectsAPI.updateProgress(projectId, progress);
      alert(`Progress update for project ${projectId} to ${progress}% would be saved here.`);
      
      // Update local state
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId
            ? { ...project, progress: progress }
            : project
        )
      );
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={onLogout} userRole="employee" />
      
      <div className={`flex-1 flex flex-col transition-all duration-300`} style={{ marginLeft: isSidebarOpen ? "16rem" : "0" }}>
        <Header 
          toggleSidebar={toggleSidebar} 
          currentUser={currentUser}
          onLogout={onLogout}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <UrgentActionCard />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Projects Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-3 text-indigo-600" />
                    <h1 className="text-xl font-semibold text-gray-800">
                      My Projects ({projects.length})
                    </h1>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading projects...</div>
                  ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                  ) : projects.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No projects assigned to you.</div>
                  ) : (
                    projects.map((project) => (
                      <div key={project.id} onClick={() => handleProjectClick(project.id)}>
                        <ProjectListItem
                          title={project.title}
                          status={project.status}
                          progress={project.progress}
                          deadline={project.deadline}
                          onUpdateProgress={(newProgress) => updateProgress(project.id, newProgress)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="lg:col-span-1">
              <ChatSection currentUser={currentUser} />
            </div>
          </div>
        </main>
      </div>

      {/* Project Detail Modal */}
      {showProjectModal && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setShowProjectModal(false)}
          onUpdateProgress={updateProgress}
          userRole="employee"
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
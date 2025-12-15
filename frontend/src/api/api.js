import axios from "axios";

const API_BASE = "http://localhost:5173";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    const demoMode = localStorage.getItem("demo_mode");
    
    if (token) {
      // For demo mode, we still send the token but handle it differently in backend
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle 401 Unauthorized errors
    if (response && response.status === 401) {
      const demoMode = localStorage.getItem("demo_mode");
      
      if (demoMode !== 'true') {
        // Only logout for non-demo users
        console.error("Authentication failed, logging out...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("demo_mode");
        
        // Redirect to login page
        window.location.href = "/";
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for common API calls
export const authAPI = {
  login: (email, password) => api.post("/api/auth/login", { email, password }),
  register: (userData) => api.post("/api/auth/register", userData),
  verifyEmail: (token) => api.get(`/api/auth/verify-email/${token}`),
  getCurrentUser: () => api.get("/api/auth/me"),
  googleLogin: () => {
    // For Google OAuth, we redirect
    window.location.href = `${API_BASE}/api/auth/google`;
  },
};

export const projectsAPI = {
  getAll: (employeeId) => api.get(`/api/projects${employeeId ? `?employee_id=${employeeId}` : ''}`),
  getById: (id) => api.get(`/api/projects/${id}`),
  create: (projectData) => api.post("/api/projects", projectData),
  updateProgress: (projectId, progress) => api.put(`/api/projects/${projectId}/progress`, { progress }),
};

export const employeesAPI = {
  getAll: () => api.get("/api/employees"),
  getManager: (employeeId) => api.get(`/api/employees/${employeeId}/manager`),
};

export const messagesAPI = {
  getContacts: (userId) => api.get(`/api/messages?user_id=${userId}`),
  getConversation: (userId, contactId) => api.get(`/api/messages?user_id=${userId}&contact_id=${contactId}`),
  sendMessage: (messageData) => api.post("/api/messages", messageData),
};

export default api;
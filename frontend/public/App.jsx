import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import EmployeeDashboard from "./components/EmployeeDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { authAPI } from "./api/api";

// --------------------- OAuth Success Component ---------------------
function OAuthSuccess({ onLogin }) {
  const navigate = useNavigate();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    async function fetchOAuthData() {
      try {
        setHasFetched(true);
        
        const response = await fetch("http://localhost:5000/api/auth/oauth-data", {
          method: "GET",
          credentials: "include", // Important for session cookies
          headers: {
            "Accept": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("OAuth Response:", data);

        if (data.error) {
          console.error("OAuth error:", data.error);
          navigate("/?error=" + encodeURIComponent(data.error));
          return;
        }

        // Store token + user
        if (data.tokens?.access_token) {
          localStorage.setItem("access_token", data.tokens.access_token);
        } else {
          console.warn("No access token in OAuth response");
        }

        if (data.user) {
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          onLogin(data.user);
        } else {
          // Fallback if user data is in different location
          const userData = data.user || data;
          localStorage.setItem("currentUser", JSON.stringify(userData));
          onLogin(userData);
        }

        // Wait a moment before redirecting to ensure state is updated
        setTimeout(() => {
          navigate("/");
        }, 100);

      } catch (err) {
        console.error("OAuth processing failed:", err);
        navigate("/?error=" + encodeURIComponent(err.message || "OAuth processing failed"));
      }
    }

    fetchOAuthData();
  }, [navigate, onLogin, hasFetched]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Signing you in with Google...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we authenticate</p>
      </div>
    </div>
  );
}

// --------------------------- Main App -----------------------------
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const demoMode = localStorage.getItem("demo_mode");

    if (demoMode === "true" && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setLoading(false);
    } else {
      verifyToken();
    }
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getCurrentUser();

      if (response.data) {
        setCurrentUser(response.data);
        localStorage.setItem("currentUser", JSON.stringify(response.data));
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("currentUser");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.clear();
  };

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case "employee":
        return <EmployeeDashboard currentUser={currentUser} onLogout={handleLogout} />;
      case "manager":
        return <ManagerDashboard currentUser={currentUser} onLogout={handleLogout} />;
      case "admin":
        return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
      default:
        return <EmployeeDashboard currentUser={currentUser} onLogout={handleLogout} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* OAuth Success Route */}
        <Route path="/oauth-success" element={<OAuthSuccess onLogin={handleLogin} />} />

        {/* Main Route */}
        <Route
          path="/"
          element={
            currentUser ? (
              <div className="min-h-screen bg-gray-50">{renderDashboard()}</div>
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

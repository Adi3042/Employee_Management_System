import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = ({ onLogin, onError }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing OAuth login...");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOAuthData() {
      try {
        const response = await fetch("http://localhost:5000/api/auth/oauth-data", {
          method: "GET",
          credentials: "include",
          headers: {
            "Accept": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          if (onError) onError();
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Store token + user
        if (data.tokens?.access_token) {
          localStorage.setItem("access_token", data.tokens.access_token);
        }

        if (data.user) {
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          onLogin(data.user);
          setTimeout(() => navigate("/"), 100);
        } else {
          setError("No user data received");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (err) {
        console.error("OAuth processing failed:", err);
        setError(err.message || "OAuth processing failed");
        if (onError) onError();
        setTimeout(() => navigate("/login"), 2000);
      }
    }

    fetchOAuthData();
  }, [navigate, onLogin, onError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-600 text-4xl mb-4">✗</div>
            <p className="text-red-600 text-lg font-medium mb-2">Error</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-gray-500 text-sm">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{message}</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we authenticate</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthSuccess;
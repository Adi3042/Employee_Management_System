// TestApp.jsx
import React from "react";

const TestApp = () => {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#f7fafc', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ color: '#4a5568', fontSize: '2.5rem', marginBottom: '20px' }}>
        ✅ React is Loading!
      </h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <h2 style={{ color: '#2d3748', marginBottom: '15px' }}>
          If you can see this, React is working!
        </h2>
        <p style={{ color: '#718096', marginBottom: '20px' }}>
          Next, check the browser console (F12) for errors.
        </p>
        
        <div style={{ backgroundColor: '#edf2f7', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Common Issues:</h3>
          <ul style={{ color: '#718096', marginLeft: '20px' }}>
            <li>Missing icon exports in Icons.jsx</li>
            <li>Incorrect imports</li>
            <li>Routing issues in App.jsx</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ebf8ff', borderRadius: '8px' }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#4299e1',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Refresh Page
          </button>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{
              backgroundColor: '#48bb78',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              marginLeft: '10px'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestApp;
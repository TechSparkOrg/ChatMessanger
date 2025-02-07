import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Components/Login';
import Register from './Components/Register';
import ChatRoom from './Components/ChatRoom';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login or chat based on auth status */}
          <Route
            path="/"
            element={
              localStorage.getItem('token') ? (
                <Navigate to="/chat" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

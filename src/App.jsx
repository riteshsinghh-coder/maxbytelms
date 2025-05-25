// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import FileUpload from './FileUpload';
import './App.css';

const PrivateRoute = ({ role, element }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return element;
};

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setLoggedInUser(parsed);
      } catch (err) {
        console.error('Error parsing saved user:', err);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setLoggedInUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.clear();
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route
          path="/admin-dashboard"
          element={<PrivateRoute role="admin" element={<AdminDashboard user={loggedInUser} onLogout={handleLogout} />} />}
        />

        <Route
          path="/student-dashboard"
          element={<PrivateRoute role="student" element={<StudentDashboard user={loggedInUser} onLogout={handleLogout} />} />}
        />

        <Route
          path="/upload"
          element={<PrivateRoute role="admin" element={<FileUpload />} />}
        />

        <Route
          path="/"
          element={loggedInUser ? <Navigate to={`/${loggedInUser.role}-dashboard`} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
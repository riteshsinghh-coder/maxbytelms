import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import FileUpload from './FileUpload';
import './App.css';

// PrivateRoute Component to guard routes based on login and role
const PrivateRoute = ({ role, element }) => {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const storedRole = localStorage.getItem('role');

  console.log('loggedInUser:', loggedInUser);  // Debugging line
  console.log('storedRole:', storedRole);  // Debugging line

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

  if (role && storedRole !== role) {
    return <Navigate to="/login" />;
  }

  return element;
};

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    console.log(savedUser);  // Debugging line
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setLoggedInUser(parsedUser);
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setLoggedInUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('uid', user.uid);
    localStorage.setItem('password', user.password);
    localStorage.setItem('role', user.role); // ✅ Save the selected role
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.clear();
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route
          path="/upload"
          element={
            <PrivateRoute
              role="admin"
              element={
                <FileUpload
                  videoURL=""
                  handleVideoChange={() => {}}
                  target={{ type: '', value: '' }}
                  setTarget={() => {}}
                  groups={[]}
                  students={[]}
                />
              }
            />
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute
              role="admin"
              element={<AdminDashboard user={loggedInUser} onLogout={handleLogout} />}
            />
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute
              role="student"
              element={<StudentDashboard user={loggedInUser} onLogout={handleLogout} />}
            />
          }
        />

        <Route
          path="/"
          element={
            loggedInUser ? (
              <Navigate to={loggedInUser.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

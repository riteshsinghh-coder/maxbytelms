import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import teachers from './data/users.js';

const Login = ({ onLogin }) => {
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default to student
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch students data from students.json (ensure the path is correct)
    fetch('./data/students.json') // Path to the students.json file
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load students: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => setStudents(data))
      .catch(err => console.error('Error:', err));

    const savedUid = localStorage.getItem('uid');
    const savedPassword = localStorage.getItem('password');
    const savedRole = localStorage.getItem('role');

    if (savedUid && savedPassword && savedRole) {
      let user;
      if (savedRole === 'student') {
        user = students.find(u => u.uid.toLowerCase() === savedUid.toLowerCase() && u.password === savedPassword);
      } else {
        user = teachers.find(t => t.uid.toLowerCase() === savedUid.toLowerCase() && t.password === savedPassword);
      }

      if (user) {
        user.role = savedRole;
        onLogin(user);
        navigate(savedRole === 'admin' ? '/admin-dashboard' : '/student-dashboard');
      }
    }
  }, [onLogin, navigate, students]);

  const handleLogin = () => {
    const enteredUid = uid.trim().toLowerCase();
    let user;

    if (role === 'student') {
      user = students.find(u => u.uid.toLowerCase() === enteredUid && u.password === password);
    } else {
      user = teachers.find(t => t.uid.toLowerCase() === enteredUid && t.password === password);
    }

    if (user) {
      user.role = role;
      localStorage.setItem('uid', enteredUid);
      localStorage.setItem('password', password);
      localStorage.setItem('role', role);
      onLogin(user);
      navigate(role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
    } else {
      setError('Invalid UID or Password');
    }
  };

  const styles = {
    container: {
      backgroundColor: '#f8f8f8',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      backgroundColor: 'white',
      color: '#7F00FF',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      width: '320px',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#7F00FF',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#5e00c0',
    },
    error: {
      color: 'red',
      marginTop: '10px',
    },
    title: {
      marginBottom: '20px',
    },
    radioGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '10px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <div style={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === 'student'}
              onChange={() => setRole('student')}
            /> Student
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
            /> Teacher
          </label>
        </div>

        <input
          type="text"
          placeholder="Enter UID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={handleLogin}
          style={styles.button}
          onMouseOver={e => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={e => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          Login
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FaSpinner } from 'react-icons/fa';
import { FiLogIn, FiUser, FiLock, FiChevronDown } from 'react-icons/fi';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ 
    uid: '', 
    password: '', 
    role: 'student' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      navigate(user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
    }
  }, [navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok) {
        if (contentType.includes('application/json')) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Login failed');
        } else {
          throw new Error('Login failed with status ' + res.status);
        }
      }

      if (contentType.includes('application/json')) {
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        if (formData.role === 'admin' && data.allStudents) {
          localStorage.setItem('students', JSON.stringify(data.allStudents));
        }
        onLogin && onLogin(data.user);
        navigate(data.user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
      } else {
        throw new Error('Expected JSON response but got: ' + contentType);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <AnimatePresence>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {error}
          </ErrorMessage>
        )}
      </AnimatePresence>

      <LoginForm 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginHeader>
          <FiLogIn size={32} color="#8052e0" />
          <h2>Welcome Back</h2>
          <p>Please login to continue</p>
        </LoginHeader>

        <FormGroup>
          <SelectWrapper>
            <FiUser size={18} color="#8052e0" />
            <RoleSelect 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </RoleSelect>
            <FiChevronDown size={18} color="#8052e0" />
          </SelectWrapper>
        </FormGroup>

        <FormGroup>
          <InputWrapper>
            <FiUser size={18} color="#8052e0" />
            <Input
              type="text"
              name="uid"
              placeholder="UID"
              value={formData.uid}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <InputWrapper>
            <FiLock size={18} color="#8052e0" />
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TogglePassword onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </TogglePassword>
          </InputWrapper>
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.03 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <Spinner>
              <FaSpinner className="spin" />
            </Spinner>
          ) : (
            'Login'
          )}
        </SubmitButton>

        <FooterText>
          Don't have an account? <a href="#">Contact admin</a>
        </FooterText>
      </LoginForm>
    </LoginContainer>
  );
};

// Styled Components
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;
`;

const LoginForm = styled(motion.form)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  
  h2 {
    color: #8052e0;
    margin: 1rem 0 0.5rem;
    font-size: 1.8rem;
  }
  
  p {
    color: #718096;
    margin: 0;
    font-size: 0.9rem;
  }
`;

const FormGroup = styled.div`
  position: relative;
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: #8052e0;
    box-shadow: 0 0 0 3px rgba(128, 82, 224, 0.2);
  }
`;

const RoleSelect = styled.select`
  width: 100%;
  padding: 0.8rem 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  appearance: none;
  color: #4a5568;
  font-weight: 500;
  
  &:focus {
    outline: none;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: #8052e0;
    box-shadow: 0 0 0 3px rgba(128, 82, 224, 0.2);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const TogglePassword = styled.span`
  color: #8052e0;
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: 0.5rem;
  font-weight: 500;
  user-select: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #8052e0 0%, #a17fe0 100%);
  color: white;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  display: inline-block;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled(motion.div)`
  background: #fff5f5;
  color: #e53e3e;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const FooterText = styled.p`
  text-align: center;
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
  
  a {
    color: #8052e0;
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Login;
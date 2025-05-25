import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';
import NavigationButtons from './NavigationButtons';
import StudentList from './StudentList';
import FileUpload from './FileUpload';
import AdminQuestionForm from './AdminQuestionForm';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  body {
    background-color: #f5f7fa;
    color: #333;
    line-height: 1.6;
  }
`;

const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled(motion.aside)`
  width: 280px;
  background: linear-gradient(135deg, #2b6cb0 0%, #4299e1 100%);
  color: white;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 10;
  @media (max-width: 768px) {
    width: 100%;
    position: fixed;
    height: ${props => (props.isMobileOpen ? '100vh' : '70px')};
    overflow: hidden;
    transition: all 0.3s ease;
    padding: ${props => (props.isMobileOpen ? '2rem 1.5rem' : '0 1.5rem')};
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #f9f9f9;
  overflow-y: auto;
  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 70px;
  }
`;

const Loader = styled.div`
  font-size: 1.25rem;
  text-align: center;
  margin-top: 3rem;
  color: #4a5568;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid #ebf4ff;
    border-top-color: #4299e1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-top: 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  cursor: pointer;
  z-index: 20;
  @media (max-width: 768px) {
    display: block;
  }
`;

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeSection, setActiveSection] = useState('studentManagement'); // Default section
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get students from localStorage
        const savedStudents = JSON.parse(localStorage.getItem('students')) || [];
        setStudents(savedStudents);

        // Fetch courses from backend
        const coursesRes = await fetch('/api/courses');
        const coursesData = await coursesRes.json();
        setCourses(coursesData);

        setLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (!currentUser || currentUser.role !== 'admin') return <h2>Access Denied: Admins only</h2>;

  return (
    <>
      <GlobalStyle />
      <DashboardWrapper>
        <Sidebar animate={isMobileOpen ? "open" : "closed"} isMobileOpen={isMobileOpen}>
          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>
          <SidebarTitle>Admin Dashboard</SidebarTitle>
          <NavigationButtons setActiveSection={setActiveSection} />
        </Sidebar>

        <MainContent>
          <AnimatePresence>
            {loading ? (
              <Loader>Loading data...</Loader>
            ) : (
              <motion.div initial="hidden" animate="visible" variants={fadeIn} key={activeSection}>
                {activeSection === 'studentManagement' && (
                  <StudentList
                    students={students}
                    handleEditStudent={(s) => console.log("Edit student:", s)}
                  />
                )}
                {activeSection === 'questionForm' && (
                  <AdminQuestionForm
                    groups={Array.from(new Set(students.map(s => s.group)))}
                    students={students}
                  />
                )}
                {activeSection === 'fileUpload' && (
                  <FileUpload courses={courses} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </MainContent>
      </DashboardWrapper>
    </>
  );
};

export default AdminDashboard;

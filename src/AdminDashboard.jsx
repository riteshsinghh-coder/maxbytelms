import React, { useState, useEffect, useRef } from 'react';
import NavigationButtons from './NavigationButtons';
import StudentForm from './StudentForm';
import StudentList from './StudentList';
import AdminQuestionForm from './AdminQuestionForm';
import courses from './data/courses'; // Assuming courses data exists here
import users from './data/users'; // Assuming users data exists here
import scholarshipStudents from './data/scholarship'; // Import scholarship data
import { FaPlus, FaUserCircle } from 'react-icons/fa';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]); // Initialize students state
  const [activeSection, setActiveSection] = useState('studentManagement');
  const [formType, setFormType] = useState('admission');
  const [showModal, setShowModal] = useState(false);
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    uid: '',
    address: '',
    phone: '',
    course: '',
    interestedCourse: '',
    status: '',
    registrationFee50: false,
    registrationFee500: false,
  });
  const [studentBeingEdited, setStudentBeingEdited] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    uid: '',
  });

  const [loading, setLoading] = useState(true); // Loading state for students

  const groups = Array.from(
    new Set(
      students.flatMap((student) =>
        student.group?.split(',').map((g) => g.trim()) ?? []
      )
    )
  );

  const profileMenuRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    fetch('/data/students.json') // Make sure the path points to public/data/students.json
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load students:', err);
        setLoading(false);
      });

    // Fetch profile data from localStorage
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    if (storedUserData) {
      setProfileFormData({
        name: storedUserData.name,
        uid: storedUserData.uid,
      });
    }
  }, []);

  // Handle click outside profile menu to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = () => {
    if (!studentFormData.name || !studentFormData.phone || !studentFormData.course) {
      alert('Please fill all required fields');
      return;
    }

    const newStudent = {
      ...studentFormData,
      group: '',
      courses: [studentFormData.course],
      isEmployed: false,
      fees:
        formType === 'admission'
          ? studentFormData.registrationFee500 ? '500' : '0'
          : studentFormData.registrationFee50 ? '50' : '0',
    };

    // Append the new student to the existing list of students
    setStudents((prevStudents) => [...prevStudents, newStudent]);

    setStudentFormData({
      name: '',
      uid: '',
      address: '',
      phone: '',
      course: '',
      interestedCourse: '',
      status: '',
      registrationFee50: false,
      registrationFee500: false,
    });
    setShowModal(false);
  };

  const handleEditStudent = (student) => {
    setStudentBeingEdited(student);
    setShowModal(true); // Open the form modal for editing
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleProfileEdit = () => {
    setEditingProfile(true);
  };

  const handleProfileSave = () => {
    const updatedUser = { ...profileFormData };

    users.forEach((u) => {
      if (u.uid === updatedUser.uid) {
        u.name = updatedUser.name;
        u.uid = updatedUser.uid;
      }
    });

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setEditingProfile(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (!currentUser || currentUser.role !== 'admin') return <h2>Access Denied: Admins only</h2>;

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>Admin Dashboard</h3>
        <NavigationButtons setActiveSection={setActiveSection} />

        <button
          onClick={() => {
            setFormType('admission');
            setShowModal(true);
          }}
          style={{ ...styles.button, backgroundColor: '#2b6cb0' }}
        >
          <FaPlus size={14} style={{ marginRight: '8px' }} />
          Create Student
        </button>

        <button
          onClick={() => {
            setFormType('scholarship');
            setShowModal(true);
          }}
          style={{ ...styles.button, backgroundColor: '#38a169' }}
        >
          <FaPlus size={14} style={{ marginRight: '8px' }} />
          Scholarship Student
        </button>

        <div style={styles.profileSection}>
          <button onClick={handleProfileClick} style={styles.profileButton}>
            <FaUserCircle size={30} />
          </button>

          {showProfileMenu && currentUser && (
            <div ref={profileMenuRef} style={styles.profileMenu}>
              <div style={styles.profileHeader}>
                <img
                  src={currentUser.profileImage || 'https://www.w3schools.com/w3images/avatar2.png'}
                  alt="Profile"
                  style={styles.profileImage}
                />
                <div>
                  <h4>{currentUser.name}</h4>
                  <p>{currentUser.role}</p>
                </div>
              </div>
              <ul style={styles.profileDetails}>
                {editingProfile ? (
                  <>
                    <li>
                      <label>
                        Name:
                        <input
                          type="text"
                          name="name"
                          value={profileFormData.name}
                          onChange={handleProfileChange}
                          style={styles.input}
                        />
                      </label>
                    </li>
                    <li>
                      <label>
                        UID:
                        <input
                          type="text"
                          name="uid"
                          value={profileFormData.uid}
                          onChange={handleProfileChange}
                          style={styles.input}
                        />
                      </label>
                    </li>
                    <button onClick={handleProfileSave} style={styles.button}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <li>
                      <strong>UID:</strong> {currentUser.uid}
                    </li>
                    <li>
                      <strong>Name:</strong> {currentUser.name}
                    </li>
                    <button onClick={handleProfileEdit} style={styles.button}>
                      Edit
                    </button>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </aside>

      <main style={styles.main}>
        {showModal && (
          <StudentForm
            formType={formType}
            formData={studentBeingEdited || studentFormData}
            onChange={handleStudentFormChange}
            onSubmit={handleAddStudent}
            onCancel={() => setShowModal(false)}
            courses={courses}
          />
        )}

        <div style={styles.content}>
          {loading ? (
            <div style={styles.loader}>Loading students...</div>
          ) : (
            activeSection === 'studentManagement' && (
              <div style={styles.card}>
                <StudentList students={students} handleEditStudent={handleEditStudent} />
              </div>
            )
          )}

          {activeSection === 'demoStudents' && (
            <div style={styles.card}>
              <h3>Demo Students</h3>
              <StudentList students={scholarshipStudents} handleEditStudent={handleEditStudent} />
            </div>
          )}

          {activeSection === 'fileUpload' && (
            <div style={styles.card}>
              <FileUpload
                groups={groups}
                target={{ type: 'group', value: '' }}
                setTarget={() => {}}
              />
            </div>
          )}

          {activeSection === 'videoEmbed' && (
            <div style={styles.card}>
              <h3>Embed YouTube Video</h3>
              <input
                type="text"
                placeholder="Enter YouTube Video URL"
                style={styles.input}
              />
            </div>
          )}

          {activeSection === 'questionForm' && (
            <div style={styles.card}>
              <AdminQuestionForm groups={groups} students={students} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2b6cb0',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  sidebarTitle: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#2b6cb0',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 15px',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  profileSection: {
    marginTop: 'auto',
    position: 'relative',
  },
  profileButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  profileMenu: {
    position: 'absolute',
    top: '40px',
    right: '0',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    minWidth: '200px',
    zIndex: 1,
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  profileImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  profileDetails: {
    listStyle: 'none',
    padding: '0',
  },
  main: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f9f9f9',
    overflowY: 'auto',
  },
  loader: {
    fontSize: '20px',
    textAlign: 'center',
    marginTop: '50px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  input: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: '100%',
    marginBottom: '10px',
  },
};

export default AdminDashboard;

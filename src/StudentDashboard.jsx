import React, { useEffect, useState } from 'react';
import {
  FaUser, FaVideo, FaBook, FaFileAlt, FaBriefcase, FaSignOutAlt,
  FaChevronDown, FaChevronRight, FaCamera, FaSpinner, FaCheckCircle, FaTimesCircle, FaDownload,
  FaBars, FaTimes // Added for mobile menu toggle
} from 'react-icons/fa';

// Assume this is your base URL for profile pictures
const BASE_PROFILE_PIC_URL = 'http://localhost:10000';
const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGniyPup7n3754KnltNPqaca7DyzaY_IAw0g&s';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [videosBySubject, setVideosBySubject] = useState({});
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null); // Changed to key for subject-videoIndex
  const [activeTab, setActiveTab] = useState('profile');
  const [profilePhoto, setProfilePhoto] = useState("https://via.placeholder.com/150/AEC6CF/FFFFFF?text=Student"); // Default placeholder
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar

  // Mock data for other sections - added subjects for assignments and notes
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Calculus I - Problem Set 1', subject: 'Mathematics', dueDate: '2023-06-15', status: 'Pending', file: 'math_assignment_1.pdf' },
    { id: 2, title: 'Physics Lab Report - Optics', subject: 'Physics', dueDate: '2023-06-20', status: 'Submitted', file: 'physics_lab_report.docx' },
    { id: 3, title: 'History Essay - World War II', subject: 'History', dueDate: '2023-06-25', status: 'Pending', file: 'history_essay_draft.pdf' },
    { id: 4, title: 'Chemistry Review Questions', subject: 'Chemistry', dueDate: '2023-06-10', status: 'Overdue', file: 'chem_review.pdf' },
  ]);

  const [notes, setNotes] = useState([
    { id: 1, title: 'Algebraic Equations Cheat Sheet', subject: 'Mathematics', date: '2023-05-10', file: 'algebra_notes.pdf' },
    { id: 2, title: 'Basic Principles of Biology', subject: 'Biology', date: '2023-05-15', file: 'biology_intro.pdf' },
    { id: 3, title: 'Introduction to Python Programming', subject: 'Computer Science', date: '2023-05-20', file: 'python_basics.pdf' },
    { id: 4, title: 'Grammar Rules for Academic Writing', subject: 'English', date: '2023-05-22', file: 'grammar_guide.pdf' },
  ]);

  const [jobVacancies, setJobVacancies] = useState([
    { id: 1, title: 'Junior Software Engineer', company: 'Innovate Solutions', location: 'Remote', deadline: '2023-07-01', description: 'Seeking enthusiastic junior developers for our growing team.' },
    { id: 2, title: 'Data Analysis Intern', company: 'Quantify Analytics', location: 'New York, USA', deadline: '2023-06-25', description: 'Opportunity to work on real-world data science projects.' },
    { id: 3, title: 'Marketing Assistant', company: 'BrandBoost Agency', location: 'On-campus', deadline: '2023-07-10', description: 'Support marketing campaigns and social media management.' },
  ]);

  useEffect(() => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData) {
      setUser(userData);

      if (userData.profilePicture) {
        setProfilePhoto(`${BASE_PROFILE_PIC_URL}${userData.profilePicture.replace(/\\/g, '/')}`);
      }

      const userSubjectsArray = Array.isArray(userData.subjects) ? userData.subjects : [userData.subjects];

      // Fetch courses
      fetch('http://localhost:10000/api/courses')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          // Assuming data is an array of courses directly now
          const allCourses = data || [];

          const matchedC = allCourses.filter(course =>
            // Check if ANY of the user's subjects match the course's subject
            userSubjectsArray.some(userSubject => course.subjects === userSubject)
          );
          setMatchedCourses(matchedC);

          if (matchedC.length > 0) {
            localStorage.setItem('matchedCourse', JSON.stringify(matchedC[0]));
          }
        })
        .catch(err => {
          console.error('Error fetching courses:', err);
          setError('Failed to load courses. Please try again later.');
        });

      // Fetch videos
      fetch('http://localhost:10000/api/videos')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          const groupedVideos = {};

          userSubjectsArray.forEach(subject => {
            const videosForSubject = data.filter(video =>
              Array.isArray(video.targetValue) && video.targetValue.includes(subject)
            );

            // Sort videos by uploadDate (latest first)
            videosForSubject.sort((a, b) => {
              const dateA = new Date(a.uploadDate);
              const dateB = new Date(b.uploadDate);
              return dateB.getTime() - dateA.getTime(); // Descending order (latest first)
            });

            groupedVideos[subject] = videosForSubject;
          });
          setVideosBySubject(groupedVideos);

          // Store the first video of the first matched subject (if any)
          const firstSubject = userSubjectsArray[0];
          if (firstSubject && groupedVideos[firstSubject]?.length > 0) {
            localStorage.setItem('matchedVideo', JSON.stringify(groupedVideos[firstSubject][0]));
          }
        })
        .catch(err => {
          console.error('Error fetching videos:', err);
          setError('Failed to load videos. Please try again later.');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError('User data not found. Please log in.');
    }
  }, []);

  const toggleCourseTopics = (index) => {
    setSelectedCourseIndex(prev => (prev === index ? null : index));
  };

  const toggleVideoDetails = (subject, videoIndex) => {
    const key = `${subject}-${videoIndex}`; // Create a unique key for each video
    setSelectedVideoKey(prev => (prev === key ? null : key));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        alert('Profile picture updated locally. In a real app, this would upload to server.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    console.log("Attempting to change password:", passwordData);
    alert("Password changed successfully! (Frontend simulation)");
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('matchedCourse');
    localStorage.removeItem('matchedVideo');
    window.location.href = '/login';
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <FaSpinner className="spinner-icon" />
          <p>Loading dashboard data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <FaTimesCircle className="error-icon" />
          <p>{error}</p>
          <p>Please refresh the page or contact support.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-section fade-in">
            <h2 className="section-title">My Profile</h2>
            <div className="profile-grid">
              <div className="profile-card profile-summary slide-in-right">
                <div className="profile-pic-container">
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="profile-pic"
                  />
                  <label className="profile-pic-upload-button">
                    <input type="file" className="hidden-input" onChange={handleFileChange} accept="image/*" />
                    <FaCamera className="camera-icon" />
                  </label>
                </div>
                <h3 className="profile-name">{user?.name || 'Student Name'}</h3>
                <p className="profile-email">{user?.email || 'student@example.com'}</p>
                <p className="profile-uid">UID: <span>{user?.uid || 'N/A'}</span></p>
                <span className="profile-role">
                  {user?.role || 'Student'}
                </span>
              </div>
              <div className="profile-details-container">
                <div className="profile-card personal-info slide-in-right delay-100">
                  <h3 className="card-heading">Personal Information</h3>
                  <div className="info-grid">
                    <div>
                      <label className="info-label">Full Name</label>
                      <p className="info-value">{user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="info-label">Email</label>
                      <p className="info-value">{user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="info-label">Subjects</label>
                      <p className="info-value">{Array.isArray(user?.subjects) ? user.subjects.join(', ') : user?.subjects || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="info-label">Phone Number</label>
                      <p className="info-value">{user?.phoneNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="info-label">UID</label>
                      <p className="info-value">{user?.uid || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="info-label">Group</label>
                      <p className="info-value">{user?.group || 'N/A'}</p>
                    </div>
                    <div className="full-width">
                      <label className="info-label">Registration Fee Paid</label>
                      <p className={`info-value ${user?.registrationFeePaid ? 'text-success' : 'text-danger'}`}>
                        {user?.registrationFeePaid ? <FaCheckCircle className="inline-icon" /> : <FaTimesCircle className="inline-icon" />}
                        {user?.registrationFeePaid ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="profile-card password-settings slide-in-right delay-200">
                  <div className="card-header-with-button">
                    <h3 className="card-heading">Password Settings</h3>
                    <button
                      onClick={() => setShowChangePassword(!showChangePassword)}
                      className="primary-button small"
                    >
                      {showChangePassword ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>
                  {showChangePassword && (
                    <form onSubmit={handlePasswordSubmit} className="password-form fade-in-fast">
                      <div>
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          type="submit"
                          className="success-button"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'recorded-lectures':
        return (
          <div className="lectures-section fade-in">
            <h2 className="section-title">Recorded Lectures</h2>

            <h3 className="subsection-title">Your Matched Course{matchedCourses.length !== 1 ? 's' : ''}</h3>
            {matchedCourses.length === 0 ? (
              <div className="empty-state-card">
                <p>No courses found matching your subjects.</p>
              </div>
            ) : (
              <div className="card-list">
                {matchedCourses.map((course, index) => (
                  <div
                    key={`course-${index}`}
                    className="lecture-card interactive"
                  >
                    <div
                      className="lecture-card-header"
                      onClick={() => toggleCourseTopics(index)}
                    >
                      <div>
                        <h4 className="card-title">{course.subjects}</h4>
                        <div className="lecture-meta">
                          <p><span>Duration:</span> {course.duration || 'N/A'}</p>
                          <p><span>Course Fees:</span> ₹{course.courseFees || 'N/A'}</p>
                          <p><span>Instructor:</span> {course.instructor || 'N/A'}</p>
                        </div>
                      </div>
                      <span className="toggle-icon">
                        {selectedCourseIndex === index ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    </div>
                    {selectedCourseIndex === index && course.topics && (
                      <div className="lecture-details expand-height">
                        <h5 className="details-heading">Full Syllabus:</h5>
                        <ul className="syllabus-list">
                          {course.topics.map((topic, i) => (
                            <li key={i} className="syllabus-item">
                              <FaCheckCircle className="bullet-icon" /> {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <h3 className="subsection-title mt-lg">Your Matched Videos (Latest First)</h3>
            {Object.keys(videosBySubject).length === 0 || Object.values(videosBySubject).every(arr => arr.length === 0) ? (
              <div className="empty-state-card">
                <p>No videos found matching your subjects.</p>
              </div>
            ) : (
              <div className="subject-video-group-list">
                {Object.entries(videosBySubject).map(([subject, videos]) => (
                  <div
                    key={`subject-${subject}`}
                    className="subject-video-group-card"
                  >
                    <div className="subject-group-header">
                      <h4 className="subject-group-title">Subject: {subject}</h4>
                    </div>
                    <div className="subject-group-content">
                      {videos.length === 0 ? (
                        <p className="empty-subject-videos">No videos available for this subject yet.</p>
                      ) : (
                        <div className="card-list">
                          {videos.map((video, index) => (
                            <div
                              key={`video-${subject}-${index}`} // Unique key for video
                              className="video-card interactive"
                            >
                              <div
                                className="video-card-header"
                                onClick={() => toggleVideoDetails(subject, index)}
                              >
                                <div>
                                  <p className="card-title">{video.videoName}</p>
                                  <p className="video-duration">Duration: {video.duration || 'N/A'}</p>
                                  <p className="video-upload-date">Uploaded: {new Date(video.uploadDate).toLocaleDateString() || 'N/A'}</p>
                                </div>
                                <span className="toggle-icon">
                                  {selectedVideoKey === `${subject}-${index}` ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                              </div>
                              {selectedVideoKey === `${subject}-${index}` && (
                                <div className="video-details expand-height">
                                  {video.videoURL && (
                                    <div className="video-embed-container">
                                      <h5 className="details-heading">Video Lecture:</h5>
                                      {/* Using dangerouslySetInnerHTML for embedded videos like YouTube iframes */}
                                      <div className="video-iframe-wrapper" dangerouslySetInnerHTML={{ __html: video.videoURL }} />
                                    </div>
                                  )}
                                  {video.topics && video.topics.length > 0 && (
                                    <div>
                                      <h5 className="details-heading">Topics Covered:</h5>
                                      <ul className="syllabus-list compact">
                                        {video.topics.map((topic, i) => (
                                          <li key={i} className="syllabus-item blue">
                                            <FaCheckCircle className="bullet-icon" /> {topic}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'assignments':
        return (
          <div className="assignments-section fade-in">
            <h2 className="section-title">Assignments</h2>
            <div className="table-container">
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Subject</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="empty-table-row">No assignments available at the moment.</td>
                        </tr>
                    ) : (
                        assignments.map((assignment) => (
                        <tr key={assignment.id}>
                            <td className="main-info">{assignment.title}</td>
                            <td>{assignment.subject || 'General'}</td>
                            <td>{assignment.dueDate}</td>
                            <td>
                            <span className={`status-badge ${assignment.status.toLowerCase()}`}>
                                {assignment.status}
                            </span>
                            </td>
                            <td className="action-buttons">
                            <button className="text-button blue-text">
                                <FaDownload className="icon-mr" /> View
                            </button>
                            {assignment.status === 'Pending' && (
                                <button className="text-button green-text">
                                    <FaFileAlt className="icon-mr" /> Submit
                                </button>
                            )}
                            </td>
                        </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="notes-section fade-in">
            <h2 className="section-title">Study Notes</h2>
            <div className="grid-cards">
              {notes.length === 0 ? (
                <div className="empty-state-card full-width-card">
                    <p>No study notes available at the moment.</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="note-card interactive">
                    <div className="note-header">
                      <div className="icon-wrapper">
                        <FaBook className="note-icon" />
                      </div>
                      <div>
                        <h3 className="card-title">{note.title}</h3>
                        <p className="note-subject">{note.subject}</p>
                      </div>
                    </div>
                    <div className="note-footer">
                      <span className="note-date">Posted: {note.date}</span>
                      <button className="primary-button small">
                        <FaDownload className="icon-mr" /> Download
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'job-vacancies':
        return (
          <div className="jobs-section fade-in">
            <h2 className="section-title">Job Vacancies</h2>
            <div className="card-list">
              {jobVacancies.length === 0 ? (
                <div className="empty-state-card full-width-card">
                    <p>No job vacancies available at the moment.</p>
                </div>
              ) : (
                jobVacancies.map((job) => (
                  <div key={job.id} className="job-card interactive">
                    <div className="job-header">
                      <div>
                        <h3 className="card-title">{job.title}</h3>
                        <p className="job-company">{job.company}</p>
                      </div>
                      <span className="job-location-badge">{job.location}</span>
                    </div>
                    <p className="job-description">{job.description}</p>
                    <div className="job-footer">
                      <p className="job-deadline">Deadline: <span>{job.deadline}</span></p>
                      <div className="job-actions">
                        <button className="text-button">
                            View Details
                        </button>
                        <button className="success-button small">
                            Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="welcome-state">
            <p>Welcome! Select a section from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Internal CSS for the whole component */}
      <style jsx>{`
        :root {
            --primary-color: #6200EE; /* Deep Purple */
            --primary-dark: #3700B3;
            --primary-light: #BB86FC;
            --secondary-color: #03DAC6; /* Teal Accent */
            --accent-color: #FFD740; /* Amber for highlights */
            --bg-light: #F0F2F5; /* Very light grey */
            --bg-medium: #E0E4EB; /* Light grey */
            --text-dark: #212121; /* Dark grey almost black */
            --text-medium: #616161; /* Medium grey */
            --text-light: #9E9E9E; /* Light grey */
            --border-color: #E0E0E0; /* Subtle border */
            --card-bg: #FFFFFF;
            --shadow-light: rgba(0, 0, 0, 0.08);
            --shadow-medium: rgba(0, 0, 0, 0.15);
            --success-color: #4CAF50; /* Green */
            --danger-color: #F44336; /* Red */
            --warning-color: #FFC107; /* Orange */
            --info-color: #2196F3; /* Blue */
            --gradient-start: #6200EE;
            --gradient-end: #8C00FF;
        }

        /* General Body Styling */
        body {
          margin: 0;
          font-family: 'Inter', sans-serif; /* A modern sans-serif font */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: var(--bg-light);
          color: var(--text-dark);
          line-height: 1.6;
        }

        /* Dashboard Container */
        .dashboard-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--bg-light);
        }

        /* Sidebar Navigation (Desktop) */
        .sidebar {
          width: 280px; /* Slightly wider */
          background: linear-gradient(180deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
          color: white;
          box-shadow: 4px 0 15px var(--shadow-medium);
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          transition: transform 0.3s ease-in-out;
        }
        @media (max-width: 992px) {
          .sidebar {
            transform: translateX(-100%);
            width: 250px;
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }


        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 70px; /* Taller header */
          background-color: var(--primary-dark);
          box-shadow: 0 2px 8px var(--shadow-medium);
          padding: 0 20px;
        }

        .sidebar-header h1 {
          font-size: 1.6rem; /* Slightly smaller for better fit with logo */
          font-weight: 800;
          letter-spacing: 0.05em;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sidebar-header img {
          height: 35px; /* Adjust logo size */
          width: 35px;
          border-radius: 5px; /* Slight roundness for logo */
        }

        .sidebar-nav {
          flex-grow: 1;
          padding: 24px;
          overflow-y: auto;
        }

        .sidebar-nav-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-button {
          display: flex;
          align-items: center;
          padding: 14px 18px;
          border-radius: 8px; /* Slightly less rounded */
          color: var(--primary-light);
          text-align: left;
          font-weight: 500;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          background: transparent;
          border: none;
          width: 100%;
          text-decoration: none; /* For potential future Link components */
        }

        .sidebar-button svg {
          margin-right: 14px; /* More space */
          font-size: 1.35rem; /* Slightly larger icon */
          transition: all 0.3s ease-in-out;
        }

        .sidebar-button:hover {
          background-color: rgba(255, 255, 255, 0.15); /* More visible hover */
          color: white;
          transform: translateX(8px); /* More pronounced slide */
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Stronger shadow on hover */
        }

        .sidebar-button.active {
          background-color: var(--card-bg);
          color: var(--primary-dark); /* Darker text for active */
          box-shadow: 0 4px 12px var(--shadow-medium);
          transform: translateX(0);
          font-weight: 600;
        }

        .sidebar-button.active svg {
          color: var(--primary-color);
        }
        
        .sidebar-button.logout-button {
          color: #FFEBEE; /* Light red */
          margin-top: auto; /* Push to bottom */
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 20px;
          margin-top: 30px; /* More space */
        }

        .sidebar-button.logout-button:hover {
          background-color: var(--danger-color); /* Darker red */
          color: white;
          transform: none; /* No translateX for logout */
        }


        /* Main Content Area */
        .main-content {
          flex-grow: 1;
          margin-left: 280px; /* Offset for wider sidebar */
          padding: 32px 40px; /* More padding */
          background-color: var(--bg-light);
          overflow-y: auto;
          transition: margin-left 0.3s ease-in-out;
          padding-bottom: 80px; /* Space for mobile nav */
        }
        @media (max-width: 992px) {
          .main-content {
            margin-left: 0; /* No offset on mobile */
            padding: 20px 20px 80px; /* Adjust padding for mobile header */
          }
        }


        /* Mobile Header & Overlay */
        .main-header-mobile {
            display: none; /* Hidden by default, shown on mobile */
            background-color: var(--card-bg);
            box-shadow: 0 2px 5px var(--shadow-light);
            padding: 16px 24px;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 999;
        }
        @media (max-width: 992px) {
          .main-header-mobile {
            display: flex;
          }
        }

        .main-header-mobile h2 {
            font-size: 1.4rem;
            color: var(--text-dark);
            font-weight: 600;
            margin: 0;
        }
        .main-header-mobile .logout-btn-mobile {
            color: var(--danger-color);
            font-weight: 600;
            display: flex;
            align-items: center;
            font-size: 0.95rem;
            background: none;
            border: none;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .main-header-mobile .logout-btn-mobile:hover {
            color: var(--danger-color);
            opacity: 0.8;
        }
        .main-header-mobile .logout-btn-mobile svg {
            margin-right: 6px;
        }
        .menu-toggle-button {
          background: none;
          border: none;
          font-size: 1.8rem;
          color: var(--primary-color);
          cursor: pointer;
          display: none; /* Hidden by default */
        }
        @media (max-width: 992px) {
          .menu-toggle-button {
            display: block; /* Show on mobile */
          }
          .main-header-mobile .logout-btn-mobile {
            display: none; /* Hide full logout button on mobile header */
          }
          .main-header-mobile .menu-toggle-button + h2 {
            margin-left: 15px; /* Adjust spacing next to toggle */
          }
        }
        .sidebar-overlay {
          display: none; /* Hidden by default */
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 990; /* Below sidebar, above content */
          transition: opacity 0.3s ease-in-out;
          opacity: 0;
        }
        .sidebar-overlay.open {
          display: block;
          opacity: 1;
        }


        /* Global Section Styles */
        .section-title {
          font-size: 2.5rem;
          font-weight: 700; /* Slightly less bold */
          color: var(--text-dark);
          margin-bottom: 32px;
          border-bottom: 3px solid var(--primary-light); /* Accent color border */
          padding-bottom: 12px;
          animation: slideInBottom 0.6s ease-out forwards;
          color: var(--primary-dark);
        }
        .subsection-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: var(--primary-color);
            margin-top: 40px;
            margin-bottom: 24px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px;
        }
        .mt-lg {
          margin-top: 40px !important;
        }

        /* Card Styles */
        .card-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Flexible grid */
          gap: 25px; /* More space */
          padding-top: 10px;
        }
        .grid-cards { /* For notes specifically */
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          padding-top: 10px;
        }

        .profile-card, .lecture-card, .video-card, .note-card, .job-card, .empty-state-card {
          background-color: var(--card-bg);
          border-radius: 12px; /* More rounded corners */
          box-shadow: 0 4px 15px var(--shadow-light); /* Softer shadow */
          padding: 25px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease-in-out;
          border: 1px solid var(--border-color); /* Subtle border */
        }
        .interactive:hover {
          transform: translateY(-5px); /* Lift effect */
          box-shadow: 0 8px 25px var(--shadow-medium); /* Stronger shadow on hover */
        }
        .empty-state-card {
            padding: 30px;
            text-align: center;
            color: var(--text-medium);
            font-style: italic;
            font-size: 1.1rem;
            background-color: var(--bg-medium);
            border: 2px dashed var(--border-color);
        }
        .empty-state-card.full-width-card {
            grid-column: 1 / -1; /* Make it span full width in grid */
        }

        /* Profile Section */
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 2fr; /* Summary on left, details on right */
          gap: 30px; /* More space */
          align-items: flex-start; /* Align top */
        }
        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr; /* Stack on mobile */
          }
        }

        .profile-summary {
          align-items: center;
          text-align: center;
          padding: 30px;
          background: linear-gradient(45deg, var(--primary-color), var(--primary-light));
          color: white;
          position: sticky; /* Keep it in view if scrolling */
          top: 100px; /* Adjust based on mobile header height */
        }
        @media (max-width: 992px) {
          .profile-summary {
            position: static; /* No sticky on mobile */
          }
        }

        .profile-pic-container {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 20px;
          border-radius: 50%;
          border: 4px solid var(--secondary-color); /* Accent border */
          overflow: hidden;
          box-shadow: 0 0 0 5px rgba(255,255,255,0.2); /* White halo */
        }
        .profile-pic {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .profile-pic-upload-button {
          position: absolute;
          bottom: 0;
          right: 0;
          background-color: var(--secondary-color);
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 5px var(--shadow-medium);
          transition: background-color 0.2s ease;
        }
        .profile-pic-upload-button:hover {
          background-color: var(--primary-dark);
        }
        .profile-pic-upload-button .hidden-input {
          display: none;
        }
        .camera-icon {
          font-size: 1.2rem;
        }

        .profile-name {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 5px;
          color: white;
        }
        .profile-email {
          font-size: 1rem;
          color: rgba(255,255,255,0.8);
          margin-bottom: 10px;
        }
        .profile-uid {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 15px;
        }
        .profile-uid span {
            font-weight: 600;
            color: white;
        }
        .profile-role {
            background-color: rgba(0,0,0,0.2);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            color: white;
        }

        .profile-details-container {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .card-heading {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px 25px;
        }
        .info-label {
          font-size: 0.9rem;
          color: var(--text-medium);
          margin-bottom: 4px;
          display: block;
          font-weight: 500;
        }
        .info-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
          margin: 0;
        }
        .full-width {
            grid-column: 1 / -1;
        }
        .text-success { color: var(--success-color); }
        .text-danger { color: var(--danger-color); }
        .inline-icon {
            margin-right: 5px;
            font-size: 1.1rem;
            vertical-align: middle;
        }

        .card-header-with-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }
        .card-header-with-button .card-heading {
            margin-bottom: 0;
            border-bottom: none;
        }

        .password-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 15px;
        }
        .password-form label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-dark);
        }
        .password-form input {
          width: calc(100% - 20px);
          padding: 12px 10px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .password-form input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.2);
        }
        .form-actions {
          margin-top: 20px;
          text-align: right;
        }


        /* Recorded Lectures */
        .lecture-card-header, .video-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding-bottom: 15px;
          margin-bottom: 15px;
          border-bottom: 1px solid var(--bg-medium);
        }
        .lecture-card-header:hover .card-title,
        .video-card-header:hover .card-title {
          color: var(--primary-color);
        }
        .lecture-card .card-title, .video-card .card-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 5px;
            transition: color 0.2s ease;
        }
        .lecture-meta, .video-meta {
            font-size: 0.9rem;
            color: var(--text-medium);
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        .lecture-meta span, .video-meta span {
            font-weight: 600;
            color: var(--text-dark);
        }
        .video-duration, .video-upload-date {
            font-size: 0.9rem;
            color: var(--text-medium);
            margin: 0;
        }

        .toggle-icon {
          color: var(--primary-color);
          font-size: 1.1rem;
        }

        .lecture-details, .video-details {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.7s ease-out, opacity 0.4s ease-out; /* Slower transition */
          opacity: 0;
          padding-top: 10px;
        }
        .lecture-details.expand-height, .video-details.expand-height {
          max-height: 500px; /* Adjust as needed */
          opacity: 1;
        }

        .details-heading {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 10px;
        }

        .syllabus-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .syllabus-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
          font-size: 0.95rem;
          color: var(--text-dark);
        }
        .syllabus-item .bullet-icon {
          color: var(--primary-color);
          margin-right: 8px;
          font-size: 0.9rem;
          position: relative;
          top: 3px;
        }
        .syllabus-list.compact .syllabus-item {
            margin-bottom: 5px;
            font-size: 0.9rem;
        }
        .syllabus-list.compact .syllabus-item.blue .bullet-icon {
            color: var(--info-color);
        }

        /* Video specific */
        .subject-video-group-list {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }
        .subject-video-group-card {
            background-color: var(--card-bg);
            border-radius: 12px;
            box-shadow: 0 4px 15px var(--shadow-light);
            border: 1px solid var(--border-color);
            overflow: hidden;
        }
        .subject-group-header {
            background-color: var(--bg-medium);
            padding: 15px 25px;
            border-bottom: 1px solid var(--border-color);
        }
        .subject-group-title {
            font-size: 1.5rem;
            color: var(--primary-color);
            font-weight: 700;
            margin: 0;
        }
        .subject-group-content {
            padding: 20px 25px;
        }
        .empty-subject-videos {
            text-align: center;
            color: var(--text-medium);
            font-style: italic;
            padding: 20px;
        }
        .video-card {
          padding: 20px;
          margin-bottom: 15px; /* Space between video cards within a subject */
          box-shadow: none; /* No shadow for nested cards */
          border: 1px solid var(--border-color); /* Inner border */
          border-radius: 8px;
        }
        .video-card:last-child {
            margin-bottom: 0;
        }
        .video-embed-container {
            margin-top: 15px;
            margin-bottom: 20px;
            text-align: center;
        }
        .video-iframe-wrapper {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            overflow: hidden;
            border-radius: 8px;
            margin-top: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .video-iframe-wrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }


        /* Assignments Table */
        .table-container {
          overflow-x: auto; /* For responsive tables */
          border-radius: 12px;
          box-shadow: 0 4px 15px var(--shadow-light);
          border: 1px solid var(--border-color);
        }
        .table-wrapper {
            background-color: var(--card-bg);
            border-radius: 12px;
            overflow: hidden; /* Ensures borders/shadows are contained */
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px; /* Ensure table doesn't get too squished */
        }
        .data-table th, .data-table td {
          padding: 15px 20px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        .data-table th {
          background-color: var(--primary-color);
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
        }
        .data-table tbody tr:last-child td {
            border-bottom: none;
        }
        .data-table tbody tr:nth-child(even) {
          background-color: var(--bg-medium);
        }
        .data-table tbody tr:hover {
          background-color: var(--primary-light);
          color: white;
        }
        .data-table tbody tr:hover .main-info,
        .data-table tbody tr:hover .status-badge {
            color: white;
        }
        .data-table tbody tr:hover .text-button.blue-text,
        .data-table tbody tr:hover .text-button.green-text {
            color: var(--accent-color); /* Change color on hover */
        }
        .main-info {
            font-weight: 600;
            color: var(--text-dark);
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }
        .status-badge.pending {
          background-color: var(--warning-color);
          color: var(--text-dark);
        }
        .status-badge.submitted {
          background-color: var(--success-color);
          color: white;
        }
        .status-badge.overdue {
          background-color: var(--danger-color);
          color: white;
        }
        .action-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        /* Notes Grid */
        .note-card {
          padding: 25px;
        }
        .note-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }
        .note-header .icon-wrapper {
            background-color: var(--secondary-color);
            color: white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
        }
        .note-card .card-title {
            font-size: 1.3rem;
            margin-bottom: 5px;
        }
        .note-subject {
            font-size: 0.9rem;
            color: var(--primary-color);
            font-weight: 600;
        }
        .note-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid var(--border-color);
        }
        .note-date {
            font-size: 0.9rem;
            color: var(--text-medium);
        }

        /* Job Vacancies */
        .job-card {
          padding: 25px;
        }
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        .job-card .card-title {
            font-size: 1.4rem;
            margin-bottom: 5px;
        }
        .job-company {
            font-size: 1rem;
            color: var(--text-medium);
        }
        .job-location-badge {
            background-color: var(--info-color);
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            align-self: flex-start;
            margin-left: 10px;
        }
        .job-description {
            font-size: 0.95rem;
            color: var(--text-dark);
            margin-bottom: 20px;
        }
        .job-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto; /* Push to bottom */
            padding-top: 15px;
            border-top: 1px solid var(--border-color);
        }
        .job-deadline {
            font-size: 0.9rem;
            color: var(--text-medium);
        }
        .job-deadline span {
            font-weight: 600;
            color: var(--danger-color);
        }
        .job-actions {
            display: flex;
            gap: 10px;
        }

        /* Buttons */
        .primary-button, .success-button, .text-button {
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }
        .primary-button {
            background-color: var(--primary-color);
            color: white;
            border: none;
        }
        .primary-button:hover {
            background-color: var(--primary-dark);
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .success-button {
            background-color: var(--success-color);
            color: white;
            border: none;
        }
        .success-button:hover {
            background-color: #388E3C; /* Darker green */
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .text-button {
            background: none;
            border: none;
            color: var(--primary-color);
            padding: 8px 12px;
            font-size: 0.95rem;
            transition: color 0.2s ease, background-color 0.2s ease;
        }
        .text-button.blue-text { color: var(--info-color); }
        .text-button.green-text { color: var(--success-color); }

        .text-button:hover {
            background-color: var(--bg-medium);
            border-radius: 6px;
        }
        .primary-button.small, .success-button.small {
            padding: 8px 15px;
            font-size: 0.9rem;
        }
        .icon-mr { margin-right: 8px; }


        /* States (Loading, Error, Welcome) */
        .loading-state, .error-state, .welcome-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
          color: var(--text-medium);
          font-size: 1.2rem;
          background-color: var(--card-bg);
          border-radius: 12px;
          box-shadow: 0 4px 15px var(--shadow-light);
          padding: 40px;
        }
        .spinner-icon {
          font-size: 3rem;
          color: var(--primary-color);
          animation: spin 1.5s linear infinite;
          margin-bottom: 20px;
        }
        .error-icon {
          font-size: 3rem;
          color: var(--danger-color);
          margin-bottom: 20px;
        }
        .loading-state p, .error-state p {
          margin: 0;
          font-weight: 500;
        }
        .error-state p:last-child {
            font-size: 0.9rem;
            color: var(--text-light);
            margin-top: 5px;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInBottom {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .fade-in { animation: fade-in 0.6s ease-out forwards; }
        .fade-in-fast { animation: fade-in 0.3s ease-out forwards; }
        .slide-in-right { animation: slideInRight 0.6s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        /* To ensure animations only run once on load */
        .fade-in, .slide-in-right {
          animation-fill-mode: backwards;
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
            .main-content {
                padding: 25px 30px;
            }
            .profile-grid {
                grid-template-columns: 1fr 1.5fr;
            }
            .card-list, .grid-cards {
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }
        }

        @media (max-width: 992px) {
            .dashboard-container {
                flex-direction: column;
            }
            .sidebar {
                position: fixed;
                left: 0;
                top: 0;
                bottom: 0;
                height: 100vh;
                transform: translateX(-100%);
                box-shadow: 5px 0 15px rgba(0,0,0,0.3);
                z-index: 1001; /* Higher than overlay */
            }
            .sidebar.open {
                transform: translateX(0);
            }
            .main-content {
                margin-left: 0;
                padding-top: 20px; /* Space from mobile header */
            }
            .section-title {
                font-size: 2rem;
                margin-bottom: 25px;
            }
            .subsection-title {
                font-size: 1.5rem;
                margin-top: 30px;
                margin-bottom: 20px;
            }
            .profile-summary {
              top: 80px; /* Adjust sticky for mobile header */
              padding: 25px;
            }
            .password-form input {
              width: calc(100% - 16px); /* Account for padding */
              padding: 10px 8px;
            }
        }

        @media (max-width: 768px) {
            .profile-grid {
                grid-template-columns: 1fr;
            }
            .info-grid {
                grid-template-columns: 1fr; /* Stack info items */
            }
            .profile-summary {
                top: auto; /* No sticky on small mobile */
                position: static;
            }
            .main-content {
                padding: 15px;
            }
            .data-table th, .data-table td {
                padding: 12px 15px;
            }
            .action-buttons {
                flex-direction: column; /* Stack buttons on small screens */
                gap: 5px;
            }
            .primary-button, .success-button, .text-button {
                width: 100%; /* Full width buttons */
            }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 100%; /* Sidebar takes full width on very small screens */
          }
          .sidebar-nav {
            padding: 15px;
          }
          .sidebar-button {
            padding: 12px 15px;
            font-size: 1rem;
          }
          .main-header-mobile h2 {
            font-size: 1.2rem;
          }
          .section-title {
            font-size: 1.8rem;
            margin-bottom: 20px;
          }
          .subsection-title {
            font-size: 1.3rem;
          }
          .profile-card, .lecture-card, .video-card, .note-card, .job-card, .empty-state-card {
            padding: 20px;
          }
          .video-card .card-title {
            font-size: 1.2rem;
          }
        }
      `}</style>

      {/* Mobile Header (visible on smaller screens) */}
      <div className="main-header-mobile">
        <button className="menu-toggle-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h2>Student Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn-mobile">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={LOGO_URL} alt="Web Dev 0-100 Logo" />
          <h1>Web Dev 0-100</h1>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            <li>
              <button
                className={`sidebar-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
              >
                <FaUser /> My Profile
              </button>
            </li>
            <li>
              <button
                className={`sidebar-button ${activeTab === 'recorded-lectures' ? 'active' : ''}`}
                onClick={() => { setActiveTab('recorded-lectures'); setIsSidebarOpen(false); }}
              >
                <FaVideo /> Recorded Lectures
              </button>
            </li>
            <li>
              <button
                className={`sidebar-button ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => { setActiveTab('assignments'); setIsSidebarOpen(false); }}
              >
                <FaFileAlt /> Assignments
              </button>
            </li>
            <li>
              <button
                className={`sidebar-button ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => { setActiveTab('notes'); setIsSidebarOpen(false); }}
              >
                <FaBook /> Study Notes
              </button>
            </li>
            <li>
              <button
                className={`sidebar-button ${activeTab === 'job-vacancies' ? 'active' : ''}`}
                onClick={() => { setActiveTab('job-vacancies'); setIsSidebarOpen(false); }}
              >
                <FaBriefcase /> Job Vacancies
              </button>
            </li>
            <li className="sidebar-button logout-button">
              <button onClick={handleLogout} className="sidebar-button logout-button">
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;
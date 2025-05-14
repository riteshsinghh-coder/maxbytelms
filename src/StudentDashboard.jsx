import React, { useState, useEffect } from "react";
import courses from "./data/courses";
import uploads from "./data/uploads";

import {
  FaVideo,
  FaClipboardList,
  FaBriefcase,
  FaFileAlt,
  FaRegNewspaper,
  FaUserAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Use useNavigate for React Router v6

const StudentDashboard = () => {
  const uid = localStorage.getItem("uid");
  const [student, setStudent] = useState(null);
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("syllabus");
  const [modalVideo, setModalVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate(); // Initialize navigate for routing

 useEffect(() => {
  fetch("/data/students.json")
    .then((res) => res.json())
    .then((data) => {
      const studentData = data.find((s) => s.uid === uid);
      if (studentData) {
        setStudent(studentData);
        const courseData = courses.find(
          (c) =>
            c.subjects &&
            studentData.subjects &&
            c.subjects.trim().toLowerCase() === studentData.subjects.trim().toLowerCase()
        );
        setCourse(courseData);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching student data:", err);
      setLoading(false);
    });
}, [uid]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePhoto(file); // Store the file itself
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSaveChanges = () => {
  const uid = localStorage.getItem("uid"); // Get uid from localStorage

const formData = new FormData();
formData.append("profileImage", profilePhoto); // File object
formData.append("password", newPassword); 
formData.append("uid", uid); // Add uid

    fetch("http://localhost:5000/update-profile", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Profile updated successfully") {
          // Optional: only store preview if needed
          localStorage.setItem("profilePhoto", URL.createObjectURL(profilePhoto));
          localStorage.setItem("password", newPassword);
          navigate("/profile-saved");
        } else {
          alert("Profile update failed");
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Error updating profile");
      });
  };

  if (loading) {
    return <div className="text-center mt-10 text-blue-500">Loading...</div>;
  }

  if (!student) {
    return <div className="text-center mt-10 text-red-500">Student not found</div>;
  }

  if (!course) {
    return <div className="text-center mt-10 text-red-500">Course not found</div>;
  }

  const filteredUploads = uploads.filter(
    (u) => u.targetValue && u.targetValue.includes(course.subjects)
  );

  const handleVideoClick = (videoHTML) => {
    setModalVideo(videoHTML);
  };

  const closeModal = () => {
    setModalVideo(null);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="student-name">{student.name}</h2>
        <div className="student-info">
          <div>
            UID: <span className="student-info-value">{student.uid}</span>
          </div>
          <div>
            Group: <span className="student-info-value">{student.group}</span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          
        {student.profilePicture ? (
    <img
      src={`/${student.profilePicture}`}
      alt="Profile"
      className="profile-pic"
    />
  ) : (
    <FaUserAlt className="profile-icon" />
  )}
          <h4 className="profile-title">Profile</h4>
          <div className="profile-details">
            {/* <p>Email: {student.email}</p> */}
            <p>Phone: {student.phoneNo}</p>
            {/* <p>Enrolled: {student.enrollmentDate}</p> */}
            {/* <p>Phone no:{student.phoneNo}</p> */}

            {/* Profile Photo Upload */}
            <div>
              <label htmlFor="profilePhoto" className="upload-label">Upload Profile Photo</label>
              <input
                type="file"
                id="profilePhoto"
                onChange={handlePhotoChange}
                accept="image/*"
                className="upload-input"
              />
              {profilePhoto && (
                <img src={URL.createObjectURL(profilePhoto)} alt="Profile" className="profile-photo-preview" />
              )}
            </div>

            {/* Password Edit */}
            <div>
              <label htmlFor="newPassword" className="password-label">Edit Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                className="password-input"
                placeholder="Enter new password"
              />
            </div>

            <button onClick={handleSaveChanges} className="save-button">Save Changes</button>
          </div>
        </div>

        <div className="nav-tabs">
          {[{ id: "syllabus", label: "Syllabus", icon: <FaClipboardList /> },
            { id: "lectures", label: "Recorded Lectures", icon: <FaVideo /> },
            { id: "assignments", label: "Assignments", icon: <FaFileAlt /> },
            { id: "jobs", label: "Job Opportunities", icon: <FaBriefcase /> },
            { id: "records", label: "Records", icon: <FaRegNewspaper /> }].map(({ id, label, icon }) => (
            <div
              key={id}
              onClick={() => setActiveTab(id)}
              className={`tab ${activeTab === id ? "active-tab" : ""}`}
            >
              {icon} <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="content-area">
        <h3 className="course-title">📘 Course: {course.subjects}</h3>

        {activeTab === "syllabus" && (
          <>
            <h4 className="section-title">📚 Syllabus</h4>
            {course.topics?.length > 0 ? (
              <ul className="topics-list">
                {course.topics.map((topic, index) => (
                  <li key={index} className="topic-item">
                    {index + 1}. {topic}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-syllabus">
                No detailed syllabus available for this course.
              </p>
            )}
          </>
        )}

        {activeTab === "lectures" && (
          <>
            <h4 className="section-title">🎥 Recorded Lectures</h4>
            <div className="lectures-list">
              {filteredUploads
                .filter((u) => u.videoURL)
                .map((upload, index) => (
                  <div
                    key={index}
                    className="lecture-item"
                    onClick={() => handleVideoClick(upload.videoURL)}
                    style={{ cursor: "pointer" }}
                  >
                    <p className="lecture-title">{upload.videoName}</p>
                    <div
                      className="lecture-video"
                      dangerouslySetInnerHTML={{ __html: upload.videoURL }}
                    />
                    <p className="click-hint">Click to expand</p>
                  </div>
                ))}
            </div>
          </>
        )}

        {activeTab === "assignments" && (
          <>
            <h4 className="section-title">📝 Assignments</h4>
            <div className="assignments-list">
              {filteredUploads
                .filter((u) => u.type === "assignment")
                .map((upload, index) => (
                  <div key={index} className="assignment-item">
                    <p className="assignment-title">{upload.title}</p>
                    <a
                      href={upload.url}
                      className="assignment-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Assignment
                    </a>
                  </div>
                ))}
            </div>
          </>
        )}

        {activeTab === "jobs" && (
          <>
            <h4 className="section-title">💼 Job Opportunities</h4>
            <div className="job-list">
              <div className="job-item">
                <p className="job-title">Web Developer - XYZ Corp</p>
                <button className="job-link" onClick={() => alert("Apply soon!")}>
                  Apply Now
                </button>
              </div>
              <div className="job-item">
                <p className="job-title">AI Specialist - ABC Inc.</p>
                <button className="job-link" onClick={() => alert("Apply soon!")}>
                  Apply Now
                </button>
              </div>
            </div>
          </>
        )}

        {/* {activeTab === "records" && (
          <>
            <h4 className="section-title">📜 Records</h4>
            <div className="record-list">
              {filteredUploads.map((upload, index) => (
                <div
                  key={index}
                  className="record-item"
                  onClick={() => handleVideoClick(upload.videoURL)}
                  style={{ cursor: "pointer" }}
                >
                  <p className="record-title">{upload.recordName}</p>
                  <div
                    className="record-video"
                    dangerouslySetInnerHTML={{ __html: upload.recordURL }}
                  />
                  <p className="click-hint">Click to expand</p>
                </div>
              ))}
            </div>
          </>
        )} */}
      </div>

      {/* Modal for video */}
      {modalVideo && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              className="modal-body"
              dangerouslySetInnerHTML={{ __html: modalVideo }}
            />
            <button className="modal-close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* CSS */}
      <style jsx>{`
        .dashboard-container {
          display: flex;
          justify-content: space-between;
          padding: 20px;
        }

        .sidebar {
          width: 300px;
          padding: 20px;
          background-color: #f4f4f4;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .student-name {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
        }

        .student-info {
          margin-top: 10px;
          font-size: 14px;
          color: #555;
        }

        .student-info-value {
          font-weight: bold;
        }

        .profile-section {
          margin-top: 20px;
        }

        .profile-icon {
          font-size: 36px;
          color: #007bff;
        }

        .profile-title {
          font-size: 20px;
          font-weight: bold;
          margin: 10px 0;
        }

        .profile-details {
          font-size: 14px;
          color: #555;
        }

        .upload-label {
          font-weight: bold;
          margin-bottom: 5px;
          display: block;
        }

        .upload-input {
          width: 100%;
          margin-bottom: 10px;
        }

        .profile-photo-preview {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 50%;
          margin-top: 10px;
        }

        .password-label {
          font-weight: bold;
          margin-top: 10px;
          display: block;
        }

        .password-input {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .save-button {
          background-color: #007bff;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 5px;
          width: 100%;
          cursor: pointer;
        }

        .save-button:hover {
          background-color: #0056b3;
        }

        .nav-tabs {
          margin-top: 20px;
        }

        .tab {
          padding: 10px;
          margin: 5px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .tab span {
          margin-left: 10px;
        }

        .active-tab {
          background-color: #007bff;
          color: white;
          font-weight: bold;
        }

        .content-area {
          width: calc(100% - 340px);
          padding: 20px;
        }

        .section-title {
          font-size: 20px;
          font-weight: bold;
          margin: 10px 0;
        }

        .topics-list {
          list-style: none;
          padding: 0;
        }

        .topic-item {
          font-size: 16px;
          margin: 5px 0;
        }

        .no-syllabus {
          font-size: 16px;
          color: #888;
        }

        .lectures-list,
        .assignments-list,
        .record-list {
          margin-top: 20px;
        }

        .lecture-item,
        .assignment-item,
        .record-item {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .lecture-title,
        .assignment-title,
        .record-title {
          font-size: 16px;
          font-weight: bold;
        }

        .assignment-link {
          color: #007bff;
          text-decoration: none;
        }

        .assignment-link:hover {
          text-decoration: underline;
        }

        .click-hint {
          font-size: 12px;
          color: #888;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 80%;
          max-height: 80%;
          overflow-y: auto;
        }

        .modal-close {
          background-color: #ff6f61;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          float: right;
        }

        .modal-close:hover {
          background-color: #ff3d2e;
        }
          .profile-pic {
  border-radius: 50%;
  width: 100px; /* You can adjust the size as per your needs */
  height: 100px; /* Keep the height equal to the width to maintain the round shape */
  object-fit: cover; /* This will ensure the image is contained within the circle */
}

      `}</style>
    </div>
  );
};

export default StudentDashboard;

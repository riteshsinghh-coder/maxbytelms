import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courses from './data/courses';

const FileUpload = ({ groups = [] }) => {
  const navigate = useNavigate();
  const [targetType, setTargetType] = useState('group');
  const [targetValue, setTargetValue] = useState([]);
  const [videoName, setVideoName] = useState('');
  const [videoURL, setVideoURL] = useState(''); // local state for embed code

  useEffect(() => {
    console.log('Groups:', groups);
    console.log('Courses:', courses);

    // Dynamically inject the keyframes into the document
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  }, [groups]);

  const handleUpload = async () => {
    if (!videoURL || !videoName || targetValue.length === 0) {
      alert('Please provide a video name, embed code, and select at least one target.');
      return;
    }

    const uploadData = {
      videoName,
      videoURL,
      targetType,
      targetValue
    };

    try {
      const response = await fetch('http://localhost:5000/upload-video', {  // Update with correct backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Video uploaded successfully:', result);
        alert('Video uploaded successfully!');
        navigate('/uploads');
      } else {
        alert('Error uploading video!');
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('An error occurred while uploading the video!');
    }
  };

  const handleCheckboxChange = (subject) => {
    setTargetValue((prev) =>
      prev.includes(subject)
        ? prev.filter((item) => item !== subject)
        : [...prev, subject]
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🎥 Upload New Video</h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>Video Name:</label>
          <input
            type="text"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            placeholder="Enter video name"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Target:</label>
          <select
            value={targetType}
            onChange={(e) => {
              setTargetType(e.target.value);
              setTargetValue([]); // Reset the selected target value
            }}
            style={styles.input}
          >
            <option value="group">Group</option>
            <option value="student">Course</option>
          </select>
        </div>

        {targetType === 'group' && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Group:</label>
            <select
              value={targetValue[0] || ''}
              onChange={(e) => setTargetValue([e.target.value])}
              style={styles.input}
            >
              <option value="" disabled>Select Group</option>
              {groups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        )}

        {targetType === 'student' && (
          <div style={styles.checkboxWrapper}>
            <label style={styles.label}>Select Courses:</label>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <label key={index} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={course.subjects}
                    checked={targetValue.includes(course.subjects)}
                    onChange={() => handleCheckboxChange(course.subjects)}
                  />
                  <span style={styles.checkboxText}>{course.subjects}</span>
                </label>
              ))
            ) : (
              <p>No courses available</p>
            )}
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>YouTube Embed Code:</label>
          <textarea
            rows={4}
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            placeholder='<iframe src="..." />'
            style={styles.input}
          />
        </div>

        {videoURL && (
          <div
            style={styles.previewContainer}
            dangerouslySetInnerHTML={{ __html: videoURL }}
          />
        )}

        <button onClick={handleUpload} style={styles.button}>
          🚀 Upload Video
        </button>
      </div>
    </div>
  );
};

// 💅 Modern styles
const styles = {
  container: {
    padding: '20px',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #f0f2ff, #e0eaff)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '700px',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    animation: 'fadeIn 0.6s ease-in-out',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    transition: 'border 0.3s',
    resize: 'vertical',
  },
  checkboxWrapper: {
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '20px',
    background: '#fafafa',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    cursor: 'pointer',
  },
  checkboxText: {
    marginLeft: '8px',
    fontSize: '15px',
    color: '#333',
  },
  previewContainer: {
    marginBottom: '20px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#7F00FF',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};

export default FileUpload;

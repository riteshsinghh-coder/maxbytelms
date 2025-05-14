import React, { useRef, useEffect } from 'react';

const StudentForm = ({
  formType,
  formData,
  onChange,
  onCancel,
  courses,
}) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCancel]);

  const handleSubmit = async () => {
    const newStudent =
      formType === 'admission'
        ? {
            name: formData.name,
            uid: formData.uid,
            group: formData.group,
            subjects: formData.course,
            address: formData.address,
          }
        : {
            name: formData.name,
            uid: formData.uid,
            phone: formData.phone,
            address: formData.address,
            subjects: formData.course,
            interestedCourse: formData.interestedCourse,
          };

    const url =
      formType === 'admission'
        ? 'http://localhost:5000/add-student'
        : 'http://localhost:5000/add-scholarship-student';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        alert('Student added successfully');
        onCancel();
      } else {
        alert('Failed to add student');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div style={styles.overlay}>
      <div ref={modalRef} style={styles.modal}>
        <button onClick={onCancel} style={styles.closeBtn}>×</button>
        <h3 style={styles.heading}>
          {formType === 'admission' ? 'Create New Student' : 'Create Scholarship Student'}
        </h3>

        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="UID"
          name="uid"
          value={formData.uid}
          onChange={onChange}
          style={styles.input}
        />
        {formType === 'scholarship' && (
          <input
            type="text"
            placeholder="Phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            style={styles.input}
          />
        )}
        <input
          type="text"
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={onChange}
          style={styles.input}
        />

        <select
          name="course"
          value={formData.course}
          onChange={onChange}
          style={styles.input}
        >
          <option value="">Select Course</option>
          {Array.isArray(courses) &&
            courses
              .filter(course => formType === 'scholarship' ? course.type === 'scholarship' : true)
              .map((course, index) => (
                <option key={index} value={course.subjects}>
                  {course.subjects}
                </option>
              ))}
        </select>

        {formType === 'admission' && (
          <input
            type="text"
            placeholder="Group"
            name="group"
            value={formData.group}
            onChange={onChange}
            style={styles.input}
          />
        )}

        {formType === 'scholarship' && (
          <input
            type="text"
            placeholder="Interested Course"
            name="interestedCourse"
            value={formData.interestedCourse}
            onChange={onChange}
            style={styles.input}
          />
        )}

        <div style={{ marginTop: '16px' }}>
          <button
            onClick={handleSubmit}
            style={{
              ...styles.button,
              backgroundColor: '#007bff',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
          <button
            onClick={onCancel}
            style={{ ...styles.button, backgroundColor: '#888' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '10px',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    position: 'relative',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '16px',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#888',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    marginRight: '10px',
    fontSize: '14px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
  },
};

export default StudentForm;

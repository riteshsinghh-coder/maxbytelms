import React from 'react';

const StudentList = ({ students, handleEditStudent }) => {
  return (
    <ul style={styles.studentList}>
      {students.map((student) => (
        <li key={student.uid} style={styles.studentItem}>
          {student.name} ({student.uid}) - {student.group}
          <button
            onClick={() => handleEditStudent(student)}
            style={styles.editButton}
          >
            Edit
          </button>
        </li>
      ))}
    </ul>
  );
};

const styles = {
  studentList: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  studentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#FFA500',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default StudentList;

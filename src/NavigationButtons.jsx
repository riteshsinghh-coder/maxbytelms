import React from 'react';

const NavigationButtons = ({ setActiveSection }) => {
  return (
    <div style={styles.navButtons}>
      <button
        onClick={() => setActiveSection('studentManagement')}
        style={styles.navButton}
      >
        Student Management
      </button>
      <button
        onClick={() => setActiveSection('fileUpload')}
        style={styles.navButton}
      >
        File Upload
      </button>
     
      <button
        onClick={() => setActiveSection('questionForm')}
        style={styles.navButton}
      >
        MCQ Question
      </button>
      
    </div>
  );
};

const styles = {
  navButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  navButton: {
    padding: '12px 24px',
    backgroundColor: '#7F00FF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default NavigationButtons;

import React from 'react';
import { motion } from 'framer-motion';

const StudentList = ({ students, handleEditStudent }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(255, 165, 0, 0.3)",
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 500
      } 
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      style={styles.wrapper}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h3 
        style={styles.heading}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        All Students
        <motion.span 
          style={styles.headingUnderline}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.h3>
      
      <ul style={styles.studentList}>
        {students.map((student) => (
          <motion.li 
            key={student.uid} 
            style={styles.studentItem}
            variants={itemVariants}
            whileHover={{ 
              backgroundColor: 'rgba(245, 245, 245, 0.8)',
              transition: { duration: 0.2 }
            }}
          >
            <div style={styles.studentInfo}>
              <motion.img
                src={
                  student.profilePicture
                    ? `/${student.profilePicture.replace(/\\/g, '/')}`
                    : 'https://via.placeholder.com/40x40?text=👤'
                }
                alt={student.name}
                style={styles.profileImage}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              />
              <div>
                <strong style={styles.nameText}>{student.name}</strong> 
                <span style={styles.uidText}> ({student.uid})</span><br />
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Group:</span> 
                  <span style={styles.detailValue}>{student.group}</span> 
                  {student.course && (
                    <>
                      <span style={styles.detailSeparator}>|</span>
                      <span style={styles.detailLabel}>Course:</span> 
                      <span style={styles.detailValue}>{student.course}</span>
                    </>
                  )}
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Fee Paid:</span>
                  <span
                    style={{
                      color: student.registrationFeePaid ? '#38a169' : '#e53e3e',
                      fontWeight: 'bold',
                    }}
                  >
                    {student.registrationFeePaid ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
            <motion.button 
              onClick={() => handleEditStudent(student)} 
              style={styles.editButton}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              Edit
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  heading: {
    marginBottom: '20px',
    color: '#2b6cb0',
    fontSize: '1.5rem',
    fontWeight: '600',
    position: 'relative',
    paddingBottom: '8px',
  },
  headingUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '3px',
    backgroundColor: '#4299e1',
    transformOrigin: 'left center',
  },
  studentList: {
    listStyleType: 'none',
    paddingLeft: '0',
    width: '100%',
  },
  studentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '8px',
    backgroundColor: 'white',
    transition: 'background-color 0.2s ease',
  },
  studentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  profileImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ebf8ff',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#FFA500',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  nameText: {
    fontSize: '1.1rem',
    color: '#2d3748',
  },
  uidText: {
    fontSize: '0.85rem',
    color: '#718096',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '4px',
    fontSize: '0.9rem',
  },
  detailLabel: {
    color: '#4a5568',
    fontWeight: '500',
  },
  detailValue: {
    color: '#2d3748',
  },
  detailSeparator: {
    color: '#cbd5e0',
    margin: '0 4px',
  },
};

export default StudentList;
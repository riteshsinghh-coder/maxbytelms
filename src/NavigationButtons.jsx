import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const NavigationButtons = ({ setActiveSection }) => {
  // Modal state controls
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    uid: '',
    phone: '',
    address: '',
    course: '',
    registrationFeePaid: false,
    applicationFeePaid: false,
  });

  // Courses list
  const [courses, setCourses] = useState([]);

  // UI states
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch courses
  useEffect(() => {
    fetch('https://maxbytelms.onrender.com/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0 && Array.isArray(data[0].courses)) {
          setCourses(data[0].courses);
        } else {
          console.error('Invalid course format received');
        }
      })
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  // Handle form input changes
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      uid: '',
      phone: '',
      address: '',
      course: '',
      registrationFeePaid: false,
      applicationFeePaid: false,
    });
    setError('');
    setMessage('');
    setLoading(false);
  };

  // Form validation
  const validateForm = () => {
    const { name, uid, phone, address, course } = formData;
    if (!name || !uid || !phone || !address || !course) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (!formData.registrationFeePaid && !formData.applicationFeePaid) {
      setError('At least one fee must be paid.');
      return false;
    }
    return true;
  };

  // Submit handler
  const handleSubmit = async (type) => {
    setError('');
    setMessage('');
    if (!validateForm()) return;

    const endpoint = type === 'student'
      ? 'https://maxbytelms.onrender.com/api/students'
      : 'https://maxbytelms.onrender.com/api/scholarships';

    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit');
        setLoading(false);
        return;
      }

      setMessage('Form submitted successfully!');

      setTimeout(() => {
        setShowStudentModal(false);
        setShowScholarshipModal(false);
        resetForm();
      }, 1500);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowStudentModal(false);
    setShowScholarshipModal(false);
    resetForm();
  };

  const isSubmitDisabled = loading || (!formData.registrationFeePaid && !formData.applicationFeePaid);

  return (
    <NavContainer>
      {/* Navigation buttons */}
      <ButtonGroup>
        <NavButton 
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(128, 82, 224, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveSection('studentManagement')}
        >
          Student Management
        </NavButton>
        
        <NavButton 
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(128, 82, 224, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveSection('fileUpload')}
        >
          File Upload
        </NavButton>
        
        <NavButton 
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(128, 82, 224, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveSection('questionForm')}
        >
          MCQ Question
        </NavButton>
        
        <CreateButton 
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(128, 82, 224, 0.7)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowStudentModal(true)}
        >
          Create Student
        </CreateButton>
        
        <ScholarshipButton 
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(128, 82, 224, 0.7)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowScholarshipModal(true)}
        >
          Create Scholarship
        </ScholarshipButton>
      </ButtonGroup>

      {/* Modal */}
      <AnimatePresence>
        {(showStudentModal || showScholarshipModal) && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>{showStudentModal ? 'Create New Student' : 'Create Scholarship Student'}</ModalTitle>
                <CloseButton 
                  onClick={closeModal} 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring' }}
                >
                  ×
                </CloseButton>
              </ModalHeader>
              
              <FormContainer>
                <FormGroup>
                  <Label>Full Name*</Label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Enter student's full name"
                    whileFocus={{ boxShadow: '0 0 0 2px rgba(128, 82, 224, 0.5)' }}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>UID*</Label>
                  <Input 
                    name="uid" 
                    value={formData.uid} 
                    onChange={handleChange} 
                    placeholder="Unique Identification Number"
                    whileFocus={{ boxShadow: '0 0 0 2px rgba(128, 82, 224, 0.5)' }}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Phone Number*</Label>
                  <Input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="+91 1234567890" 
                    type="tel"
                    whileFocus={{ boxShadow: '0 0 0 2px rgba(128, 82, 224, 0.5)' }}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Address*</Label>
                  <Input 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="Full residential address"
                    whileFocus={{ boxShadow: '0 0 0 2px rgba(128, 82, 224, 0.5)' }}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Course*</Label>
                  <Select 
                    name="course" 
                    value={formData.course} 
                    onChange={handleChange}
                    whileFocus={{ boxShadow: '0 0 0 2px rgba(128, 82, 224, 0.5)' }}
                  >
                    <option value="">-- Select a Course --</option>
                    {courses.map(course => (
                      <option key={course._id} value={course.subjects}>
                        {course.subjects} ({course.duration}) - ₹{course.courseFees}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FeeOptions>
                  <CheckboxLabel>
                    <HiddenCheckbox 
                      type="checkbox"
                      name="registrationFeePaid"
                      checked={formData.registrationFeePaid}
                      onChange={handleChange}
                    />
                    <StyledCheckbox checked={formData.registrationFeePaid}>
                      <Icon viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </Icon>
                    </StyledCheckbox>
                    <span>Registration Fee (₹500)</span>
                  </CheckboxLabel>
                  
                  <CheckboxLabel>
                    <HiddenCheckbox 
                      type="checkbox"
                      name="applicationFeePaid"
                      checked={formData.applicationFeePaid}
                      onChange={handleChange}
                    />
                    <StyledCheckbox checked={formData.applicationFeePaid}>
                      <Icon viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </Icon>
                    </StyledCheckbox>
                    <span>Application Fee (₹50)</span>
                  </CheckboxLabel>
                </FeeOptions>

                <FeedbackContainer>
                  {error && (
                    <ErrorMessage
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring' }}
                    >
                      {error}
                    </ErrorMessage>
                  )}
                  {message && (
                    <SuccessMessage
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring' }}
                    >
                      {message}
                    </SuccessMessage>
                  )}
                </FeedbackContainer>

                <ModalButtonGroup>
                  <SubmitButton
                    onClick={() => handleSubmit(showStudentModal ? 'student' : 'scholarship')}
                    disabled={isSubmitDisabled}
                    whileHover={!isSubmitDisabled ? { 
                      scale: 1.03,
                      boxShadow: '0 0 10px rgba(128, 82, 224, 0.5)'
                    } : {}}
                    whileTap={!isSubmitDisabled ? { scale: 0.98 } : {}}
                    isDisabled={isSubmitDisabled}
                  >
                    {loading ? (
                      <Loader
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <LoaderCircle cx="12" cy="12" r="10" />
                      </Loader>
                    ) : (
                      'Submit'
                    )}
                  </SubmitButton>
                  
                  <CancelButton
                    onClick={closeModal}
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: '0 0 10px rgba(229, 62, 62, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </CancelButton>
                </ModalButtonGroup>
              </FormContainer>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

// Styled Components
const NavContainer = styled.div`
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1rem;
`;

const BaseButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
`;

const NavButton = styled(BaseButton)`
  background-color: #8052e0;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #6a42c0;
  }
`;

const CreateButton = styled(BaseButton)`
  background-color: #8052e0;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #6a42c0;
  }
`;

const ScholarshipButton = styled(BaseButton)`
  background: linear-gradient(135deg, #8052e0 0%, #a17fe0 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(135deg, #6a42c0 0%, #8a6fc0 100%);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const ModalTitle = styled.h2`
  color: #8052e0;
  margin: 0;
  font-size: 1.3rem;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0 0.5rem;
  line-height: 1;
  
  &:hover {
    color: #8052e0;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #8052e0;
    outline: none;
  }
  
  &::placeholder {
    color: #aaa;
    font-size: 0.85rem;
  }
`;

const Select = styled(motion.select)`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #8052e0;
    outline: none;
  }
`;

const FeeOptions = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9f5ff;
  border-radius: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.6rem;
  cursor: pointer;
  user-select: none;
  color: #555;
  font-size: 0.9rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  span {
    margin-left: 0.5rem;
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 2px solid ${props => props.checked ? '#8052e0' : '#aaa'};
  border-radius: 4px;
  background: ${props => props.checked ? '#8052e0' : 'white'};
  transition: all 0.2s ease;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
  width: 10px;
  height: 10px;
  visibility: ${props => props.checked ? 'visible' : 'hidden'};
`;

const FeedbackContainer = styled.div`
  min-height: 1.5rem;
  margin: 0.5rem 0;
`;

const ErrorMessage = styled(motion.div)`
  color: #e53e3e;
  background-color: #fee2e2;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
`;

const SuccessMessage = styled(motion.div)`
  color: #38a169;
  background-color: #f0fff4;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled(BaseButton)`
  background-color: ${props => props.isDisabled ? '#a0aec0' : '#8052e0'};
  color: white;
  flex: 1;
  font-size: 0.9rem;
  padding: 0.7rem;
  
  &:hover {
    background-color: ${props => props.isDisabled ? '#a0aec0' : '#6a42c0'};
  }
`;

const CancelButton = styled(BaseButton)`
  background-color: #f56565;
  color: white;
  flex: 1;
  font-size: 0.9rem;
  padding: 0.7rem;
  
  &:hover {
    background-color: #e53e3e;
  }
`;

const Loader = styled(motion.svg)`
  width: 18px;
  height: 18px;
`;

const LoaderCircle = styled.circle`
  fill: none;
  stroke: white;
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
  
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dashoffset: -125px;
    }
  }
`;

export default NavigationButtons;
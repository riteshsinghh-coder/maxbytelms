import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FiUpload, FiCheck, FiX, FiLoader } from 'react-icons/fi';

const FileUpload = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoIframe, setVideoIframe] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:10000/api/courses');
        const data = await res.json();

        if (Array.isArray(data) && data[0]?.courses) {
          const parsedCourses = data[0].courses.map(course => ({
            subjects: course.subjects,
            duration: course.duration,
            courseFees: course.courseFees,
            _id: course._id
          }));
          setCourses(parsedCourses);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchCourses();
  }, []);

  const handleCheckboxChange = (courseName) => {
    setSelectedCourses(prev =>
      prev.includes(courseName)
        ? prev.filter(c => c !== courseName)
        : [...prev, courseName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    setIsSuccess(false);

    if (!videoTitle || !videoIframe || selectedCourses.length === 0) {
      setMessage('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:10000/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          videoName: videoTitle,
          videoURL: videoIframe,
          targetType: 'course',
          targetValue: selectedCourses,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Video uploaded successfully!');
        setIsSuccess(true);
        setVideoTitle('');
        setVideoIframe('');
        setSelectedCourses([]);
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setMessage('');
          setIsSuccess(false);
        }, 3000);
      } else {
        setMessage(result.message || 'Upload failed. Please try again.');
        setIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error occurred. Please check your connection.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UploadContainer>
      <AnimatePresence>
        {message && (
          <MessageBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            isSuccess={isSuccess}
          >
            {isSuccess ? <FiCheck /> : <FiX />}
            {message}
          </MessageBox>
        )}
      </AnimatePresence>

      <UploadForm
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
      >
        <UploadHeader>
          <FiUpload size={32} color="#8052e0" />
          <h2>Upload New Video</h2>
          <p>Share educational content with your students</p>
        </UploadHeader>

        <FormGroup>
          <Label>Video Topic Title*</Label>
          <Input
            type="text"
            placeholder="Enter video title"
            value={videoTitle}
            onChange={e => setVideoTitle(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Embed Code*</Label>
          <TextArea
            placeholder="Paste iframe embed code here..."
            value={videoIframe}
            onChange={e => setVideoIframe(e.target.value)}
            required
          />
          <HelpText>Only paste the iframe tag content</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Select Courses*</Label>
          {courses.length === 0 ? (
            <LoadingCourses>
              <FiLoader className="spin" />
              Loading available courses...
            </LoadingCourses>
          ) : (
            <CourseList>
              {courses.map((course) => (
                <CourseItem key={course._id}>
                  <Checkbox
                    type="checkbox"
                    id={`course-${course._id}`}
                    checked={selectedCourses.includes(course.subjects)}
                    onChange={() => handleCheckboxChange(course.subjects)}
                  />
                  <CourseLabel htmlFor={`course-${course._id}`}>
                    <CourseName>{course.subjects}</CourseName>
                    <CourseMeta>
                      <span>{course.duration}</span>
                      <span>₹{course.courseFees}</span>
                    </CourseMeta>
                  </CourseLabel>
                </CourseItem>
              ))}
            </CourseList>
          )}
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <>
              <FiLoader className="spin" />
              Uploading...
            </>
          ) : (
            'Upload Video'
          )}
        </SubmitButton>
      </UploadForm>
    </UploadContainer>
  );
};

// Styled Components
const UploadContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const UploadForm = styled(motion.form)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const UploadHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    color: #8052e0;
    margin: 1rem 0 0.5rem;
    font-size: 1.8rem;
  }
  
  p {
    color: #718096;
    margin: 0;
    font-size: 0.9rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #8052e0;
    box-shadow: 0 0 0 3px rgba(128, 82, 224, 0.2);
    outline: none;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #8052e0;
    box-shadow: 0 0 0 3px rgba(128, 82, 224, 0.2);
    outline: none;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const HelpText = styled.small`
  display: block;
  margin-top: 0.5rem;
  color: #718096;
  font-size: 0.8rem;
`;

const LoadingCourses = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #718096;
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const CourseList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
`;

const CourseItem = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 0.8rem;
  width: 18px;
  height: 18px;
  accent-color: #8052e0;
`;

const CourseLabel = styled.label`
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #8052e0;
    background-color: #f9f5ff;
  }
`;

const CourseName = styled.div`
  font-weight: 600;
  color: #2d3748;
`;

const CourseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.3rem;
  font-size: 0.9rem;
  color: #718096;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #8052e0 0%, #a17fe0 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
  
  svg.spin {
    animation: spin 1s linear infinite;
  }
`;

const MessageBox = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  font-weight: 500;
  background-color: ${props => props.isSuccess ? '#f0fff4' : '#fff5f5'};
  color: ${props => props.isSuccess ? '#22c55e' : '#e53e3e'};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export default FileUpload;
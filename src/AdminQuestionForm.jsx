import React, { useEffect, useState, useRef } from 'react';
import styled, { css } from 'styled-components';

// --- Styled Components Definitions ---

export const FormContainer = styled.div`
    max-width: 900px;
    margin: 2rem auto;
    padding: 2.5rem;
    background: linear-gradient(135deg, #f0f4f8, #e0e8f0);
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    animation: fadeIn 0.5s ease-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

export const Title = styled.h1`
    font-size: 2.8rem;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
`;

export const TabContainer = styled.div`
    display: flex;
    margin-bottom: 2rem;
    border-bottom: 2px solid #dde1e6;
`;

export const TabButton = styled.button`
    flex: 1;
    padding: 1.2rem 1.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: ${props => props.isActive ? '#3498db' : '#7f8c8d'};
    background-color: ${props => props.isActive ? '#ffffff' : 'transparent'};
    border: none;
    border-bottom: ${props => props.isActive ? '3px solid #3498db' : '3px solid transparent'};
    cursor: pointer;
    transition: all 0.3s ease;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    &:hover {
        color: #3498db;
        background-color: #f0f4f8;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`;

export const SectionTitle = styled.h2`
    font-size: 1.8rem;
    color: #34495e;
    margin-top: 2rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #a9cce3;
    padding-bottom: 0.8rem;
    font-weight: 600;
    text-align: center;
`;

export const CourseSelectionWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.2rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: #f8fcff;
    border-radius: 10px;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);
`;

export const CourseCard = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 120px;
    position: relative;
    overflow: hidden;

    ${props => props.isSelected && css`
        border: 3px solid #28a745;
        box-shadow: 0 6px 20px rgba(40, 167, 69, 0.25);
        transform: translateY(-5px);
        &::after {
            content: '✓';
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 1.8rem;
            color: #28a745;
            background-color: #e6ffe9;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #28a745;
        }
    `}

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    }
`;

export const CourseName = styled.h3`
    font-size: 1.4rem;
    color: #34495e;
    margin-bottom: 0.5rem;
    font-weight: 600;
`;

export const CourseDetails = styled.p`
    font-size: 0.95rem;
    color: #7f8c8d;
    line-height: 1.4;
`;

export const InputGroup = styled.div`
    margin-bottom: 1.5rem;
`;

export const Label = styled.label`
    display: block;
    font-size: 1.1rem;
    color: #2c3e50;
    margin-bottom: 0.6rem;
    font-weight: 500;
`;

export const Input = styled.input`
    width: calc(100% - 20px);
    padding: 0.8rem 1rem;
    border: 1px solid #c8d6e5;
    border-radius: 8px;
    font-size: 1rem;
    color: #333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    background-color: #fdfdfd;

    &:focus {
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        outline: none;
    }
`;

export const TextArea = styled.textarea`
    width: calc(100% - 20px);
    padding: 0.8rem 1rem;
    border: 1px solid #c8d6e5;
    border-radius: 8px;
    font-size: 1rem;
    color: #333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    background-color: #fdfdfd;
    min-height: 100px;
    resize: vertical;

    &:focus {
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        outline: none;
    }
`;

export const Button = styled.button`
    background-color: #3498db;
    color: white;
    padding: 0.9rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 1rem;
    font-weight: 600;

    &:hover {
        background-color: #2980b9;
        transform: translateY(-2px);
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
        transform: none;
    }
`;

export const AddButton = styled(Button)`
    background-color: #2ecc71;
    &:hover {
        background-color: #27ae60;
    }
`;

export const TopicList = styled.div`
    margin-top: 1.5rem;
    padding-top: 1rem;
`;

export const TopicItem = styled.div`
    background-color: #e8f6fa;
    border: 1px solid #b3e0ff;
    border-radius: 10px;
    padding: 1.2rem;
    margin-bottom: 1.8rem; /* More space between topics */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

export const TopicHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px dashed #c8d6e5; /* Subtle separator */
`;

export const TopicTitleText = styled.h4`
    font-size: 1.3rem;
    color: #2c3e50;
    margin: 0;
`;

export const DeleteButton = styled.button`
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c0392b;
    }
`;

export const QuestionTypeSelect = styled.select`
    width: calc(100% - 20px);
    padding: 0.8rem 1rem;
    border: 1px solid #c8d6e5;
    border-radius: 8px;
    font-size: 1rem;
    color: #333;
    background-color: #fdfdfd;
    margin-bottom: 1rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        outline: none;
    }
`;

export const OptionsWrapper = styled.div`
    margin-top: 1rem;
`;

export const OptionItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.8rem;
    background-color: #f0f8ff;
    padding: 0.7rem 1rem;
    border-radius: 8px;
    border: 1px solid #d0e8ff;
`;

export const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    color: #34495e;
`;

export const RadioInput = styled.input`
    margin-right: 0.8rem;
    min-width: 18px;
    min-height: 18px;
    accent-color: #3498db;
    cursor: pointer;
`;

export const OptionInput = styled(Input)`
    flex-grow: 1;
    margin-left: 0.5rem;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    border: 1px solid #c8d6e5;
    font-size: 0.95rem;
`;

export const RemoveOptionButton = styled.button`
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8rem;
    margin-left: 0.8rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c0392b;
    }
`;

export const AddOptionButton = styled(Button)`
    background-color: #3498db;
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
`;

export const SubmitButton = styled(Button)`
    width: 100%;
    padding: 1.2rem;
    font-size: 1.2rem;
    margin-top: 2.5rem;
    background-color: #28a745; /* Green for submit */
    &:hover {
        background-color: #218838;
    }
`;

export const Message = styled.p`
    padding: 1rem;
    margin-top: 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    text-align: center;
    font-weight: 500;
    ${props => props.success ?
        css`
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        ` :
        css`
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        `
    }
`;

export const QuestionCard = styled.div`
    background-color: #f8fcfd;
    border: 1px solid #e0f2f7;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.03);
`;

export const QuestionText = styled.p`
    font-weight: 500;
    margin-bottom: 0.8rem;
    color: #444;
`;

export const LinkedContentText = styled.p`
    font-size: 0.95rem;
    color: #555;
    margin-top: 0.5rem;
`;


export const OptionText = styled.p`
    margin-left: 0.5rem;
    color: #555;
    ${props => props.isCorrect && css`
        font-weight: bold;
        color: #28a745;
    `}
`;

export const QuestionActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
`;

export const EditQuestionButton = styled(Button)`
    background-color: #ffc107;
    color: #333;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    &:hover {
        background-color: #e0a800;
    }
`;

export const DeleteQuestionButton = styled(Button)`
    background-color: #dc3545;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    &:hover {
        background-color: #c82333;
    }
`;

export const AddQuestionButtonPerTopic = styled(AddButton)`
    margin-top: 1rem;
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
    width: auto;
    display: block; /* Make it a block button */
    margin-left: auto;
    margin-right: auto;
`;

export const CourseSelectPlaceholder = styled.div`
    text-align: center;
    padding: 2rem;
    color: #7f8c8d;
    font-size: 1.1rem;
    background-color: #f0f4f8;
    border-radius: 10px;
    border: 1px dashed #c8d6e5;
`;

export const QuestionFormArea = styled.div`
    border: 1px dashed #a9cce3;
    background-color: #f0f8ff;
    padding: 1.5rem;
    border-radius: 10px;
    margin-top: 2rem; /* More space to differentiate from topic list */
    margin-bottom: 1.5rem;
    box-shadow: inset 0 1px 5px rgba(0,0,0,0.05);
    z-index: 100; /* Ensure it's above other content */
`;

// --- AdminQuestionForm Component ---

const AdminQuestionForm = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseIds, setSelectedCourseIds] = useState([]);
    const [topics, setTopics] = useState([]);
    const [newTopicTitle, setNewTopicTitle] = useState('');

    const [activeTab, setActiveTab] = useState('courses');

    // States for the *shared* question form inputs
    const [currentQuestionText, setCurrentQuestionText] = useState('');
    const [currentQuestionType, setCurrentQuestionType] = useState('mcq');
    const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

    // States for managing which topic/question is currently being targeted by the shared form
    const [activeTopicIdForForm, setActiveTopicIdForForm] = useState(null); // Stores topic.id for which the form is active
    const [editingQuestionId, setEditingQuestionId] = useState(null); // The ID of the question being edited

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);

    const questionFormRef = useRef(null); // Ref to scroll to the shared question form

    // Fetch Courses - No Change
    useEffect(() => {
        setIsLoadingCourses(true);
        fetch('https://maxbytelms.onrender.com/api/courses')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0 && Array.isArray(data[0].courses)) {
                    // For course IDs, a combination of data might be fine, but a unique _id from backend is best
                    const fetchedCourses = data[0].courses.map((course, index) => {
                        return {
                            // Using backend's _id if available, otherwise a generated one
                            _id: course._id || `${course.subjects.replace(/\s/g, '-')}-${course.duration.replace(/\s/g, '-')}-${index}-${Date.now()}`,
                            ...course
                        };
                    });
                    setCourses(fetchedCourses);
                    setMessage('');
                } else {
                    setCourses([]);
                    setMessage('No courses found or unexpected data format from API.');
                    setIsSuccess(false);
                }
            })
            .catch(err => {
                console.error('Failed to fetch courses:', err);
                setCourses([]);
                setMessage(`Failed to load courses: ${err.message}. Ensure the backend is running and providing data.`);
                setIsSuccess(false);
            })
            .finally(() => {
                setIsLoadingCourses(false);
            });
    }, []);

    // Function to reset the shared question form inputs
    const resetQuestionForm = () => {
        setCurrentQuestionText('');
        setCurrentQuestionType('mcq'); // Default to MCQ
        setMcqOptions(['', '', '', '']);
        setCorrectAnswerIndex(0);
        setEditingQuestionId(null);
        setActiveTopicIdForForm(null); // Hide the form (important for fresh add)
        setMessage(''); // Clear any previous validation messages from the form
    };

    const toggleCourse = (courseId) => {
        setSelectedCourseIds(prev => {
            if (prev.includes(courseId)) {
                return prev.filter(id => id !== courseId);
            } else {
                return [...prev, courseId];
            }
        });
    };

    const addTopic = () => {
        if (newTopicTitle.trim() === '') {
            setMessage('Topic title cannot be empty.');
            setIsSuccess(false);
            return;
        }
        // Use crypto.randomUUID for topic IDs as well for consistency
        setTopics(prev => [...prev, { id: crypto.randomUUID(), title: newTopicTitle.trim(), questions: [] }]);
        setNewTopicTitle('');
        setMessage('');
    };

    // This function handles both adding and updating a question using the shared form
    const handleAddOrUpdateQuestion = () => {
        if (currentQuestionText.trim() === '') {
            setMessage('Question text cannot be empty.');
            setIsSuccess(false);
            return;
        }
        if (!activeTopicIdForForm) {
            setMessage('No topic selected to add/update question.');
            setIsSuccess(false);
            return;
        }

        if (currentQuestionType === 'mcq') {
            // Filter out empty options before validation for option count
            const nonEmptyOptions = mcqOptions.filter(opt => opt.trim() !== '');
            if (nonEmptyOptions.length < 2) {
                setMessage('MCQ questions require at least two non-empty options.');
                setIsSuccess(false);
                return;
            }
            // Validate correct answer index against non-empty options
            if (correctAnswerIndex === null || correctAnswerIndex < 0 || correctAnswerIndex >= nonEmptyOptions.length) {
                 setMessage('Please select a valid correct answer for the MCQ (within non-empty options).');
                 setIsSuccess(false);
                 return;
             }
        }

        // --- NEW QUESTION DATA CREATION ---
        const questionData = {
            // Generate ID only if it's a NEW question being added
            id: editingQuestionId || crypto.randomUUID(),
            questionText: currentQuestionText.trim(),
            type: currentQuestionType,
        };

        if (currentQuestionType === 'mcq') {
            questionData.options = mcqOptions.filter(opt => opt.trim() !== ''); // Store only non-empty options
            questionData.correctAnswerIndex = correctAnswerIndex;
        }

        setTopics(prevTopics => {
            // Deep copy the topics array to ensure immutability
            const updatedTopics = prevTopics.map(topic => {
                if (topic.id === activeTopicIdForForm) {
                    // This is the target topic
                    const newQuestions = [...topic.questions]; // Deep copy questions array

                    if (editingQuestionId) {
                        // UPDATE existing question
                        const questionIndex = newQuestions.findIndex(q => q.id === editingQuestionId);
                        if (questionIndex !== -1) {
                            newQuestions[questionIndex] = questionData; // Replace the old question with the updated one
                        }
                    } else {
                        // ADD new question
                        // Prevent adding if an identical (by ID) question is already present
                        // This check acts as a safeguard against multiple accidental additions
                        const isDuplicateNewQuestion = newQuestions.some(q => q.id === questionData.id);
                        if (!isDuplicateNewQuestion) {
                            newQuestions.push(questionData);
                        } else {
                             // Log or handle this case if it happens, but crypto.randomUUID should prevent it for new IDs
                             console.warn("Attempted to add a duplicate new question ID. This shouldn't happen with crypto.randomUUID().");
                        }
                    }
                    // Return the updated topic object
                    return { ...topic, questions: newQuestions };
                }
                return topic; // Return other topics as is
            });

            return updatedTopics; // Return the fully updated topics array
        });

        resetQuestionForm(); // Always reset form after adding/updating
        setMessage(editingQuestionId ? 'Question updated successfully!' : 'Question added successfully!');
        setIsSuccess(true);
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...mcqOptions];
        updatedOptions[index] = value;
        setMcqOptions(updatedOptions);
    };

    const addMcqOption = () => {
        setMcqOptions(prev => [...prev, '']);
    };

    const removeMcqOption = (indexToRemove) => {
        setMcqOptions(prev => {
            const newOptions = prev.filter((_, index) => index !== indexToRemove);
            // Adjust correctAnswerIndex if the removed option was the correct one or if options before it were removed
            if (correctAnswerIndex === indexToRemove) {
                return newOptions.length > 0 ? newOptions : ['', '', '', '']; // Reset if no options, or keep one
            } else if (correctAnswerIndex > indexToRemove) {
                return newOptions; // Index automatically shifts
            }
            return newOptions;
        });
        // Special logic for correctAnswerIndex if needed, depending on desired behavior
        // E.g., if the correct answer option is removed, reset it to 0 or another valid index.
        // For simplicity, we can let it be handled by the next `correctAnswerIndex` validation.
    };


    const deleteTopic = (idToDelete) => {
        if (window.confirm('Are you sure you want to delete this topic and all its questions?')) {
            setTopics(prev => prev.filter(topic => topic.id !== idToDelete));
            if (activeTopicIdForForm === idToDelete) {
                resetQuestionForm();
            }
            setMessage('Topic deleted successfully.');
            setIsSuccess(true);
        }
    };

    const startAddingQuestion = (topicId) => {
        resetQuestionForm(); // Clear any previous state
        setActiveTopicIdForForm(topicId); // Activate the form for this topic (for adding)
        if (questionFormRef.current) {
            questionFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const startEditingQuestion = (topicId, questionId) => {
        const topic = topics.find(t => t.id === topicId);
        if (!topic) return;

        const questionToEdit = topic.questions.find(q => q.id === questionId);
        if (questionToEdit) {
            setActiveTopicIdForForm(topicId);
            setEditingQuestionId(questionId);
            setCurrentQuestionText(questionToEdit.questionText);
            setCurrentQuestionType(questionToEdit.type);

            if (questionToEdit.type === 'mcq') {
                // Ensure there are at least 4 options to avoid array access issues
                const options = questionToEdit.options || []; // Handle case where options might be undefined
                const paddedOptions = options.length < 4
                    ? [...options, ...Array(4 - options.length).fill('')]
                    : options;
                setMcqOptions(paddedOptions);
                setCorrectAnswerIndex(questionToEdit.correctAnswerIndex || 0);
            } else { // text or link type
                setMcqOptions(['', '', '', '']); // Clear options
                setCorrectAnswerIndex(0);
            }
            setMessage('');
            if (questionFormRef.current) {
                questionFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const deleteQuestion = (topicId, questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            setTopics(prevTopics => {
                // Ensure deep copy to update state immutably
                const updatedTopics = prevTopics.map(topic => {
                    if (topic.id === topicId) {
                        return {
                            ...topic,
                            questions: topic.questions.filter(q => q.id !== questionId)
                        };
                    }
                    return topic;
                });
                return updatedTopics;
            });
            if (editingQuestionId === questionId && activeTopicIdForForm === topicId) {
                resetQuestionForm();
            }
            setMessage('Question deleted successfully.');
            setIsSuccess(true);
        }
    };

    const validateForm = () => {
        if (selectedCourseIds.length === 0) {
            setMessage('Please select at least one course.');
            setIsSuccess(false);
            setActiveTab('courses');
            return false;
        }
        if (topics.length === 0) {
            setMessage('Please add at least one topic.');
            setIsSuccess(false);
            setActiveTab('topics');
            return false;
        }
        for (const topic of topics) {
            if (topic.questions.length === 0) {
                setMessage(`Topic "${topic.title}" must have at least one question.`);
                setIsSuccess(false);
                setActiveTab('topics');
                return false;
            }
            for (const question of topic.questions) {
                if (question.type === 'mcq') {
                    if (question.options.filter(opt => opt.trim() !== '').length < 2) {
                        setMessage(`MCQ question "${question.questionText}" in topic "${topic.title}" must have at least two non-empty options.`);
                        setIsSuccess(false);
                        setActiveTab('topics');
                        return false;
                    }
                    if (question.correctAnswerIndex === null || question.correctAnswerIndex < 0 || question.correctAnswerIndex >= question.options.length) {
                        setMessage(`MCQ question "${question.questionText}" in topic "${topic.title}" must have a valid correct answer selected.`);
                        setIsSuccess(false);
                        setActiveTab('topics');
                        return false;
                    }
                }
            }
        }
        setMessage('');
        setIsSuccess(false);
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const payload = {
            selectedCourseIds: selectedCourseIds,
            topics: topics.map(topic => ({
                title: topic.title,
                questions: topic.questions.map(q => {
                    const { id, ...rest } = q; // Remove client-side 'id' before sending to backend
                    return rest;
                }),
            })),
        };

        try {
            const res = await fetch('https://maxbytelms.onrender.com/api/assignments', { // Your backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok) {
                setMessage('Assignment saved successfully!');
                setIsSuccess(true);
                // Clear form after successful submission
                setSelectedCourseIds([]);
                setTopics([]);
                setNewTopicTitle('');
                resetQuestionForm();
                setActiveTab('courses'); // Go back to first tab
            } else {
                setMessage(result.message || 'Failed to save assignment. Please check your inputs and try again.');
                setIsSuccess(false);
            }
        } catch (err) {
                console.error('Error submitting assignment:', err);
                setMessage('Network error or server unreachable. Please try again later.');
                setIsSuccess(false);
        }
    };

    return (
        <FormContainer>
            <Title>Create New Assignment</Title>

            <TabContainer>
                <TabButton isActive={activeTab === 'courses'} onClick={() => setActiveTab('courses')}>
                    1. Select Courses
                </TabButton>
                <TabButton
                    isActive={activeTab === 'topics'}
                    onClick={() => setActiveTab('topics')}
                    // Disable next tab if no courses are selected and no topics are added yet
                    disabled={selectedCourseIds.length === 0 && topics.length === 0}
                >
                    2. Add Topics & Questions
                </TabButton>
            </TabContainer>

            {/* Courses Tab Content */}
            {activeTab === 'courses' && (
                <>
                    <SectionTitle>Select Courses</SectionTitle>
                    <CourseSelectionWrapper>
                        {isLoadingCourses ? (
                            <CourseSelectPlaceholder>Loading courses...</CourseSelectPlaceholder>
                        ) : courses.length === 0 ? (
                            <CourseSelectPlaceholder>
                                {message.includes("Failed to load courses") ? message : "No courses available. Please add courses to the system."}
                            </CourseSelectPlaceholder>
                        ) : (
                            courses.map(course => (
                                <CourseCard
                                    key={course._id} // Using backend _id or generated one
                                    isSelected={selectedCourseIds.includes(course._id)}
                                    onClick={() => toggleCourse(course._id)}
                                >
                                    <CourseName>{course.subjects}</CourseName>
                                    <CourseDetails>
                                        Duration: {course.duration} • Fees: ₹{course.courseFees}
                                    </CourseDetails>
                                </CourseCard>
                            ))
                        )}
                    </CourseSelectionWrapper>
                    {/* Display messages related to course selection only if not success */}
                    {message && !isSuccess && activeTab === 'courses' && <Message success={isSuccess}>{message}</Message>}
                    <Button onClick={() => setActiveTab('topics')} disabled={selectedCourseIds.length === 0}>
                        Next: Manage Topics & Questions
                    </Button>
                </>
            )}

            {/* Topics & Questions Tab Content */}
            {activeTab === 'topics' && (
                <>
                    <SectionTitle>Add Topics & Questions</SectionTitle>
                    <InputGroup>
                        <Label htmlFor="newTopicTitle">Topic Title</Label>
                        <Input
                            type="text"
                            id="newTopicTitle"
                            value={newTopicTitle}
                            onChange={(e) => setNewTopicTitle(e.target.value)}
                            placeholder="e.g., Introduction to React, Data Structures"
                        />
                        <AddButton onClick={addTopic} disabled={newTopicTitle.trim() === ''}>
                            Add Topic
                        </AddButton>
                    </InputGroup>

                    {/* Message for topic additions/deletions, specific to this tab */}
                    {message && isSuccess && activeTab === 'topics' && <Message success={isSuccess}>{message}</Message>}

                    <TopicList>
                        {topics.length === 0 && <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No topics added yet. Add a topic above to start adding questions.</p>}
                        {topics.map((topic) => (
                            <TopicItem key={topic.id}>
                                <TopicHeader>
                                    <TopicTitleText>{topic.title}</TopicTitleText>
                                    <DeleteButton onClick={() => deleteTopic(topic.id)}>Delete Topic</DeleteButton>
                                </TopicHeader>

                                {/* Questions listed for this topic */}
                                <h4 style={{ marginTop: '1rem', marginBottom: '1rem', color: '#34495e' }}>Questions in "{topic.title}":</h4>
                                {topic.questions.length === 0 && <p style={{ color: '#7f8c8d' }}>No questions added to this topic yet. Click "+ Add New Question" below.</p>}
                                {topic.questions.map(question => (
                                    <QuestionCard key={question.id}> {/* Crucial: Ensure question.id is unique */}
                                        <QuestionText>Q: {question.questionText}</QuestionText>
                                        {question.type === 'mcq' && (
                                            <OptionsWrapper>
                                                {/* Display options for MCQ */}
                                                {question.options.map((option, optIndex) => (
                                                    <OptionText key={optIndex} isCorrect={question.correctAnswerIndex === optIndex}>
                                                        {String.fromCharCode(65 + optIndex)}. {option}
                                                        {question.correctAnswerIndex === optIndex && ' (Correct Answer)'}
                                                    </OptionText>
                                                ))}
                                            </OptionsWrapper>
                                        )}
                                        {/* Indicate question type for text and link, as they don't have options/specific content preview here */}
                                        {question.type === 'link' && (
                                            <LinkedContentText>Type: Link Submission Question</LinkedContentText>
                                        )}
                                        {question.type === 'text' && (
                                            <LinkedContentText>Type: Text Answer Question</LinkedContentText>
                                        )}
                                        <QuestionActions>
                                            <EditQuestionButton onClick={() => startEditingQuestion(topic.id, question.id)}>Edit</EditQuestionButton>
                                            <DeleteQuestionButton onClick={() => deleteQuestion(topic.id, question.id)}>Delete</DeleteQuestionButton>
                                        </QuestionActions>
                                    </QuestionCard>
                                ))}

                                {/* Button to explicitly add a new question to THIS topic */}
                                <AddQuestionButtonPerTopic onClick={() => startAddingQuestion(topic.id)}>
                                    + Add New Question
                                </AddQuestionButtonPerTopic>
                            </TopicItem>
                        ))}

                        {/* CENTRALIZED QUESTION ADD/EDIT FORM - Appears only when activated for a specific topic */}
                        {activeTopicIdForForm && (
                            <QuestionFormArea ref={questionFormRef}>
                                <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
                                    {editingQuestionId ? 'Edit Question' : `Add New Question for Topic: "${topics.find(t => t.id === activeTopicIdForForm)?.title || '...'}"`}
                                </h4>
                                <InputGroup>
                                    <Label htmlFor="currentQuestionText">Question Text</Label>
                                    <TextArea
                                        id="currentQuestionText"
                                        value={currentQuestionText}
                                        onChange={(e) => setCurrentQuestionText(e.target.value)}
                                        placeholder="Enter your question here..."
                                    />
                                </InputGroup>

                                <InputGroup>
                                    <Label htmlFor="currentQuestionType">Question Type</Label>
                                    <QuestionTypeSelect
                                        id="currentQuestionType"
                                        value={currentQuestionType}
                                        onChange={(e) => {
                                            setCurrentQuestionType(e.target.value);
                                            // Reset MCQ options when switching away from MCQ
                                            if (e.target.value !== 'mcq') {
                                                setMcqOptions(['', '', '', '']);
                                                setCorrectAnswerIndex(0);
                                            }
                                        }}
                                    >
                                        <option value="mcq">Multiple Choice Question</option>
                                        <option value="text">Text Answer</option>
                                        <option value="link">Link Submission (Student will provide link)</option>
                                    </QuestionTypeSelect>
                                </InputGroup>

                                {currentQuestionType === 'mcq' && (
                                    <OptionsWrapper>
                                        <Label>Options</Label>
                                        {mcqOptions.map((option, optIndex) => (
                                            <OptionItem key={optIndex}>
                                                <RadioLabel>
                                                    <RadioInput
                                                        type="radio"
                                                        name="correctOption"
                                                        value={optIndex}
                                                        checked={correctAnswerIndex === optIndex}
                                                        onChange={() => setCorrectAnswerIndex(optIndex)}
                                                    />
                                                    Option {optIndex + 1}:
                                                </RadioLabel>
                                                <OptionInput
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                                                    placeholder={`Option ${optIndex + 1}`}
                                                />
                                                {/* Allow removing option if there are more than 2 (minimum for MCQ) */}
                                                {mcqOptions.length > 2 && (
                                                    <RemoveOptionButton onClick={() => removeMcqOption(optIndex)}>
                                                        Remove
                                                    </RemoveOptionButton>
                                                )}
                                            </OptionItem>
                                        ))}
                                        <AddOptionButton onClick={addMcqOption}>Add Option</AddOptionButton>
                                    </OptionsWrapper>
                                )}

                                {/* Validation message for the form itself */}
                                {message && !isSuccess && activeTopicIdForForm && <Message success={isSuccess}>{message}</Message>}

                                <AddButton
                                    onClick={handleAddOrUpdateQuestion}
                                    disabled={
                                        currentQuestionText.trim() === '' || // Question text cannot be empty
                                        (currentQuestionType === 'mcq' && mcqOptions.filter(opt => opt.trim() !== '').length < 2) // MCQ needs at least 2 non-empty options
                                    }
                                >
                                    {editingQuestionId ? 'Update Question' : 'Add Question'}
                                </AddButton>
                                <Button onClick={resetQuestionForm} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>
                                    Cancel
                                </Button>
                            </QuestionFormArea>
                        )}
                    </TopicList>
                </>
            )}

            {/* Global submission message, especially for form validation issues */}
            {message && !isSuccess && !activeTopicIdForForm && <Message success={isSuccess}>{message}</Message>}

            <SubmitButton
                onClick={handleSubmit}
                // Disable if no courses selected OR no topics added OR if any topic has no questions
                disabled={selectedCourseIds.length === 0 || topics.length === 0 || topics.some(topic => topic.questions.length === 0)}
            >
                Save Assignment
            </SubmitButton>
        </FormContainer>
    );
};

export default AdminQuestionForm;
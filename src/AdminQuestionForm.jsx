import React, { useState } from 'react';
import axios from 'axios';
import courses from './data/courses'; // Importing the courses data

const AdminQuestionForm = () => {
  const defaultQuestion = () => ({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    config: {
      isMCQ: false,
      isTextAnswer: false,
      isAssignmentLink: false,
      isLinkSubmission: false,
    },
    assignmentLink: '',
    studentAnswer: '',
    result: '',
    questionType: '',
    linkSubmission: '',
  });

  const defaultTopic = () => ({
    topicName: '',
    questions: [defaultQuestion()],
  });

  const [topics, setTopics] = useState([defaultTopic()]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleTopicChange = (index, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index].topicName = value;
    setTopics(updatedTopics);
  };

  const handleQuestionChange = (topicIndex, questionIndex, key, value) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].questions[questionIndex][key] = value;
    setTopics(updatedTopics);
  };

  const addNewQuestion = (topicIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].questions.push(defaultQuestion());
    setTopics(updatedTopics);
  };

  const removeQuestion = (topicIndex, questionIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].questions.splice(questionIndex, 1);
    setTopics(updatedTopics);
  };

  const addNewTopic = () => {
    setTopics([...topics, defaultTopic()]);
  };

  const removeTopic = (index) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1);
    setTopics(updatedTopics);
  };

  const handleSubmitAll = async () => {
    // Validation
    for (const topic of topics) {
      for (const q of topic.questions) {
        if (!q.question || !q.questionType) {
          alert('Please fill all fields correctly in every question.');
          return;
        }
        if (q.questionType === 'mcq' && (q.options.some((o) => !o) || !q.correctAnswer)) {
          alert('Please complete all MCQ options and correct answer.');
          return;
        }
        if (q.questionType === 'assignmentLink' && !q.assignmentLink) {
          alert('Please provide a valid assignment link.');
          return;
        }
        if (q.questionType === 'linkSubmission' && !q.linkSubmission) {
          alert('Please provide a valid submission link.');
          return;
        }
      }
    }

    if (selectedCourses.length === 0) {
      alert('Please select at least one course.');
      return;
    }

    // Prepare payload
    const payload = topics.map((topic) => ({
      topicName: topic.topicName,
      questions: topic.questions.map((q) => ({
        question: q.question,
        questionType: q.questionType,
        options: q.questionType === 'mcq' ? q.options : [],
        correctAnswer: q.questionType === 'mcq' ? q.correctAnswer : '',
        studentAnswer: q.questionType === 'textAnswer' ? q.studentAnswer : '',
        assignmentLink: q.questionType === 'assignmentLink' ? q.assignmentLink : '',
        linkSubmission: q.questionType === 'linkSubmission' ? q.linkSubmission : '',
        assignedCourses: selectedCourses,
      })),
    }));

    // Log the data to the console before submitting
    console.log('Data to be submitted:', payload);

    // Submit data to server
    try {
      const response = await axios.post('http://localhost:5000/api/submit-questions', { topics: payload });
      console.log('Server response:', response.data);
      alert('Questions submitted successfully!');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit questions.');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 900, margin: 'auto' }}>
      <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: 20 }}>🧠 Multiple Question Creator</h2>

      {topics.map((topic, tIndex) => (
        <div key={tIndex} style={styles.topicCard}>
          <h3>
            Topic {tIndex + 1}:{' '}
            <input
              type="text"
              placeholder="Enter Topic Name"
              value={topic.topicName}
              onChange={(e) => handleTopicChange(tIndex, e.target.value)}
              style={styles.input}
            />
            <button onClick={() => removeTopic(tIndex)} style={styles.removeButton}>Remove Topic</button>
          </h3>

          {topic.questions.map((q, qIndex) => (
            <div key={qIndex} style={styles.questionCard}>
              <h4>Question {qIndex + 1}</h4>
              <input
                type="text"
                placeholder="Enter question"
                value={q.question}
                onChange={(e) => handleQuestionChange(tIndex, qIndex, 'question', e.target.value)}
                style={styles.input}
              />

              <div style={styles.checkboxGroup}>
                {['mcq', 'textAnswer', 'assignmentLink', 'linkSubmission'].map(type => (
                  <label key={type}>
                    <input
                      type="radio"
                      name={`questionType-${tIndex}-${qIndex}`}
                      checked={q.questionType === type}
                      onChange={() => handleQuestionChange(tIndex, qIndex, 'questionType', type)}
                    />
                    {type.replace(/([A-Z])/g, ' $1')}
                  </label>
                ))}
              </div>

              {q.questionType === 'mcq' && (
                <>
                  {q.options.map((opt, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updatedOptions = [...q.options];
                        updatedOptions[optIndex] = e.target.value;
                        handleQuestionChange(tIndex, qIndex, 'options', updatedOptions);
                      }}
                      style={styles.input}
                    />
                  ))}
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(tIndex, qIndex, 'correctAnswer', e.target.value)}
                    style={styles.input}
                  />
                </>
              )}

              {q.questionType === 'textAnswer' && (
                <textarea
                  placeholder="Expected text answer"
                  value={q.studentAnswer}
                  onChange={(e) => handleQuestionChange(tIndex, qIndex, 'studentAnswer', e.target.value)}
                  style={{ ...styles.input, height: 100 }}
                />
              )}

              {q.questionType === 'assignmentLink' && (
                <input
                  type="url"
                  placeholder="Assignment Google Drive Link"
                  value={q.assignmentLink}
                  onChange={(e) => handleQuestionChange(tIndex, qIndex, 'assignmentLink', e.target.value)}
                  style={styles.input}
                />
              )}

              {q.questionType === 'linkSubmission' && (
                <input
                  type="url"
                  placeholder="Link for Student to Submit"
                  value={q.linkSubmission}
                  onChange={(e) => handleQuestionChange(tIndex, qIndex, 'linkSubmission', e.target.value)}
                  style={styles.input}
                />
              )}

              <button onClick={() => removeQuestion(tIndex, qIndex)} style={styles.removeButton}>Remove Question</button>
            </div>
          ))}

          <button onClick={() => addNewQuestion(tIndex)} style={styles.button}>➕ Add Question</button>
        </div>
      ))}

      <button onClick={addNewTopic} style={styles.button}>➕ Add Topic</button>

      <div style={styles.targetSelection}>
        <h4>Select Courses to Assign:</h4>
        {courses.map((course) => (
          <label key={course.subjects} style={{ display: 'block', marginBottom: 5 }}>
            <input
              type="checkbox"
              checked={selectedCourses.includes(course.subjects)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...selectedCourses, course.subjects]
                  : selectedCourses.filter((s) => s !== course.subjects);
                setSelectedCourses(updated);
              }}
            />
            {course.subjects}
          </label>
        ))}
      </div>

      <button onClick={handleSubmitAll} style={styles.submitButton}>🚀 Submit All</button>
    </div>
  );
};

const styles = {
  questionCard: {
    padding: 20,
    background: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: 10,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    marginBottom: 20,
  },
  topicCard: {
    padding: 20,
    background: '#f4f6f8',
    borderRadius: 12,
    marginBottom: 30,
    border: '1px solid #ccc',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  checkboxGroup: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  targetSelection: {
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#2980b9',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    marginRight: 10,
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'block',
    margin: 'auto',
  },
  removeButton: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    marginLeft: 10,
  },
};

export default AdminQuestionForm;

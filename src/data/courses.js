import webDevSubjects from './webdev'; 
import fullSyllabus from './cloudDeveops';
import dataScienceSubjects from './dataScience';
import aimlSubjects from './aiml';
import digitalMarketingSubjects from './dm';
import basicComputerSubjects from './basic';
import placementProgram from './placement';

const courses = [
  {
    subjects: "Basic Computer",
    duration: "12 months",
    topics: basicComputerSubjects,
    type: "scholarship",
    courseFees: 12000,
  },
  {
    subjects: "Excel Basic-Advance",
    duration: "2 months",
    type: "scholarship",
    courseFees: 3000,
  },
  {
    subjects: "Google Form, Google Sheet",
    duration: "1 month",
    type: "scholarship",
    courseFees: 2000,
  },
  {
    subjects: "Web Development 0-1",
    topics: webDevSubjects.slice(0, 57),
    duration: "8 months",
    type: "scholarship",
    courseFees: 20000,
  },
  {
    subjects: "Web Development 1-100",
    duration: "6 months",
    topics: webDevSubjects.slice(57),
    type: "scholarship",
    courseFees: 15000,
  },
  {
    subjects: "Web Development 0-100",
    topics: webDevSubjects,
    duration: "12 months",
    type: "scholarship",
    courseFees: 30000,
  },
  {
    subjects: "Cloud Computing (AWS)",
    duration: "8 months",
    topics: fullSyllabus.slice(0, 31),
    type: "scholarship",
    courseFees: 20000,
  },
  {
    subjects: "DevOps",
    duration: "6 months",
    topics: fullSyllabus.slice(31),
    type: "scholarship",
    courseFees: 15000,
  },
  {
    subjects: "Cloud Computing(AWS)+DevOps",
    duration: "12 months",
    topics: fullSyllabus,
    type: "scholarship",
    courseFees: 30000,
  },
  {
    subjects: "Data Science",
    duration: "12 months",
    topics: dataScienceSubjects,
    type: "scholarship",
    courseFees: 30000,
  },
  {
    subjects: "Data Analyst",
    duration: "6 months",
    topics: dataScienceSubjects.slice(5, 18).concat(dataScienceSubjects.slice(36, 38)),
    type: "scholarship",
    courseFees: 15000,
  },
  {
    subjects: "Artificial Intelligence and Machine Learning",
    duration: "12 months",
    type: "scholarship",
    topics: aimlSubjects,
    courseFees: 30000,
  },
  {
    subjects: "Digital Marketing",
    duration: "8 months",
    topics: digitalMarketingSubjects,
    type: "scholarship",
    courseFees: 20000,
  },
  {
    subjects: "Accounts & Tally",
    duration: "6 months",
    type: "scholarship",
    courseFees: 12000,
  },
  {
    subjects: "Tally",
    duration: "3 months",
    type: "scholarship",
    courseFees: 6000,
  },
  {
    subjects: "C++",
    duration: "3 months",
    type: "scholarship",
    courseFees: 6000,
  },
  {
    subjects: "Python",
    duration: "3 months",
    type: "scholarship",
    courseFees: 6000,
  },
  {
    subjects: "Java",
    duration: "3 months",
    type: "scholarship",
    courseFees: 6000,
  },
  {
    subjects: "React",
    duration: "3 months",
    type: "scholarship",
    courseFees: 6000,
  },
  {
    subjects: "JavaScript",
    duration: "3 months",
    type: "scholarship",
    courseFees: 6000,
  },
  {
    subjects: "Placement Program", // Adding the placement program to the list
    duration: "12 months",
    type: "scholarship",
    topics: placementProgram,
    courseFees: 50000,
  },
];

export default courses;

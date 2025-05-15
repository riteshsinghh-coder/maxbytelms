import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// --- File Paths ---
const STUDENTS_FILE_PATH = path.join(__dirname, 'public/data/students.json');
const SCHOLARSHIP_FILE_PATH = path.join(__dirname, 'src/data/scholarship.js');
const UPLOADS_FILE_PATH = path.join(__dirname, 'src/data/uploads.js');
const TOPICS_FILE_PATH = path.join(__dirname, 'src/data/topicsData.js');
const IMAGE_UPLOAD_DIR = path.join(__dirname, 'uploads/images');

// --- Ensure upload folder exists ---
if (!fs.existsSync(IMAGE_UPLOAD_DIR)) {
  fs.mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });
}

// --- Static files ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, IMAGE_UPLOAD_DIR),
  filename: (_, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// --- Helper functions ---
const dynamicImport = async (filePath) => {
  const fileUrl = pathToFileURL(filePath).href + `?update=${Date.now()}`;
  const module = await import(fileUrl);
  return module.default || module;
};

const formatStudent = (student) => ({
  name: student.name,
  uid: student.uid,
  password: student.password,
  group: student.group,
  course: student.subjects,
  phone: student.phone || "",
  address: student.address || "",
  registrationFeePaid: student.registrationFeePaid === '₹500',
  profilePicture: student.profilePicture || ""
});

// --- ROUTES ---

// 1. Update student profile with optional image
app.use(express.static(path.join(__dirname)));

// Catch-all route to handle all requests and serve the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/update-profile', upload.single('profileImage'), async (req, res) => {
  const { uid, password } = req.body;
  const profileImagePath = req.file?.path;

  if (!uid) return res.status(400).json({ message: "UID is required" });

  try {
    const data = fs.readFileSync(STUDENTS_FILE_PATH, 'utf8');
    let students = JSON.parse(data);
    let found = false;

    students = students.map(student => {
      if (student.uid === uid) {
        student.password = password || student.password;
        student.profilePicture = profileImagePath || student.profilePicture;
        found = true;
      }
      return student;
    });

    if (!found) return res.status(404).json({ message: "Student not found" });

    fs.writeFileSync(STUDENTS_FILE_PATH, JSON.stringify(students, null, 2));
    res.json({ message: "Profile updated successfully", imagePath: profileImagePath });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// 2. Add a new student
app.post('/add-student', async (req, res) => {
  const newStudent = req.body;
  try {
    const data = fs.readFileSync(STUDENTS_FILE_PATH, 'utf8');
    const students = JSON.parse(data);
    students.push(formatStudent(newStudent));
    fs.writeFileSync(STUDENTS_FILE_PATH, JSON.stringify(students, null, 2));
    res.status(200).send('Student added successfully');
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).send('Failed to add student');
  }
});

// 3. Add scholarship student
app.post('/add-scholarship-student', async (req, res) => {
  const newStudent = req.body;
  try {
    const fileData = await dynamicImport(SCHOLARSHIP_FILE_PATH);
    fileData.push(newStudent);
    const content = `export default ${JSON.stringify(fileData, null, 2)};`;
    fs.writeFileSync(SCHOLARSHIP_FILE_PATH, content);
    res.status(200).send('Scholarship student added successfully');
  } catch (err) {
    console.error('Error adding scholarship student:', err);
    res.status(500).send('Failed to write scholarship data');
  }
});

// 4. Upload video
app.post('/upload-video', async (req, res) => {
  const { videoName, videoURL, targetType, targetValue } = req.body;
  if (!videoName || !videoURL || !targetType || !targetValue || !targetValue.length) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const uploads = await dynamicImport(UPLOADS_FILE_PATH);
    uploads.push({ videoName, videoURL, targetType, targetValue });
    const content = `export default ${JSON.stringify(uploads, null, 2)};`;
    fs.writeFileSync(UPLOADS_FILE_PATH, content);
    res.status(200).send('Video uploaded successfully');
  } catch (err) {
    console.error('Error uploading video:', err);
    res.status(500).send('Failed to write to uploads file');
  }
});

// 5. Submit MCQ questions
app.post('/api/submit-questions', async (req, res) => {
  const { topics: newTopics } = req.body;
  if (!newTopics || !Array.isArray(newTopics)) {
    return res.status(400).send({ message: 'Invalid topics data' });
  }

  try {
    const existingTopics = await dynamicImport(TOPICS_FILE_PATH);
    newTopics.forEach(newTopic => {
      const existing = existingTopics.find(t => t.topicName === newTopic.topicName);
      if (existing) {
        existing.questions.push(...newTopic.questions);
      } else {
        existingTopics.push(newTopic);
      }
    });

    const content = `export default ${JSON.stringify(existingTopics, null, 2)};`;
    fs.writeFileSync(TOPICS_FILE_PATH, content);
    res.status(200).send({ message: 'Questions submitted and saved successfully' });
  } catch (err) {
    console.error('Error submitting questions:', err);
    res.status(500).send({ message: 'Failed to save topics data' });
  }
});

// 6. Upload profile image only
app.post('/upload-profile-image', upload.single('profileImage'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });

  const imageUrl = `/uploads/images/${req.file.filename}`;
  res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
});

// 7. Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

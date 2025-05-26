import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'; // Make sure ObjectId is imported
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGODB_URI = "mongodb+srv://maxbyteplacementacademy:qRogbhGwaKSlGm3U@cluster0.w1by45v.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "maxbyte_academy";
const PORT = process.env.PORT || 10000;

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
let db;
let client;

async function connectToMongoDB() {
  try {
    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');
    await initializeCollections();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

async function initializeCollections() {
  const collections = [
    { name: 'students', index: { uid: 1 }, options: { unique: true } },
    { name: 'users', index: { uid: 1 }, options: { unique: true } },
    { name: 'courses', index: { courseId: 1 }, options: { unique: true } },
    // Changed index for assignments to reflect new structure (selectedCourseIds)
    { name: 'assignments', index: { selectedCourseIds: 1 } },
    { name: 'study_materials', index: { course: 1 } },
    { name: 'videos', index: { topicName: 1 } },
    { name: 'scholarships', index: { uid: 1 }, options: { unique: true } },
  ];

  try {
    for (const collection of collections) {
      const exists = await db.listCollections({ name: collection.name }).hasNext();
      if (!exists) {
        await db.createCollection(collection.name);
      }
      // Added error handling for existing indexes
      try {
        await db.collection(collection.name).createIndex(collection.index, collection.options || {});
      } catch (indexErr) {
        if (indexErr.codeName !== 'IndexKeySpecsConflict') {
          console.warn(`Warning creating index for ${collection.name}:`, indexErr.message);
        }
      }
    }
    console.log('✅ Collections initialized');
  } catch (err) {
    console.log('Collections initialization error:', err.message);
  }
}

// File Upload Config
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  })
});

// ===================== ROUTES ===================== //

// Serve index
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Test DB connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const collections = await db.listCollections().toArray();
    res.json({
      connected: true,
      collections: collections.map(c => c.name)
    });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Login API
app.post('/api/login', async (req, res) => {
  const { uid, password, role } = req.body;
  try {
    const collection = role === 'admin' ? 'users' : 'students';
    const user = await db.collection(collection).findOne({ uid });

    if (!user) {
      return res.status(401).json({ success: false, error: role === 'admin' ? 'Teacher not found' : 'Student not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    const response = {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        uid: user.uid,
        role: user.role || role,
        group: user.group,
        subjects: user.subjects || user.course,
        phoneNo: user.phoneNo || user.phone || "",
        profilePicture: user.profilePicture || "",
        registrationFeePaid: user.registrationFeePaid || false
      }
    };

    if (role === 'admin') {
      const allStudents = await db.collection('students').find({}).toArray();
      response.allStudents = allStudents.map(student => ({
        _id: student._id,
        name: student.name,
        uid: student.uid,
        group: student.group,
        course: student.course,
        phone: student.phone || "",
        profilePicture: student.profilePicture || "",
        registrationFeePaid: student.registrationFeePaid || false
      }));
    }

    res.json(response);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await db.collection('videos').find().toArray();
    res.json(videos);
  } catch (err) {
    console.error('Failed to fetch videos:', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Add a new video
app.post('/api/videos', async (req, res) => {
 
  try {
    const videoData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Basic validation, e.g. title and url required
    if (!videoData.videoName || !videoData.videoURL) {
      return res.status(400).json({ error: 'Missing required fields: videoName and videoURL' });
    }

    const result = await db.collection('videos').insertOne(videoData);
    res.status(201).json({ message: 'Video added successfully', videoId: result.insertedId });
  } catch (err) {
    console.error('Failed to add video:', err);
    res.status(500).json({ error: 'Failed to add video' });
  }
});


// ===============================================
// ADDED NEW ASSIGNMENT ROUTES
// ===============================================

// POST /api/assignments
app.post('/api/assignments', async (req, res) => {
    try {
        const { selectedCourseIds, topics } = req.body;
        console.log(selectedCourseIds);

        // You'll need to decide how `createdBy` is determined without JWT/authentication.
        // For now, I'll use a placeholder. In a real app, this would come from a logged-in user.
        // If you don't have an authentication system, you might need to pass a `createdBy` ID
        // from the frontend (which is not secure) or hardcode it for testing.
        const createdByUserId = new ObjectId('60c72b2f9f1b2c001f8e4d3a'); // REPLACE WITH A REAL USER _ID FROM YOUR 'users' COLLECTION FOR ADMINS

        // Basic Validation
        if (!selectedCourseIds || !Array.isArray(selectedCourseIds) || selectedCourseIds.length === 0) {
            return res.status(400).json({ message: 'At least one course must be selected.' });
        }
        if (!topics || !Array.isArray(topics) || topics.length === 0) {
            return res.status(400).json({ message: 'At least one topic must be added.' });
        }

        // Deeper validation matching your frontend's logic
        for (const topic of topics) {
            if (!topic.title || topic.title.trim() === '') {
                return res.status(400).json({ message: 'Topic title cannot be empty.' });
            }
            if (!topic.questions || topic.questions.length === 0) {
                return res.status(400).json({ message: `Topic "${topic.title}" must have at least one question.` });
            }

            for (const question of topic.questions) {
                if (!question.questionText || question.questionText.trim() === '') {
                    return res.status(400).json({ message: `Question text cannot be empty in topic "${topic.title}".` });
                }
                if (!['mcq', 'text', 'link'].includes(question.type)) {
                    return res.status(400).json({ message: `Invalid question type "${question.type}" for question: "${question.questionText}" in topic "${topic.title}".` });
                }

                if (question.type === 'mcq') {
                    if (!question.options || !Array.isArray(question.options) || question.options.filter(opt => opt.trim() !== '').length < 2) {
                        return res.status(400).json({ message: `MCQ question "${question.questionText}" in topic "${topic.title}" must have at least two non-empty options.` });
                    }
                    if (typeof question.correctAnswerIndex !== 'number' || question.correctAnswerIndex < 0 || question.correctAnswerIndex >= question.options.length) {
                        return res.status(400).json({ message: `MCQ question "${question.questionText}" in topic "${topic.title}" must have a valid correct answer selected.` });
                    }
                }
            }
        }

        const assignmentToInsert = {
            selectedCourseIds: selectedCourseIds.map(id => new ObjectId(id)), // Convert course IDs to ObjectId
            topics: topics,
            createdBy: createdByUserId, // Placeholder or from your auth system
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('assignments').insertOne(assignmentToInsert);

        res.status(201).json({
            message: 'Assignment created successfully!',
            assignmentId: result.insertedId,
        });

    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Server error while creating assignment.' });
    }
});

// GET /api/assignments
app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await db.collection('assignments').find().toArray();
    res.json(assignments);
  } catch (err) {
    console.error('Failed to fetch assignments:', err);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// ===============================================
// REMOVED OLD /api/questions ROUTES
// ===============================================
// The following routes were removed as per previous instructions to replace them with /api/assignments
// app.post('/api/questions', async (req, res) => { ... });
// app.get('/api/questions', async (req, res) => { ... });


// Get single student
app.get('/api/students/:uid', async (req, res) => {
  try {
    const student = await db.collection('students').findOne({ uid: req.params.uid });
    student ? res.json(student) : res.status(404).json({ error: 'Student not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Update student
app.put('/api/students/:uid', upload.single('profileImage'), async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date() };
    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }
    const result = await db.collection('students').updateOne({ uid: req.params.uid }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Add Scholarship
app.post('/api/scholarships', async (req, res) => {
  try {
     const scholarship = req.body;
    console.log("hi");

    // Validate required fields (phone instead of email)
    if (!scholarship.name || !scholarship.phone || !scholarship.course || !scholarship.uid) {
      return res.status(400).json({ error: 'Missing required student fields (name, phone, course, uid)' });
    }
   const query = [{ uid: scholarship.uid }];
    if (scholarship.email) {
      query.push({ email: scholarship.email });
    }

    // Check if UID or email already exists (email check only if provided)
    const existing = await db.collection('scholarships').findOne({ $or: query });
    if (existing) {
      return res.status(409).json({ error: 'Email or UID already exists' });
    }

    // Prepare new student data
    const newStudent = {
      uid: scholarship.uid,
      name: scholarship.name,
      phoneNo: scholarship.phone,
      email: scholarship.email || '',  // empty if not provided
      course: scholarship.course,
      role: 'student',
      profilePicture: '',
      password: 'maxbyte', // plain text password as requested
      registrationFeePaid:scholarship.registrationFeePaid,
      applicationFeePaid:scholarship.applicationFeePaid,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into DB
    const result = await db.collection('scholarships').insertOne(newStudent); // Corrected 'scholarhips' to 'scholarships'

    res.status(201).json({
      message: 'Student added successfully',
      studentId: result.insertedId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add student' });
  }

});

// Get All Courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await db.collection('courses').find().toArray();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const student = req.body;
    console.log("hi");

    // Validate required fields (phone instead of email)
    if (!student.name || !student.phone || !student.course || !student.uid) {
      return res.status(400).json({ error: 'Missing required student fields (name, phone, course, uid)' });
    }

    // Build query to check duplicates
    const query = [{ uid: student.uid }];
    if (student.email) {
      query.push({ email: student.email });
    }

    // Check if UID or email already exists (email check only if provided)
    const existing = await db.collection('students').findOne({ $or: query });

    if (existing) {
      return res.status(409).json({ error: 'Email or UID already exists' });
    }

    // Prepare new student data
    const newStudent = {
      uid: student.uid,
      name: student.name,
      phoneNo: student.phone,
      email: student.email || '',  // empty if not provided
      course: student.course,
      role: 'student',
      profilePicture: '',
      password: 'maxbyte', // plain text password as requested
      registrationFeePaid:student.registrationFeePaid,
      applicationFeePaid:student.applicationFeePaid,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into DB
    const result = await db.collection('students').insertOne(newStudent);

    res.status(201).json({
      message: 'Student added successfully',
      studentId: result.insertedId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Add a new course
app.post('/api/courses', async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('courses').insertOne(courseData);
    res.status(201).json({ message: 'Course added successfully', courseId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add course' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ success: false, error: 'Server error' });
});

// Start server
connectToMongoDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
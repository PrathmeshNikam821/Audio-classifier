import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define directories and script path through environment variables or defaults
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads/');
const PYTHON_SCRIPT = process.env.PYTHON_SCRIPT || 'cnn_training/train_model.py';

// Setup Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);  // Save uploaded files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use current timestamp to avoid filename conflicts
  }
});

// File filter to allow only MP3 files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'audio/mpeg') {
    cb(null, true);
  } else {
    cb(new Error('Only MP3 files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// API route to handle CNN training
app.post('/train', upload.single('audiofile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No audio file uploaded or invalid file format');
  }

  const audioFilePath = `"${req.file.path}"`;  // Wrap the path in quotes to handle spaces

  // Run the Python script for CNN training
  exec(`python ${PYTHON_SCRIPT} ${audioFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return res.status(500).json({ error: `Training failed: ${error.message}` });
    }
    if (stderr) {
      console.error(`Execution stderr: ${stderr}`);
      return res.status(500).json({ error: `Training error: ${stderr}` });
    }
    console.log(`Execution stdout: ${stdout}`);
    res.status(200).send('Model training successful!');
  });
});

// Start the server on the specified port or 3000 by default
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

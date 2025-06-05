const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
const util = require('util');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

const pythonPath = path.join(__dirname, 'venv', 'Scripts', 'python');  // Correct for Windows
const scriptPath = path.join(__dirname, '../Model/predict.py');  // Path to predict.py

app.get('/', (req, res) => {
  res.send('Welcome to the Synthetic Voice Detection API');
});

app.post('/predict', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const filePath = path.normalize(path.join(__dirname, 'uploads', req.file.filename));
  console.log(`Uploaded audio file path: ${filePath}`);

  try {
    const command = `"${pythonPath}" "${scriptPath}" "${filePath}"`;
    console.log(`Executing command: ${command}`);
    const { stdout, stderr } = await util.promisify(exec)(command);

    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    res.json({ result: stdout.trim() });
  } catch (error) {
    console.error(`Error in prediction: ${error.message}`);
    res.status(500).send('Error processing the file');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

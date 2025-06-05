const express = require('express');
const router = express.Router();
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));  // Use path.join for cross-platform compatibility
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route for file upload and prediction
router.post('/predict', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const filePath = path.join(__dirname, '../uploads', req.file.filename);

  const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';  // Dynamic command based on OS
  const predictScriptPath = path.join(__dirname, '../Model/predict.py');  // Ensure correct script path

  exec(`${pythonCommand} "${predictScriptPath}" "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Exec error: ${error.message}`);
      return res.status(500).json({ error: 'Error processing the file' });
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).json({ error: 'Error during prediction' });
    }

    return res.json({ result: stdout.trim() });
  });
});

module.exports = router;

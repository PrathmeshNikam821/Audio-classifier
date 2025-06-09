const express = require('express');
const router = express.Router();
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST /predict
router.post('/predict', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  const predictScriptPath = path.join(__dirname, '../Model/predict.py');
  const pythonCommand = path.join(__dirname, '..', 'venv', 'Scripts', 'python');  // Correct venv path

  const command = `"${pythonCommand}" "${predictScriptPath}" "${filePath}"`;

  exec(command, (error, stdout, stderr) => {
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

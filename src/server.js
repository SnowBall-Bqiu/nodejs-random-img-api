const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files in /img (including subfolders)
app.use('/img', express.static(path.join(__dirname, '..', 'img')));

// Helper to get random file from a directory
function getRandomFile(dir) {
  const files = fs.readdirSync(dir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
  });
  if (files.length === 0) return null;
  const idx = Math.floor(Math.random() * files.length);
  return files[idx];
}

// /h route for horizontal images
app.get('/h', (req, res) => {
  const dir = path.join(__dirname, '..', 'img', 'h');
  const file = getRandomFile(dir);
  if (!file) return res.status(404).send('No horizontal images found');
  res.redirect(`/img/h/${file}`);
});

// /m route for vertical images
app.get('/m', (req, res) => {
  const dir = path.join(__dirname, '..', 'img', 'm');
  const file = getRandomFile(dir);
  if (!file) return res.status(404).send('No vertical images found');
  res.redirect(`/img/m/${file}`);
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

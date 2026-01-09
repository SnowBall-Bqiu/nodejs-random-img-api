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

// Get list of second-level subfolders under img (excluding 'h' and 'm')
function getSecondLevelFolders() {
  const imgBase = path.join(__dirname, '..', 'img');
  return fs.readdirSync(imgBase, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !['h', 'm'].includes(dirent.name))
    .map(dirent => dirent.name);
}

const secondLevelFolders = getSecondLevelFolders();

secondLevelFolders.forEach(folder => {
  // Route for /<folder> (random image from both h and m)
  app.get(`/${folder}`, (req, res) => {
    const hDir = path.join(__dirname, '..', 'img', folder, 'h');
    const mDir = path.join(__dirname, '..', 'img', folder, 'm');
    const hFiles = fs.existsSync(hDir) ? fs.readdirSync(hDir).filter(f => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(f).toLowerCase())) : [];
    const mFiles = fs.existsSync(mDir) ? fs.readdirSync(mDir).filter(f => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(f).toLowerCase())) : [];
    const allFiles = [...hFiles.map(f => ({ sub: 'h', file: f })), ...mFiles.map(f => ({ sub: 'm', file: f }))];
    if (allFiles.length === 0) return res.status(404).send('No images found');
    const choice = allFiles[Math.floor(Math.random() * allFiles.length)];
    res.redirect(`/img/${folder}/${choice.sub}/${choice.file}`);
  });

  // Route for /<folder>/h (random horizontal image)
  app.get(`/${folder}/h`, (req, res) => {
    const dir = path.join(__dirname, '..', 'img', folder, 'h');
    const file = getRandomFile(dir);
    if (!file) return res.status(404).send('No horizontal images found');
    res.redirect(`/img/${folder}/h/${file}`);
  });

  // Route for /<folder>/m (random medium image)
  app.get(`/${folder}/m`, (req, res) => {
    const dir = path.join(__dirname, '..', 'img', folder, 'm');
    const file = getRandomFile(dir);
    if (!file) return res.status(404).send('No vertical images found');
    res.redirect(`/img/${folder}/m/${file}`);
  });
});

// Global random routes
app.get('/all', (req, res) => {
  const folders = getSecondLevelFolders();
  const allFiles = [];
  folders.forEach(folder => {
    const hDir = path.join(__dirname, '..', 'img', folder, 'h');
    const mDir = path.join(__dirname, '..', 'img', folder, 'm');
    if (fs.existsSync(hDir)) {
      const hFiles = fs.readdirSync(hDir).filter(f => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(f).toLowerCase()));
      hFiles.forEach(f => allFiles.push({ folder, sub: 'h', file: f }));
    }
    if (fs.existsSync(mDir)) {
      const mFiles = fs.readdirSync(mDir).filter(f => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(f).toLowerCase()));
      mFiles.forEach(f => allFiles.push({ folder, sub: 'm', file: f }));
    }
  });
  if (allFiles.length === 0) return res.status(404).send('No images found');
  const choice = allFiles[Math.floor(Math.random() * allFiles.length)];
  res.redirect(`/img/${choice.folder}/${choice.sub}/${choice.file}`);
});

app.get('/all/h', (req, res) => {
  const folders = getSecondLevelFolders();
  const allFiles = [];
  folders.forEach(folder => {
    const dir = path.join(__dirname, '..', 'img', folder, 'h');
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(f).toLowerCase()));
      files.forEach(f => allFiles.push({ folder, file: f }));
    }
  });
  if (allFiles.length === 0) return res.status(404).send('No horizontal images found');
  const choice = allFiles[Math.floor(Math.random() * allFiles.length)];
  res.redirect(`/img/${choice.folder}/h/${choice.file}`);
});

app.get('/all/m', (req, res) => {
  const folders = getSecondLevelFolders();
  const allFiles = [];
  folders.forEach(folder => {
    const dir = path.join(__dirname, '..', 'img', folder, 'm');
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(f).toLowerCase()));
      files.forEach(f => allFiles.push({ folder, file: f }));
    }
  });
  if (allFiles.length === 0) return res.status(404).send('No vertical images found');
  const choice = allFiles[Math.floor(Math.random() * allFiles.length)];
  res.redirect(`/img/${choice.folder}/m/${choice.file}`);
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

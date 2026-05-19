const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_FILE = path.join(DATA_DIR, 'inscrieri.json');
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return []; }
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/inscrieri', (req, res) => {
  res.json(readDB());
});

app.post('/api/inscrieri', (req, res) => {
  const { numecopil, an, localitate, numeParinte, transport, data } = req.body;
  if (!numecopil || !an || !localitate || !numeParinte || !transport) {
    return res.status(400).json({ error: 'Câmpuri obligatorii lipsesc' });
  }
  const db = readDB();
  const entry = {
    id: Date.now(),
    numecopil, an, localitate, numeParinte, transport,
    data: data || new Date().toLocaleDateString('ro-RO')
  };
  db.unshift(entry);
  writeDB(db);
  res.status(201).json(entry);
});

app.delete('/api/inscrieri/:id', (req, res) => {
  const db = readDB().filter(r => r.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ ok: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));

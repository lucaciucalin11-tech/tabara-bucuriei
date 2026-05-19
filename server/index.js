const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'tabara.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS inscrieri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numecopil TEXT NOT NULL,
    an INTEGER NOT NULL,
    localitate TEXT NOT NULL,
    numeParinte TEXT NOT NULL,
    transport TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/inscrieri', (req, res) => {
  const rows = db.prepare('SELECT * FROM inscrieri ORDER BY created_at DESC').all();
  res.json(rows);
});

app.post('/api/inscrieri', (req, res) => {
  const { numecopil, an, localitate, numeParinte, transport, data } = req.body;
  if (!numecopil || !an || !localitate || !numeParinte || !transport) {
    return res.status(400).json({ error: 'Câmpuri obligatorii lipsesc' });
  }
  const stmt = db.prepare(
    'INSERT INTO inscrieri (numecopil, an, localitate, numeParinte, transport, data) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(numecopil, an, localitate, numeParinte, transport, data || new Date().toLocaleDateString('ro-RO'));
  const row = db.prepare('SELECT * FROM inscrieri WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

app.delete('/api/inscrieri/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM inscrieri WHERE id = ?').run(id);
  res.json({ ok: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));

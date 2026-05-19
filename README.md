# Tabăra Bucuriei Junior 2026 — Aplicație Înscrieri

Aplicație web pentru înscrieri la tabără, cu bază de date SQLite și panou de administrare.

## Structură

```
tabara/
├── client/          # React frontend
├── server/          # Express + SQLite backend
├── render.yaml      # Config deploy Render
└── package.json     # Script-uri root
```

## Deploy pe Render (gratuit)

### Pasul 1 — Urcă pe GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/USER/tabara-bucuriei.git
git push -u origin main
```

### Pasul 2 — Conectează pe Render
1. Mergi la https://render.com și creează cont gratuit
2. Click **New → Web Service**
3. Conectează repo-ul GitHub
4. Render detectează automat `render.yaml` — click **Apply**

### Pasul 3 — Setează parola admin
În dashboard-ul Render → Environment Variables:
```
REACT_APP_ADMIN_PASS = parola_ta_secreta
```

### Pasul 4 — Deploy
Click **Deploy** — aplicația va fi live în ~3 minute la URL-ul generat de Render.

## Rulare locală

```bash
# Instalează dependențele
npm run install-all

# Build frontend
cd client && npm run build && cd ..

# Pornește serverul
cd server && node index.js
```

Deschide http://localhost:3001

## Funcționalități
- Formular de înscriere cu validare
- Bază de date SQLite persistentă (pe disk Render)
- Panou admin protejat cu parolă
- Statistici participanți
- Responsive, funcționează pe mobil

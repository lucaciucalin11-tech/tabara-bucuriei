import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || '';

const styles = {
  page: { maxWidth: 640, margin: '0 auto', padding: '24px 16px' },
  header: {
    background: '#1D9E75', borderRadius: 12, padding: '24px 20px',
    marginBottom: 24, textAlign: 'center', color: '#fff'
  },
  h1: { fontSize: 20, fontWeight: 600, marginBottom: 4 },
  hsub: { fontSize: 13, color: '#9FE1CB' },
  tabs: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: (active) => ({
    flex: 1, padding: '9px 0', fontSize: 13, fontWeight: 500,
    border: active ? 'none' : '1px solid #d0d0ce',
    borderRadius: 8, cursor: 'pointer',
    background: active ? '#1D9E75' : 'transparent',
    color: active ? '#fff' : '#666'
  }),
  card: {
    background: '#fff', border: '1px solid #e8e8e6',
    borderRadius: 12, padding: '20px', marginBottom: 16
  },
  sectionTitle: { fontSize: 15, fontWeight: 600, marginBottom: 14, color: '#111' },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 5 },
  input: {
    width: '100%', padding: '9px 11px', fontSize: 14,
    border: '1px solid #d0d0ce', borderRadius: 8,
    background: '#fff', color: '#111', outline: 'none'
  },
  inputErr: {
    width: '100%', padding: '9px 11px', fontSize: 14,
    border: '1px solid #E24B4A', borderRadius: 8,
    background: '#fff', color: '#111', outline: 'none'
  },
  error: { fontSize: 12, color: '#E24B4A', marginTop: 4 },
  radioOpt: (selected) => ({
    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 12px',
    border: selected ? '1.5px solid #1D9E75' : '1px solid #e0e0de',
    borderRadius: 8, cursor: 'pointer', marginBottom: 8, fontSize: 13,
    background: selected ? '#E1F5EE' : '#fff', color: '#111'
  }),
  infoBox: {
    background: '#E1F5EE', borderRadius: 8, padding: '11px 14px',
    fontSize: 13, color: '#085041', marginBottom: 12, lineHeight: 1.6
  },
  agreeBox: (checked) => ({
    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px',
    border: checked ? '1.5px solid #1D9E75' : '1px solid #e0e0de',
    borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#333',
    background: checked ? '#E1F5EE' : '#fff'
  }),
  btnSubmit: (disabled) => ({
    width: '100%', padding: '12px', background: disabled ? '#9FE1CB' : '#1D9E75',
    color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 8
  }),
  successCard: {
    background: '#E1F5EE', border: '1px solid #5DCAA5',
    borderRadius: 12, padding: '32px 24px', textAlign: 'center'
  },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 },
  stat: { background: '#f5f5f3', borderRadius: 8, padding: '12px', textAlign: 'center' },
  statVal: { fontSize: 24, fontWeight: 600, color: '#111' },
  statLbl: { fontSize: 11, color: '#888', marginTop: 2 },
  regItem: {
    background: '#fff', border: '1px solid #e8e8e6',
    borderRadius: 10, padding: '12px 14px', marginBottom: 8
  },
  regName: { fontSize: 14, fontWeight: 600, color: '#111' },
  regMeta: { fontSize: 12, color: '#888', marginTop: 3 },
  badge: (type) => ({
    display: 'inline-block', fontSize: 11, padding: '2px 8px', borderRadius: 20,
    marginLeft: 6, verticalAlign: 'middle',
    background: type === 'personal' ? '#E1F5EE' : '#E6F1FB',
    color: type === 'personal' ? '#085041' : '#0C447C'
  }),
  btnDel: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: '#bbb', fontSize: 18, padding: '2px 6px', borderRadius: 4
  },
  empty: { textAlign: 'center', padding: '32px', color: '#aaa', fontSize: 13 },
  link: { color: '#0F6E56', textDecoration: 'underline' }
};

const emptyForm = {
  numecopil: '', an: '', localitate: '',
  numeParinte: '', transport: '', acord: false, plata: false
};

export default function App() {
  const [view, setView] = useState('form');
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regs, setRegs] = useState([]);
  const [adminPass, setAdminPass] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASS || 'tabara2026';

  useEffect(() => {
    if (view === 'admin' && adminUnlocked) fetchRegs();
  }, [view, adminUnlocked]);

  async function fetchRegs() {
    try {
      const r = await fetch(`${API}/api/inscrieri`);
      const data = await r.json();
      setRegs(data);
    } catch { setRegs([]); }
  }

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.numecopil.trim()) e.numecopil = 'Câmp obligatoriu';
    const an = parseInt(form.an);
    if (!form.an || isNaN(an) || an < 2010 || an > 2016) e.an = 'An valid: 2010–2016';
    if (!form.localitate.trim()) e.localitate = 'Câmp obligatoriu';
    if (!form.numeParinte.trim()) e.numeParinte = 'Câmp obligatoriu';
    if (!form.transport) e.transport = 'Selectați o opțiune';
    if (!form.acord) e.acord = 'Acordul este obligatoriu';
    if (!form.plata) e.plata = 'Confirmarea este obligatorie';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await fetch(`${API}/api/inscrieri`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numecopil: form.numecopil,
          an: parseInt(form.an),
          localitate: form.localitate,
          numeParinte: form.numeParinte,
          transport: form.transport,
          data: new Date().toLocaleDateString('ro-RO')
        })
      });
      setSubmitted(true);
    } catch {
      alert('Eroare la trimitere. Verificați conexiunea și încercați din nou.');
    }
    setLoading(false);
  }

  async function deleteReg(id) {
    if (!window.confirm('Ștergi această înregistrare?')) return;
    await fetch(`${API}/api/inscrieri/${id}`, { method: 'DELETE' });
    setRegs(r => r.filter(x => x.id !== id));
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.h1}>Tabăra Bucuriei — Junior 2026</div>
          <div style={styles.hsub}>29 iunie – 4 iulie · Briheni</div>
        </div>
        <div style={styles.successCard}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#085041', marginBottom: 8 }}>
            Înregistrare confirmată!
          </h2>
          <p style={{ fontSize: 14, color: '#0F6E56', lineHeight: 1.6, marginBottom: 20 }}>
            <strong>{form.numecopil}</strong> a fost înscris cu succes.<br />
            Contactați <strong>Blaj Andrei</strong> la <strong>0773703684</strong><br />
            pentru achitarea avansului de <strong>100 RON</strong>.
          </p>
          <button style={styles.btnSubmit(false)} onClick={() => { setForm({ ...emptyForm }); setSubmitted(false); }}>
            Înregistrare nouă
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.h1}>🌞 Tabăra Bucuriei — Junior 2026</div>
        <div style={styles.hsub}>29 iunie – 4 iulie · Briheni · Vârste: 10–14 ani (cls. 3–8)</div>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tab(view === 'form')} onClick={() => setView('form')}>
          ✏️ Înregistrare
        </button>
        <button style={styles.tab(view === 'admin')} onClick={() => setView('admin')}>
          📋 Participanți
        </button>
      </div>

      {view === 'form' && (
        <>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Date copil</div>
            <div style={styles.field}>
              <label style={styles.label}>Nume și prenume copil *</label>
              <input style={errors.numecopil ? styles.inputErr : styles.input}
                value={form.numecopil} onChange={e => set('numecopil', e.target.value)}
                placeholder="ex: Popescu Maria" />
              {errors.numecopil && <div style={styles.error}>{errors.numecopil}</div>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Anul nașterii *</label>
              <input style={errors.an ? styles.inputErr : styles.input}
                type="number" value={form.an} onChange={e => set('an', e.target.value)}
                placeholder="ex: 2013" min="2010" max="2016" />
              {errors.an && <div style={styles.error}>{errors.an}</div>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Localitatea *</label>
              <input style={errors.localitate ? styles.inputErr : styles.input}
                value={form.localitate} onChange={e => set('localitate', e.target.value)}
                placeholder="ex: Cluj-Napoca" />
              {errors.localitate && <div style={styles.error}>{errors.localitate}</div>}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Date părinte</div>
            <div style={styles.field}>
              <label style={styles.label}>Nume și prenume părinte *</label>
              <input style={errors.numeParinte ? styles.inputErr : styles.input}
                value={form.numeParinte} onChange={e => set('numeParinte', e.target.value)}
                placeholder="ex: Popescu Ioan" />
              {errors.numeParinte && <div style={styles.error}>{errors.numeParinte}</div>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Transport *</label>
              <div style={styles.radioOpt(form.transport === 'personal')} onClick={() => set('transport', 'personal')}>
                <input type="radio" readOnly checked={form.transport === 'personal'} style={{ marginTop: 2, accentColor: '#1D9E75' }} />
                <span>Personal — mă voi ocupa eu de transportul copilului</span>
              </div>
              <div style={styles.radioOpt(form.transport === 'tabara')} onClick={() => set('transport', 'tabara')}>
                <input type="radio" readOnly checked={form.transport === 'tabara'} style={{ marginTop: 2, accentColor: '#1D9E75' }} />
                <span>Cu ajutorul taberei — voi contacta tabăra pentru transport</span>
              </div>
              {errors.transport && <div style={styles.error}>{errors.transport}</div>}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.infoBox}>
              <strong>Acord părinte:</strong> Necesită completare înainte de confirmare.<br />
              <a href="https://drive.google.com/file/d/1OGvpkZ1eFC0jnK-KttTOCd0IlAWu1/view"
                target="_blank" rel="noreferrer" style={styles.link}>
                📄 Descarcă acordul părintelui
              </a>
              {' '}sau sunați la <strong>0773703684</strong>
            </div>
            <div style={styles.agreeBox(form.acord)} onClick={() => set('acord', !form.acord)}>
              <input type="checkbox" readOnly checked={form.acord} style={{ marginTop: 2, accentColor: '#1D9E75' }} />
              <span>Am citit și completat acordul părintelui / tutorelui *</span>
            </div>
            {errors.acord && <div style={styles.error}>{errors.acord}</div>}

            <div style={{ marginTop: 14 }}>
              <div style={styles.infoBox}>
                <strong>Avans 100 RON</strong> — după completarea acordului sunați la <strong>0773703684</strong> (Blaj Andrei).
                Avansul este <strong>nerambursabil</strong>.
              </div>
              <div style={styles.agreeBox(form.plata)} onClick={() => set('plata', !form.plata)}>
                <input type="checkbox" readOnly checked={form.plata} style={{ marginTop: 2, accentColor: '#1D9E75' }} />
                <span>Am înțeles condițiile de plată a avansului *</span>
              </div>
              {errors.plata && <div style={styles.error}>{errors.plata}</div>}
            </div>
          </div>

          <button style={styles.btnSubmit(loading)} onClick={submit} disabled={loading}>
            {loading ? 'Se trimite...' : '📨 Trimite înregistrarea'}
          </button>
        </>
      )}

      {view === 'admin' && !adminUnlocked && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Panou administrare</div>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>
            Introduceți parola pentru a vedea lista participanților.
          </p>
          <input style={styles.input} type="password" placeholder="Parolă administrator"
            value={adminPass} onChange={e => setAdminPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (adminPass === ADMIN_PASSWORD ? setAdminUnlocked(true) : alert('Parolă incorectă'))}
          />
          <button style={{ ...styles.btnSubmit(false), marginTop: 12 }}
            onClick={() => adminPass === ADMIN_PASSWORD ? setAdminUnlocked(true) : alert('Parolă incorectă')}>
            Intră
          </button>
        </div>
      )}

      {view === 'admin' && adminUnlocked && (
        <>
          <div style={styles.statGrid}>
            <div style={styles.stat}>
              <div style={styles.statVal}>{regs.length}</div>
              <div style={styles.statLbl}>Total înscriși</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statVal}>{regs.filter(r => r.transport === 'personal').length}</div>
              <div style={styles.statLbl}>Transport propriu</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statVal}>{regs.filter(r => r.transport === 'tabara').length}</div>
              <div style={styles.statLbl}>Transport tabără</div>
            </div>
          </div>

          {regs.length === 0 ? (
            <div style={styles.empty}>Nu există înregistrări încă.</div>
          ) : regs.map(r => (
            <div key={r.id} style={styles.regItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={styles.regName}>
                    {r.numecopil}
                    <span style={styles.badge(r.transport)}>
                      {r.transport === 'personal' ? 'transport propriu' : 'transport tabără'}
                    </span>
                  </div>
                  <div style={styles.regMeta}>Născ. {r.an} · {r.localitate}</div>
                  <div style={styles.regMeta}>Părinte: {r.numeParinte} · {r.data}</div>
                </div>
                <button style={styles.btnDel} onClick={() => deleteReg(r.id)} title="Șterge">🗑</button>
              </div>
            </div>
          ))}

          <button style={{ ...styles.btnSubmit(false), background: '#888', marginTop: 8 }}
            onClick={() => { setAdminUnlocked(false); setAdminPass(''); }}>
            Deconectare
          </button>
        </>
      )}
    </div>
  );
}

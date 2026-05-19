import React, { useState, useEffect, useRef } from 'react';

const API = process.env.REACT_APP_API_URL || '';
const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASS || 'tabara2026';

const css = String.raw;

const globalStyle = css`
  .page { max-width: 580px; margin: 0 auto; padding: 32px 20px 80px; }

  .hero {
    background: var(--green);
    border-radius: 24px;
    padding: 40px 36px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
  }
  .hero::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 20px;
    width: 140px; height: 140px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }
  .hero-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--green-muted);
    margin-bottom: 10px;
  }
  .hero h1 {
    font-family: 'Fraunces', serif;
    font-size: 36px;
    font-weight: 300;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 12px;
  }
  .hero h1 em { font-style: italic; color: var(--green-muted); }
  .hero-meta {
    display: flex; gap: 16px; flex-wrap: wrap;
    font-size: 13px; color: rgba(255,255,255,0.65);
  }
  .hero-meta span { display: flex; align-items: center; gap: 5px; }

  .tabs {
    display: flex;
    background: var(--cream-dark);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 28px;
    gap: 4px;
  }
  .tab-btn {
    flex: 1; padding: 9px 12px;
    font-size: 13px; font-weight: 500;
    border: none; border-radius: 9px;
    cursor: pointer; transition: all 0.2s;
    background: transparent; color: var(--ink-muted);
  }
  .tab-btn.active {
    background: var(--white);
    color: var(--ink);
    box-shadow: 0 1px 8px rgba(28,28,26,0.1);
  }

  .section-label {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-muted); margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px;
    background: var(--cream-dark);
  }

  .card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 16px;
    box-shadow: var(--shadow);
    animation: fadeUp 0.4s ease forwards;
  }

  .field { margin-bottom: 18px; }
  .field:last-child { margin-bottom: 0; }
  .field label {
    display: block; font-size: 13px; font-weight: 500;
    color: var(--ink-soft); margin-bottom: 7px;
  }
  .field input {
    width: 100%; padding: 11px 14px;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    border: 1.5px solid var(--cream-dark);
    border-radius: var(--radius-sm);
    background: var(--cream);
    color: var(--ink);
    transition: all 0.2s; outline: none;
  }
  .field input:focus {
    border-color: var(--green-light);
    background: var(--white);
    box-shadow: 0 0 0 4px rgba(45,148,103,0.1);
  }
  .field input.err { border-color: var(--red); background: var(--red-pale); }
  .field-error { font-size: 12px; color: var(--red); margin-top: 5px; }

  .radio-group { display: flex; flex-direction: column; gap: 10px; }
  .radio-opt {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 16px;
    border: 1.5px solid var(--cream-dark);
    border-radius: var(--radius-sm);
    cursor: pointer; transition: all 0.2s;
    background: var(--cream);
  }
  .radio-opt:hover { border-color: var(--green-muted); }
  .radio-opt.selected {
    border-color: var(--green-light);
    background: var(--green-pale);
  }
  .radio-dot {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid var(--ink-muted);
    flex-shrink: 0; margin-top: 1px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .radio-opt.selected .radio-dot {
    border-color: var(--green-light);
    background: var(--green-light);
  }
  .radio-opt.selected .radio-dot::after {
    content: ''; width: 6px; height: 6px;
    border-radius: 50%; background: white;
  }
  .radio-text { font-size: 13px; color: var(--ink-soft); line-height: 1.5; }
  .radio-text strong { display: block; color: var(--ink); font-weight: 500; margin-bottom: 2px; }

  .info-banner {
    background: var(--amber-pale);
    border: 1px solid #fcd34d;
    border-radius: var(--radius-sm);
    padding: 14px 16px;
    font-size: 13px; color: var(--amber);
    line-height: 1.6; margin-bottom: 16px;
  }
  .info-banner a { color: var(--green); font-weight: 500; }

  .checkbox-opt {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 16px;
    border: 1.5px solid var(--cream-dark);
    border-radius: var(--radius-sm);
    cursor: pointer; transition: all 0.2s;
    font-size: 13px; color: var(--ink-soft);
    background: var(--cream); margin-bottom: 10px;
  }
  .checkbox-opt:hover { border-color: var(--green-muted); }
  .checkbox-opt.checked {
    border-color: var(--green-light);
    background: var(--green-pale);
    color: var(--green);
  }
  .checkbox-box {
    width: 18px; height: 18px; border-radius: 5px;
    border: 2px solid var(--ink-muted);
    flex-shrink: 0; margin-top: 1px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; font-size: 11px; color: white;
  }
  .checkbox-opt.checked .checkbox-box {
    background: var(--green-light); border-color: var(--green-light);
  }

  .btn-submit {
    width: 100%; padding: 15px;
    background: var(--green);
    color: white; border: none;
    border-radius: var(--radius-sm);
    font-size: 15px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.2s;
    margin-top: 8px; letter-spacing: 0.01em;
  }
  .btn-submit:hover:not(:disabled) { background: var(--green-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(26,107,74,0.3); }
  .btn-submit:active:not(:disabled) { transform: translateY(0); }
  .btn-submit:disabled { background: var(--green-muted); cursor: not-allowed; }

  .success-wrap {
    text-align: center; padding: 48px 24px;
    animation: fadeUp 0.5s ease;
  }
  .success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--green-pale);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; font-size: 32px;
  }
  .success-wrap h2 {
    font-family: 'Fraunces', serif;
    font-size: 28px; font-weight: 300;
    color: var(--ink); margin-bottom: 12px;
  }
  .success-wrap p { font-size: 14px; color: var(--ink-soft); line-height: 1.7; margin-bottom: 6px; }
  .success-highlight {
    background: var(--green-pale); border-radius: var(--radius-sm);
    padding: 14px 18px; margin: 20px 0;
    font-size: 13px; color: var(--green);
  }

  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 12px; margin-bottom: 24px;
  }
  .stat-card {
    background: var(--white); border-radius: var(--radius-sm);
    padding: 16px; text-align: center;
    box-shadow: var(--shadow);
  }
  .stat-num {
    font-family: 'Fraunces', serif;
    font-size: 32px; font-weight: 300;
    color: var(--ink); line-height: 1;
    margin-bottom: 4px;
  }
  .stat-lbl { font-size: 11px; color: var(--ink-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }

  .reg-card {
    background: var(--white); border-radius: var(--radius-sm);
    padding: 16px 18px; margin-bottom: 10px;
    box-shadow: var(--shadow);
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px;
    transition: box-shadow 0.2s;
    animation: fadeUp 0.3s ease;
  }
  .reg-card:hover { box-shadow: var(--shadow-lg); }
  .reg-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--green-pale);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Fraunces', serif; font-size: 16px;
    color: var(--green); flex-shrink: 0; font-weight: 600;
  }
  .reg-info { flex: 1; min-width: 0; }
  .reg-name { font-weight: 500; font-size: 14px; color: var(--ink); margin-bottom: 3px; }
  .reg-meta { font-size: 12px; color: var(--ink-muted); line-height: 1.6; }
  .badge {
    display: inline-flex; align-items: center;
    font-size: 11px; font-weight: 500;
    padding: 3px 9px; border-radius: 20px;
    margin-left: 6px; vertical-align: middle;
  }
  .badge-green { background: var(--green-pale); color: var(--green); }
  .badge-blue { background: #e0effe; color: #1d4ed8; }
  .btn-del {
    background: transparent; border: none;
    cursor: pointer; color: var(--ink-muted);
    padding: 6px; border-radius: 8px;
    transition: all 0.2s; font-size: 16px; line-height: 1;
  }
  .btn-del:hover { color: var(--red); background: var(--red-pale); }

  .admin-lock {
    text-align: center; padding: 40px 24px;
  }
  .admin-lock .lock-icon {
    font-size: 40px; margin-bottom: 16px;
  }
  .admin-lock h3 {
    font-family: 'Fraunces', serif;
    font-size: 22px; font-weight: 300;
    margin-bottom: 8px; color: var(--ink);
  }
  .admin-lock p { font-size: 13px; color: var(--ink-muted); margin-bottom: 20px; }

  .empty-state {
    text-align: center; padding: 40px 24px;
    color: var(--ink-muted); font-size: 14px;
  }
  .empty-state div { font-size: 36px; margin-bottom: 12px; }

  .phone-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--green-pale); color: var(--green);
    border-radius: 20px; padding: 4px 12px;
    font-size: 13px; font-weight: 500; margin: 4px 2px;
  }
`;

const emptyForm = {
  numecopil: '', an: '', localitate: '',
  numeParinte: '', transport: '', acord: false, plata: false
};

function StyleTag() {
  return <style>{globalStyle}</style>;
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

export default function App() {
  const [view, setView] = useState('form');
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regs, setRegs] = useState([]);
  const [adminPass, setAdminPass] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminErr, setAdminErr] = useState(false);

  useEffect(() => {
    if (view === 'admin' && adminUnlocked) fetchRegs();
  }, [view, adminUnlocked]);

  async function fetchRegs() {
    try {
      const r = await fetch(`${API}/api/inscrieri`);
      setRegs(await r.json());
    } catch { setRegs([]); }
  }

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.numecopil.trim()) e.numecopil = 'Numele copilului este obligatoriu';
    const an = parseInt(form.an);
    if (!form.an || isNaN(an) || an < 2010 || an > 2016) e.an = 'Introduceți un an între 2010 și 2016';
    if (!form.localitate.trim()) e.localitate = 'Localitatea este obligatorie';
    if (!form.numeParinte.trim()) e.numeParinte = 'Numele părintelui este obligatoriu';
    if (!form.transport) e.transport = 'Selectați modalitatea de transport';
    if (!form.acord) e.acord = 'Acordul părintelui este obligatoriu';
    if (!form.plata) e.plata = 'Confirmați condițiile de plată';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/inscrieri`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numecopil: form.numecopil, an: parseInt(form.an),
          localitate: form.localitate, numeParinte: form.numeParinte,
          transport: form.transport,
          data: new Date().toLocaleDateString('ro-RO')
        })
      });
      if (!r.ok) throw new Error();
      setSubmitted(true);
    } catch {
      alert('Eroare la trimitere. Verificați conexiunea și încercați din nou.');
    }
    setLoading(false);
  }

  async function deleteReg(id) {
    if (!window.confirm('Șterg această înregistrare?')) return;
    await fetch(`${API}/api/inscrieri/${id}`, { method: 'DELETE' });
    setRegs(r => r.filter(x => x.id !== id));
  }

  function unlockAdmin() {
    if (adminPass === ADMIN_PASS) {
      setAdminUnlocked(true); setAdminErr(false);
    } else {
      setAdminErr(true);
    }
  }

  return (
    <>
      <StyleTag />
      <div className="page">
        <div className="hero animate-up">
          <div className="hero-eyebrow">Briheni · 2026</div>
          <h1>Tabăra <em>Bucuriei</em><br />Junior</h1>
          <div className="hero-meta">
            <span>📅 29 iunie – 4 iulie</span>
            <span>👦 Clasele 3–8</span>
            <span>🏕️ Briheni</span>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab-btn ${view === 'form' ? 'active' : ''}`} onClick={() => setView('form')}>
            ✏️ Înscriere
          </button>
          <button className={`tab-btn ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>
            📋 Participanți {adminUnlocked && regs.length > 0 ? `(${regs.length})` : ''}
          </button>
        </div>

        {view === 'form' && !submitted && (
          <>
            <div className="section-label">Date copil</div>
            <div className="card">
              <div className="field">
                <label>Nume și prenume copil *</label>
                <input className={errors.numecopil ? 'err' : ''} type="text"
                  value={form.numecopil} onChange={e => set('numecopil', e.target.value)}
                  placeholder="ex: Popescu Maria" />
                {errors.numecopil && <div className="field-error">{errors.numecopil}</div>}
              </div>
              <div className="field">
                <label>Anul nașterii *</label>
                <input className={errors.an ? 'err' : ''} type="number"
                  value={form.an} onChange={e => set('an', e.target.value)}
                  placeholder="ex: 2013" min="2010" max="2016" />
                {errors.an && <div className="field-error">{errors.an}</div>}
              </div>
              <div className="field">
                <label>Localitatea *</label>
                <input className={errors.localitate ? 'err' : ''} type="text"
                  value={form.localitate} onChange={e => set('localitate', e.target.value)}
                  placeholder="ex: Cluj-Napoca" />
                {errors.localitate && <div className="field-error">{errors.localitate}</div>}
              </div>
            </div>

            <div className="section-label">Date părinte</div>
            <div className="card">
              <div className="field">
                <label>Nume și prenume părinte *</label>
                <input className={errors.numeParinte ? 'err' : ''} type="text"
                  value={form.numeParinte} onChange={e => set('numeParinte', e.target.value)}
                  placeholder="ex: Popescu Ioan" />
                {errors.numeParinte && <div className="field-error">{errors.numeParinte}</div>}
              </div>
              <div className="field">
                <label>Modalitate transport *</label>
                <div className="radio-group">
                  {[
                    { val: 'personal', title: 'Transport personal', desc: 'Mă voi ocupa eu de transportul copilului la orele indicate' },
                    { val: 'tabara', title: 'Cu ajutorul taberei', desc: 'Voi contacta tabăra telefonic pentru a asigura transport' }
                  ].map(opt => (
                    <div key={opt.val} className={`radio-opt ${form.transport === opt.val ? 'selected' : ''}`}
                      onClick={() => set('transport', opt.val)}>
                      <div className="radio-dot" />
                      <div className="radio-text">
                        <strong>{opt.title}</strong>
                        {opt.desc}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.transport && <div className="field-error" style={{marginTop:8}}>{errors.transport}</div>}
              </div>
            </div>

            <div className="section-label">Confirmare</div>
            <div className="card">
              <div className="info-banner">
                📄 <strong>Acord părinte:</strong> Descarcă și completează acordul înainte de înscriere.<br />
                <a href="https://drive.google.com/file/d/1OGvpkZ1eFC0jnK-KttTOCd0IlAWu1/view" target="_blank" rel="noreferrer">
                  → Descarcă acordul părintelui
                </a>
                {' '}sau contactați{' '}
                <span className="phone-chip">📞 0773703684</span>
              </div>

              <div className={`checkbox-opt ${form.acord ? 'checked' : ''}`} onClick={() => set('acord', !form.acord)}>
                <div className="checkbox-box">{form.acord ? '✓' : ''}</div>
                <span>Am citit și completat acordul părintelui / tutorelui *</span>
              </div>
              {errors.acord && <div className="field-error">{errors.acord}</div>}

              <div style={{ marginTop: 16 }}>
                <div className="info-banner">
                  💰 <strong>Avans 100 RON</strong> — după completarea acordului sunați la <strong>Blaj Andrei</strong>{' '}
                  <span className="phone-chip">📞 0773703684</span><br />
                  Avansul este <strong>nerambursabil</strong> în cazul anulării.
                </div>
                <div className={`checkbox-opt ${form.plata ? 'checked' : ''}`} onClick={() => set('plata', !form.plata)}>
                  <div className="checkbox-box">{form.plata ? '✓' : ''}</div>
                  <span>Am înțeles și sunt de acord cu condițiile de plată *</span>
                </div>
                {errors.plata && <div className="field-error">{errors.plata}</div>}
              </div>
            </div>

            <button className="btn-submit" onClick={submit} disabled={loading}>
              {loading ? 'Se trimite...' : 'Trimite înregistrarea →'}
            </button>
          </>
        )}

        {view === 'form' && submitted && (
          <div className="card success-wrap">
            <div className="success-icon">🎉</div>
            <h2>Înregistrare confirmată!</h2>
            <p><strong>{form.numecopil}</strong> a fost înscris cu succes la Tabăra Bucuriei Junior 2026.</p>
            <div className="success-highlight">
              Pasul următor: Contactați <strong>Blaj Andrei</strong> la{' '}
              <span className="phone-chip">📞 0773703684</span>{' '}
              pentru achitarea avansului de <strong>100 RON</strong> și confirmarea locului.
            </div>
            <p style={{fontSize:13, color:'var(--ink-muted)'}}>
              Sâmbătă, 4 iulie ora 10:00 — program pentru părinți în tabără.
            </p>
            <button className="btn-submit" style={{marginTop:24}}
              onClick={() => { setForm({...emptyForm}); setSubmitted(false); }}>
              Înregistrare nouă
            </button>
          </div>
        )}

        {view === 'admin' && !adminUnlocked && (
          <div className="card admin-lock animate-in">
            <div className="lock-icon">🔒</div>
            <h3>Panou administrare</h3>
            <p>Introduceți parola pentru a accesa lista participanților.</p>
            <div className="field">
              <input type="password" placeholder="Parolă administrator"
                value={adminPass}
                onChange={e => { setAdminPass(e.target.value); setAdminErr(false); }}
                onKeyDown={e => e.key === 'Enter' && unlockAdmin()}
                style={adminErr ? { borderColor: 'var(--red)', background: 'var(--red-pale)' } : {}}
              />
              {adminErr && <div className="field-error">Parolă incorectă</div>}
            </div>
            <button className="btn-submit" onClick={unlockAdmin}>Intră</button>
          </div>
        )}

        {view === 'admin' && adminUnlocked && (
          <div className="animate-in">
            <div className="stats-row">
              {[
                { num: regs.length, lbl: 'Total înscriși' },
                { num: regs.filter(r => r.transport === 'personal').length, lbl: 'Transport propriu' },
                { num: regs.filter(r => r.transport === 'tabara').length, lbl: 'Transport tabără' }
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>

            <div className="section-label">Lista participanților</div>

            {regs.length === 0 ? (
              <div className="card empty-state">
                <div>👦</div>
                Nu există înregistrări încă.
              </div>
            ) : regs.map(r => (
              <div key={r.id} className="reg-card">
                <div className="reg-avatar">{initials(r.numecopil)}</div>
                <div className="reg-info">
                  <div className="reg-name">
                    {r.numecopil}
                    <span className={`badge ${r.transport === 'personal' ? 'badge-green' : 'badge-blue'}`}>
                      {r.transport === 'personal' ? 'propriu' : 'tabară'}
                    </span>
                  </div>
                  <div className="reg-meta">
                    Născ. {r.an} · {r.localitate}<br />
                    Părinte: {r.numeParinte} · {r.data}
                  </div>
                </div>
                <button className="btn-del" onClick={() => deleteReg(r.id)} title="Șterge">🗑</button>
              </div>
            ))}

            <button className="btn-submit" style={{ background: 'var(--ink-soft)', marginTop: 16 }}
              onClick={() => { setAdminUnlocked(false); setAdminPass(''); }}>
              Deconectare
            </button>
          </div>
        )}
      </div>
    </>
  );
}

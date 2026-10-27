(() => {
"use strict";
const LOGO = document.getElementById('logoImg').src;
const STAMP = document.getElementById('stampImg').src;

/* ---------- language ---------- */
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
let LANG = lsGet('lyc-lang', 'en') === 'fr' ? 'fr' : 'en';
const EN = () => LANG === 'en';
const T = (fr, en) => EN() ? en : fr;
const LOC = () => EN() ? 'en-GB' : 'fr-FR';
const pl = (n, fr1, frN, en1, enN) => `${n} ${n > 1 || (EN() && n === 0) ? T(frN, enN) : T(fr1, en1)}`;
function setLang(l) { LANG = l; lsSet('lyc-lang', l); document.documentElement.lang = l; render(); }
document.documentElement.lang = LANG;

const SCHOOL = {
  name: 'Les Yeux du Coeur', sub: 'Bilingual Nursery & Primary School', addr: 'Isokolo – Bota Land – Limbe II',
  motto: 'The Best Is Our Goal', motto2: "Le Meilleur C'est Notre But", tel: '678 92 11 85 / 699 94 36 00',
  email: 'lyclimbe@yahoo.com', auth: '119/A/5011/0/MINEDUB/SG/DESEP/SDAAP of 01 July 2015'
};
/* School brochure 2026-2027 */
const START_Y = (() => { const d = new Date(), y = d.getFullYear(); return d.getMonth() >= 8 ? y : y - 1; })();
const BROCHURE_FEES = {
  nursery: {reg: 10000, inst1: 40000, inst2: 15000, exam: 0, art: 5000},
  primary: {reg: 10000, inst1: 40000, inst2: 10000, exam: 0, art: 5000},
  c6: {reg: 10000, inst1: 40000, inst2: 10000, exam: 15000, art: 5000}
};
const brochureFee = lv => lv === 'C6' ? BROCHURE_FEES.c6 : ['PN', 'N1', 'N2'].includes(lv) ? BROCHURE_FEES.nursery : BROCHURE_FEES.primary;
const PUPIL_HOURS = lv => lv === 'C6' ? ['07:30', '17:00'] : ['PN', 'N1', 'N2'].includes(lv) ? ['07:30', '13:00'] : ['07:30', '14:30'];
const FEE_PARTS = [['reg', 'Inscription', 'Registration'], ['inst1', 'Scolarité 1re tranche', 'Tuition 1st inst.'], ['inst2', 'Scolarité 2e tranche', 'Tuition 2nd inst.'], ['exam', 'Examen', 'Examination'], ['art', 'Articles', 'Articles']];
const LEVELS = [
  {id:'PN', name:'Pre-Nursery', sec:'nursery'}, {id:'N1', name:'Nursery 1', sec:'nursery'}, {id:'N2', name:'Nursery 2', sec:'nursery'},
  {id:'C1', name:'Class 1', sec:'primary'}, {id:'C2', name:'Class 2', sec:'primary'}, {id:'C3', name:'Class 3', sec:'primary'},
  {id:'C4', name:'Class 4', sec:'primary'}, {id:'C5', name:'Class 5', sec:'primary'}, {id:'C6', name:'Class 6', sec:'primary'}
];
const LV = Object.fromEntries(LEVELS.map(l => [l.id, l]));
const TERMS = {1:'First Term', 2:'Second Term', 3:'Third Term'};
const MARKS = () => ({P: T('Présent', 'Present'), A: T('Absent', 'Absent'), R: T('En retard', 'Late'), J: T('Absence justifiée', 'Excused absence')});
const OBJECTS = [
  {k:'reg', fr:"Frais d'inscription", en:'Registration fee', fees:true},
  {k:'inst1', fr:'Scolarité – 1re tranche', en:'Tuition – 1st installment', fees:true},
  {k:'inst2', fr:'Scolarité – 2e tranche', en:'Tuition – 2nd installment', fees:true},
  {k:'exam', fr:'Frais d’examen (Class 6)', en:'Examination fee (Class 6)', fees:true},
  {k:'art', fr:'Articles', en:'Articles', fees:true},
  {k:'pack1', fr:'1re tranche complète', en:'1st installment (all items)', fees:true},
  {k:'sport', fr:'Tenue de sport', en:'Sportswear', price: 3500},
  {k:'t1', fr:'Scolarité – First Term', en:'School fees – First Term', fees:true, old:true},
  {k:'t2', fr:'Scolarité – Second Term', en:'School fees – Second Term', fees:true, old:true},
  {k:'t3', fr:'Scolarité – Third Term', en:'School fees – Third Term', fees:true, old:true},
  {k:'uni', fr:'Uniforme', en:'Uniform'},
  {k:'books', fr:'Fournitures et livres', en:'Books and stationery'},
  {k:'transport', fr:'Transport', en:'Transport'},
  {k:'canteen', fr:'Cantine', en:'Canteen'},
  {k:'other', fr:'Autre', en:'Other'}
];
const OBJ = Object.fromEntries(OBJECTS.map(o => [o.k, o]));
const objName = k => OBJ[k] ? (EN() ? OBJ[k].en : OBJ[k].fr) : '';
const METHODS_FR = {cash:'Espèces au guichet', om:'Orange Money', momo:'MTN Mobile Money', bank:'Virement bancaire'};
const METHODS_EN = {cash:'Cash', om:'Orange Money', momo:'MTN Mobile Money', bank:'Bank transfer'};
const METHODS = () => EN() ? METHODS_EN : METHODS_FR;
const REASONS = [['Maladie','Illness'],['Raison familiale','Family reasons'],['Voyage','Travel'],['Sans nouvelles','No news'],['Autre','Other']];
const DISC = [['Fratrie','Siblings'],['Enfant d’enseignant','Staff child'],['Bourse','Scholarship'],['Autre','Other']];
const reasonName = r => { const x = [...REASONS, ...DISC].find(p => p[0] === r); return x ? T(x[0], x[1]) : r; };

/* ---------- helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2, '0');
const isoDay = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today = () => isoDay(new Date());
const yearOf = ds => { const [y, m] = ds.split('-').map(Number); return m >= 9 ? `${y}-${y+1}` : `${y-1}-${y}`; };
const termOf = ds => { const m = Number(ds.split('-')[1]); return m >= 9 ? 1 : (m <= 3 ? 2 : 3); };
const YEAR = yearOf(today());
const money = n => (Math.round(Number(n) || 0)).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' FCFA';
const frDate = ds => { if (!ds) return ''; const [y,m,d] = ds.slice(0,10).split('-'); return `${d}/${m}/${y}`; };
const longDay = ds => { try { return new Date(ds + 'T12:00:00').toLocaleDateString(LOC(), {weekday:'long', day:'numeric', month:'long'}); } catch { return frDate(ds); } };
const nowISO = () => new Date().toISOString();
const timeAgo = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString(LOC(), {day:'numeric', month:'short'}) + ' · ' + d.toLocaleTimeString(LOC(), {hour:'2-digit', minute:'2-digit'}); };
const hhmm = iso => new Date(iso).toLocaleTimeString(LOC(), {hour:'2-digit', minute:'2-digit'});
const digits = s => String(s || '').replace(/\D/g, '').slice(-9);
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
function words(n) {
  n = Math.round(n);
  const a = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const t = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  const two = x => x < 20 ? a[x] : t[Math.floor(x/10)] + (x % 10 ? '-' + a[x % 10] : '');
  const three = x => { let s = ''; if (x >= 100) { s = a[Math.floor(x/100)] + ' hundred'; x %= 100; if (x) s += ' and '; } return s + (x ? two(x) : ''); };
  if (!n) return 'zero';
  const out = []; const m = Math.floor(n / 1e6), k = Math.floor(n / 1e3) % 1000, r = n % 1000;
  if (m) out.push(three(m) + ' million'); if (k) out.push(three(k) + ' thousand'); if (r) out.push(three(r));
  return out.join(' ');
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
let toastT;
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }

const ICON = {
  qr:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 12l3 3 5-6"/></svg>',
  money:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 10v4M18 10v4"/></svg>',
  msg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
  more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>',
  kids:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14.2c2.9.3 5 2.6 5 5.8"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></svg>',
  receipt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>',
  stats:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>'
};
const langBtn = () => `<button class="lang" data-a="lang" aria-label="${T('Changer de langue', 'Change language')}"><span ${EN() ? 'aria-current="true"' : ''}>EN</span><span ${!EN() ? 'aria-current="true"' : ''}>FR</span></button>`;

/* ---------- state ---------- */
const S = {
  db:null, userCap:null, me: lsGet('lyc-me', null) || (() => { const v = 'local-' + uid(); lsSet('lyc-me', v); return v; })(),
  canWrite:true, dbOk:null, profile: null,
  students:[], payments:[], messages:[], att:{}, stats:{}, config:{},
  staff:{}, users:[], loaded:{students:false, payments:false, messages:false, att:false, stats:false, config:false, staff:false, users:false},
  auth:null, user:null, authReady:false, setupNeeded:false, blocked:false, configMissing:false,
  view:null, filter: lsGet('lyc-filter', 'all'), apDate: today(), apLevel:null, draft:null, pendingRender:false, sheet:null
};
const cfg = () => S.config || {};
const teacherOf = lv => (cfg().teachers || {})[lv] || '';
const feesOf = lv => { const c = cfg(), f = c.feeModel === 2 && c.fees && c.fees[lv] ? c.fees[lv] : brochureFee(lv); return {reg: +f.reg || 0, inst1: +f.inst1 || 0, inst2: +f.inst2 || 0, exam: +f.exam || 0, art: +f.art || 0}; };
const due1 = () => cfg().due1 || `${START_Y}-10-10`;
const due2 = () => cfg().due2 || `${START_Y + 1}-01-10`;
const firstInst = f => f.reg + f.inst1 + f.exam + f.art;
const feesSet = () => true;
const activeStudents = () => S.students.filter(s => s.status !== 'left').sort((a,b) => a.name.localeCompare(b.name, 'fr'));
const byLevel = lv => activeStudents().filter(s => s.level === lv);
const student = id => S.students.find(s => s.id === id);
const ROLE_NAME = () => ({president: T('Président', 'Chairman'), vicepresident: T('Vice-président', 'Vice-chairman'), direction: T('Directrice', 'Head teacher'), assistant: T('Assistante directrice', 'Assistant head teacher'), teacher: T('Enseignant titulaire', 'Class teacher'), accountant: T('Comptable', 'Bursar'), secretary: T('Secrétaire', 'Secretary'), parent: T('Parent', 'Parent')});

function feeStatus(s) {
  const f = feesOf(s.level), d = today(), disc = +s.discount || 0;
  const total = Math.max(0, firstInst(f) + f.inst2 - disc);
  let due = f.reg + (d > due1() ? f.inst1 + f.exam + f.art : 0) + (d > due2() ? f.inst2 : 0);
  due = Math.max(0, Math.min(total, due - (d > due2() ? disc : 0)));
  const paid = S.payments.filter(p => p.studentId === s.id && !p.cancelled && OBJ[p.object]?.fees).reduce((a, p) => a + (+p.amount || 0), 0);
  return {total, due, paid, balance: Math.max(0, total - paid), late: Math.max(0, due - paid)};
}
function attCounts(sid, term) {
  const c = {P:0, A:0, R:0, J:0, days:0};
  for (const d of Object.values(S.att)) { if (term && termOf(d.date) !== term) continue; const m = d.marks?.[sid]; if (!m) continue; c[m]++; c.days++; }
  return c;
}
const attKey = (lv, ds) => `${YEAR}_${lv}_${ds}`;
/* stored automatic messages carry both languages: {title, body, en:{title, body}} */
const mTitle = m => EN() && m.en?.title ? m.en.title : m.title;
const mBody = m => EN() && m.en?.body ? m.en.body : m.body;

/* ---------- data ---------- */
/* ---------- Firebase ---------- */
const FB_CONFIG = window.LYC_FIREBASE_CONFIG || null;
const APP_URL = location.origin + location.pathname.replace(/index\.html$/, '');
const emailFor = (phone, v) => `${phone}.${v}@lyc-school.app`;
const genCode = () => { const a = new Uint32Array(1); (crypto || window.msCrypto).getRandomValues(a); return String(100000 + (a[0] % 900000)); };
const SUBS = [];
function stopSubs() { SUBS.splice(0).forEach(u => { try { u(); } catch {} }); }
function resetData() {
  S.students = []; S.payments = []; S.messages = []; S.att = {}; S.staff = {}; S.stats = {}; S.config = {}; S.users = [];
  Object.keys(S.loaded).forEach(k => S.loaded[k] = false); S.view = null; S.sheet = null; S.draft = null; S.parentLevelsKey = null;
}
const sortPay = a => a.sort((x, y) => (y.createdAt || '').localeCompare(x.createdAt || ''));
const sortMsg = a => a.sort((x, y) => (y.at || '').localeCompare(x.at || ''));
const docsOf = q => q.docs.map(d => ({id: d.id, ...d.data()}));
async function boot() {
  render();
  if (!window.firebase || !FB_CONFIG || !FB_CONFIG.apiKey || /COLLER|PASTE/.test(FB_CONFIG.apiKey)) { S.configMissing = true; S.authReady = true; render(); return; }
  firebase.initializeApp(FB_CONFIG);
  const db = firebase.firestore();
  try { await db.enablePersistence({synchronizeTabs: true}); } catch {}
  S.db = db; S.auth = firebase.auth();
  try { const m = await db.doc('meta/setup').get(); S.setupNeeded = !m.exists; } catch { S.setupNeeded = false; }
  S.auth.onAuthStateChanged(u => { if (!S.settingUp) loadProfile(u); });
}
async function loadProfile(u) {
  stopSubs(); resetData(); S.user = u; S.profile = null; S.blocked = false;
  if (!u) { S.authReady = true; S.dbOk = null; render(); return; }
  try { const d = await S.db.doc('users/' + u.uid).get(); const p = d.exists ? d.data() : null;
    if (!p || p.active === false) S.blocked = true; else { S.profile = p; S.me = u.uid; }
  } catch (e) { console.warn(e); S.blocked = true; }
  S.authReady = true; S.dbOk = true;
  if (S.profile) subscribe();
  render();
}
function subscribe() {
  const db = S.db, r = S.profile.role;
  const done = k => { S.loaded[k] = true; };
  const sub = (q, fn, key) => SUBS.push(q.onSnapshot(s => { fn(s); if (key) done(key); schedule(); }, e => { console.warn(key, e); if (key) done(key); schedule(); }));
  sub(db.doc('config/school'), s => S.config = s.exists ? s.data() : {}, 'config');
  if (r === 'parent') {
    const ph = S.profile.phone;
    sub(db.collection('students').where('phoneKey', '==', ph), q => { S.students = docsOf(q); subParentAtt(); }, 'students');
    sub(db.collection('payments').where('phoneKey', '==', ph), q => S.payments = sortPay(docsOf(q).filter(p => p.year === YEAR)), 'payments');
    const parts = {a: [], b: []}, got = {a: false, b: false};
    const merge = () => { S.messages = sortMsg([...parts.a, ...parts.b].filter(m => m.year === YEAR)); if (got.a && got.b) done('messages'); };
    sub(db.collection('messages').where('kind', '==', 'announce'), q => { parts.a = docsOf(q); got.a = true; merge(); });
    sub(db.collection('messages').where('phoneKey', '==', ph), q => { parts.b = docsOf(q); got.b = true; merge(); });
    ['stats', 'staff', 'users'].forEach(done);
    return;
  }
  sub(db.collection('students'), q => S.students = docsOf(q), 'students');
  if (isMgr(r) || r === 'accountant') { sub(db.collection('payments').where('year', '==', YEAR), q => S.payments = sortPay(docsOf(q)), 'payments'); } else done('payments');
  sub(db.collection('messages').where('year', '==', YEAR), q => S.messages = sortMsg(docsOf(q)), 'messages');
  sub(db.collection('attendance').where('year', '==', YEAR), q => { const o = {}; q.docs.forEach(d => o[d.id] = {id: d.id, ...d.data()}); S.att = o; }, 'att');
  sub(db.collection('staff').where('year', '==', YEAR), q => { const o = {}; q.docs.forEach(d => o[d.id] = {id: d.id, ...d.data()}); S.staff = o; }, 'staff');
  if (r === 'secretary') { sub(db.collection('users').where('role', '==', 'parent'), q => S.users = docsOf(q), 'users'); done('stats'); }
  else if (isMgr(r)) { sub(db.collection('stats'), q => { const o = {}; q.docs.forEach(d => o[d.id] = d.data()); S.stats = o; }, 'stats'); if (isAdmin(r)) sub(db.collection('users'), q => S.users = docsOf(q), 'users'); else done('users'); }
  else { done('stats'); done('users'); }
}
const parentAttSubs = [];
function subParentAtt() {
  const levels = [...new Set(S.students.filter(s => s.status !== 'left').map(s => s.level))].sort(), key = levels.join(',');
  if (key === S.parentLevelsKey) return; S.parentLevelsKey = key;
  parentAttSubs.splice(0).forEach(u => { try { u(); } catch {} });
  if (!levels.length) { S.att = {}; S.loaded.att = true; return; }
  const parts = {}; let n = 0;
  levels.forEach(lv => { const un = S.db.collection('attendance').where('level', '==', lv).onSnapshot(q => {
      if (!(lv in parts)) n++; parts[lv] = q.docs.map(d => ({id: d.id, ...d.data()})).filter(d => d.year === YEAR);
      const o = {}; Object.values(parts).flat().forEach(d => o[d.id] = d); S.att = o; if (n === levels.length) S.loaded.att = true; schedule();
    }, e => { console.warn(e); S.loaded.att = true; schedule(); });
    parentAttSubs.push(un); SUBS.push(un); });
}
async function write(fn, okMsg) {
  if (!S.db) { toast(T('Connexion aux données indisponible.', 'School data is not available.')); return false; }
  try {
    const pr = fn(S.db);
    if (!navigator.onLine) { pr.catch(e => console.warn(e)); toast((okMsg ? okMsg + ' · ' : '') + T('envoi au retour du réseau', 'will sync when back online')); return true; }
    await pr; if (okMsg) toast(okMsg); return true; }
  catch (e) {
    if (e?.code === 'permission-denied') { S.canWrite = false; toast(T("Vous n'avez pas le droit de modifier ces données.", 'You are not allowed to change this data.')); render(); }
    else if (e?.code === 'resource-exhausted') toast(T("Espace de stockage plein : supprimez d'anciennes données.", 'Storage is full: delete some old records.'));
    else toast(T('Enregistrement impossible pour le moment. Réessayez.', 'Could not save right now. Please try again.'));
    console.warn(e); return false;
  }
}
async function nextReceiptNo() {
  if (!navigator.onLine) return Number(String(Date.now()).slice(-6));
  const ref = S.db.doc('counters/receipts');
  return S.db.runTransaction(async tx => { const s = await tx.get(ref); const n = ((s.exists && +s.data().n) || 0) + 1; tx.set(ref, {n}); return n; });
}
const receiptLabel = n => `LYC-${YEAR.slice(2,4)}${YEAR.slice(7,9)}-${String(n).padStart(4,'0')}`;

/* ---------- rendering ---------- */
function busyInput() { const a = document.activeElement; return a && a.closest('#main, .sheet') && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName); }
function schedule() {
  if (S.sheet) { if (S.sheet.live) refreshSheet(); S.pendingRender = true; return; }
  if (busyInput()) { S.pendingRender = true; return; }
  render();
}
document.addEventListener('focusout', () => setTimeout(() => { if (S.pendingRender && !S.sheet && !busyInput()) { S.pendingRender = false; render(); } }, 50));

const ADMIN_ROLES = ['president', 'vicepresident'], MGR_ROLES = ['president', 'vicepresident', 'direction', 'assistant'];
const isAdmin = (r = S.profile?.role) => ADMIN_ROLES.includes(r);
const isMgr = (r = S.profile?.role) => MGR_ROLES.includes(r);
const withMgr = o => ({...o, president: o.direction, vicepresident: o.direction, assistant: o.direction});
const ROLE_TABS = () => withMgr({
  direction: [['home', T('Accueil', 'Home'), 'home'], ['appel', T('Présences', 'Attendance'), 'check'], ['frais', T('Frais', 'Fees'), 'money'], ['messages', T('Messages', 'Messages'), 'msg'], ['plus', T('Plus', 'More'), 'more']],
  teacher: [['appel', T('Appel', 'Roll call'), 'check'], ['eleves', T('Élèves', 'Pupils'), 'kids'], ['messages', T('Messages', 'Messages'), 'msg'], ['profil', T('Profil', 'Profile'), 'user']],
  accountant: [['encaisser', T('Encaisser', 'Collect'), 'money'], ['impayes', T('Impayés', 'Arrears'), 'alert'], ['recus', T('Reçus', 'Receipts'), 'receipt'], ['profil', T('Profil', 'Profile'), 'user']],
  secretary: [['pointage', T('Pointage', 'Sign-in'), 'clock'], ['eleves', T('Inscriptions', 'Enrolment'), 'kids'], ['profil', T('Profil', 'Profile'), 'user']],
  parent: [['enfant', T('Mon enfant', 'My child'), 'kids'], ['messages', T('Messages', 'Messages'), 'msg'], ['ecole', T('L’école', 'School'), 'home'], ['profil', T('Profil', 'Profile'), 'user']]
});

function render() {
  const app = document.getElementById('app');
  const p = S.profile;
  if (!p) { app.innerHTML = viewGate(); return; }
  const tabs = ROLE_TABS()[p.role];
  const extra = isMgr(p.role) ? ['eleves','stats','profil','encaisser','impayes','recus','personnel','ecole', ...(isAdmin(p.role) ? ['reglages','acces'] : [])] : ['profil','eleves','ecole'];
  if (!S.view || !tabs.some(t => t[0] === S.view) && !extra.includes(S.view)) S.view = tabs[0][0];
  const sub = p.role === 'teacher' ? `${LV[p.level]?.name || ''} · ${esc(p.name || '')}`
    : p.role === 'parent' ? `${T('Parent', 'Parent')} · ${esc(parentKids()[0]?.parentName || p.phone || '')}` : `${ROLE_NAME()[p.role]} · ${esc(p.name || '')}`;
  const unread = p.role === 'parent' ? parentUnread() : 0;
  const scrollY = window.scrollY;
  app.innerHTML = `
  <header class="top"><div class="wrap">
    <div class="logo-tile"><img src="${LOGO}" alt="Logo Les Yeux du Coeur"></div>
    <div class="who"><b>${SCHOOL.name}</b><span>${sub} · <span class="num">${YEAR}</span></span></div>
    ${p.role !== 'parent' ? `<button class="iconbtn" data-a="scan" aria-label="${T('Vérifier une carte d’élève', 'Check a pupil’s card')}" title="${T('Vérifier une carte', 'Check a card')}">${ICON.qr}</button>` : ''}
    ${langBtn()}
  </div></header>
  <main id="main"><div class="wrap">
    ${!navigator.onLine ? `<div class="banner warn small">${T('Hors connexion : vos saisies seront envoyées au retour du réseau.', 'Offline: your entries will be sent when the network is back.')}</div>` : ''}
    ${!S.canWrite ? `<div class="banner warn">${T('Vous avez un accès en lecture seule : vous pouvez consulter mais pas enregistrer.', 'You have read-only access: you can look but not save.')}</div>` : ''}
    ${viewBody()}
  </div></main>
  <nav class="tabs" aria-label="${T('Navigation', 'Navigation')}"><div class="in">
    ${tabs.map(([id, label, ic]) => `<button data-a="tab" data-v="${id}" ${S.view === id || (id === 'plus' && ['eleves','stats','reglages','profil','impayes','recus','personnel','ecole','acces'].includes(S.view)) || (id === 'frais' && S.view === 'encaisser') ? 'aria-current="page"' : ''}><span class="dot" ${id === 'messages' && unread ? `data-n="${unread}"` : ''}>${ICON[ic]}</span>${label}</button>`).join('')}
  </div></nav>
  ${S.sheet ? sheetHTML() : ''}`;
  window.scrollTo(0, scrollY);
  checkPendingVerify();
}
const allLoaded = () => S.dbOk !== true || Object.values(S.loaded).every(Boolean);
function viewBody() {
  if (S.dbOk === null || (S.dbOk && !allLoaded())) return `<div class="panel empty"><b>${T('Chargement des données…', 'Loading school data…')}</b></div>`;
  const map = {home:viewHome, appel:viewAppel, frais:viewFrais, messages:viewMessages, plus:viewPlus, eleves:viewEleves, stats:viewStats,
    reglages:viewReglages, profil:viewProfil, ecole:viewEcole, personnel:viewPersonnel, acces:viewAcces, pointage:viewPointage, encaisser:viewEncaisser, impayes:viewImpayes, recus:viewRecus, enfant:viewEnfant};
  return (map[S.view] || viewHome)();
}

/* ----- welcome ----- */
function heroBlock() {
  return `<div style="display:flex;justify-content:flex-end">${langBtn()}</div>
    <div class="hero">
      <div class="logo-tile"><img src="${LOGO}" alt="Logo Les Yeux du Coeur"></div>
      <h1>${SCHOOL.name}</h1>
      <div class="small muted">${SCHOOL.sub} · ${SCHOOL.addr}</div>
      <div class="motto">${SCHOOL.motto} · ${SCHOOL.motto2}</div>
    </div>`;
}
function viewGate() {
  let body;
  if (S.configMissing) body = `<div class="banner red">${T('L’application n’est pas encore reliée à la base de données de l’école. Renseignez le fichier firebase-config.js en suivant le guide d’installation.', 'The app is not yet linked to the school database. Fill in firebase-config.js following the setup guide.')}</div>`;
  else if (!S.authReady || (S.user && !S.blocked && !S.profile)) body = `<div class="panel empty"><b>${T('Chargement…', 'Loading…')}</b></div>`;
  else if (S.user && S.blocked) body = `<div class="panel empty"><b>${T('Cet accès n’est plus actif', 'This access is no longer active')}</b><span>${T('Demandez un nouveau code à l’école.', 'Ask the school for a new code.')}</span><button class="btn" data-a="logout">${T('Se déconnecter', 'Sign out')}</button></div>`;
  else body = `<form data-form="login" class="panel" style="padding:16px">
      <h2>${T('Connexion', 'Sign in')}</h2>
      <label class="f">${T('Numéro de téléphone', 'Phone number')}<input id="lg-phone" name="phone" inputmode="tel" autocomplete="tel" required placeholder="6XX XX XX XX" value="${esc(lsGet('lyc-last-phone', ''))}"></label>
      <label class="f">${T('Code à 6 chiffres', '6-digit code')}<span class="hint">${T('reçu de l’école par WhatsApp', 'sent to you by the school on WhatsApp')}</span><input id="lg-code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required></label>
      ${S.loginErr ? `<div class="banner red small">${esc(S.loginErr)}</div>` : ''}
      <button class="btn primary">${T('Se connecter', 'Sign in')}</button>
      <span class="small muted">${T('Code perdu ? Demandez-en un nouveau à l’école.', 'Lost your code? Ask the school for a new one.')}</span>
    </form>
    ${S.setupNeeded ? `<div class="banner info small" style="display:flex;flex-direction:column;gap:8px"><span>${T('Première utilisation : aucun compte n’existe encore. Le président crée le premier compte.', 'First use: no account exists yet. The chairman creates the first account.')}</span><button class="btn sm" data-a="setup">${T('Créer le compte du président', 'Create the chairman’s account')}</button></div>` : ''}`;
  return `<main><div class="wrap welcome">${heroBlock()}${body}
    <span class="small muted" style="text-align:center">${T('Astuce : ouvrez le menu du navigateur puis « Ajouter à l’écran d’accueil » pour installer l’application.', 'Tip: open the browser menu then “Add to Home screen” to install the app.')}</span>
  </div></main>${S.sheet ? sheetHTML() : ''}`;
}
function sheetSetup() {
  return {title: () => T('Compte du président', 'Chairman’s account'), body: () => S.setupCode ? `
    <div class="banner info">${T('Compte créé. Notez votre code de connexion :', 'Account created. Write down your sign-in code:')}</div>
    <div class="kpi"><span class="v" style="letter-spacing:.2em;font-size:2rem">${S.setupCode}</span><span class="l">${T('Numéro', 'Phone')} : ${esc(S.setupPhone)}</span></div>
    <a class="btn wa" href="${waLink({phone: S.setupPhone, code: S.setupCode, name: ''})}" target="_blank" rel="noopener">${T('M’envoyer le code sur WhatsApp', 'Send the code to myself on WhatsApp')}</a>
    <button class="btn primary" data-a="close">${T('Continuer', 'Continue')}</button>` : `
    <form data-form="setup">
      <label class="f">${T('Nom du président', 'Chairman’s name')}<input id="su-name" name="name" required autofocus></label>
      <label class="f">${T('Son numéro de téléphone (WhatsApp)', 'His phone number (WhatsApp)')}<input id="su-phone" name="phone" inputmode="tel" required placeholder="6XX XX XX XX"></label>
      <button class="btn primary">${T('Créer le compte', 'Create the account')}</button>
    </form>`};
}

/* ----- accounts (direction) ----- */
const ROLE_ORDER = ['president', 'vicepresident', 'direction', 'assistant', 'secretary', 'accountant', 'teacher', 'parent'];
function waLink(u) {
  const msg = T(`${SCHOOL.name} – accès à l’application de l’école${u.name ? ' pour ' + u.name : ''}\nLien : ${APP_URL}\nNuméro : ${u.phone}\nCode : ${u.code}\nOuvrez le lien, connectez-vous, puis choisissez « Ajouter à l’écran d’accueil » dans le menu du navigateur.`,
    `${SCHOOL.name} – access to the school app${u.name ? ' for ' + u.name : ''}\nLink: ${APP_URL}\nPhone: ${u.phone}\nCode: ${u.code}\nOpen the link, sign in, then choose “Add to Home screen” in the browser menu.`);
  return `https://wa.me/237${u.phone}?text=${encodeURIComponent(msg)}`;
}
function secondaryAuth() {
  const app = firebase.apps.find(a => a.name === 'lyc-admin') || firebase.initializeApp(FB_CONFIG, 'lyc-admin');
  const a = app.auth(); try { a.setPersistence(firebase.auth.Auth.Persistence.NONE); } catch {} return a;
}
const activeUsers = () => S.users.filter(u => u.active !== false);
async function createAccount({role, name, phone, level, levels}) {
  const ph = digits(phone);
  if (ph.length !== 9) throw new Error(T('Numéro invalide : 9 chiffres attendus.', 'Invalid number: 9 digits expected.'));
  const lg = await S.db.doc('logins/' + ph).get();
  const clash = activeUsers().find(u => u.phone === ph) || (lg.exists ? {role: 'parent'} : null);
  if (clash) throw new Error(T(`Ce numéro a déjà un accès (${ROLE_NAME()[clash.role]}).`, `This number already has access (${ROLE_NAME()[clash.role]}).`));
  const code = genCode(), email = emailFor(ph, Date.now().toString(36));
  const auth2 = secondaryAuth(); const cred = await auth2.createUserWithEmailAndPassword(email, code); const nuid = cred.user.uid; await auth2.signOut();
  const b = S.db.batch();
  b.set(S.db.doc('users/' + nuid), {role, name: name || '', phone: ph, level: level || null, levels: levels || [], code, email, active: true, createdAt: nowISO(), createdBy: S.profile.name || ''});
  b.set(S.db.doc('logins/' + ph), {email, uid: nuid});
  await b.commit();
  return {uid: nuid, code, phone: ph, name};
}
async function newCode(uidOld) {
  const old = S.users.find(u => u.id === uidOld); if (!old) return;
  try {
    const code = genCode(), email = emailFor(old.phone, Date.now().toString(36));
    const auth2 = secondaryAuth(); const cred = await auth2.createUserWithEmailAndPassword(email, code); const nuid = cred.user.uid; await auth2.signOut();
    const {id, ...rest} = old; const b = S.db.batch();
    b.set(S.db.doc('users/' + nuid), {...rest, code, email, active: true, sentAt: null, createdAt: nowISO(), createdBy: S.profile.name || ''});
    b.set(S.db.doc('users/' + uidOld), {active: false, replacedBy: nuid}, {merge: true});
    b.set(S.db.doc('logins/' + old.phone), {email, uid: nuid});
    await b.commit(); toast(T('Nouveau code créé. L’ancien ne fonctionne plus.', 'New code created. The old one no longer works.')); if (S.view === 'acces') { S.sheet = sheetAcc(nuid); render(); } else refreshSheet();
  } catch (e) { console.warn(e); toast(T('Création du code impossible. Vérifiez la connexion.', 'Could not create the code. Check the connection.')); }
}
async function disableAccess(uidX) {
  const u = S.users.find(x => x.id === uidX); if (!u) return;
  const ok = await write(async db => { const b = db.batch(); b.set(db.doc('users/' + uidX), {active: false}, {merge: true}); b.delete(db.doc('logins/' + u.phone)); await b.commit(); }, T('Accès désactivé', 'Access disabled'));
  if (ok) closeSheet();
}
function parentLevels(ph) { return [...new Set(activeStudents().filter(s => digits(s.parentPhone) === ph).map(s => s.level))]; }
async function syncParentLevels(phones) {
  for (const ph of new Set(phones.filter(Boolean))) { const u = activeUsers().find(x => x.role === 'parent' && x.phone === ph); if (!u) continue;
    const lv = parentLevels(ph); if (lv.join() !== (u.levels || []).join()) { try { await S.db.doc('users/' + u.id).set({levels: lv}, {merge: true}); } catch (e) { console.warn(e); } } }
}
function missingParents() {
  const have = new Set(activeUsers().map(u => u.phone)), seen = new Map();
  activeStudents().filter(s => !s.demo).forEach(s => { const ph = digits(s.parentPhone); if (ph.length === 9 && !have.has(ph) && !seen.has(ph)) seen.set(ph, s.parentName || ''); });
  return [...seen].map(([phone, name]) => ({phone, name}));
}
async function createParentAccess() {
  const list = missingParents(); if (!list.length) return; let n = 0;
  toast(T(`Création de ${list.length} accès…`, `Creating ${list.length} accesses…`));
  for (const p of list) { try { await createAccount({role: 'parent', name: p.name, phone: p.phone, levels: parentLevels(p.phone)}); n++; } catch (e) { console.warn(e); } }
  toast(T(`${n} accès parents créés. Envoyez-les par WhatsApp.`, `${n} parent accesses created. Send them on WhatsApp.`));
}
function parentAccessBlock(s) {
  const ph = digits(s.parentPhone), u = activeUsers().find(x => x.phone === ph);
  let inner;
  if (ph.length !== 9) inner = `<span class="small muted">${T('Ajoutez le numéro WhatsApp du parent (9 chiffres) pour lui créer un accès.', 'Add the parent’s WhatsApp number (9 digits) to create their access.')}</span>`;
  else if (u && u.role === 'parent') inner = `<div class="section-head"><span>${T('Code', 'Code')} <b class="num" style="letter-spacing:.15em">${esc(u.code)}</b></span>${u.sentAt ? `<span class="chip green">${T('Envoyé', 'Sent')}</span>` : `<span class="chip amber">${T('Pas encore envoyé', 'Not sent yet')}</span>`}</div>
    <div class="btns"><a class="btn wa" href="${waLink(u)}" target="_blank" rel="noopener" data-a="acc-sent" data-v="${u.id}">${T('Envoyer par WhatsApp', 'Send on WhatsApp')}</a><button class="btn sm" data-a="acc-newcode" data-v="${u.id}">${T('Nouveau code', 'New code')}</button></div>`;
  else if (u) inner = `<span class="small muted">${T('Ce numéro a déjà un accès du personnel.', 'This number already has a staff access.')}</span>`;
  else inner = `<span class="small muted">${T('Le parent n’a pas encore d’accès à l’application.', 'The parent has no app access yet.')}</span><button class="btn primary" data-a="parent-access" data-v="${s.id}">${T('Créer l’accès du parent', 'Create the parent’s access')}</button>`;
  return `<div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:10px"><h3>${T('Accès du parent', 'Parent’s access')}</h3>${inner}</div>`;
}
function accRow(u) {
  const who = u.role === 'teacher' ? `${ROLE_NAME().teacher} · ${LV[u.level]?.name || ''}` : u.role === 'parent' ? `${T('Parent de', 'Parent of')} ${activeStudents().filter(s => digits(s.parentPhone) === u.phone).map(s => esc(s.name.split(' ')[0])).join(', ') || '—'}` : ROLE_NAME()[u.role];
  return `<div class="row" style="flex-wrap:wrap"><button class="grow" data-a="acc-open" data-v="${u.id}" style="background:none;border:0;text-align:left;padding:0;cursor:pointer;min-width:0"><span class="name">${esc(u.name || u.phone)}</span><br><span class="small muted">${who} · ${esc(u.phone)}</span></button>
    ${u.sentAt ? `<span class="chip green">${T('Envoyé', 'Sent')}</span>` : ''}<a class="btn wa sm" href="${waLink(u)}" target="_blank" rel="noopener" data-a="acc-sent" data-v="${u.id}">WhatsApp</a></div>`;
}
function viewAcces() {
  const us = activeUsers().sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || (a.name || '').localeCompare(b.name || '')), miss = missingParents();
  const staffU = us.filter(u => u.role !== 'parent'), parU = us.filter(u => u.role === 'parent');
  return `
  <div class="section"><div class="section-head"><h2>${T('Accès à l’application', 'App access')}</h2><button class="btn primary sm" data-a="acc-add">${T('Ajouter un accès', 'Add access')}</button></div>
    <p class="small muted" style="margin:0">${T('Chaque personne se connecte avec son numéro et un code à 6 chiffres. Touchez « WhatsApp » pour lui envoyer le lien et son code : le message est prêt, il suffit d’appuyer sur Envoyer.', 'Each person signs in with their number and a 6-digit code. Tap “WhatsApp” to send them the link and their code: the message is ready, just press Send.')}</p></div>
  <div class="section"><h3>${T('Personnel', 'Staff')} (${staffU.length})</h3>${staffU.length ? `<div class="panel rows">${staffU.map(accRow).join('')}</div>` : `<div class="panel empty">${T('Aucun accès pour le personnel.', 'No staff access yet.')}</div>`}</div>
  <div class="section"><div class="section-head"><h3>${T('Parents', 'Parents')} (${parU.length})</h3>${miss.length ? `<button class="btn sm" data-a="acc-parents">${T(`Créer les ${miss.length} accès manquants`, `Create the ${miss.length} missing`)}</button>` : ''}</div>
    ${miss.length ? `<p class="small muted" style="margin:0">${T(`${miss.length} famille(s) inscrite(s) n’ont pas encore d’accès.`, `${miss.length} registered famil${miss.length > 1 ? 'ies have' : 'y has'} no access yet.`)}</p>` : ''}
    ${parU.length ? `<div class="panel rows">${parU.map(accRow).join('')}</div>` : `<div class="panel empty">${T('Les accès parents se créent à partir du numéro saisi sur la fiche de chaque élève.', 'Parent accesses are created from the number on each pupil’s record.')}</div>`}</div>`;
}
function sheetAccAdd() {
  return {title: () => T('Ajouter un accès', 'Add access'), body: () => `
    <form data-form="acc-add">
      <label class="f">${T('Rôle', 'Role')}<select id="aa-role" name="role" data-change="aa-role">${ROLE_ORDER.map(r => `<option value="${r}" ${S.aaRole === r ? 'selected' : ''}>${ROLE_NAME()[r]}</option>`).join('')}</select></label>
      <label class="f">${T('Nom', 'Name')}<input id="aa-name" name="name" required autofocus></label>
      <label class="f">${T('Numéro WhatsApp', 'WhatsApp number')}<input id="aa-phone" name="phone" inputmode="tel" required placeholder="6XX XX XX XX"></label>
      ${S.aaRole === 'teacher' ? `<label class="f">${T('Classe', 'Class')}<select id="aa-level" name="level">${levelOptions('C1')}</select></label>` : ''}
      <button class="btn primary">${T('Créer l’accès', 'Create access')}</button>
    </form>`};
}
function sheetAcc(id) {
  return {title: () => T('Accès', 'Access'), live: true, body: () => { const u = S.users.find(x => x.id === id); if (!u) return `<div class="empty">${T('Accès introuvable.', 'Access not found.')}</div>`;
    return `<div class="section"><h3>${esc(u.name || u.phone)}</h3><span class="small muted">${ROLE_NAME()[u.role]}${u.level ? ' · ' + LV[u.level].name : ''} · ${esc(u.phone)}</span></div>
    ${u.active === false ? `<div class="banner red small">${T('Accès désactivé.', 'Access disabled.')}</div>` : `
    <div class="kpi"><span class="v" style="letter-spacing:.2em">${esc(u.code)}</span><span class="l">${T('Code de connexion', 'Sign-in code')}${u.sentAt ? ' · ' + T('envoyé le ', 'sent ') + timeAgo(u.sentAt) : ''}</span></div>
    <a class="btn wa" href="${waLink(u)}" target="_blank" rel="noopener" data-a="acc-sent" data-v="${u.id}">${T('Envoyer par WhatsApp', 'Send on WhatsApp')}</a>
    <div class="btns"><button class="btn" data-a="acc-newcode" data-v="${u.id}">${T('Créer un nouveau code', 'Create a new code')}</button>${u.id !== S.me ? `<button class="btn" data-a="acc-off" data-v="${u.id}">${T('Désactiver l’accès', 'Disable access')}</button>` : ''}</div>
    <p class="small muted" style="margin:0">${T('Un nouveau code remplace l’ancien : utile si la personne l’a perdu ou a changé de téléphone.', 'A new code replaces the old one: useful if the person lost it or changed phone.')}</p>`}`; }};
}

/* ----- staff time & attendance ----- */
const startTime = () => cfg().hoursModel === 2 && cfg().startTime || '07:00';
const endTime = () => cfg().hoursModel === 2 && cfg().endTime || '15:00';
const staffDocId = ds => `${YEAR}_${ds}`;
const hmNow = () => { const d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const toMin = t => { const [h, m] = String(t || '').split(':').map(Number); return isNaN(h) ? null : h * 60 + (m || 0); };
const fromMin = n => pad(Math.floor(n / 60)) + ':' + pad(Math.round(n % 60));
function STAFF() {
  return [{key: 'DIR', name: cfg().directorName || '', role: T('Directrice', 'Head teacher')},
    {key: 'ADJ', name: cfg().assistantName || '', role: T('Assistante directrice', 'Assistant head teacher')},
    {key: 'SEC', name: cfg().secretaryName || '', role: T('Secrétaire', 'Secretary')},
    ...LEVELS.map(l => ({key: 'T_' + l.id, name: teacherOf(l.id), role: T('Titulaire, ', 'Class teacher, ') + l.name}))];
}
const myStaffKey = () => S.profile?.role === 'teacher' ? 'T_' + S.profile.level : ({direction: 'DIR', assistant: 'ADJ', secretary: 'SEC'})[S.profile?.role] || null;
const staffRec = (ds, key) => (S.staff[staffDocId(ds)]?.rec || {})[key];
const staffName = (st, r) => st.name || r?.name || T('Nom non renseigné', 'Name not set');
const effIn = r => r?.sec?.in || r?.in || '';
const effOut = r => r?.sec?.out || r?.out || '';
const gapTol = () => +cfg().gapTolerance || 10;
function staffGaps(r, ds) {
  if (!r || r.status === 'A' || r.status === 'L') return [];
  const g = [], sec = r.sec || {}, tol = gapTol(), past = ds < today();
  if (sec.absent && r.in) g.push(T('A pointé mais noté(e) absent(e) par la secrétaire', 'Clocked in but marked absent by the secretary'));
  if (r.in && sec.in) { const d = Math.abs(toMin(r.in) - toMin(sec.in)); if (d > tol) g.push(T(`Arrivée : ${d} min d’écart`, `Arrival: ${d} min apart`)); }
  else if (r.in && !sec.in && !sec.absent) g.push(T('Arrivée non relevée par la secrétaire', 'Arrival not recorded by the secretary'));
  else if (!r.in && sec.in && (past || r.out)) g.push(T('N’a pas pointé son arrivée', 'Did not clock in'));
  if (r.out && sec.out) { const d = Math.abs(toMin(r.out) - toMin(sec.out)); if (d > tol) g.push(T(`Départ : ${d} min d’écart`, `Departure: ${d} min apart`)); }
  else if (past && r.out && !sec.out && sec.in) g.push(T('Départ non relevé par la secrétaire', 'Departure not recorded by the secretary'));
  else if (past && !r.out && sec.out) g.push(T('N’a pas pointé son départ', 'Did not clock out'));
  return g;
}
function staffState(r) {
  if (r && !r.in && !r.sec?.in && r.sec?.absent && !r.status) return {k: 'absent', chip: `<span class="chip red">${T('Absent(e)', 'Absent')}</span>`};
  if (r && r.status !== 'A' && r.status !== 'L' && (r.in || r.sec?.in)) r = {...r, in: effIn(r), out: effOut(r)};
  if (!r) return {k: 'none', chip: `<span class="chip grey">${T('Pas encore arrivé(e)', 'Not in yet')}</span>`};
  if (r.status === 'A') return {k: 'absent', chip: `<span class="chip red">${T('Absent(e)', 'Absent')}</span>`};
  if (r.status === 'L') return {k: 'leave', chip: `<span class="chip blue">${T('Congé / permission', 'Leave')}</span>`};
  if (!r.in) return {k: 'none', chip: `<span class="chip grey">${T('Pas encore arrivé(e)', 'Not in yet')}</span>`};
  const late = toMin(r.in) > toMin(startTime());
  const early = r.out && toMin(r.out) < toMin(endTime());
  const chips = [late ? `<span class="chip amber">${T('En retard', 'Late')}</span>` : `<span class="chip green">${T('À l’heure', 'On time')}</span>`];
  if (r.out) chips.push(`<span class="chip ${early ? 'amber' : 'grey'}">${early ? T('Parti(e) tôt', 'Left early') : T('Parti(e)', 'Left')}</span>`);
  return {k: r.out ? 'left' : 'in', late, early, chip: chips.join(' ')};
}
async function staffWrite(ds, key, patch, msg) {
  return write(db => db.doc('staff/' + staffDocId(ds)).set({year: YEAR, date: ds, rec: {[key]: patch}}, {merge: true}), msg);
}
/* Minimal QR code encoder: byte mode, error correction level M, versions 1–10. */
const QR = (() => {
  const EXP = new Array(512), LOG = new Array(256);
  let v = 1; for (let i = 0; i < 255; i++) { EXP[i] = v; LOG[v] = i; v <<= 1; if (v & 256) v ^= 0x11d; }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  const mul = (a, b) => (a && b) ? EXP[LOG[a] + LOG[b]] : 0;
  function gen(n) { let g = [1]; for (let i = 0; i < n; i++) { const r = new Array(g.length + 1).fill(0); for (let j = 0; j < g.length; j++) { r[j] ^= g[j]; r[j + 1] ^= mul(g[j], EXP[i]); } g = r; } return g; }
  function ecc(data, n) { const g = gen(n), r = new Array(n).fill(0); for (const d of data) { const f = d ^ r.shift(); r.push(0); for (let i = 0; i < n; i++) r[i] ^= mul(g[i + 1], f); } return r; }
  // [ec codewords per block, [count, data codewords], ...] for level M
  const M = [null, [10, [1, 16]], [16, [1, 28]], [26, [1, 44]], [18, [2, 32]], [24, [2, 43]], [16, [4, 27]], [18, [4, 31]], [22, [2, 38], [2, 39]], [22, [3, 36], [2, 37]], [26, [4, 43], [1, 44]]];
  const ALIGN = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
  const REM = [0, 0, 7, 7, 7, 7, 7, 0, 0, 0, 0];
  const dataCap = ver => M[ver].slice(1).reduce((a, [c, d]) => a + c * d, 0);
  function encode(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    let ver = 1; while (ver <= 10 && 4 + (ver < 10 ? 8 : 16) + bytes.length * 8 > dataCap(ver) * 8) ver++;
    if (ver > 10) throw new Error('QR: text too long');
    const bits = []; const put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => put(b, 8));
    const cap = dataCap(ver) * 8; put(0, Math.min(4, cap - bits.length)); while (bits.length % 8) bits.push(0);
    const data = []; for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
    for (let p = 0; data.length < dataCap(ver); p ^= 1) data.push(p ? 0x11 : 0xEC);
    // split into blocks, add error correction, interleave
    const ecn = M[ver][0], blocks = []; let k = 0;
    M[ver].slice(1).forEach(([c, d]) => { for (let i = 0; i < c; i++) { const b = data.slice(k, k + d); k += d; blocks.push({d: b, e: ecc(b, ecn)}); } });
    const out = [], maxD = Math.max(...blocks.map(b => b.d.length));
    for (let i = 0; i < maxD; i++) blocks.forEach(b => { if (i < b.d.length) out.push(b.d[i]); });
    for (let i = 0; i < ecn; i++) blocks.forEach(b => out.push(b.e[i]));
    // matrix
    const n = ver * 4 + 17, mod = [...Array(n)].map(() => Array(n).fill(false)), fn = [...Array(n)].map(() => Array(n).fill(false));
    const set = (x, y, d) => { mod[y][x] = d; fn[y][x] = true; };
    const finder = (cx, cy) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy; if (x < 0 || y < 0 || x >= n || y >= n) continue; const d = Math.max(Math.abs(dx), Math.abs(dy)); set(x, y, d !== 2 && d !== 4); } };
    for (let i = 0; i < n; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    finder(3, 3); finder(n - 4, 3); finder(3, n - 4);
    const al = ALIGN[ver];
    al.forEach((ay, i) => al.forEach((ax, j) => { if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }));
    const fmtBits = mask => { const d = (0 << 3) | mask; let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537); return ((d << 10) | r) ^ 0x5412; };
    const drawFormat = mask => { const b = fmtBits(mask), g = i => ((b >>> i) & 1) === 1;
      for (let i = 0; i <= 5; i++) set(8, i, g(i)); set(8, 7, g(6)); set(8, 8, g(7)); set(7, 8, g(8));
      for (let i = 9; i < 15; i++) set(14 - i, 8, g(i));
      for (let i = 0; i < 8; i++) set(n - 1 - i, 8, g(i));
      for (let i = 8; i < 15; i++) set(8, n - 15 + i, g(i));
      set(8, n - 8, true); };
    drawFormat(0);
    if (ver >= 7) { let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25); const b = (ver << 12) | r;
      for (let i = 0; i < 18; i++) { const bit = ((b >>> i) & 1) === 1, a = n - 11 + i % 3, c = Math.floor(i / 3); set(a, c, bit); set(c, a, bit); } }
    // data placement
    const all = [...out]; let bi = 0; const total = all.length * 8 + REM[ver];
    for (let right = n - 1; right >= 1; right -= 2) { if (right === 6) right = 5;
      for (let vert = 0; vert < n; vert++) for (let j = 0; j < 2; j++) { const x = right - j, up = ((right + 1) & 2) === 0, y = up ? n - 1 - vert : vert;
        if (!fn[y][x] && bi < total) { mod[y][x] = bi < all.length * 8 ? ((all[bi >>> 3] >>> (7 - (bi & 7))) & 1) === 1 : false; bi++; } } }
    const MASKS = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x, y) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
      (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0,
      (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
    const apply = m => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!fn[y][x] && MASKS[m](x, y)) mod[y][x] = !mod[y][x]; };
    const penalty = () => { let p = 0;
      for (let y = 0; y < n; y++) for (const horiz of [true, false]) { let run = 1; for (let i = 1; i < n; i++) { const a = horiz ? mod[y][i] : mod[i][y], b = horiz ? mod[y][i - 1] : mod[i - 1][y]; if (a === b) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) { const c = mod[y][x]; if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3; }
      let dark = 0; mod.forEach(r => r.forEach(c => { if (c) dark++; })); p += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
      return p; };
    let best = 0, bestP = Infinity;
    for (let m = 0; m < 8; m++) { apply(m); drawFormat(m); const p = penalty(); if (p < bestP) { bestP = p; best = m; } apply(m); }
    apply(best); drawFormat(best);
    return {size: n, get: (x, y) => mod[y][x]};
  }
  function svg(text, px = 200, fg = '#000', bg = '#fff') {
    const q = encode(text), n = q.size + 8, s = px / n; let d = '';
    for (let y = 0; y < q.size; y++) for (let x = 0; x < q.size; x++) if (q.get(x, y)) d += `M${x + 4},${y + 4}h1v1h-1z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" width="${px}" height="${px}" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="${n}" height="${n}" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>`;
  }
  function draw(ctx, text, x0, y0, px) {
    const q = encode(text), n = q.size + 8, s = Math.max(1, Math.floor(px / n)), off = Math.floor((px - s * n) / 2);
    x0 = Math.round(x0); y0 = Math.round(y0);
    ctx.fillStyle = '#fff'; ctx.fillRect(x0, y0, px, px); ctx.fillStyle = '#000';
    for (let y = 0; y < q.size; y++) for (let x = 0; x < q.size; x++) if (q.get(x, y)) ctx.fillRect(x0 + off + (x + 4) * s, y0 + off + (y + 4) * s, s, s);
  }
  return {encode, svg, draw};
})();

/* ---------- pupil identity: photo, card, QR verification ---------- */
const verifyUrl = s => APP_URL + '?v=' + s.id + '.' + s.qrKey;
const deliverImage = (name, blob) => saveFile(name, blob, 'image/png');
function readDeepLink() { const v = new URLSearchParams(location.search).get('v'); if (!v) return; const m = v.match(/^([A-Za-z0-9_-]+)\.([A-Z0-9]{6,10})$/); if (m) S.pendingVerify = {id: m[1], key: m[2]}; try { history.replaceState(null, '', APP_URL); } catch {} }
const KEY_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const genKey = () => { const a = new Uint32Array(8); crypto.getRandomValues(a); return Array.from(a, n => KEY_CHARS[n % KEY_CHARS.length]).join(''); };
const canManageCards = () => isMgr() || S.profile?.role === 'secretary';
S.photos = {};
function photoOf(sid) {
  if (sid in S.photos) return S.photos[sid];
  S.photos[sid] = null;
  S.db?.doc('photos/' + sid).get().then(d => { S.photos[sid] = d.exists ? (d.data().data || '') : ''; if (S.sheet) refreshSheet(); else schedule(); }).catch(() => { S.photos[sid] = ''; });
  return null;
}
const initials = n => String(n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
function photoBox(s, w = 84) {
  const p = photoOf(s.id), h = Math.round(w * 1.25);
  return p ? `<img src="${p}" alt="${T('Photo de', 'Photo of')} ${esc(s.name)}" style="width:${w}px;height:${h}px;object-fit:cover;border-radius:10px;flex:none;background:var(--line)">`
    : `<span aria-hidden="true" style="width:${w}px;height:${h}px;border-radius:10px;flex:none;display:grid;place-items:center;background:var(--carbon-tint);color:var(--carbon);font-family:var(--f-display);font-weight:800;font-size:${Math.round(w / 3)}px">${p === null ? '…' : esc(initials(s.name))}</span>`;
}
function readPhoto(file) {
  return new Promise((res, rej) => { const fr = new FileReader(); fr.onerror = rej; fr.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => {
    const W = 240, H = 300, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    const r = Math.max(W / im.width, H / im.height), w = im.width * r, h = im.height * r; x.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
    res(c.toDataURL('image/jpeg', 0.72)); }; im.src = fr.result; }; fr.readAsDataURL(file); });
}
async function savePhoto(sid, file, phoneKey) {
  try { const data = await readPhoto(file); await S.db.doc('photos/' + sid).set({data, phoneKey: phoneKey || '', at: nowISO()}); S.photos[sid] = data; }
  catch (e) { console.warn(e); toast(T('La photo n’a pas pu être enregistrée.', 'The photo could not be saved.')); }
}
async function ensureKey(s) {
  if (s.qrKey) return s.qrKey; if (!canManageCards()) return null;
  const k = genKey(); const ok = await write(db => db.doc('students/' + s.id).update({qrKey: k})); if (ok) { s.qrKey = k; return k; } return null;
}
function cardHTML(s) {
  const url = verifyUrl(s);
  return `<div class="idcard">
    <div class="idcard-top"><img src="${LOGO}" alt=""><div><b>LES YEUX DU COEUR</b><span>Bilingual Nursery &amp; Primary School · Limbe</span></div></div>
    <div class="idcard-body">${photoBox(s, 78)}
      <div class="idcard-info"><span class="idcard-k">Pupil’s identity card · Carte d’élève</span><b>${esc(s.name)}</b><span>${LV[s.level]?.name} · ${YEAR}</span>${s.birth ? `<span>Born · Né(e) : ${frDate(s.birth)}</span>` : ''}<span class="num">N° ${esc(s.qrKey)}</span></div>
      <div class="idcard-qr">${QR.svg(url, 96)}</div></div>
    <img class="idcard-stamp" src="${STAMP}" alt="">
  </div>`;
}
async function drawCard(x, s, X, Y, Wd) {
  const k = Wd / 1012; x.save(); x.translate(X, Y); x.scale(k, k);
  x.fillStyle = '#fff'; x.fillRect(0, 0, 1012, 638); x.strokeStyle = '#999'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, 1009, 635);
  x.fillStyle = '#C12631'; x.fillRect(0, 0, 1012, 130);
  const logo = await loadImg(LOGO); if (logo) { x.fillStyle = '#fff'; x.fillRect(28, 18, 170, 94); x.drawImage(logo, 36, 22, 154, 154 * logo.height / logo.width); }
  x.fillStyle = '#fff'; x.textAlign = 'left'; x.font = '800 46px Arial, sans-serif'; x.fillText('LES YEUX DU COEUR', 222, 70);
  x.font = '600 24px Arial, sans-serif'; x.fillText('Bilingual Nursery & Primary School · Isokolo Old Road, Limbe', 222, 106);
  const ph = S.photos[s.id]; const pim = ph ? await loadImg(ph) : null;
  if (pim) x.drawImage(pim, 36, 166, 240, 300); else { x.fillStyle = '#E7EDF9'; x.fillRect(36, 166, 240, 300); x.fillStyle = '#2A4EA2'; x.font = '800 90px Arial'; x.textAlign = 'center'; x.fillText(initials(s.name), 156, 345); x.textAlign = 'left'; }
  x.fillStyle = '#555'; x.font = '600 20px Arial'; x.fillText('IDENTITY CARD · CARTE D’ÉLÈVE', 304, 186);
  x.fillStyle = '#111'; x.font = '800 40px Arial'; let nm = s.name; while (x.measureText(nm).width > 400 && nm.length > 4) nm = nm.slice(0, -2); x.fillText(nm, 304, 240);
  x.font = '600 30px Arial'; x.fillText(`${LV[s.level]?.name || ''} · ${YEAR}`, 304, 290);
  if (s.birth) { x.font = '400 26px Arial'; x.fillText('Born · Né(e) : ' + frDate(s.birth), 304, 334); }
  x.font = '700 28px "Courier New", monospace'; x.fillText('N° ' + s.qrKey, 304, 380);
  x.fillStyle = '#555'; x.font = '400 20px Arial'; x.fillText('Tel. ' + SCHOOL.tel, 304, 440);
  x.fillStyle = '#555'; x.font = '400 18px Arial'; x.textAlign = 'center'; x.fillText('Scan to verify · Scanner pour vérifier', 854, 436); x.textAlign = 'left';
  const st = await loadImg(STAMP); if (st) { x.save(); x.globalAlpha = .85; x.translate(600, 520); x.rotate(-0.2); x.drawImage(st, -95, -95, 190, 190); x.restore(); }
  x.fillStyle = '#C12631'; x.fillRect(0, 610, 1012, 28);
  x.restore();
  QR.draw(x, verifyUrl(s), X + 724 * k, Y + 150 * k, Math.round(260 * k));
}
async function cardPNG(s) { const c = document.createElement('canvas'); c.width = 1012; c.height = 638; await drawCard(c.getContext('2d'), s, 0, 0, 1012); return new Promise(r => c.toBlob(r, 'image/png')); }
async function classCards(lv) {
  const kids = byLevel(lv); if (!kids.length) return;
  toast(T('Préparation des cartes…', 'Preparing the cards…'));
  for (const k of kids) { await ensureKey(k); if (!(k.id in S.photos) || S.photos[k.id] === null) { try { const d = await S.db.doc('photos/' + k.id).get(); S.photos[k.id] = d.exists ? d.data().data || '' : ''; } catch { S.photos[k.id] = ''; } } }
  const ready = kids.filter(k => k.qrKey); const per = 8, pages = Math.ceil(ready.length / per);
  for (let p = 0; p < pages; p++) {
    const c = document.createElement('canvas'); c.width = 1240; c.height = 1754; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 1240, 1754);
    x.fillStyle = '#111'; x.font = '700 26px Arial'; x.fillText(`Les Yeux du Coeur · ${LV[lv].name} · ${YEAR} · ${p + 1}/${pages}`, 60, 52);
    const cw = 540, ch = 340; for (let i = 0; i < per && p * per + i < ready.length; i++) { const col = i % 2, row = Math.floor(i / 2); await drawCard(x, ready[p * per + i], 60 + col * (cw + 40), 80 + row * (ch + 64), cw); }
    await deliverImage(`Cartes-${LV[lv].name.replace(/\s/g, '')}-${p + 1}.png`, await new Promise(r => c.toBlob(r, 'image/png')));
  }
}
function sheetCard(sid) {
  return {title: () => T('Carte d’élève', 'Pupil’s card'), live: true, body: () => { const s = student(sid); if (!s) return `<div class="empty">${T('Élève introuvable.', 'Pupil not found.')}</div>`;
    if (!s.qrKey) return `<div class="panel empty"><b>${T('Carte pas encore créée', 'Card not created yet')}</b><span>${canManageCards() ? '' : T('L’école doit d’abord créer la carte de cet élève.', 'The school must first create this pupil’s card.')}</span>${canManageCards() ? `<button class="btn primary" data-a="card-make" data-v="${s.id}">${T('Créer la carte', 'Create the card')}</button>` : ''}</div>`;
    return `${cardHTML(s)}
    <div class="btns"><button class="btn primary" data-a="card-img" data-v="${s.id}">${T('Partager ou enregistrer l’image', 'Share or save the image')}</button>${canManageCards() ? `<button class="btn" data-a="card-renew" data-v="${s.id}">${T('Nouveau QR code', 'New QR code')}</button>` : ''}</div>
    <p class="small muted" style="margin:0">${S.profile.role === 'parent' ? T('Présentez cette carte à l’entrée ou à la sortie : le personnel la scanne pour vérifier l’identité de votre enfant.', 'Show this card at the gate: staff scan it to check your child’s identity.') : T('Un nouveau QR code annule l’ancienne carte (perte, vol). Pensez à réimprimer la carte.', 'A new QR code cancels the old card (lost or stolen). Remember to reprint the card.')}</p>`; }};
}
function verifyResult(id, key) {
  const s = student(id);
  if (!s) return {s: null, ok: false, tone: 'red', msg: T('Carte inconnue : aucun élève ne correspond.', 'Unknown card: no pupil matches.')};
  if (s.qrKey !== key) return {s, ok: false, tone: 'red', msg: T('Carte annulée : un nouveau QR code a été créé pour cet élève. Vérifiez l’identité autrement.', 'Cancelled card: a new QR code was issued for this pupil. Check identity another way.')};
  if (s.status === 'left') return {s, ok: false, tone: 'amber', msg: T('Cet élève n’est plus inscrit à l’école.', 'This pupil is no longer enrolled.')};
  return {s, ok: true, tone: 'green', msg: T('Élève inscrit(e) · carte valide', 'Enrolled pupil · valid card')};
}
function sheetVerify(v) {
  return {title: () => T('Vérification d’identité', 'Identity check'), live: true, body: () => {
    const r = verifyResult(v.id, v.key), s = r.s, role = S.profile.role;
    const color = {green: 'var(--good)', red: 'var(--stamp)', amber: 'var(--warn)'}[r.tone], tint = {green: 'var(--good-tint)', red: 'var(--stamp-tint)', amber: 'var(--warn-tint)'}[r.tone];
    let detail = '';
    if (s) { const a = S.att[attKey(s.level, today())], m = a?.marks?.[s.id]; const f = (isMgr() || role === 'accountant') && feesSet() ? feeStatus(s) : null;
      detail = `<div class="panel" style="padding:14px;display:flex;gap:14px;align-items:flex-start">${photoBox(s, 110)}<div style="display:flex;flex-direction:column;gap:4px;min-width:0"><b style="font-family:var(--f-display);font-size:1.25rem">${esc(s.name)}</b><span>${LV[s.level]?.name} · ${YEAR}</span>${s.birth ? `<span class="small muted">${T('Né(e) le', 'Born')} ${frDate(s.birth)}</span>` : ''}<span class="small">${T('Parent', 'Parent')} : <b>${esc(s.parentName || '—')}</b> · ${esc(s.parentPhone || '')}</span>
        <span class="small">${T('Aujourd’hui', 'Today')} : ${m ? `<b>${MARKS()[m]}</b>` : T('appel pas encore fait', 'roll call not taken yet')}</span><span class="small">${T('Fin des cours', 'Classes end')} : <b>${PUPIL_HOURS(s.level)[1]}</b></span>${f ? `<span class="small">${T('Frais', 'Fees')} : ${f.late ? `<b style="color:var(--stamp)">${money(f.late)} ${T('échus', 'due')}</b>` : `<b style="color:var(--good)">${T('à jour', 'up to date')}</b>`}</span>` : ''}</div></div>
        <div class="btns"><button class="btn" data-a="student" data-v="${s.id}">${T('Voir la fiche', 'Open record')}</button>${f ? `<button class="btn" data-a="pay" data-v="${s.id}">${T('Encaisser', 'Record payment')}</button>` : ''}</div>`; }
    return `<div style="background:${tint};color:${color};border-radius:var(--r);padding:16px;font-weight:800;font-size:1.1rem;display:flex;gap:10px;align-items:center"><span style="font-size:1.6rem" aria-hidden="true">${r.ok ? '✓' : '✕'}</span><span>${r.msg}</span></div>
      ${detail}<button class="btn primary" data-a="scan">${T('Vérifier une autre carte', 'Check another card')}</button>`; }};
}
function parseScan(text) {
  const t = String(text || '').trim();
  const m = t.match(/[#?&]v[.=]([A-Za-z0-9_-]+)\.([A-Z0-9]{6,10})/); if (m) return {id: m[1], key: m[2]};
  const k = t.toUpperCase().replace(/[^A-Z0-9]/g, ''); if (k.length >= 6) { const s = S.students.find(x => x.qrKey === k); return s ? {id: s.id, key: k} : {id: '?', key: k}; }
  return null;
}
function stopScan() { const v = S.scan; S.scan = null; if (v?.stream) v.stream.getTracks().forEach(t => t.stop()); }
function sheetScan() {
  const live = !!(navigator.mediaDevices?.getUserMedia && 'BarcodeDetector' in window);
  return {title: () => T('Vérifier une carte', 'Check a card'), onClose: stopScan, body: () => `
    ${live ? `<video id="qr-video" playsinline muted style="width:100%;max-height:52vh;border-radius:12px;background:#000;object-fit:cover" hidden></video>
      <button class="btn red" data-a="scan-start" id="scan-start">${T('Ouvrir la caméra et scanner', 'Open the camera and scan')}</button>` : `
      <div class="banner info small">${T('Scannez le QR code de la carte avec l’appareil photo du téléphone (ou Google Lens) : la vérification s’ouvre directement dans l’application.', 'Scan the card’s QR code with the phone camera (or Google Lens): the check opens straight in the app.')}</div>`}
    ${'BarcodeDetector' in window ? `<label class="f">${T('Ou une photo du QR code', 'Or a photo of the QR code')}<input type="file" id="qr-file" accept="image/*" capture="environment" data-change="qr-file"></label>` : ''}
    <form data-form="verify-code"><label class="f">${T('Ou le numéro de la carte', 'Or the card number')}<span class="hint">${T('8 caractères, sous la photo', '8 characters, under the photo')}</span><input id="vc-code" name="code" autocomplete="off" autocapitalize="characters" placeholder="ex. K7M2P9QX" required></label><button class="btn">${T('Vérifier', 'Check')}</button></form>`};
}
async function startScan() {
  const v = document.getElementById('qr-video'), b = document.getElementById('scan-start'); if (!v) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}, audio: false});
    S.scan = {stream}; v.srcObject = stream; v.hidden = false; if (b) b.hidden = true; await v.play();
    const det = new BarcodeDetector({formats: ['qr_code']});
    const loop = async () => { if (!S.scan) return; try { const r = await det.detect(v); if (r.length) { const p = parseScan(r[0].rawValue); if (p) { stopScan(); S.sheet = sheetVerify(p); render(); return; } } } catch {} requestAnimationFrame(loop); };
    loop();
  } catch (e) { console.warn(e); toast(T('Caméra indisponible : utilisez l’appareil photo du téléphone ou le numéro de la carte.', 'Camera unavailable: use the phone camera or the card number.')); }
}
async function scanFile(input) {
  const f = input.files?.[0]; if (!f) return;
  try { const bmp = await createImageBitmap(f); const r = await new BarcodeDetector({formats: ['qr_code']}).detect(bmp); const p = r.length && parseScan(r[0].rawValue);
    if (p) { S.sheet = sheetVerify(p); render(); } else toast(T('Aucun QR code lisible sur la photo.', 'No readable QR code in the photo.')); }
  catch (e) { console.warn(e); toast(T('Lecture impossible : utilisez le numéro de la carte.', 'Could not read it: use the card number.')); }
}
function checkPendingVerify() {
  if (!S.pendingVerify || !S.profile || !allLoaded()) return;
  const v = S.pendingVerify; S.pendingVerify = null;
  if (S.profile.role === 'parent') { toast(T('La vérification des cartes est réservée au personnel.', 'Card checks are for school staff only.')); return; }
  setTimeout(() => { S.sheet = sheetVerify(v); render(); }, 0);
}
function secRecordCard() {
  const st = STAFF().find(x => x.key === 'SEC'), r = staffRec(today(), 'SEC'), sec = r?.sec || {};
  const btn = sec.absent ? '' : !sec.in ? `<button class="btn red" data-a="sec-in" data-v="SEC" ${S.canWrite ? '' : 'disabled'}>${T('Secrétaire arrivée', 'Secretary arrived')}</button>` : !sec.out ? `<button class="btn" data-a="sec-out" data-v="SEC" ${S.canWrite ? '' : 'disabled'}>${T('Secrétaire partie', 'Secretary left')}</button>` : '';
  return `<div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:10px">
    <div class="section-head"><h3>${T('Relevé de la secrétaire', 'Secretary’s sign-in')}</h3><button class="btn ghost sm" data-a="sec-edit" data-v="SEC">${T('Corriger', 'Correct')}</button></div>
    <span class="small muted">${esc(st.name || T('Secrétaire', 'Secretary'))} · ${T('vous notez ses heures, elle ne les voit pas', 'you record her times, she does not see them')}</span>
    <div class="grid2 num"><span>${T('Arrivée', 'Arrival')}<br><b style="font-size:1.25rem">${sec.absent ? T('Non venue', 'Absent') : sec.in || '—'}</b></span><span>${T('Départ', 'Departure')}<br><b style="font-size:1.25rem">${sec.out || '—'}</b></span></div>
    ${btn ? `<div class="btns">${btn}</div>` : ''}</div>`;
}
function myClockCard() {
  const key = myStaffKey(); if (!key) return '';
  const r = staffRec(today(), key), st = staffState(r);
  const btn = !r?.in && r?.status !== 'A' && r?.status !== 'L'
    ? `<button class="btn red" data-a="clock-in" ${S.canWrite ? '' : 'disabled'}>${ICON.clock} ${T('Pointer mon arrivée', 'Clock in')}</button>`
    : r?.in && !r.out ? `<button class="btn" data-a="clock-out" ${S.canWrite ? '' : 'disabled'}>${ICON.clock} ${T('Pointer mon départ', 'Clock out')}</button>` : '';
  return `<div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:10px">
    <div class="section-head"><h3>${T('Ma présence aujourd’hui', 'My attendance today')}</h3>${st.chip}</div>
    <div class="grid2 num"><span>${T('Arrivée', 'Arrival')}<br><b style="font-size:1.25rem">${r?.in || '—'}</b></span><span>${T('Départ', 'Departure')}<br><b style="font-size:1.25rem">${r?.out || '—'}</b></span></div>
    ${btn ? `<div class="btns">${btn}</div>` : ''}
    <span class="small muted">${T('Horaires attendus', 'Expected hours')} : ${startTime()} – ${endTime()}</span>
  </div>`;
}
function staffMonth(key, month) {
  const o = {gaps: 0, present: 0, late: 0, absent: 0, leave: 0, early: 0, sumIn: 0, nIn: 0, sumOut: 0, nOut: 0};
  for (const d of Object.values(S.staff)) {
    if (!d.date?.startsWith(month)) continue; const r = (d.rec || {})[key]; if (!r) continue;
    if (r.status === 'A') { o.absent++; continue; } if (r.status === 'L') { o.leave++; continue; }
    if (staffGaps(r, d.date).length) o.gaps++;
    const ei = effIn(r), eo = effOut(r);
    if (ei) { o.present++; o.sumIn += toMin(ei); o.nIn++; if (toMin(ei) > toMin(startTime())) o.late++; }
    if (eo) { o.sumOut += toMin(eo); o.nOut++; if (toMin(eo) < toMin(endTime())) o.early++; }
  }
  o.avgIn = o.nIn ? fromMin(o.sumIn / o.nIn) : '—'; o.avgOut = o.nOut ? fromMin(o.sumOut / o.nOut) : '—';
  return o;
}
function staffTodayCard() {
  const d = today(), staff = STAFF();
  const rs = staff.map(st => staffState(staffRec(d, st.key)));
  const here = rs.filter(x => x.k === 'in' || x.k === 'left').length, late = rs.filter(x => x.late).length, abs = rs.filter(x => x.k === 'absent').length;
  return `<div class="section"><div class="section-head"><h3>${T('Personnel aujourd’hui', 'Staff today')}</h3><button class="btn ghost sm" data-a="tab" data-v="personnel">${T('Registre', 'Register')}</button></div>
    <div class="kpis"><div class="kpi"><span class="v">${here}/${staff.length}</span><span class="l">${T('membres du personnel présents', 'staff members in')}</span></div>
    <div class="kpi"><span class="v" style="color:${late ? 'var(--warn)' : 'inherit'}">${late}</span><span class="l">${T('arrivés en retard', 'arrived late')}${abs ? ' · ' + abs + ' ' + T('absent(s)', 'absent') : ''}</span></div></div></div>`;
}
function viewPersonnel() {
  const ds = S.stDate || today(), staff = STAFF(), month = ds.slice(0, 7);
  let monthName = month; try { monthName = cap(new Date(month + '-15T12:00:00').toLocaleDateString(LOC(), {month: 'long', year: 'numeric'})); } catch {}
  return `
  <div class="section"><div class="section-head"><h2>${T('Présences du personnel', 'Staff attendance')}</h2><span class="muted small">${T('Horaires', 'Hours')} ${startTime()} – ${endTime()}</span></div>
    <div class="grid2"><label class="f">${T('Date', 'Date')}<input type="date" id="st-date" value="${ds}" max="${today()}" data-change="staff-date"></label>
      <div class="f" style="justify-content:flex-end"><span class="small muted">${cap(longDay(ds))}</span></div></div>
  </div>
  <div class="panel rows">${staff.map(st => { const r = staffRec(ds, st.key), x = staffState(r);
    return `<button class="row" data-a="${isAdmin() ? 'staff-edit' : 'noop'}" data-v="${st.key}" style="flex-wrap:wrap"><span class="grow"><span class="name">${esc(staffName(st, r))}</span><br><span class="small muted">${st.role}</span></span>
      <span class="num" style="text-align:right;font-size:.9rem"><b>${effIn(r) || '--:--'}</b> → <b>${effOut(r) || '--:--'}</b><br>${x.chip}</span>
      ${r && r.status !== 'A' && r.status !== 'L' ? `<span class="small num" style="flex-basis:100%;display:grid;grid-template-columns:auto 1fr;gap:2px 10px"><span class="muted">${T('Pointé', 'Clocked')}</span><span>${r.in || '--:--'} → ${r.out || '--:--'}</span><span class="muted">${st.key === 'SEC' ? T('Assistante', 'Assistant') : T('Secrétaire', 'Secretary')}</span><span>${r.sec?.absent ? T('noté(e) absent(e)', 'marked absent') : `${r.sec?.in || '--:--'} → ${r.sec?.out || '--:--'}`}</span></span>` : ''}
      ${staffGaps(r, ds).map(g => `<span class="small" style="flex-basis:100%;color:var(--warn)">⚠ ${g}</span>`).join('')}
      ${r?.note ? `<span class="small muted" style="flex-basis:100%">${esc(r.note)}</span>` : ''}${r?.sec?.note ? `<span class="small muted" style="flex-basis:100%">${T('Secrétaire', 'Secretary')} : ${esc(r.sec.note)}</span>` : ''}</button>`; }).join('')}</div>
  <p class="small muted" style="margin:0">${T(`Les heures retenues sont celles relevées par la secrétaire quand elles existent. Un écart est signalé au-delà de ${gapTol()} minutes.`, `The secretary’s times are used when available. A gap is flagged beyond ${gapTol()} minutes.`)}</p>
  <p class="small muted" style="margin:0">${isAdmin() ? T('Touchez une ligne pour saisir ou corriger les heures, ou indiquer une absence ou un congé.', 'Tap a row to enter or correct the times, or to record an absence or leave.') : T('Seuls le président et le vice-président peuvent corriger ce registre.', 'Only the chairman and vice-chairman can correct this register.')}</p>
  <div class="section"><h3>${T('Bilan du mois', 'Month summary')} · ${monthName}</h3><div class="panel tbl"><table><thead><tr><th>${T('Personnel', 'Staff')}</th><th>${T('Jours', 'Days')}</th><th>${T('Retards', 'Late')}</th><th>${T('Absences', 'Absent')}</th><th>${T('Congés', 'Leave')}</th><th>${T('Écarts', 'Gaps')}</th><th>${T('Arrivée moy.', 'Avg in')}</th><th>${T('Départ moy.', 'Avg out')}</th></tr></thead><tbody>
    ${staff.map(st => { const o = staffMonth(st.key, month); const nm = staffName(st, Object.values(S.staff).map(d => (d.rec || {})[st.key]).find(Boolean)); return `<tr><td>${esc(nm)}<br><span class="small muted">${st.key.startsWith('T_') ? LV[st.key.slice(2)].name : st.role}</span></td><td>${o.present}</td><td>${o.late ? `<span class="chip amber">${o.late}</span>` : 0}</td><td>${o.absent ? `<span class="chip red">${o.absent}</span>` : 0}</td><td>${o.leave}</td><td>${o.gaps ? `<span class="chip amber">${o.gaps}</span>` : 0}</td><td>${o.avgIn}</td><td>${o.avgOut}</td></tr>`; }).join('')}
  </tbody></table></div>
  <button class="btn sm" data-a="staff-csv">${T('Exporter le mois (CSV)', 'Export the month (CSV)')}</button></div>`;
}
function sheetStaffEdit(key) {
  const ds = S.stDate || today(), st = STAFF().find(x => x.key === key);
  return {title: () => staffName(st, staffRec(ds, key)), body: () => { const r = staffRec(ds, key) || {};
    return `<span class="small muted">${st.role} · ${cap(longDay(ds))}</span>
    <form data-form="staff" data-key="${key}">
      <label class="f">${T('Statut', 'Status')}<select id="se-status" name="status"><option value="P">${T('Présent(e)', 'Present')}</option><option value="A" ${r.status === 'A' ? 'selected' : ''}>${T('Absent(e)', 'Absent')}</option><option value="L" ${r.status === 'L' ? 'selected' : ''}>${T('Congé / permission', 'Leave / permission')}</option></select></label>
      <div class="grid2"><label class="f">${T('Heure d’arrivée', 'Arrival time')}<input id="se-in" name="in" type="time" value="${esc(r.in || '')}"></label>
        <label class="f">${T('Heure de départ', 'Departure time')}<input id="se-out" name="out" type="time" value="${esc(r.out || '')}"></label></div>
      <label class="f">${T('Remarque', 'Note')}<span class="hint">${T('facultatif, ex. motif de l’absence', 'optional, e.g. reason for absence')}</span><input id="se-note" name="note" value="${esc(r.note || '')}"></label>
      ${r.editedBy ? `<span class="small muted">${T('Dernière correction par', 'Last corrected by')} ${esc(r.editedBy)}</span>` : ''}
      <button class="btn primary" ${S.canWrite ? '' : 'disabled'}>${T('Enregistrer', 'Save')}</button>
    </form>`; }};
}

function viewPointage() {
  const ds = S.stDate || today(), staff = STAFF().filter(st => st.key !== 'SEC'), isToday = ds === today();
  const recs = staff.map(st => staffRec(ds, st.key)?.sec || {});
  const inN = recs.filter(x => x.in).length, outN = recs.filter(x => x.out).length;
  return `
  <div class="section"><div class="section-head"><h2>${T('Pointage du personnel', 'Staff sign-in')}</h2><span class="chip blue num">${T('Arrivés', 'In')} ${inN}/${staff.length} · ${T('Partis', 'Out')} ${outN}</span></div>
    <div class="grid2"><label class="f">${T('Date', 'Date')}<input type="date" id="st-date" value="${ds}" max="${today()}" data-change="staff-date"></label>
      <div class="f" style="justify-content:flex-end"><span class="small muted">${cap(longDay(ds))} · ${T('Horaires', 'Hours')} ${startTime()} – ${endTime()}</span></div></div>
  </div>
  <div class="panel rows">${staff.map(st => { const r = staffRec(ds, st.key), sec = r?.sec || {}, off = r?.status === 'A' || r?.status === 'L';
    const late = sec.in && toMin(sec.in) > toMin(startTime());
    const btn = !isToday || off || sec.absent ? '' : !sec.in ? `<button class="btn red sm" data-a="sec-in" data-v="${st.key}" ${S.canWrite ? '' : 'disabled'}>${T('Arrivé(e)', 'Arrived')}</button>` : !sec.out ? `<button class="btn sm" data-a="sec-out" data-v="${st.key}" ${S.canWrite ? '' : 'disabled'}>${T('Parti(e)', 'Left')}</button>` : '';
    return `<div class="row" style="flex-wrap:wrap"><button class="grow" data-a="sec-edit" data-v="${st.key}" style="background:none;border:0;text-align:left;padding:0;cursor:pointer;min-width:0"><span class="name">${esc(staffName(st, r))}</span><br><span class="small muted">${st.role}</span></button>
      <span class="num" style="text-align:right;font-size:.9rem">${off ? `<span class="chip blue">${r.status === 'A' ? T('Absence notée par la direction', 'Absence set by head office') : T('Congé', 'Leave')}</span>` : sec.absent ? `<span class="chip red">${T('Non venu(e)', 'Did not come')}</span>` : `<b>${sec.in || '--:--'}</b> → <b>${sec.out || '--:--'}</b>${late ? `<br><span class="chip amber">${T('En retard', 'Late')}</span>` : ''}`}</span>
      ${btn}</div>`; }).join('')}</div>
  <p class="small muted" style="margin:0">${isToday ? T('Touchez « Arrivé(e) » quand la personne entre dans l’école, puis « Parti(e) » à sa sortie. Touchez un nom pour corriger une heure ou noter une absence.', 'Tap “Arrived” when the person enters the school, then “Left” when they go. Tap a name to correct a time or record an absence.') : T('Touchez un nom pour saisir ou corriger les heures de ce jour.', 'Tap a name to enter or correct the times for this day.')}</p>`;
}
function sheetSecEdit(key) {
  const ds = S.stDate || today(), st = STAFF().find(x => x.key === key);
  return {title: () => staffName(st, staffRec(ds, key)), body: () => { const sec = staffRec(ds, key)?.sec || {};
    return `<span class="small muted">${st.role} · ${cap(longDay(ds))}</span>
    <form data-form="sec" data-key="${key}">
      <label class="f" style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="sc-abs" name="absent" ${sec.absent ? 'checked' : ''} style="width:22px;min-height:22px">${T('Non venu(e) aujourd’hui', 'Did not come today')}</label>
      <div class="grid2"><label class="f">${T('Heure d’arrivée', 'Arrival time')}<input id="sc-in" name="in" type="time" value="${esc(sec.in || '')}"></label>
        <label class="f">${T('Heure de départ', 'Departure time')}<input id="sc-out" name="out" type="time" value="${esc(sec.out || '')}"></label></div>
      <label class="f">${T('Remarque', 'Note')}<span class="hint">${T('facultatif', 'optional')}</span><input id="sc-note" name="note" value="${esc(sec.note || '')}"></label>
      <button class="btn primary" ${S.canWrite ? '' : 'disabled'}>${T('Enregistrer', 'Save')}</button>
    </form>`; }};
}

/* ----- direction home ----- */
function viewHome() {
  const st = activeStudents(); const nur = st.filter(s => LV[s.level]?.sec === 'nursery').length;
  const d = today(); const done = LEVELS.filter(l => S.att[attKey(l.id, d)]);
  let pres = 0, tot = 0;
  done.forEach(l => Object.values(S.att[attKey(l.id, d)].marks || {}).forEach(m => { tot++; if (m === 'P' || m === 'R') pres++; }));
  const fs = st.map(feeStatus); const exp = fs.reduce((a, f) => a + f.total, 0), got = fs.reduce((a, f) => a + f.paid, 0);
  const lateN = fs.filter(f => f.late > 0).length;
  const alerts = absenceAlerts();
  const ann = S.messages.filter(m => m.kind === 'announce').slice(0, 3);
  return `
  <div class="section"><div class="section-head"><h2>${T('Aujourd’hui', 'Today')}</h2><span class="muted small">${cap(longDay(d))} · ${TERMS[termOf(d)]}</span></div>
    <div class="kpis">
      <div class="kpi"><span class="v">${st.length}</span><span class="l">${T(`élèves (${nur} maternelle, ${st.length - nur} primaire)`, `pupils (${nur} nursery, ${st.length - nur} primary)`)}</span></div>
      <div class="kpi"><span class="v">${tot ? Math.round(pres / tot * 100) + ' %' : '—'}</span><span class="l">${T('présence du jour', 'present today')}</span></div>
      <div class="kpi"><span class="v">${done.length}/9</span><span class="l">${T('appels faits', 'roll calls done')}</span></div>
      <div class="kpi"><span class="v">${lateN}</span><span class="l">${T('familles en retard de paiement', 'families behind on fees')}</span></div>
    </div>
  </div>
  ${st.length === 0 ? `<div class="panel empty"><b>${T('Aucun élève enregistré', 'No pupils registered yet')}</b><span>${T('Commencez par ajouter les élèves de chaque classe et fixer les frais de scolarité.', 'Start by adding the pupils of each class and setting the school fees.')}</span><div class="btns"><button class="btn primary" data-a="tab" data-v="eleves">${T('Ajouter des élèves', 'Add pupils')}</button><button class="btn" data-a="tab" data-v="reglages">${T('Réglages', 'Settings')}</button></div></div>` : ''}
  ${myClockCard()}
  ${S.profile.role === 'assistant' ? secRecordCard() : ''}
  ${staffTodayCard()}
  <div class="section"><div class="section-head"><h3>${T('Appels du jour', 'Today’s roll calls')}</h3><button class="btn ghost sm" data-a="tab" data-v="appel">${T('Ouvrir', 'Open')}</button></div>
    <div class="panel rows">${LEVELS.map(l => { const a = S.att[attKey(l.id, d)]; const n = byLevel(l.id).length;
      const ab = a ? Object.values(a.marks || {}).filter(m => m === 'A').length : 0;
      return `<button class="row" data-a="open-appel" data-v="${l.id}"><span class="grow"><span class="name">${l.name}</span><br><span class="small muted">${esc(teacherOf(l.id) || T('Titulaire à renseigner', 'Class teacher not set'))} · ${pl(n, 'élève', 'élèves', 'pupil', 'pupils')}</span></span>${a ? (ab ? `<span class="chip red">${pl(ab, 'absent', 'absents', 'absent', 'absent')}</span>` : `<span class="chip green">${T('Fait', 'Done')}</span>`) : `<span class="chip grey">${T('Non fait', 'Not done')}</span>`}</button>`; }).join('')}</div>
  </div>
  <div class="section"><div class="section-head"><h3>${T('Frais de scolarité', 'School fees')} ${YEAR}</h3><button class="btn ghost sm" data-a="tab" data-v="frais">${T('Détail', 'Details')}</button></div>
    <div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:8px">
      ${feesSet() ? `<div class="section-head"><span class="num"><b>${money(got)}</b> ${T('encaissés', 'collected')}</span><span class="muted small num">${T('sur', 'of')} ${money(exp)}</span></div><div class="bar"><i style="width:${exp ? Math.min(100, got / exp * 100) : 0}%"></i></div>` : `<span class="muted">${T('Les montants des frais ne sont pas encore fixés.', 'Fee amounts have not been set yet.')}</span><button class="btn sm" data-a="tab" data-v="reglages">${T('Fixer les frais', 'Set the fees')}</button>`}
    </div>
  </div>
  ${alerts.length ? `<div class="section"><h3>${T('Alertes d’absences', 'Absence alerts')}</h3><div class="panel rows">${alerts.map(a => `<button class="row" data-a="student" data-v="${a.s.id}"><span class="grow"><span class="name">${esc(a.s.name)}</span><br><span class="small muted">${LV[a.s.level]?.name}</span></span><span class="chip red num">${T(`${a.n} absences ce trimestre`, `${a.n} absences this term`)}</span></button>`).join('')}</div></div>` : ''}
  <div class="section"><div class="section-head"><h3>${T('Dernières annonces', 'Latest announcements')}</h3><button class="btn ghost sm" data-a="compose">${T('Nouvelle annonce', 'New announcement')}</button></div>
    ${ann.length ? `<div class="panel rows">${ann.map(msgRow).join('')}</div>` : `<div class="panel empty">${T('Aucune annonce envoyée cette année.', 'No announcements sent this year.')}</div>`}
  </div>`;
}
function absenceAlerts() {
  const th = +cfg().absenceThreshold || 5, term = termOf(today());
  return activeStudents().map(s => ({s, n: attCounts(s.id, term).A})).filter(x => x.n >= th).sort((a, b) => b.n - a.n);
}

/* ----- attendance ----- */
function viewAppel() {
  const p = S.profile, M = MARKS();
  const lv = p.role === 'teacher' ? p.level : (S.apLevel || LEVELS[0].id);
  const ds = S.apDate, key = attKey(lv, ds), doc = S.att[key];
  const kids = byLevel(lv);
  if (!S.draft || S.draft.key !== key || (doc && S.draft.savedAt !== doc.savedAt && !S.draft.dirty)) {
    const marks = {}; kids.forEach(k => marks[k.id] = doc?.marks?.[k.id] || 'P');
    S.draft = {key, marks, reasons: {...(doc?.reasons || {})}, savedAt: doc?.savedAt, dirty: false};
  }
  kids.forEach(k => { if (!S.draft.marks[k.id]) S.draft.marks[k.id] = 'P'; });
  const cnt = {P:0, A:0, R:0, J:0}; kids.forEach(k => cnt[S.draft.marks[k.id]]++);
  const future = ds > today();
  const letters = EN() ? {P:'P', A:'A', R:'L', J:'E'} : {P:'P', A:'A', R:'R', J:'J'};
  return `${p.role === 'teacher' ? myClockCard() : ''}
  <div class="section"><div class="section-head"><h2>${p.role === 'teacher' ? T('Appel de ', 'Roll call · ') + LV[lv].name : T('Présences', 'Attendance')}</h2>${doc ? `<span class="chip green">${T('Enregistré', 'Saved')} ${doc.savedAt ? T('à ', 'at ') + hhmm(doc.savedAt) : ''}</span>` : `<span class="chip grey">${T('Pas encore fait', 'Not done yet')}</span>`}</div>
    ${p.role !== 'teacher' ? `<div class="seg" role="group" aria-label="${T('Classe', 'Class')}">${LEVELS.map(l => `<button data-a="ap-level" data-v="${l.id}" aria-pressed="${l.id === lv}">${l.name}</button>`).join('')}</div>` : ''}
    <div class="grid2"><label class="f">${T('Date', 'Date')}<input type="date" id="ap-date" value="${ds}" max="${today()}" data-change="ap-date"></label>
      <div class="f" style="justify-content:flex-end"><span class="small muted">${cap(longDay(ds))} · ${TERMS[termOf(ds)]}<br>${T('Horaires de la classe', 'Class hours')} : ${PUPIL_HOURS(lv).join(' – ')}</span></div></div>
  </div>
  ${kids.length === 0 ? `<div class="panel empty"><b>${T('Aucun élève dans ', 'No pupils in ')}${LV[lv].name}</b><span>${p.role === 'teacher' ? T('La direction doit d’abord inscrire les élèves de la classe.', 'The head office must first register the pupils of this class.') : T('Ajoutez les élèves de cette classe pour faire l’appel.', 'Add the pupils of this class to take the roll call.')}</span>${p.role !== 'teacher' ? `<button class="btn primary" data-a="add-student" data-v="${lv}">${T('Ajouter des élèves', 'Add pupils')}</button>` : ''}</div>` : `
  <div class="section">
    <div class="section-head"><div class="legend">${['P','A','R','J'].map(v => `<span><b>${letters[v]}</b> ${M[v].toLowerCase()}</span>`).join('')}</div><button class="btn ghost sm" data-a="ap-all">${T('Tous présents', 'All present')}</button></div>
    <div class="panel rows">${kids.map(k => { const m = S.draft.marks[k.id]; const j = doc?.justif?.[k.id];
      return `<div class="row" style="flex-wrap:wrap"><span class="grow"><span class="name">${esc(k.name)}</span>${j && m === 'A' ? `<br><span class="small" style="color:var(--carbon)">${T('Justificatif du parent', 'Parent’s note')} : « ${esc(j.text)} »</span>` : ''}</span>
        <span class="mark" role="group" aria-label="${esc(k.name)}">${['P','A','R','J'].map(v => `<button data-a="ap-mark" data-s="${k.id}" data-v="${v}" aria-pressed="${m === v}" aria-label="${M[v]}">${letters[v]}</button>`).join('')}</span>
        ${m === 'A' ? `<div style="flex-basis:100%;display:flex;gap:8px;align-items:center"><select id="rs-${k.id}" data-change="ap-reason" data-s="${k.id}" aria-label="${T('Motif', 'Reason')}"><option value="">${T('Motif (facultatif)', 'Reason (optional)')}</option>${REASONS.map(r => `<option value="${r[0]}" ${S.draft.reasons[k.id] === r[0] ? 'selected' : ''}>${T(r[0], r[1])}</option>`).join('')}</select>${j ? `<button class="btn sm" data-a="ap-accept" data-s="${k.id}">${T('Accepter', 'Accept')}</button>` : ''}</div>` : ''}
      </div>`; }).join('')}</div>
  </div>
  <div class="savebar"><span class="grow num">${T(`<b>${cnt.P + cnt.R}</b> présents · <b style="color:var(--stamp)">${cnt.A}</b> absents · ${cnt.R} retards · ${cnt.J} justifiés`, `<b>${cnt.P + cnt.R}</b> present · <b style="color:var(--stamp)">${cnt.A}</b> absent · ${cnt.R} late · ${cnt.J} excused`)}</span>
    <button class="btn red" data-a="ap-save" ${future || !S.canWrite ? 'disabled' : ''}>${doc ? T('Mettre à jour', 'Update') : T('Enregistrer l’appel', 'Save roll call')}</button></div>
  <p class="small muted">${T('Les parents des élèves absents ou en retard reçoivent un message dans l’application dès l’enregistrement.', 'Parents of absent or late pupils get a message in the app as soon as you save.')}</p>`}`;
}
async function saveAppel(accepting) {
  const p = S.profile, lv = p.role === 'teacher' ? p.level : (S.apLevel || LEVELS[0].id), ds = S.apDate;
  const key = attKey(lv, ds), prev = S.att[key], kids = byLevel(lv);
  const marks = {}; kids.forEach(k => marks[k.id] = S.draft.marks[k.id] || 'P');
  const reasons = {}; kids.forEach(k => { if (marks[k.id] === 'A' && S.draft.reasons[k.id]) reasons[k.id] = S.draft.reasons[k.id]; });
  const savedAt = nowISO();
  const ok = await write(async db => {
    await db.doc('attendance/' + key).set({year: YEAR, level: lv, date: ds, marks, reasons, justif: prev?.justif || {}, savedAt, by: p.name || ROLE_NAME()[p.role], history: [...(prev?.history || []).slice(-9), ...(prev ? [{at: prev.savedAt, by: prev.by}] : [])]});
    for (const k of kids) {
      const was = prev?.marks?.[k.id], now = marks[k.id], mid = `abs_${ds}_${k.id}`;
      if (now === 'A' || now === 'R') {
        if (was !== now) {
          const r = reasons[k.id], rEn = r ? (REASONS.find(x => x[0] === r) || [r, r])[1] : '';
          await db.doc('messages/' + mid).set({year: YEAR, kind: 'absence', studentId: k.id, phoneKey: digits(k.parentPhone), level: lv, day: ds, status: now, at: savedAt, from: p.name || 'Teacher', readBy: {},
            title: now === 'A' ? `${k.name} est absent(e)` : `${k.name} est arrivé(e) en retard`,
            body: `${now === 'A' ? 'Absence' : 'Retard'} enregistré(e) le ${frDate(ds)} en ${LV[lv].name}${r ? ' (motif : ' + r + ')' : ''}.${now === 'A' ? ' Vous pouvez justifier cette absence depuis l’application.' : ''}`,
            en: {title: now === 'A' ? `${k.name} is absent` : `${k.name} arrived late`,
              body: `${now === 'A' ? 'Absence' : 'Late arrival'} recorded on ${frDate(ds)} in ${LV[lv].name}${rEn ? ' (reason: ' + rEn + ')' : ''}.${now === 'A' ? ' You can explain this absence from the app.' : ''}`}});
        }
      } else if (was === 'A' || was === 'R') await db.doc('messages/' + mid).delete();
    }
  }, accepting ? T('Justificatif accepté', 'Note accepted') : T('Appel enregistré', 'Roll call saved'));
  if (ok) { S.draft.dirty = false; S.draft.savedAt = savedAt; }
}

/* ----- fees (direction) ----- */
function viewFrais() {
  const term = termOf(today());
  if (!feesSet()) return `<div class="section"><h2>${T('Frais de scolarité', 'School fees')}</h2><div class="panel empty"><b>${T('Les frais ne sont pas encore fixés', 'Fees have not been set yet')}</b><span>${T('Indiquez, pour chaque classe, les frais d’inscription et la scolarité de chaque trimestre.', 'For each class, enter the registration fee and the fees for each term.')}</span><button class="btn primary" data-a="tab" data-v="reglages">${T('Fixer les frais', 'Set the fees')}</button></div></div>${paymentsList(8)}`;
  const rows = LEVELS.map(l => { const fs = byLevel(l.id).map(feeStatus); return {l, n: fs.length, exp: fs.reduce((a, f) => a + f.total, 0), got: fs.reduce((a, f) => a + f.paid, 0), late: fs.filter(f => f.late > 0).length}; });
  const E = rows.reduce((a, r) => a + r.exp, 0), G = rows.reduce((a, r) => a + r.got, 0);
  const termGot = S.payments.filter(p => !p.cancelled && termOf(p.date) === term).reduce((a, p) => a + (+p.amount || 0), 0);
  return `
  <div class="section"><h2>${T('Frais de scolarité', 'School fees')}</h2>
    <div class="kpis">
      <div class="kpi"><span class="v">${money(G)}</span><span class="l">${T('encaissés sur l’année', 'collected this year')}</span></div>
      <div class="kpi"><span class="v">${money(Math.max(0, E - G))}</span><span class="l">${T('restant à percevoir', 'still to collect')}</span></div>
      <div class="kpi"><span class="v">${money(E)}</span><span class="l">${T('attendus pour l’année', 'expected for the year')}</span></div>
      <div class="kpi"><span class="v">${frDate(today() <= due1() ? due1() : due2())}</span><span class="l">${T('prochaine date limite de paiement', 'next payment deadline')}</span></div>
    </div>
  </div>
  <div class="section"><h3>${T('Par classe', 'By class')}</h3><div class="panel tbl"><table><thead><tr><th>${T('Classe', 'Class')}</th><th>${T('Élèves', 'Pupils')}</th><th>${T('Encaissé', 'Collected')}</th><th>${T('Taux', 'Rate')}</th><th>${T('En retard', 'Behind')}</th></tr></thead><tbody>
    ${rows.map(r => `<tr><td>${r.l.name}</td><td>${r.n}</td><td>${money(r.got)}</td><td>${r.exp ? Math.round(r.got / r.exp * 100) + ' %' : '—'}</td><td>${r.late ? `<span class="chip red">${r.late}</span>` : '0'}</td></tr>`).join('')}
  </tbody></table></div></div>
  <div class="btns"><button class="btn primary" data-a="tab" data-v="impayes">${T('Voir les impayés', 'See arrears')}</button><button class="btn" data-a="tab" data-v="recus">${T('Tous les reçus', 'All receipts')}</button><button class="btn" data-a="tab" data-v="encaisser">${T('Encaisser un paiement', 'Record a payment')}</button></div>
  ${paymentsList(6)}`;
}
function paymentsList(n) {
  const ps = S.payments.slice(0, n);
  return `<div class="section"><div class="section-head"><h3>${T('Derniers paiements', 'Latest payments')}</h3>${S.payments.length > n ? `<button class="btn ghost sm" data-a="tab" data-v="recus">${T('Tout voir', 'See all')}</button>` : ''}</div>
  ${ps.length ? `<div class="panel rows">${ps.map(payRow).join('')}</div>` : `<div class="panel empty">${T('Aucun paiement enregistré cette année.', 'No payments recorded this year.')}</div>`}</div>`;
}
function payRow(p) {
  return `<button class="row" data-a="receipt" data-v="${p.id}"><span class="grow"><span class="name">${esc(p.studentName)}</span><br><span class="small muted">${objName(p.object)} · ${frDate(p.date)} · ${METHODS()[p.method] || ''}</span></span><span class="num" style="text-align:right">${p.cancelled ? `<span class="chip red">${T('Annulé', 'Cancelled')}</span>` : `<b>${money(p.amount)}</b>`}<br><span class="small muted">N° ${esc(p.receiptLabel)}</span></span></button>`;
}

/* ----- accountant ----- */
const matchQ = (s, q) => { const t = q.toLowerCase(), dq = q.replace(/\D/g, ''); return !t || s.name.toLowerCase().includes(t) || (s.parentName || '').toLowerCase().includes(t) || (dq.length > 2 && digits(s.parentPhone).includes(dq)); };
function viewEncaisser() {
  const list = activeStudents().filter(s => matchQ(s, S.q || ''));
  const todayGot = S.payments.filter(p => !p.cancelled && p.date === today()).reduce((a, p) => a + (+p.amount || 0), 0);
  return `
  <div class="section"><div class="section-head"><h2>${T('Encaisser', 'Collect fees')}</h2><span class="chip green num">${T('Aujourd’hui', 'Today')} : ${money(todayGot)}</span></div>
    ${!feesSet() ? `<div class="banner warn small">${T('Les montants des frais ne sont pas encore fixés par la direction : les soldes ne peuvent pas être calculés.', 'The head office has not set the fee amounts yet, so balances cannot be worked out.')}</div>` : ''}
    <label class="f">${T('Rechercher un élève ou un parent', 'Find a pupil or a parent')}<input id="q" type="search" placeholder="${T('Nom de l’élève, du parent ou téléphone', 'Pupil’s name, parent’s name or phone')}" value="${esc(S.q || '')}" data-input="q" autocomplete="off"></label>
  </div>
  ${activeStudents().length === 0 ? `<div class="panel empty"><b>${T('Aucun élève inscrit', 'No pupils registered')}</b><span>${T('La direction ajoute les élèves ; vous pourrez ensuite encaisser leurs paiements.', 'The head office adds the pupils; you can then record their payments.')}</span></div>` :
  `<div class="panel rows" id="enc-list">${encRows(list)}</div>`}
  ${paymentsList(5)}`;
}
function encRows(list) {
  return list.slice(0, 40).map(s => { const f = feeStatus(s); return `<button class="row" data-a="pay" data-v="${s.id}"><span class="grow"><span class="name">${esc(s.name)}</span><br><span class="small muted">${LV[s.level]?.name} · ${esc(s.parentName || '')}</span></span><span class="num small" style="text-align:right">${feesSet() ? (f.balance ? `${T('Reste', 'Balance')}<br><b>${money(f.balance)}</b>` : `<span class="chip green">${T('Soldé', 'Paid up')}</span>`) : ''}</span></button>`; }).join('') || `<div class="empty">${T('Aucun élève ne correspond.', 'No pupil matches.')}</div>`;
}
function viewImpayes() {
  const lv = S.impLevel || 'all';
  const rows = activeStudents().filter(s => lv === 'all' || s.level === lv).map(s => ({s, f: feeStatus(s)})).filter(x => x.f.late > 0).sort((a, b) => b.f.late - a.f.late);
  const total = rows.reduce((a, x) => a + x.f.late, 0);
  return `
  <div class="section"><div class="section-head"><h2>${T('Impayés', 'Arrears')}</h2><span class="chip red num">${money(total)}</span></div>
    <p class="small muted" style="margin:0">${T(`Montants échus et non payés. Dates limites : 1re tranche le ${frDate(due1())}, 2e tranche le ${frDate(due2())}.`, `Amounts due and not paid. Deadlines: 1st installment ${frDate(due1())}, 2nd installment ${frDate(due2())}.`)}</p>
    <div class="seg" role="group" aria-label="${T('Classe', 'Class')}"><button data-a="imp-level" data-v="all" aria-pressed="${lv === 'all'}">${T('Toutes', 'All')}</button>${LEVELS.map(l => `<button data-a="imp-level" data-v="${l.id}" aria-pressed="${l.id === lv}">${l.name}</button>`).join('')}</div>
  </div>
  ${!feesSet() ? `<div class="panel empty"><b>${T('Frais non fixés', 'Fees not set')}</b><span>${T('La direction doit d’abord renseigner les montants dans les réglages.', 'The head office must first enter the amounts in Settings.')}</span></div>` :
  rows.length ? `<div class="panel rows">${rows.map(({s, f}) => `<div class="row"><span class="grow"><button class="btn ghost sm" style="padding:0;min-height:0" data-a="student" data-v="${s.id}"><span class="name">${esc(s.name)}</span></button><br><span class="small muted">${LV[s.level]?.name} · ${T('payé', 'paid')} ${money(f.paid)} ${T('sur', 'of')} ${money(f.due)} ${T('échus', 'due')}</span></span><span class="num" style="text-align:right"><b style="color:var(--stamp)">${money(f.late)}</b><br><button class="btn sm" data-a="remind" data-v="${s.id}" ${S.canWrite ? '' : 'disabled'}>${T('Relancer', 'Remind')}</button></span></div>`).join('')}</div>
    <button class="btn primary" data-a="remind-all" ${S.canWrite ? '' : 'disabled'}>${T(`Relancer les ${rows.length} famille${rows.length > 1 ? 's' : ''}`, `Remind all ${rows.length} famil${rows.length > 1 ? 'ies' : 'y'}`)}</button>` :
  `<div class="panel empty"><b>${T('Aucun impayé', 'No arrears')}</b><span>${T('Toutes les familles sont à jour pour ce trimestre.', 'Every family is up to date for this term.')}</span></div>`}`;
}
function viewRecus() {
  return `<div class="section"><div class="section-head"><h2>${T('Reçus', 'Receipts')} ${YEAR}</h2><span class="muted small">${pl(S.payments.length, 'reçu', 'reçus', 'receipt', 'receipts')}</span></div>
  ${S.payments.length ? `<div class="panel rows">${S.payments.map(payRow).join('')}</div>` : `<div class="panel empty"><b>${T('Aucun reçu', 'No receipts yet')}</b><span>${T('Chaque paiement encaissé génère un reçu numéroté au modèle de l’école.', 'Each payment produces a numbered receipt in the school’s own layout.')}</span></div>`}</div>`;
}
async function remind(ids) {
  const at = nowISO();
  await write(async db => {
    for (const id of ids) { const s = student(id); if (!s) continue; const f = feeStatus(s);
      await db.collection('messages').doc('rem_' + today() + '_' + id).set({year: YEAR, kind: 'reminder', studentId: id, phoneKey: digits(s.parentPhone), level: s.level, at, readBy: {}, from: S.profile.name || 'Bursar',
        title: 'Rappel de paiement',
        body: `Les frais de scolarité de ${s.name} (${LV[s.level].name}) présentent un montant échu non réglé de ${money(f.late)}. Solde de l’année : ${money(f.balance)}. Merci de passer au guichet de l’école ou de payer par Orange Money / MTN Mobile Money.`,
        en: {title: 'Fee reminder', body: `The school fees for ${s.name} (${LV[s.level].name}) have an unpaid amount due of ${money(f.late)}. Balance for the year: ${money(f.balance)}. Please pay at the school office or by Orange Money / MTN Mobile Money.`}}); }
  }, ids.length > 1 ? T('Relances envoyées', 'Reminders sent') : T('Relance envoyée', 'Reminder sent'));
}

/* ----- messages ----- */
function msgVisibleToParent(m, kids) {
  if (m.kind === 'announce') return m.scope === 'all' || kids.some(k => m.scope === LV[k.level]?.sec || m.scope === k.level);
  return kids.some(k => k.id === m.studentId);
}
function parentKids() { const ph = digits(S.profile?.phone); return ph.length >= 8 ? S.students.filter(s => s.status !== 'left' && digits(s.parentPhone) === ph) : []; }
function parentUnread() { const kids = parentKids(); return S.messages.filter(m => msgVisibleToParent(m, kids) && !(m.readBy || {})[S.me] && m.fromRole !== 'parent').length; }
const SCOPE_NAME = sc => sc === 'all' ? T('Toute l’école', 'Whole school') : sc === 'nursery' ? T('Maternelle', 'Nursery') : sc === 'primary' ? T('Primaire', 'Primary') : (LV[sc]?.name || sc);
function msgRow(m) {
  const kindChip = {announce: `<span class="chip blue">${SCOPE_NAME(m.scope)}</span>`, absence: `<span class="chip red">${m.status === 'R' ? T('Retard', 'Late') : T('Absence', 'Absence')}</span>`, reminder: `<span class="chip amber">${T('Paiement', 'Fees')}</span>`, receipt: `<span class="chip green">${T('Reçu', 'Receipt')}</span>`}[m.kind] || '';
  const reads = Object.keys(m.readBy || {}).length, body = mBody(m) || '';
  const unread = S.profile.role === 'parent' && !(m.readBy || {})[S.me];
  return `<button class="row" data-a="open-msg" data-v="${m.id}" style="align-items:flex-start"><span class="grow"><span class="name">${unread ? '● ' : ''}${esc(mTitle(m))}</span><br><span class="small muted">${esc(body.slice(0, 110))}${body.length > 110 ? '…' : ''}</span><br><span class="small muted">${esc(m.from || '')} · ${timeAgo(m.at)}${m.kind === 'announce' && S.profile.role !== 'parent' ? ' · ' + T(`lu par ${reads} parent${reads > 1 ? 's' : ''}`, `read by ${reads} parent${reads === 1 ? '' : 's'}`) : ''}</span></span>${kindChip}</button>`;
}
function viewMessages() {
  const p = S.profile;
  if (p.role === 'parent') {
    const kids = parentKids();
    const list = S.messages.filter(m => m.kind !== 'chat' && msgVisibleToParent(m, kids));
    return `<div class="section"><h2>${T('Messages', 'Messages')}</h2>
      ${kids.map(k => `<button class="row panel" data-a="chat" data-v="${k.id}">${ICON.msg}<span class="grow"><span class="name">${T('Écrire à', 'Write to')} ${esc(teacherOf(k.level) || T('l’enseignant', 'the teacher'))}</span><br><span class="small muted">${T('Enseignant titulaire de', 'Class teacher of')} ${LV[k.level]?.name} · ${T('au sujet de', 'about')} ${esc(k.name)}</span></span>${chatUnread(k.id) ? `<span class="chip red">${chatUnread(k.id)}</span>` : ''}</button>`).join('')}
      </div>
      <div class="section"><h3>${T('De l’école', 'From the school')}</h3>${list.length ? `<div class="panel rows">${list.map(msgRow).join('')}</div>` : `<div class="panel empty">${T('Aucun message pour le moment.', 'No messages yet.')}</div>`}</div>`;
  }
  const isT = p.role === 'teacher';
  const ann = S.messages.filter(m => m.kind === 'announce' && (!isT || m.scope === 'all' || m.scope === p.level || m.scope === LV[p.level]?.sec));
  const kids = isT ? byLevel(p.level) : activeStudents();
  const threads = kids.map(k => ({k, last: S.messages.find(m => m.kind === 'chat' && m.studentId === k.id)})).filter(t => isT || t.last).sort((a, b) => (b.last?.at || '').localeCompare(a.last?.at || ''));
  return `
  <div class="section"><div class="section-head"><h2>${T('Messages', 'Messages')}</h2><button class="btn primary sm" data-a="compose">${isT ? T('Message à la classe', 'Message the class') : T('Nouvelle annonce', 'New announcement')}</button></div></div>
  <div class="section"><h3>${isT ? T('Parents de ', 'Parents of ') + LV[p.level].name : T('Échanges parents – enseignants', 'Parent – teacher conversations')}</h3>
    ${threads.length ? `<div class="panel rows">${threads.map(({k, last}) => `<button class="row" data-a="chat" data-v="${k.id}"><span class="grow"><span class="name">${esc(k.parentName || 'Parent')} · ${esc(k.name)}</span><br><span class="small muted">${last ? esc((last.fromRole === 'parent' ? '' : T('Vous : ', 'You: ')) + last.body.slice(0, 70)) : T('Aucun message', 'No messages')}</span></span>${last ? `<span class="small muted">${timeAgo(last.at).split(' · ')[0]}</span>` : ''}${chatUnread(k.id) ? `<span class="chip red">${chatUnread(k.id)}</span>` : ''}</button>`).join('')}</div>` : `<div class="panel empty">${isT ? T('Aucun élève dans la classe.', 'No pupils in this class.') : T('Aucun échange entre parents et enseignants pour le moment.', 'No parent – teacher conversations yet.')}</div>`}
  </div>
  <div class="section"><h3>${T('Annonces', 'Announcements')}</h3>${ann.length ? `<div class="panel rows">${ann.map(msgRow).join('')}</div>` : `<div class="panel empty">${T('Aucune annonce envoyée.', 'No announcements sent.')}</div>`}</div>`;
}
function chatUnread(sid) {
  const mine = S.profile.role === 'parent' ? 'parent' : 'school';
  return S.messages.filter(m => m.kind === 'chat' && m.studentId === sid && (m.fromRole === 'parent' ? 'parent' : 'school') !== mine && !(m.readBy || {})[S.me]).length;
}

/* ----- parent ----- */
function viewEnfant() {
  const kids = parentKids();
  if (!kids.length) return `<div class="panel empty"><b>${T('Aucun enfant associé', 'No child linked')}</b><span>${T('Le numéro de téléphone saisi ne correspond à aucun élève. Vérifiez auprès de l’école que votre numéro est bien enregistré.', 'The phone number you entered does not match any pupil. Check with the school that your number is on record.')}</span><button class="btn primary" data-a="logout">${T('Se déconnecter', 'Sign out')}</button></div>`;
  const k = student(kids.some(x => x.id === S.kid) ? S.kid : kids[0].id);
  const term = termOf(today()), c = attCounts(k.id, term), f = feeStatus(k);
  const abs = Object.values(S.att).filter(d => d.marks?.[k.id] === 'A' || d.marks?.[k.id] === 'R').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const pays = S.payments.filter(p => p.studentId === k.id);
  return `
  ${kids.length > 1 ? `<div class="seg" role="group" aria-label="${T('Enfant', 'Child')}">${kids.map(x => `<button data-a="kid" data-v="${x.id}" aria-pressed="${x.id === k.id}">${esc(x.name.split(' ')[0])}</button>`).join('')}</div>` : ''}
  <div style="display:flex;gap:14px;align-items:center">${photoBox(k, 64)}<div class="section" style="flex:1;min-width:0"><div class="section-head"><h2>${esc(k.name)}</h2><span class="chip blue">${LV[k.level]?.name}</span></div>
    <span class="small muted">${T('Enseignant titulaire', 'Class teacher')} : ${esc(teacherOf(k.level) || T('à renseigner par l’école', 'not set yet'))}</span><span class="small muted">${T('Horaires', 'School hours')} : ${PUPIL_HOURS(k.level).join(' – ')}</span></div></div>
  <button class="btn" data-a="card" data-v="${k.id}">${ICON.qr} ${T('Carte d’élève à présenter', 'Pupil’s card to show')}</button>
  <div class="section"><h3>${T('Présences', 'Attendance')} · ${TERMS[term]}</h3>
    <div class="kpis"><div class="kpi"><span class="v">${c.days ? Math.round((c.P + c.R) / c.days * 100) + ' %' : '—'}</span><span class="l">${T('présence sur ', 'present over ')}${pl(c.days, 'jour', 'jours', 'day', 'days')}</span></div>
    <div class="kpi"><span class="v" style="color:${c.A ? 'var(--stamp)' : 'inherit'}">${c.A}</span><span class="l">${T(`absence${c.A > 1 ? 's' : ''} · ${c.R} retard${c.R > 1 ? 's' : ''} · ${c.J} justifiée${c.J > 1 ? 's' : ''}`, `absence${c.A === 1 ? '' : 's'} · ${c.R} late · ${c.J} excused`)}</span></div></div>
    ${abs.length ? `<div class="panel rows">${abs.map(d => { const m = d.marks[k.id], j = d.justif?.[k.id]; return `<div class="row"><span class="grow"><span class="name">${cap(longDay(d.date))}</span><br><span class="small muted">${m === 'A' ? T('Absent(e)', 'Absent') : T('En retard', 'Late')}${d.reasons?.[k.id] ? ' · ' + esc(reasonName(d.reasons[k.id])) : ''}${j ? ' · ' + T('justificatif envoyé', 'note sent') : ''}</span></span>${m === 'A' && !j ? `<button class="btn sm" data-a="justify" data-v="${d.id}" data-s="${k.id}" ${S.canWrite ? '' : 'disabled'}>${T('Justifier', 'Explain')}</button>` : `<span class="chip ${m === 'A' ? 'blue' : 'amber'}">${m === 'A' ? T('En attente', 'Pending') : T('Retard', 'Late')}</span>`}</div>`; }).join('')}</div>` : ''}
  </div>
  <div class="section"><h3>${T('Frais de scolarité', 'School fees')} ${YEAR}</h3>
    ${feesSet() ? `<div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:10px">
      <div class="section-head"><span>${T('Payé', 'Paid')} <b class="num">${money(f.paid)}</b></span><span class="muted small num">${T('sur', 'of')} ${money(f.total)}</span></div>
      <div class="bar"><i style="width:${f.total ? Math.min(100, f.paid / f.total * 100) : 0}%"></i></div>
      ${f.late ? `<div class="banner red small">${T('Montant échu à régler', 'Amount now due')} : <b class="num">${money(f.late)}</b></div>` : `<div class="banner info small">${T('Vous êtes à jour. Reste pour l’année', 'You are up to date. Left for the year')} : <b class="num">${money(f.balance)}</b>${f.balance ? T(`, avant le ${frDate(today() <= due1() ? due1() : due2())}`, `, by ${frDate(today() <= due1() ? due1() : due2())}`) : ''}.</div>`}
      ${feeBreakdown(k.level)}
      <span class="small muted">${T('Paiement au guichet de l’école, ou par Orange Money / MTN Mobile Money. Tél. de l’école', 'Pay at the school office, or by Orange Money / MTN Mobile Money. School phone')} : <b>${SCHOOL.tel}</b></span>
    </div>` : `<div class="panel empty">${T('Les montants des frais seront affichés dès que l’école les aura saisis.', 'Fee amounts will show here once the school has entered them.')}</div>`}
  </div>
  <div class="section"><h3>${T('Reçus', 'Receipts')}</h3>${pays.length ? `<div class="panel rows">${pays.map(payRow).join('')}</div>` : `<div class="panel empty">${T('Aucun paiement enregistré cette année.', 'No payments recorded this year.')}</div>`}</div>`;
}

/* ----- pupils ----- */
function viewEleves() {
  const p = S.profile, isT = p.role === 'teacher';
  const f = isT ? p.level : S.filter;
  const list = activeStudents().filter(s => f === 'all' || s.level === f);
  const canAdd = isMgr(p.role) || p.role === 'secretary';
  return `
  <div class="section"><div class="section-head"><h2>${T('Élèves', 'Pupils')}</h2><span class="btns">${canManageCards() && f !== 'all' && list.length ? `<button class="btn sm" data-a="class-cards" data-v="${f}">${T('Cartes de la classe', 'Class cards')}</button>` : ''}${canAdd ? `<button class="btn primary sm" data-a="add-student" data-v="${f === 'all' ? '' : f}">${T('Ajouter', 'Add')}</button>` : ''}</span></div>
    ${!isT ? `<div class="seg" role="group" aria-label="${T('Classe', 'Class')}"><button data-a="filter" data-v="all" aria-pressed="${f === 'all'}">${T('Toutes', 'All')} (${activeStudents().length})</button>${LEVELS.map(l => `<button data-a="filter" data-v="${l.id}" aria-pressed="${l.id === f}">${l.name} (${byLevel(l.id).length})</button>`).join('')}</div>` : `<span class="muted small">${LV[f].name} · ${pl(list.length, 'élève', 'élèves', 'pupil', 'pupils')}</span>`}
  </div>
  ${list.length ? `<div class="panel rows">${list.map(s => { const c = attCounts(s.id, termOf(today())); return `<button class="row" data-a="student" data-v="${s.id}"><span class="grow"><span class="name">${esc(s.name)}${s.demo ? ` <span class="chip grey">${T('exemple', 'sample')}</span>` : ''}</span><br><span class="small muted">${f === 'all' ? LV[s.level]?.name + ' · ' : ''}${esc(s.parentName || T('Parent non renseigné', 'No parent on record'))} · ${esc(s.parentPhone || '')}</span></span>${c.A ? `<span class="chip red num">${c.A} abs.</span>` : ''}</button>`; }).join('')}</div>`
  : `<div class="panel empty"><b>${T('Aucun élève', 'No pupils')}${f !== 'all' ? T(' dans ', ' in ') + LV[f].name : ''}</b>${canAdd ? `<span>${T('Ajoutez-les un par un, ou collez la liste complète de la classe.', 'Add them one by one, or paste the whole class list.')}</span><button class="btn primary" data-a="add-student" data-v="${f === 'all' ? '' : f}">${T('Ajouter des élèves', 'Add pupils')}</button>` : ''}</div>`}`;
}

/* ----- direction: more, settings, profile ----- */
function feeBreakdown(lv) {
  const f = feesOf(lv), parts = FEE_PARTS.filter(([k]) => f[k]);
  return `<div class="tbl"><table><thead><tr><th>${T('Frais', 'Item')}</th><th>${T('1re tranche', '1st inst.')}</th><th>${T('2e tranche', '2nd inst.')}</th><th>Total</th></tr></thead><tbody>
    ${parts.map(([k, fr, en]) => { const second = k === 'inst2'; const lab = k === 'inst1' || k === 'inst2' ? T('Scolarité', 'Tuition') : T(fr, en); return {k, lab, second}; }).filter(x => x.k !== 'inst2').map(x => x.k === 'inst1'
      ? `<tr><td>${T('Scolarité', 'Tuition')}</td><td>${money(f.inst1)}</td><td>${f.inst2 ? money(f.inst2) : '/'}</td><td>${money(f.inst1 + f.inst2)}</td></tr>`
      : `<tr><td>${x.lab}</td><td>${money(f[x.k])}</td><td>/</td><td>${money(f[x.k])}</td></tr>`).join('')}
    <tr><td><b>Total</b></td><td><b>${money(firstInst(f))}</b></td><td><b>${money(f.inst2)}</b></td><td><b>${money(firstInst(f) + f.inst2)}</b></td></tr>
    <tr><td class="small muted">${T('Date limite', 'Deadline')}</td><td class="small muted">${frDate(due1())}</td><td class="small muted">${frDate(due2())}</td><td></td></tr>
  </tbody></table></div>`;
}
function viewEcole() {
  const groups = [['nursery', T('Maternelle (Pre-Nursery, Nursery 1 et 2)', 'Nursery (Pre-Nursery, Nursery 1 & 2)'), 'N1'], ['primary', T('Primaire, Class 1 à 5', 'Primary, Class 1 to 5'), 'C1'], ['c6', T('Primaire, Class 6', 'Primary, Class 6'), 'C6']];
  const li = a => `<ul style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px">${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
  return `
  <div class="section"><div style="display:flex;gap:14px;align-items:center"><div class="logo-tile" style="width:84px;height:56px"><img src="${LOGO}" alt="" style="width:76px"></div><div><h2>${SCHOOL.name}</h2><span class="small muted">Les Yeux du Cœur / Eyes of the Heart · Bilingual Nursery and Primary School (L.Y.C)</span></div></div>
    <div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:4px" >
      <span class="small">${T('Ministère de l’Éducation de base · Autorisation N°', 'Ministry of Basic Education · Authorisation N°')} ${SCHOOL.auth}</span>
      <span>${T('Adresse', 'Address')} : <b>${SCHOOL.addr}</b>, ${T('Cameroun', 'Cameroon')}</span>
      <span>${T('Téléphone', 'Phone')} : <b>(+237) ${SCHOOL.tel}</b></span>
      <span>E-mail : <b>${SCHOOL.email}</b></span>
      <i class="muted">Motto : ${SCHOOL.motto} · ${SCHOOL.motto2}</i>
    </div></div>
  <div class="section"><h3>${T('Horaires', 'Opening hours')}</h3><div class="panel tbl"><table><thead><tr><th>${T('Classe', 'Class')}</th><th>${T('Horaires', 'Time')}</th></tr></thead><tbody>
    <tr><td>${T('Maternelle', 'Nursery')}</td><td>07:30 – 13:00</td></tr><tr><td>Primary (1-5)</td><td>07:30 – 14:30</td></tr><tr><td>Primary 6</td><td>07:30 – 17:00</td></tr><tr><td>${T('Personnel enseignant', 'Teaching staff')}</td><td>${startTime()} – ${endTime()}</td></tr>
  </tbody></table></div></div>
  <div class="section"><h3>${T('Frais de scolarité', 'School fees')} ${YEAR}</h3>
    ${groups.map(([g, name, lv]) => `<div class="panel" style="padding:12px 14px;display:flex;flex-direction:column;gap:6px"><b>${name}</b>${feeBreakdown(lv)}</div>`).join('')}
    <p class="small muted" style="margin:0">${T('Ces frais ne comprennent pas les livres : une liste est remise aux parents pour les acheter en librairie, ou s’adresser à la secrétaire. Tenue de sport disponible à l’école : 3 500 F.', 'These fees do not include books: a booklist is given to parents to buy from bookshops, or contact the secretary. Sportswear available in school: 3 500 F.')}</p></div>
  <div class="section"><h3>${T('Conditions d’admission', 'Admission requirements')}</h3><div class="panel" style="padding:14px">${li([T('Chemise cartonnée', 'File jacket'), T('Photocopie de l’acte de naissance', 'Photocopy of birth certificate'), T('Photocopie du carnet de vaccination (maternelle)', 'Photocopy of vaccination card for nursery'), T('Bulletin scolaire pour les nouveaux élèves', 'Report card for new pupils')])}</div></div>
  <div class="section"><h3>${T('Formalités d’inscription : à apporter', 'Registration formalities: to bring')}</h3><div class="panel" style="padding:14px">${li([T('Photocopie de l’acte de naissance (1)', 'Photocopy of birth certificate (01)'), T('Chemise cartonnée (1)', 'File jacket (01)'), T('Rame de papier (1)', 'Ream of papers (01)'), T('Rouleaux de papier hygiénique (3)', 'Rolls of toilet paper (03)'), T('Savon en cube (1)', 'Soap cubes (01)'), T('Uniformes scolaires (2)', 'School uniforms (02)'), T('Tenue de sport (1)', 'Set of sportswear (01)')])}</div></div>
  <div class="section"><h3>${T('Uniformes', 'Uniforms')}</h3><div class="grid2">
    <div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:6px"><b>${T('Garçons', 'Boys')}</b>${li([T('2 chemises blanches, col et poche roses', '2 white shirts with pink collar and pink pocket'), T('Chaussures ou sandales noires', 'Black shoes or sandals'), T('Chaussettes blanches', 'White socks'), T('Tenue de sport à l’école (3 500 F)', 'Sportswear available in school (3 500 F)')])}</div>
    <div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:6px"><b>${T('Filles', 'Girls')}</b>${li([T('2 chemisiers blancs à pèlerine', '2 white blouses with cape'), T('2 jupes-chasubles roses', '2 pink pinafore skirts'), T('Chaussures ou sandales noires', 'Black shoes or sandals'), T('Chaussettes blanches', 'White socks'), T('Tenue de sport à l’école (3 500 F)', 'Sportswear available in school (3 500 F)'), T('Tenue de cérémonie : modèle à l’école', 'Ceremonial wear: sample in school')])}</div>
  </div></div>
  <div class="section"><h3>${T('Coiffure', 'Hairstyle')}</h3><div class="panel" style="padding:14px">${li([T('Garçons : cheveux proprement rasés', 'Boys: neatly shaved hair'), T('Filles : tresses nettes (bakala), sans mèches ajoutées', 'Girls: neat cornrows (bakala), no mesh attached')])}</div></div>`;
}
function viewPlus() {
  const items = [['ecole', T('L’école : brochure', 'School: brochure'), T('Horaires, frais, admission, uniformes', 'Hours, fees, admission, uniforms'), 'home'], ['eleves', T('Élèves', 'Pupils'), T('Inscriptions, fiches et parents', 'Enrolment, records and parents'), 'kids'], ['stats', T('Statistiques comparées', 'Year-on-year statistics'), T('Effectifs et résultats Common Entrance / FSLC', 'Enrolment and Common Entrance / FSLC results'), 'stats'], ['recus', T('Reçus', 'Receipts'), T('Tous les reçus de l’année', 'All receipts this year'), 'receipt'], ['impayes', T('Impayés', 'Arrears'), T('Relancer les familles', 'Remind families'), 'alert'], ['acces', T('Accès à l’application', 'App access'), T('Comptes, codes et envoi par WhatsApp', 'Accounts, codes and sending by WhatsApp'), 'user'], ['personnel', T('Présences du personnel', 'Staff attendance'), T('Arrivées, départs et retards des enseignants et de la directrice', 'Arrival, departure and lateness of teachers and head teacher'), 'clock'], ['reglages', T('Réglages', 'Settings'), T('Frais, enseignants, seuil d’absences', 'Fees, teachers, absence threshold'), 'gear'], ['profil', T('Mon profil', 'My profile'), T('Changer de profil', 'Change profile'), 'user']];
  return `<div class="section"><h2>${T('Plus', 'More')}</h2><div class="panel rows">${items.filter(i => isAdmin() || !['reglages', 'acces'].includes(i[0])).map(i => `<button class="row" data-a="tab" data-v="${i[0]}"><span style="color:var(--carbon)">${ICON[i[3]]}</span><span class="grow"><span class="name">${i[1]}</span><br><span class="small muted">${i[2]}</span></span></button>`).join('')}</div></div>`;
}
function viewReglages() {
  const c = cfg(), fees = c.fees || {}, t = c.teachers || {};
  const hasDemo = S.students.some(s => s.demo);
  return `
  <form data-form="settings" class="section">
    <div class="section-head"><h2>${T('Réglages', 'Settings')}</h2><button class="btn primary sm" type="submit" ${S.canWrite ? '' : 'disabled'}>${T('Enregistrer', 'Save')}</button></div>
    <div class="section"><h3>${T('Enseignants titulaires', 'Class teachers')}</h3><div class="panel" style="padding:14px"><div class="grid2">
      ${LEVELS.map(l => `<label class="f">${l.name}<input id="t-${l.id}" name="t-${l.id}" value="${esc(t[l.id] || '')}" placeholder="${T('Nom de l’enseignant', 'Teacher’s name')}"></label>`).join('')}
    </div></div></div>
    <div class="section"><h3>${T('Frais de scolarité (FCFA)', 'School fees (FCFA)')}</h3><p class="small muted" style="margin:0">${T('Montants de la brochure 2026-2027, modifiables. La 1re tranche regroupe inscription, scolarité 1re partie, examen et articles.', 'Amounts from the 2026-2027 brochure, editable. The 1st installment covers registration, tuition part 1, examination and articles.')}</p>
      <div class="panel tbl"><table><thead><tr><th>${T('Classe', 'Class')}</th>${FEE_PARTS.map(p => `<th>${T(p[1], p[2])}</th>`).join('')}<th>Total</th></tr></thead><tbody>
      ${LEVELS.map(l => { const f = feesOf(l.id); return `<tr><td>${l.name}</td>${FEE_PARTS.map(([k]) => `<td><input id="f-${l.id}-${k}" name="f-${l.id}-${k}" inputmode="numeric" value="${f[k]}" style="min-width:86px;text-align:right" aria-label="${l.name} ${k}"></td>`).join('')}<td><b>${money(firstInst(f) + f.inst2)}</b></td></tr>`; }).join('')}
      </tbody></table></div>
      <div class="grid2"><label class="f">${T('Date limite 1re tranche', '1st installment deadline')}<input id="due1" name="due1" type="date" value="${due1()}"></label><label class="f">${T('Date limite 2e tranche', '2nd installment deadline')}<input id="due2" name="due2" type="date" value="${due2()}"></label></div>
      <button class="btn sm" type="button" data-a="brochure-fees">${T('Remettre les tarifs de la brochure', 'Reset to brochure fees')}</button>
    </div>
    <div class="section"><h3>${T('Personnel', 'Staff')}</h3><div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:10px"><label class="f">${T('Nom de la directrice', 'Head teacher’s name')}<input id="dir-name" name="dir-name" value="${esc(c.directorName || '')}"></label><div class="grid2"><label class="f">${T('Assistante directrice', 'Assistant head teacher')}<input id="adj-name" name="adj-name" value="${esc(c.assistantName || '')}"></label><label class="f">${T('Secrétaire', 'Secretary')}<input id="sec-name" name="sec-name" value="${esc(c.secretaryName || '')}"></label></div><div class="grid2"><label class="f">${T('Heure d’arrivée attendue', 'Expected arrival')}<input id="start-t" name="start-t" type="time" value="${startTime()}"></label><label class="f">${T('Heure de départ attendue', 'Expected departure')}<input id="end-t" name="end-t" type="time" value="${endTime()}"></label></div><label class="f">${T('Écart toléré entre le pointage et la secrétaire (minutes)', 'Allowed gap between clock-in and secretary (minutes)')}<input id="gap-t" name="gap-t" type="number" min="1" value="${c.gapTolerance || 10}"></label></div></div>
    <div class="section"><h3>${T('Présences', 'Attendance')}</h3><label class="f">${T('Alerter la direction à partir de', 'Alert the head office from')}<span class="hint">${T('nombre d’absences dans le trimestre', 'number of absences in the term')}</span><input id="abs-th" name="abs-th" type="number" min="1" value="${c.absenceThreshold || 5}"></label></div>
  </form>
  <div class="section"><h3>${T('Données d’exemple', 'Sample data')}</h3><div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:8px">
    <span class="small muted">${T('Pour essayer l’application avant de saisir les vrais élèves : 3 élèves fictifs par classe, marqués « exemple ».', 'To try the app before entering real pupils: 3 made-up pupils per class, marked “sample”.')}</span>
    <div class="btns"><button class="btn sm" data-a="demo-load" ${hasDemo || !S.canWrite ? 'disabled' : ''}>${T('Charger des exemples', 'Load samples')}</button><button class="btn sm" data-a="demo-clear" ${!hasDemo || !S.canWrite ? 'disabled' : ''}>${T('Effacer les exemples', 'Remove samples')}</button></div>
  </div></div>`;
}
function viewProfil() {
  const p = S.profile;
  return `<div class="section"><h2>${T('Mon profil', 'My profile')}</h2>
    <div class="panel rows"><div class="row"><span class="grow"><span class="name">${esc(p.role === 'parent' ? (parentKids()[0]?.parentName || p.phone) : p.name || '')}</span><br><span class="small muted">${ROLE_NAME()[p.role]}${p.level ? ' · ' + LV[p.level].name : ''}${p.phone ? ' · ' + esc(p.phone) : ''}</span></span></div>
    <div class="row"><span class="grow"><span class="name">${T('Langue', 'Language')}</span><br><span class="small muted">${EN() ? 'English' : 'Français'}</span></span>${langBtn()}</div></div>
    <button class="btn" data-a="logout">${T('Se déconnecter', 'Sign out')}</button></div>
    ${myStaffKey() ? (() => { const o = staffMonth(myStaffKey(), today().slice(0, 7)); return `<div class="section"><h3>${T('Mes présences ce mois', 'My attendance this month')}</h3><div class="kpis"><div class="kpi"><span class="v">${o.present}</span><span class="l">${T('jours pointés', 'days clocked in')}</span></div><div class="kpi"><span class="v">${o.late}</span><span class="l">${T('retards', 'late arrivals')} · ${T('arrivée moy.', 'avg in')} ${o.avgIn}</span></div></div></div>`; })() : ''}
    <div class="section"><div class="section-head"><h3>${T('L’école', 'The school')}</h3><button class="btn ghost sm" data-a="tab" data-v="ecole">${T('Brochure', 'Brochure')}</button></div><div class="panel" style="padding:14px;display:flex;gap:14px;align-items:center">
      <div class="logo-tile" style="width:96px;height:64px"><img src="${LOGO}" alt="" style="width:88px"></div>
      <div class="small"><b>${SCHOOL.name}</b><br>${SCHOOL.sub}<br>${SCHOOL.addr}<br>Tel. ${SCHOOL.tel}<br><i class="muted">${EN() ? SCHOOL.motto : SCHOOL.motto2}</i></div></div></div>`;
}

/* ----- statistics ----- */
function curYearStats() { const enrol = {}; LEVELS.forEach(l => enrol[l.id] = byLevel(l.id).filter(s => !s.demo).length); return {year: YEAR, enrol, ...(S.stats[YEAR] || {})}; }
function allYears() {
  const ys = {...S.stats}; ys[YEAR] = {...curYearStats(), ...(S.stats[YEAR]?.enrolLocked ? {enrol: S.stats[YEAR].enrol} : {})};
  return Object.keys(ys).sort().map(y => ({...ys[y], year: y}));
}
const totalEnrol = y => Object.values(y.enrol || {}).reduce((a, n) => a + (+n || 0), 0);
const rate = e => e && +e.cand ? Math.round(+e.pass / +e.cand * 1000) / 10 : null;
function viewStats() {
  const ys = allYears().slice(-6);
  const [c1, c2] = charts(ys);
  return `
  <div class="section"><div class="section-head"><h2>${T('Statistiques comparées', 'Year-on-year statistics')}</h2><button class="btn primary sm" data-a="stat-edit" data-v="">${T('Saisir une année', 'Add a year')}</button></div>
    <p class="small muted" style="margin:0">${T('L’année en cours se calcule à partir des élèves inscrits. Les années passées et les résultats d’examens se saisissent une fois.', 'The current year is counted from registered pupils. Past years and exam results are entered once.')}</p></div>
  <div class="section"><h3>${T('Effectifs de l’école', 'School enrolment')}</h3><div class="panel chart" style="padding:10px">${c1}</div></div>
  <div class="section"><h3>${T('Effectifs par classe', 'Enrolment by class')}</h3><div class="panel tbl"><table><thead><tr><th>${T('Classe', 'Class')}</th>${ys.map(y => `<th>${y.year}</th>`).join('')}</tr></thead><tbody>
    ${LEVELS.map(l => `<tr><td>${l.name}</td>${ys.map(y => `<td>${y.enrol?.[l.id] ?? '—'}</td>`).join('')}</tr>`).join('')}
    <tr><td><b>Total</b></td>${ys.map(y => `<td><b>${totalEnrol(y)}</b></td>`).join('')}</tr>
  </tbody></table></div></div>
  <div class="section"><h3>${T('Réussite aux examens de Class 6', 'Class 6 exam results')}</h3><div class="panel chart" style="padding:10px">${c2}</div>
    <div class="panel tbl"><table><thead><tr><th>${T('Examen', 'Exam')}</th>${ys.map(y => `<th>${y.year}</th>`).join('')}</tr></thead><tbody>
    ${[['ce', T('Common Entrance (entrée en 6e)', 'Common Entrance')], ['fslc', 'FSLC (CEPE)']].map(([k, n]) => `<tr><td>${n}</td>${ys.map(y => { const e = y[k]; return `<td>${e && +e.cand ? `${e.pass}/${e.cand}<br><b>${rate(e)} %</b>` : '—'}</td>`; }).join('')}</tr>`).join('')}
    </tbody></table></div>
  </div>
  <div class="section"><h3>${T('Années enregistrées', 'Recorded years')}</h3><div class="panel rows">${ys.map(y => `<button class="row" data-a="stat-edit" data-v="${y.year}"><span class="grow"><span class="name">${y.year}${y.year === YEAR ? ` <span class="chip blue">${T('en cours', 'current')}</span>` : ''}</span><br><span class="small muted">${pl(totalEnrol(y), 'élève', 'élèves', 'pupil', 'pupils')}${y.ce?.cand ? ` · CE ${rate(y.ce)} %` : ''}${y.fslc?.cand ? ` · FSLC ${rate(y.fslc)} %` : ''}</span></span><span class="small" style="color:var(--carbon)">${T('Modifier', 'Edit')}</span></button>`).join('')}</div>
    <button class="btn sm" data-a="stats-csv">${T('Exporter le tableau (CSV)', 'Export the table (CSV)')}</button></div>`;
}
function niceStep(max) { const raw = max / 4, p = Math.pow(10, Math.floor(Math.log10(raw))); const n = raw / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }
function charts(ys) {
  const W = 360, H = 210, L = 34, B = 28, Tp = 18, R = 8;
  const vals = ys.map(totalEnrol), max = Math.max(10, ...vals), step = niceStep(max), top = Math.ceil(max / step) * step;
  const bw = Math.min(46, (W - L - R) / ys.length * 0.6), x = i => L + (i + 0.5) * (W - L - R) / ys.length, y = v => Tp + (H - Tp - B) * (1 - v / top);
  let g = ''; for (let v = 0; v <= top; v += step) g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="10.5" fill="var(--muted)">${v}</text>`;
  const bars = ys.map((yr, i) => { const v = vals[i], cur = yr.year === YEAR; return `<rect x="${x(i) - bw / 2}" y="${y(v)}" width="${bw}" height="${Math.max(0, y(0) - y(v))}" rx="4" fill="${cur ? 'var(--stamp)' : 'var(--carbon)'}" opacity="${cur ? 1 : .8}"/><text x="${x(i)}" y="${y(v) - 6}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">${v}</text><text x="${x(i)}" y="${H - 10}" text-anchor="middle" font-size="10.5" fill="var(--muted)">${yr.year}</text>`; }).join('');
  const svg1 = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${T('Effectif total par année', 'Total enrolment by year')}">${g}${bars}</svg>`;
  const H2 = 200, y2 = v => Tp + (H2 - Tp - B) * (1 - v / 100);
  let g2 = ''; for (let v = 0; v <= 100; v += 25) g2 += `<line x1="${L}" x2="${W - R}" y1="${y2(v)}" y2="${y2(v)}" stroke="var(--line)"/><text x="${L - 6}" y="${y2(v) + 4}" text-anchor="end" font-size="10.5" fill="var(--muted)">${v}%</text>`;
  const line = (k, col) => { const pts = ys.map((yr, i) => [i, rate(yr[k])]).filter(p => p[1] != null); if (!pts.length) return '';
    return `<polyline fill="none" stroke="${col}" stroke-width="2.5" points="${pts.map(p => `${x(p[0])},${y2(p[1])}`).join(' ')}"/>` + pts.map(p => `<circle cx="${x(p[0])}" cy="${y2(p[1])}" r="4.5" fill="${col}"/><text x="${x(p[0])}" y="${y2(p[1]) + (k === 'fslc' ? -9 : 18)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${col}">${p[1]}%</text>`).join(''); };
  const labels = ys.map((yr, i) => `<text x="${x(i)}" y="${H2 - 10}" text-anchor="middle" font-size="10.5" fill="var(--muted)">${yr.year}</text>`).join('');
  const has = ys.some(yr => rate(yr.ce) != null || rate(yr.fslc) != null);
  const svg2 = has ? `<div class="legend" style="padding:0 6px 6px"><span style="color:var(--carbon)"><b>●</b> Common Entrance</span><span style="color:var(--stamp)"><b>●</b> FSLC (CEPE)</span></div><svg viewBox="0 0 ${W} ${H2}" role="img" aria-label="${T('Taux de réussite par année', 'Pass rate by year')}">${g2}${labels}${line('ce', 'var(--carbon)')}${line('fslc', 'var(--stamp)')}</svg>` : `<div class="empty">${T('Saisissez les résultats Common Entrance et FSLC des années passées pour voir l’évolution.', 'Enter past Common Entrance and FSLC results to see the trend.')}</div>`;
  return [svg1, svg2];
}

/* ---------- sheets ---------- */
function openSheet(sh) { S.sheet = sh; render(); setTimeout(() => document.querySelector('.sheet [autofocus]')?.focus(), 30); }
function closeSheet() { try { S.sheet?.onClose?.(); } catch {} S.sheet = null; S.pendingRender = false; render(); }
function sheetHTML() { const title = S.sheet.title(); return `<div class="scrim" data-a="close"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="wrap"><div class="grab"><h2>${esc(title)}</h2><button class="btn ghost" data-a="close">${T('Fermer', 'Close')}</button></div><div id="sheet-body" style="display:flex;flex-direction:column;gap:14px">${S.sheet.body()}</div></div></div>`; }
function refreshSheet() {
  const b = document.getElementById('sheet-body'); if (!b || !S.sheet) return;
  if (S.sheet.liveRegion) { const r = document.getElementById(S.sheet.liveRegion); if (r) { r.innerHTML = S.sheet.liveBody(); r.scrollTop = r.scrollHeight; return; } }
  const a = document.activeElement; if (a && b.contains(a) && /INPUT|TEXTAREA/.test(a.tagName)) return;
  const keep = {}; b.querySelectorAll('input[id],select[id],textarea[id]').forEach(x => { if (x.type !== 'checkbox') keep[x.id] = x.value; });
  b.innerHTML = S.sheet.body();
  Object.entries(keep).forEach(([k, v]) => { const x = document.getElementById(k); if (x && x.id !== 'aa-role' && v !== '') x.value = v; });
}
const levelOptions = sel => LEVELS.map(l => `<option value="${l.id}" ${l.id === sel ? 'selected' : ''}>${l.name}</option>`).join('');
function sheetStudentForm(s, lv) {
  const isNew = !s; s = s || {level: lv || 'C1'};
  return {title: () => isNew ? T('Ajouter des élèves', 'Add pupils') : T('Modifier la fiche', 'Edit record'), body: () => `
  ${isNew ? `<div class="seg" role="group"><button data-a="sf-mode" data-v="one" aria-pressed="${S.sfMode !== 'many'}">${T('Un élève', 'One pupil')}</button><button data-a="sf-mode" data-v="many" aria-pressed="${S.sfMode === 'many'}">${T('Liste de la classe', 'Class list')}</button></div>` : ''}
  ${isNew && S.sfMode === 'many' ? `<form data-form="students-many">
    <label class="f">${T('Classe', 'Class')}<select id="sm-level" name="level">${levelOptions(s.level)}</select></label>
    <label class="f">${T('Une ligne par élève', 'One line per pupil')}<span class="hint">${T('Nom de l’élève ; nom du parent ; téléphone du parent (les deux derniers sont facultatifs)', 'Pupil’s name ; parent’s name ; parent’s phone (the last two are optional)')}</span><textarea id="sm-list" name="list" rows="8" placeholder="Ngono Marie ; Mme Ngono ; 677 00 00 00&#10;Tabi John ; Mr Tabi ; 699 11 22 33" autofocus></textarea></label>
    <button class="btn primary" ${S.canWrite ? '' : 'disabled'}>${T('Ajouter la liste', 'Add the list')}</button></form>` : `
  <form data-form="student" data-id="${s.id || ''}">
    <label class="f">${T('Nom et prénom de l’élève', 'Pupil’s full name')}<input id="sf-name" name="name" required value="${esc(s.name || '')}" autofocus></label>
    <div class="grid2"><label class="f">${T('Classe', 'Class')}<select id="sf-level" name="level">${levelOptions(s.level)}</select></label>
      <label class="f">${T('Sexe', 'Sex')}<select id="sf-sex" name="sex"><option value="">—</option><option value="F" ${s.sex === 'F' ? 'selected' : ''}>${T('Fille', 'Girl')}</option><option value="M" ${s.sex === 'M' ? 'selected' : ''}>${T('Garçon', 'Boy')}</option></select></label></div>
    <label class="f">${T('Date de naissance', 'Date of birth')}<input id="sf-birth" name="birth" type="date" value="${esc(s.birth || '')}"></label>
    <label class="f">${T('Photo de l’élève', 'Pupil’s photo')}<span class="hint">${T('visage de face, sert à vérifier son identité', 'face on, used to check identity')}</span><input id="sf-photo" type="file" accept="image/*" capture="environment"></label>
    <div class="grid2"><label class="f">${T('Parent ou tuteur', 'Parent or guardian')}<input id="sf-pname" name="parentName" value="${esc(s.parentName || '')}"></label>
      <label class="f">${T('Téléphone du parent', 'Parent’s phone')}<span class="hint">${T('sert à la connexion du parent', 'used by the parent to sign in')}</span><input id="sf-pphone" name="parentPhone" inputmode="tel" value="${esc(s.parentPhone || '')}"></label></div>
    ${isMgr() ? `<div class="grid2"><label class="f">${T('Réduction annuelle (FCFA)', 'Yearly discount (FCFA)')}<input id="sf-disc" name="discount" inputmode="numeric" value="${esc(s.discount || '')}"></label>
      <label class="f">${T('Motif de la réduction', 'Reason for discount')}<select id="sf-dr" name="discountReason"><option value="">—</option>${DISC.map(r => `<option value="${r[0]}" ${s.discountReason === r[0] ? 'selected' : ''}>${T(r[0], r[1])}</option>`).join('')}</select></label></div>` : ''}
    ${!isNew ? `<label class="f">${T('Statut', 'Status')}<select id="sf-status" name="status"><option value="active">${T('Inscrit(e)', 'Enrolled')}</option><option value="left" ${s.status === 'left' ? 'selected' : ''}>${T('A quitté l’école', 'Has left the school')}</option></select></label>` : ''}
    <button class="btn primary" ${S.canWrite ? '' : 'disabled'}>${isNew ? T('Ajouter l’élève', 'Add pupil') : T('Enregistrer', 'Save')}</button>
  </form>`}`};
}
function sheetStudent(id) {
  return {title: () => T('Fiche élève', 'Pupil record'), live: true, body: () => {
    const s = student(id); if (!s) return `<div class="empty">${T('Élève introuvable.', 'Pupil not found.')}</div>`;
    const f = feeStatus(s), term = termOf(today()), c = attCounts(s.id, term), cy = attCounts(s.id);
    const pays = S.payments.filter(p => p.studentId === s.id); const role = S.profile.role;
    return `<div style="display:flex;gap:14px;align-items:flex-start">${photoBox(s, 84)}<div class="section" style="min-width:0"><h3>${esc(s.name)}</h3><span class="muted small">${LV[s.level]?.name}${s.sex ? ' · ' + (s.sex === 'F' ? T('Fille', 'Girl') : T('Garçon', 'Boy')) : ''}${s.birth ? ' · ' + T('né(e) le ', 'born ') + frDate(s.birth) : ''}</span>
      <span class="small">${T('Parent', 'Parent')} : <b>${esc(s.parentName || '—')}</b> · ${esc(s.parentPhone || '—')}</span></div></div>
    <div class="kpis"><div class="kpi"><span class="v">${c.A}</span><span class="l">${T(`absences ce trimestre (${cy.A} sur l’année)`, `absences this term (${cy.A} this year)`)}</span></div><div class="kpi"><span class="v">${c.R}</span><span class="l">${T('retards ce trimestre', 'late arrivals this term')}</span></div></div>
    ${(isMgr(role) || role === 'accountant') && feesSet() ? `<div class="panel" style="padding:14px;display:flex;flex-direction:column;gap:6px"><div class="section-head"><span>${T('Payé', 'Paid')} <b class="num">${money(f.paid)}</b></span><span class="small muted num">${T('sur', 'of')} ${money(f.total)}${s.discount ? ` (${T('réduction', 'discount')} ${money(s.discount)})` : ''}</span></div><div class="bar"><i style="width:${f.total ? Math.min(100, f.paid / f.total * 100) : 0}%"></i></div>${f.late ? `<span class="small" style="color:var(--stamp)">${T('Échu non payé', 'Due and unpaid')} : <b class="num">${money(f.late)}</b></span>` : ''}</div>` : ''}
    ${isMgr(role) || role === 'accountant' ? `<div class="section"><h3>${T('Paiements', 'Payments')}</h3>${pays.length ? `<div class="panel rows">${pays.map(payRow).join('')}</div>` : `<div class="panel empty">${T('Aucun paiement cette année.', 'No payments this year.')}</div>`}</div>` : ''}
    <div class="btns"><button class="btn" data-a="card" data-v="${s.id}">${ICON.qr} ${T('Carte d’élève', 'Pupil’s card')}</button>${role === 'accountant' || isMgr(role) ? `<button class="btn primary" data-a="pay" data-v="${s.id}">${T('Encaisser', 'Record payment')}</button>` : ''}${isMgr(role) || role === 'secretary' ? `<button class="btn" data-a="edit-student" data-v="${s.id}">${T('Modifier', 'Edit')}</button><button class="btn" data-a="add-student" data-v="${s.level}">${T('Inscrire un autre élève', 'Enrol another pupil')}</button>` : ''}${role !== 'secretary' ? `<button class="btn" data-a="chat" data-v="${s.id}">${T('Messages au parent', 'Message the parent')}</button>` : ''}</div>
    ${isAdmin(role) || role === 'secretary' ? parentAccessBlock(s) : ''}`; }};
}
function sheetPay(id) {
  const s = student(id), f = feeStatus(s), term = termOf(today()), fr = feesOf(s.level);
  const suggestObj = f.paid < firstInst(fr) ? 'pack1' : 'inst2';
  return {title: () => T('Encaisser un paiement', 'Record a payment'), body: () => `
    <div class="panel row"><span class="grow"><span class="name">${esc(s.name)}</span><br><span class="small muted">${LV[s.level].name}${feesSet() ? ` · ${T('reste', 'balance')} ${money(f.balance)}` : ''}</span></span></div>
    <form data-form="pay" data-id="${s.id}">
      <label class="f">${T('Montant reçu (FCFA)', 'Amount received (FCFA)')}<input id="p-amount" name="amount" inputmode="numeric" required autofocus value="${f.late || (f.paid < firstInst(fr) ? Math.max(0, firstInst(fr) - f.paid) : f.balance) || ''}"></label>
      <label class="f">${T('Objet du paiement', 'Payment for')} (« Being »)<select id="p-object" name="object" data-change="pay-obj" data-s="${s.id}">${OBJECTS.filter(o => !o.old).map(o => `<option value="${o.k}" ${o.k === suggestObj ? 'selected' : ''}>${objName(o.k)}</option>`).join('')}</select></label>
      <label class="f">${T('Précision', 'Details')}<span class="hint">${T('facultatif, imprimé sur le reçu', 'optional, printed on the receipt')}</span><input id="p-otext" name="objectText" placeholder="${T('Ex. 2 polos et 1 short', 'E.g. 2 polo shirts and 1 pair of shorts')}"></label>
      <div class="grid2"><label class="f">${T('Mode de paiement', 'Paid by')}<select id="p-method" name="method">${Object.entries(METHODS()).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
        <label class="f">${T('Référence', 'Reference')}<span class="hint">${T('n° de transaction', 'transaction no.')}</span><input id="p-ref" name="ref"></label></div>
      <div class="grid2"><label class="f">${T('Reçu de', 'Received from')}<input id="p-payer" name="payer" value="${esc(s.parentName || '')}" required></label>
        <label class="f">${T('Date', 'Date')}<input id="p-date" name="date" type="date" value="${today()}" max="${today()}"></label></div>
      <button class="btn red" ${S.canWrite ? '' : 'disabled'}>${T('Enregistrer et émettre le reçu', 'Save and issue receipt')}</button>
    </form>`};
}
function receiptHTML(p) {
  return `<div class="receipt" id="rcpt">
    <div class="hd"><img src="${LOGO}" alt="Logo"><div><div class="t">LES YEUX DU COEUR</div><div class="s">Bilingual Nursery &amp; Primary School Isokolo Old Road Limbe (LYC)<br>Motto: The Best Is Our Goal<br>Le Meilleur C'est Notre But<br>Tel: ${SCHOOL.tel}</div></div></div>
    <div class="title"><b>Receipt N° ${esc(p.receiptLabel)}</b><span>Date: <b>${frDate(p.date)}</b></span></div>
    <div class="ln"><span>Received from</span><em>${esc(p.payer)}</em></div>
    <div class="ln"><span>The Sum of</span><em>${cap(words(p.amount))} francs CFA</em></div>
    <div class="ln"><span>Being</span><em>${esc(OBJ[p.object]?.en || '')}${p.objectText ? ' – ' + esc(p.objectText) : ''}</em></div>
    <div class="ln"><span>Class</span><em>${esc(p.studentName)} · ${esc(LV[p.level]?.name || '')}</em></div>
    <div class="ln"><span>Paid by</span><em>${METHODS_EN[p.method] || ''}${p.ref ? ' · Ref ' + esc(p.ref) : ''}</em></div>
    ${p.balanceAfter != null ? `<div class="ln"><span>Balance</span><em>${money(p.balanceAfter)}</em></div>` : ''}
    <div class="ft"><div class="box num">${money(p.amount)}</div><div class="sig">Receiver's signature<br><b>${esc(p.by || '')}</b></div><img class="stamp" src="${STAMP}" alt="L.Y.C"></div>
    ${p.cancelled ? '<div class="void">CANCELLED</div>' : ''}
  </div>`;
}
function sheetReceipt(id) {
  return {title: () => T('Reçu', 'Receipt'), live: true, body: () => { const p = S.payments.find(x => x.id === id); if (!p) return `<div class="empty">${T('Reçu introuvable.', 'Receipt not found.')}</div>`;
    return `${receiptHTML(p)}
    ${p.cancelled ? `<div class="banner red small">${T('Reçu annulé le', 'Receipt cancelled on')} ${frDate(p.cancelledAt)} : ${esc(p.cancelReason || '')}</div>` : ''}
    <div class="btns"><button class="btn primary" data-a="rcpt-dl" data-v="${p.id}">${T('Partager ou enregistrer', 'Share or save')}</button>${isAdmin() && !p.cancelled ? `<button class="btn" data-a="rcpt-cancel" data-v="${p.id}">${T('Annuler ce reçu', 'Cancel this receipt')}</button>` : ''}</div>
    ${S.cancelling === p.id ? `<form data-form="cancel" data-id="${p.id}"><label class="f">${T('Motif de l’annulation', 'Reason for cancelling')}<input id="c-reason" name="reason" required autofocus></label><button class="btn red">${T('Confirmer l’annulation', 'Confirm cancellation')}</button></form>` : ''}
    <p class="small muted" style="margin:0">${T('Le reçu reste conservé et ne peut pas être modifié, comme le talon du carnet.', 'The receipt is kept and cannot be changed, like the counterfoil in the receipt book.')}</p>`; }};
}
function sheetCompose() {
  const p = S.profile, isT = p.role === 'teacher';
  return {title: () => isT ? T('Message à la classe', 'Message the class') : T('Nouvelle annonce', 'New announcement'), body: () => `
    <form data-form="announce">
      ${isT ? `<input type="hidden" name="scope" value="${p.level}"><span class="chip blue">${T('Parents de ', 'Parents of ')}${LV[p.level].name}</span>` : `<label class="f">${T('Destinataires', 'Send to')}<select id="a-scope" name="scope"><option value="all">${T('Toute l’école', 'Whole school')}</option><option value="nursery">${T('Maternelle (Pre-Nursery à Nursery 2)', 'Nursery (Pre-Nursery to Nursery 2)')}</option><option value="primary">${T('Primaire (Class 1 à 6)', 'Primary (Class 1 to 6)')}</option>${levelOptions('')}</select></label>`}
      <label class="f">${T('Objet', 'Subject')}<input id="a-title" name="title" required autofocus placeholder="${T('Ex. Réunion des parents samedi', 'E.g. Parents’ meeting on Saturday')}"></label>
      <label class="f">${T('Message', 'Message')}<textarea id="a-body" name="body" required rows="6"></textarea></label>
      <button class="btn primary" ${S.canWrite ? '' : 'disabled'}>${T('Envoyer', 'Send')}</button>
    </form>`};
}
function sheetMsg(id) {
  return {title: () => T('Message', 'Message'), body: () => { const m = S.messages.find(x => x.id === id); if (!m) return `<div class="empty">${T('Message supprimé.', 'Message deleted.')}</div>`;
    const reads = Object.keys(m.readBy || {}).length; const role = S.profile.role;
    const absDoc = m.kind === 'absence' && m.status === 'A' ? S.att[attKey(m.level, m.day)] : null;
    return `<div class="section"><h3>${esc(mTitle(m))}</h3><span class="small muted">${esc(m.from || '')} · ${timeAgo(m.at)}${m.kind === 'announce' ? ' · ' + SCOPE_NAME(m.scope) : ''}</span></div>
      <div class="panel" style="padding:14px;white-space:pre-wrap;overflow-wrap:anywhere">${esc(mBody(m))}</div>
      ${m.kind === 'announce' && role !== 'parent' ? `<span class="small muted">${T(`Lu par ${reads} parent${reads > 1 ? 's' : ''}.`, `Read by ${reads} parent${reads === 1 ? '' : 's'}.`)}</span>${isMgr(role) ? `<button class="btn sm" data-a="msg-del" data-v="${m.id}">${T('Supprimer l’annonce', 'Delete announcement')}</button>` : ''}` : ''}
      ${role === 'parent' && absDoc && !absDoc.justif?.[m.studentId] ? `<button class="btn primary" data-a="justify" data-v="${absDoc.id}" data-s="${m.studentId}">${T('Justifier cette absence', 'Explain this absence')}</button>` : ''}
      ${role === 'parent' && m.kind === 'receipt' && m.paymentId ? `<button class="btn primary" data-a="receipt" data-v="${m.paymentId}">${T('Voir le reçu', 'View receipt')}</button>` : ''}`; }};
}
function sheetChat(sid) {
  const s = student(sid);
  return {title: () => T('Messages', 'Messages'), live: true, liveRegion: 'chat-list', liveBody: () => chatList(sid), body: () => `
    <span class="small muted">${S.profile.role === 'parent' ? `${T('Avec', 'With')} ${esc(teacherOf(s.level) || T('l’enseignant titulaire', 'the class teacher'))} · ${LV[s.level].name}` : `${T('Avec', 'With')} ${esc(s.parentName || T('le parent', 'the parent'))} · ${T('au sujet de', 'about')} ${esc(s.name)}`}</span>
    <div class="chat" id="chat-list" style="max-height:52vh;overflow:auto">${chatList(sid)}</div>
    <form data-form="chat" data-id="${sid}" style="flex-direction:row;align-items:flex-end"><label class="f" style="flex:1"><span class="hint">${T('Votre message', 'Your message')}</span><textarea id="chat-text" name="text" rows="2" required style="min-height:52px"></textarea></label><button class="btn primary" ${S.canWrite ? '' : 'disabled'}>${T('Envoyer', 'Send')}</button></form>`};
}
function chatList(sid) {
  const mineParent = S.profile.role === 'parent';
  const ms = S.messages.filter(m => m.kind === 'chat' && m.studentId === sid).slice().reverse();
  if (!ms.length) return `<div class="empty">${T('Aucun message. Écrivez le premier.', 'No messages yet. Write the first one.')}</div>`;
  return ms.map(m => `<div class="bub ${(m.fromRole === 'parent') === mineParent ? 'me' : ''}">${esc(m.body)}<small>${esc(m.from || '')} · ${timeAgo(m.at)}</small></div>`).join('');
}
function sheetJustify(attId, sid) {
  return {title: () => T('Justifier une absence', 'Explain an absence'), body: () => { const d = S.att[attId]; return `
    <span>${T('Absence de', 'Absence of')} <b>${esc(student(sid)?.name)}</b> ${T('le', 'on')} ${longDay(d?.date || '')}.</span>
    <form data-form="justify" data-id="${attId}" data-s="${sid}"><label class="f">${T('Motif', 'Reason')}<textarea id="j-text" name="text" required rows="4" placeholder="${T('Ex. fièvre, consultation au centre de santé', 'E.g. fever, visit to the health centre')}" autofocus></textarea></label>
    <button class="btn primary" ${S.canWrite ? '' : 'disabled'}>${T('Envoyer à l’enseignant', 'Send to the teacher')}</button></form>`; }};
}
function sheetStat(year) {
  const y = year ? (allYears().find(x => x.year === year) || {year}) : {};
  return {title: () => year ? T('Statistiques ', 'Statistics ') + year : T('Saisir une année', 'Add a year'), body: () => `
    <form data-form="stat">
      <label class="f">${T('Année scolaire', 'School year')}<input id="st-year" name="year" required placeholder="2024-2025" value="${esc(y.year || '')}" ${year ? 'readonly' : 'autofocus'}></label>
      ${y.year === YEAR ? `<div class="banner info small">${T('Pour l’année en cours, les effectifs viennent des élèves inscrits. Saisissez seulement les résultats d’examens.', 'For the current year, enrolment comes from registered pupils. Enter only the exam results.')}</div>` : `<h3>${T('Effectif de chaque classe', 'Enrolment of each class')}</h3><div class="grid2">${LEVELS.map(l => `<label class="f">${l.name}<input id="st-${l.id}" name="e-${l.id}" inputmode="numeric" value="${y.enrol?.[l.id] ?? ''}"></label>`).join('')}</div>`}
      <h3>Common Entrance${T(' (entrée en 6e)', '')}</h3><div class="grid2"><label class="f">${T('Candidats', 'Candidates')}<input id="st-cec" name="ce-cand" inputmode="numeric" value="${y.ce?.cand ?? ''}"></label><label class="f">${T('Admis', 'Passed')}<input id="st-cep" name="ce-pass" inputmode="numeric" value="${y.ce?.pass ?? ''}"></label></div>
      <h3>FSLC (CEPE)</h3><div class="grid2"><label class="f">${T('Candidats', 'Candidates')}<input id="st-fc" name="fslc-cand" inputmode="numeric" value="${y.fslc?.cand ?? ''}"></label><label class="f">${T('Admis', 'Passed')}<input id="st-fp" name="fslc-pass" inputmode="numeric" value="${y.fslc?.pass ?? ''}"></label></div>
      <label class="f">${T('Liste des admis', 'Names of those who passed')}<span class="hint">${T('facultatif, un nom par ligne', 'optional, one name per line')}</span><textarea id="st-list" name="admitted" rows="4">${esc((y.admitted || []).join('\n'))}</textarea></label>
      <button class="btn primary" ${S.canWrite ? '' : 'disabled'}>${T('Enregistrer', 'Save')}</button>
    </form>`};
}
/* ---------- receipt image ---------- */
function loadImg(src) { return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }); }
async function receiptPNG(p) {
  const W = 1400, H = 760, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  x.strokeStyle = '#333'; x.setLineDash([3, 6]); x.lineWidth = 3; x.strokeRect(24, 24, W - 48, H - 48); x.setLineDash([]);
  const logo = await loadImg(LOGO), stamp = await loadImg(STAMP);
  if (logo) x.drawImage(logo, 60, 70, 300, 300 * logo.height / logo.width);
  x.fillStyle = '#111'; x.textAlign = 'center';
  x.font = '800 54px Arial, Helvetica, sans-serif'; x.fillText('LES YEUX DU COEUR', 860, 100);
  x.font = '600 28px "Times New Roman", Times, serif';
  ['Bilingual Nursery & Primary School Isokolo Old Road Limbe (LYC)', 'Motto: The Best Is Our Goal', "Le Meilleur C'est Notre But", 'Tel: ' + SCHOOL.tel].forEach((t, i) => x.fillText(t, 860, 142 + i * 36));
  x.font = '700 40px "Times New Roman", Times, serif'; x.fillText('Receipt N° ' + p.receiptLabel, 640, 345);
  x.textAlign = 'left'; x.font = '600 28px "Times New Roman", Times, serif'; x.fillText('Date: ' + frDate(p.date), 1040, 345);
  const lines = [['Received from', p.payer], ['The Sum of', cap(words(p.amount)) + ' francs CFA'], ['Being', (OBJ[p.object]?.en || '') + (p.objectText ? ' – ' + p.objectText : '')], ['Class', p.studentName + ' · ' + (LV[p.level]?.name || '')], ['Paid by', (METHODS_EN[p.method] || '') + (p.ref ? ' · Ref ' + p.ref : '') + (p.balanceAfter != null ? '     Balance: ' + money(p.balanceAfter) : '')]];
  lines.forEach(([k, v], i) => { const y = 410 + i * 56; x.font = '600 28px "Times New Roman", Times, serif'; x.fillStyle = '#333'; x.fillText(k, 80, y); const w = x.measureText(k).width;
    x.font = '700 30px "Times New Roman", Times, serif'; x.fillStyle = '#111'; let t = String(v || ''); while (x.measureText(t).width > W - 200 - w && t.length > 4) t = t.slice(0, -2); x.fillText(t, 100 + w, y - 2);
    x.setLineDash([2, 6]); x.strokeStyle = '#444'; x.lineWidth = 2; x.beginPath(); x.moveTo(90 + w, y + 8); x.lineTo(W - 80, y + 8); x.stroke(); x.setLineDash([]); });
  x.lineWidth = 4; x.strokeStyle = '#111'; x.strokeRect(80, 670, 380, 62); x.font = '800 32px Arial, sans-serif'; x.fillText(money(p.amount), 100, 712);
  x.font = '600 28px "Times New Roman", Times, serif'; x.textAlign = 'right'; x.fillText("Receiver's signature", W - 90, 690); x.font = '700 28px "Times New Roman", Times, serif'; x.fillText(p.by || '', W - 90, 726);
  if (stamp) { x.save(); x.globalAlpha = .88; x.translate(W - 330, 620); x.rotate(-0.21); x.drawImage(stamp, -110, -110, 220, 220); x.restore(); }
  if (p.cancelled) { x.save(); x.translate(W / 2, H / 2); x.rotate(-0.3); x.fillStyle = 'rgba(193,38,49,.35)'; x.font = '900 140px Arial'; x.textAlign = 'center'; x.fillText('CANCELLED', 0, 40); x.restore(); }
  return new Promise(r => c.toBlob(r, 'image/png'));
}

/* ---------- actions ---------- */
async function saveFile(filename, data, type) {
  const blob = data instanceof Blob ? data : new Blob([data], {type});
  try { const file = new File([blob], filename, {type: blob.type || type});
    if (navigator.canShare && navigator.canShare({files: [file]})) { await navigator.share({files: [file], title: filename}); return; } } catch (e) { if (e?.name === 'AbortError') return; }
  const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
}
const ACT = {
  noop: () => {},
  scan: () => { stopScan(); openSheet(sheetScan()); },
  'scan-start': () => startScan(),
  card: async d => { const s = student(d.v); openSheet(sheetCard(d.v)); },
  'card-make': async d => { const s = student(d.v); if (s && await ensureKey(s)) refreshSheet(); },
  'card-renew': async d => { const s = student(d.v); if (!s) return; const k = genKey(); if (await write(db => db.doc('students/' + s.id).update({qrKey: k}), T('Nouveau QR code créé : l’ancienne carte n’est plus valide.', 'New QR code created: the old card is no longer valid.'))) { s.qrKey = k; refreshSheet(); } },
  'card-img': async d => { const s = student(d.v); if (!s?.qrKey) return; await deliverImage(`Carte-${s.name.replace(/\s+/g, '-')}.png`, await cardPNG(s)); },
  'class-cards': d => classCards(d.v),
  lang: () => { setLang(EN() ? 'fr' : 'en'); },
  'clock-in': () => { const t = hmNow(); staffWrite(today(), myStaffKey(), {in: t, inAt: nowISO(), status: 'P', name: S.profile.name || ''}, T(`Arrivée pointée à ${t}`, `Clocked in at ${t}`)); },
  'clock-out': () => { const t = hmNow(); staffWrite(today(), myStaffKey(), {out: t, outAt: nowISO()}, T(`Départ pointé à ${t}`, `Clocked out at ${t}`)); },
  'staff-edit': d => openSheet(sheetStaffEdit(d.v)),
  'sec-in': d => { const t = hmNow(); staffWrite(today(), d.v, {sec: {in: t, inAt: nowISO(), by: S.profile.name || ''}}, T(`Arrivée notée à ${t}`, `Arrival noted at ${t}`)); },
  'sec-out': d => { const t = hmNow(); staffWrite(today(), d.v, {sec: {out: t, outAt: nowISO(), by: S.profile.name || ''}}, T(`Départ noté à ${t}`, `Departure noted at ${t}`)); },
  'sec-edit': d => openSheet(sheetSecEdit(d.v)),
  'staff-csv': async () => { const month = (S.stDate || today()).slice(0, 7);
    const rows = [[T('Personnel', 'Staff'), T('Fonction', 'Role'), T('Jours', 'Days'), T('Retards', 'Late'), T('Absences', 'Absent'), T('Congés', 'Leave'), T('Départs anticipés', 'Left early'), T('Jours avec écart', 'Days with a gap'), T('Arrivée moyenne', 'Average arrival'), T('Départ moyen', 'Average departure')],
      ...STAFF().map(st => { const o = staffMonth(st.key, month); return [st.name || '', st.role, o.present, o.late, o.absent, o.leave, o.early, o.gaps, o.avgIn, o.avgOut]; })];
    const days = Object.values(S.staff).filter(d => d.date?.startsWith(month)).sort((a, b) => a.date.localeCompare(b.date));
    rows.push([], [T('Date', 'Date'), T('Personnel', 'Staff'), T('Arrivée', 'Arrival'), T('Départ', 'Departure'), T('Statut', 'Status'), T('Remarque', 'Note'), T('Arrivée pointée', 'Clocked in'), T('Départ pointé', 'Clocked out'), T('Arrivée secrétaire', 'Secretary in'), T('Départ secrétaire', 'Secretary out'), T('Écarts', 'Gaps')]);
    days.forEach(d => STAFF().forEach(st => { const r = (d.rec || {})[st.key]; if (r) rows.push([frDate(d.date), st.name || r.name || st.role, effIn(r), effOut(r), r.status === 'A' ? T('Absent', 'Absent') : r.status === 'L' ? T('Congé', 'Leave') : T('Présent', 'Present'), r.note || '', r.in || '', r.out || '', r.sec?.absent ? T('absent', 'absent') : (r.sec?.in || ''), r.sec?.out || '', staffGaps(r, d.date).join(' / ')]); }));
    try { await saveFile(`${T('presences-personnel', 'staff-attendance')}-${month}.csv`, '\ufeff' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n'), 'text/csv'); } catch (e) { toast(T('Export impossible.', 'Export failed.')); } },
  tab: d => { S.view = d.v; S.sheet = null; render(); window.scrollTo(0, 0); },
  close: () => { S.cancelling = null; closeSheet(); },
  logout: () => { S.sheet = null; S.auth?.signOut(); },
  setup: () => openSheet(sheetSetup()),
  'acc-add': () => { S.aaRole = 'teacher'; openSheet(sheetAccAdd()); },
  'acc-open': d => openSheet(sheetAcc(d.v)),
  'acc-sent': d => { write(db => db.doc('users/' + d.v).set({sentAt: nowISO()}, {merge: true})); },
  'acc-newcode': d => newCode(d.v),
  'acc-off': d => disableAccess(d.v),
  'acc-parents': () => createParentAccess(),
  'parent-access': async (d, el) => { const s = student(d.v); if (!s) return; el.disabled = true;
    try { await createAccount({role: 'parent', name: s.parentName || '', phone: s.parentPhone, levels: parentLevels(digits(s.parentPhone))}); toast(T('Accès du parent créé', 'Parent access created')); }
    catch (e) { console.warn(e); el.disabled = false; toast(e.message && !e.code ? e.message : T('Création impossible. Vérifiez la connexion.', 'Could not create. Check the connection.')); } },
  'open-appel': d => { S.apLevel = d.v; S.view = 'appel'; render(); window.scrollTo(0, 0); },
  'ap-level': d => { S.apLevel = d.v; render(); },
  'ap-mark': d => { S.draft.marks[d.s] = d.v; S.draft.dirty = true; render(); },
  'ap-all': () => { Object.keys(S.draft.marks).forEach(k => S.draft.marks[k] = 'P'); S.draft.dirty = true; render(); },
  'ap-save': () => saveAppel(),
  'ap-accept': d => { S.draft.marks[d.s] = 'J'; S.draft.dirty = true; saveAppel(true); },
  filter: d => { S.filter = d.v; lsSet('lyc-filter', d.v); render(); },
  'imp-level': d => { S.impLevel = d.v; render(); },
  kid: d => { S.kid = d.v; render(); },
  student: d => openSheet(sheetStudent(d.v)),
  'add-student': d => { S.sfMode = 'one'; openSheet(sheetStudentForm(null, d.v || (S.filter !== 'all' ? S.filter : 'C1'))); },
  'edit-student': d => openSheet(sheetStudentForm(student(d.v))),
  'sf-mode': d => { S.sfMode = d.v; refreshSheet(); },
  pay: d => openSheet(sheetPay(d.v)),
  'pay-obj': () => {},
  receipt: d => { S.cancelling = null; openSheet(sheetReceipt(d.v)); },
  'rcpt-cancel': d => { S.cancelling = d.v; refreshSheet(); },
  'rcpt-dl': async d => { const p = S.payments.find(x => x.id === d.v); if (!p) return;
    try { await saveFile(`Receipt-${p.receiptLabel}.png`, await receiptPNG(p), 'image/png'); } catch (e) { toast(T('Partage impossible.', 'Could not share.')); } },
  compose: () => openSheet(sheetCompose()),
  'open-msg': d => { openSheet(sheetMsg(d.v)); const m = S.messages.find(x => x.id === d.v);
    if (S.profile.role === 'parent' && m && !(m.readBy || {})[S.me] && S.canWrite) write(db => db.doc('messages/' + m.id).set({readBy: {[S.me]: nowISO()}}, {merge: true})); },
  'msg-del': async d => { if (await write(db => db.doc('messages/' + d.v).delete(), T('Annonce supprimée', 'Announcement deleted'))) closeSheet(); },
  chat: d => { openSheet(sheetChat(d.v)); setTimeout(() => { const l = document.getElementById('chat-list'); if (l) l.scrollTop = l.scrollHeight; }, 40); markChatRead(d.v); },
  justify: d => openSheet(sheetJustify(d.v, d.s)),
  remind: d => remind([d.v]),
  'remind-all': () => { const lv = S.impLevel || 'all'; remind(activeStudents().filter(s => (lv === 'all' || s.level === lv) && feeStatus(s).late > 0).map(s => s.id)); },
  'stat-edit': d => openSheet(sheetStat(d.v)),
  'stats-csv': async () => { const ys = allYears(); const rows = [[T('Indicateur', 'Indicator'), ...ys.map(y => y.year)], ...LEVELS.map(l => [l.name, ...ys.map(y => y.enrol?.[l.id] ?? '')]), ['Total', ...ys.map(totalEnrol)],
      ['Common Entrance ' + T('candidats', 'candidates'), ...ys.map(y => y.ce?.cand ?? '')], ['Common Entrance ' + T('admis', 'passed'), ...ys.map(y => y.ce?.pass ?? '')], ['Common Entrance %', ...ys.map(y => rate(y.ce) ?? '')],
      ['FSLC ' + T('candidats', 'candidates'), ...ys.map(y => y.fslc?.cand ?? '')], ['FSLC ' + T('admis', 'passed'), ...ys.map(y => y.fslc?.pass ?? '')], ['FSLC %', ...ys.map(y => rate(y.fslc) ?? '')]];
    try { await saveFile(T('statistiques-LYC.csv', 'LYC-statistics.csv'), '﻿' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n'), 'text/csv'); } catch (e) { toast(T('Export impossible.', 'Export failed.')); } },
  'brochure-fees': () => { LEVELS.forEach(l => { const f = brochureFee(l.id); FEE_PARTS.forEach(([k]) => { const i = document.getElementById(`f-${l.id}-${k}`); if (i) i.value = f[k]; }); }); const a = document.getElementById('due1'), b = document.getElementById('due2'); if (a) a.value = `${START_Y}-10-10`; if (b) b.value = `${START_Y + 1}-01-10`; toast(T('Tarifs de la brochure remis, pensez à enregistrer', 'Brochure fees restored, remember to save')); },
  'demo-load': async () => { const first = ['Ngono','Tabi','Ewane','Fon','Mbah','Nkeng','Eyong','Ashu','Tanyi','Bih','Ngwa','Etta','Akwa','Njie','Ayuk','Che','Manga','Esua','Tchinda','Kum','Ebai','Nfor','Atem','Mokoko','Besong','Ndi','Tambe'];
    const given = ['Marie','John','Grace','Paul','Precious','Junior','Blessing','Emmanuel','Divine','Clarisse','Brandon','Princess','Samuel','Joy','Kevin','Cynthia','Daniel','Faith','Ivan','Linda','Eric','Mercy','Yannick','Sandra','Brian','Rita','Collins'];
    let i = 0; await write(async db => { for (const l of LEVELS) for (let k = 0; k < 3; k++, i++) await db.collection('students').doc('demo_' + l.id + k).set({name: `${first[i]} ${given[i]}`, level: l.id, sex: i % 2 ? 'M' : 'F', parentName: (i % 2 ? 'Mr ' : 'Mrs ') + first[i], parentPhone: '6' + String(70000000 + i * 1111111).slice(0, 8), phoneKey: '6' + String(70000000 + i * 1111111).slice(0, 8), status: 'active', demo: true, createdAt: nowISO(), qrKey: genKey()}); }, T('Exemples chargés (27 élèves)', 'Samples loaded (27 pupils)')); },
  'demo-clear': async () => { const ids = S.students.filter(s => s.demo).map(s => s.id); await write(async db => { for (const id of ids) await db.doc('students/' + id).delete(); }, T('Exemples effacés', 'Samples removed')); }
};
async function markChatRead(sid) {
  if (!S.canWrite || !S.db) return; const mineParent = S.profile.role === 'parent';
  const un = S.messages.filter(m => m.kind === 'chat' && m.studentId === sid && (m.fromRole === 'parent') !== mineParent && !(m.readBy || {})[S.me]);
  for (const m of un.slice(0, 20)) { try { await S.db.doc('messages/' + m.id).set({readBy: {[S.me]: nowISO()}}, {merge: true}); } catch {} }
}
document.addEventListener('click', e => { const t = e.target.closest('[data-a]'); if (!t) return; const f = ACT[t.dataset.a]; if (f) { if (t.tagName !== 'A') e.preventDefault(); f(t.dataset, t); } });
document.addEventListener('change', e => { const t = e.target;
  if (t.dataset.change === 'aa-role') { S.aaRole = t.value; refreshSheet(); }
  if (t.dataset.change === 'qr-file') { scanFile(t); }
  if (t.dataset.change === 'pay-obj') { const st = student(t.dataset.s), fr = st && feesOf(st.level), f = st && feeStatus(st), amt = document.getElementById('p-amount'); const v = t.value;
    if (amt && fr) amt.value = v === 'sport' ? 3500 : v === 'pack1' ? Math.max(0, firstInst(fr) - f.paid) || '' : ['reg', 'inst1', 'inst2', 'exam', 'art'].includes(v) ? fr[v] || '' : ''; }
  if (t.dataset.change === 'staff-date') { S.stDate = t.value || today(); render(); }
  if (t.dataset.change === 'ap-date') { S.apDate = t.value || today(); S.draft = null; render(); }
  if (t.dataset.change === 'ap-reason') { S.draft.reasons[t.dataset.s] = t.value; S.draft.dirty = true; } });
document.addEventListener('input', e => { const t = e.target; if (t.dataset.input === 'q') { S.q = t.value; const box = document.getElementById('enc-list'); if (box) box.innerHTML = encRows(activeStudents().filter(s => matchQ(s, t.value))); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.sheet) closeSheet(); });

const num = v => Math.max(0, Math.round(Number(String(v ?? '').replace(/[^\d]/g, '')) || 0));
const FORMS = {
  login: async f => { const fd = new FormData(f), ph = digits(fd.get('phone')), code = String(fd.get('code') || '').replace(/\D/g, '');
    S.loginErr = ''; if (ph.length !== 9 || code.length !== 6) { S.loginErr = T('Saisissez un numéro à 9 chiffres et le code à 6 chiffres.', 'Enter a 9-digit number and the 6-digit code.'); render(); return; }
    const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = T('Connexion…', 'Signing in…'); lsSet('lyc-last-phone', ph);
    try { const l = await S.db.doc('logins/' + ph).get(); if (!l.exists) throw {code: 'unknown'}; await S.auth.signInWithEmailAndPassword(l.data().email, code); }
    catch (e) { console.warn(e); S.loginErr = e.code === 'unknown' ? T('Ce numéro n’a pas d’accès. Vérifiez-le ou contactez l’école.', 'This number has no access. Check it or contact the school.')
      : e.code === 'auth/too-many-requests' ? T('Trop d’essais. Réessayez dans quelques minutes.', 'Too many attempts. Try again in a few minutes.')
      : (e.code === 'auth/network-request-failed' || e.code === 'unavailable') ? T('Pas de connexion internet.', 'No internet connection.') : T('Numéro ou code incorrect.', 'Wrong number or code.'); render(); } },
  setup: async f => { const fd = new FormData(f), ph = digits(fd.get('phone')), name = String(fd.get('name')).trim();
    if (ph.length !== 9) { toast(T('Numéro invalide : 9 chiffres attendus.', 'Invalid number: 9 digits expected.')); return; }
    const btn = f.querySelector('button'); btn.disabled = true; S.settingUp = true;
    try { const code = genCode(), email = emailFor(ph, Date.now().toString(36));
      const cred = await S.auth.createUserWithEmailAndPassword(email, code); const u = cred.user;
      const b = S.db.batch();
      b.set(S.db.doc('users/' + u.uid), {role: 'president', name, phone: ph, level: null, levels: [], code, email, active: true, createdAt: nowISO(), createdBy: name});
      b.set(S.db.doc('logins/' + ph), {email, uid: u.uid});
      b.set(S.db.doc('meta/setup'), {at: nowISO(), by: u.uid});
      await b.commit();
      S.setupNeeded = false; S.setupCode = code; S.setupPhone = ph; S.settingUp = false;
      const sh = S.sheet; await loadProfile(u); S.sheet = sh; render();
    } catch (e) { console.warn(e); S.settingUp = false; btn.disabled = false; toast(T('Création impossible : ', 'Could not create: ') + (e.message || e.code || '')); } },
  'acc-add': async f => { const fd = new FormData(f), role = fd.get('role'), btn = f.querySelector('button'); btn.disabled = true;
    try { const r = await createAccount({role, name: String(fd.get('name')).trim(), phone: fd.get('phone'), level: role === 'teacher' ? fd.get('level') : null, levels: role === 'parent' ? parentLevels(digits(fd.get('phone'))) : []});
      if (role === 'teacher') await S.db.doc('config/school').set({teachers: {[fd.get('level')]: String(fd.get('name')).trim()}}, {merge: true});
      const nameKey = {direction: 'directorName', assistant: 'assistantName', secretary: 'secretaryName'}[role]; if (nameKey) await S.db.doc('config/school').set({[nameKey]: String(fd.get('name')).trim()}, {merge: true});
      toast(T('Accès créé', 'Access created')); S.sheet = sheetAcc(r.uid); render();
    } catch (e) { console.warn(e); btn.disabled = false; toast(e.message && !e.code ? e.message : e.code === 'auth/email-already-in-use' ? T('Réessayez dans un instant.', 'Try again in a moment.') : T('Création impossible. Vérifiez la connexion.', 'Could not create. Check the connection.')); } },
  student: async f => { const fd = new FormData(f), id = f.dataset.id;
    const body = {name: String(fd.get('name')).trim(), level: fd.get('level'), sex: fd.get('sex') || '', birth: fd.get('birth') || '', parentName: String(fd.get('parentName') || '').trim(), parentPhone: String(fd.get('parentPhone') || '').trim(), phoneKey: digits(fd.get('parentPhone')), discount: num(fd.get('discount')), discountReason: fd.get('discountReason') || '', status: fd.get('status') || 'active'};
    if (!body.name) return;
    if (!isMgr()) { if (id) { delete body.discount; delete body.discountReason; } else { body.discount = 0; body.discountReason = ''; } }
    let newId = null;
    const ok = await write(db => { if (id) return db.doc('students/' + id).update(body); const ref = db.collection('students').doc(); newId = ref.id; return ref.set({...body, createdAt: nowISO(), year: YEAR, enrolledBy: S.profile.name || '', qrKey: genKey()}); }, id ? T('Fiche enregistrée', 'Record saved') : T('Élève inscrit(e)', 'Pupil enrolled'));
    if (ok) syncParentLevels([body.phoneKey, digits(student(id)?.parentPhone)]);
    const pf = f.querySelector('#sf-photo')?.files?.[0]; if (ok && pf) await savePhoto(id || newId, pf, digits(body.parentPhone ?? student(id)?.parentPhone));
    if (ok) openSheet(sheetStudent(id || newId)); },
  'students-many': async f => { const fd = new FormData(f), lv = fd.get('level');
    const rows = String(fd.get('list') || '').split('\n').map(l => l.split(/[;\t]/).map(x => x.trim())).filter(r => r[0]);
    if (!rows.length) return;
    const ok = await write(async db => { for (const r of rows) await db.collection('students').doc().set({name: r[0], level: lv, parentName: r[1] || '', parentPhone: r[2] || '', phoneKey: digits(r[2]), status: 'active', discount: 0, createdAt: nowISO(), year: YEAR, qrKey: genKey()}); }, T(`${rows.length} élève(s) ajouté(s) en ${LV[lv].name}`, `${rows.length} pupil(s) added to ${LV[lv].name}`));
    if (ok) syncParentLevels(rows.map(r => digits(r[2])));
    if (ok) closeSheet(); },
  pay: async f => { const fd = new FormData(f), s = student(f.dataset.id), amount = num(fd.get('amount')); if (!amount) { toast(T('Indiquez le montant reçu.', 'Enter the amount received.')); return; }
    const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = T('Enregistrement…', 'Saving…');
    let pid = null;
    const ok = await write(async db => {
      const n = await nextReceiptNo(); const label = receiptLabel(n); const obj = fd.get('object');
      const before = feeStatus(s); const balanceAfter = OBJ[obj]?.fees && feesSet() ? Math.max(0, before.balance - amount) : null;
      const ref = db.collection('payments').doc(); pid = ref.id;
      const p = {year: YEAR, studentId: s.id, phoneKey: digits(s.parentPhone), studentName: s.name, level: s.level, amount, object: obj, objectText: String(fd.get('objectText') || '').trim(), method: fd.get('method'), ref: String(fd.get('ref') || '').trim(), payer: String(fd.get('payer')).trim(), date: fd.get('date') || today(), receiptNo: n, receiptLabel: label, balanceAfter, by: S.profile.name || '', createdAt: nowISO(), cancelled: false};
      await ref.set(p);
      await db.doc('messages/rcpt_' + pid).set({year: YEAR, kind: 'receipt', studentId: s.id, phoneKey: digits(s.parentPhone), level: s.level, paymentId: pid, at: p.createdAt, readBy: {}, from: 'Bursar',
        title: `Paiement reçu : ${money(amount)}`, body: `Nous avons bien reçu ${money(amount)} pour ${s.name} (${OBJ[obj]?.fr}). Reçu N° ${label}.${balanceAfter != null ? ' Solde restant pour l’année : ' + money(balanceAfter) + '.' : ''}`,
        en: {title: `Payment received: ${money(amount)}`, body: `We have received ${money(amount)} for ${s.name} (${OBJ[obj]?.en}). Receipt N° ${label}.${balanceAfter != null ? ' Balance left for the year: ' + money(balanceAfter) + '.' : ''}`}});
    }, T('Paiement enregistré', 'Payment saved'));
    if (ok && pid) { S.cancelling = null; S.sheet = sheetReceipt(pid); render(); } else { btn.disabled = false; btn.textContent = T('Enregistrer et émettre le reçu', 'Save and issue receipt'); } },
  cancel: async f => { const fd = new FormData(f); const ok = await write(db => db.doc('payments/' + f.dataset.id).update({cancelled: true, cancelReason: String(fd.get('reason')), cancelledAt: today(), cancelledBy: S.profile.name || ''}), T('Reçu annulé', 'Receipt cancelled')); if (ok) { S.cancelling = null; refreshSheet(); } },
  announce: async f => { const fd = new FormData(f); const ok = await write(db => db.collection('messages').doc().set({year: YEAR, kind: 'announce', scope: fd.get('scope'), title: String(fd.get('title')).trim(), body: String(fd.get('body')).trim(), from: S.profile.name || ROLE_NAME()[S.profile.role], fromRole: S.profile.role, at: nowISO(), readBy: {}}), T('Message envoyé', 'Message sent')); if (ok) closeSheet(); },
  chat: async f => { const fd = new FormData(f), text = String(fd.get('text')).trim(), s = student(f.dataset.id); if (!text) return;
    const from = S.profile.role === 'parent' ? (s.parentName || 'Parent') : (S.profile.name || ROLE_NAME()[S.profile.role]);
    const ok = await write(db => db.collection('messages').doc().set({year: YEAR, kind: 'chat', studentId: s.id, phoneKey: digits(s.parentPhone), level: s.level, body: text, title: 'Message', from, fromRole: S.profile.role, at: nowISO(), readBy: {[S.me]: nowISO()}}));
    if (ok) { f.reset(); f.querySelector('textarea').focus(); } },
  justify: async f => { const fd = new FormData(f); const s = student(f.dataset.s); const ok = await write(db => db.doc('attendance/' + f.dataset.id).set({justif: {[f.dataset.s]: {text: String(fd.get('text')).trim(), at: nowISO(), by: s?.parentName || 'Parent'}}}, {merge: true}), T('Justificatif envoyé', 'Note sent')); if (ok) closeSheet(); },
  sec: async f => { const fd = new FormData(f), absent = !!fd.get('absent'), inT = absent ? '' : (fd.get('in') || ''), outT = absent ? '' : (fd.get('out') || '');
    if (inT && outT && toMin(outT) < toMin(inT)) { toast(T('Le départ est avant l’arrivée.', 'Departure is before arrival.')); return; }
    const ok = await staffWrite(S.stDate || today(), f.dataset.key, {sec: {absent, in: inT, out: outT, note: String(fd.get('note') || '').trim(), by: S.profile.name || '', editedAt: nowISO()}}, T('Pointage enregistré', 'Sign-in saved'));
    if (ok) closeSheet(); },
  staff: async f => { const fd = new FormData(f), key = f.dataset.key, ds = S.stDate || today(), status = fd.get('status');
    const inT = fd.get('in') || '', outT = fd.get('out') || '';
    if (inT && outT && toMin(outT) < toMin(inT)) { toast(T('Le départ est avant l’arrivée.', 'Departure is before arrival.')); return; }
    const ok = await staffWrite(ds, key, {status, in: status === 'P' ? inT : '', out: status === 'P' ? outT : '', note: String(fd.get('note') || '').trim(), editedBy: S.profile.name || ROLE_NAME()[S.profile.role], editedAt: nowISO()}, T('Présence enregistrée', 'Attendance saved'));
    if (ok) closeSheet(); },
  'verify-code': f => { const p = parseScan(new FormData(f).get('code')); if (p) { stopScan(); S.sheet = sheetVerify(p); render(); } else toast(T('Numéro de carte incomplet.', 'Incomplete card number.')); },
  settings: async f => { const fd = new FormData(f); const teachers = {}, fees = {};
    LEVELS.forEach(l => { teachers[l.id] = String(fd.get('t-' + l.id) || '').trim(); fees[l.id] = {}; FEE_PARTS.forEach(([k]) => fees[l.id][k] = num(fd.get(`f-${l.id}-${k}`))); });
    await write(db => db.doc('config/school').set({...cfg(), teachers, fees, absenceThreshold: Math.max(1, num(fd.get('abs-th')) || 5), directorName: String(fd.get('dir-name') || '').trim(), assistantName: String(fd.get('adj-name') || '').trim(), secretaryName: String(fd.get('sec-name') || '').trim(), startTime: fd.get('start-t') || '07:00', endTime: fd.get('end-t') || '15:00', hoursModel: 2, feeModel: 2, due1: fd.get('due1') || due1(), due2: fd.get('due2') || due2(), gapTolerance: Math.max(1, num(fd.get('gap-t')) || 10), updatedAt: nowISO()}), T('Réglages enregistrés', 'Settings saved')); },
  stat: async f => { const fd = new FormData(f), year = String(fd.get('year')).trim(); if (!/^\d{4}-\d{4}$/.test(year)) { toast(T('Année au format 2024-2025', 'Use the format 2024-2025')); return; }
    const body = {year, ce: {cand: num(fd.get('ce-cand')), pass: num(fd.get('ce-pass'))}, fslc: {cand: num(fd.get('fslc-cand')), pass: num(fd.get('fslc-pass'))}, admitted: String(fd.get('admitted') || '').split('\n').map(x => x.trim()).filter(Boolean)};
    if (body.ce.pass > body.ce.cand || body.fslc.pass > body.fslc.cand) { toast(T('Le nombre d’admis dépasse celui des candidats.', 'More passes than candidates.')); return; }
    if (year !== YEAR) { body.enrol = {}; LEVELS.forEach(l => body.enrol[l.id] = num(fd.get('e-' + l.id))); body.enrolLocked = true; }
    const ok = await write(db => db.doc('stats/' + year).set(body), T('Statistiques enregistrées', 'Statistics saved')); if (ok) closeSheet(); }
};
document.addEventListener('submit', e => { const f = e.target.closest('form[data-form]'); if (!f) return; e.preventDefault(); FORMS[f.dataset.form]?.(f); });

window.addEventListener('online', () => render()); window.addEventListener('offline', () => render());
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
readDeepLink();
boot();
})();

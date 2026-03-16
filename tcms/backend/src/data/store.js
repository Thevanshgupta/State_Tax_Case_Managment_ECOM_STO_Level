/**
 * In-Memory Data Store
 * -------------------------------------------------------------------
 * Used when USE_DATABASE=false (default for quick startup).
 * All service layer code reads/writes through this module.
 * To switch to PostgreSQL: set USE_DATABASE=true in .env and
 * update each service to call db.query() instead of store.*.
 * -------------------------------------------------------------------
 */

/* ── ID counters ──────────────────────────────── */
const counters = { users: 8, cases: 11, stages: 10, flags: 5, history: 60, sessions: 20, audit: 10 };
const nextId = (key) => counters[key]++;

/* ── Users ────────────────────────────────────── */
const users = [
  { id:1, employeeId:'GOI/ADM/2024/001', name:'Vikram Nair',  email:'admin@tcms.gov.in',  passwordHash:'', role:'admin', circle:null,                  status:'active', createdAt:'2024-01-01' },
  { id:2, employeeId:'GOI/EDC/2024/001', name:'Rajesh Mehta', email:'edcom@tcms.gov.in',  passwordHash:'', role:'edcom', circle:null,                  status:'active', createdAt:'2024-01-01' },
  { id:3, employeeId:'GOI/STO/2024/001', name:'Priya Sharma', email:'sto1@tcms.gov.in',   passwordHash:'', role:'sto',   circle:'Circle-I (North)',    status:'active', createdAt:'2024-01-01' },
  { id:4, employeeId:'GOI/STO/2024/002', name:'Amit Singh',   email:'sto2@tcms.gov.in',   passwordHash:'', role:'sto',   circle:'Circle-II (South)',   status:'active', createdAt:'2024-01-01' },
  { id:5, employeeId:'GOI/STO/2024/003', name:'Sunita Patel', email:'sto3@tcms.gov.in',   passwordHash:'', role:'sto',   circle:'Circle-III (East)',   status:'active', createdAt:'2024-01-01' },
  { id:6, employeeId:'GOI/STO/2024/004', name:'Deepak Rao',   email:'sto4@tcms.gov.in',   passwordHash:'', role:'sto',   circle:'Circle-IV (West)',    status:'active', createdAt:'2024-01-01' },
  { id:7, employeeId:'GOI/STO/2024/005', name:'Kavitha R.',   email:'sto5@tcms.gov.in',   passwordHash:'', role:'sto',   circle:'Circle-V (Central)', status:'active', createdAt:'2024-01-01' },
];

/* ── Action Stages ────────────────────────────── */
const stages = [
  { id:1, code:'ASMT10', description:'Assessment Notice',    displayOrder:1, isTerminal:false, isActive:true },
  { id:2, code:'ASMT12', description:'Assessment Order',     displayOrder:2, isTerminal:false, isActive:true },
  { id:3, code:'DRC01',  description:'Show Cause Notice',    displayOrder:3, isTerminal:false, isActive:true },
  { id:4, code:'DRC02',  description:'Summary of SCN',       displayOrder:4, isTerminal:false, isActive:true },
  { id:5, code:'DRC03',  description:'Payment by Taxpayer',  displayOrder:5, isTerminal:false, isActive:true },
  { id:6, code:'DRC04',  description:'Acknowledgement',      displayOrder:6, isTerminal:false, isActive:true },
  { id:7, code:'DRC05',  description:'Summary of Statement', displayOrder:7, isTerminal:false, isActive:true },
  { id:8, code:'DRC06',  description:'Reply of Taxpayer',    displayOrder:8, isTerminal:false, isActive:true },
  { id:9, code:'DRC07',  description:'Summary of Order',     displayOrder:9, isTerminal:true,  isActive:true },
];

/* ── Cases (amounts stored as paise = rupees × 100) ── */
const cases = [
  { id:1,  caseNumber:'CASE/2024-25/0001', taxpayerName:'M/s Sharma General Stores',  gstin:'07AAACS1234A1Z5', circle:'Circle-I (North)',    financialYear:'2024-25', cgstAmount:12500000, sgstAmount:12500000, cessAmount:1250000, actionStage:'DRC01',  status:'In Process', assignedTo:3, assignedBy:2, assignedAt:'2024-01-11', isFlagged:false, lastRemarks:'Notice issued to taxpayer',      createdBy:2, createdAt:'2024-01-10', updatedAt:'2024-01-15' },
  { id:2,  caseNumber:'CASE/2024-25/0002', taxpayerName:'Raj Electronics Pvt. Ltd.',   gstin:'07AABCR5678B2Z1', circle:'Circle-II (South)',   financialYear:'2024-25', cgstAmount:8900000,  sgstAmount:8900000,  cessAmount:890000,  actionStage:'ASMT10', status:'In Process', assignedTo:4, assignedBy:2, assignedAt:'2024-01-21', isFlagged:true,  lastRemarks:'Awaiting taxpayer response',      createdBy:2, createdAt:'2024-01-20', updatedAt:'2024-02-05' },
  { id:3,  caseNumber:'CASE/2024-25/0003', taxpayerName:'Global Textiles Co.',          gstin:'07AADCG9012C3Z7', circle:'Circle-III (East)',   financialYear:'2024-25', cgstAmount:45000000, sgstAmount:45000000, cessAmount:4500000, actionStage:'DRC03',  status:'In Process', assignedTo:5, assignedBy:2, assignedAt:'2024-01-06', isFlagged:false, lastRemarks:'Partial payment received',        createdBy:2, createdAt:'2024-01-05', updatedAt:'2024-02-01' },
  { id:4,  caseNumber:'CASE/2024-25/0004', taxpayerName:'Sunrise Pharma Ltd.',          gstin:'07AAHCS3456D4Z2', circle:'Circle-IV (West)',    financialYear:'2024-25', cgstAmount:22500000, sgstAmount:22500000, cessAmount:2250000, actionStage:'DRC07',  status:'Completed',  assignedTo:6, assignedBy:2, assignedAt:'2023-12-02', isFlagged:false, lastRemarks:'Order passed, case closed',       createdBy:2, createdAt:'2023-12-01', updatedAt:'2024-01-05' },
  { id:5,  caseNumber:'CASE/2024-25/0005', taxpayerName:'Heritage Constructions',       gstin:'07AAJCH7890E5Z8', circle:'Circle-V (Central)',  financialYear:'2024-25', cgstAmount:7800000,  sgstAmount:7800000,  cessAmount:780000,  actionStage:null,     status:'Pending',    assignedTo:7, assignedBy:2, assignedAt:'2024-02-10', isFlagged:false, lastRemarks:'',                                createdBy:2, createdAt:'2024-02-10', updatedAt:'2024-02-10' },
  { id:6,  caseNumber:'CASE/2024-25/0006', taxpayerName:'M/s Patel Agro Industries',   gstin:'07AAGCP2345F6Z3', circle:'Circle-I (North)',    financialYear:'2024-25', cgstAmount:31500000, sgstAmount:31500000, cessAmount:3150000, actionStage:'DRC02',  status:'In Process', assignedTo:3, assignedBy:2, assignedAt:'2024-01-25', isFlagged:false, lastRemarks:'Summary of SCN prepared',        createdBy:2, createdAt:'2024-01-25', updatedAt:'2024-02-08' },
  { id:7,  caseNumber:'CASE/2024-25/0007', taxpayerName:'New Delhi Hospitality LLP',   gstin:'07AAACN1234G7Z9', circle:'Circle-II (South)',   financialYear:'2024-25', cgstAmount:5200000,  sgstAmount:5200000,  cessAmount:520000,  actionStage:'ASMT12', status:'In Process', assignedTo:4, assignedBy:2, assignedAt:'2024-02-15', isFlagged:false, lastRemarks:'Assessment order in draft',       createdBy:2, createdAt:'2024-02-15', updatedAt:'2024-02-25' },
  { id:8,  caseNumber:'CASE/2024-25/0008', taxpayerName:'Royal Exports Pvt. Ltd.',      gstin:'07AAACR5678H8Z4', circle:'Circle-III (East)',   financialYear:'2024-25', cgstAmount:68000000, sgstAmount:68000000, cessAmount:6800000, actionStage:'DRC06',  status:'In Process', assignedTo:5, assignedBy:2, assignedAt:'2024-02-01', isFlagged:true,  lastRemarks:'Reply received, under review',    createdBy:2, createdAt:'2024-02-01', updatedAt:'2024-03-01' },
  { id:9,  caseNumber:'CASE/2024-25/0009', taxpayerName:'Bharat Steel Works',           gstin:'07AADCB3456I9Z6', circle:'Circle-IV (West)',    financialYear:'2024-25', cgstAmount:19200000, sgstAmount:19200000, cessAmount:1920000, actionStage:'DRC04',  status:'In Process', assignedTo:6, assignedBy:2, assignedAt:'2024-02-12', isFlagged:false, lastRemarks:'Payment acknowledged',            createdBy:2, createdAt:'2024-02-12', updatedAt:'2024-02-25' },
  { id:10, caseNumber:'CASE/2024-25/0010', taxpayerName:'Sunrise Auto Parts',           gstin:'07AAACS9012J0Z2', circle:'Circle-V (Central)',  financialYear:'2024-25', cgstAmount:3750000,  sgstAmount:3750000,  cessAmount:375000,  actionStage:null,     status:'Pending',    assignedTo:7, assignedBy:2, assignedAt:'2024-02-20', isFlagged:false, lastRemarks:'',                                createdBy:2, createdAt:'2024-02-20', updatedAt:'2024-02-20' },
];

/* ── Case History ─────────────────────────────── */
const caseHistory = [
  { id:1,  caseId:1, userId:2, userName:'Rajesh Mehta', actionType:'created',       oldValue:null,      newValue:null,          remarks:'Scrutiny FY 2021-22',           createdAt:'2024-01-10' },
  { id:2,  caseId:1, userId:2, userName:'Rajesh Mehta', actionType:'assigned',      oldValue:null,      newValue:'Priya Sharma', remarks:'Circle-I assignment',           createdAt:'2024-01-11' },
  { id:3,  caseId:1, userId:3, userName:'Priya Sharma', actionType:'stage_updated', oldValue:null,      newValue:'DRC01',        remarks:'Notice issued to taxpayer',     createdAt:'2024-01-15' },
  { id:4,  caseId:2, userId:2, userName:'Rajesh Mehta', actionType:'created',       oldValue:null,      newValue:null,           remarks:'ITC mismatch case',             createdAt:'2024-01-20' },
  { id:5,  caseId:2, userId:2, userName:'Rajesh Mehta', actionType:'assigned',      oldValue:null,      newValue:'Amit Singh',   remarks:'Circle-II assignment',          createdAt:'2024-01-21' },
  { id:6,  caseId:2, userId:4, userName:'Amit Singh',   actionType:'stage_updated', oldValue:null,      newValue:'ASMT10',       remarks:'Assessment notice issued',      createdAt:'2024-01-28' },
  { id:7,  caseId:2, userId:4, userName:'Amit Singh',   actionType:'flagged',       oldValue:null,      newValue:'Non-Compliance',remarks:'No response to notices',       createdAt:'2024-02-05' },
  { id:8,  caseId:3, userId:2, userName:'Rajesh Mehta', actionType:'created',       oldValue:null,      newValue:null,           remarks:'Large taxpayer scrutiny',       createdAt:'2024-01-05' },
  { id:9,  caseId:3, userId:2, userName:'Rajesh Mehta', actionType:'assigned',      oldValue:null,      newValue:'Sunita Patel', remarks:'Circle-III assignment',         createdAt:'2024-01-06' },
  { id:10, caseId:3, userId:5, userName:'Sunita Patel', actionType:'stage_updated', oldValue:null,      newValue:'DRC01',        remarks:'SCN issued',                    createdAt:'2024-01-15' },
  { id:11, caseId:3, userId:5, userName:'Sunita Patel', actionType:'stage_updated', oldValue:'DRC01',   newValue:'DRC03',        remarks:'Partial payment received',      createdAt:'2024-02-01' },
  { id:12, caseId:4, userId:2, userName:'Rajesh Mehta', actionType:'created',       oldValue:null,      newValue:null,           remarks:'Routine scrutiny',              createdAt:'2023-12-01' },
  { id:13, caseId:4, userId:2, userName:'Rajesh Mehta', actionType:'assigned',      oldValue:null,      newValue:'Deepak Rao',   remarks:'Circle-IV assignment',          createdAt:'2023-12-02' },
  { id:14, caseId:4, userId:6, userName:'Deepak Rao',   actionType:'stage_updated', oldValue:'DRC01',   newValue:'DRC07',        remarks:'Order passed',                  createdAt:'2024-01-05' },
  { id:15, caseId:4, userId:6, userName:'Deepak Rao',   actionType:'status_changed',oldValue:'In Process',newValue:'Completed',  remarks:'Case closed',                   createdAt:'2024-01-05' },
  { id:16, caseId:8, userId:2, userName:'Rajesh Mehta', actionType:'created',       oldValue:null,      newValue:null,           remarks:'High value case',               createdAt:'2024-02-01' },
  { id:17, caseId:8, userId:2, userName:'Rajesh Mehta', actionType:'assigned',      oldValue:null,      newValue:'Sunita Patel', remarks:'Circle-III assignment',         createdAt:'2024-02-01' },
  { id:18, caseId:8, userId:5, userName:'Sunita Patel', actionType:'stage_updated', oldValue:null,      newValue:'DRC01',        remarks:'SCN issued',                    createdAt:'2024-02-10' },
  { id:19, caseId:8, userId:5, userName:'Sunita Patel', actionType:'stage_updated', oldValue:'DRC01',   newValue:'DRC06',        remarks:'Reply received, under review',  createdAt:'2024-02-20' },
  { id:20, caseId:8, userId:5, userName:'Sunita Patel', actionType:'flagged',       oldValue:null,      newValue:'High Value',   remarks:'Priority attention needed',     createdAt:'2024-03-01' },
];

/* ── Flag History ─────────────────────────────── */
const flagHistory = [
  { id:1, caseId:2, flaggedBy:4, flaggedByName:'Amit Singh',   reason:'Non-Compliance', remarks:'No response to notices', isActive:true, flaggedAt:'2024-02-05', removedAt:null, removedBy:null },
  { id:2, caseId:8, flaggedBy:5, flaggedByName:'Sunita Patel', reason:'High Value',     remarks:'Priority attention needed', isActive:true, flaggedAt:'2024-03-01', removedAt:null, removedBy:null },
];

/* ── Sessions ─────────────────────────────────── */
const sessions = [];

/* ── Audit Log ────────────────────────────────── */
const auditLog = [];

/* ══ Store API ════════════════════════════════════ */
const store = {
  /* -- Users -- */
  users: {
    findAll:        ()         => [...users],
    findById:       (id)       => users.find(u => u.id === id),
    findByEmail:    (email)    => users.find(u => u.email === email),
    create:         (data)     => { const u = { ...data, id: nextId('users') }; users.push(u); return u; },
    update:         (id, data) => { const i = users.findIndex(u => u.id === id); if (i < 0) return null; Object.assign(users[i], data); return users[i]; },
  },

  /* -- Stages -- */
  stages: {
    findAll:        ()         => [...stages],
    findActive:     ()         => stages.filter(s => s.isActive).sort((a,b) => a.displayOrder - b.displayOrder),
    findById:       (id)       => stages.find(s => s.id === id),
    findByCode:     (code)     => stages.find(s => s.code === code),
    create:         (data)     => { const s = { ...data, id: nextId('stages') }; stages.push(s); return s; },
    update:         (id, data) => { const i = stages.findIndex(s => s.id === id); if (i < 0) return null; Object.assign(stages[i], data); return stages[i]; },
  },

  /* -- Cases -- */
  cases: {
    findAll:        ()         => [...cases],
    findById:       (id)       => cases.find(c => c.id === id),
    findByUser:     (uid)      => cases.filter(c => c.assignedTo === uid),
    countByFY:      (fy)       => cases.filter(c => c.financialYear === fy).length,
    create:         (data)     => { const c = { ...data, id: nextId('cases') }; cases.push(c); return c; },
    update:         (id, data) => { const i = cases.findIndex(c => c.id === id); if (i < 0) return null; Object.assign(cases[i], data); return cases[i]; },
  },

  /* -- Case History -- */
  history: {
    findByCaseId:   (caseId)   => caseHistory.filter(h => h.caseId === caseId).sort((a,b) => a.createdAt.localeCompare(b.createdAt)),
    findAll:        ()         => [...caseHistory].sort((a,b) => b.createdAt.localeCompare(a.createdAt)),
    add:            (data)     => { const h = { ...data, id: nextId('history') }; caseHistory.push(h); return h; },
  },

  /* -- Flag History -- */
  flags: {
    findByCaseId:   (caseId)   => flagHistory.filter(f => f.caseId === caseId),
    findActiveByCase:(caseId)  => flagHistory.find(f => f.caseId === caseId && f.isActive),
    add:            (data)     => { const f = { ...data, id: nextId('flags') }; flagHistory.push(f); return f; },
    deactivate:     (id, data) => { const i = flagHistory.findIndex(f => f.id === id); if (i >= 0) Object.assign(flagHistory[i], data); },
  },

  /* -- Sessions -- */
  sessions: {
    add:            (s)        => { sessions.push(s); },
    findByJti:      (jti)      => sessions.find(s => s.jti === jti),
    revoke:         (jti)      => { const s = sessions.find(x => x.jti === jti); if (s) s.revoked = true; },
    isValid:        (jti)      => { const s = sessions.find(x => x.jti === jti); return s && !s.revoked && new Date(s.expiresAt) > new Date(); },
  },

  /* -- Audit -- */
  audit: {
    add:            (data)     => { const a = { ...data, id: nextId('audit') }; auditLog.push(a); return a; },
    findAll:        ()         => [...auditLog].sort((a,b) => b.createdAt.localeCompare(a.createdAt)),
    findByUser:     (uid)      => auditLog.filter(a => a.userId === uid),
  },
};

module.exports = store;
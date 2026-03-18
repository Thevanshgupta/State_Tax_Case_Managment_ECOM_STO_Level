export const MOCK_USERS = [
  { id:1, employeeId:'GOI/ADM/2024/001', name:'Vikram Nair',  email:'admin@tcms.gov.in',  role:'admin', circle:null,                  status:'active' },
  { id:2, employeeId:'GOI/EDC/2024/001', name:'Rajesh Mehta', email:'edcom@tcms.gov.in',  role:'edcom', circle:null,                  status:'active' },
  { id:3, employeeId:'GOI/STO/2024/001', name:'Priya Sharma', email:'sto1@tcms.gov.in',   role:'sto',   circle:'Circle-I (North)',    status:'active' },
  { id:4, employeeId:'GOI/STO/2024/002', name:'Amit Singh',   email:'sto2@tcms.gov.in',   role:'sto',   circle:'Circle-II (South)',   status:'active' },
  { id:5, employeeId:'GOI/STO/2024/003', name:'Sunita Patel', email:'sto3@tcms.gov.in',   role:'sto',   circle:'Circle-III (East)',   status:'active' },
  { id:6, employeeId:'GOI/STO/2024/004', name:'Deepak Rao',   email:'sto4@tcms.gov.in',   role:'sto',   circle:'Circle-IV (West)',    status:'active' },
  { id:7, employeeId:'GOI/STO/2024/005', name:'Kavitha R.',   email:'sto5@tcms.gov.in',   role:'sto',   circle:'Circle-V (Central)', status:'active' },
];

export const MOCK_STAGES = [
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

export const MOCK_CASES = [
  { id:1,  caseNumber:'CASE/2024-25/0001', taxpayerName:'M/s Sharma General Stores',  gstin:'07AAACS1234A1Z5', circle:'Circle-I (North)',    financialYear:'2024-25', cgst:125000,  sgst:125000,  cess:12500,  total:262500,  actionStage:'DRC01',  status:'In Process', isFlagged:false, lastRemarks:'Notice issued to taxpayer',      assignedTo:3, assignedToName:'Priya Sharma', createdAt:'10 Jan 2024', updatedAt:'15 Jan 2024' },
  { id:2,  caseNumber:'CASE/2024-25/0002', taxpayerName:'Raj Electronics Pvt. Ltd.',   gstin:'07AABCR5678B2Z1', circle:'Circle-II (South)',   financialYear:'2024-25', cgst:89000,   sgst:89000,   cess:8900,   total:186900,  actionStage:'ASMT10', status:'In Process', isFlagged:true,  lastRemarks:'Awaiting taxpayer response',      assignedTo:4, assignedToName:'Amit Singh',   createdAt:'20 Jan 2024', updatedAt:'05 Feb 2024' },
  { id:3,  caseNumber:'CASE/2024-25/0003', taxpayerName:'Global Textiles Co.',          gstin:'07AADCG9012C3Z7', circle:'Circle-III (East)',   financialYear:'2024-25', cgst:450000,  sgst:450000,  cess:45000,  total:945000,  actionStage:'DRC03',  status:'In Process', isFlagged:false, lastRemarks:'Partial payment received',        assignedTo:5, assignedToName:'Sunita Patel', createdAt:'05 Jan 2024', updatedAt:'01 Feb 2024' },
  { id:4,  caseNumber:'CASE/2024-25/0004', taxpayerName:'Sunrise Pharma Ltd.',          gstin:'07AAHCS3456D4Z2', circle:'Circle-IV (West)',    financialYear:'2024-25', cgst:225000,  sgst:225000,  cess:22500,  total:472500,  actionStage:'DRC07',  status:'Completed',  isFlagged:false, lastRemarks:'Order passed, case closed',       assignedTo:6, assignedToName:'Deepak Rao',   createdAt:'01 Dec 2023', updatedAt:'05 Jan 2024' },
  { id:5,  caseNumber:'CASE/2024-25/0005', taxpayerName:'Heritage Constructions',       gstin:'07AAJCH7890E5Z8', circle:'Circle-V (Central)',  financialYear:'2024-25', cgst:78000,   sgst:78000,   cess:7800,   total:163800,  actionStage:null,     status:'Pending',    isFlagged:false, lastRemarks:'Awaiting first action',           assignedTo:7, assignedToName:'Kavitha R.',   createdAt:'10 Feb 2024', updatedAt:'10 Feb 2024' },
  { id:6,  caseNumber:'CASE/2024-25/0006', taxpayerName:'M/s Patel Agro Industries',   gstin:'07AAGCP2345F6Z3', circle:'Circle-I (North)',    financialYear:'2024-25', cgst:315000,  sgst:315000,  cess:31500,  total:661500,  actionStage:'DRC02',  status:'In Process', isFlagged:false, lastRemarks:'Summary of SCN prepared',        assignedTo:3, assignedToName:'Priya Sharma', createdAt:'25 Jan 2024', updatedAt:'08 Feb 2024' },
  { id:7,  caseNumber:'CASE/2024-25/0007', taxpayerName:'New Delhi Hospitality LLP',   gstin:'07AAACN1234G7Z9', circle:'Circle-II (South)',   financialYear:'2024-25', cgst:52000,   sgst:52000,   cess:5200,   total:109200,  actionStage:'ASMT12', status:'In Process', isFlagged:false, lastRemarks:'Assessment order in draft',       assignedTo:4, assignedToName:'Amit Singh',   createdAt:'15 Feb 2024', updatedAt:'25 Feb 2024' },
  { id:8,  caseNumber:'CASE/2024-25/0008', taxpayerName:'Royal Exports Pvt. Ltd.',      gstin:'07AAACR5678H8Z4', circle:'Circle-III (East)',   financialYear:'2024-25', cgst:680000,  sgst:680000,  cess:68000,  total:1428000, actionStage:'DRC06',  status:'In Process', isFlagged:true,  lastRemarks:'Reply received, under review',    assignedTo:5, assignedToName:'Sunita Patel', createdAt:'01 Feb 2024', updatedAt:'01 Mar 2024' },
  { id:9,  caseNumber:'CASE/2024-25/0009', taxpayerName:'Bharat Steel Works',           gstin:'07AADCB3456I9Z6', circle:'Circle-IV (West)',    financialYear:'2024-25', cgst:192000,  sgst:192000,  cess:19200,  total:403200,  actionStage:'DRC04',  status:'In Process', isFlagged:false, lastRemarks:'Payment acknowledged',            assignedTo:6, assignedToName:'Deepak Rao',   createdAt:'12 Feb 2024', updatedAt:'25 Feb 2024' },
  { id:10, caseNumber:'CASE/2024-25/0010', taxpayerName:'Sunrise Auto Parts',           gstin:'07AAACS9012J0Z2', circle:'Circle-V (Central)',  financialYear:'2024-25', cgst:37500,   sgst:37500,   cess:3750,   total:78750,   actionStage:null,     status:'Pending',    isFlagged:false, lastRemarks:'Awaiting first action',           assignedTo:7, assignedToName:'Kavitha R.',   createdAt:'20 Feb 2024', updatedAt:'20 Feb 2024' },
];

/* ── Complete history for ALL 10 cases ─────────── */
export const MOCK_HISTORY = {
  1: [
    { id:1,  userId:2, userName:'Rajesh Mehta', actionType:'created',       newValue:null,            remarks:'Scrutiny case FY 2021-22',                createdAt:'10 Jan 2024' },
    { id:2,  userId:2, userName:'Rajesh Mehta', actionType:'assigned',      newValue:'Priya Sharma',  remarks:'Assigned to Circle-I officer',            createdAt:'11 Jan 2024' },
    { id:3,  userId:3, userName:'Priya Sharma', actionType:'stage_updated', newValue:'DRC01',         remarks:'Show Cause Notice issued to taxpayer',    createdAt:'15 Jan 2024' },
  ],
  2: [
    { id:4,  userId:2, userName:'Rajesh Mehta', actionType:'created',       newValue:null,              remarks:'ITC mismatch detected — FY 2022-23',       createdAt:'20 Jan 2024' },
    { id:5,  userId:2, userName:'Rajesh Mehta', actionType:'assigned',      newValue:'Amit Singh',      remarks:'Assigned to Circle-II officer',             createdAt:'21 Jan 2024' },
    { id:6,  userId:4, userName:'Amit Singh',   actionType:'stage_updated', newValue:'ASMT10',          remarks:'Assessment Notice issued to taxpayer',      createdAt:'28 Jan 2024' },
    { id:7,  userId:4, userName:'Amit Singh',   actionType:'flagged',       newValue:'Non-Compliance',  remarks:'Taxpayer not responding to notices',        createdAt:'05 Feb 2024' },
  ],
  3: [
    { id:8,  userId:2, userName:'Rajesh Mehta', actionType:'created',       newValue:null,            remarks:'Large taxpayer — ITC reversal scrutiny',    createdAt:'05 Jan 2024' },
    { id:9,  userId:2, userName:'Rajesh Mehta', actionType:'assigned',      newValue:'Sunita Patel',  remarks:'Assigned to Circle-III officer',            createdAt:'06 Jan 2024' },
    { id:10, userId:5, userName:'Sunita Patel', actionType:'stage_updated', newValue:'DRC01',         remarks:'Show Cause Notice issued',                  createdAt:'15 Jan 2024' },
    { id:11, userId:5, userName:'Sunita Patel', actionType:'stage_updated', newValue:'DRC03',         remarks:'Partial payment received from taxpayer',    createdAt:'01 Feb 2024' },
  ],
  4: [
    { id:12, userId:2, userName:'Rajesh Mehta', actionType:'created',        newValue:null,          remarks:'Routine annual scrutiny',                    createdAt:'01 Dec 2023' },
    { id:13, userId:2, userName:'Rajesh Mehta', actionType:'assigned',       newValue:'Deepak Rao',  remarks:'Assigned to Circle-IV officer',              createdAt:'02 Dec 2023' },
    { id:14, userId:6, userName:'Deepak Rao',   actionType:'stage_updated',  newValue:'DRC01',       remarks:'Show Cause Notice issued',                   createdAt:'15 Dec 2023' },
    { id:15, userId:6, userName:'Deepak Rao',   actionType:'stage_updated',  newValue:'DRC03',       remarks:'Taxpayer made full payment',                 createdAt:'28 Dec 2023' },
    { id:16, userId:6, userName:'Deepak Rao',   actionType:'stage_updated',  newValue:'DRC07',       remarks:'Summary of Order issued — case concluded',  createdAt:'05 Jan 2024' },
    { id:17, userId:6, userName:'Deepak Rao',   actionType:'status_changed', newValue:'Completed',   remarks:'Case marked Completed and closed',           createdAt:'05 Jan 2024' },
  ],
  5: [
    { id:18, userId:2, userName:'Rajesh Mehta', actionType:'created',  newValue:null,           remarks:'New case — ITC verification required',     createdAt:'10 Feb 2024' },
    { id:19, userId:2, userName:'Rajesh Mehta', actionType:'assigned', newValue:'Kavitha R.',   remarks:'Assigned to Circle-V officer',             createdAt:'10 Feb 2024' },
  ],
  6: [
    { id:20, userId:2, userName:'Rajesh Mehta', actionType:'created',       newValue:null,            remarks:'ITC reversal case — FY 2022-23',           createdAt:'25 Jan 2024' },
    { id:21, userId:2, userName:'Rajesh Mehta', actionType:'assigned',      newValue:'Priya Sharma',  remarks:'Assigned to Circle-I officer',             createdAt:'25 Jan 2024' },
    { id:22, userId:3, userName:'Priya Sharma', actionType:'stage_updated', newValue:'DRC01',         remarks:'Show Cause Notice issued',                 createdAt:'01 Feb 2024' },
    { id:23, userId:3, userName:'Priya Sharma', actionType:'stage_updated', newValue:'DRC02',         remarks:'Summary of SCN prepared and sent',         createdAt:'08 Feb 2024' },
  ],
  7: [
    { id:24, userId:2, userName:'Rajesh Mehta', actionType:'created',       newValue:null,          remarks:'Assessment case — turnover discrepancy',   createdAt:'15 Feb 2024' },
    { id:25, userId:2, userName:'Rajesh Mehta', actionType:'assigned',      newValue:'Amit Singh',  remarks:'Assigned to Circle-II officer',            createdAt:'15 Feb 2024' },
    { id:26, userId:4, userName:'Amit Singh',   actionType:'stage_updated', newValue:'ASMT10',      remarks:'Assessment Notice issued to taxpayer',     createdAt:'20 Feb 2024' },
    { id:27, userId:4, userName:'Amit Singh',   actionType:'stage_updated', newValue:'ASMT12',      remarks:'Assessment Order drafted — under review',   createdAt:'25 Feb 2024' },
  ],
  8: [
    { id:28, userId:2, userName:'Rajesh Mehta', actionType:'created',       newValue:null,             remarks:'High value — export ITC mismatch',          createdAt:'01 Feb 2024' },
    { id:29, userId:2, userName:'Rajesh Mehta', actionType:'assigned',      newValue:'Sunita Patel',   remarks:'Assigned to Circle-III officer',            createdAt:'01 Feb 2024' },
    { id:30, userId:5, userName:'Sunita Patel', actionType:'stage_updated', newValue:'DRC01',          remarks:'Show Cause Notice issued',                  createdAt:'10 Feb 2024' },
    { id:31, userId:5, userName:'Sunita Patel', actionType:'stage_updated', newValue:'DRC06',          remarks:'Taxpayer reply received — under review',    createdAt:'20 Feb 2024' },
    { id:32, userId:5, userName:'Sunita Patel', actionType:'flagged',       newValue:'High Value',     remarks:'Escalated for priority review',             createdAt:'01 Mar 2024' },
  ],
  9: [
    { id:33, userId:2, userName:'Rajesh Mehta', actionType:'created',       newValue:null,          remarks:'Demand recovery case — FY 2021-22',        createdAt:'12 Feb 2024' },
    { id:34, userId:2, userName:'Rajesh Mehta', actionType:'assigned',      newValue:'Deepak Rao',  remarks:'Assigned to Circle-IV officer',            createdAt:'12 Feb 2024' },
    { id:35, userId:6, userName:'Deepak Rao',   actionType:'stage_updated', newValue:'DRC01',       remarks:'Show Cause Notice issued',                 createdAt:'18 Feb 2024' },
    { id:36, userId:6, userName:'Deepak Rao',   actionType:'stage_updated', newValue:'DRC03',       remarks:'Taxpayer initiated payment',               createdAt:'22 Feb 2024' },
    { id:37, userId:6, userName:'Deepak Rao',   actionType:'stage_updated', newValue:'DRC04',       remarks:'Payment acknowledged — amount verified',   createdAt:'25 Feb 2024' },
  ],
  10: [
    { id:38, userId:2, userName:'Rajesh Mehta', actionType:'created',  newValue:null,           remarks:'New scrutiny — returns mismatch',           createdAt:'20 Feb 2024' },
    { id:39, userId:2, userName:'Rajesh Mehta', actionType:'assigned', newValue:'Kavitha R.',   remarks:'Assigned to Circle-V officer',             createdAt:'20 Feb 2024' },
  ],
};

export const MOCK_FLAGS = {
  2: [{ id:1, flaggedBy:4, flaggedByName:'Amit Singh',   reason:'Non-Compliance', remarks:'Taxpayer not responding to notices', isActive:true, flaggedAt:'05 Feb 2024' }],
  8: [{ id:2, flaggedBy:5, flaggedByName:'Sunita Patel', reason:'High Value',     remarks:'Priority attention needed',          isActive:true, flaggedAt:'01 Mar 2024' }],
};

export const MOCK_CREDENTIALS = {
  'admin@tcms.gov.in': 'admin123',
  'edcom@tcms.gov.in': 'edcom123',
  'sto1@tcms.gov.in':  'sto123',
  'sto2@tcms.gov.in':  'sto123',
  'sto3@tcms.gov.in':  'sto123',
  'sto4@tcms.gov.in':  'sto123',
  'sto5@tcms.gov.in':  'sto123',
};
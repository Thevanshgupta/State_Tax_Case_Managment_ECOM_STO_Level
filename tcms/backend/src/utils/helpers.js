const todayStr = () => new Date().toISOString().split('T')[0];
const nowStr   = () => new Date().toISOString();

/**
 * Convert rupees to paise (store amounts as integer paise)
 * @param {number} rupees
 */
const toPaise = (rupees) => Math.round(Number(rupees) * 100);

/**
 * Convert paise to rupees
 * @param {number} paise
 */
const toRupees = (paise) => paise / 100;

/**
 * Generate next case number for a financial year
 * @param {string} fy  e.g. "2024-25"
 * @param {number} count  current case count for this FY
 */
const caseNumber = (fy, count) => `CASE/${fy}/${String(count + 1).padStart(4, '0')}`;

/**
 * Strip passwordHash from user object before sending to client
 * @param {object} user
 */
const safeUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
};

/**
 * Calculate total demand from a case record
 * @param {object} c  case record with cgstAmount, sgstAmount, cessAmount
 */
const caseTotal = (c) => (c.cgstAmount || 0) + (c.sgstAmount || 0) + (c.cessAmount || 0);

/**
 * Format a case record for API response (convert paise → rupees)
 * @param {object} c      raw case record
 * @param {object[]} users  user list for name lookup
 */
const formatCase = (c, users = []) => {
  const assignedUser  = users.find(u => u.id === c.assignedTo)  || null;
  const createdByUser = users.find(u => u.id === c.createdBy)   || null;
  return {
    id:             c.id,
    caseNumber:     c.caseNumber,
    taxpayerName:   c.taxpayerName,
    gstin:          c.gstin,
    circle:         c.circle,
    financialYear:  c.financialYear,
    cgst:           toRupees(c.cgstAmount),
    sgst:           toRupees(c.sgstAmount),
    cess:           toRupees(c.cessAmount),
    total:          toRupees(caseTotal(c)),
    actionStage:    c.actionStage  || null,
    status:         c.status,
    isFlagged:      c.isFlagged,
    lastRemarks:    c.lastRemarks  || '',
    assignedTo:     c.assignedTo   || null,
    assignedToName: assignedUser   ? assignedUser.name  : null,
    assignedAt:     c.assignedAt   || null,
    createdBy:      c.createdBy    || null,
    createdByName:  createdByUser  ? createdByUser.name : null,
    createdAt:      c.createdAt,
    updatedAt:      c.updatedAt,
  };
};

module.exports = { todayStr, nowStr, toPaise, toRupees, caseNumber, safeUser, caseTotal, formatCase };
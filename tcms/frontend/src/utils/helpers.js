/** Format number as Indian Rupee string */
export const fmt = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 });

/** Format large numbers in Lakhs / Crores */
export const fmtL = (n) => {
  const v = Number(n || 0);
  if (v >= 10_000_000) return '₹' + (v / 10_000_000).toFixed(2) + ' Cr';
  if (v >= 100_000)    return '₹' + (v / 100_000).toFixed(2)    + ' L';
  return fmt(v);
};

/** Today as readable string */
export const todayReadable = () =>
  new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

/** Format ISO date string */
export const fmtDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
};

/** Initials from name */
export const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

/** Clamp a number between min and max */
export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/** Action type → human readable */
export const actionLabel = (type) => ({
  created:        'Case Created',
  assigned:       'Assigned',
  stage_updated:  'Stage Updated',
  flagged:        'Flagged',
  unflagged:      'Flag Removed',
  remarks_added:  'Remarks Added',
  status_changed: 'Status Changed',
  closed:         'Case Closed',
}[type] || type);

/** Action type → icon */
export const actionIcon = (type) => ({
  created:        '🆕',
  assigned:       '🔗',
  stage_updated:  '⬆',
  flagged:        '🚩',
  unflagged:      '✅',
  remarks_added:  '💬',
  status_changed: '🔄',
  closed:         '🏁',
}[type] || '•');
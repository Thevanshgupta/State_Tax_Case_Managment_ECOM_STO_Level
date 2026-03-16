export function StatusBadge({ status }) {
  const map = { Pending: 'badge-pending', 'In Process': 'badge-inprocess', Completed: 'badge-completed' };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
}

export function RoleBadge({ role }) {
  const map = { admin: 'badge-admin', edcom: 'badge-edcom', sto: 'badge-sto' };
  return <span className={`badge ${map[role] || ''}`}>{role?.toUpperCase()}</span>;
}

export function StageBadge({ code }) {
  if (!code) return <span className="text-muted text-small">—</span>;
  return <span className="badge badge-stage">{code}</span>;
}

export function ActiveBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}
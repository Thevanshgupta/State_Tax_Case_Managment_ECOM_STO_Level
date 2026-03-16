export default function KPICard({ label, value, color = '#1a4f9e', sub, icon }) {
  return (
    <div className="kpi-card" style={{ borderTopColor: color }}>
      {icon && <div className="kpi-bg-icon">{icon}</div>}
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}
export default function Header({ title, sub, busy }) {
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  return (
    <div className="header-bar">
      <div className="flex-gap-12">
        {busy && <span className="spinner" />}
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
      <div className="flex-gap-12">
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>📅 {dateStr}</div>
        <div className="divider" />
        <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', letterSpacing: '.03em' }}>
          DEPT. OF TAXES, GOVT. OF INDIA
        </div>
      </div>
    </div>
  );
}
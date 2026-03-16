export default function Spinner({ large, text }) {
  return (
    <div className="flex-center" style={{ gap: 10, padding: large ? 40 : 10 }}>
      <span className={large ? 'spinner spinner-lg' : 'spinner'} />
      {text && <span style={{ color: '#64748b', fontSize: 13 }}>{text}</span>}
    </div>
  );
}

export function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="page-loader">
      <div style={{ textAlign: 'center' }}>
        <span className="spinner spinner-lg" />
        <div style={{ marginTop: 12, color: '#334155', fontWeight: 600, fontSize: 14 }}>{text}</div>
      </div>
    </div>
  );
}
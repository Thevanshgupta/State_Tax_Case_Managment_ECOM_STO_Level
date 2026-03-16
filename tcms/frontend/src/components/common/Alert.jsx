const ICONS = { info: 'ℹ️', warning: '⚠️', success: '✅', error: '❌' };

export default function Alert({ type = 'info', children, action }) {
  return (
    <div className={`alert alert-${type}`}>
      <span>{ICONS[type]}</span>
      <span style={{ flex: 1 }}>{children}</span>
      {action}
    </div>
  );
}
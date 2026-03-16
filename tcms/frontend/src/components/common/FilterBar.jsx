import { CIRCLES, STATUS_LIST } from '../../constants/index.js';

export default function FilterBar({
  search, setSearch,
  filterCircle, setFilterCircle,
  filterStatus, setFilterStatus,
  filterFlagged, setFilterFlagged,
  showCircle = true,
  extra,
  count,
}) {
  const hasFilter = search || filterCircle || filterStatus || filterFlagged;

  return (
    <div className="card filter-bar">
      <input
        className="inp" style={{ width: 270 }}
        placeholder="🔍 Search Case ID, Taxpayer, GSTIN..."
        value={search} onChange={(e) => setSearch(e.target.value)}
      />
      {showCircle && (
        <select className="inp" style={{ width: 190 }}
          value={filterCircle} onChange={(e) => setFilterCircle(e.target.value)}>
          <option value="">All Circles</option>
          {CIRCLES.map(c => <option key={c}>{c}</option>)}
        </select>
      )}
      <select className="inp" style={{ width: 150 }}
        value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="">All Statuses</option>
        {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
      </select>
      <label className="checkbox-label">
        <input type="checkbox" checked={filterFlagged}
          onChange={(e) => setFilterFlagged(e.target.checked)} />
        🚩 Flagged only
      </label>
      {extra}
      {hasFilter && (
        <button className="btn btn-secondary btn-xs" onClick={() => {
          setSearch(''); setFilterCircle(''); setFilterStatus(''); setFilterFlagged(false);
        }}>✕ Clear</button>
      )}
      {count !== undefined && (
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
          {count} case{count !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
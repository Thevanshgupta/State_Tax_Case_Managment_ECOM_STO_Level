import KPICard from '../../components/common/KPICard.jsx';

export default function EdcomOverview({ stats, cases }) {
  if (!stats) return <div>Loading stats...</div>;

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  // Calculate EDCOM-specific metrics
  const totalAssigned = cases?.length || 0;
  const pendingAssignment = cases?.filter(c => !c.assignedTo).length || 0;
  const assignedCases = totalAssigned - pendingAssignment;
  const flaggedCases = cases?.filter(c => c.isFlagged).length || 0;

  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">EDCOM Dashboard</div>
          <div className="page-sub">Case assignment and monitoring overview</div>
        </div>
      </div>

      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Case Management Summary</h3>
        <div className="g4">
          <KPICard label="Total Cases" value={stats.totalCases} color="#1a4f9e" icon="📊" />
          <KPICard label="Assigned Cases" value={assignedCases} color="#10b981" icon="✅" />
          <KPICard label="Pending Assignment" value={pendingAssignment} color="#f59e0b" icon="⏳" />
          <KPICard label="Flagged Cases" value={flaggedCases} color="#ef4444" icon="🚩" />
        </div>
      </div>

      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Recent Cases</h3>
        <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
              Latest Case Registrations
            </span>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {cases?.slice(0, 10).map(caseItem => (
              <div key={caseItem.id} style={{
                padding: '12px 20px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>
                    {caseItem.caseNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {caseItem.taxpayerName}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#059669', marginBottom: '2px' }}>
                    {formatCurrency(caseItem.total)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {caseItem.createdAt}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {caseItem.isFlagged && <span style={{ color: '#ef4444', fontSize: '14px' }}>🚩</span>}
                  {!caseItem.assignedTo && <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 600 }}>Unassigned</span>}
                  {caseItem.assignedTo && <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>Assigned</span>}
                </div>
              </div>
            ))}
          </div>
          {(!cases || cases.length === 0) && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>No cases found</div>
              <div style={{ fontSize: '14px' }}>No cases have been registered yet.</div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Case Distribution by Circle</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {stats.byCircle?.map(circle => (
            <div key={circle.circle} style={{ background: '#fff', padding: '16px', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>{circle.circle}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total:</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>{circle.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Assigned:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>{circle.total - (circle.pending || 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Pending:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b' }}>{circle.pending || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
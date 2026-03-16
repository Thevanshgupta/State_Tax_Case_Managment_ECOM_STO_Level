import KPICard from '../../components/common/KPICard.jsx';

export default function StoOverview({ stats, cases, user }) {
  // Filter cases assigned to current STO
  const myCases = cases?.filter(c => c.assignedTo === user.id) || [];

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  // Calculate personal metrics
  const totalCases = myCases.length;
  const completedCases = myCases.filter(c => c.status === 'Completed').length;
  const inProcessCases = myCases.filter(c => c.status === 'In Process').length;
  const pendingCases = myCases.filter(c => c.status === 'Pending').length;
  const flaggedCases = myCases.filter(c => c.isFlagged).length;

  const totalDemand = myCases.reduce((sum, c) => sum + c.total, 0);
  const completionRate = totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0;

  // Recent activity (mock - in real app would come from audit log)
  const recentActivity = myCases.slice(0, 3);

  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">My Dashboard</div>
          <div className="page-sub">Welcome back, {user?.name} • {user?.circle}</div>
        </div>
      </div>

      {/* Personal KPIs */}
      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>My Performance</h3>
        <div className="g4">
          <KPICard label="My Cases" value={totalCases} color="#1a4f9e" icon="📋" />
          <KPICard label="Completed" value={completedCases} color="#10b981" icon="✅" />
          <KPICard label="In Process" value={inProcessCases} color="#3b82f6" icon="⚙️" />
          <KPICard label="Completion Rate" value={`${completionRate}%`} color="#059669" icon="📈" />
        </div>
      </div>

      {/* Financial Summary */}
      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Demand Under Management</h3>
        <div className="g3">
          <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>
              {formatCurrency(totalDemand)}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Demand</div>
          </div>
          <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>
              {pendingCases}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Pending Cases</div>
          </div>
          <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>
              {flaggedCases}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Flagged Cases</div>
          </div>
        </div>
      </div>

      {/* Recent Cases */}
      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Recent Cases</h3>
        <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
              Latest Activity
            </span>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {recentActivity.map(caseItem => (
              <div key={caseItem.id} style={{
                padding: '12px 20px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: caseItem.isFlagged ? '#fef2f2' : 'transparent'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>
                    {caseItem.caseNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                    {caseItem.taxpayerName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {caseItem.actionStage} • {caseItem.status}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#059669', marginBottom: '2px' }}>
                    {formatCurrency(caseItem.total)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {caseItem.updatedAt}
                  </div>
                  {caseItem.isFlagged && (
                    <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>
                      🚩 Flagged
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {recentActivity.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>No cases yet</div>
              <div style={{ fontSize: '14px' }}>Cases will appear here once assigned to you.</div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Quick Actions</h3>
        <div className="g2">
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '7px',
            padding: '20px',
            color: '#fff',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>View My Cases</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Access all cases assigned to you</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '7px',
            padding: '20px',
            color: '#fff',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>🚩</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Flagged Cases</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Cases requiring immediate attention</div>
          </div>
        </div>
      </div>
    </div>
  );
}
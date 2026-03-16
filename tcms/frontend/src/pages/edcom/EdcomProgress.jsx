import { StatusBadge } from '../../components/common/Badge.jsx';
import KPICard from '../../components/common/KPICard.jsx';

export default function EdcomProgress({ cases }) {
  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  // Calculate progress metrics
  const totalCases = cases?.length || 0;
  const completedCases = cases?.filter(c => c.status === 'Completed').length || 0;
  const inProcessCases = cases?.filter(c => c.status === 'In Process').length || 0;
  const pendingCases = cases?.filter(c => c.status === 'Pending').length || 0;

  const completionRate = totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0;

  // Group cases by stage
  const stageStats = {};
  cases?.forEach(caseItem => {
    const stage = caseItem.actionStage || 'Not Set';
    if (!stageStats[stage]) {
      stageStats[stage] = { count: 0, amount: 0 };
    }
    stageStats[stage].count++;
    stageStats[stage].amount += caseItem.total;
  });

  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">Case Progress</div>
          <div className="page-sub">Real-time case tracking and progress monitoring</div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Progress Overview</h3>
        <div className="g4">
          <KPICard label="Total Cases" value={totalCases} color="#1a4f9e" icon="📊" />
          <KPICard label="Completed" value={completedCases} color="#10b981" icon="✅" />
          <KPICard label="In Process" value={inProcessCases} color="#3b82f6" icon="⚙️" />
          <KPICard label="Completion Rate" value={`${completionRate}%`} color="#059669" icon="📈" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-22">
        <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px' }}>Overall Progress</h3>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span>Case Completion Progress</span>
              <span>{completedCases} of {totalCases} cases</span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: '#e5e7eb',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${completionRate}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cases by Status */}
      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Cases by Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Pending Cases</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {cases?.filter(c => c.status === 'Pending').map(caseItem => (
                <div key={caseItem.id} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{caseItem.caseNumber}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{caseItem.taxpayerName}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{formatCurrency(caseItem.total)}</div>
                </div>
              ))}
              {cases?.filter(c => c.status === 'Pending').length === 0 && (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No pending cases</div>
              )}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>In Process Cases</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {cases?.filter(c => c.status === 'In Process').map(caseItem => (
                <div key={caseItem.id} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{caseItem.caseNumber}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{caseItem.taxpayerName}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{caseItem.actionStage} • {formatCurrency(caseItem.total)}</div>
                </div>
              ))}
              {cases?.filter(c => c.status === 'In Process').length === 0 && (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No cases in process</div>
              )}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Completed Cases</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {cases?.filter(c => c.status === 'Completed').slice(0, 5).map(caseItem => (
                <div key={caseItem.id} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{caseItem.caseNumber}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{caseItem.taxpayerName}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{formatCurrency(caseItem.total)}</div>
                </div>
              ))}
              {cases?.filter(c => c.status === 'Completed').length > 5 && (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '8px', fontSize: '12px' }}>
                  ... and {cases.filter(c => c.status === 'Completed').length - 5} more
                </div>
              )}
              {cases?.filter(c => c.status === 'Completed').length === 0 && (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No completed cases</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cases by Stage */}
      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Cases by Action Stage</h3>
        <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Stage</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Cases</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Total Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stageStats).map(([stage, data]) => (
                <tr key={stage} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                    {stage}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>
                    {data.count}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#059669' }}>
                    {formatCurrency(data.amount)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{
                      width: '60px',
                      height: '8px',
                      background: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      margin: '0 auto'
                    }}>
                      <div style={{
                        width: `${stage === 'DRC07' ? 100 : stage === 'DRC01' ? 20 : 50}%`,
                        height: '100%',
                        background: '#3b82f6'
                      }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
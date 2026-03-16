import KPICard from '../../components/common/KPICard.jsx';

export default function AdminOverview({ stats, cases }) {
  if (!stats) return <div>Loading stats...</div>;

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">Admin Overview</div>
          <div className="page-sub">System-wide statistics and performance metrics</div>
        </div>
      </div>

      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Case Statistics</h3>
        <div className="g4">
          <KPICard label="Total Cases" value={stats.totalCases} color="#1a4f9e" icon="📊" />
          <KPICard label="Pending" value={stats.pending} color="#f59e0b" icon="⏳" />
          <KPICard label="In Process" value={stats.inProcess} color="#3b82f6" icon="⚙️" />
          <KPICard label="Completed" value={stats.completed} color="#10b981" icon="✅" />
        </div>
      </div>

      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Financial Summary</h3>
        <div className="g4">
          <KPICard label="Total CGST" value={formatCurrency(stats.totalCgst)} color="#dc2626" />
          <KPICard label="Total SGST" value={formatCurrency(stats.totalSgst)} color="#ea580c" />
          <KPICard label="Total Cess" value={formatCurrency(stats.totalCess)} color="#ca8a04" />
          <KPICard label="Total Amount" value={formatCurrency(stats.totalAmount)} color="#059669" />
        </div>
      </div>

      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Cases by Circle</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
          {stats.byCircle.map(circle => (
            <div key={circle.circle} style={{ background: '#fff', padding: '16px', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>{circle.circle}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total:</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>{circle.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Pending:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b' }}>{circle.pending}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>In Process:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6' }}>{circle.inProcess}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Completed:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>{circle.completed}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Amount:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>{formatCurrency(circle.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-22">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>STO Performance</h3>
        <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>STO Officer</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Circle</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Assigned</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Pending</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>In Process</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Completed</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Flagged</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Total Demand</th>
              </tr>
            </thead>
            <tbody>
              {stats.stoPerformance.map(sto => (
                <tr key={sto.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>{sto.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>{sto.circle}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>{sto.assigned}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>{sto.pending}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#3b82f6' }}>{sto.inProcess}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#10b981' }}>{sto.completed}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>{sto.flagged}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#059669' }}>{formatCurrency(sto.totalDemand)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { StatusBadge } from '../../components/common/Badge.jsx';

export default function StoCases({ cases, stages, data, currentUser }) {
  // Filter cases assigned to current STO
  const myCases = cases?.filter(c => c.assignedTo === currentUser.id) || [];

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  const getStageDescription = (code) => {
    const stage = stages?.find(s => s.code === code);
    return stage ? stage.description : code;
  };

  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">My Cases</div>
          <div className="page-sub">Cases assigned to you for processing</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
              My Cases ({myCases.length})
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Case Number</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Taxpayer</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>GSTIN</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Stage</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Flagged</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Last Remarks</th>
              </tr>
            </thead>
            <tbody>
              {myCases.map(caseItem => (
                <tr key={caseItem.id} style={{
                  borderBottom: '1px solid #f1f5f9',
                  background: caseItem.isFlagged ? '#fef2f2' : 'transparent'
                }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {caseItem.caseNumber}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {caseItem.taxpayerName}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {caseItem.gstin}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <StatusBadge status={caseItem.status} />
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>
                    <div>{caseItem.actionStage}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                      {getStageDescription(caseItem.actionStage)}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#059669', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {formatCurrency(caseItem.total)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {caseItem.isFlagged && <span style={{ color: '#ef4444', fontSize: '16px' }}>🚩</span>}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#374151', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {caseItem.lastRemarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {myCases.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>No cases assigned</div>
            <div style={{ fontSize: '14px' }}>You don't have any cases assigned to you yet.</div>
          </div>
        )}
      </div>

      {/* Case Statistics */}
      {myCases.length > 0 && (
        <div style={{ marginTop: '22px' }}>
          <div className="g4">
            <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a4f9e', marginBottom: '4px' }}>
                {myCases.length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Cases</div>
            </div>
            <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>
                {myCases.filter(c => c.status === 'Completed').length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Completed</div>
            </div>
            <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#3b82f6', marginBottom: '4px' }}>
                {myCases.filter(c => c.status === 'In Process').length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>In Process</div>
            </div>
            <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>
                {myCases.filter(c => c.isFlagged).length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Flagged</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
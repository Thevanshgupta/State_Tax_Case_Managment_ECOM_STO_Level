import { StatusBadge } from '../../components/common/Badge.jsx';

export default function FlaggedCases({ cases, stages, data, currentUser }) {
  // Filter flagged cases based on user role
  const flaggedCases = currentUser.role === 'sto'
    ? cases?.filter(c => c.assignedTo === currentUser.id && c.isFlagged) || []
    : cases?.filter(c => c.isFlagged) || [];

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  const getStageDescription = (code) => {
    const stage = stages?.find(s => s.code === code);
    return stage ? stage.description : code;
  };

  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">Flagged Cases</div>
          <div className="page-sub">Cases flagged for attention and priority handling</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
              Flagged Cases ({flaggedCases.length})
            </span>
            {flaggedCases.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#ef4444' }}>🚩 High Priority</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Case Number</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Taxpayer</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>GSTIN</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Circle</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Stage</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Assigned To</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Last Remarks</th>
              </tr>
            </thead>
            <tbody>
              {flaggedCases.map(caseItem => (
                <tr key={caseItem.id} style={{ borderBottom: '1px solid #f1f5f9', background: '#fef2f2' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {caseItem.caseNumber}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {caseItem.taxpayerName}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {caseItem.gstin}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>
                    {caseItem.circle}
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
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#dc2626', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {formatCurrency(caseItem.total)}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>
                    {caseItem.assignedToName || 'Unassigned'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#374151', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {caseItem.lastRemarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {flaggedCases.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>No flagged cases</div>
            <div style={{ fontSize: '14px' }}>
              {currentUser.role === 'sto'
                ? 'You have no flagged cases assigned to you.'
                : 'There are no cases currently flagged for attention.'
              }
            </div>
          </div>
        )}
      </div>

      {/* Flag Statistics */}
      {flaggedCases.length > 0 && (
        <div style={{ marginTop: '22px', background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px' }}>
            Flag Statistics
          </h3>
          <div className="g3">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>
                {flaggedCases.length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Flagged</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>
                {flaggedCases.filter(c => c.status === 'Pending').length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Pending</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6', marginBottom: '4px' }}>
                {flaggedCases.filter(c => c.status === 'In Process').length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>In Process</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
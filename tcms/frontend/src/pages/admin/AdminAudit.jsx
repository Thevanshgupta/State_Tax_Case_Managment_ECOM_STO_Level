import { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData.js';

export default function AdminAudit() {
  const { getFullHistory } = useData();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getFullHistory();
      setHistory(data);
    };
    loadHistory();
  }, [getFullHistory]);

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'created': return '📝';
      case 'assigned': return '👤';
      case 'stage_updated': return '📋';
      case 'status_changed': return '🔄';
      case 'flagged': return '🚩';
      case 'unflagged': return '✅';
      default: return '📋';
    }
  };

  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">Audit Log</div>
          <div className="page-sub">Complete system-wide audit trail of all case activities</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
              Total Entries: {history?.length || 0}
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>User</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Action</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Case</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Details</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {history?.map(entry => (
                <tr key={entry.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {entry.createdAt}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                    {entry.userName}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#374151' }}>
                    <span style={{ marginRight: '8px' }}>{getActionIcon(entry.actionType)}</span>
                    {entry.actionType.replace('_', ' ')}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {entry.caseNumber}
                    {entry.taxpayerName && (
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                        {entry.taxpayerName}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>
                    {entry.newValue || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#374151' }}>
                    {entry.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!history || history.length === 0) && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📜</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>No audit entries found</div>
            <div style={{ fontSize: '14px' }}>The audit log is empty.</div>
          </div>
        )}
      </div>
    </div>
  );
}
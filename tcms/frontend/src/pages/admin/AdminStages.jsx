import { ActiveBadge } from '../../components/common/Badge.jsx';

export default function AdminStages({ stages }) {
  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">Action Stage Config</div>
          <div className="page-sub">Configure ASMT / DRC stages and their display order</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
              Total Stages: {stages?.length || 0}
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Order</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Code</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Description</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Terminal</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stages?.sort((a, b) => a.displayOrder - b.displayOrder).map(stage => (
                <tr key={stage.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#6b7280', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {stage.displayOrder}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {stage.code}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>
                    {stage.description}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {stage.isTerminal ? (
                      <span style={{ color: '#ef4444', fontSize: '16px' }}>🏁</span>
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <ActiveBadge status={stage.isActive ? 'active' : 'inactive'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!stages || stages.length === 0) && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>No stages found</div>
            <div style={{ fontSize: '14px' }}>There are no action stages configured yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}
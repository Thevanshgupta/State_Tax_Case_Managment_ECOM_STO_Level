import { useState } from 'react';
import { useToast } from '../../context/TostContext.jsx';
import { StatusBadge } from '../../components/common/Badge.jsx';
import CaseDetailModal from '../../components/cases/CaseDetailModel.jsx';
import CSVUploadModal from '../../components/CSVUploadModal.jsx';

export default function AdminCases({ cases, stages, data, currentUser }) {
  const toast = useToast();
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">All Cases</div>
          <div className="page-sub">Complete registry of all tax cases in the system</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
              Total Cases: {cases?.length || 0}
            </span>
            <button
              onClick={() => setShowCSVModal(true)}
              style={{
                background: '#8b5cf6',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              📤 Upload CSV
            </button>
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
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Total Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Assigned To</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Flagged</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases?.map(caseItem => (
                <tr key={caseItem.id} style={{ borderBottom: '1px solid #f1f5f9', background: caseItem.isFlagged ? '#fef2f2' : 'transparent' }}>
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
                    {caseItem.actionStage || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#059669', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {formatCurrency(caseItem.total)}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>
                    {caseItem.assignedToName || 'Unassigned'}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {caseItem.isFlagged && <span style={{ color: '#ef4444', fontSize: '16px' }}>🚩</span>}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        setSelectedCaseId(caseItem.id);
                        setShowDetailModal(true);
                      }}
                      style={{
                        background: '#8b5cf6',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff',
                        padding: '6px 14px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!cases || cases.length === 0) && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>No cases found</div>
            <div style={{ fontSize: '14px' }}>There are no cases in the system yet.</div>
          </div>
        )}
      </div>

      {showCSVModal && (
        <CSVUploadModal
          onClose={() => setShowCSVModal(false)}
          onSuccess={async (caseData) => {
            try {
              for (const c of caseData) {
                await data.create(c);
              }
              toast(`Successfully imported ${caseData.length} cases!`, 'success');
            } catch (error) {
              toast('Failed to import some cases: ' + error.message, 'error');
            }
          }}
          stages={stages}
          currentUser={currentUser}
        />
      )}

      {showDetailModal && selectedCaseId && (
        <CaseDetailModal
          caseId={selectedCaseId}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCaseId(null);
          }}
          data={data}
          stages={stages}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
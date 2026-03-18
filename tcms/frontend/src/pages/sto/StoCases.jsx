import { useState } from 'react';
import { useToast } from '../../context/TostContext.jsx';
import { StatusBadge } from '../../components/common/Badge.jsx';
import CaseDetailModal from '../../components/cases/CaseDetailModel.jsx';

export default function StoCases({ cases, stages, data, currentUser }) {
  const toast = useToast();
  const { flagCase, unflagCase, updateCase } = data;

  // Filter cases assigned to current STO
  const myCases = cases?.filter(c => c.assignedTo === currentUser.id) || [];

  const [activeFlagging, setActiveFlagging] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagRemarks, setFlagRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editingStageFor, setEditingStageFor] = useState(null);
  const [stageSelection, setStageSelection] = useState('');
  const [stageSubmitting, setStageSubmitting] = useState(false);

  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCases.map(caseItem => (
                <>
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
                    {editingStageFor === caseItem.id ? (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select
                          value={stageSelection}
                          onChange={(e) => setStageSelection(e.target.value)}
                          style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                        >
                          <option value="">Select stage</option>
                          {stages.map(stage => (
                            <option key={stage.id} value={stage.code}>{stage.code}</option>
                          ))}
                        </select>
                        <button
                          onClick={async () => {
                            if (!stageSelection) {
                              toast('Select a stage before saving.', 'error');
                              return;
                            }
                            setStageSubmitting(true);
                            try {
                              await updateCase(caseItem.id, { actionStage: stageSelection });
                              toast('Stage updated successfully.', 'success');
                              setEditingStageFor(null);
                            } catch (e) {
                              toast('Unable to update stage. Try again.', 'error');
                            } finally {
                              setStageSubmitting(false);
                            }
                          }}
                          disabled={stageSubmitting}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid #d1d5db',
                            background: stageSubmitting ? '#f3f4f6' : '#3b82f6',
                            color: stageSubmitting ? '#6b7280' : '#fff',
                            cursor: stageSubmitting ? 'not-allowed' : 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {stageSubmitting ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingStageFor(null)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid #d1d5db',
                            background: '#f3f4f6',
                            color: '#374151',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>{caseItem.actionStage}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                          {getStageDescription(caseItem.actionStage)}
                        </div>
                      </>
                    )}
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
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                      {caseItem.isFlagged ? (
                        <button
                          onClick={async () => {
                            setSubmitting(true);
                            try {
                              await unflagCase(caseItem.id);
                              toast('Removed flag from case.', 'success');
                              setActiveFlagging(null);
                            } catch (error) {
                              toast('Failed to remove flag. Please try again.', 'error');
                            } finally {
                              setSubmitting(false);
                            }
                          }}
                          disabled={submitting}
                          style={{
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff',
                            padding: '6px 10px',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Remove Flag
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveFlagging(caseItem.id);
                            setFlagReason('');
                            setFlagRemarks('');
                          }}
                          style={{
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Flag
                        </button>
                      )}

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
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        View Progress
                      </button>

                      <button
                        onClick={() => {
                          setEditingStageFor(caseItem.id);
                          setStageSelection(caseItem.actionStage || '');
                        }}
                        style={{
                          background: '#2563eb',
                          border: 'none',
                          borderRadius: '4px',
                          color: '#fff',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Change Stage
                      </button>
                    </div>
                  </td>
                </tr>
                {activeFlagging === caseItem.id && (
                  <tr>
                    <td colSpan={9} style={{ padding: '12px 16px', background: '#fdf2f2' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#b91c1c', marginBottom: '8px' }}>
                            Flag Case {caseItem.caseNumber}
                          </div>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 240px' }}>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                Reason
                              </label>
                              <input
                                value={flagReason}
                                onChange={(e) => setFlagReason(e.target.value)}
                                placeholder="e.g., mismatch in data, missing docs"
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '4px',
                                  fontSize: '13px'
                                }}
                              />
                            </div>
                            <div style={{ flex: '1 1 240px' }}>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                Remarks
                              </label>
                              <input
                                value={flagRemarks}
                                onChange={(e) => setFlagRemarks(e.target.value)}
                                placeholder="Optional notes for EDCOM review"
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '4px',
                                  fontSize: '13px'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            onClick={async () => {
                              if (!flagReason.trim()) {
                                toast('Please enter a reason for flagging.', 'error');
                                return;
                              }
                              setSubmitting(true);
                              try {
                                await flagCase(caseItem.id, flagReason.trim(), flagRemarks.trim());
                                toast('Case flagged. EDCOM will see it in the flagged list.', 'success');
                                setActiveFlagging(null);
                              } catch (error) {
                                toast('Could not flag case, please try again.', 'error');
                              } finally {
                                setSubmitting(false);
                              }
                            }}
                            disabled={submitting}
                            style={{
                              background: submitting ? '#9ca3af' : '#ef4444',
                              border: 'none',
                              borderRadius: '4px',
                              color: '#fff',
                              padding: '8px 14px',
                              cursor: submitting ? 'not-allowed' : 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            {submitting ? 'Flagging…' : 'Submit Flag'}
                          </button>
                          <button
                            onClick={() => setActiveFlagging(null)}
                            style={{
                              background: '#f3f4f6',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              color: '#374151',
                              padding: '8px 14px',
                              cursor: 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </>
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
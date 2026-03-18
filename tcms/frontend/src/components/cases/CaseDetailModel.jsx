import { useEffect, useState } from 'react';
import { useToast } from '../../context/TostContext.jsx';
import { fmt, actionLabel, actionIcon } from '../../utils/helpers.js';
import { FLAG_REASONS } from '../../constants/index.js';

/* ── All possible stages in order ─────────────── */
const STAGE_FLOW = [
  { code: 'Assigned',   label: 'Case Assigned',        color: '#64748b' },
  { code: 'ASMT10',     label: 'Assessment Notice',    color: '#7c3aed' },
  { code: 'ASMT12',     label: 'Assessment Order',     color: '#6d28d9' },
  { code: 'DRC01',      label: 'Show Cause Notice',    color: '#1d4ed8' },
  { code: 'DRC02',      label: 'Summary of SCN',       color: '#0369a1' },
  { code: 'DRC03',      label: 'Payment by Taxpayer',  color: '#0891b2' },
  { code: 'DRC04',      label: 'Acknowledgement',      color: '#0f766e' },
  { code: 'DRC05',      label: 'Summary of Statement', color: '#15803d' },
  { code: 'DRC06',      label: 'Reply of Taxpayer',    color: '#65a30d' },
  { code: 'DRC07',      label: 'Summary of Order',     color: '#16a34a' },
  { code: 'Completed',  label: 'Case Completed',       color: '#166534' },
];

/* ── Status badge ──────────────────────────────── */
function StatusPill({ status }) {
  const map = {
    'Pending':    { bg:'#fef9c3', color:'#713f12', border:'#fde68a' },
    'In Process': { bg:'#dbeafe', color:'#1e3a5f', border:'#bfdbfe' },
    'Completed':  { bg:'#dcfce7', color:'#14532d', border:'#bbf7d0' },
  };
  const s = map[status] || { bg:'#f1f5f9', color:'#334155', border:'#e2e8f0' };
  return (
    <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:800, letterSpacing:'.02em' }}>
      {status}
    </span>
  );
}

/* ── Info cell ─────────────────────────────────── */
function InfoCell({ label, children }) {
  return (
    <div style={{ background:'#f8fafc', padding:'10px 14px', borderRadius:5, border:'1px solid #e2e8f0' }}>
      <div style={{ fontSize:10, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:600, color:'#1a202c' }}>{children}</div>
    </div>
  );
}

/* ── Visual Stage Progress Bar ─────────────────── */
function StageProgressBar({ currentStage, status }) {
  /* Determine which step is currently active */
  const activeIdx = status === 'Completed'
    ? STAGE_FLOW.length - 1
    : STAGE_FLOW.findIndex(s => s.code === currentStage);

  const effectiveIdx = activeIdx < 0 ? 0 : activeIdx; /* 0 = Assigned */

  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:12, fontWeight:800, color:'#0f172a', marginBottom:10, textTransform:'uppercase', letterSpacing:'.05em' }}>
        📊 Case Progress Flow
      </div>

      {/* Step bubbles */}
      <div style={{ display:'flex', alignItems:'flex-start', overflowX:'auto', paddingBottom:8, gap:0 }}>
        {STAGE_FLOW.map((step, i) => {
          const isDone    = i < effectiveIdx;
          const isCurrent = i === effectiveIdx;
          const isPending = i > effectiveIdx;

          const bubbleBg  = isDone ? '#16a34a' : isCurrent ? step.color : '#e2e8f0';
          const textColor = (isDone || isCurrent) ? '#fff' : '#94a3b8';
          const labelColor = isDone ? '#16a34a' : isCurrent ? step.color : '#94a3b8';

          return (
            <div key={step.code} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
              {/* Connector line before bubble (not before first) */}
              {i > 0 && (
                <div style={{
                  width: 22, height: 2,
                  background: isDone ? '#16a34a' : '#e2e8f0',
                  flexShrink: 0,
                }} />
              )}

              {/* Step bubble + label */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:60 }}>
                <div style={{
                  width: 32, height: 32, borderRadius:'50%',
                  background: bubbleBg,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: 12, fontWeight:800, color: textColor,
                  border: isCurrent ? `2px solid ${step.color}` : '2px solid transparent',
                  boxShadow: isCurrent ? `0 0 0 3px ${step.color}30` : 'none',
                  flexShrink:0,
                }}>
                  {isDone ? '✓' : i + 1}
                </div>
                <div style={{
                  fontSize: 9, fontWeight: isCurrent ? 800 : 600,
                  color: labelColor, marginTop: 4, textAlign:'center',
                  lineHeight: 1.3, maxWidth: 56,
                  whiteSpace: 'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                }}>
                  {step.code === 'Assigned' || step.code === 'Completed' ? step.label : step.code}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current stage description */}
      {currentStage && status !== 'Completed' && (
        <div style={{ marginTop:10, background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:5, padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:18 }}>🔵</span>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:'#1e3a5f' }}>CURRENT STAGE</div>
            <div style={{ fontSize:13, fontWeight:700, color:'#1a4f9e' }}>
              {currentStage} — {STAGE_FLOW.find(s => s.code === currentStage)?.label || ''}
            </div>
          </div>
        </div>
      )}
      {status === 'Completed' && (
        <div style={{ marginTop:10, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:5, padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:18 }}>✅</span>
          <div style={{ fontSize:13, fontWeight:700, color:'#14532d' }}>This case has been completed and closed.</div>
        </div>
      )}
      {status === 'Pending' && !currentStage && (
        <div style={{ marginTop:10, background:'#fffbeb', border:'1px solid #fde68a', borderRadius:5, padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:18 }}>⏳</span>
          <div style={{ fontSize:13, fontWeight:700, color:'#78350f' }}>Pending — No action stage set yet. STO officer must begin processing.</div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN MODAL COMPONENT
════════════════════════════════════════════════ */
export default function CaseDetailModal({ caseId, onClose, data, stages, currentUser }) {
  const toast = useToast();

  const [detail,       setDetail]       = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [editStage,    setEditStage]    = useState('');
  const [editRemarks,  setEditRemarks]  = useState('');
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagReason,   setFlagReason]   = useState('');
  const [flagRemarks,  setFlagRemarks]  = useState('');
  const [submitting,   setSubmitting]   = useState(false);

  /* Load case on open */
  useEffect(() => {
    setLoading(true);
    data.getCase(caseId)
      .then((res) => {
        setDetail(res);
        setEditStage(res.case.actionStage || '');
        setEditRemarks(res.case.lastRemarks || '');
      })
      .catch((e) => { toast(e.message, 'error'); onClose(); })
      .finally(() => setLoading(false));
  }, [caseId]);

  /* Close on Escape */
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  /* ── Submit stage / remarks update (STO) ── */
  const handleSubmit = async () => {
    if (!editStage) { toast('Please select an Action Stage before submitting.', 'warning'); return; }
    setSubmitting(true);
    try {
      await data.updateCase(caseId, { actionStage: editStage, lastRemarks: editRemarks });
      toast('Case updated successfully.', 'success');
      onClose();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSubmitting(false); }
  };

  /* ── Flag ── */
  const handleFlag = async () => {
    if (!flagReason) { toast('Please select a flag reason.', 'warning'); return; }
    setSubmitting(true);
    try {
      await data.flagCase(caseId, flagReason, flagRemarks);
      toast('Case flagged.', 'warning');
      onClose();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSubmitting(false); }
  };

  /* ── Unflag ── */
  const handleUnflag = async () => {
    setSubmitting(true);
    try {
      await data.unflagCase(caseId);
      toast('Flag removed.', 'success');
      onClose();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSubmitting(false); }
  };

  /* ─── Render ─── */
  const canEdit = currentUser.role === 'sto' &&
    detail?.case.assignedTo === currentUser.id &&
    detail?.case.status !== 'Completed';

  return (
    /* Overlay */
    <div
      style={{ position:'fixed', inset:0, background:'rgba(10,20,40,.65)', zIndex:1000, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'24px 16px', overflowY:'auto', backdropFilter:'blur(2px)' }}
      onClick={onClose}
    >
      <div
        style={{ background:'#fff', borderRadius:10, width:'100%', maxWidth:940, boxShadow:'0 12px 40px rgba(0,0,0,.22)', animation:'modalIn .2s ease', alignSelf:'flex-start' }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes modalIn { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }`}</style>

        {/* ── Header ── */}
        <div style={{ padding:'18px 24px', background:'#1a3a6e', borderRadius:'10px 10px 0 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em' }}>Case Record</div>
            <div style={{ fontSize:18, fontWeight:800, color:'#fff', fontFamily:'IBM Plex Mono,monospace', marginTop:2 }}>
              {loading ? '...' : detail?.case.caseNumber}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border:'none', background:'rgba(255,255,255,.15)', color:'#fff', borderRadius:5, padding:'6px 14px', fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer' }}
          >
            ✕ Close
          </button>
        </div>

        {/* ── Body ── */}
        {loading ? (
          <div style={{ padding:50, textAlign:'center' }}>
            <div style={{ width:32, height:32, border:'3px solid #bfdbfe', borderTopColor:'#1a4f9e', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ marginTop:14, color:'#64748b', fontSize:13 }}>Loading case details...</div>
          </div>
        ) : !detail ? (
          <div style={{ padding:24 }}>
            <div style={{ background:'#fef2f2', color:'#7f1d1d', border:'1px solid #fecaca', padding:'10px 14px', borderRadius:6 }}>Case not found.</div>
          </div>
        ) : (
          <div style={{ padding:24 }}>
            {(() => {
              const c = detail.case;
              const history    = detail.history    || [];
              const flagHistory = detail.flagHistory || [];

              return (
                <>
                  {/* ── Section 1: Visual Progress Bar ── */}
                  <StageProgressBar currentStage={c.actionStage} status={c.status} />

                  {/* ── Section 2: Case Info Grid ── */}
                  <div style={{ marginBottom:18 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:'#0f172a', marginBottom:10, display:'flex', alignItems:'center', gap:7 }}>
                      📄 Case Information
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:10 }}>
                      <InfoCell label="Taxpayer Name">{c.taxpayerName}</InfoCell>
                      <InfoCell label="GSTIN"><span style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:12 }}>{c.gstin}</span></InfoCell>
                      <InfoCell label="Circle">{c.circle}</InfoCell>
                      <InfoCell label="Financial Year">{c.financialYear}</InfoCell>
                      <InfoCell label="Assigned Officer">{c.assignedToName || '—'}</InfoCell>
                      <InfoCell label="Case Status"><StatusPill status={c.status} /></InfoCell>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
                      <InfoCell label="CGST Amount"><span style={{ fontFamily:'IBM Plex Mono,monospace' }}>{fmt(c.cgst)}</span></InfoCell>
                      <InfoCell label="SGST Amount"><span style={{ fontFamily:'IBM Plex Mono,monospace' }}>{fmt(c.sgst)}</span></InfoCell>
                      <InfoCell label="CESS Amount"><span style={{ fontFamily:'IBM Plex Mono,monospace' }}>{fmt(c.cess)}</span></InfoCell>
                      <div style={{ background:'#eff6ff', padding:'10px 14px', borderRadius:5, border:'1px solid #bfdbfe' }}>
                        <div style={{ fontSize:10, fontWeight:800, color:'#1e3a5f', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:3 }}>Total Demand</div>
                        <div style={{ fontSize:16, fontWeight:800, color:'#1a3a6e', fontFamily:'IBM Plex Mono,monospace' }}>{fmt(c.total)}</div>
                      </div>
                    </div>
                  </div>

                  {/* ── Section 3: Current Remarks ── */}
                  {c.lastRemarks && (
                    <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'10px 14px', marginBottom:16 }}>
                      <div style={{ fontSize:10, fontWeight:800, color:'#64748b', textTransform:'uppercase', marginBottom:4 }}>Current Remarks</div>
                      <div style={{ fontSize:13, color:'#334155' }}>{c.lastRemarks}</div>
                    </div>
                  )}

                  {/* ── Section 4: Flag Alert ── */}
                  {c.isFlagged && (
                    <div style={{ background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:6, padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                      <span style={{ fontWeight:700, color:'#7c2d12', fontSize:13 }}>
                        🚩 This case is <strong>FLAGGED</strong> — {flagHistory[flagHistory.length - 1]?.reason}
                      </span>
                      {(canEdit || ['admin','edcom'].includes(currentUser.role)) && (
                        <button
                          onClick={handleUnflag}
                          disabled={submitting}
                          style={{ border:'1px solid #e2e8f0', background:'#fff', color:'#334155', borderRadius:4, padding:'4px 10px', fontSize:11, fontWeight:600, cursor:'pointer' }}
                        >
                          Remove Flag
                        </button>
                      )}
                    </div>
                  )}

                  {/* ── Section 5: STO Update Panel ── */}
                  {canEdit && (
                    <div style={{ background:'#f0f7ff', border:'1px solid #bfdbfe', borderRadius:7, padding:16, marginBottom:18 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'#1e3a5f', marginBottom:12, paddingBottom:8, borderBottom:'1px solid #bfdbfe' }}>
                        ✏️ Update This Case
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                        <div>
                          <label style={{ fontSize:11, fontWeight:700, color:'#475569', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'.04em' }}>Action Stage *</label>
                          <select
                            value={editStage}
                            onChange={(e) => setEditStage(e.target.value)}
                            style={{ width:'100%', border:'1.5px solid #cbd5e1', borderRadius:5, padding:'7px 10px', fontSize:13, fontFamily:'inherit', outline:'none' }}
                          >
                            <option value="">— Select Stage —</option>
                            {stages.map((s) => (
                              <option key={s.id} value={s.code}>{s.code} — {s.description}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize:11, fontWeight:700, color:'#475569', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'.04em' }}>Remarks</label>
                          <input
                            value={editRemarks}
                            onChange={(e) => setEditRemarks(e.target.value)}
                            placeholder="Enter remarks..."
                            style={{ width:'100%', border:'1.5px solid #cbd5e1', borderRadius:5, padding:'7px 10px', fontSize:13, fontFamily:'inherit', outline:'none' }}
                          />
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <button
                          onClick={handleSubmit}
                          disabled={submitting}
                          style={{ border:'none', background:'#1a4f9e', color:'#fff', borderRadius:5, padding:'7px 16px', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}
                        >
                          {submitting ? '...' : '✔ Submit Update'}
                        </button>
                        {!c.isFlagged && (
                          <button
                            onClick={() => setShowFlagForm(f => !f)}
                            style={{ border:'1px solid #fcd34d', background:'#fef3c7', color:'#92400e', borderRadius:5, padding:'7px 14px', fontSize:13, fontWeight:600, cursor:'pointer' }}
                          >
                            🚩 Flag Case
                          </button>
                        )}
                      </div>

                      {/* Flag sub-form */}
                      {showFlagForm && (
                        <div style={{ marginTop:12, padding:12, background:'#fffbeb', border:'1px solid #fde68a', borderRadius:5 }}>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                            <div>
                              <label style={{ fontSize:11, fontWeight:700, color:'#78350f', display:'block', marginBottom:4, textTransform:'uppercase' }}>Flag Reason *</label>
                              <select
                                value={flagReason}
                                onChange={(e) => setFlagReason(e.target.value)}
                                style={{ width:'100%', border:'1.5px solid #fde68a', borderRadius:5, padding:'6px 10px', fontSize:13, fontFamily:'inherit', outline:'none' }}
                              >
                                <option value="">— Select —</option>
                                {FLAG_REASONS.map((r) => <option key={r}>{r}</option>)}
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize:11, fontWeight:700, color:'#78350f', display:'block', marginBottom:4, textTransform:'uppercase' }}>Flag Remarks</label>
                              <input
                                value={flagRemarks}
                                onChange={(e) => setFlagRemarks(e.target.value)}
                                placeholder="Reason for flagging..."
                                style={{ width:'100%', border:'1.5px solid #fde68a', borderRadius:5, padding:'6px 10px', fontSize:13, fontFamily:'inherit', outline:'none' }}
                              />
                            </div>
                          </div>
                          <button
                            onClick={handleFlag}
                            disabled={submitting}
                            style={{ border:'none', background:'#991b1b', color:'#fff', borderRadius:5, padding:'6px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}
                          >
                            Confirm Flag
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Section 6: Flag History ── */}
                  {flagHistory.length > 0 && (
                    <div style={{ marginBottom:18 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'#0f172a', marginBottom:10 }}>🚩 Flag History</div>
                      <div style={{ overflowX:'auto', borderRadius:7, border:'1px solid #e2e8f0' }}>
                        <table style={{ borderCollapse:'collapse', width:'100%' }}>
                          <thead>
                            <tr>
                              {['Date','Officer','Reason','Remarks','Active'].map(h => (
                                <th key={h} style={{ background:'#e8edf6', padding:'9px 14px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.04em', color:'#475569', textAlign:'left', borderBottom:'2px solid #cbd5e1' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {flagHistory.map((f, i) => (
                              <tr key={i}>
                                <td style={{ padding:'9px 14px', fontSize:12, color:'#64748b' }}>{f.flaggedAt}</td>
                                <td style={{ padding:'9px 14px', fontWeight:600, fontSize:13 }}>{f.flaggedByName}</td>
                                <td style={{ padding:'9px 14px' }}>
                                  <span style={{ background:'#ffedd5', color:'#7c2d12', border:'1px solid #fed7aa', borderRadius:20, padding:'2px 9px', fontSize:11, fontWeight:700 }}>{f.reason}</span>
                                </td>
                                <td style={{ padding:'9px 14px', fontSize:12, color:'#475569' }}>{f.remarks || '—'}</td>
                                <td style={{ padding:'9px 14px' }}>
                                  {f.isActive
                                    ? <span style={{ background:'#ffedd5', color:'#7c2d12', border:'1px solid #fed7aa', borderRadius:20, padding:'2px 8px', fontSize:10, fontWeight:700 }}>Active</span>
                                    : <span style={{ background:'#dcfce7', color:'#14532d', border:'1px solid #bbf7d0', borderRadius:20, padding:'2px 8px', fontSize:10, fontWeight:700 }}>Removed</span>
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ── Section 7: Case Timeline ── */}
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:'#0f172a', marginBottom:12 }}>📋 Case History / Activity Timeline</div>
                    {history.length === 0 ? (
                      <div style={{ textAlign:'center', padding:'28px 20px', color:'#94a3b8', fontSize:13 }}>
                        <div style={{ fontSize:28, marginBottom:8, opacity:.4 }}>📭</div>
                        No history available for this case.
                      </div>
                    ) : (
                      <div style={{ paddingLeft:24, borderLeft:'2px solid #e2e8f0', marginLeft:8 }}>
                        {history.map((h, i) => (
                          <div key={i} style={{ position:'relative', paddingBottom:18, paddingLeft:20 }}>
                            {/* Dot */}
                            <div style={{ position:'absolute', left:-5, top:6, width:8, height:8, background:'#1a4f9e', borderRadius:'50%', border:'2px solid #fff', boxShadow:'0 0 0 2px #1a4f9e' }} />

                            {/* Date */}
                            <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginBottom:2 }}>{h.createdAt}</div>

                            {/* Action + Stage pill */}
                            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                              <span style={{ fontSize:14 }}>{actionIcon(h.actionType)}</span>
                              <span style={{ fontSize:13, fontWeight:700, color:'#1a4f9e' }}>{actionLabel(h.actionType)}</span>
                              {h.newValue && (
                                <span style={{ fontFamily:'IBM Plex Mono,monospace', fontWeight:700, fontSize:11, color:'#1e3a5f', background:'#dbeafe', padding:'1px 7px', borderRadius:4, border:'1px solid #bfdbfe' }}>
                                  {h.newValue}
                                </span>
                              )}
                            </div>

                            {/* Officer */}
                            <div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>by {h.userName}</div>

                            {/* Remarks */}
                            {h.remarks && (
                              <div style={{ fontSize:12, color:'#475569', marginTop:3, fontStyle:'italic' }}>{h.remarks}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ padding:'12px 24px', borderTop:'1px solid #e2e8f0', background:'#f8fafc', borderRadius:'0 0 10px 10px', display:'flex', justifyContent:'flex-end' }}>
          <button
            onClick={onClose}
            style={{ border:'1px solid #e2e8f0', background:'#fff', color:'#334155', borderRadius:5, padding:'7px 20px', fontSize:13, fontWeight:600, cursor:'pointer' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
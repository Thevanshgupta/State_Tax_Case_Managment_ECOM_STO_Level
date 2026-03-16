import { useState } from 'react';
import { useData } from '../../hooks/useData.js';
import { useToast } from '../../context/TostContext.jsx';
import { StatusBadge } from '../../components/common/Badge.jsx';

export default function EdcomAssign({ cases, users, data }) {
  const { assignCase } = useData();
  const toast = useToast();

  const [selectedCases, setSelectedCases] = useState(new Set());
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter unassigned cases
  const unassignedCases = cases?.filter(c => !c.assignedTo) || [];

  // Filter STO users
  const stoOfficers = users?.filter(u => u.role === 'sto' && u.status === 'active') || [];

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  const handleCaseSelect = (caseId) => {
    const newSelected = new Set(selectedCases);
    if (newSelected.has(caseId)) {
      newSelected.delete(caseId);
    } else {
      newSelected.add(caseId);
    }
    setSelectedCases(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCases.size === unassignedCases.length) {
      setSelectedCases(new Set());
    } else {
      setSelectedCases(new Set(unassignedCases.map(c => c.id)));
    }
  };

  const handleAssign = async () => {
    if (selectedCases.size === 0) {
      toast('Please select at least one case to assign', 'error');
      return;
    }
    if (!selectedOfficer) {
      toast('Please select an STO officer', 'error');
      return;
    }

    setLoading(true);
    try {
      const promises = Array.from(selectedCases).map(caseId =>
        assignCase(caseId, selectedOfficer)
      );

      await Promise.all(promises);
      toast(`Successfully assigned ${selectedCases.size} case(s)!`, 'success');

      // Reset selections
      setSelectedCases(new Set());
      setSelectedOfficer('');
    } catch (error) {
      toast('Failed to assign cases. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">Assign Cases</div>
          <div className="page-sub">Assign unassigned cases to STO officers</div>
        </div>
      </div>

      <div className="g2-3" style={{ marginBottom: '22px' }}>
        {/* Cases List */}
        <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                Unassigned Cases ({unassignedCases.length})
              </span>
              {unassignedCases.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  style={{
                    padding: '4px 12px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {selectedCases.size === unassignedCases.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {unassignedCases.map(caseItem => (
              <div key={caseItem.id} style={{
                padding: '12px 20px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: selectedCases.has(caseItem.id) ? '#fefce8' : 'transparent'
              }}>
                <input
                  type="checkbox"
                  checked={selectedCases.has(caseItem.id)}
                  onChange={() => handleCaseSelect(caseItem.id)}
                  style={{ margin: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>
                    {caseItem.caseNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                    {caseItem.taxpayerName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {caseItem.circle} • {formatCurrency(caseItem.total)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusBadge status={caseItem.status} />
                  {caseItem.isFlagged && <span style={{ color: '#ef4444', fontSize: '14px' }}>🚩</span>}
                </div>
              </div>
            ))}
          </div>

          {unassignedCases.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>All cases assigned</div>
              <div style={{ fontSize: '14px' }}>There are no unassigned cases at the moment.</div>
            </div>
          )}
        </div>

        {/* Assignment Panel */}
        <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px' }}>
            Assign to STO Officer
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
              Select STO Officer
            </label>
            <select
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">Choose an officer...</option>
              {stoOfficers.map(officer => (
                <option key={officer.id} value={officer.id}>
                  {officer.name} - {officer.circle}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '4px' }}>
            <div style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
              <strong>Selected Cases:</strong> {selectedCases.size}
            </div>
            {selectedOfficer && (
              <div style={{ fontSize: '14px', color: '#374151' }}>
                <strong>Assigning to:</strong> {stoOfficers.find(o => o.id.toString() === selectedOfficer)?.name}
              </div>
            )}
          </div>

          <button
            onClick={handleAssign}
            disabled={loading || selectedCases.size === 0 || !selectedOfficer}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: (loading || selectedCases.size === 0 || !selectedOfficer) ? '#9ca3af' : '#059669',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: (loading || selectedCases.size === 0 || !selectedOfficer) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Assigning...
              </>
            ) : (
              `Assign ${selectedCases.size} Case${selectedCases.size !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
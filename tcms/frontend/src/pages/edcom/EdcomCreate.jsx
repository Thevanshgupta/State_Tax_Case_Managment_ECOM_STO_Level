import { useState } from 'react';
import { CIRCLES } from '../../constants/index.js';
import { useData } from '../../hooks/useData.js';
import { useToast } from '../../context/TostContext.jsx';

export default function EdcomCreate({ data, users }) {
  const { createCase } = useData();
  const toast = useToast();

  const [formData, setFormData] = useState({
    taxpayerName: '',
    gstin: '',
    circle: '',
    financialYear: '2024-25',
    cgst: '',
    sgst: '',
    cess: '',
    actionStage: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateGSTIN = (gstin) => {
    // Basic GSTIN validation (15 characters, alphanumeric)
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);
  };

  const calculateTotal = () => {
    const cgst = parseFloat(formData.cgst) || 0;
    const sgst = parseFloat(formData.sgst) || 0;
    const cess = parseFloat(formData.cess) || 0;
    return cgst + sgst + cess;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.taxpayerName.trim()) newErrors.taxpayerName = 'Taxpayer name is required';
    if (!formData.gstin.trim()) newErrors.gstin = 'GSTIN is required';
    else if (!validateGSTIN(formData.gstin)) newErrors.gstin = 'Invalid GSTIN format';
    if (!formData.circle) newErrors.circle = 'Circle selection is required';
    if (!formData.cgst || parseFloat(formData.cgst) <= 0) newErrors.cgst = 'Valid CGST amount is required';
    if (!formData.sgst || parseFloat(formData.sgst) <= 0) newErrors.sgst = 'Valid SGST amount is required';
    if (!formData.actionStage) newErrors.actionStage = 'Action stage is required';
    if (!formData.remarks.trim()) newErrors.remarks = 'Remarks are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast('Please correct the errors in the form', 'error');
      return;
    }

    setLoading(true);
    try {
      const caseData = {
        taxpayerName: formData.taxpayerName.trim(),
        gstin: formData.gstin.trim(),
        circle: formData.circle,
        financialYear: formData.financialYear,
        cgst: parseFloat(formData.cgst),
        sgst: parseFloat(formData.sgst),
        cess: parseFloat(formData.cess) || 0,
        actionStage: formData.actionStage,
        remarks: formData.remarks.trim()
      };

      await createCase(caseData);
      toast('Case created successfully!', 'success');

      // Reset form
      setFormData({
        taxpayerName: '',
        gstin: '',
        circle: '',
        financialYear: '2024-25',
        cgst: '',
        sgst: '',
        cess: '',
        actionStage: '',
        remarks: ''
      });
    } catch (error) {
      toast('Failed to create case. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotal();

  return (
    <div>
      <div className="page-hdr">
        <div>
          <div className="page-title">Create New Case</div>
          <div className="page-sub">Register a new tax case for scrutiny</div>
        </div>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ background: '#fff', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: '24px' }}>

            {/* Taxpayer Information */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                Taxpayer Information
              </h3>
              <div className="g2" style={{ marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Taxpayer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.taxpayerName}
                    onChange={(e) => handleInputChange('taxpayerName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${errors.taxpayerName ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter taxpayer name"
                  />
                  {errors.taxpayerName && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.taxpayerName}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    GSTIN *
                  </label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${errors.gstin ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontFamily: 'monospace'
                    }}
                    placeholder="22AAAAA0000A1Z5"
                    maxLength="15"
                  />
                  {errors.gstin && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.gstin}</span>}
                </div>
              </div>
              <div className="g2">
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Circle *
                  </label>
                  <select
                    value={formData.circle}
                    onChange={(e) => handleInputChange('circle', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${errors.circle ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Circle</option>
                    {CIRCLES.map(circle => (
                      <option key={circle} value={circle}>{circle}</option>
                    ))}
                  </select>
                  {errors.circle && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.circle}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Financial Year
                  </label>
                  <select
                    value={formData.financialYear}
                    onChange={(e) => handleInputChange('financialYear', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="2024-25">2024-25</option>
                    <option value="2023-24">2023-24</option>
                    <option value="2022-23">2022-23</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Demand Amount */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                Demand Amount (₹)
              </h3>
              <div className="g3" style={{ marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    CGST *
                  </label>
                  <input
                    type="number"
                    value={formData.cgst}
                    onChange={(e) => handleInputChange('cgst', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${errors.cgst ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.cgst && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.cgst}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    SGST *
                  </label>
                  <input
                    type="number"
                    value={formData.sgst}
                    onChange={(e) => handleInputChange('sgst', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${errors.sgst ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.sgst && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.sgst}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Cess
                  </label>
                  <input
                    type="number"
                    value={formData.cess}
                    onChange={(e) => handleInputChange('cess', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  Total Demand Amount: <span style={{ color: '#059669' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Case Details */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                Case Details
              </h3>
              <div className="g2" style={{ marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Action Stage *
                  </label>
                  <select
                    value={formData.actionStage}
                    onChange={(e) => handleInputChange('actionStage', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${errors.actionStage ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Action Stage</option>
                    {data?.stages?.filter(s => s.isActive).map(stage => (
                      <option key={stage.id} value={stage.code}>
                        {stage.code} - {stage.description}
                      </option>
                    ))}
                  </select>
                  {errors.actionStage && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.actionStage}</span>}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Remarks *
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${errors.remarks ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Enter case remarks or description"
                />
                {errors.remarks && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.remarks}</span>}
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', textAlign: 'right' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 24px',
                  background: loading ? '#9ca3af' : '#059669',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
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
                    Creating...
                  </>
                ) : (
                  'Create Case'
                )}
              </button>
            </div>
          </div>
        </form>
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
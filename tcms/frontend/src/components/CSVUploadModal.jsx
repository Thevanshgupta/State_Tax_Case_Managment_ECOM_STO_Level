import { useState } from 'react';
import { useToast } from '../context/TostContext.jsx';

export default function CSVUploadModal({ onClose, onSuccess, stages, users }) {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast('Please select a CSV file', 'error');
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (csvFile) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          toast('CSV must have headers and at least one row', 'error');
          return;
        }

        const headers = lines[0]
          .split(',')
          .map(h => h.trim().toLowerCase());

        const requiredFields = [
          'casenumber', 'taxpayername', 'gstin', 'circle', 
          'financialyear', 'cgst', 'sgst', 'cess', 'total'
        ];

        const missingFields = requiredFields.filter(
          field => !headers.includes(field)
        );

        if (missingFields.length > 0) {
          toast(
            `Missing required fields: ${missingFields.join(', ')}`,
            'error'
          );
          return;
        }

        const rows = [];
        for (let i = 1; i < Math.min(lines.length, 6); i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, idx) => {
            row[header] = values[idx] || '';
          });
          rows.push(row);
        }

        setPreview(rows);
        toast(`Loaded ${rows.length} rows. Verify the data below.`, 'success');
      } catch (error) {
        toast('Error parsing CSV: ' + error.message, 'error');
      }
    };
    reader.readAsText(csvFile);
  };

  const handleUpload = async () => {
    if (!preview || preview.length === 0) {
      toast('No data to upload', 'error');
      return;
    }

    setUploading(true);
    try {
      const caseData = preview.map(row => ({
        caseNumber: row.casenumber,
        taxpayerName: row.taxpayername,
        gstin: row.gstin,
        circle: row.circle,
        financialYear: row.financialyear,
        cgst: parseFloat(row.cgst) || 0,
        sgst: parseFloat(row.sgst) || 0,
        cess: parseFloat(row.cess) || 0,
        total: parseFloat(row.total) || 0,
        actionStage: row.actionstage || null,
        status: row.status || 'Pending',
        isFlagged: row.isflagged?.toLowerCase() === 'true',
        lastRemarks: row.lastremarks || '',
        assignedTo: parseInt(row.assignedto) || null,
      }));

      // Call success callback with the data
      await onSuccess(caseData);
      toast(`${caseData.length} cases uploaded successfully!`, 'success');
      onClose();
    } catch (error) {
      toast('Upload failed: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'caseNumber',
      'taxpayerName',
      'gstin',
      'circle',
      'financialYear',
      'cgst',
      'sgst',
      'cess',
      'total',
      'actionStage',
      'status',
      'isFlagged',
      'lastRemarks',
      'assignedTo',
    ];

    const sampleRow = [
      'CASE/2024-25/0011',
      'Sample Company Pvt Ltd',
      '07AABCD1234E1Z0',
      'Circle-I (North)',
      '2024-25',
      '50000',
      '50000',
      '5000',
      '105000',
      'ASMT10',
      'Pending',
      'false',
      'Initial assessment started',
      '3',
    ];

    const csv = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cases_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,20,40,.65)',
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backdropFilter: 'blur(2px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          width: '100%',
          maxWidth: 600,
          boxShadow: '0 12px 40px rgba(0,0,0,.22)',
          animation: 'modalIn .2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes modalIn { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }`}</style>

        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            background: '#1a3a6e',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: 'rgba(255,255,255,.5)',
                textTransform: 'uppercase',
                letterSpacing: '.08em',
              }}
            >
              Upload Cases
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#fff',
                marginTop: 2,
              }}
            >
              📤 Bulk Import via CSV
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'rgba(255,255,255,.15)',
              color: '#fff',
              borderRadius: 5,
              padding: '6px 14px',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {!preview ? (
            <>
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: 8,
                  padding: 32,
                  textAlign: 'center',
                  background: '#f8fafc',
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1a202c',
                    marginBottom: 4,
                  }}
                >
                  Select a CSV file to upload
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
                  Upload multiple cases at once
                </div>

                <label
                  style={{
                    display: 'inline-block',
                    background: '#1a4f9e',
                    color: '#fff',
                    padding: '8px 20px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>

                {file && (
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 13,
                      color: '#059669',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {file.name}
                  </div>
                )}
              </div>

              <button
                onClick={downloadTemplate}
                style={{
                  display: 'block',
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  color: '#1a4f9e',
                  padding: 10,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                📥 Download CSV Template
              </button>

              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 6,
                  padding: 12,
                  marginTop: 16,
                  fontSize: 12,
                  color: '#1e3a5f',
                  lineHeight: 1.6,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 8 }}>
                  📋 Required CSV Columns:
                </div>
                <div>
                  caseNumber, taxpayerName, gstin, circle, financialYear, cgst,
                  sgst, cess, total
                </div>
                <div style={{ marginTop: 8, fontWeight: 700 }}>Optional:</div>
                <div>actionStage, status, isFlagged, lastRemarks, assignedTo</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: 10,
                  }}
                >
                  📋 Preview ({preview.length} rows)
                </div>
                <div
                  style={{
                    overflowX: 'auto',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th
                          style={{
                            padding: '8px 12px',
                            textAlign: 'left',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#374151',
                            borderBottom: '1px solid #e2e8f0',
                          }}
                        >
                          Case #
                        </th>
                        <th
                          style={{
                            padding: '8px 12px',
                            textAlign: 'left',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#374151',
                            borderBottom: '1px solid #e2e8f0',
                          }}
                        >
                          Taxpayer
                        </th>
                        <th
                          style={{
                            padding: '8px 12px',
                            textAlign: 'left',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#374151',
                            borderBottom: '1px solid #e2e8f0',
                          }}
                        >
                          GSTIN
                        </th>
                        <th
                          style={{
                            padding: '8px 12px',
                            textAlign: 'right',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#374151',
                            borderBottom: '1px solid #e2e8f0',
                          }}
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, idx) => (
                        <tr key={idx}>
                          <td
                            style={{
                              padding: '8px 12px',
                              fontSize: 12,
                              color: '#374151',
                              fontWeight: 600,
                              borderBottom: '1px solid #f1f5f9',
                            }}
                          >
                            {row.casenumber}
                          </td>
                          <td
                            style={{
                              padding: '8px 12px',
                              fontSize: 12,
                              color: '#64748b',
                              borderBottom: '1px solid #f1f5f9',
                              maxWidth: 150,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {row.taxpayername}
                          </td>
                          <td
                            style={{
                              padding: '8px 12px',
                              fontSize: 11,
                              color: '#64748b',
                              fontFamily: 'IBM Plex Mono, monospace',
                              borderBottom: '1px solid #f1f5f9',
                            }}
                          >
                            {row.gstin}
                          </td>
                          <td
                            style={{
                              padding: '8px 12px',
                              fontSize: 12,
                              color: '#059669',
                              fontWeight: 600,
                              textAlign: 'right',
                              borderBottom: '1px solid #f1f5f9',
                            }}
                          >
                            ₹{parseFloat(row.total).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  style={{
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#374151',
                    borderRadius: 6,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  Change File
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{
                    border: 'none',
                    background: uploading ? '#9ca3af' : '#10b981',
                    color: '#fff',
                    borderRadius: 6,
                    padding: '8px 16px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {uploading ? '⏳ Uploading...' : '✓ Confirm & Upload'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';

const PredictionTable = ({ predictions }) => (
  <div className="glass-card" style={{ marginTop: '24px', overflowX: 'auto' }}>
    <div className="section-header">
      <div className="section-dot" />
      <h3>Prediction History</h3>
      <span style={{
        marginLeft: 'auto',
        background: 'rgba(74,222,128,0.1)',
        color: '#4ade80',
        border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: '20px',
        padding: '3px 12px',
        fontSize: '0.75rem',
        fontWeight: '700',
        fontFamily: 'DM Mono, monospace',
      }}>
        {predictions.length} records
      </span>
    </div>

    {predictions.length === 0 ? (
      <div className="empty-state">
        <span style={{ fontSize: '2.5rem' }}>🌾</span>
        <p>No predictions yet. Submit the form to get started!</p>
      </div>
    ) : (
      <table className="history-table">
        <thead>
          <tr>
            <th>Crop</th>
            <th>Season</th>
            <th>State</th>
            <th>Rainfall</th>
            <th>Predicted Yield</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((p) => (
            <tr key={p.id}>
              <td><span className="crop-tag">{p.Crop}</span></td>
              <td><span className="season-tag">{p.Season}</span></td>
              <td style={{ color: 'var(--text-secondary)' }}>{p.State}</td>
              <td style={{ fontFamily: 'DM Mono, monospace', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {p.rainfall_used} mm
              </td>
              <td>
                <span className="yield-badge">{Number(p.predicted_yield).toFixed(2)} t</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default PredictionTable;
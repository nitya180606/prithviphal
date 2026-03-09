import React from 'react';

const fields = [
  { name: 'Crop',       placeholder: 'e.g. Rice, Wheat',   type: 'text',   icon: '🌱' },
  { name: 'Season',     placeholder: 'e.g. Kharif, Rabi',  type: 'text',   icon: '📅' },
  { name: 'State',      placeholder: 'e.g. Punjab',         type: 'text',   icon: '📍' },
  { name: 'Area',       placeholder: 'Area (hectares)',      type: 'number', icon: '📐' },
  { name: 'Fertilizer', placeholder: 'Fertilizer (kg/ha)',  type: 'number', icon: '🧪' },
  { name: 'Pesticide',  placeholder: 'Pesticide (kg/ha)',   type: 'number', icon: '🛡️' },
];

const PredictionForm = ({ handleChange, handlePredict }) => (
  <div className="glass-card">
    <div className="section-header">
      <div className="section-dot" />
      <h3>Get New Prediction</h3>
    </div>

    <form onSubmit={handlePredict}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {fields.map((field) => (
          <div key={field.name} style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1rem',
              pointerEvents: 'none',
              zIndex: 1,
            }}>
              {field.icon}
            </span>
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              onChange={handleChange}
              required
              style={{ paddingLeft: '38px' }}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="btn-main"
        style={{ width: '100%' }}
      >
        ⚡ Predict Yield
      </button>
    </form>
  </div>
);

export default PredictionForm;
import React from 'react';

const AnalyticsCards = ({ predictions, avg, high }) => {
  const cards = [
    {
      label: 'Total Predictions',
      value: predictions.length,
      unit: 'runs',
      icon: '📊',
      iconBg: 'rgba(103, 232, 249, 0.12)',
      iconColor: '#67e8f9',
      delay: '0s',
    },
    {
      label: 'Average Yield',
      value: avg,
      unit: 'tons',
      icon: '🌾',
      iconBg: 'rgba(74, 222, 128, 0.12)',
      iconColor: '#4ade80',
      delay: '0.08s',
    },
    {
      label: 'Highest Yield',
      value: high,
      unit: 'tons',
      icon: '🏆',
      iconBg: 'rgba(253, 224, 71, 0.1)',
      iconColor: '#fde047',
      delay: '0.16s',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div
          className="stat-card"
          key={card.label}
          style={{ animationDelay: card.delay }}
        >
          <div
            className="stat-icon"
            style={{ background: card.iconBg }}
          >
            {card.icon}
          </div>
          <div>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">
              {card.value}
              <span className="stat-unit">{card.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
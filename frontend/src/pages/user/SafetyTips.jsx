import React, { useState } from 'react';
import '../../style/user/safetytips.css';

const tips = [
  {
    icon: '⛑️',
    category: 'Helmet & Gear',
    color: '#6366f1',
    items: [
      'Always wear a helmet before riding',
      'Use reflective gear at night',
      'Wear closed-toe shoes while riding',
    ],
  },
  {
    icon: '🚦',
    category: 'Road Rules',
    color: '#8b5cf6',
    items: [
      'Follow all traffic signals and signs',
      'Always ride on the left side of the road',
      'Never ride on footpaths or pedestrian areas',
      'Use hand signals before turning',
    ],
  },
  {
    icon: '🚲',
    category: 'Cycle Check',
    color: '#06b6d4',
    items: [
      'Check brakes before starting your ride',
      'Ensure tyres are properly inflated',
      'Check that seat height is comfortable',
      'Report any defects immediately',
    ],
  },
  {
    icon: '🛡️',
    category: 'Personal Safety',
    color: '#10b981',
    items: [
      'Never use your phone while riding',
      'Avoid riding in heavy rain or storms',
      'Stay alert and aware of surroundings',
      'Do not carry more than one person',
    ],
  },
  {
    icon: '🌙',
    category: 'Night Riding',
    color: '#f59e0b',
    items: [
      'Always use front and rear lights at night',
      'Wear bright or reflective clothing',
      'Avoid poorly lit roads at night',
      'Ride slower and stay extra cautious',
    ],
  },
  {
    icon: '📱',
    category: 'Emergency',
    color: '#ef4444',
    items: [
      'Save SpinCity helpline in your contacts',
      'Always carry a charged phone',
      'Know the nearest station location',
      'Report accidents immediately via app',
    ],
  },
];

const SafetyTips = () => {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section className="safety-section">
      <div className="safety-header">
        <div className="safety-badge">🛡️ Safety First</div>
        <h2 className="safety-title">Ride Smart, Ride Safe</h2>
        <p className="safety-subtitle">
          Follow these safety guidelines to ensure a safe and enjoyable ride with SpinCity
        </p>
      </div>

      <div className="safety-grid">
        {tips.map((tip, i) => (
          <div
            key={i}
            className={`safety-card ${activeCard === i ? 'active' : ''}`}
            style={{ '--card-color': tip.color }}
            onClick={() => setActiveCard(activeCard === i ? null : i)}
          >
            <div className="safety-card-header">
              <div className="safety-icon-wrap">
                <span className="safety-icon">{tip.icon}</span>
              </div>
              <div>
                <h3 className="safety-category">{tip.category}</h3>
                <p className="safety-count">{tip.items.length} tips</p>
              </div>
              <span className="safety-arrow">{activeCard === i ? '▲' : '▼'}</span>
            </div>
            <ul className={`safety-list ${activeCard === i ? 'open' : ''}`}>
              {tip.items.map((item, j) => (
                <li key={j} className="safety-item">
                  <span className="safety-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="safety-banner">
        <span className="safety-banner-icon">🚨</span>
        <div>
          <p className="safety-banner-title">Emergency Helpline</p>
          <p className="safety-banner-sub">Available 24/7 for any ride-related emergencies</p>
        </div>
        <a href="tel:+911800123456" className="safety-banner-btn">📞 1800-123-456</a>
      </div>
    </section>
  );
};

export default SafetyTips;
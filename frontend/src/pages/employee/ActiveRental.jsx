import React, { useState, useEffect } from 'react';
import '../../style/employee/activerental.css';

const ActiveRental = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentCharges, setCurrentCharges] = useState(25.00);
  
  // Mock rental data
  const rentalData = {
    cycleName: 'Electric Power',
    cycleType: 'E-Bike',
    cycleImage: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400',
    startTime: new Date('2024-06-15T08:30:00'),
    pickupStation: 'SG Highway Hub',
    pickupAddress: 'Near Rajpath Club, SG Highway, Ahmedabad',
    returnStation: 'Any Station',
    hourlyRate: 25.00,
    qrCode: 'QR-SPIN-EB-004',
    batteryLevel: 85
  };

  const [route] = useState([
    { lat: 23.02579100, lng: 72.50736800, name: 'SG Highway Hub' },
    { lat: 23.02680400, lng: 72.51664200, name: 'Current Location' }
  ]);

  // Calculate elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - rentalData.startTime) / 1000);
      setElapsedTime(diff);
      
      // Calculate charges (hourly rate)
      const hours = diff / 3600;
      const charges = hours * rentalData.hourlyRate;
      setCurrentCharges(charges);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndRide = () => {
    if (window.confirm('Are you sure you want to end this ride?')) {
      alert('Ride ended! Proceeding to payment...');
      // Navigate to payment page
    }
  };

  const handleEmergency = () => {
    alert('Emergency alert sent! Our team will contact you shortly.');
  };

  const handleReportIssue = () => {
    alert('Issue reporting form opened.');
  };

  return (
    <div className="active-rental-page">
      {/* Top Status Bar */}
      <div className="status-bar">
        <div className="container">
          <div className="status-content">
            <div className="status-item">
              <span className="status-icon">🚴</span>
              <span className="status-text">Ride in Progress</span>
            </div>
            <div className="status-item">
              <span className="status-icon">⏱️</span>
              <span className="status-text">{formatTime(elapsedTime)}</span>
            </div>
            <div className="status-item">
              <span className="status-icon">💰</span>
              <span className="status-text">₹{currentCharges.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="active-rental-grid">
          {/* Left Column */}
          <div className="rental-left">
            {/* Cycle Info Card */}
            <div className="rental-card cycle-info-card animate-slide-up">
              <div className="card-header">
                <h3>🚲 Current Ride</h3>
                <span className="badge-active">Active</span>
              </div>
              <div className="cycle-details">
                <img 
                  src={rentalData.cycleImage} 
                  alt={rentalData.cycleName} 
                  className="cycle-image"
                />
                <div className="cycle-info">
                  <h2>{rentalData.cycleName}</h2>
                  <p className="cycle-type">{rentalData.cycleType}</p>
                  <div className="cycle-id">ID: {rentalData.qrCode}</div>
                </div>
              </div>
              
              {/* Battery Level (for E-Bikes) */}
              {rentalData.cycleType.includes('E-Bike') && (
                <div className="battery-indicator">
                  <div className="battery-header">
                    <span>🔋 Battery Level</span>
                    <span className="battery-percentage">{rentalData.batteryLevel}%</span>
                  </div>
                  <div className="battery-bar">
                    <div 
                      className="battery-fill" 
                      style={{ width: `${rentalData.batteryLevel}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Timer Card */}
            <div className="rental-card timer-card animate-slide-up delay-1">
              <div className="timer-display">
                <div className="timer-label">Ride Duration</div>
                <div className="timer-value">{formatTime(elapsedTime)}</div>
                <div className="timer-sublabel">
                  Started at {rentalData.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              <div className="charges-display">
                <div className="charges-label">Current Charges</div>
                <div className="charges-value">₹{currentCharges.toFixed(2)}</div>
                <div className="charges-sublabel">Rate: ₹{rentalData.hourlyRate}/hour</div>
              </div>
            </div>

            {/* Station Info Card */}
            <div className="rental-card station-card animate-slide-up delay-2">
              <div className="station-info">
                <div className="station-item">
                  <div className="station-icon pickup">📍</div>
                  <div className="station-details">
                    <h4>Pickup Station</h4>
                    <p className="station-name">{rentalData.pickupStation}</p>
                    <p className="station-address">{rentalData.pickupAddress}</p>
                  </div>
                </div>
                <div className="station-divider">→</div>
                <div className="station-item">
                  <div className="station-icon return">🎯</div>
                  <div className="station-details">
                    <h4>Return To</h4>
                    <p className="station-name">{rentalData.returnStation}</p>
                    <p className="station-address">Drop at any SPINCity station</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rental-card stats-card animate-slide-up delay-3">
              <h3>📊 Ride Statistics</h3>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-icon">📏</div>
                  <div className="stat-value">5.2 km</div>
                  <div className="stat-label">Distance</div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-value">18 km/h</div>
                  <div className="stat-label">Avg Speed</div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🌱</div>
                  <div className="stat-value">0.83 kg</div>
                  <div className="stat-label">CO₂ Saved</div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-value">156 cal</div>
                  <div className="stat-label">Calories</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="rental-right">
            {/* Map Card */}
            <div className="rental-card map-card animate-slide-up">
              <div className="card-header">
                <h3>🗺️ Live Tracking</h3>
                <button className="btn-refresh">🔄 Refresh</button>
              </div>
              <div className="map-container">
                <div className="map-placeholder">
                  <div className="map-marker">📍</div>
                  <p className="map-text">Your Current Location</p>
                  <p className="map-subtext">Near {route[1].name}</p>
                </div>
              </div>
              <div className="map-info">
                <div className="map-info-item">
                  <span className="info-icon">📍</span>
                  <span>Latitude: {route[1].lat.toFixed(6)}</span>
                </div>
                <div className="map-info-item">
                  <span className="info-icon">📍</span>
                  <span>Longitude: {route[1].lng.toFixed(6)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="rental-card actions-card animate-slide-up delay-1">
              <h3>⚡ Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn primary" onClick={handleEndRide}>
                  <span className="btn-icon">🏁</span>
                  <span className="btn-text">End Ride</span>
                  <span className="btn-desc">Complete and pay</span>
                </button>
                
                <button className="action-btn emergency" onClick={handleEmergency}>
                  <span className="btn-icon">🚨</span>
                  <span className="btn-text">Emergency</span>
                  <span className="btn-desc">Get immediate help</span>
                </button>
                
                <button className="action-btn secondary" onClick={handleReportIssue}>
                  <span className="btn-icon">⚠️</span>
                  <span className="btn-text">Report Issue</span>
                  <span className="btn-desc">Cycle problem</span>
                </button>
                
                <button className="action-btn secondary">
                  <span className="btn-icon">📞</span>
                  <span className="btn-text">Contact Support</span>
                  <span className="btn-desc">Get assistance</span>
                </button>
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="rental-card tips-card animate-slide-up delay-2">
              <h3>💡 Safety Tips</h3>
              <ul className="tips-list">
                <li>
                  <span className="tip-icon">✓</span>
                  <span>Always wear a helmet while riding</span>
                </li>
                <li>
                  <span className="tip-icon">✓</span>
                  <span>Follow traffic rules and signals</span>
                </li>
                <li>
                  <span className="tip-icon">✓</span>
                  <span>Park only at designated areas</span>
                </li>
                <li>
                  <span className="tip-icon">✓</span>
                  <span>Lock the cycle when not riding</span>
                </li>
                <li>
                  <span className="tip-icon">✓</span>
                  <span>Check battery level regularly (E-Bikes)</span>
                </li>
              </ul>
            </div>

            {/* Nearby Stations */}
            <div className="rental-card nearby-card animate-slide-up delay-3">
              <h3>📍 Nearby Stations</h3>
              <div className="nearby-list">
                <div className="nearby-item">
                  <div className="nearby-icon">📍</div>
                  <div className="nearby-info">
                    <h4>Satellite Station</h4>
                    <p>1.2 km away • 15 slots available</p>
                  </div>
                  <div className="nearby-distance">1.2 km</div>
                </div>
                <div className="nearby-item">
                  <div className="nearby-icon">📍</div>
                  <div className="nearby-info">
                    <h4>Vastrapur Point</h4>
                    <p>2.5 km away • 8 slots available</p>
                  </div>
                  <div className="nearby-distance">2.5 km</div>
                </div>
                <div className="nearby-item">
                  <div className="nearby-icon">📍</div>
                  <div className="nearby-info">
                    <h4>Navrangpura Center</h4>
                    <p>3.1 km away • 12 slots available</p>
                  </div>
                  <div className="nearby-distance">3.1 km</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveRental;
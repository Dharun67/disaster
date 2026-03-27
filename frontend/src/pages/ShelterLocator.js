import React, { useState, useEffect } from 'react';
import { shelterAPI } from '../services/api';
import '../theme.css';

export default function ShelterLocator() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [filterArea, setFilterArea] = useState('');

  useEffect(() => {
    loadShelters();
  }, []);

  const loadShelters = async () => {
    try {
      const res = await shelterAPI.getShelters();
      setShelters(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load shelters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getOccupancyColor = (occupancy, capacity) => {
    const percent = (occupancy / capacity) * 100;
    if (percent < 50) return '#10b981';
    if (percent < 75) return '#f59e0b';
    return '#ef4444';
  };

  const filteredShelters = filterArea
    ? shelters.filter(s => s.address?.toLowerCase().includes(filterArea.toLowerCase()))
    : shelters;

  return (
    <div className="main-container">
      <div className="page-header">
        <h1 className="page-title">Shelter Locator</h1>
        <p className="page-subtitle">Find relief centers and emergency shelters</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="section mb-4">
        <input
          type="text"
          placeholder="🔍 Filter by area or address..."
          value={filterArea}
          onChange={(e) => setFilterArea(e.target.value)}
          className="form-control"
        />
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '60px 20px' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid-3">
          {filteredShelters.map((shelter) => (
            <div
              key={shelter._id}
              className="card cursor-pointer"
              onClick={() => setSelectedShelter(shelter)}
            >
              <div className="flex-between mb-3">
                <h3 className="card-title" style={{ margin: 0 }}>{shelter.name}</h3>
                <span className="badge badge-primary">
                  {shelter.occupancy}/{shelter.capacity}
                </span>
              </div>

              <div className="progress mb-3">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(shelter.occupancy / shelter.capacity) * 100}%`,
                    background: getOccupancyColor(shelter.occupancy, shelter.capacity)
                  }}
                />
              </div>

              <p className="text-sm text-muted mb-2">📍 {shelter.address}</p>

              <div className="flex gap-2 mb-3 text-sm">
                <span className="text-muted">👥 Capacity: <span className="text-primary font-semibold">{shelter.capacity}</span></span>
                <span className="text-muted">✓ Available: <span className="text-success font-semibold">{shelter.capacity - shelter.occupancy}</span></span>
              </div>

              {shelter.amenities && shelter.amenities.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-3">
                  {shelter.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="badge badge-info text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              )}

              <button className="btn btn-primary btn-block">View Details</button>
            </div>
          ))}
        </div>
      )}

      {selectedShelter && (
        <div className="modal-overlay" onClick={() => setSelectedShelter(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedShelter(null)}
              className="btn btn-secondary"
              style={{ position: 'absolute', top: '15px', right: '15px' }}
            >
              ✕
            </button>

            <h2 className="card-title mb-4">{selectedShelter.name}</h2>

            <div className="section">
              <h3 className="section-title">Location</h3>
              <p className="text-muted mb-2">📍 {selectedShelter.address}</p>
              <p className="text-sm text-muted">
                Coordinates: {selectedShelter.location?.lat.toFixed(4)}, {selectedShelter.location?.lng.toFixed(4)}
              </p>
            </div>

            <div className="section">
              <h3 className="section-title">Capacity</h3>
              <div className="grid-3 mb-3">
                <div>
                  <div className="text-sm text-muted mb-1">Total Capacity</div>
                  <div className="text-xl font-bold text-primary">{selectedShelter.capacity}</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-1">Currently Occupied</div>
                  <div className="text-xl font-bold text-warning">{selectedShelter.occupancy}</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-1">Available Beds</div>
                  <div className="text-xl font-bold text-success">
                    {selectedShelter.capacity - selectedShelter.occupancy}
                  </div>
                </div>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(selectedShelter.occupancy / selectedShelter.capacity) * 100}%`,
                    background: getOccupancyColor(selectedShelter.occupancy, selectedShelter.capacity)
                  }}
                />
              </div>
            </div>

            {selectedShelter.amenities && selectedShelter.amenities.length > 0 && (
              <div className="section">
                <h3 className="section-title">Amenities</h3>
                <div className="grid-2">
                  {selectedShelter.amenities.map((amenity, idx) => (
                    <div key={idx} className="badge badge-info">
                      ✓ {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="section">
              <h3 className="section-title">Contact</h3>
              <p className="text-muted">📞 {selectedShelter.contact}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
          border: 1px solid rgba(14, 165, 233, 0.2);
          border-radius: 12px;
          padding: 30px;
          max-width: 700px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          position: relative;
        }

        .progress {
          width: 100%;
          height: 8px;
          background: rgba(14, 165, 233, 0.1);
          border-radius: 10px;
          overflow: hidden;
          margin: 1rem 0;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
          border-radius: 10px;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { sosAPI, commandCenterAPI, rescueAPI, shelterAPI } from '../services/api';
import '../styles.css';

export default function AdminDashboard() {
  const [sosAlerts, setSosAlerts] = useState([]);
  const [commandData, setCommandData] = useState(null);
  const [rescueTeams, setRescueTeams] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [sosRes, cmdRes, teamsRes, sheltersRes] = await Promise.all([
        sosAPI.getAlerts(),
        commandCenterAPI.getData(),
        rescueAPI.getTeams(),
        shelterAPI.getShelters()
      ]);
      setSosAlerts(sosRes.data);
      setCommandData(cmdRes.data);
      setRescueTeams(teamsRes.data);
      setShelters(sheltersRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await sosAPI.updateAlert(alertId, 'resolved');
      setSosAlerts(sosAlerts.filter(a => a._id !== alertId));
    } catch (err) {
      setError('Failed to resolve alert');
    }
  };

  const handleUpdateTeamStatus = async (teamId, newStatus) => {
    try {
      await rescueAPI.updateTeam(teamId, { status: newStatus });
      setRescueTeams(rescueTeams.map(t =>
        t._id === teamId ? { ...t, status: newStatus } : t
      ));
    } catch (err) {
      setError('Failed to update team status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'deployed': return '#f59e0b';
      case 'busy': return '#ef4444';
      default: return '#999';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Command Center</h1>
        <p style={styles.subtitle}>System monitoring and control</p>
      </div>

      {error && <div style={styles.alert}>{error}</div>}

      <div style={styles.tabs}>
        {['overview', 'alerts', 'teams', 'shelters'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              background: activeTab === tab ? '#00a8e8' : '#f0f0f0',
              color: activeTab === tab ? 'white' : '#666'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading data...</div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div style={styles.section}>
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Active SOS Alerts</div>
                  <div style={styles.statValue}>{commandData?.sos_alerts || 0}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Available Teams</div>
                  <div style={styles.statValue}>{commandData?.active_rescue_teams || 0}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Shelter Occupancy</div>
                  <div style={styles.statValue}>{commandData?.shelter_occupancy_percent || 0}%</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>High Risk Zones</div>
                  <div style={styles.statValue}>{commandData?.high_risk_zones || 0}</div>
                </div>
              </div>

              <div style={styles.heatmapSection}>
                <h2 style={styles.sectionTitle}>Risk Heatmap</h2>
                <div style={styles.heatmapGrid}>
                  {commandData?.heatmap?.map((zone, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.heatmapCell,
                        background: zone.color
                      }}
                    >
                      <div style={styles.heatmapZone}>{zone.zone}</div>
                      <div style={styles.heatmapScore}>{zone.risk_score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Active SOS Alerts</h2>
              {sosAlerts.length === 0 ? (
                <p style={styles.noData}>No active alerts</p>
              ) : (
                <div style={styles.table}>
                  {sosAlerts.map(alert => (
                    <div key={alert._id} style={styles.tableRow}>
                      <div style={styles.tableCell}>
                        <div style={styles.cellLabel}>Name</div>
                        <div style={styles.cellValue}>{alert.name}</div>
                      </div>
                      <div style={styles.tableCell}>
                        <div style={styles.cellLabel}>Phone</div>
                        <div style={styles.cellValue}>{alert.phone}</div>
                      </div>
                      <div style={styles.tableCell}>
                        <div style={styles.cellLabel}>Location</div>
                        <div style={styles.cellValue}>{alert.location}</div>
                      </div>
                      <div style={styles.tableCell}>
                        <div style={styles.cellLabel}>Time</div>
                        <div style={styles.cellValue}>
                          {new Date(alert.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleResolveAlert(alert._id)}
                        style={styles.resolveBtn}
                      >
                        Resolve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'teams' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Rescue Teams</h2>
              <div style={styles.teamsGrid}>
                {rescueTeams.map(team => (
                  <div key={team._id} style={styles.teamCard}>
                    <div style={styles.teamHeader}>
                      <h3 style={styles.teamName}>{team.name}</h3>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: getStatusColor(team.status)
                        }}
                      >
                        {team.status}
                      </span>
                    </div>
                    <div style={styles.teamDetails}>
                      <p>Members: {team.members}</p>
                      <p>Zone: {team.assignedZone}</p>
                      <p>Contact: {team.contact}</p>
                    </div>
                    <div style={styles.statusButtons}>
                      {['available', 'deployed', 'busy'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleUpdateTeamStatus(team._id, status)}
                          style={{
                            ...styles.statusBtn,
                            background: team.status === status ? getStatusColor(status) : '#f0f0f0',
                            color: team.status === status ? 'white' : '#666'
                          }}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shelters' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Shelter Status</h2>
              <div style={styles.sheltersGrid}>
                {shelters.map(shelter => (
                  <div key={shelter._id} style={styles.shelterCard}>
                    <h3 style={styles.shelterName}>{shelter.name}</h3>
                    <div style={styles.occupancyBar}>
                      <div
                        style={{
                          ...styles.occupancyFill,
                          width: `${(shelter.occupancy / shelter.capacity) * 100}%`,
                          background: (shelter.occupancy / shelter.capacity) > 0.75 ? '#ef4444' : '#10b981'
                        }}
                      />
                    </div>
                    <div style={styles.shelterStats}>
                      <span>{shelter.occupancy}/{shelter.capacity} beds</span>
                      <span>{shelter.capacity - shelter.occupancy} available</span>
                    </div>
                    <p style={styles.shelterAddress}>{shelter.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    background: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a3a52',
    margin: '0 0 5px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '0'
  },
  alert: {
    background: '#fee',
    border: '1px solid #fcc',
    color: '#c33',
    padding: '12px 15px',
    borderRadius: '6px',
    marginBottom: '20px'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666'
  },
  section: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px'
  },
  statCard: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: '10px'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a3a52'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a3a52',
    marginBottom: '15px'
  },
  heatmapSection: {
    marginTop: '30px'
  },
  heatmapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px'
  },
  heatmapCell: {
    padding: '15px',
    borderRadius: '6px',
    color: 'white',
    textAlign: 'center'
  },
  heatmapZone: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  heatmapScore: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    padding: '20px'
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '15px',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '6px',
    alignItems: 'center'
  },
  tableCell: {
    display: 'flex',
    flexDirection: 'column'
  },
  cellLabel: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '5px'
  },
  cellValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1a3a52'
  },
  resolveBtn: {
    padding: '8px 16px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  teamsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '15px'
  },
  teamCard: {
    background: '#f9f9f9',
    padding: '15px',
    borderRadius: '6px'
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  teamName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1a3a52',
    margin: '0'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  teamDetails: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '10px'
  },
  statusButtons: {
    display: 'flex',
    gap: '8px'
  },
  statusBtn: {
    flex: 1,
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  sheltersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '15px'
  },
  shelterCard: {
    background: '#f9f9f9',
    padding: '15px',
    borderRadius: '6px'
  },
  shelterName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1a3a52',
    margin: '0 0 10px 0'
  },
  occupancyBar: {
    width: '100%',
    height: '8px',
    background: '#eee',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  occupancyFill: {
    height: '100%',
    transition: 'width 0.3s'
  },
  shelterStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#666',
    marginBottom: '10px'
  },
  shelterAddress: {
    fontSize: '12px',
    color: '#999',
    margin: '0'
  }
};

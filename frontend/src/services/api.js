import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }
    
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (email, name, phone) =>
    api.post('/api/auth/register', { email, name, phone }),
  
  verifyOTP: (email, otp, name, phone, password) =>
    api.post('/api/auth/verify-otp', { email, otp, name, phone, password }),
  
  login: (email) =>
    api.post('/api/auth/login', { email }),
  
  verifyLogin: (email, otp) =>
    api.post('/api/auth/verify-login', { email, otp })
};

// Machine Learning API
export const mlAPI = {
  train: () =>
    api.post('/api/ml/train'),
  
  predict: (rainfall, waterLevel, elevation) =>
    api.post('/api/ml/predict', { rainfall, waterLevel, elevation }),
  
  getModelInfo: () =>
    api.get('/api/ml/model-info')
};

// Flood Prediction API
export const floodAPI = {
  getPredictions: () =>
    api.get('/api/flood-predictions'),
  
  getPredictionByZone: (zone) =>
    api.get(`/api/flood-predictions/${zone}`)
};

// SOS Alert API
export const sosAPI = {
  sendAlert: (data) =>
    api.post('/api/emergency-sos', data),
  
  getAlerts: () =>
    api.get('/api/sos-alerts'),
  
  updateAlert: (id, status) =>
    api.put(`/api/sos-alert/${id}`, { status }),
  
  notifyPolice: (data) =>
    api.post('/api/notify-police', data),
  
  notifyHospitals: (data) =>
    api.post('/api/notify-hospitals', data),
  
  notifyRescueTeams: (data) =>
    api.post('/api/notify-rescue-teams', data)
};

// User Report API
export const reportAPI = {
  submitReport: (data) =>
    api.post('/api/user-report', data),
  
  getReports: () =>
    api.get('/api/user-reports'),
  
  getRecentReports: (limit = 20) =>
    api.get('/api/user-reports', { params: { limit } })
};

// Shelter API
export const shelterAPI = {
  getShelters: () =>
    api.get('/api/shelters'),
  
  getNearby: (lat, lng) =>
    api.get('/api/shelters/nearby', { params: { lat, lng } }),
  
  updateShelter: (id, data) =>
    api.put(`/api/shelters/${id}`, data),
  
  updateOccupancy: (id, occupancy) =>
    api.put(`/api/shelters/${id}`, { occupancy })
};

// Rescue Team API
export const rescueAPI = {
  getTeams: () =>
    api.get('/api/rescue-teams'),
  
  updateTeam: (id, data) =>
    api.put(`/api/rescue-teams/${id}`, data),
  
  updateTeamStatus: (id, status) =>
    api.put(`/api/rescue-teams/${id}`, { status })
};

// Zone API
export const zoneAPI = {
  getZones: () =>
    api.get('/api/zones'),
  
  createZone: (data) =>
    api.post('/api/zones', data),
  
  getZoneDetails: (zoneName) =>
    api.get(`/api/zones/${zoneName}`)
};

// Emergency Services API
export const emergencyAPI = {
  getPoliceStations: () =>
    api.get('/api/police-stations'),
  
  getAmbulances: () =>
    api.get('/api/ambulance-services'),
  
  getHospitals: () =>
    api.get('/api/hospitals'),
  
  getEmergencyContacts: (zone) =>
    api.get(`/api/emergency-contacts/${zone}`),
  
  getNearbyServices: (lat, lng, type) =>
    api.get('/api/emergency-services/nearby', { params: { lat, lng, type } })
};

// Command Center API
export const commandCenterAPI = {
  getData: () =>
    api.get('/api/command-center-data')
};

// Featured Resources API
export const featuredAPI = {
  getResources: () =>
    api.get('/api/featured-resources')
};

// Marketplace API
export const marketplaceAPI = {
  getProducts: () =>
    api.get('/api/marketplace-products')
};

// Health Check API
export const healthAPI = {
  check: () =>
    api.get('/api/health')
};

// User Reports API
export const userReportsAPI = {
  getReports: () =>
    api.get('/api/user-reports'),
  
  submitReport: (data) =>
    api.post('/api/user-report', data)
};

export default api;

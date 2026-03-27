import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SimpleLandingPage from './pages/SimpleLandingPage';
import Dashboard from './pages/Dashboard';
import MLPrediction from './pages/MLPrediction';
import EmergencySOS from './pages/EmergencySOS';
import EnhancedEmergencySOS from './pages/EnhancedEmergencySOS';
import SmartRoutingMap from './pages/SmartRoutingMap';
import ShelterLocator from './pages/ShelterLocator';
import AdminDashboard from './pages/AdminDashboard';
import Featured from './pages/Featured';
import Marketplace from './pages/Marketplace';
import AdvancedFloodMap from './pages/AdvancedFloodMap';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import AIPredictionEngine from './pages/AIPredictionEngine';
import MLAnalyticsEngine from './pages/MLAnalyticsEngine';
import ProtectedRoute from './components/ProtectedRoute';
import SessionManager from './components/SessionManager';
import Navigation from './Navigation';
import './theme.css';
import './styles.css';

function App() {
  return (
    <Router>
      <SessionManager>
        <Navigation />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/enhanced-login" element={<LoginPage />} />
          <Route path="/" element={<SimpleLandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ml-prediction"
            element={
              <ProtectedRoute>
                <MLPrediction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sos"
            element={
              <ProtectedRoute>
                <EnhancedEmergencySOS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency"
            element={
              <ProtectedRoute>
                <EnhancedEmergencySOS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routing"
            element={
              <ProtectedRoute>
                <SmartRoutingMap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <SmartRoutingMap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shelters"
            element={
              <ProtectedRoute>
                <ShelterLocator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/featured"
            element={
              <ProtectedRoute>
                <Featured />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/advanced-map"
            element={
              <ProtectedRoute>
                <AdvancedFloodMap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AdvancedAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-predictions"
            element={
              <ProtectedRoute>
                <AIPredictionEngine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ml-analytics"
            element={
              <ProtectedRoute>
                <MLAnalyticsEngine />
              </ProtectedRoute>
            }
          />
        </Routes>
      </SessionManager>
    </Router>
  );
}

export default App;

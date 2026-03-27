import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">🌍</div>
        <h1 className="text-4xl font-bold mb-2">GeoGuard</h1>
        <p className="text-xl">Loading...</p>
      </div>
    </div>
  );
}
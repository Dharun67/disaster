import React, { useState } from 'react';
import { createSOSAlert } from '../services/api';

export default function SOSPanel() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSOSSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!formData.message.trim()) {
      setError('Please describe your emergency');
      return;
    }

    setLoading(true);

    try {
      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const loc = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            };
            setLocation(loc);

            // Send SOS alert
            const response = await createSOSAlert({
              name: formData.name,
              phone: formData.phone,
              message: formData.message,
              lat: loc.lat,
              lng: loc.lng,
              location: `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`
            });

            if (response.success || response.alertId) {
              setSubmitted(true);
              setFormData({ name: '', phone: '', message: '' });
              setTimeout(() => setSubmitted(false), 5000);
            }
            setLoading(false);
          },
          (err) => {
            setError('Unable to get your location. Please enable location services.');
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to send SOS alert. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4">
          <a href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Back to Dashboard
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
            {/* Icon and Title */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-pulse">🚨</div>
              <h1 className="text-3xl font-bold text-red-600 mb-2">EMERGENCY SOS</h1>
              <p className="text-gray-600">Send immediate distress signal with your location</p>
            </div>

            {/* Success Message */}
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-semibold">✓ SOS Alert Sent Successfully!</p>
                <p className="text-green-600 text-sm mt-1">Emergency services have been notified of your location</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-semibold">⚠ {error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSOSSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emergency Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your emergency situation..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  disabled={loading}
                />
              </div>

              {/* Location Display */}
              {location && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-gray-600">📍 Location Captured</p>
                  <p className="text-sm text-blue-700 font-mono mt-1">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || submitted}
                className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold text-lg rounded-lg transition-colors duration-200"
              >
                {loading ? 'Sending SOS...' : submitted ? 'Alert Sent' : 'SEND SOS ALERT'}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Important:</strong> Your location will be automatically captured and sent to emergency services. Make sure location services are enabled on your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

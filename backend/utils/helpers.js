// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate risk level from score
function getRiskLevel(score) {
  if (score < 30) return 'Low';
  if (score < 55) return 'Moderate';
  if (score < 75) return 'High';
  return 'Critical';
}

// Calculate risk score
function calculateRiskScore(rainfall, waterLevel, elevation) {
  return (rainfall * 0.4) + (waterLevel * 0.4) + ((100 - elevation) * 0.2);
}

module.exports = {
  calculateDistance,
  getRiskLevel,
  calculateRiskScore
};

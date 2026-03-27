// Emergency Services Routes - Add these to server.js
const express = require('express');

module.exports = (app, verifySession, models) => {
  const { SOSAlert, PoliceStation, AmbulanceService, Hospital, RescueTeam } = models;

  // Emergency SOS endpoint
  app.post('/api/emergency-sos', verifySession, async (req, res) => {
    try {
      const { userName, userPhone, userEmail, location, message } = req.body;
      const alert = new SOSAlert({
        name: userName,
        phone: userPhone,
        location: `${location.lat}, ${location.lng}`,
        lat: location.lat,
        lng: location.lng,
        message: message || 'Emergency SOS Alert',
        status: 'active'
      });
      await alert.save();
      res.json({ success: true, alertId: alert._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get emergency contacts by zone
  app.get('/api/emergency-contacts/:zone', async (req, res) => {
    try {
      const zone = req.params.zone;
      const contacts = {
        police: await PoliceStation.find({ area: zone }).limit(2),
        ambulance: await AmbulanceService.find({ area: zone }).limit(2),
        hospitals: await Hospital.find({ area: zone }).limit(3),
        rescue_teams: await RescueTeam.find({ assignedZone: zone }).limit(2)
      };
      res.json(contacts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Notify police
  app.post('/api/notify-police', verifySession, async (req, res) => {
    try {
      const { location } = req.body;
      const nearbyPolice = await PoliceStation.find({
        lat: { $gte: location.lat - 0.05, $lte: location.lat + 0.05 },
        lng: { $gte: location.lng - 0.05, $lte: location.lng + 0.05 }
      });
      res.json({ success: true, notified: nearbyPolice.length, stations: nearbyPolice });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Notify hospitals
  app.post('/api/notify-hospitals', verifySession, async (req, res) => {
    try {
      const { location } = req.body;
      const nearbyHospitals = await Hospital.find({
        lat: { $gte: location.lat - 0.05, $lte: location.lat + 0.05 },
        lng: { $gte: location.lng - 0.05, $lte: location.lng + 0.05 }
      });
      res.json({ success: true, notified: nearbyHospitals.length, hospitals: nearbyHospitals });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Notify rescue teams
  app.post('/api/notify-rescue-teams', verifySession, async (req, res) => {
    try {\n      const { location } = req.body;
      const nearbyTeams = await RescueTeam.find({
        'location.lat': { $gte: location.lat - 0.05, $lte: location.lat + 0.05 },
        'location.lng': { $gte: location.lng - 0.05, $lte: location.lng + 0.05 }
      });
      res.json({ success: true, notified: nearbyTeams.length, teams: nearbyTeams });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get nearby emergency services
  app.get('/api/emergency-services/nearby', async (req, res) => {
    try {
      const { lat, lng, type } = req.query;
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      
      let services = [];
      
      if (type === 'police' || !type) {
        services = await PoliceStation.find({
          lat: { $gte: latitude - 0.1, $lte: latitude + 0.1 },
          lng: { $gte: longitude - 0.1, $lte: longitude + 0.1 }
        }).limit(5);
      } else if (type === 'ambulance') {
        services = await AmbulanceService.find({
          lat: { $gte: latitude - 0.1, $lte: latitude + 0.1 },
          lng: { $gte: longitude - 0.1, $lte: longitude + 0.1 }
        }).limit(5);
      } else if (type === 'hospital') {
        services = await Hospital.find({
          lat: { $gte: latitude - 0.1, $lte: latitude + 0.1 },
          lng: { $gte: longitude - 0.1, $lte: longitude + 0.1 }
        }).limit(5);
      }
      
      res.json(services);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update SOS alert status
  app.put('/api/sos-alert/:id', verifySession, async (req, res) => {
    try {
      const { status } = req.body;
      const alert = await SOSAlert.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      res.json({ success: true, alert });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get user reports
  app.get('/api/user-reports', async (req, res) => {
    try {
      const { UserReport } = models;
      const reports = await UserReport.find().sort({ timestamp: -1 }).limit(20);
      res.json(reports);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

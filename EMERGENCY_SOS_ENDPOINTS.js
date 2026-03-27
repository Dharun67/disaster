// Add these endpoints to backend/server.js before the final PORT line

// Emergency SOS Endpoint
app.post('/api/emergency-sos', verifySession, async (req, res) => {
  try {
    const { userId, userName, userPhone, userEmail, location, timestamp, type, status } = req.body;

    const sosAlert = new SOSAlert({
      userId,
      userName,
      userPhone,
      userEmail,
      location: {
        lat: location.lat,
        lng: location.lng,
        accuracy: location.accuracy
      },
      timestamp,
      type,
      status,
      createdAt: new Date()
    });

    await sosAlert.save();

    res.json({
      success: true,
      alertId: sosAlert._id,
      message: 'Emergency SOS alert created successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notify Police Stations
app.post('/api/notify-police', verifySession, async (req, res) => {
  try {
    const { userId, userName, userPhone, userEmail, location, timestamp } = req.body;

    // Get nearby police stations
    const policeStations = await PoliceStation.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat]
          },
          $maxDistance: 5000 // 5km radius
        }
      }
    }).limit(5);

    // In production, send SMS/email to police stations
    console.log(`🚔 Police Notification: ${policeStations.length} stations notified`);
    console.log(`User: ${userName} (${userPhone})`);
    console.log(`Location: ${location.lat}, ${location.lng}`);

    res.json({
      success: true,
      notifiedStations: policeStations.length,
      stations: policeStations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notify Hospitals
app.post('/api/notify-hospitals', verifySession, async (req, res) => {
  try {
    const { userId, userName, userPhone, userEmail, location, timestamp } = req.body;

    // Get nearby hospitals
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat]
          },
          $maxDistance: 5000 // 5km radius
        }
      }
    }).limit(5);

    // In production, send SMS/email to hospitals
    console.log(`🏥 Hospital Notification: ${hospitals.length} hospitals notified`);
    console.log(`User: ${userName} (${userPhone})`);
    console.log(`Location: ${location.lat}, ${location.lng}`);

    res.json({
      success: true,
      notifiedHospitals: hospitals.length,
      hospitals: hospitals
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notify Rescue Teams
app.post('/api/notify-rescue-teams', verifySession, async (req, res) => {
  try {
    const { userId, userName, userPhone, userEmail, location, timestamp } = req.body;

    // Get nearby rescue teams
    const rescueTeams = await RescueTeam.find({
      status: 'available',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat]
          },
          $maxDistance: 10000 // 10km radius
        }
      }
    }).limit(5);

    // In production, send SMS/email to rescue teams
    console.log(`🚁 Rescue Team Notification: ${rescueTeams.length} teams notified`);
    console.log(`User: ${userName} (${userPhone})`);
    console.log(`Location: ${location.lat}, ${location.lng}`);

    res.json({
      success: true,
      notifiedTeams: rescueTeams.length,
      teams: rescueTeams
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Emergency Contacts
app.get('/api/emergency-contacts', verifySession, async (req, res) => {
  try {
    const policeStations = await PoliceStation.find().limit(5);
    const hospitals = await Hospital.find().limit(5);
    const rescueTeams = await RescueTeam.find().limit(5);

    res.json({
      policeStations,
      hospitals,
      rescueTeams
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Active SOS Alerts (for admin/command center)
app.get('/api/active-sos-alerts', verifySession, async (req, res) => {
  try {
    const alerts = await SOSAlert.find({ status: 'ACTIVE' })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update SOS Alert Status
app.put('/api/emergency-sos/:alertId', verifySession, async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status } = req.body;

    const alert = await SOSAlert.findByIdAndUpdate(
      alertId,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      alert
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

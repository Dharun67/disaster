// Disaster Response Module - API Routes

const express = require('express');
const router = express.Router();
const DisasterResponseService = require('../services/disaster-response');

const responseService = new DisasterResponseService();
responseService.initializeSampleData();

// ==================== ALERT ENDPOINTS ====================

/**
 * POST /api/disaster-response/alerts/send
 * Send real-time disaster alert
 */
router.post('/alerts/send', async (req, res) => {
  try {
    const alertData = req.body;

    if (!alertData.alertType || !alertData.severity || !alertData.location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const alert = await responseService.sendAlert(alertData);

    res.json({
      success: true,
      alert,
      message: 'Alert sent successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-response/alerts
 * Get active alerts
 */
router.get('/alerts', async (req, res) => {
  try {
    const alerts = responseService.getActiveAlerts();

    res.json({
      success: true,
      alerts,
      count: alerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-response/alerts/:id
 * Get specific alert
 */
router.get('/alerts/:id', async (req, res) => {
  try {
    const alerts = responseService.getActiveAlerts();
    const alert = alerts.find(a => a.id === req.params.id);

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      success: true,
      alert,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/disaster-response/alerts/:id/acknowledge
 * Acknowledge alert
 */
router.put('/alerts/:id/acknowledge', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const alert = responseService.acknowledgeAlert(req.params.id, userId);

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      success: true,
      alert,
      message: 'Alert acknowledged',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-response/alerts/analytics
 * Get alert analytics
 */
router.get('/alerts/analytics', async (req, res) => {
  try {
    const alerts = responseService.getActiveAlerts();

    const analytics = {
      totalAlerts: alerts.length,
      bySeverity: {
        low: alerts.filter(a => a.severity === 'low').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        high: alerts.filter(a => a.severity === 'high').length,
        critical: alerts.filter(a => a.severity === 'critical').length
      },
      deliveryRate: 98.5,
      averageDeliveryTime: 28,
      engagementRate: 82.3,
      readRate: alerts.filter(a => a.readAt).length / alerts.length * 100
    };

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== NAVIGATION ENDPOINTS ====================

/**
 * GET /api/disaster-response/shelters
 * Get all shelters
 */
router.get('/shelters', async (req, res) => {
  try {
    const shelters = Array.from(responseService.shelters.values());

    res.json({
      success: true,
      shelters,
      count: shelters.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-response/shelters/nearby
 * Find nearby shelters
 */
router.get('/shelters/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const nearbyShelters = await responseService.findNearbyShelters(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius) || 5
    );

    res.json({
      success: true,
      shelters: nearbyShelters,
      count: nearbyShelters.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/disaster-response/routes/calculate
 * Calculate safe route
 */
router.post('/routes/calculate', async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng, riskZones } = req.body;

    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({ error: 'Start and end coordinates required' });
    }

    const route = await responseService.calculateSafeRoute(
      parseFloat(startLat),
      parseFloat(startLng),
      parseFloat(endLat),
      parseFloat(endLng),
      riskZones || []
    );

    res.json({
      success: true,
      route,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-response/routes/:id
 * Get specific route
 */
router.get('/routes/:id', async (req, res) => {
  try {
    // Simulate route retrieval
    const route = {
      id: req.params.id,
      status: 'active',
      progress: 45,
      estimatedTimeRemaining: 8,
      currentLocation: { lat: 13.0827, lng: 80.2707 }
    };

    res.json({
      success: true,
      route,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== SOS ENDPOINTS ====================

/**
 * POST /api/disaster-response/sos/request
 * Create SOS request
 */
router.post('/sos/request', async (req, res) => {
  try {
    const sosData = req.body;

    if (!sosData.userId || !sosData.location) {
      return res.status(400).json({ error: 'User ID and location required' });
    }

    const sosRequest = await responseService.createSOSRequest(sosData);

    res.json({
      success: true,
      sosRequest,
      message: 'SOS request created',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-response/sos/requests
 * Get active SOS requests
 */
router.get('/sos/requests', async (req, res) => {
  try {
    const sosRequests = responseService.getActiveSOSRequests();

    res.json({
      success: true,
      sosRequests,
      count: sosRequests.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-response/sos/requests/:id
 * Get specific SOS request
 */
router.get('/sos/requests/:id', async (req, res) => {
  try {
    const sosRequests = responseService.getActiveSOSRequests();
    const sosRequest = sosRequests.find(s => s.id === req.params.id);

    if (!sosRequest) {
      return res.status(404).json({ error: 'SOS request not found' });
    }

    res.json({
      success: true,
      sosRequest,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/disaster-response/sos/requests/:id/status
 * Update SOS request status
 */
router.put('/sos/requests/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const sosRequest = responseService.updateSOSStatus(req.params.id, status);

    if (!sosRequest) {
      return res.status(404).json({ error: 'SOS request not found' });
    }

    res.json({
      success: true,
      sosRequest,
      message: 'SOS status updated',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/disaster-response/sos/requests/:id/communicate
 * Add communication to SOS request
 */
router.post('/sos/requests/:id/communicate', async (req, res) => {
  try {
    const { message, sender } = req.body;

    if (!message || !sender) {
      return res.status(400).json({ error: 'Message and sender required' });
    }

    const sosRequest = responseService.addSOSCommunication(
      req.params.id,
      message,
      sender
    );

    if (!sosRequest) {
      return res.status(404).json({ error: 'SOS request not found' });
    }

    res.json({
      success: true,
      sosRequest,
      message: 'Communication added',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DASHBOARD ENDPOINTS ====================

/**
 * GET /api/disaster-response/dashboard/metrics
 * Get dashboard metrics
 */
router.get('/dashboard/metrics', async (req, res) => {
  try {
    const metrics = responseService.getDashboardMetrics();

    res.json({
      success: true,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-response/dashboard/map-data
 * Get map data for dashboard
 */
router.get('/dashboard/map-data', async (req, res) => {
  try {
    const mapData = responseService.getMapData();

    res.json({
      success: true,
      mapData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-response/dashboard/incidents
 * Get active incidents
 */
router.get('/dashboard/incidents', async (req, res) => {
  try {
    const alerts = responseService.getActiveAlerts();
    const sos = responseService.getActiveSOSRequests();

    const incidents = [
      ...alerts.map(a => ({
        id: a.id,
        type: 'alert',
        severity: a.severity,
        location: a.location,
        createdAt: a.sentAt
      })),
      ...sos.map(s => ({
        id: s.id,
        type: 'sos',
        severity: s.sosLevel,
        location: s.location,
        createdAt: s.createdAt
      }))
    ];

    res.json({
      success: true,
      incidents,
      count: incidents.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/disaster-response/dashboard/dispatch-team
 * Dispatch rescue team
 */
router.post('/dashboard/dispatch-team', async (req, res) => {
  try {
    const { teamId, incidentId } = req.body;

    if (!teamId || !incidentId) {
      return res.status(400).json({ error: 'Team ID and incident ID required' });
    }

    const team = await responseService.dispatchTeam(teamId, incidentId);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({
      success: true,
      team,
      message: 'Team dispatched',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/disaster-response/dashboard/resource-allocation
 * Update resource allocation
 */
router.put('/dashboard/resource-allocation', async (req, res) => {
  try {
    const { resourceType, allocation } = req.body;

    if (!resourceType || !allocation) {
      return res.status(400).json({ error: 'Resource type and allocation required' });
    }

    const result = responseService.updateResourceAllocation(resourceType, allocation);

    res.json({
      success: true,
      result,
      message: 'Resource allocation updated',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== RESCUE TEAM ENDPOINTS ====================

/**
 * GET /api/disaster-response/teams
 * Get all rescue teams
 */
router.get('/teams', async (req, res) => {
  try {
    const teams = Array.from(responseService.rescueTeams.values());

    res.json({
      success: true,
      teams,
      count: teams.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-response/teams/:id
 * Get specific team
 */
router.get('/teams/:id', async (req, res) => {
  try {
    const team = responseService.rescueTeams.get(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({
      success: true,
      team,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/disaster-response/teams/:id/status
 * Update team status
 */
router.put('/teams/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const team = responseService.rescueTeams.get(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    team.status = status;

    res.json({
      success: true,
      team,
      message: 'Team status updated',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/disaster-response/teams/:id/location
 * Update team location
 */
router.put('/teams/:id/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const team = responseService.rescueTeams.get(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    team.location = { lat: parseFloat(lat), lng: parseFloat(lng) };

    res.json({
      success: true,
      team,
      message: 'Team location updated',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/disaster-response/teams/:id/communicate
 * Send team communication
 */
router.post('/teams/:id/communicate', async (req, res) => {
  try {
    const { message } = req.body;
    const team = responseService.rescueTeams.get(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({
      success: true,
      message: 'Message sent to team',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

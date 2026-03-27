// Post-Disaster Management Module - API Routes

const express = require('express');
const router = express.Router();
const PostDisasterManagementService = require('../services/post-disaster');

const disasterService = new PostDisasterManagementService();
disasterService.initializeSampleData();

// ==================== DAMAGE ASSESSMENT ENDPOINTS ====================

/**
 * POST /api/post-disaster/damage/analyze
 * Analyze damage from images
 */
router.post('/damage/analyze', async (req, res) => {
  try {
    const { imageData, location } = req.body;

    if (!imageData || !location) {
      return res.status(400).json({ error: 'Image data and location required' });
    }

    const assessment = await disasterService.analyzeDamage(imageData, location);

    res.json({
      success: true,
      assessment,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/post-disaster/damage/reports
 * Get damage assessment reports
 */
router.get('/damage/reports', async (req, res) => {
  try {
    const assessments = disasterService.getDamageAssessments();

    res.json({
      success: true,
      assessments,
      count: assessments.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/post-disaster/damage/map
 * Get damage map data
 */
router.get('/damage/map', async (req, res) => {
  try {
    const mapData = disasterService.getDamageMapData();

    res.json({
      success: true,
      mapData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== MISSING PERSON ENDPOINTS ====================

/**
 * POST /api/post-disaster/missing-persons/report
 * Report missing person
 */
router.post('/missing-persons/report', async (req, res) => {
  try {
    const personData = req.body;

    if (!personData.personalInfo || !personData.contact) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const missingPerson = await disasterService.reportMissingPerson(personData);

    res.json({
      success: true,
      missingPerson,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/post-disaster/missing-persons
 * Get all missing persons
 */
router.get('/missing-persons', async (req, res) => {
  try {
    const missingPersons = Array.from(disasterService.missingPersons.values());

    res.json({
      success: true,
      missingPersons,
      count: missingPersons.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/post-disaster/missing-persons/:id
 * Get specific missing person
 */
router.get('/missing-persons/:id', async (req, res) => {
  try {
    const missingPerson = disasterService.missingPersons.get(req.params.id);

    if (!missingPerson) {
      return res.status(404).json({ error: 'Missing person not found' });
    }

    res.json({
      success: true,
      missingPerson,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/post-disaster/missing-persons/search
 * Search missing persons
 */
router.post('/missing-persons/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = disasterService.searchMissingPersons(query);

    res.json({
      success: true,
      results,
      count: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/post-disaster/missing-persons/:id/status
 * Update missing person status
 */
router.put('/missing-persons/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const missingPerson = disasterService.updateMissingPersonStatus(req.params.id, status);

    if (!missingPerson) {
      return res.status(404).json({ error: 'Missing person not found' });
    }

    res.json({
      success: true,
      missingPerson,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== RESOURCE ENDPOINTS ====================

/**
 * POST /api/post-disaster/resources/add
 * Add resource
 */
router.post('/resources/add', async (req, res) => {
  try {
    const resourceData = req.body;

    if (!resourceData.itemInfo || !resourceData.location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const resource = await disasterService.addResource(resourceData);

    res.json({
      success: true,
      resource,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/post-disaster/resources
 * Get all resources
 */
router.get('/resources', async (req, res) => {
  try {
    const resources = Array.from(disasterService.resources.values());

    res.json({
      success: true,
      resources,
      count: resources.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/post-disaster/resources/:id/distribute
 * Distribute resource
 */
router.put('/resources/:id/distribute', async (req, res) => {
  try {
    const { quantity, recipient, location } = req.body;

    if (!quantity || !recipient) {
      return res.status(400).json({ error: 'Quantity and recipient required' });
    }

    const resource = await disasterService.distributeResource(
      req.params.id,
      quantity,
      recipient,
      location
    );

    res.json({
      success: true,
      resource,
      message: 'Resource distributed',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/post-disaster/resources/analytics
 * Get resource analytics
 */
router.get('/resources/analytics', async (req, res) => {
  try {
    const analytics = disasterService.getResourceAnalytics();

    res.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== VOLUNTEER ENDPOINTS ====================

/**
 * POST /api/post-disaster/volunteers/register
 * Register volunteer
 */
router.post('/volunteers/register', async (req, res) => {
  try {
    const volunteerData = req.body;

    if (!volunteerData.personalInfo) {
      return res.status(400).json({ error: 'Personal info required' });
    }

    const volunteer = await disasterService.registerVolunteer(volunteerData);

    res.json({
      success: true,
      volunteer,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/post-disaster/volunteers
 * Get all volunteers
 */
router.get('/volunteers', async (req, res) => {
  try {
    const volunteers = Array.from(disasterService.volunteers.values());

    res.json({
      success: true,
      volunteers,
      count: volunteers.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/post-disaster/volunteers/:id/assign-task
 * Assign task to volunteer
 */
router.post('/volunteers/:id/assign-task', async (req, res) => {
  try {
    const taskData = req.body;

    if (!taskData.taskType) {
      return res.status(400).json({ error: 'Task type required' });
    }

    const task = await disasterService.assignTask(req.params.id, taskData);

    res.json({
      success: true,
      task,
      message: 'Task assigned',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/post-disaster/volunteers/statistics
 * Get volunteer statistics
 */
router.get('/volunteers/statistics', async (req, res) => {
  try {
    const statistics = disasterService.getVolunteerStatistics();

    res.json({
      success: true,
      statistics,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== SHELTER ENDPOINTS ====================

/**
 * GET /api/post-disaster/shelters
 * Get all shelters
 */
router.get('/shelters', async (req, res) => {
  try {
    const shelters = Array.from(disasterService.shelters.values());

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
 * GET /api/post-disaster/shelters/nearby
 * Get nearby shelters
 */
router.get('/shelters/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const nearbyShelters = disasterService.getNearByShelters(
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
 * PUT /api/post-disaster/shelters/:id/occupancy
 * Update shelter occupancy
 */
router.put('/shelters/:id/occupancy', async (req, res) => {
  try {
    const { occupancy } = req.body;

    if (occupancy === undefined) {
      return res.status(400).json({ error: 'Occupancy required' });
    }

    const shelter = await disasterService.updateShelterOccupancy(req.params.id, occupancy);

    if (!shelter) {
      return res.status(404).json({ error: 'Shelter not found' });
    }

    res.json({
      success: true,
      shelter,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/post-disaster/shelters/statistics
 * Get shelter statistics
 */
router.get('/shelters/statistics', async (req, res) => {
  try {
    const statistics = disasterService.getShelterStatistics();

    res.json({
      success: true,
      statistics,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== RECOVERY ENDPOINTS ====================

/**
 * POST /api/post-disaster/recovery/plan
 * Create recovery plan
 */
router.post('/recovery/plan', async (req, res) => {
  try {
    const planData = req.body;

    if (!planData.name) {
      return res.status(400).json({ error: 'Plan name required' });
    }

    const plan = await disasterService.createRecoveryPlan(planData);

    res.json({
      success: true,
      plan,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/post-disaster/recovery/progress
 * Get recovery progress
 */
router.get('/recovery/progress', async (req, res) => {
  try {
    const progress = disasterService.getRecoveryProgress();

    res.json({
      success: true,
      progress,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// Disaster Response Module - Backend Service

class DisasterResponseService {
  constructor() {
    this.activeAlerts = new Map();
    this.sosRequests = new Map();
    this.rescueTeams = new Map();
    this.shelters = new Map();
  }

  // ==================== ALERT MANAGEMENT ====================

  /**
   * Send real-time disaster alert
   */
  async sendAlert(alertData) {
    try {
      const alert = {
        id: this.generateId(),
        disasterId: alertData.disasterId,
        alertType: alertData.alertType,
        severity: alertData.severity,
        location: alertData.location,
        message: alertData.message,
        safetyInstructions: alertData.safetyInstructions || [],
        evacuationRoutes: alertData.evacuationRoutes || [],
        shelterLocations: alertData.shelterLocations || [],
        emergencyContacts: alertData.emergencyContacts || [],
        channels: alertData.channels || ['sms', 'push', 'email'],
        recipients: alertData.recipients || [],
        status: 'sent',
        sentAt: new Date(),
        deliveredAt: null,
        readAt: null,
        engagement: {
          delivered: 0,
          read: 0,
          clicked: 0
        }
      };

      this.activeAlerts.set(alert.id, alert);

      // Distribute alert through multiple channels
      await this.distributeAlert(alert);

      return alert;
    } catch (err) {
      console.error('Alert sending error:', err.message);
      throw err;
    }
  }

  /**
   * Distribute alert through multiple channels
   */
  async distributeAlert(alert) {
    const channels = alert.channels;

    if (channels.includes('sms')) {
      await this.sendSMS(alert);
    }
    if (channels.includes('push')) {
      await this.sendPushNotification(alert);
    }
    if (channels.includes('email')) {
      await this.sendEmail(alert);
    }
    if (channels.includes('web')) {
      await this.sendWebNotification(alert);
    }
    if (channels.includes('social')) {
      await this.sendSocialMedia(alert);
    }
  }

  /**
   * Send SMS alert
   */
  async sendSMS(alert) {
    try {
      // Simulate SMS sending
      console.log(`SMS Alert sent to ${alert.recipients.length} recipients`);
      return {
        channel: 'sms',
        status: 'sent',
        timestamp: new Date()
      };
    } catch (err) {
      console.error('SMS sending error:', err.message);
    }
  }

  /**
   * Send push notification
   */
  async sendPushNotification(alert) {
    try {
      // Simulate push notification
      console.log(`Push notification sent to ${alert.recipients.length} users`);
      return {
        channel: 'push',
        status: 'sent',
        timestamp: new Date()
      };
    } catch (err) {
      console.error('Push notification error:', err.message);
    }
  }

  /**
   * Send email alert
   */
  async sendEmail(alert) {
    try {
      // Simulate email sending
      console.log(`Email alert sent to ${alert.recipients.length} recipients`);
      return {
        channel: 'email',
        status: 'sent',
        timestamp: new Date()
      };
    } catch (err) {
      console.error('Email sending error:', err.message);
    }
  }

  /**
   * Send web notification
   */
  async sendWebNotification(alert) {
    try {
      // Simulate web notification via WebSocket
      console.log(`Web notification sent to ${alert.recipients.length} users`);
      return {
        channel: 'web',
        status: 'sent',
        timestamp: new Date()
      };
    } catch (err) {
      console.error('Web notification error:', err.message);
    }
  }

  /**
   * Send social media alert
   */
  async sendSocialMedia(alert) {
    try {
      // Simulate social media posting
      console.log(`Social media alert posted`);
      return {
        channel: 'social',
        status: 'posted',
        timestamp: new Date()
      };
    } catch (err) {
      console.error('Social media error:', err.message);
    }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts() {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId, userId) {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.readAt = new Date();
      alert.engagement.read++;
      return alert;
    }
    return null;
  }

  // ==================== NAVIGATION & ROUTING ====================

  /**
   * Find nearby shelters
   */
  async findNearbyShelters(userLat, userLng, radius = 5) {
    try {
      const nearbyShelters = [];

      for (const shelter of this.shelters.values()) {
        const distance = this.calculateDistance(
          userLat,
          userLng,
          shelter.location.lat,
          shelter.location.lng
        );

        if (distance <= radius) {
          nearbyShelters.push({
            ...shelter,
            distance: distance.toFixed(2),
            occupancyPercent: (shelter.occupancy / shelter.capacity) * 100
          });
        }
      }

      // Sort by distance
      nearbyShelters.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      return nearbyShelters;
    } catch (err) {
      console.error('Shelter search error:', err.message);
      throw err;
    }
  }

  /**
   * Calculate safe route
   */
  async calculateSafeRoute(startLat, startLng, endLat, endLng, riskZones) {
    try {
      const route = {
        id: this.generateId(),
        start: { lat: startLat, lng: startLng },
        end: { lat: endLat, lng: endLng },
        routes: [
          {
            name: 'Safest Route',
            distance: 5.2,
            duration: 12,
            riskLevel: 'Low',
            waypoints: [
              { lat: startLat, lng: startLng },
              { lat: startLat + 0.01, lng: startLng + 0.01 },
              { lat: endLat, lng: endLng }
            ]
          },
          {
            name: 'Alternative Route 1',
            distance: 6.1,
            duration: 15,
            riskLevel: 'Medium',
            waypoints: [
              { lat: startLat, lng: startLng },
              { lat: startLat - 0.01, lng: startLng + 0.01 },
              { lat: endLat, lng: endLng }
            ]
          },
          {
            name: 'Alternative Route 2',
            distance: 7.0,
            duration: 18,
            riskLevel: 'High',
            waypoints: [
              { lat: startLat, lng: startLng },
              { lat: startLat + 0.02, lng: startLng - 0.01 },
              { lat: endLat, lng: endLng }
            ]
          }
        ],
        generatedAt: new Date()
      };

      return route;
    } catch (err) {
      console.error('Route calculation error:', err.message);
      throw err;
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // ==================== SOS SYSTEM ====================

  /**
   * Create SOS request
   */
  async createSOSRequest(sosData) {
    try {
      const sosRequest = {
        id: this.generateId(),
        userId: sosData.userId,
        location: sosData.location,
        userInfo: sosData.userInfo,
        sosLevel: sosData.sosLevel || 'help',
        peopleCount: sosData.peopleCount || 1,
        specialRequirements: sosData.specialRequirements || '',
        status: 'pending',
        assignedTeam: null,
        createdAt: new Date(),
        resolvedAt: null,
        communication: []
      };

      this.sosRequests.set(sosRequest.id, sosRequest);

      // Find and assign nearest rescue team
      const assignedTeam = await this.assignRescueTeam(sosRequest);
      if (assignedTeam) {
        sosRequest.assignedTeam = assignedTeam.id;
        sosRequest.status = 'assigned';
      }

      return sosRequest;
    } catch (err) {
      console.error('SOS request creation error:', err.message);
      throw err;
    }
  }

  /**
   * Assign nearest rescue team to SOS request
   */
  async assignRescueTeam(sosRequest) {
    try {
      let nearestTeam = null;
      let minDistance = Infinity;

      for (const team of this.rescueTeams.values()) {
        if (team.status === 'available') {
          const distance = this.calculateDistance(
            sosRequest.location.lat,
            sosRequest.location.lng,
            team.location.lat,
            team.location.lng
          );

          if (distance < minDistance) {
            minDistance = distance;
            nearestTeam = team;
          }
        }
      }

      if (nearestTeam) {
        nearestTeam.assignedIncidents.push(sosRequest.id);
        nearestTeam.status = 'deployed';
        nearestTeam.workload++;
      }

      return nearestTeam;
    } catch (err) {
      console.error('Team assignment error:', err.message);
      return null;
    }
  }

  /**
   * Update SOS request status
   */
  updateSOSStatus(sosId, status) {
    const sos = this.sosRequests.get(sosId);
    if (sos) {
      sos.status = status;
      if (status === 'resolved') {
        sos.resolvedAt = new Date();
      }
      return sos;
    }
    return null;
  }

  /**
   * Add communication to SOS request
   */
  addSOSCommunication(sosId, message, sender) {
    const sos = this.sosRequests.get(sosId);
    if (sos) {
      sos.communication.push({
        id: this.generateId(),
        sender,
        message,
        timestamp: new Date(),
        type: 'text'
      });
      return sos;
    }
    return null;
  }

  /**
   * Get active SOS requests
   */
  getActiveSOSRequests() {
    return Array.from(this.sosRequests.values())
      .filter(sos => sos.status !== 'resolved');
  }

  // ==================== DASHBOARD METRICS ====================

  /**
   * Get dashboard metrics
   */
  getDashboardMetrics() {
    const activeAlerts = this.getActiveAlerts();
    const activeSOS = this.getActiveSOSRequests();
    const teams = Array.from(this.rescueTeams.values());
    const shelters = Array.from(this.shelters.values());

    const totalOccupancy = shelters.reduce((sum, s) => sum + s.occupancy, 0);
    const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0);

    return {
      timestamp: new Date(),
      alerts: {
        total: activeAlerts.length,
        bySeverity: {
          low: activeAlerts.filter(a => a.severity === 'low').length,
          medium: activeAlerts.filter(a => a.severity === 'medium').length,
          high: activeAlerts.filter(a => a.severity === 'high').length,
          critical: activeAlerts.filter(a => a.severity === 'critical').length
        },
        deliveryRate: 98.5,
        averageDeliveryTime: 28
      },
      sos: {
        total: activeSOS.length,
        byStatus: {
          pending: activeSOS.filter(s => s.status === 'pending').length,
          assigned: activeSOS.filter(s => s.status === 'assigned').length,
          inProgress: activeSOS.filter(s => s.status === 'in_progress').length,
          resolved: activeSOS.filter(s => s.status === 'resolved').length
        },
        averageResponseTime: 8.5
      },
      rescueTeams: {
        total: teams.length,
        available: teams.filter(t => t.status === 'available').length,
        deployed: teams.filter(t => t.status === 'deployed').length,
        busy: teams.filter(t => t.status === 'busy').length,
        averageWorkload: teams.reduce((sum, t) => sum + t.workload, 0) / teams.length
      },
      shelters: {
        total: shelters.length,
        occupancy: totalOccupancy,
        capacity: totalCapacity,
        occupancyPercent: totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0,
        atCapacity: shelters.filter(s => s.occupancy >= s.capacity).length
      },
      estimatedAffected: 250000,
      estimatedCasualties: 1250,
      responseEfficiency: 92.3
    };
  }

  /**
   * Get map data for dashboard
   */
  getMapData() {
    const alerts = this.getActiveAlerts();
    const sos = this.getActiveSOSRequests();
    const teams = Array.from(this.rescueTeams.values());
    const shelters = Array.from(this.shelters.values());

    return {
      alerts: alerts.map(a => ({
        id: a.id,
        type: 'alert',
        lat: a.location.lat,
        lng: a.location.lng,
        severity: a.severity,
        color: this.getSeverityColor(a.severity)
      })),
      sos: sos.map(s => ({
        id: s.id,
        type: 'sos',
        lat: s.location.lat,
        lng: s.location.lng,
        status: s.status,
        color: this.getSOSStatusColor(s.status)
      })),
      teams: teams.map(t => ({
        id: t.id,
        type: 'team',
        lat: t.location.lat,
        lng: t.location.lng,
        status: t.status,
        color: this.getTeamStatusColor(t.status)
      })),
      shelters: shelters.map(s => ({
        id: s.id,
        type: 'shelter',
        lat: s.location.lat,
        lng: s.location.lng,
        occupancy: s.occupancy,
        capacity: s.capacity,
        color: this.getShelterColor(s.occupancy, s.capacity)
      }))
    };
  }

  /**
   * Get severity color
   */
  getSeverityColor(severity) {
    switch (severity) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#f97316';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  /**
   * Get SOS status color
   */
  getSOSStatusColor(status) {
    switch (status) {
      case 'pending':
        return '#fbbf24';
      case 'assigned':
        return '#60a5fa';
      case 'in_progress':
        return '#f97316';
      case 'resolved':
        return '#10b981';
      default:
        return '#6b7280';
    }
  }

  /**
   * Get team status color
   */
  getTeamStatusColor(status) {
    switch (status) {
      case 'available':
        return '#10b981';
      case 'deployed':
        return '#3b82f6';
      case 'busy':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  /**
   * Get shelter color
   */
  getShelterColor(occupancy, capacity) {
    const percent = (occupancy / capacity) * 100;
    if (percent < 50) return '#10b981';
    if (percent < 75) return '#f59e0b';
    if (percent < 90) return '#f97316';
    return '#ef4444';
  }

  /**
   * Dispatch rescue team
   */
  async dispatchTeam(teamId, incidentId) {
    const team = this.rescueTeams.get(teamId);
    if (team) {
      team.assignedIncidents.push(incidentId);
      team.status = 'deployed';
      team.workload++;
      return team;
    }
    return null;
  }

  /**
   * Update resource allocation
   */
  updateResourceAllocation(resourceType, allocation) {
    // Simulate resource allocation update
    return {
      resourceType,
      allocation,
      timestamp: new Date(),
      status: 'updated'
    };
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Generate unique ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize sample data
   */
  initializeSampleData() {
    // Sample rescue teams
    this.rescueTeams.set('team1', {
      id: 'team1',
      name: 'Alpha Rescue Team',
      members: 15,
      status: 'available',
      location: { lat: 13.0827, lng: 80.2707 },
      assignedIncidents: [],
      equipment: ['Boats', 'Ropes', 'Medical Kit'],
      skills: ['Water Rescue', 'Medical'],
      contact: '9876543210',
      workload: 0
    });

    this.rescueTeams.set('team2', {
      id: 'team2',
      name: 'Beta Rescue Team',
      members: 12,
      status: 'available',
      location: { lat: 12.9250, lng: 80.1269 },
      assignedIncidents: [],
      equipment: ['Boats', 'Helicopters', 'Medical Kit'],
      skills: ['Water Rescue', 'Air Rescue', 'Medical'],
      contact: '9876543211',
      workload: 0
    });

    // Sample shelters
    this.shelters.set('shelter1', {
      id: 'shelter1',
      name: 'Velachery Relief Center',
      location: { lat: 13.0827, lng: 80.2707 },
      address: 'Velachery, Chennai',
      capacity: 500,
      occupancy: 120,
      amenities: ['Medical', 'Food', 'Water', 'Bedding'],
      accessibility: ['Wheelchair', 'Elderly Care'],
      contact: '9876543210',
      status: 'operational'
    });

    this.shelters.set('shelter2', {
      id: 'shelter2',
      name: 'Tambaram Community Shelter',
      location: { lat: 12.9250, lng: 80.1269 },
      address: 'Tambaram, Chennai',
      capacity: 800,
      occupancy: 250,
      amenities: ['Medical', 'Food', 'Water', 'Bedding', 'Power'],
      accessibility: ['Wheelchair', 'Elderly Care', 'Child Care'],
      contact: '9876543211',
      status: 'operational'
    });
  }
}

module.exports = DisasterResponseService;

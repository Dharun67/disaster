// Post-Disaster Management Module - Backend Service

class PostDisasterManagementService {
  constructor() {
    this.damageAssessments = new Map();
    this.missingPersons = new Map();
    this.resources = new Map();
    this.volunteers = new Map();
    this.shelters = new Map();
    this.recoveryPlans = new Map();
  }

  // ==================== DAMAGE ASSESSMENT ====================

  /**
   * Analyze damage from images
   */
  async analyzeDamage(imageData, location) {
    try {
      const assessment = {
        id: this.generateId(),
        location,
        imageData,
        assessment: {
          damageLevel: this.calculateDamageLevel(),
          damagePercentage: Math.random() * 100,
          affectedArea: Math.random() * 50,
          buildingCount: Math.floor(Math.random() * 500),
          infrastructureDamage: {
            roads: Math.random() * 100,
            bridges: Math.random() * 100,
            utilities: Math.random() * 100
          },
          confidence: 85 + Math.random() * 10
        },
        report: {
          generatedAt: new Date(),
          generatedBy: 'AI Analysis',
          content: this.generateDamageReport(),
          recommendations: this.generateRecommendations()
        },
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.damageAssessments.set(assessment.id, assessment);
      return assessment;
    } catch (err) {
      console.error('Damage analysis error:', err.message);
      throw err;
    }
  }

  /**
   * Calculate damage level
   */
  calculateDamageLevel() {
    const levels = ['None', 'Minor', 'Moderate', 'Severe', 'Destroyed'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  /**
   * Generate damage report
   */
  generateDamageReport() {
    return `
    Damage Assessment Report
    
    Summary:
    - Total affected area: 25.5 km²
    - Buildings damaged: 450
    - Infrastructure damage: 65%
    - Estimated casualties: 150
    - Displaced persons: 5,000
    
    Detailed Analysis:
    - Residential areas: 60% damage
    - Commercial areas: 45% damage
    - Industrial areas: 30% damage
    - Agricultural areas: 40% damage
    
    Priority Areas:
    1. Hospital and medical facilities
    2. Water supply infrastructure
    3. Power distribution network
    4. Road connectivity
    5. Shelter locations
    `;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    return [
      'Establish emergency medical camps in affected areas',
      'Deploy water purification units',
      'Restore power supply to critical infrastructure',
      'Clear roads for emergency access',
      'Set up temporary shelters',
      'Organize relief distribution centers',
      'Deploy search and rescue teams',
      'Establish communication centers'
    ];
  }

  /**
   * Get damage assessments
   */
  getDamageAssessments() {
    return Array.from(this.damageAssessments.values());
  }

  /**
   * Get damage map data
   */
  getDamageMapData() {
    const assessments = this.getDamageAssessments();
    return assessments.map(a => ({
      id: a.id,
      lat: a.location.lat,
      lng: a.location.lng,
      damageLevel: a.assessment.damageLevel,
      damagePercentage: a.assessment.damagePercentage,
      color: this.getDamageColor(a.assessment.damagePercentage)
    }));
  }

  /**
   * Get damage color
   */
  getDamageColor(percentage) {
    if (percentage < 20) return '#10b981';
    if (percentage < 40) return '#f59e0b';
    if (percentage < 60) return '#f97316';
    if (percentage < 80) return '#ef4444';
    return '#7f1d1d';
  }

  // ==================== MISSING PERSON SYSTEM ====================

  /**
   * Report missing person
   */
  async reportMissingPerson(personData) {
    try {
      const missingPerson = {
        id: this.generateId(),
        personalInfo: personData.personalInfo,
        lastSeen: personData.lastSeen,
        medicalInfo: personData.medicalInfo || {},
        contact: personData.contact,
        status: 'missing',
        matches: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.missingPersons.set(missingPerson.id, missingPerson);

      // Check for potential matches
      await this.findMatches(missingPerson);

      return missingPerson;
    } catch (err) {
      console.error('Missing person report error:', err.message);
      throw err;
    }
  }

  /**
   * Find matches for missing person
   */
  async findMatches(missingPerson) {
    try {
      const matches = [];
      
      for (const person of this.missingPersons.values()) {
        if (person.id !== missingPerson.id && person.status === 'found') {
          const similarity = this.calculateSimilarity(missingPerson, person);
          if (similarity > 0.7) {
            matches.push({
              personId: person.id,
              similarity: similarity,
              confidence: similarity * 100
            });
          }
        }
      }

      missingPerson.matches = matches;
      return matches;
    } catch (err) {
      console.error('Match finding error:', err.message);
      return [];
    }
  }

  /**
   * Calculate similarity between two persons
   */
  calculateSimilarity(person1, person2) {
    let similarity = 0;
    let factors = 0;

    // Age similarity
    if (Math.abs(person1.personalInfo.age - person2.personalInfo.age) < 5) {
      similarity += 0.3;
    }
    factors += 0.3;

    // Gender match
    if (person1.personalInfo.gender === person2.personalInfo.gender) {
      similarity += 0.2;
    }
    factors += 0.2;

    // Location proximity
    const distance = this.calculateDistance(
      person1.lastSeen.lat,
      person1.lastSeen.lng,
      person2.lastSeen.lat,
      person2.lastSeen.lng
    );
    if (distance < 5) {
      similarity += 0.3;
    }
    factors += 0.3;

    // Time proximity
    const timeDiff = Math.abs(person1.lastSeen.time - person2.lastSeen.time) / (1000 * 60 * 60);
    if (timeDiff < 24) {
      similarity += 0.2;
    }
    factors += 0.2;

    return similarity / factors;
  }

  /**
   * Calculate distance
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Search missing persons
   */
  searchMissingPersons(query) {
    const results = [];
    
    for (const person of this.missingPersons.values()) {
      if (person.personalInfo.name.toLowerCase().includes(query.toLowerCase()) ||
          person.personalInfo.description.toLowerCase().includes(query.toLowerCase())) {
        results.push(person);
      }
    }

    return results;
  }

  /**
   * Update missing person status
   */
  updateMissingPersonStatus(personId, status) {
    const person = this.missingPersons.get(personId);
    if (person) {
      person.status = status;
      person.updatedAt = new Date();
      return person;
    }
    return null;
  }

  // ==================== RESOURCE MANAGEMENT ====================

  /**
   * Add resource
   */
  async addResource(resourceData) {
    try {
      const resource = {
        id: this.generateId(),
        itemInfo: resourceData.itemInfo,
        location: resourceData.location,
        tracking: {
          expiryDate: resourceData.expiryDate,
          donorInfo: resourceData.donorInfo,
          cost: resourceData.cost,
          lastUpdated: new Date()
        },
        distribution: [],
        status: 'available',
        createdAt: new Date()
      };

      this.resources.set(resource.id, resource);
      return resource;
    } catch (err) {
      console.error('Resource addition error:', err.message);
      throw err;
    }
  }

  /**
   * Distribute resource
   */
  async distributeResource(resourceId, quantity, recipient, location) {
    try {
      const resource = this.resources.get(resourceId);
      if (!resource) {
        throw new Error('Resource not found');
      }

      if (resource.itemInfo.quantity < quantity) {
        throw new Error('Insufficient quantity');
      }

      resource.itemInfo.quantity -= quantity;
      resource.distribution.push({
        date: new Date(),
        quantity,
        recipient,
        location
      });

      if (resource.itemInfo.quantity === 0) {
        resource.status = 'depleted';
      }

      return resource;
    } catch (err) {
      console.error('Resource distribution error:', err.message);
      throw err;
    }
  }

  /**
   * Get resource analytics
   */
  getResourceAnalytics() {
    const resources = Array.from(this.resources.values());
    
    const analytics = {
      totalItems: resources.length,
      totalQuantity: resources.reduce((sum, r) => sum + r.itemInfo.quantity, 0),
      byCategory: {},
      byStatus: {
        available: resources.filter(r => r.status === 'available').length,
        depleted: resources.filter(r => r.status === 'depleted').length,
        expired: resources.filter(r => r.status === 'expired').length
      },
      totalDistributed: resources.reduce((sum, r) => 
        sum + r.distribution.reduce((s, d) => s + d.quantity, 0), 0),
      totalCost: resources.reduce((sum, r) => sum + (r.tracking.cost || 0), 0)
    };

    // Calculate by category
    resources.forEach(r => {
      const category = r.itemInfo.category;
      if (!analytics.byCategory[category]) {
        analytics.byCategory[category] = 0;
      }
      analytics.byCategory[category] += r.itemInfo.quantity;
    });

    return analytics;
  }

  // ==================== VOLUNTEER MANAGEMENT ====================

  /**
   * Register volunteer
   */
  async registerVolunteer(volunteerData) {
    try {
      const volunteer = {
        id: this.generateId(),
        personalInfo: volunteerData.personalInfo,
        skills: volunteerData.skills || [],
        availability: volunteerData.availability,
        verification: {
          emailVerified: false,
          phoneVerified: false,
          backgroundCheckDone: false,
          certifications: volunteerData.certifications || []
        },
        performance: {
          hoursWorked: 0,
          tasksCompleted: 0,
          rating: 0,
          feedback: []
        },
        status: 'registered',
        createdAt: new Date()
      };

      this.volunteers.set(volunteer.id, volunteer);
      return volunteer;
    } catch (err) {
      console.error('Volunteer registration error:', err.message);
      throw err;
    }
  }

  /**
   * Assign task to volunteer
   */
  async assignTask(volunteerId, taskData) {
    try {
      const volunteer = this.volunteers.get(volunteerId);
      if (!volunteer) {
        throw new Error('Volunteer not found');
      }

      const task = {
        id: this.generateId(),
        volunteerId,
        taskType: taskData.taskType,
        description: taskData.description,
        location: taskData.location,
        priority: taskData.priority,
        status: 'assigned',
        assignedAt: new Date(),
        completedAt: null
      };

      return task;
    } catch (err) {
      console.error('Task assignment error:', err.message);
      throw err;
    }
  }

  /**
   * Get volunteer statistics
   */
  getVolunteerStatistics() {
    const volunteers = Array.from(this.volunteers.values());
    
    return {
      totalVolunteers: volunteers.length,
      activeVolunteers: volunteers.filter(v => v.status === 'active').length,
      totalHours: volunteers.reduce((sum, v) => sum + v.performance.hoursWorked, 0),
      totalTasks: volunteers.reduce((sum, v) => sum + v.performance.tasksCompleted, 0),
      averageRating: volunteers.reduce((sum, v) => sum + v.performance.rating, 0) / volunteers.length,
      bySkill: this.getVolunteersBySkill(volunteers)
    };
  }

  /**
   * Get volunteers by skill
   */
  getVolunteersBySkill(volunteers) {
    const skillMap = {};
    
    volunteers.forEach(v => {
      v.skills.forEach(skill => {
        if (!skillMap[skill]) {
          skillMap[skill] = 0;
        }
        skillMap[skill]++;
      });
    });

    return skillMap;
  }

  // ==================== SHELTER MANAGEMENT ====================

  /**
   * Update shelter occupancy
   */
  async updateShelterOccupancy(shelterId, occupancy) {
    try {
      const shelter = this.shelters.get(shelterId);
      if (!shelter) {
        throw new Error('Shelter not found');
      }

      shelter.capacity.current = occupancy;
      
      if (occupancy >= shelter.capacity.total) {
        shelter.status = 'full';
      } else if (occupancy > shelter.capacity.total * 0.8) {
        shelter.status = 'near-capacity';
      } else {
        shelter.status = 'operational';
      }

      return shelter;
    } catch (err) {
      console.error('Shelter occupancy update error:', err.message);
      throw err;
    }
  }

  /**
   * Get nearby shelters
   */
  getNearByShelters(lat, lng, radius = 5) {
    const nearbyShelters = [];

    for (const shelter of this.shelters.values()) {
      const distance = this.calculateDistance(lat, lng, shelter.basicInfo.lat, shelter.basicInfo.lng);
      
      if (distance <= radius) {
        nearbyShelters.push({
          ...shelter,
          distance: distance.toFixed(2),
          availableCapacity: shelter.capacity.total - shelter.capacity.current,
          occupancyPercent: (shelter.capacity.current / shelter.capacity.total) * 100
        });
      }
    }

    nearbyShelters.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    return nearbyShelters;
  }

  /**
   * Get shelter statistics
   */
  getShelterStatistics() {
    const shelters = Array.from(this.shelters.values());
    
    const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity.total, 0);
    const totalOccupancy = shelters.reduce((sum, s) => sum + s.capacity.current, 0);

    return {
      totalShelters: shelters.length,
      totalCapacity,
      totalOccupancy,
      occupancyPercent: (totalOccupancy / totalCapacity) * 100,
      fullShelters: shelters.filter(s => s.status === 'full').length,
      operationalShelters: shelters.filter(s => s.status === 'operational').length,
      averageOccupancy: totalOccupancy / shelters.length
    };
  }

  // ==================== RECOVERY COORDINATION ====================

  /**
   * Create recovery plan
   */
  async createRecoveryPlan(planData) {
    try {
      const plan = {
        id: this.generateId(),
        name: planData.name,
        description: planData.description,
        startDate: planData.startDate,
        endDate: planData.endDate,
        budget: planData.budget,
        objectives: planData.objectives || [],
        milestones: planData.milestones || [],
        stakeholders: planData.stakeholders || [],
        status: 'planning',
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.recoveryPlans.set(plan.id, plan);
      return plan;
    } catch (err) {
      console.error('Recovery plan creation error:', err.message);
      throw err;
    }
  }

  /**
   * Get recovery progress
   */
  getRecoveryProgress() {
    const plans = Array.from(this.recoveryPlans.values());
    
    return {
      totalPlans: plans.length,
      activePlans: plans.filter(p => p.status === 'active').length,
      completedPlans: plans.filter(p => p.status === 'completed').length,
      averageProgress: plans.reduce((sum, p) => sum + p.progress, 0) / plans.length,
      totalBudget: plans.reduce((sum, p) => sum + p.budget, 0),
      byStatus: {
        planning: plans.filter(p => p.status === 'planning').length,
        active: plans.filter(p => p.status === 'active').length,
        completed: plans.filter(p => p.status === 'completed').length
      }
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
    // Sample shelters
    this.shelters.set('shelter1', {
      basicInfo: {
        name: 'Velachery Relief Center',
        location: 'Velachery',
        lat: 13.0827,
        lng: 80.2707,
        address: 'Velachery, Chennai'
      },
      capacity: {
        total: 500,
        current: 120,
        reserved: 50
      },
      amenities: ['Medical', 'Food', 'Water', 'Bedding'],
      staff: {
        manager: 'John Doe',
        contact: '9876543210',
        team: ['Staff1', 'Staff2', 'Staff3']
      },
      services: {
        food: true,
        medical: true,
        sanitation: true,
        security: true
      },
      status: 'operational',
      createdAt: new Date()
    });

    this.shelters.set('shelter2', {
      basicInfo: {
        name: 'Tambaram Community Shelter',
        location: 'Tambaram',
        lat: 12.9250,
        lng: 80.1269,
        address: 'Tambaram, Chennai'
      },
      capacity: {
        total: 800,
        current: 250,
        reserved: 100
      },
      amenities: ['Medical', 'Food', 'Water', 'Bedding', 'Power'],
      staff: {
        manager: 'Jane Smith',
        contact: '9876543211',
        team: ['Staff1', 'Staff2', 'Staff3', 'Staff4']
      },
      services: {
        food: true,
        medical: true,
        sanitation: true,
        security: true
      },
      status: 'operational',
      createdAt: new Date()
    });
  }
}

module.exports = PostDisasterManagementService;

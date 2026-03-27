// Offline Routing Service with Shortest Path Algorithm
// Uses Dijkstra's algorithm for optimal route finding

class OfflineRoutingService {
  constructor() {
    this.roadNetwork = new Map();
    this.trafficData = new Map();
    this.safetyZones = [];
    this.floodRiskAreas = [];
    this.initializeNetwork();
  }

  // Initialize road network with Chennai data
  initializeNetwork() {
    // Major roads and intersections in Chennai
    const roads = [
      // North Chennai
      { from: 'Tiruvallur', to: 'Avadi', distance: 15, type: 'highway' },
      { from: 'Avadi', to: 'Ambattur', distance: 8, type: 'main' },
      { from: 'Ambattur', to: 'Villivakkam', distance: 6, type: 'main' },
      
      // Central Chennai
      { from: 'Villivakkam', to: 'Egmore', distance: 5, type: 'main' },
      { from: 'Egmore', to: 'Chepauk', distance: 3, type: 'main' },
      { from: 'Chepauk', to: 'Mylapore', distance: 4, type: 'main' },
      
      // South Chennai
      { from: 'Mylapore', to: 'Adyar', distance: 5, type: 'main' },
      { from: 'Adyar', to: 'Besant Nagar', distance: 4, type: 'main' },
      { from: 'Besant Nagar', to: 'Thiruvanmiyur', distance: 6, type: 'main' },
      
      // East Chennai
      { from: 'Chepauk', to: 'Nungambakkam', distance: 4, type: 'main' },
      { from: 'Nungambakkam', to: 'Chetpet', distance: 3, type: 'main' },
      { from: 'Chetpet', to: 'Teynampet', distance: 4, type: 'main' },
      
      // West Chennai
      { from: 'Villivakkam', to: 'Kodambakkam', distance: 7, type: 'main' },
      { from: 'Kodambakkam', to: 'Vadapalani', distance: 5, type: 'main' },
      { from: 'Vadapalani', to: 'Ashok Nagar', distance: 4, type: 'main' },
      
      // Bypass routes
      { from: 'Tiruvallur', to: 'Kanchipuram', distance: 45, type: 'highway' },
      { from: 'Kanchipuram', to: 'Thiruvanmiyur', distance: 50, type: 'highway' },
      
      // Cross connections
      { from: 'Ambattur', to: 'Nungambakkam', distance: 12, type: 'secondary' },
      { from: 'Kodambakkam', to: 'Mylapore', distance: 10, type: 'secondary' },
      { from: 'Adyar', to: 'Teynampet', distance: 8, type: 'secondary' }
    ];

    // Build adjacency list
    roads.forEach(road => {
      if (!this.roadNetwork.has(road.from)) {
        this.roadNetwork.set(road.from, []);
      }
      if (!this.roadNetwork.has(road.to)) {
        this.roadNetwork.set(road.to, []);
      }

      this.roadNetwork.get(road.from).push({
        node: road.to,
        distance: road.distance,
        type: road.type,
        trafficFactor: 1.0 // No traffic in offline mode
      });

      this.roadNetwork.get(road.to).push({
        node: road.from,
        distance: road.distance,
        type: road.type,
        trafficFactor: 1.0
      });
    });

    // Define safe zones (hospitals, police stations, shelters)
    this.safetyZones = [
      { name: 'Apollo Hospital', location: 'Teynampet', lat: 13.0349, lng: 80.2540 },
      { name: 'Fortis Hospital', location: 'Nungambakkam', lat: 13.0520, lng: 80.2340 },
      { name: 'Police Station', location: 'Mylapore', lat: 13.0349, lng: 80.2740 },
      { name: 'Relief Shelter', location: 'Adyar', lat: 13.0049, lng: 80.2540 }
    ];

    // Define flood risk areas
    this.floodRiskAreas = [
      { name: 'Cooum River', location: 'Chepauk', riskLevel: 'high' },
      { name: 'Buckingham Canal', location: 'Kodambakkam', riskLevel: 'medium' },
      { name: 'Adyar River', location: 'Adyar', riskLevel: 'high' }
    ];
  }

  // Dijkstra's algorithm for shortest path
  findShortestPath(start, end, avoidFloodAreas = true) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    // Initialize distances
    for (let node of this.roadNetwork.keys()) {
      distances.set(node, Infinity);
      previous.set(node, null);
      unvisited.add(node);
    }

    distances.set(start, 0);

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current = null;
      let minDistance = Infinity;

      for (let node of unvisited) {
        if (distances.get(node) < minDistance) {
          minDistance = distances.get(node);
          current = node;
        }
      }

      if (current === null || current === end) break;

      unvisited.delete(current);

      // Check neighbors
      const neighbors = this.roadNetwork.get(current) || [];
      for (let neighbor of neighbors) {
        if (!unvisited.has(neighbor.node)) continue;

        // Check if area is flooded
        if (avoidFloodAreas && this.isFloodedArea(neighbor.node)) {
          continue; // Skip flooded areas
        }

        const alt = distances.get(current) + neighbor.distance;
        if (alt < distances.get(neighbor.node)) {
          distances.set(neighbor.node, alt);
          previous.set(neighbor.node, current);
        }
      }
    }

    // Reconstruct path
    const path = [];
    let current = end;
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current);
    }

    return {
      path,
      distance: distances.get(end),
      valid: distances.get(end) !== Infinity
    };
  }

  // Find nearest safe zone
  findNearestSafeZone(currentLocation) {
    let nearest = null;
    let minDistance = Infinity;

    for (let zone of this.safetyZones) {
      const distance = this.calculateDistance(currentLocation, zone);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = zone;
      }
    }

    return nearest;
  }

  // Calculate distance between two points
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Check if area is flooded
  isFloodedArea(location) {
    return this.floodRiskAreas.some(area => area.name.includes(location));
  }

  // Get all nodes (locations)
  getAllLocations() {
    return Array.from(this.roadNetwork.keys());
  }

  // Get road network for visualization
  getRoadNetwork() {
    return this.roadNetwork;
  }

  // Get safety zones
  getSafetyZones() {
    return this.safetyZones;
  }

  // Get flood risk areas
  getFloodRiskAreas() {
    return this.floodRiskAreas;
  }
}

export default OfflineRoutingService;

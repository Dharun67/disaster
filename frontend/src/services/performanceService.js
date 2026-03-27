// Performance Optimization Service
// Caches data, optimizes rendering, and manages offline storage

class PerformanceService {
  constructor() {
    this.cache = new Map();
    this.offlineStorage = new Map();
    this.initializeOfflineStorage();
  }

  // Initialize offline storage with IndexedDB
  initializeOfflineStorage() {
    if ('indexedDB' in window) {
      const request = indexedDB.open('GeoGuardDB', 1);
      
      request.onerror = () => console.error('IndexedDB error');
      request.onsuccess = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('routes')) {
          db.createObjectStore('routes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('locations')) {
          db.createObjectStore('locations', { keyPath: 'id' });
        }
      };
    }
  }

  // Cache data with TTL
  setCache(key, value, ttl = 3600000) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  // Get cached data
  getCache(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  // Save to offline storage
  async saveOffline(key, value) {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        this.offlineStorage.set(key, value);
        resolve();
        return;
      }

      const request = indexedDB.open('GeoGuardDB', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['routes', 'locations'], 'readwrite');
        const store = transaction.objectStore('routes');
        store.put({ id: key, data: value });
        resolve();
      };
      request.onerror = reject;
    });
  }

  // Load from offline storage
  async loadOffline(key) {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        resolve(this.offlineStorage.get(key));
        return;
      }

      const request = indexedDB.open('GeoGuardDB', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['routes'], 'readonly');
        const store = transaction.objectStore('routes');
        const getRequest = store.get(key);
        getRequest.onsuccess = () => {
          resolve(getRequest.result?.data);
        };
      };
      request.onerror = reject;
    });
  }

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      items: Array.from(this.cache.keys())
    };
  }
}

export default PerformanceService;

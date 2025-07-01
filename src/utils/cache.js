// Cache utility for ChiroCare application
class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.cachePrefix = "chirocare_";
    this.defaultTTL = 15 * 60 * 1000; // 15 minutes in milliseconds
  }

  // Generate cache key
  generateKey(namespace, key, params = {}) {
    const paramString =
      Object.keys(params).length > 0 ? JSON.stringify(params) : "";
    return `${this.cachePrefix}${namespace}_${key}_${paramString}`;
  }

  // Memory cache operations
  setMemory(key, data, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.memoryCache.set(key, {
      data,
      expiresAt,
      timestamp: Date.now(),
    });
  }

  getMemory(key) {
    const cached = this.memoryCache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return cached.data;
  }

  deleteMemory(key) {
    this.memoryCache.delete(key);
  }

  // LocalStorage cache operations
  setLocal(key, data, ttl = this.defaultTTL) {
    try {
      const expiresAt = Date.now() + ttl;
      const cacheData = {
        data,
        expiresAt,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Failed to set localStorage cache:", error);
    }
  }

  getLocal(key) {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const parsedCache = JSON.parse(cached);
      if (Date.now() > parsedCache.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }

      return parsedCache.data;
    } catch (error) {
      console.warn("Failed to get localStorage cache:", error);
      return null;
    }
  }

  deleteLocal(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to delete localStorage cache:", error);
    }
  }

  // Combined cache operations (checks memory first, then localStorage)
  get(namespace, key, params = {}) {
    const cacheKey = this.generateKey(namespace, key, params);

    // Check memory cache first (faster)
    let data = this.getMemory(cacheKey);
    if (data) return data;

    // Check localStorage cache
    data = this.getLocal(cacheKey);
    if (data) {
      // Restore to memory cache for faster access
      this.setMemory(cacheKey, data);
      return data;
    }

    return null;
  }

  set(namespace, key, data, params = {}, ttl = this.defaultTTL) {
    const cacheKey = this.generateKey(namespace, key, params);

    // Set in both memory and localStorage
    this.setMemory(cacheKey, data, ttl);
    this.setLocal(cacheKey, data, ttl);
  }

  delete(namespace, key, params = {}) {
    const cacheKey = this.generateKey(namespace, key, params);
    this.deleteMemory(cacheKey);
    this.deleteLocal(cacheKey);
  }

  // Clear all cache for a namespace
  clearNamespace(namespace) {
    const prefix = `${this.cachePrefix}${namespace}_`;

    // Clear memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear localStorage cache
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn("Failed to clear localStorage namespace:", error);
    }
  }

  // Clear all expired cache entries
  clearExpired() {
    const now = Date.now();

    // Clear expired memory cache
    for (const [key, value] of this.memoryCache.entries()) {
      if (now > value.expiresAt) {
        this.memoryCache.delete(key);
      }
    }

    // Clear expired localStorage cache
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.cachePrefix)) {
          try {
            const cached = JSON.parse(localStorage.getItem(key));
            if (now > cached.expiresAt) {
              keysToRemove.push(key);
            }
          } catch (error) {
            // Invalid cache entry, remove it
            keysToRemove.push(key);
          }
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn("Failed to clear expired localStorage cache:", error);
    }
  }

  // Get cache statistics
  getStats() {
    const memorySize = this.memoryCache.size;
    let localStorageSize = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.cachePrefix)) {
          localStorageSize++;
        }
      }
    } catch (error) {
      console.warn("Failed to get localStorage stats:", error);
    }

    return {
      memory: {
        entries: memorySize,
        size: `${memorySize} entries`,
      },
      localStorage: {
        entries: localStorageSize,
        size: `${localStorageSize} entries`,
      },
    };
  }

  // Clear all cache
  clearAll() {
    this.memoryCache.clear();

    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.cachePrefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn("Failed to clear all localStorage cache:", error);
    }
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

// Cache time constants
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 15 * 60 * 1000, // 15 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
  WEEK: 7 * 24 * 60 * 60 * 1000, // 1 week
};

// Cache namespaces
export const CACHE_NAMESPACES = {
  BLOG: "blog",
  APPOINTMENTS: "appointments",
  DOCTORS: "doctors",
  REPORTS: "reports",
  USER: "user",
  SETTINGS: "settings",
  CATEGORIES: "categories",
};

// Higher-order function to add caching to API calls
export const withCache = (
  namespace,
  key,
  apiCall,
  params = {},
  ttl = CACHE_DURATION.MEDIUM,
) => {
  return async (...args) => {
    // Try to get from cache first
    const cached = cacheManager.get(namespace, key, params);
    if (cached) {
      return cached;
    }

    // If not in cache, make API call
    try {
      const result = await apiCall(...args);

      // Cache the result
      cacheManager.set(namespace, key, result, params, ttl);

      return result;
    } catch (error) {
      console.error(`API call failed for ${namespace}:${key}:`, error);
      throw error;
    }
  };
};

// Utility functions for common cache operations
export const cacheUtils = {
  // Blog cache utilities
  blog: {
    getPosts: (params) =>
      cacheManager.get(CACHE_NAMESPACES.BLOG, "posts", params),
    setPosts: (data, params, ttl = CACHE_DURATION.MEDIUM) =>
      cacheManager.set(CACHE_NAMESPACES.BLOG, "posts", data, params, ttl),
    getPost: (slug) =>
      cacheManager.get(CACHE_NAMESPACES.BLOG, "post", { slug }),
    setPost: (slug, data, ttl = CACHE_DURATION.LONG) =>
      cacheManager.set(CACHE_NAMESPACES.BLOG, "post", data, { slug }, ttl),
    clearAll: () => cacheManager.clearNamespace(CACHE_NAMESPACES.BLOG),
  },

  // Appointments cache utilities
  appointments: {
    getList: (params) =>
      cacheManager.get(CACHE_NAMESPACES.APPOINTMENTS, "list", params),
    setList: (data, params, ttl = CACHE_DURATION.SHORT) =>
      cacheManager.set(
        CACHE_NAMESPACES.APPOINTMENTS,
        "list",
        data,
        params,
        ttl,
      ),
    getAvailability: (doctorId, date) =>
      cacheManager.get(CACHE_NAMESPACES.APPOINTMENTS, "availability", {
        doctorId,
        date,
      }),
    setAvailability: (doctorId, date, data, ttl = CACHE_DURATION.SHORT) =>
      cacheManager.set(
        CACHE_NAMESPACES.APPOINTMENTS,
        "availability",
        data,
        { doctorId, date },
        ttl,
      ),
    clearAll: () => cacheManager.clearNamespace(CACHE_NAMESPACES.APPOINTMENTS),
  },

  // Doctors cache utilities
  doctors: {
    getList: (params) =>
      cacheManager.get(CACHE_NAMESPACES.DOCTORS, "list", params),
    setList: (data, params, ttl = CACHE_DURATION.LONG) =>
      cacheManager.set(CACHE_NAMESPACES.DOCTORS, "list", data, params, ttl),
    clearAll: () => cacheManager.clearNamespace(CACHE_NAMESPACES.DOCTORS),
  },

  // User data cache utilities
  user: {
    getProfile: (userId) =>
      cacheManager.get(CACHE_NAMESPACES.USER, "profile", { userId }),
    setProfile: (userId, data, ttl = CACHE_DURATION.MEDIUM) =>
      cacheManager.set(CACHE_NAMESPACES.USER, "profile", data, { userId }, ttl),
    clearAll: () => cacheManager.clearNamespace(CACHE_NAMESPACES.USER),
  },

  // General utilities
  clearAll: () => cacheManager.clearAll(),
  clearExpired: () => cacheManager.clearExpired(),
  clearNamespace: (namespace) => cacheManager.clearNamespace(namespace),
  getStats: () => cacheManager.getStats(),
};

// Auto-cleanup expired cache every 10 minutes
setInterval(
  () => {
    cacheManager.clearExpired();
  },
  10 * 60 * 1000,
);

export default cacheManager;

import { useState, useEffect, useCallback, useRef } from 'react';
import { cacheUtils, CACHE_DURATION, CACHE_NAMESPACES } from '../utils/cache';
import { cacheActions } from '../store/store';

/**
 * Custom hook for cache management
 * Provides utilities for caching data, managing cache state, and performance optimization
 */
export const useCache = (namespace = 'default', defaultTTL = CACHE_DURATION.MEDIUM) => {
  const [cacheStats, setCacheStats] = useState({
    memory: { entries: 0 },
    localStorage: { entries: 0 }
  });
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  // Update cache stats
  const updateStats = useCallback(() => {
    if (!mountedRef.current) return;
    
    try {
      const stats = cacheUtils.getStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Failed to update cache stats:', error);
    }
  }, []);

  // Cache operations
  const cacheOperations = {
    // Get data from cache
    get: useCallback((key, params = {}) => {
      try {
        return cacheUtils.get(namespace, key, params);
      } catch (error) {
        console.error(`Failed to get cache for ${namespace}:${key}:`, error);
        return null;
      }
    }, [namespace]),

    // Set data in cache
    set: useCallback((key, data, params = {}, ttl = defaultTTL) => {
      try {
        cacheUtils.set(namespace, key, data, params, ttl);
        updateStats();
        return true;
      } catch (error) {
        console.error(`Failed to set cache for ${namespace}:${key}:`, error);
        return false;
      }
    }, [namespace, defaultTTL, updateStats]),

    // Delete specific cache entry
    delete: useCallback((key, params = {}) => {
      try {
        cacheUtils.delete(namespace, key, params);
        updateStats();
        return true;
      } catch (error) {
        console.error(`Failed to delete cache for ${namespace}:${key}:`, error);
        return false;
      }
    }, [namespace, updateStats]),

    // Clear all cache for current namespace
    clear: useCallback(async () => {
      setIsLoading(true);
      try {
        cacheUtils.clearNamespace(namespace);
        updateStats();
        return true;
      } catch (error) {
        console.error(`Failed to clear cache for namespace ${namespace}:`, error);
        return false;
      } finally {
        setIsLoading(false);
      }
    }, [namespace, updateStats]),

    // Clear all cache (all namespaces)
    clearAll: useCallback(async () => {
      setIsLoading(true);
      try {
        cacheUtils.clearAll();
        cacheActions.clearAllApiCache();
        updateStats();
        return true;
      } catch (error) {
        console.error('Failed to clear all cache:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    }, [updateStats]),

    // Clear expired entries
    clearExpired: useCallback(async () => {
      setIsLoading(true);
      try {
        cacheUtils.clearExpired();
        updateStats();
        return true;
      } catch (error) {
        console.error('Failed to clear expired cache:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    }, [updateStats]),

    // Check if data exists in cache
    has: useCallback((key, params = {}) => {
      try {
        const data = cacheUtils.get(namespace, key, params);
        return data !== null;
      } catch (error) {
        console.error(`Failed to check cache for ${namespace}:${key}:`, error);
        return false;
      }
    }, [namespace]),

    // Get cache statistics
    getStats: useCallback(() => {
      try {
        return {
          ...cacheUtils.getStats(),
          rtk: cacheActions.getCacheStats()
        };
      } catch (error) {
        console.error('Failed to get cache stats:', error);
        return { memory: { entries: 0 }, localStorage: { entries: 0 }, rtk: {} };
      }
    }, [])
  };

  // Initialize stats on mount
  useEffect(() => {
    updateStats();
    
    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
    };
  }, [updateStats]);

  return {
    ...cacheOperations,
    stats: cacheStats,
    isLoading,
    namespace
  };
};

/**
 * Hook for caching API responses with automatic invalidation
 */
export const useApiCache = (apiCall, cacheKey, params = {}, options = {}) => {
  const {
    namespace = 'api',
    ttl = CACHE_DURATION.MEDIUM,
    enabled = true,
    refetchOnMount = false,
    staleTime = 0
  } = options;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const cache = useCache(namespace, ttl);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = cache.get(cacheKey, params);
        if (cached) {
          const cacheAge = Date.now() - cached.timestamp;
          if (cacheAge < staleTime) {
            setData(cached.data);
            setLastFetched(new Date(cached.timestamp));
            setIsLoading(false);
            return cached.data;
          }
        }
      }

      // Fetch from API
      const result = await apiCall(params);
      
      // Cache the result
      const cacheData = {
        data: result,
        timestamp: Date.now()
      };
      
      cache.set(cacheKey, cacheData, params, ttl);
      setData(result);
      setLastFetched(new Date());
      
      return result;
    } catch (err) {
      setError(err);
      
      // Try to return stale cache data on error
      const cached = cache.get(cacheKey, params);
      if (cached) {
        setData(cached.data);
        setLastFetched(new Date(cached.timestamp));
        return cached.data;
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, cacheKey, params, enabled, staleTime, cache, ttl]);

  // Auto-fetch on mount or when dependencies change
  useEffect(() => {
    if (enabled && (refetchOnMount || !data)) {
      fetchData();
    }
  }, [fetchData, enabled, refetchOnMount, data]);

  const refetch = useCallback(() => fetchData(true), [fetchData]);
  
  const invalidate = useCallback(() => {
    cache.delete(cacheKey, params);
    setData(null);
    setLastFetched(null);
  }, [cache, cacheKey, params]);

  return {
    data,
    isLoading,
    error,
    lastFetched,
    refetch,
    invalidate,
    fetchData
  };
};

/**
 * Hook for managing cached lists with pagination
 */
export const useCachedList = (fetchFunction, cacheKey, options = {}) => {
  const {
    namespace = 'lists',
    pageSize = 10,
    ttl = CACHE_DURATION.SHORT
  } = options;

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const cache = useCache(namespace, ttl);

  const loadPage = useCallback(async (pageNum = 1, append = false) => {
    setIsLoading(true);
    
    try {
      const cacheKeyWithPage = `${cacheKey}_page_${pageNum}`;
      
      // Check cache first
      let pageData = cache.get(cacheKeyWithPage);
      
      if (!pageData) {
        // Fetch from API
        pageData = await fetchFunction({ page: pageNum, limit: pageSize });
        cache.set(cacheKeyWithPage, pageData, {}, ttl);
      }

      if (append && pageNum > 1) {
        setItems(prev => [...prev, ...pageData.items]);
      } else {
        setItems(pageData.items);
      }

      setHasMore(pageData.hasMore || pageData.items.length === pageSize);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load page:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, cacheKey, pageSize, cache, ttl]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadPage(page + 1, true);
    }
  }, [loadPage, page, isLoading, hasMore]);

  const refresh = useCallback(() => {
    // Clear cache for all pages
    for (let i = 1; i <= page; i++) {
      cache.delete(`${cacheKey}_page_${i}`);
    }
    loadPage(1, false);
  }, [cache, cacheKey, page, loadPage]);

  // Load first page on mount
  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  return {
    items,
    isLoading,
    hasMore,
    page,
    loadMore,
    refresh,
    loadPage
  };
};

/**
 * Hook for caching form data temporarily
 */
export const useFormCache = (formId, initialData = {}) => {
  const cache = useCache('forms', CACHE_DURATION.LONG);
  const [formData, setFormData] = useState(() => {
    const cached = cache.get('data', { formId });
    return cached || initialData;
  });

  const updateFormData = useCallback((updates) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      cache.set('data', newData, { formId }, CACHE_DURATION.LONG);
      return newData;
    });
  }, [cache, formId]);

  const clearFormCache = useCallback(() => {
    cache.delete('data', { formId });
    setFormData(initialData);
  }, [cache, formId, initialData]);

  const saveToCache = useCallback(() => {
    cache.set('data', formData, { formId }, CACHE_DURATION.LONG);
  }, [cache, formData, formId]);

  return {
    formData,
    updateFormData,
    clearFormCache,
    saveToCache,
    setFormData
  };
};

export default useCache; 
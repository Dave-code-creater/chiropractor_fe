import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Trash2, 
  RefreshCw, 
  Database, 
  HardDrive, 
  Activity, 
  Info,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { cacheUtils, CACHE_DURATION, CACHE_NAMESPACES } from '../utils/cache';
import { cacheActions } from '../store/store';

const CacheManager = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState({
    memory: { entries: 0, size: '0 entries' },
    localStorage: { entries: 0, size: '0 entries' }
  });
  const [rtqStats, setRtqStats] = useState({});
  const [isClearing, setIsClearing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Update stats periodically
  useEffect(() => {
    const updateStats = () => {
      setStats(cacheUtils.getStats());
      setRtqStats(cacheActions.getCacheStats());
      setLastUpdated(new Date());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      // Clear custom cache
      cacheUtils.clearAll();
      
      // Clear RTK Query cache
      cacheActions.clearAllApiCache();
      
      // Update stats
      setStats(cacheUtils.getStats());
      setRtqStats(cacheActions.getCacheStats());
      
      toast.success('All cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      toast.error('Failed to clear cache');
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearNamespace = async (namespace) => {
    try {
      cacheUtils.clearNamespace(namespace);
      setStats(cacheUtils.getStats());
      toast.success(`${namespace} cache cleared`);
    } catch (error) {
      console.error(`Failed to clear ${namespace} cache:`, error);
      toast.error(`Failed to clear ${namespace} cache`);
    }
  };

  const handleClearExpired = async () => {
    try {
      cacheUtils.clearExpired();
      setStats(cacheUtils.getStats());
      toast.success('Expired cache entries cleared');
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
      toast.error('Failed to clear expired cache');
    }
  };

  const handlePrefetchData = async () => {
    try {
      cacheActions.prefetchCommonData();
      toast.success('Common data prefetching initiated');
    } catch (error) {
      console.error('Failed to prefetch data:', error);
      toast.error('Failed to prefetch data');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageUsage = () => {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('chirocare_')) {
          totalSize += localStorage[key].length;
        }
      }
      return formatBytes(totalSize);
    } catch (error) {
      return 'Unable to calculate';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-600" />
                Cache Manager
              </h2>
              <p className="text-gray-600 mt-1">
                Monitor and manage application caching
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="memory">Memory Cache</TabsTrigger>
              <TabsTrigger value="storage">Local Storage</TabsTrigger>
              <TabsTrigger value="rtk">RTK Query</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-600" />
                      Memory Cache
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.memory.entries}</div>
                    <p className="text-xs text-gray-600">Active entries</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-blue-600" />
                      Local Storage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.localStorage.entries}</div>
                    <p className="text-xs text-gray-600">{getStorageUsage()}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Database className="w-4 h-4 text-purple-600" />
                      RTK Query
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.values(rtqStats).reduce((sum, api) => sum + api.queries, 0)}
                    </div>
                    <p className="text-xs text-gray-600">Cached queries</p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </AlertDescription>
              </Alert>

              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleClearAll}
                  disabled={isClearing}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isClearing ? 'Clearing...' : 'Clear All Cache'}
                </Button>
                
                <Button 
                  onClick={handleClearExpired}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear Expired
                </Button>
                
                <Button 
                  onClick={handlePrefetchData}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  Prefetch Common Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="memory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Memory Cache Statistics</CardTitle>
                  <CardDescription>
                    Fast in-memory cache for frequently accessed data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Entries:</span>
                      <Badge variant="secondary">{stats.memory.entries}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Cache by Namespace:</h4>
                      {Object.values(CACHE_NAMESPACES).map(namespace => (
                        <div key={namespace} className="flex justify-between items-center">
                          <span className="capitalize">{namespace}:</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Active</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleClearNamespace(namespace)}
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="storage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Local Storage Cache</CardTitle>
                  <CardDescription>
                    Persistent cache stored in browser's local storage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Entries:</span>
                      <Badge variant="secondary">{stats.localStorage.entries}</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Storage Used:</span>
                      <Badge variant="secondary">{getStorageUsage()}</Badge>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Local storage cache persists between browser sessions and is automatically cleaned up when expired.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rtk" className="space-y-4">
              <div className="grid gap-4">
                {Object.entries(rtqStats).map(([apiName, stats]) => (
                  <Card key={apiName}>
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">
                        {apiName.replace('Api', ' API')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between">
                          <span>Cached Queries:</span>
                          <Badge variant="secondary">{stats.queries}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Mutations:</span>
                          <Badge variant="secondary">{stats.mutations}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {Object.keys(rtqStats).length === 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No RTK Query cache data available yet. Make some API calls to see statistics.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CacheManager; 
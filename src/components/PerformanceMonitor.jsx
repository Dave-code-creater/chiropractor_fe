import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Zap,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';

const PerformanceMonitor = ({ isVisible = false, onClose }) => {
  const [metrics, setMetrics] = useState({
    storePerformance: null,
    apiPerformance: null,
    systemHealth: null
  });
  const [isCollecting, setIsCollecting] = useState(false);

  // Collect performance metrics
  const collectMetrics = () => {
    setIsCollecting(true);
    
    try {
      // Store performance metrics
      const storeMetrics = window.storePerformance ? {
        slowUpdates: window.storePerformance.getSlowUpdates(),
        cacheStats: window.storePerformance.getCacheStats(),
        serializabilityIssues: window.storePerformance.checkSerializability()
      } : null;

      // API performance metrics
      const apiMetrics = window.apiPerformance ? {
        stats: window.apiPerformance.getStats(),
        calls: window.apiPerformance.getCalls()
      } : null;

      // System health metrics
      const systemMetrics = {
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        } : null,
        timing: performance.timing ? {
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
        } : null,
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null
      };

      setMetrics({
        storePerformance: storeMetrics,
        apiPerformance: apiMetrics,
        systemHealth: systemMetrics
      });
    } catch (error) {
      console.error('Failed to collect performance metrics:', error);
    } finally {
      setIsCollecting(false);
    }
  };

  // Auto-refresh metrics
  useEffect(() => {
    if (isVisible) {
      collectMetrics();
      const interval = setInterval(collectMetrics, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Calculate health score
  const healthScore = useMemo(() => {
    let score = 100;
    
    // Deduct for slow store updates
    if (metrics.storePerformance?.slowUpdates?.length > 0) {
      score -= Math.min(metrics.storePerformance.slowUpdates.length * 5, 30);
    }
    
    // Deduct for API errors
    if (metrics.apiPerformance?.stats?.errorRate > 0) {
      score -= Math.min(metrics.apiPerformance.stats.errorRate, 40);
    }
    
    // Deduct for memory usage
    if (metrics.systemHealth?.memory) {
      const memoryUsage = (metrics.systemHealth.memory.used / metrics.systemHealth.memory.limit) * 100;
      if (memoryUsage > 80) score -= 20;
      else if (memoryUsage > 60) score -= 10;
    }
    
    return Math.max(score, 0);
  }, [metrics]);

  const getHealthColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthIcon = (score) => {
    if (score >= 90) return CheckCircle;
    if (score >= 70) return AlertTriangle;
    return AlertTriangle;
  };

  if (!isVisible) return null;

  const HealthIcon = getHealthIcon(healthScore);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Performance Monitor</h2>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={collectMetrics}
                disabled={isCollecting}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isCollecting ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* System Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HealthIcon className={`h-5 w-5 ${getHealthColor(healthScore)}`} />
                <span>System Health Score</span>
                <Badge variant={healthScore >= 90 ? 'default' : healthScore >= 70 ? 'secondary' : 'destructive'}>
                  {Math.round(healthScore)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={healthScore} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Overall system performance based on store updates, API calls, and memory usage
              </p>
            </CardContent>
          </Card>

          {/* Store Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span>Redux Store Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.storePerformance ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {metrics.storePerformance.slowUpdates?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Slow Updates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {Object.keys(metrics.storePerformance.cacheStats || {}).length}
                      </div>
                      <div className="text-sm text-gray-600">Cached APIs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {metrics.storePerformance.serializabilityIssues?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Serialization Issues</div>
                    </div>
                  </div>
                  
                  {metrics.storePerformance.slowUpdates?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recent Slow Updates</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {metrics.storePerformance.slowUpdates.slice(-5).map((update, index) => (
                          <div key={index} className="flex justify-between text-sm bg-yellow-50 p-2 rounded">
                            <span>Update #{update.updateNumber}</span>
                            <span className="text-yellow-700">{update.duration.toFixed(2)}ms</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Store performance monitoring not available</p>
              )}
            </CardContent>
          </Card>

          {/* API Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wifi className="h-5 w-5 text-blue-600" />
                <span>API Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.apiPerformance?.stats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {metrics.apiPerformance.stats.totalCalls}
                      </div>
                      <div className="text-sm text-gray-600">Total Calls</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {metrics.apiPerformance.stats.avgDuration}ms
                      </div>
                      <div className="text-sm text-gray-600">Avg Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {metrics.apiPerformance.stats.slowCalls}
                      </div>
                      <div className="text-sm text-gray-600">Slow Calls</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        metrics.apiPerformance.stats.errorRate > 10 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {metrics.apiPerformance.stats.errorRate}%
                      </div>
                      <div className="text-sm text-gray-600">Error Rate</div>
                    </div>
                  </div>
                  
                  {metrics.apiPerformance.calls?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recent API Calls</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {metrics.apiPerformance.calls.slice(-5).map((call, index) => (
                          <div key={index} className="flex justify-between text-sm bg-blue-50 p-2 rounded">
                            <span className="truncate">{call.endpoint}</span>
                            <div className="flex space-x-2">
                              <Badge variant={call.status >= 400 ? 'destructive' : 'default'}>
                                {call.status}
                              </Badge>
                              <span className="text-blue-700">{call.duration}ms</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">API performance monitoring not available</p>
              )}
            </CardContent>
          </Card>

          {/* System Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-600" />
                <span>System Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.systemHealth?.memory && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm text-gray-600">
                        {metrics.systemHealth.memory.used}MB / {metrics.systemHealth.memory.limit}MB
                      </span>
                    </div>
                    <Progress 
                      value={(metrics.systemHealth.memory.used / metrics.systemHealth.memory.limit) * 100} 
                      className="w-full"
                    />
                  </div>
                )}
                
                {metrics.systemHealth?.connection && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {metrics.systemHealth.connection.effectiveType}
                      </div>
                      <div className="text-sm text-gray-600">Connection Type</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {metrics.systemHealth.connection.downlink}Mbps
                      </div>
                      <div className="text-sm text-gray-600">Downlink</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {metrics.systemHealth.connection.rtt}ms
                      </div>
                      <div className="text-sm text-gray-600">Round Trip Time</div>
                    </div>
                  </div>
                )}
                
                {metrics.systemHealth?.timing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {metrics.systemHealth.timing.loadTime}ms
                      </div>
                      <div className="text-sm text-gray-600">Page Load Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {metrics.systemHealth.timing.domReady}ms
                      </div>
                      <div className="text-sm text-gray-600">DOM Ready Time</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 
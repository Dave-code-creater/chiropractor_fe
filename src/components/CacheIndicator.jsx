import React from "react";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Database, Wifi, WifiOff, Clock, CheckCircle } from "lucide-react";

const CacheIndicator = ({
  isFromCache = false,
  lastFetched = null,
  isLoading = false,
  error = null,
  size = "sm",
  showText = false,
  className = "",
}) => {
  const getIcon = () => {
    if (isLoading) return <Clock className="w-3 h-3 animate-spin" />;
    if (error) return <WifiOff className="w-3 h-3" />;
    if (isFromCache) return <Database className="w-3 h-3" />;
    return <Wifi className="w-3 h-3" />;
  };

  const getVariant = () => {
    if (isLoading) return "secondary";
    if (error) return "destructive";
    if (isFromCache) return "default";
    return "secondary";
  };

  const getText = () => {
    if (isLoading) return "Loading...";
    if (error) return "Error";
    if (isFromCache) return "Cached";
    return "Live";
  };

  const getTooltipContent = () => {
    if (isLoading) return "Loading data...";
    if (error) return `Error: ${error.message || "Failed to load data"}`;
    if (isFromCache) {
      const timeAgo = lastFetched ? formatTimeAgo(lastFetched) : "Unknown";
      return `Data loaded from cache (${timeAgo})`;
    }
    return "Data loaded from server";
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={getVariant()}
            className={`inline-flex items-center gap-1 ${className}`}
            size={size}
          >
            {getIcon()}
            {showText && <span className="text-xs">{getText()}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Cache status component for more detailed information
export const CacheStatus = ({ stats, namespace = "all", className = "" }) => {
  if (!stats) return null;

  const getTotalEntries = () => {
    return (stats.memory?.entries || 0) + (stats.localStorage?.entries || 0);
  };

  const getStatusColor = () => {
    const total = getTotalEntries();
    if (total === 0) return "text-gray-500";
    if (total < 10) return "text-green-600";
    if (total < 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Database className="w-4 h-4 text-blue-600" />
      <span className="text-gray-600">Cache:</span>
      <span className={getStatusColor()}>{getTotalEntries()} entries</span>
      {namespace !== "all" && (
        <Badge variant="outline" className="text-xs">
          {namespace}
        </Badge>
      )}
    </div>
  );
};

// Performance indicator component
export const PerformanceIndicator = ({
  loadTime,
  isFromCache = false,
  className = "",
}) => {
  const getPerformanceColor = () => {
    if (isFromCache) return "text-green-600";
    if (loadTime < 500) return "text-green-600";
    if (loadTime < 1000) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = () => {
    if (isFromCache) return <Database className="w-3 h-3" />;
    if (loadTime < 500) return <CheckCircle className="w-3 h-3" />;
    if (loadTime < 1000) return <Clock className="w-3 h-3" />;
    return <WifiOff className="w-3 h-3" />;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center gap-1 text-xs ${getPerformanceColor()} ${className}`}
          >
            {getPerformanceIcon()}
            <span>{isFromCache ? "Cached" : `${loadTime}ms`}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isFromCache
              ? "Data loaded from cache (instant)"
              : `Load time: ${loadTime}ms`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Cache health indicator
export const CacheHealthIndicator = ({ hitRate = 0, className = "" }) => {
  const getHealthColor = () => {
    if (hitRate >= 0.8) return "text-green-600";
    if (hitRate >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthText = () => {
    if (hitRate >= 0.8) return "Excellent";
    if (hitRate >= 0.6) return "Good";
    if (hitRate >= 0.4) return "Fair";
    return "Poor";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center gap-1 text-xs ${getHealthColor()} ${className}`}
          >
            <Database className="w-3 h-3" />
            <span>{Math.round(hitRate * 100)}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Cache hit rate: {getHealthText()} ({Math.round(hitRate * 100)}%)
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CacheIndicator;

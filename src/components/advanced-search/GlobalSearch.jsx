import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  Clock,
  User,
  CalendarIcon,
  FileText,
  MessageSquare,
  Star,
  X,
  History,
  Bookmark,
  TrendingUp,
  MapPin,
  Activity,
} from "lucide-react";

const GlobalSearch = ({ onResultSelect, userRole: _userRole = "admin" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    type: "all",
    dateRange: "all",
    status: "all",
    priority: "all",
    assignedTo: "all",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sample data for search results
  const [sampleData] = useState({
    patients: [
      {
        id: "PAT-001",
        type: "patient",
        title: "John Smith",
        subtitle: "john.smith@email.com",
        description: "Age: 45, Last visit: 2 days ago",
        status: "active",
        priority: "normal",
        tags: ["chronic pain", "back injury"],
        lastUpdated: new Date("2025-01-18"),
        assignedTo: "Dr. Johnson",
        phone: "+1-555-0123",
        location: "New York, NY",
      },
      {
        id: "PAT-002",
        type: "patient",
        title: "Sarah Johnson",
        subtitle: "sarah.johnson@email.com",
        description: "Age: 32, Last visit: 1 week ago",
        status: "active",
        priority: "high",
        tags: ["migraine", "follow-up"],
        lastUpdated: new Date("2025-01-15"),
        assignedTo: "Dr. Smith",
        phone: "+1-555-0124",
        location: "Los Angeles, CA",
      },
    ],
    appointments: [
      {
        id: "APT-001",
        type: "appointment",
        title: "John Smith - Initial Consultation",
        subtitle: "Tomorrow, 2:00 PM",
        description: "Back pain assessment and treatment planning",
        status: "scheduled",
        priority: "high",
        tags: ["initial", "back pain"],
        lastUpdated: new Date("2025-01-19"),
        assignedTo: "Dr. Johnson",
        duration: "60 minutes",
        location: "Room 102",
      },
      {
        id: "APT-002",
        type: "appointment",
        title: "Sarah Johnson - Follow-up",
        subtitle: "Next Monday, 10:00 AM",
        description: "Progress check and adjustment",
        status: "confirmed",
        priority: "normal",
        tags: ["follow-up", "adjustment"],
        lastUpdated: new Date("2025-01-18"),
        assignedTo: "Dr. Smith",
        duration: "30 minutes",
        location: "Room 101",
      },
    ],
    clinicalNotes: [
      // Clinical notes will be loaded from API
    ],
    reports: [
      {
        id: "RPT-001",
        type: "report",
        title: "Monthly Patient Report",
        subtitle: "Generated yesterday",
        description: "Comprehensive overview of patient outcomes for January",
        status: "completed",
        priority: "normal",
        tags: ["monthly", "outcomes"],
        lastUpdated: new Date("2025-01-18"),
        assignedTo: "System",
        reportType: "Analytics",
        pageCount: 15,
      },
    ],
    messages: [
      {
        id: "MSG-001",
        type: "message",
        title: "Message from John Smith",
        subtitle: "Received 2 hours ago",
        description: "Question about post-treatment exercises",
        status: "unread",
        priority: "normal",
        tags: ["question", "exercises"],
        lastUpdated: new Date("2025-01-19"),
        assignedTo: "Dr. Johnson",
        messageType: "Patient Inquiry",
      },
    ],
  });

  // Combine all data for search
  const allData = useMemo(
    () => [
      ...sampleData.patients,
      ...sampleData.appointments,
      ...sampleData.clinicalNotes,
      ...sampleData.reports,
      ...sampleData.messages,
    ],
    [sampleData],
  );

  // Search function
  const performSearch = useCallback(
    (query, filters = activeFilters) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);

      // Simulate API delay
      setTimeout(() => {
        let results = allData.filter((item) => {
          const matchesQuery =
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some((tag) =>
              tag.toLowerCase().includes(query.toLowerCase()),
            );

          const matchesType =
            filters.type === "all" || item.type === filters.type;
          const matchesStatus =
            filters.status === "all" || item.status === filters.status;
          const matchesPriority =
            filters.priority === "all" || item.priority === filters.priority;
          const matchesAssignedTo =
            filters.assignedTo === "all" ||
            item.assignedTo.includes(filters.assignedTo);

          // Date range filter
          let matchesDateRange = true;
          if (filters.dateRange !== "all") {
            const now = new Date();
            const itemDate = new Date(item.lastUpdated);
            switch (filters.dateRange) {
              case "today":
                matchesDateRange =
                  itemDate.toDateString() === now.toDateString();
                break;
              case "week":
                matchesDateRange = now - itemDate <= 7 * 24 * 60 * 60 * 1000;
                break;
              case "month":
                matchesDateRange = now - itemDate <= 30 * 24 * 60 * 60 * 1000;
                break;
            }
          }

          return (
            matchesQuery &&
            matchesType &&
            matchesStatus &&
            matchesPriority &&
            matchesAssignedTo &&
            matchesDateRange
          );
        });

        // Sort by relevance and date
        results.sort((a, b) => {
          // Prioritize exact title matches
          const aExactMatch = a.title
            .toLowerCase()
            .includes(query.toLowerCase());
          const bExactMatch = b.title
            .toLowerCase()
            .includes(query.toLowerCase());
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;

          // Then by date
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        });

        setSearchResults(results);
        setIsSearching(false);

        // Add to search history
        if (query.trim() && !searchHistory.includes(query.trim())) {
          setSearchHistory((prev) => [query.trim(), ...prev.slice(0, 9)]);
        }
      }, 300);
    },
    [allData, activeFilters],
  );

  // Handle search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, performSearch]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    performSearch(searchQuery, newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      type: "all",
      dateRange: "all",
      status: "all",
      priority: "all",
      assignedTo: "all",
    };
    setActiveFilters(clearedFilters);
    performSearch(searchQuery, clearedFilters);
  };

  const saveCurrentSearch = () => {
    if (searchQuery.trim()) {
      const searchToSave = {
        id: Date.now(),
        query: searchQuery,
        filters: activeFilters,
        resultsCount: searchResults.length,
        timestamp: new Date(),
      };
      setSavedSearches((prev) => [searchToSave, ...prev.slice(0, 9)]);
    }
  };

  const loadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch.query);
    setActiveFilters(savedSearch.filters);
    performSearch(savedSearch.query, savedSearch.filters);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "patient":
        return User;
      case "appointment":
        return CalendarIcon;
      case "clinical-note":
        return FileText;
      case "report":
        return Activity;
      case "message":
        return MessageSquare;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "scheduled":
      case "completed":
        return "default";
      case "confirmed":
        return "secondary";
      case "unread":
      case "pending":
        return "destructive";
      case "cancelled":
        return "outline";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "normal":
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const SearchResultItem = ({ result, onClick }) => {
    const IconComponent = getTypeIcon(result.type);

    return (
      <div
        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => onClick(result)}
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <IconComponent className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {result.title}
              </h3>
              <Badge variant={getStatusColor(result.status)} size="sm">
                {result.status}
              </Badge>
              <Badge variant={getPriorityColor(result.priority)} size="sm">
                {result.priority}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">{result.subtitle}</p>
            <p className="text-xs text-gray-500 mb-2">{result.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {result.lastUpdated.toLocaleDateString()}
                </span>
                {result.assignedTo && (
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {result.assignedTo}
                  </span>
                )}
                {result.location && (
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {result.location}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {result.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const activeFilterCount = Object.values(activeFilters).filter(
    (value) => value !== "all",
  ).length;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search patients, appointments, notes, reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {searchQuery && (
          <Button variant="outline" onClick={saveCurrentSearch}>
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Advanced Filters
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <Select
                  value={activeFilters.type}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="patient">Patients</SelectItem>
                    <SelectItem value="appointment">Appointments</SelectItem>
                    <SelectItem value="clinical-note">
                      Clinical Notes
                    </SelectItem>
                    <SelectItem value="report">Reports</SelectItem>
                    <SelectItem value="message">Messages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Date Range</Label>
                <Select
                  value={activeFilters.dateRange}
                  onValueChange={(value) =>
                    handleFilterChange("dateRange", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={activeFilters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <Select
                  value={activeFilters.priority}
                  onValueChange={(value) =>
                    handleFilterChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Assigned To</Label>
                <Select
                  value={activeFilters.assignedTo}
                  onValueChange={(value) =>
                    handleFilterChange("assignedTo", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Healthcare Professionals</SelectItem>
                    <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                    <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Search Results
                {searchResults.length > 0 && (
                  <Badge variant="secondary">
                    {searchResults.length} result
                    {searchResults.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </CardTitle>
              {searchQuery && (
                <CardDescription>
                  Results for "{searchQuery}"
                  {activeFilterCount > 0 &&
                    ` with ${activeFilterCount} filter${activeFilterCount !== 1 ? "s" : ""} applied`}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <SearchResultItem
                        key={result.id}
                        result={result}
                        onClick={onResultSelect}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : searchQuery ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Start typing to search</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Search across patients, appointments, notes, and more
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Search History */}
          {searchHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <History className="h-4 w-4 mr-2" />
                  Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2">
                  {searchHistory.slice(0, 5).map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2"
                      onClick={() => setSearchQuery(query)}
                    >
                      <Clock className="h-3 w-3 mr-2 text-gray-400" />
                      <span className="truncate">{query}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saved Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2">
                  {savedSearches.slice(0, 5).map((saved) => (
                    <Button
                      key={saved.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2"
                      onClick={() => loadSavedSearch(saved)}
                    >
                      <Star className="h-3 w-3 mr-2 text-yellow-500" />
                      <div className="truncate">
                        <div className="font-medium">{saved.query}</div>
                        <div className="text-xs text-gray-500">
                          {saved.resultsCount} results
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Quick Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSearchQuery("");
                    handleFilterChange("type", "appointment");
                    handleFilterChange("status", "scheduled");
                  }}
                >
                  Today's Appointments
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSearchQuery("");
                    handleFilterChange("type", "patient");
                    handleFilterChange("status", "active");
                  }}
                >
                  Active Patients
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSearchQuery("");
                    handleFilterChange("type", "message");
                    handleFilterChange("status", "unread");
                  }}
                >
                  Unread Messages
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSearchQuery("");
                    handleFilterChange("priority", "high");
                  }}
                >
                  High Priority Items
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;

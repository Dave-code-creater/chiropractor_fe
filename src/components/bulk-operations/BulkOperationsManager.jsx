import { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Package,
  Users,
  Calendar,
  FileText,
  Mail,
  MessageSquare,
  Download,
  Trash2,
  Edit,
  Send,
  CheckCircle,
  AlertTriangle,
  X,
  Play,
  Pause,
  Filter,
  Settings,
  Clock,
  Activity,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";
import { useGetAppointmentsQuery } from "@/api/services/appointmentApi";
import { useGetBlogPostsQuery } from "@/api/services/blogApi";

const BulkOperationsManager = () => {
  const [selectedOperation, setSelectedOperation] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [operationProgress, setOperationProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [operationResults, setOperationResults] = useState(null);
  const [filterOptions] = useState({
    type: "all",
    status: "all",
    dateRange: "all",
  });

  const [bulkOperations] = useState([
    {
      id: "update-status",
      name: "Update Status",
      description: "Change status for multiple records",
      category: "update",
      icon: Edit,
      supportedTypes: ["patients", "appointments", "reports"],
      requiresInput: true,
      inputType: "select",
      inputOptions: ["active", "inactive", "pending", "completed", "cancelled"],
    },
    {
      id: "send-notifications",
      name: "Send Notifications",
      description: "Send email or SMS notifications to multiple recipients",
      category: "communication",
      icon: Mail,
      supportedTypes: ["patients", "appointments"],
      requiresInput: true,
      inputType: "textarea",
      inputPlaceholder: "Enter notification message...",
    },
    {
      id: "export-data",
      name: "Export Data",
      description: "Export selected records to CSV or PDF",
      category: "export",
      icon: Download,
      supportedTypes: ["patients", "appointments", "reports", "clinical-notes"],
      requiresInput: true,
      inputType: "select",
      inputOptions: ["CSV", "PDF", "Excel"],
    },
    {
      id: "delete-records",
      name: "Delete Records",
      description: "Permanently delete multiple records",
      category: "delete",
      icon: Trash2,
      supportedTypes: ["patients", "appointments", "reports"],
      requiresInput: false,
      dangerous: true,
    },
    {
      id: "assign-doctor",
      name: "Assign Doctor",
      description:
        "Assign or reassign doctor to multiple patients/appointments",
      category: "assignment",
      icon: Users,
      supportedTypes: ["patients", "appointments"],
      requiresInput: true,
      inputType: "select",
      inputOptions: ["Dr. Johnson", "Dr. Smith", "Dr. Wilson"],
    },
    {
      id: "reschedule-appointments",
      name: "Reschedule Appointments",
      description: "Reschedule multiple appointments to new dates/times",
      category: "scheduling",
      icon: Calendar,
      supportedTypes: ["appointments"],
      requiresInput: true,
      inputType: "datetime",
    },
    {
      id: "generate-reports",
      name: "Generate Reports",
      description: "Generate reports for multiple patients",
      category: "reports",
      icon: FileText,
      supportedTypes: ["patients"],
      requiresInput: true,
      inputType: "select",
      inputOptions: ["Patient Summary", "Treatment Plan", "Progress Report"],
    },
    {
      id: "send-reminders",
      name: "Send Reminders",
      description: "Send appointment reminders to multiple patients",
      category: "communication",
      icon: MessageSquare,
      supportedTypes: ["appointments"],
      requiresInput: true,
      inputType: "select",
      inputOptions: ["24 hours before", "2 hours before", "1 hour before"],
    },
  ]);

  const [currentTab, setCurrentTab] = useState("patients");

  const { data: appointmentsData, isLoading: appointmentsLoading } = useGetAppointmentsQuery(
    {},
    { skip: currentTab !== "appointments" }
  );

  const { data: postsData, isLoading: postsLoading } = useGetBlogPostsQuery(
    { limit: 50 },
    { skip: currentTab !== "reports" }
  );

  const mockPatients = [
    {
      id: "PAT-001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      status: "active",
      assignedDoctor: "Dr. Johnson",
      lastVisit: "2025-01-15",
      category: "patients",
    },
    {
      id: "PAT-002",
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "+1-555-0124",
      status: "active",
      assignedDoctor: "Dr. Smith",
      lastVisit: "2025-01-12",
      category: "patients",
    },
  ];

  const getCurrentData = () => {
    switch (currentTab) {
      case "appointments":
        return appointmentsData?.appointments || appointmentsData || [];
      case "reports":
        return postsData?.posts || postsData || [];
      case "patients":
      default:
        return mockPatients;
    }
  };

  const currentData = getCurrentData();
  const _isLoading = appointmentsLoading || postsLoading;

  const availableOperations = useMemo(() => {
    return bulkOperations.filter((op) =>
      op.supportedTypes.includes(currentTab),
    );
  }, [bulkOperations, currentTab]);

  const processBulkOperation = useCallback(
    async (operationId, items, _inputValue = null) => {
      const operation = bulkOperations.find((op) => op.id === operationId);
      if (!operation || items.length === 0) return;

      setIsProcessing(true);
      setOperationProgress(0);
      setOperationResults(null);

      const results = {
        operation: operation.name,
        totalItems: items.length,
        successful: 0,
        failed: 0,
        errors: [],
        details: [],
      };

      try {
        for (let i = 0; i < items.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const item = items[i];
          const progress = ((i + 1) / items.length) * 100;
          setOperationProgress(progress);

          try {
            const success = Math.random() > 0.1;

            if (success) {
              results.successful++;
              results.details.push({
                id: item.id,
                name: item.name || item.patientName,
                status: "success",
                message: `${operation.name} completed successfully`,
              });
            } else {
              results.failed++;
              results.errors.push(
                `Failed to process ${item.name || item.patientName}: Simulated error`,
              );
              results.details.push({
                id: item.id,
                name: item.name || item.patientName,
                status: "error",
                message: "Processing failed",
              });
            }
          } catch (error) {
            results.failed++;
            results.errors.push(
              `Error processing ${item.name || item.patientName}: ${error.message}`,
            );
          }
        }

        setOperationResults(results);

        if (results.failed === 0) {
          toast.success(
            `${operation.name} completed successfully for all ${results.totalItems} items`,
          );
        } else {
          toast.warning(
            `${operation.name} completed with ${results.failed} failures out of ${results.totalItems} items`,
          );
        }
      } catch (error) {
        toast.error(`Bulk operation failed: ${error.message}`);
      } finally {
        setIsProcessing(false);
        setOperationProgress(0);
      }
    },
    [bulkOperations],
  );

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentData.map((item) => item.id));
    }
  }, [selectedItems, currentData]);

  const handleItemSelect = useCallback((itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  }, []);

  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      if (
        filterOptions.status !== "all" &&
        item.status !== filterOptions.status
      )
        return false;
      return true;
    });
  }, [currentData, filterOptions]);

  const selectedItemsData = useMemo(() => {
    return currentData.filter((item) => selectedItems.includes(item.id));
  }, [currentData, selectedItems]);

  const OperationCard = ({ operation }) => (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${selectedOperation === operation.id ? "ring-2 ring-blue-500" : ""
        } ${operation.dangerous ? "border-red-200" : ""}`}
      onClick={() => setSelectedOperation(operation.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${operation.dangerous ? "bg-red-100" : "bg-blue-100"
                }`}
            >
              <operation.icon
                className={`h-4 w-4 ${operation.dangerous ? "text-red-600" : "text-blue-600"
                  }`}
              />
            </div>
            <div>
              <CardTitle className="text-lg">{operation.name}</CardTitle>
              <CardDescription>{operation.description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline">{operation.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Supported types:</span>
          <div className="flex space-x-1">
            {operation.supportedTypes.slice(0, 2).map((type) => (
              <Badge key={type} variant="secondary" size="sm">
                {type}
              </Badge>
            ))}
            {operation.supportedTypes.length > 2 && (
              <Badge variant="secondary" size="sm">
                +{operation.supportedTypes.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BulkOperationPanel = () => {
    const [inputValue, setInputValue] = useState("");
    const operation = bulkOperations.find((op) => op.id === selectedOperation);

    if (!operation) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Select an operation to get started
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <operation.icon className="h-5 w-5" />
              {operation.name}
            </div>
            <Badge variant="outline">{operation.category}</Badge>
          </CardTitle>
          <CardDescription>{operation.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {operation.dangerous && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Dangerous Operation</AlertTitle>
              <AlertDescription>
                This operation cannot be undone. Please review your selection
                carefully.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <h4 className="font-medium">
              Selected Items ({selectedItems.length})
            </h4>
            {selectedItems.length > 0 ? (
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedItemsData.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                  >
                    <span>{item.name || item.patientName}</span>
                    <Badge variant="outline" size="sm">
                      {item.status}
                    </Badge>
                  </div>
                ))}
                {selectedItemsData.length > 10 && (
                  <div className="text-sm text-gray-500 text-center p-2">
                    +{selectedItemsData.length - 10} more items
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No items selected</p>
            )}
          </div>

          <Separator />

          {operation.requiresInput && (
            <div className="space-y-3">
              <Label>Operation Parameters</Label>
              {operation.inputType === "select" && (
                <Select value={inputValue} onValueChange={setInputValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option..." />
                  </SelectTrigger>
                  <SelectContent>
                    {operation.inputOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {operation.inputType === "textarea" && (
                <Textarea
                  placeholder={operation.inputPlaceholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={4}
                />
              )}
              {operation.inputType === "datetime" && (
                <Input
                  type="datetime-local"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              )}
            </div>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing...</span>
                <span>{Math.round(operationProgress)}%</span>
              </div>
              <Progress value={operationProgress} className="h-2" />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Button
              onClick={() =>
                processBulkOperation(
                  operation.id,
                  selectedItemsData,
                  inputValue,
                )
              }
              disabled={
                selectedItems.length === 0 ||
                isProcessing ||
                (operation.requiresInput && !inputValue)
              }
              className={
                operation.dangerous ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              {isProcessing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute Operation
                </>
              )}
            </Button>
            {isProcessing && (
              <Button variant="outline" onClick={() => setIsProcessing(false)}>
                <Pause className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const ResultsPanel = () => {
    if (!operationResults) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Operation Results
          </CardTitle>
          <CardDescription>
            {operationResults.operation} completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {operationResults.successful}
              </div>
              <div className="text-sm text-green-700">Successful</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {operationResults.failed}
              </div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {operationResults.totalItems}
              </div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
          </div>

          {operationResults.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Errors</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {operationResults.errors.map((error, index) => (
                  <div
                    key={index}
                    className="text-sm text-red-600 p-2 bg-red-50 rounded"
                  >
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Detailed Results</h4>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {operationResults.details.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                >
                  <span>{detail.name}</span>
                  <Badge
                    variant={
                      detail.status === "success" ? "default" : "destructive"
                    }
                    size="sm"
                  >
                    {detail.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={() => setOperationResults(null)}>
            <X className="h-4 w-4 mr-2" />
            Close Results
          </Button>
        </CardContent>
      </Card>
    );
  };

  const DataTable = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="capitalize">{currentTab}</CardTitle>
            <CardDescription>
              {selectedItems.length} of {filteredData.length} items selected
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedItems.length === currentData.length
                ? "Deselect All"
                : "Select All"}
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 ${selectedItems.includes(item.id)
                    ? "bg-blue-50 border-blue-200"
                    : ""
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleItemSelect(item.id)}
                  />
                  <div>
                    <div className="font-medium">
                      {item.name || item.patientName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentTab === "patients" &&
                        `${item.email} • ${item.assignedDoctor}`}
                      {currentTab === "appointments" &&
                        `${item.date} ${item.time} • ${item.doctor}`}
                      {currentTab === "reports" &&
                        `Generated: ${item.generatedDate} • ${item.size}`}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    item.status === "active" ||
                      item.status === "completed" ||
                      item.status === "confirmed"
                      ? "default"
                      : item.status === "pending" || item.status === "scheduled"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Bulk Operations Manager
          </h2>
          <p className="text-gray-600">
            Perform batch operations on multiple records efficiently
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{selectedItems.length}</div>
                <div className="text-sm text-gray-600">Selected Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {availableOperations.length}
                </div>
                <div className="text-sm text-gray-600">
                  Available Operations
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{filteredData.length}</div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {operationResults?.successful || 0}
                </div>
                <div className="text-sm text-gray-600">Last Success</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value={currentTab}>
              <DataTable />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Operations</CardTitle>
              <CardDescription>
                {availableOperations.length} operation
                {availableOperations.length !== 1 ? "s" : ""} available for{" "}
                {currentTab}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableOperations.map((operation) => (
                  <OperationCard key={operation.id} operation={operation} />
                ))}
              </div>
            </CardContent>
          </Card>

          <BulkOperationPanel />

          <ResultsPanel />
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsManager;

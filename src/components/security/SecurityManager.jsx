import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  Users,
  Activity,
  FileText,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
  Ban,
  UserCheck,
  Zap,
  Database,
  Wifi,
  Server,
} from "lucide-react";

const SecurityManager = () => {
  const [securityScore] = useState(85);
  const [activeThreats] = useState(2);
  const [auditLogs, setAuditLogs] = useState([]);
  const [accessAttempts, setAccessAttempts] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordComplexity: "high",
    loginAttempts: 5,
    auditLogging: true,
    dataEncryption: true,
    accessLogging: true,
    ipWhitelist: false,
    deviceTracking: true,
    automaticLogout: true,
  });

  const [sampleData] = useState({
    auditLogs: [
      {
        id: "LOG-001",
        timestamp: "2025-01-19T10:30:00Z",
        user: "Dr. Sarah Johnson",
        userId: "DOC-001",
        action: "Patient Record Access",
        resource: "Patient: John Smith (PAT-001)",
        ipAddress: "192.168.1.100",
        device: "Desktop - Chrome",
        location: "New York, NY",
        status: "success",
        riskLevel: "low",
        details: "Accessed patient medical history",
      },
      {
        id: "LOG-002",
        timestamp: "2025-01-19T10:25:00Z",
        user: "Admin User",
        userId: "ADM-001",
        action: "User Role Change",
        resource: "User: Jane Doe (USR-005)",
        ipAddress: "192.168.1.101",
        device: "Mobile - Safari",
        location: "Los Angeles, CA",
        status: "success",
        riskLevel: "medium",
        details: "Changed user role to Doctor",
      },
      {
        id: "LOG-003",
        timestamp: "2025-01-19T10:20:00Z",
        user: "Unknown",
        userId: null,
        action: "Failed Login Attempt",
        resource: "Login System",
        ipAddress: "203.45.67.89",
        device: "Desktop - Firefox",
        location: "Unknown Location",
        status: "failed",
        riskLevel: "high",
        details: "Multiple failed login attempts detected",
      },
      {
        id: "LOG-004",
        timestamp: "2025-01-19T10:15:00Z",
        user: "Dr. Michael Smith",
        userId: "DOC-002",
        action: "Report Generation",
        resource: "Patient Report: Sarah Wilson",
        ipAddress: "192.168.1.102",
        device: "Tablet - Chrome",
        location: "Chicago, IL",
        status: "success",
        riskLevel: "low",
        details: "Generated treatment progress report",
      },
      {
        id: "LOG-005",
        timestamp: "2025-01-19T10:10:00Z",
        user: "Team Member",
        userId: "STF-001",
        action: "Data Export",
        resource: "Patient Database",
        ipAddress: "192.168.1.103",
        device: "Desktop - Edge",
        location: "Miami, FL",
        status: "blocked",
        riskLevel: "high",
        details: "Export attempt blocked due to insufficient permissions",
      },
    ],
    accessAttempts: [
      {
        id: "ACC-001",
        timestamp: "2025-01-19T10:35:00Z",
        username: "dr.johnson",
        ipAddress: "192.168.1.100",
        location: "New York, NY",
        device: "Desktop - Chrome",
        status: "success",
        method: "2FA",
        duration: "45 minutes",
      },
      {
        id: "ACC-002",
        timestamp: "2025-01-19T10:20:00Z",
        username: "unknown_user",
        ipAddress: "203.45.67.89",
        location: "Unknown",
        device: "Desktop - Firefox",
        status: "failed",
        method: "password",
        attempts: 5,
      },
      {
        id: "ACC-003",
        timestamp: "2025-01-19T10:15:00Z",
        username: "admin",
        ipAddress: "192.168.1.101",
        location: "Los Angeles, CA",
        device: "Mobile - Safari",
        status: "success",
        method: "2FA",
        duration: "30 minutes",
      },
    ],
    threats: [
      {
        id: "THR-001",
        type: "Suspicious Login",
        description: "Multiple failed login attempts from unknown IP",
        severity: "high",
        status: "active",
        detectedAt: "2025-01-19T10:20:00Z",
        ipAddress: "203.45.67.89",
        affectedResource: "Login System",
      },
      {
        id: "THR-002",
        type: "Unusual Access Pattern",
        description: "User accessing system outside normal hours",
        severity: "medium",
        status: "investigating",
        detectedAt: "2025-01-19T02:30:00Z",
        ipAddress: "192.168.1.105",
        affectedResource: "Patient Records",
      },
    ],
  });

  useEffect(() => {
    setAuditLogs(sampleData.auditLogs);
    setAccessAttempts(sampleData.accessAttempts);
  }, [sampleData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        const newEvent = {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: "System Monitor",
          userId: "SYS-001",
          action: "Security Scan",
          resource: "System Health Check",
          ipAddress: "127.0.0.1",
          device: "Server",
          location: "Data Center",
          status: "success",
          riskLevel: "low",
          details: "Automated security scan completed",
        };

        setAuditLogs((prev) => [newEvent, ...prev.slice(0, 49)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const updateSecuritySetting = (key, value) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }));
    toast.success("Security setting updated");
  };

  const handleThreatAction = (threatId, action) => {
    toast.success(`Threat ${action} successfully`);
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "default";
      case "failed":
      case "blocked":
        return "destructive";
      case "investigating":
        return "secondary";
      default:
        return "outline";
    }
  };

  const SecurityOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{securityScore}%</div>
              <div className="text-sm text-gray-600">Security Score</div>
            </div>
          </div>
          <Progress value={securityScore} className="mt-2 h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <div className="text-2xl font-bold">{activeThreats}</div>
              <div className="text-sm text-gray-600">Active Threats</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{auditLogs.length}</div>
              <div className="text-sm text-gray-600">Audit Logs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">
                {accessAttempts.filter((a) => a.status === "success").length}
              </div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AuditLogTable = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              Real-time system activity monitoring
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        log.riskLevel === "high"
                          ? "bg-red-100"
                          : log.riskLevel === "medium"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                      }`}
                    >
                      {log.status === "success" ? (
                        <CheckCircle
                          className={`h-4 w-4 ${
                            log.riskLevel === "high"
                              ? "text-red-600"
                              : log.riskLevel === "medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{log.action}</span>
                        <Badge
                          variant={getRiskLevelColor(log.riskLevel)}
                          size="sm"
                        >
                          {log.riskLevel} risk
                        </Badge>
                        <Badge variant={getStatusColor(log.status)} size="sm">
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {log.details}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {log.user || "Unknown"}
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          {log.ipAddress}
                        </div>
                        <div className="flex items-center">
                          <Monitor className="h-3 w-3 mr-1" />
                          {log.device}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const SecuritySettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Security Configuration</CardTitle>
        <CardDescription>
          Manage system security settings and policies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Authentication & Access</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">
                    Require 2FA for all users
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    updateSecuritySetting("twoFactorAuth", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select
                  value={securitySettings.sessionTimeout.toString()}
                  onValueChange={(value) =>
                    updateSecuritySetting("sessionTimeout", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Password Complexity</Label>
                <Select
                  value={securitySettings.passwordComplexity}
                  onValueChange={(value) =>
                    updateSecuritySetting("passwordComplexity", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - 6+ characters</SelectItem>
                    <SelectItem value="medium">
                      Medium - 8+ chars, mixed case
                    </SelectItem>
                    <SelectItem value="high">
                      High - 12+ chars, symbols, numbers
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Login Attempts</Label>
                <Select
                  value={securitySettings.loginAttempts.toString()}
                  onValueChange={(value) =>
                    updateSecuritySetting("loginAttempts", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                    <SelectItem value="10">10 attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Data Protection & Monitoring</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit Logging</Label>
                  <p className="text-sm text-gray-500">
                    Log all system activities
                  </p>
                </div>
                <Switch
                  checked={securitySettings.auditLogging}
                  onCheckedChange={(checked) =>
                    updateSecuritySetting("auditLogging", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Encryption</Label>
                  <p className="text-sm text-gray-500">
                    Encrypt sensitive data at rest
                  </p>
                </div>
                <Switch
                  checked={securitySettings.dataEncryption}
                  onCheckedChange={(checked) =>
                    updateSecuritySetting("dataEncryption", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Access Logging</Label>
                  <p className="text-sm text-gray-500">
                    Log all data access attempts
                  </p>
                </div>
                <Switch
                  checked={securitySettings.accessLogging}
                  onCheckedChange={(checked) =>
                    updateSecuritySetting("accessLogging", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Device Tracking</Label>
                  <p className="text-sm text-gray-500">
                    Track user devices and locations
                  </p>
                </div>
                <Switch
                  checked={securitySettings.deviceTracking}
                  onCheckedChange={(checked) =>
                    updateSecuritySetting("deviceTracking", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>IP Whitelist</Label>
                  <p className="text-sm text-gray-500">
                    Restrict access to approved IPs
                  </p>
                </div>
                <Switch
                  checked={securitySettings.ipWhitelist}
                  onCheckedChange={(checked) =>
                    updateSecuritySetting("ipWhitelist", checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">HIPAA Compliance</h4>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>HIPAA Compliance Status</AlertTitle>
            <AlertDescription>
              Your system is configured to meet HIPAA requirements. All patient
              data is encrypted, access is logged, and audit trails are
              maintained.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Data Encryption</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                AES-256 encryption enabled
              </p>
            </div>

            <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Access Controls</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Role-based access implemented
              </p>
            </div>

            <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Audit Trails</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Complete activity logging
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ThreatMonitoring = () => (
    <Card>
      <CardHeader>
        <CardTitle>Threat Monitoring</CardTitle>
        <CardDescription>
          Active security threats and suspicious activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sampleData.threats.map((threat) => (
            <div
              key={threat.id}
              className="p-4 border border-red-200 bg-red-50 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{threat.type}</span>
                      <Badge variant="destructive" size="sm">
                        {threat.severity}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {threat.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {threat.description}
                    </p>
                    <div className="text-xs text-gray-600">
                      <span>
                        Detected: {new Date(threat.detectedAt).toLocaleString()}
                      </span>
                      {threat.ipAddress && (
                        <span> • IP: {threat.ipAddress}</span>
                      )}
                      <span> • Resource: {threat.affectedResource}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleThreatAction(threat.id, "investigate")}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Investigate
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleThreatAction(threat.id, "block")}
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Block
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const AccessAttempts = () => (
    <Card>
      <CardHeader>
        <CardTitle>Access Attempts</CardTitle>
        <CardDescription>
          Recent login attempts and session information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {accessAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        attempt.status === "success"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {attempt.status === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{attempt.username}</div>
                      <div className="text-sm text-gray-600">
                        {attempt.ipAddress} • {attempt.location} •{" "}
                        {attempt.device}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(attempt.timestamp).toLocaleString()}
                        {attempt.duration && ` • Session: ${attempt.duration}`}
                        {attempt.attempts && ` • ${attempt.attempts} attempts`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(attempt.status)}>
                      {attempt.status}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {attempt.method}
                    </Badge>
                  </div>
                </div>
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
            Security Management
          </h2>
          <p className="text-gray-600">
            Monitor system security, manage access controls, and ensure HIPAA
            compliance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Security Settings
          </Button>
        </div>
      </div>
      <SecurityOverview />
      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="access">Access Attempts</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="audit">
          <AuditLogTable />
        </TabsContent>

        <TabsContent value="access">
          <AccessAttempts />
        </TabsContent>

        <TabsContent value="threats">
          <ThreatMonitoring />
        </TabsContent>

        <TabsContent value="settings">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>HIPAA Compliance Dashboard</CardTitle>
              <CardDescription>
                Monitor and maintain HIPAA compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          Compliant
                        </div>
                        <div className="text-sm text-gray-600">
                          Data Encryption
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          Active
                        </div>
                        <div className="text-sm text-gray-600">
                          Access Controls
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          Complete
                        </div>
                        <div className="text-sm text-gray-600">
                          Audit Trails
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          Secured
                        </div>
                        <div className="text-sm text-gray-600">
                          PHI Protection
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>HIPAA Compliance Status: COMPLIANT</AlertTitle>
                <AlertDescription>
                  Your system meets all HIPAA requirements for protecting
                  patient health information (PHI). Regular compliance audits
                  are performed automatically.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-medium">Compliance Checklist</h4>
                <div className="space-y-2">
                  {[
                    "Data encryption at rest and in transit",
                    "Role-based access controls implemented",
                    "Audit logging for all PHI access",
                    "User authentication and authorization",
                    "Data backup and recovery procedures",
                    "Incident response plan in place",
                    "Team security training completed",
                    "Business Associate Agreements signed",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityManager;

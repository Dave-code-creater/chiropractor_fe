import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  FileText,
  Download,
  Upload,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Share,
  Mail,
  Printer,
  Filter,
  Search,
  Calendar,
  User,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';

const PDFReportGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('patient-summary');
  const [reportData, setReportData] = useState({});
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    dateRange: 'last-30-days',
    reportType: 'all',
    status: 'all',
    assignedTo: 'all'
  });

  // Report templates
  const [reportTemplates] = useState([
    {
      id: 'patient-summary',
      name: 'Patient Summary Report',
      description: 'Comprehensive patient information and treatment history',
      category: 'patient',
      fields: ['personalInfo', 'medicalHistory', 'treatmentHistory', 'vitals', 'notes'],
      format: 'A4',
      orientation: 'portrait',
      includeBranding: true,
      customizable: true
    },
    {
      id: 'treatment-plan',
      name: 'Treatment Plan Report',
      description: 'Detailed treatment plan with goals and timeline',
      category: 'clinical',
      fields: ['patientInfo', 'diagnosis', 'treatmentPlan', 'goals', 'timeline'],
      format: 'A4',
      orientation: 'portrait',
      includeBranding: true,
      customizable: true
    },
    {
      id: 'progress-report',
      name: 'Progress Report',
      description: 'Patient progress tracking and outcome measurements',
      category: 'clinical',
      fields: ['patientInfo', 'progressMetrics', 'painLevels', 'functionalStatus', 'nextSteps'],
      format: 'A4',
      orientation: 'portrait',
      includeBranding: true,
      customizable: true
    },
    {
      id: 'insurance-report',
      name: 'Insurance Report',
      description: 'Insurance claim documentation and billing information',
      category: 'administrative',
      fields: ['patientInfo', 'insuranceDetails', 'treatmentCodes', 'billingHistory'],
      format: 'A4',
      orientation: 'portrait',
      includeBranding: true,
      customizable: false
    },
    {
      id: 'clinic-analytics',
      name: 'Clinic Analytics Report',
      description: 'Comprehensive clinic performance and statistics',
      category: 'analytics',
      fields: ['patientMetrics', 'appointmentStats', 'revenueAnalysis', 'staffPerformance'],
      format: 'A4',
      orientation: 'landscape',
      includeBranding: true,
      customizable: true
    },
    {
      id: 'appointment-summary',
      name: 'Appointment Summary',
      description: 'Daily, weekly, or monthly appointment summaries',
      category: 'administrative',
      fields: ['appointmentList', 'patientInfo', 'providerInfo', 'status'],
      format: 'A4',
      orientation: 'portrait',
      includeBranding: true,
      customizable: true
    }
  ]);

  // Sample report data
  const [sampleReports] = useState([
    {
      id: 'RPT-001',
      name: 'John Smith - Patient Summary',
      template: 'patient-summary',
      generatedDate: '2025-01-18',
      generatedBy: 'Dr. Johnson',
      status: 'completed',
      fileSize: '2.3 MB',
      pages: 8,
      downloadCount: 3,
      shared: true
    },
    {
      id: 'RPT-002',
      name: 'Weekly Clinic Analytics',
      template: 'clinic-analytics',
      generatedDate: '2025-01-15',
      generatedBy: 'Admin',
      status: 'completed',
      fileSize: '1.8 MB',
      pages: 12,
      downloadCount: 7,
      shared: false
    },
    {
      id: 'RPT-003',
      name: 'Sarah Wilson - Treatment Plan',
      template: 'treatment-plan',
      generatedDate: '2025-01-20',
      generatedBy: 'Dr. Smith',
      status: 'generating',
      fileSize: null,
      pages: null,
      downloadCount: 0,
      shared: false
    }
  ]);

  // Generate report function
  const generateReport = useCallback(async (templateId, data, options = {}) => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate report generation with progress
      const steps = [
        'Collecting data...',
        'Processing template...',
        'Generating content...',
        'Formatting document...',
        'Creating PDF...',
        'Finalizing report...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(((i + 1) / steps.length) * 100);
        toast.info(steps[i]);
      }

      // Simulate file download
      const blob = new Blob(['Sample PDF content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${templateId}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }, []);

  // Bulk report generation
  const generateBulkReports = useCallback(async (reportIds) => {
    setIsGenerating(true);
    
    for (let i = 0; i < reportIds.length; i++) {
      setGenerationProgress(((i + 1) / reportIds.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info(`Generating report ${i + 1} of ${reportIds.length}`);
    }
    
    toast.success(`Generated ${reportIds.length} reports successfully!`);
    setIsGenerating(false);
    setGenerationProgress(0);
    setSelectedReports([]);
  }, []);

  const filteredReports = useMemo(() => {
    return sampleReports.filter(report => {
      if (filterOptions.reportType !== 'all') {
        const template = reportTemplates.find(t => t.id === report.template);
        if (template?.category !== filterOptions.reportType) return false;
      }
      if (filterOptions.status !== 'all' && report.status !== filterOptions.status) return false;
      return true;
    });
  }, [sampleReports, reportTemplates, filterOptions]);

  const ReportTemplateCard = ({ template }) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedTemplate(template.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </div>
          <Badge variant="outline">{template.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Format:</span>
            <span>{template.format} - {template.orientation}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Fields:</span>
            <span>{template.fields.length} sections</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Customizable:</span>
            <Badge variant={template.customizable ? 'default' : 'secondary'} size="sm">
              {template.customizable ? 'Yes' : 'No'}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {template.fields.slice(0, 3).map(field => (
              <Badge key={field} variant="outline" className="text-xs">
                {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </Badge>
            ))}
            {template.fields.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.fields.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ReportConfigPanel = () => {
    const template = reportTemplates.find(t => t.id === selectedTemplate);
    if (!template) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Configure Report: {template.name}
            <Button onClick={() => generateReport(selectedTemplate, reportData)}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardTitle>
          <CardDescription>
            Customize the report settings and data selection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Report Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Report Title</Label>
                <Input placeholder="Enter custom report title" />
              </div>
              <div>
                <Label>Date Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Selection */}
          <div className="space-y-4">
            <h4 className="font-medium">Data Selection</h4>
            <div className="space-y-3">
              {template.fields.map(field => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox defaultChecked />
                  <Label className="capitalize">
                    {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Format Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Format Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Page Format</Label>
                <Select defaultValue={template.format}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="Letter">Letter</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Orientation</Label>
                <Select defaultValue={template.orientation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quality</Label>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Branding Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Branding & Customization</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox defaultChecked={template.includeBranding} />
                <Label>Include clinic branding and logo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox defaultChecked />
                <Label>Include doctor signature</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox />
                <Label>Include watermark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox defaultChecked />
                <Label>Include page numbers</Label>
              </div>
            </div>
          </div>

          {/* Custom Notes */}
          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea 
              placeholder="Add any additional notes or comments to include in the report..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const ReportHistoryTable = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Report History</CardTitle>
            <CardDescription>
              {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {selectedReports.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateBulkReports(selectedReports)}
                  disabled={isGenerating}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Selected ({selectedReports.length})
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedReports([])}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select 
            value={filterOptions.reportType} 
            onValueChange={(value) => setFilterOptions({...filterOptions, reportType: value})}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="patient">Patient Reports</SelectItem>
              <SelectItem value="clinical">Clinical Reports</SelectItem>
              <SelectItem value="administrative">Administrative</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filterOptions.status} 
            onValueChange={(value) => setFilterOptions({...filterOptions, status: value})}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="generating">Generating</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filterOptions.dateRange} 
            onValueChange={(value) => setFilterOptions({...filterOptions, dateRange: value})}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="all-time">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Generating reports...</span>
              <span className="text-sm text-gray-500">{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
          </div>
        )}

        {/* Reports Table */}
        <div className="space-y-3">
          {filteredReports.map(report => {
            const template = reportTemplates.find(t => t.id === report.template);
            const isSelected = selectedReports.includes(report.id);
            
            return (
              <div 
                key={report.id} 
                className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedReports([...selectedReports, report.id]);
                        } else {
                          setSelectedReports(selectedReports.filter(id => id !== report.id));
                        }
                      }}
                    />
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-gray-600 flex items-center space-x-4">
                          <span>Template: {template?.name}</span>
                          <span>•</span>
                          <span>Generated: {report.generatedDate}</span>
                          <span>•</span>
                          <span>By: {report.generatedBy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      {report.fileSize && (
                        <div className="text-gray-600">{report.fileSize}</div>
                      )}
                      {report.pages && (
                        <div className="text-gray-500">{report.pages} pages</div>
                      )}
                    </div>
                    
                    <Badge variant={
                      report.status === 'completed' ? 'default' :
                      report.status === 'generating' ? 'secondary' : 'destructive'
                    }>
                      {report.status}
                    </Badge>
                    
                    <div className="flex items-center space-x-1">
                      {report.status === 'completed' && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {report.status === 'generating' && (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-gray-500">Generating...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {report.downloadCount > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Downloaded {report.downloadCount} time{report.downloadCount !== 1 ? 's' : ''}
                    {report.shared && ' • Shared with patient'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">PDF Report Generator</h2>
          <p className="text-gray-600">Generate, customize, and manage PDF reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Template
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{reportTemplates.length}</div>
                <div className="text-sm text-gray-600">Templates</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{sampleReports.filter(r => r.status === 'completed').length}</div>
                <div className="text-sm text-gray-600">Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {sampleReports.reduce((sum, r) => sum + r.downloadCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Downloads</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{sampleReports.filter(r => r.status === 'generating').length}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Select Template</CardTitle>
                  <CardDescription>
                    Choose a report template to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="p-4 space-y-4">
                      {reportTemplates.map(template => (
                        <ReportTemplateCard key={template.id} template={template} />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <ReportConfigPanel />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Report Templates</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map(template => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span>{template.format} - {template.orientation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fields:</span>
                      <span>{template.fields.length} sections</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customizable:</span>
                      <Badge variant={template.customizable ? 'default' : 'secondary'} size="sm">
                        {template.customizable ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ReportHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PDFReportGenerator; 
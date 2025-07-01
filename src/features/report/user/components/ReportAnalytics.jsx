import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Clock,
  FileText,
  Calendar,
  Users,
  Activity,
  AlertCircle,
} from "lucide-react";

const ReportAnalytics = ({ reports = [] }) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalReports = reports.length;
    const completedReports = reports.filter(
      (r) => r.status === "completed",
    ).length;
    const draftReports = reports.filter((r) => r.status === "draft").length;
    const reportsThisMonth = reports.filter(
      (r) => new Date(r.createdAt) >= thirtyDaysAgo,
    ).length;
    const reportsThisWeek = reports.filter(
      (r) => new Date(r.createdAt) >= sevenDaysAgo,
    ).length;

    // Category breakdown
    const categoryStats = reports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {});

    // Average completion time (mock calculation)
    const avgCompletionTime =
      completedReports > 0
        ? Math.round(
            reports
              .filter((r) => r.status === "completed")
              .reduce((sum, r) => {
                const created = new Date(r.createdAt);
                const updated = new Date(r.updatedAt);
                return sum + (updated - created) / (1000 * 60 * 60 * 24);
              }, 0) / completedReports,
          )
        : 0;

    // Completion rate
    const completionRate =
      totalReports > 0
        ? Math.round((completedReports / totalReports) * 100)
        : 0;

    // Most active category
    const mostActiveCategory =
      Object.entries(categoryStats).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "consultation";

    return {
      totalReports,
      completedReports,
      draftReports,
      reportsThisMonth,
      reportsThisWeek,
      categoryStats,
      avgCompletionTime,
      completionRate,
      mostActiveCategory,
    };
  }, [reports]);

  const stats = [
    {
      title: "Total Reports",
      value: analytics.totalReports,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: `+${analytics.reportsThisMonth} this month`,
    },
    {
      title: "Completed",
      value: analytics.completedReports,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: `${analytics.completionRate}% completion rate`,
    },
    {
      title: "In Progress",
      value: analytics.draftReports,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "Need attention",
    },
    {
      title: "This Week",
      value: analytics.reportsThisWeek,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "Recent activity",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Report Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.categoryStats).map(
                ([category, count]) => {
                  const percentage = Math.round(
                    (count / analytics.totalReports) * 100,
                  );
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">
                          {category}
                        </span>
                        <Badge variant="secondary">
                          {count} ({percentage}%)
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Average Completion Time</p>
                <p className="text-xs text-muted-foreground">
                  Time from creation to completion
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">
                  {analytics.avgCompletionTime} days
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Most Active Category</p>
                <p className="text-xs text-muted-foreground">
                  Category with most reports
                </p>
              </div>
              <div className="text-right">
                <Badge className="capitalize">
                  {analytics.mostActiveCategory}
                </Badge>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-xs text-muted-foreground">
                  Percentage of completed reports
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{analytics.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {analytics.draftReports > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700">
            <ul className="space-y-2 text-sm">
              {analytics.draftReports > 3 && (
                <li>
                  • You have {analytics.draftReports} draft reports. Consider
                  completing them to improve your workflow.
                </li>
              )}
              {analytics.completionRate < 70 && (
                <li>
                  • Your completion rate is {analytics.completionRate}%. Try
                  setting reminders to finish reports.
                </li>
              )}
              {analytics.avgCompletionTime > 7 && (
                <li>
                  • Reports take an average of {analytics.avgCompletionTime}{" "}
                  days to complete. Consider breaking them into smaller tasks.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportAnalytics;

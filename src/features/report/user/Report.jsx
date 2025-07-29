// src/features/report/user/Report.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText as FileTextIcon,
  ArrowLeft,
  Clock,
  User,
  Shield
} from "lucide-react";

import SimplePatientRecords from "./components/SimplePatientRecords";

export default function Report() {
  const [showSimpleRecords, setShowSimpleRecords] = useState(false);

  const handleOpenSimpleRecords = () => {
    setShowSimpleRecords(true);
  };

  const handleBackFromSimpleRecords = () => {
    setShowSimpleRecords(false);
  };

  // If viewing simple patient records, show the SimplePatientRecords component
  if (showSimpleRecords) {
    return (
      <SimplePatientRecords
        onBack={handleBackFromSimpleRecords}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Patient Records</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Submit your medical forms easily, one at a time
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 sm:mb-6 text-center">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Get Started</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 px-2">
                Fill out your medical forms at your own pace. Only basic information is required.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 sm:px-4 py-2 max-w-xs sm:max-w-md mx-auto">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span><strong>Privacy First:</strong> Share only what you're comfortable with</span>
              </div>
            </div>

            {/* Simple Patient Records Card */}
            <Card
              className="cursor-pointer transition-all hover:shadow-lg group border-2 border-green-200 bg-white hover:border-green-300 max-w-2xl mx-auto"
              onClick={handleOpenSimpleRecords}
            >
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-xl bg-green-100 self-center sm:self-auto">
                    <FileTextIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-600" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-1">
                      <CardTitle className="text-xl sm:text-2xl text-gray-900">
                        Patient Records
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800 border-green-200 self-center sm:self-auto">
                        Simple & Easy
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                      Submit your medical forms one at a time. No complex workflows - just simple, straightforward forms that you can complete at your own pace.
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 sm:mt-4">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-green-700 font-medium">5-10 min each form</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <User className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-green-700 font-medium">6 optional forms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-4 sm:pb-6 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                    ✨ Much simpler than traditional incident reports
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                    Get Started →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
              <Card className="bg-white/80">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Choose Forms</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Select which forms you want to fill out</p>
                </CardContent>
              </Card>
              <Card className="bg-white/80">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Fill & Submit</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Complete each form individually</p>
                </CardContent>
              </Card>
              <Card className="bg-white/80">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Track Progress</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">See your completion status</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

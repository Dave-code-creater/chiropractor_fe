import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import BlogReader from "./BlogReader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, ArrowRight, Eye, Home } from "lucide-react";

const SmartBlogRouter = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userRole = useSelector((state) => state.auth.role);
    const userID = useSelector((state) => state.auth.userID);
    const navigate = useNavigate();
    const { slug } = useParams();

    // If not authenticated, show public blog reader directly
    if (!isAuthenticated) {
        return <BlogReader />;
    }

    // For authenticated users, redirect them to their dashboard blog view
    React.useEffect(() => {
        if (isAuthenticated && userRole && userID) {
            // Redirect authenticated users to their dashboard blog view
            const dashboardPath = `/dashboard/${userRole.toLowerCase()}/${userID}/blog${slug ? `/${slug}` : ''}`;
            navigate(dashboardPath, { replace: true });
        }
    }, [isAuthenticated, userRole, userID, slug, navigate]);

    // While redirecting, show loading with a header for context
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header for authenticated users */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-blue-600" />
                            <div>
                                <h3 className="font-medium text-blue-900">Redirecting to your dashboard...</h3>
                                <p className="text-sm text-blue-700">Taking you to your personalized blog view</p>
                            </div>
                            <Badge variant="outline" className="border-blue-300 text-blue-700">
                                {userRole}
                            </Badge>
                        </div>
                        <div className="animate-spin h-5 w-5 text-blue-600">
                            ⟳
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Show the public blog content while redirecting */}
            <BlogReader />
        </div>
    );
};

export default SmartBlogRouter;
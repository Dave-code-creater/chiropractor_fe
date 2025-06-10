"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Account() {
    const [username, setUsername] = useState("Huy Doan");
    const [email, setEmail] = useState("test@example.com");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="w-full space-y-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl">Account Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Manage your profile and security information.
                    </p>
                </CardHeader>

                <CardContent className="space-y-10">
                    {/* Profile Section */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Password Section */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Password</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Change your password to keep your account secure.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button onClick={() => alert("Password updated!")}>
                                Update Password
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
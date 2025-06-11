"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicy() {
    return (
        <div className="grid place-items-center min-h-screen px-4 pb-8">
            <div className="space-y-8 px-4 py-8">
                <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground">Last updated: March 14, 2024</p>
                <Separator className="mt-4" />
                <p className="text-base text-muted-foreground">
                    Please read this Privacy Policy carefully before using the https://example.com website (the "Service") operated by Example Company ("us", "we", or "our").
                </p>
            </div>

            <div className="space-y-8">
                {/* Section 1 */}
                <section className="rounded-lg border bg-background p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold">Interpretation and Definitions</h2>
                    <p className="mt-4 text-sm text-muted-foreground">
                        The words of which the initial letter is capitalized have meanings defined under the following conditions. These definitions apply whether they appear in singular or plural.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
                        <li><strong>You</strong> refers to the user or entity using the Service.</li>
                        <li><strong>Company</strong> refers to Example Company, 123 St., San Francisco, CA 94107.</li>
                        <li><strong>Affiliate</strong> means any entity under common control with the Company.</li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section className="rounded-lg border bg-background p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold">Collecting and Using Your Personal Data</h2>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium">Types of Data Collected</h3>

                        <h4 className="mt-4 font-semibold">Personal Data</h4>
                        <p className="text-sm text-muted-foreground">
                            We may ask You to provide us with certain personally identifiable information including:
                        </p>
                        <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Email address</li>
                            <li>First and last name</li>
                            <li>Phone number</li>
                            <li>Address, City, ZIP/Postal code, etc.</li>
                            <li>Usage Data</li>
                        </ul>

                        <h4 className="mt-6 font-semibold">Usage Data</h4>
                        <p className="text-sm text-muted-foreground">
                            Automatically collected when using the Service, including information like IP address, browser type, and usage metrics.
                        </p>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium">Use of Your Personal Data</h3>
                        <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>To provide and maintain the Service</li>
                            <li>To manage Your Account</li>
                            <li>To fulfill contracts and agreements</li>
                        </ul>
                    </div>
                </section>

                {/* Section 3 */}
                <section className="rounded-lg border bg-background p-6 shadow-sm pb-8">
                    <h2 className="text-2xl font-semibold">Retention and Security of Your Data</h2>
                    <p className="mt-4 text-sm text-muted-foreground">
                        We retain your data only as long as necessary to fulfill the purposes outlined in this policy and comply with applicable legal obligations.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        We implement appropriate security measures to protect your personal data.
                    </p>
                </section>
            </div>
        </div>
    )
}
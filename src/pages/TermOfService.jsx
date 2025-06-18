import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermOfService() {
    return (
        <div className="min-h-screen w-full px-4 py-10 bg-background text-foreground">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                    <p className="text-sm text-muted-foreground mt-2">Last updated: January 1, 2024</p>
                    <Separator className="my-6 w-20 mx-auto" />
                </div>

                {/* Section: Introduction */}

                <div className="p-6 space-y-3">
                    <h2 className="text-2xl font-semibold">Introduction</h2>
                    <p>
                        These terms of service ("Terms") govern your use of our website ("Service") operated by Acme Inc ("we", "our").
                    </p>
                </div>


                {/* Section: Definitions */}

                <div className="p-6 space-y-3">
                    <h2 className="text-2xl font-semibold">Interpretation & Definitions</h2>
                    <div>
                        <h3 className="font-medium">Interpretation</h3>
                        <p>
                            Capitalized words have meanings as defined below. They apply equally whether singular or plural.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-medium">Definitions</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Account</strong>: Your registered user account.</li>
                            <li><strong>Company</strong>: Refers to Acme Inc, 123 Street, City.</li>
                            <li><strong>Service</strong>: Refers to the Website.</li>
                            <li><strong>You</strong>: The user accessing the service.</li>
                        </ul>
                    </div>
                </div>


                {/* Section: Other Sections */}
                {[
                    ["Acknowledgement", "By using our Service, you agree to these Terms. If you disagree, do not use our Service."],
                    ["Content", "You retain ownership of your content but grant us the right to use, modify, and distribute it as necessary to operate the Service."],
                    ["Accounts", "You're responsible for your account and password security. Report any unauthorized access immediately."],
                    ["Links to Other Websites", "We are not responsible for third-party sites you may access through our Service."],
                    ["Termination", "We may suspend or terminate your access at any time for violations of these Terms."],
                    ["Governing Law", "These Terms are governed by the laws of your applicable state or country."],
                    ["Changes", "We may update these Terms at any time. Continued use after changes means you accept the new Terms."],
                    ["Contact Us", "For questions, contact us at support@acmeinc.com."]
                ].map(([title, content], i) => (
                    <div key={i}>
                        <div className="p-6 space-y-3">
                            <h2 className="text-2xl font-semibold">{title}</h2>
                            <p>{content}</p>
                        </div>
                    </div>
                ))}


            </div>
        </div>
    )
}
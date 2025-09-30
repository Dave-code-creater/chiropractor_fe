
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Scale, Users, Shield, Calendar, AlertTriangle } from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <FileText className="w-5 h-5" />,
      content: `By accessing and using ChiroCare ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. ChiroCare is a comprehensive healthcare management platform designed to connect patients with qualified healthcare providers and facilitate healthcare services.`,
    },
    {
      id: "definitions",
      title: "Definitions",
      icon: <Scale className="w-5 h-5" />,
      content: null,
      definitions: [
        {
          term: "Platform",
          definition: "ChiroCare web application and all associated services",
        },
        {
          term: "User",
          definition: "Any individual who accesses or uses our Platform",
        },
        {
          term: "Patient",
          definition:
            "A User who seeks or receives healthcare services through our Platform",
        },
        {
          term: "Healthcare Provider",
          definition:
            "Licensed medical professionals who provide services through our Platform",
        },
        {
          term: "Personal Health Information (PHI)",
          definition:
            "Any information about health status, provision of healthcare, or payment for healthcare that can be linked to an individual",
        },
        {
          term: "Services",
          definition:
            "All features, tools, and functionalities provided by ChiroCare",
        },
        {
          term: "Account",
          definition: "Your registered user profile on the Platform",
        },
      ],
    },
    {
      id: "eligibility",
      title: "User Eligibility",
      icon: <Users className="w-5 h-5" />,
      content: `To use ChiroCare, you must be at least 18 years old or have parental/guardian consent. You must provide accurate, current, and complete information during registration. Healthcare providers must maintain valid licenses and certifications. Users are responsible for maintaining the confidentiality of their account credentials.`,
      requirements: [
        "Must be 18+ years old or have parental consent",
        "Provide accurate and complete registration information",
        "Healthcare providers must maintain valid licenses",
        "Maintain account security and confidentiality",
      ],
    },
    {
      id: "services",
      title: "Platform Services",
      icon: <Shield className="w-5 h-5" />,
      content: `ChiroCare provides a digital platform for healthcare management including:`,
      services: [
        "Appointment scheduling and management",
        "Secure messaging between patients and providers",
        "Medical record storage and management",
        "Telemedicine consultations (where legally permitted)",
        "Health tracking and monitoring tools",
        "Educational resources and content",
        "Insurance verification and billing support",
      ],
    },
    {
      id: "medical-disclaimer",
      title: "Medical Disclaimer",
      icon: <AlertTriangle className="w-5 h-5" />,
      badge: "Important",
      content: `ChiroCare is a platform that facilitates healthcare services but does not provide medical advice, diagnosis, or treatment. All medical decisions should be made in consultation with qualified healthcare professionals. In case of medical emergencies, contact emergency services immediately (911 in the US). The Platform is not intended to replace professional medical advice, diagnosis, or treatment.`,
    },
    {
      id: "privacy-hipaa",
      title: "Privacy and HIPAA Compliance",
      icon: <Shield className="w-5 h-5" />,
      badge: "HIPAA Protected",
      content: `ChiroCare is committed to protecting your privacy and complying with HIPAA regulations. We implement appropriate safeguards to protect your Personal Health Information (PHI). Our detailed privacy practices are outlined in our Privacy Policy. By using our Platform, you consent to the collection, use, and disclosure of your information as described in our Privacy Policy.`,
    },
    {
      id: "appointments",
      title: "Appointments and Cancellations",
      icon: <Calendar className="w-5 h-5" />,
      content: `Appointment scheduling is subject to provider availability. Cancellation policies may vary by provider and will be clearly communicated during booking. No-show fees may apply as determined by individual healthcare providers. ChiroCare reserves the right to cancel appointments due to technical issues or provider unavailability.`,
      policies: [
        "24-hour cancellation notice recommended",
        "No-show fees determined by individual providers",
        "Rescheduling subject to availability",
        "Emergency cancellations will be accommodated",
      ],
    },
    {
      id: "user-conduct",
      title: "User Conduct and Responsibilities",
      icon: <Users className="w-5 h-5" />,
      content: `Users must conduct themselves professionally and respectfully. Prohibited activities include:`,
      prohibited: [
        "Providing false or misleading information",
        "Harassment or inappropriate behavior",
        "Attempting to circumvent security measures",
        "Sharing account credentials with others",
        "Using the Platform for illegal activities",
        "Posting inappropriate or offensive content",
      ],
    },
    {
      id: "payment-billing",
      title: "Payment and Billing",
      icon: <FileText className="w-5 h-5" />,
      content: `Payment terms are established between patients and healthcare providers. ChiroCare may facilitate payment processing but is not responsible for billing disputes. Insurance verification is provided as a convenience but does not guarantee coverage. Users are responsible for understanding their insurance benefits and coverage limitations.`,
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <Shield className="w-5 h-5" />,
      content: `ChiroCare and its licensors own all intellectual property rights in the Platform. Users retain ownership of their personal information and medical records. By using the Platform, users grant ChiroCare a limited license to use their information to provide services. Users may not reproduce, distribute, or create derivative works from our Platform without permission.`,
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `ChiroCare's liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid by the user in the twelve months preceding the claim. This limitation does not apply to gross negligence or willful misconduct.`,
    },
    {
      id: "termination",
      title: "Account Termination",
      icon: <Users className="w-5 h-5" />,
      content: `Either party may terminate the account relationship at any time. ChiroCare reserves the right to suspend or terminate accounts for violation of these terms. Upon termination, users may request copies of their medical records in accordance with applicable laws. Some provisions of these terms will survive termination.`,
    },
    {
      id: "governing-law",
      title: "Governing Law and Disputes",
      icon: <Scale className="w-5 h-5" />,
      content: `These terms are governed by the laws of the jurisdiction where ChiroCare is headquartered. Disputes will be resolved through binding arbitration, except for claims that may be brought in small claims court. The arbitration will be conducted by a neutral arbitrator in accordance with applicable arbitration rules.`,
    },
    {
      id: "changes",
      title: "Changes to Terms",
      icon: <FileText className="w-5 h-5" />,
      content: `ChiroCare reserves the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification. Continued use of the Platform after changes constitutes acceptance of the new terms. Users who do not agree to changes may terminate their account.`,
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: <Users className="w-5 h-5" />,
      content: `For questions about these Terms of Service, please contact us:`,
      contact: {
        email: "drdieuphanchiropractor@gmail.com",
        phone: "(303) 777-0125",
        address:
          "1385 West Alameda Ave, Denver, CO 80223, United States",
        hours: "Monday - Friday, 9:00 AM - 5:00 PM EST",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Scale className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          <p className="text-muted-foreground mb-2">
            ChiroCare Healthcare Management Platform
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
          <Separator className="w-24 mx-auto mt-6" />
        </div>

        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Welcome to ChiroCare
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service ("Terms") govern your access to and use
                  of ChiroCare, a comprehensive healthcare management platform.
                  By using our services, you agree to comply with these terms.
                  Please read them carefully before using our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card
              key={section.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-blue-600 mt-1 flex-shrink-0">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold">
                        {index + 1}. {section.title}
                      </h2>
                      {section.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {section.badge}
                        </Badge>
                      )}
                    </div>

                    {section.content && (
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {section.content}
                      </p>
                    )}

                    {section.definitions && (
                      <div className="space-y-3">
                        {section.definitions.map((def, i) => (
                          <div
                            key={i}
                            className="border-l-2 border-gray-200 pl-4"
                          >
                            <div className="flex gap-2">
                              <span className="font-medium text-sm">
                                {def.term}:
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {def.definition}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.requirements && (
                      <ul className="space-y-2 mt-3">
                        {section.requirements.map((req, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.services && (
                      <ul className="space-y-2 mt-3">
                        {section.services.map((service, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              {service}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.policies && (
                      <ul className="space-y-2 mt-3">
                        {section.policies.map((policy, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              {policy}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.prohibited && (
                      <ul className="space-y-2 mt-3">
                        {section.prohibited.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.contact && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium">Email:</span>
                            <p className="text-muted-foreground">
                              {section.contact.email}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span>
                            <p className="text-muted-foreground">
                              {section.contact.phone}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Address:</span>
                            <p className="text-muted-foreground">
                              {section.contact.address}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Business Hours:</span>
                            <p className="text-muted-foreground">
                              {section.contact.hours}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium">
                  Your Healthcare, Our Priority
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                ChiroCare is committed to providing secure, reliable, and
                compliant healthcare management services. If you have any
                questions about these terms, please don't hesitate to contact
                our legal team.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

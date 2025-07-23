"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertTriangle,
  FileText,
  Users,
  Mail,
  Clock,
} from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <FileText className="w-5 h-5" />,
      content: `ChiroCare is committed to protecting your privacy and maintaining the security of your personal health information (PHI). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare management platform. We comply with HIPAA, state privacy laws, and other applicable regulations to ensure your information remains secure and confidential.`,
    },
    {
      id: "hipaa-compliance",
      title: "HIPAA Compliance",
      icon: <Shield className="w-5 h-5" />,
      badge: "HIPAA Protected",
      content: `As a healthcare platform, ChiroCare operates as a covered entity under the Health Insurance Portability and Accountability Act (HIPAA). We implement comprehensive safeguards to protect your Protected Health Information (PHI):`,
      protections: [
        "Administrative safeguards including workforce training and access controls",
        "Physical safeguards such as facility access controls and workstation security",
        "Technical safeguards including encryption, audit controls, and secure transmission",
        "Regular risk assessments and security updates",
        "Business Associate Agreements with all third-party vendors",
        "Incident response procedures for potential breaches",
      ],
    },
    {
      id: "information-collected",
      title: "Information We Collect",
      icon: <Database className="w-5 h-5" />,
      content: `We collect various types of information to provide you with comprehensive healthcare services:`,
      categories: [
        {
          type: "Personal Information",
          items: [
            "Full name, date of birth, and contact information",
            "Address, phone number, and email address",
            "Emergency contact information",
            "Insurance information and payment details",
          ],
        },
        {
          type: "Health Information",
          items: [
            "Medical history and current health conditions",
            "Symptoms, diagnoses, and treatment plans",
            "Prescription and medication information",
            "Test results and medical imaging",
            "Provider notes and consultation records",
          ],
        },
        {
          type: "Usage Data",
          items: [
            "Platform usage patterns and preferences",
            "Device information and IP addresses",
            "Log files and technical data",
            "Communication records within the platform",
          ],
        },
      ],
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: <UserCheck className="w-5 h-5" />,
      content: `We use your information for legitimate healthcare purposes and platform operations:`,
      purposes: [
        {
          category: "Healthcare Services",
          uses: [
            "Facilitating appointments and consultations",
            "Enabling communication between patients and providers",
            "Maintaining comprehensive medical records",
            "Coordinating care between multiple providers",
            "Processing insurance claims and billing",
          ],
        },
        {
          category: "Platform Operations",
          uses: [
            "Creating and managing user accounts",
            "Providing customer support and technical assistance",
            "Improving platform functionality and user experience",
            "Ensuring platform security and preventing fraud",
            "Complying with legal and regulatory requirements",
          ],
        },
        {
          category: "Communication",
          uses: [
            "Sending appointment reminders and health alerts",
            "Providing important platform updates and notices",
            "Sharing educational health content (with consent)",
            "Responding to inquiries and support requests",
          ],
        },
      ],
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      icon: <Users className="w-5 h-5" />,
      content: `We share your information only as necessary for healthcare delivery and legal compliance:`,
      sharing: [
        {
          category: "Healthcare Providers",
          description:
            "With your healthcare providers for treatment, care coordination, and medical consultations",
          conditions:
            "Only relevant medical information shared with authorized providers",
        },
        {
          category: "Insurance Companies",
          description:
            "For claims processing, coverage verification, and payment authorization",
          conditions: "Limited to information necessary for insurance purposes",
        },
        {
          category: "Legal Requirements",
          description:
            "When required by law, court order, or regulatory authority",
          conditions: "Only the minimum information required by law",
        },
        {
          category: "Emergency Situations",
          description:
            "To protect your health and safety in emergency situations",
          conditions: "Limited to information necessary for immediate care",
        },
        {
          category: "Business Associates",
          description:
            "With vendors who help operate our platform (hosting, payment processing, etc.)",
          conditions:
            "All vendors sign Business Associate Agreements ensuring HIPAA compliance",
        },
      ],
    },
    {
      id: "data-security",
      title: "Data Security Measures",
      icon: <Lock className="w-5 h-5" />,
      badge: "Enterprise Security",
      content: `We implement industry-leading security measures to protect your information:`,
      security: [
        {
          category: "Encryption",
          measures: [
            "End-to-end encryption for all data transmission",
            "AES-256 encryption for data at rest",
            "Encrypted database storage and backups",
            "SSL/TLS protocols for web communications",
          ],
        },
        {
          category: "Access Controls",
          measures: [
            "Multi-factor authentication for all accounts",
            "Role-based access permissions",
            "Regular access reviews and updates",
            "Automatic session timeouts and logout",
          ],
        },
        {
          category: "Monitoring",
          measures: [
            "24/7 security monitoring and threat detection",
            "Regular security audits and penetration testing",
            "Comprehensive audit logs and activity tracking",
            "Incident response and breach notification procedures",
          ],
        },
      ],
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      icon: <Eye className="w-5 h-5" />,
      content: `Under HIPAA and other privacy laws, you have important rights regarding your information:`,
      rights: [
        {
          right: "Access",
          description:
            "Request copies of your medical records and account information",
          how: "Submit a written request through your account portal or contact our privacy officer",
        },
        {
          right: "Amendment",
          description:
            "Request corrections to inaccurate or incomplete information",
          how: "Provide documentation supporting the requested changes",
        },
        {
          right: "Restriction",
          description: "Request limits on how we use or share your information",
          how: "Submit specific restriction requests in writing",
        },
        {
          right: "Portability",
          description:
            "Receive your data in a portable, machine-readable format",
          how: "Request data export through your account settings",
        },
        {
          right: "Deletion",
          description: "Request deletion of your account and associated data",
          how: "Submit deletion request (subject to legal retention requirements)",
        },
        {
          right: "Accounting",
          description:
            "Receive a list of disclosures we've made of your information",
          how: "Request accounting of disclosures for the past six years",
        },
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: <Clock className="w-5 h-5" />,
      content: `We retain your information in accordance with healthcare regulations and legal requirements:`,
      retention: [
        {
          type: "Medical Records",
          period:
            "Minimum 7 years from last treatment date (longer if required by state law)",
          purpose: "Legal compliance and continuity of care",
        },
        {
          type: "Account Information",
          period: "Duration of active account plus 3 years after closure",
          purpose: "Account management and legal compliance",
        },
        {
          type: "Communication Records",
          period: "3 years from date of communication",
          purpose: "Customer service and dispute resolution",
        },
        {
          type: "Usage Data",
          period: "2 years from collection date",
          purpose: "Platform improvement and security monitoring",
        },
      ],
    },
    {
      id: "cookies-tracking",
      title: "Cookies and Tracking",
      icon: <Eye className="w-5 h-5" />,
      content: `We use cookies and similar technologies to enhance your experience and ensure platform security:`,
      cookies: [
        {
          type: "Essential Cookies",
          purpose:
            "Required for platform functionality, security, and user authentication",
          control:
            "Cannot be disabled as they are necessary for platform operation",
        },
        {
          type: "Performance Cookies",
          purpose:
            "Help us understand how users interact with our platform to improve performance",
          control:
            "Can be disabled through browser settings or cookie preferences",
        },
        {
          type: "Security Cookies",
          purpose:
            "Detect suspicious activity and protect against security threats",
          control: "Required for security purposes and cannot be disabled",
        },
      ],
    },
    {
      id: "third-party",
      title: "Third-Party Services",
      icon: <Users className="w-5 h-5" />,
      content: `We work with trusted third-party services to provide comprehensive healthcare management:`,
      services: [
        "Cloud hosting providers (AWS, Google Cloud) with HIPAA compliance",
        "Payment processors with PCI DSS certification",
        "Email service providers with healthcare-grade security",
        "Analytics services with data anonymization",
        "Integration partners for lab results and imaging",
        "Insurance verification and eligibility services",
      ],
    },
    {
      id: "children-privacy",
      title: "Children's Privacy",
      icon: <Shield className="w-5 h-5" />,
      content: `ChiroCare takes special care to protect the privacy of minors. For users under 18, we require parental or guardian consent for account creation and information collection. Parents and guardians have the right to review, modify, or delete their child's information at any time. We comply with COPPA and other applicable children's privacy laws.`,
    },
    {
      id: "breach-notification",
      title: "Breach Notification",
      icon: <AlertTriangle className="w-5 h-5" />,
      badge: "Important",
      content: `In the unlikely event of a data breach involving your PHI, we will:`,
      procedures: [
        "Notify you within 60 days of discovering the breach",
        "Provide details about what information was involved",
        "Explain steps we're taking to address the breach",
        "Offer guidance on protecting yourself from potential harm",
        "Report the breach to appropriate regulatory authorities",
        "Implement additional safeguards to prevent future incidents",
      ],
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      icon: <Database className="w-5 h-5" />,
      content: `ChiroCare primarily operates within the United States and stores data in US-based, HIPAA-compliant data centers. If we need to transfer data internationally, we ensure appropriate safeguards are in place, including data processing agreements that meet healthcare privacy standards and regulatory requirements.`,
    },
    {
      id: "policy-changes",
      title: "Changes to This Policy",
      icon: <FileText className="w-5 h-5" />,
      content: `We may update this Privacy Policy to reflect changes in our practices, technology, or legal requirements. We will notify you of significant changes through:`,
      notification: [
        "Email notification to your registered address",
        "Prominent notice on our platform",
        "In-app notifications for mobile users",
        "Updated version date at the top of this policy",
      ],
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: <Mail className="w-5 h-5" />,
      content: `For questions about this Privacy Policy or to exercise your privacy rights, contact us:`,
      contact: {
        privacy: {
          title: "Privacy Consultant",
          email: "tatandat110105@gmail.com",
          phone: "(647) 778-7816",
        },
        security: {
          title: "Security Team",
          email: "tatandat110105@gmail.com",
          phone: "(647) 778-7816",
        },
        general: {
          title: "General Inquiries",
          email: "drdieuphanchiropractor@gmail.com",
          phone: "(303) 777-0125",
        },
        address:
          "1385 West Alameda Ave, Denver, CO 80223, United States",
        hours: "Monday - Friday, 9:00 AM - 5:00 PM EST",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Privacy Policy
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

        {/* HIPAA Notice */}
        <Card className="mb-8 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-xl font-semibold">
                    HIPAA Privacy Notice
                  </h2>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Protected Health Information
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  This Privacy Policy serves as our HIPAA Notice of Privacy
                  Practices. It describes how we may use and disclose your
                  Protected Health Information (PHI) and your rights regarding
                  this information. We are required by law to maintain the
                  privacy of your PHI and to provide you with this notice of our
                  legal duties and privacy practices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
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

                    {section.protections && (
                      <ul className="space-y-2 mt-3">
                        {section.protections.map((protection, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              {protection}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.categories && (
                      <div className="space-y-4 mt-4">
                        {section.categories.map((category, i) => (
                          <div
                            key={i}
                            className="border-l-2 border-gray-200 pl-4"
                          >
                            <h3 className="font-semibold text-sm mb-2">
                              {category.type}
                            </h3>
                            <ul className="space-y-1">
                              {category.items.map((item, j) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-muted-foreground">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.purposes && (
                      <div className="space-y-4 mt-4">
                        {section.purposes.map((purpose, i) => (
                          <div
                            key={i}
                            className="border-l-2 border-green-200 pl-4"
                          >
                            <h3 className="font-semibold text-sm mb-2">
                              {purpose.category}
                            </h3>
                            <ul className="space-y-1">
                              {purpose.uses.map((use, j) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-muted-foreground">
                                    {use}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.sharing && (
                      <div className="space-y-4 mt-4">
                        {section.sharing.map((share, i) => (
                          <div
                            key={i}
                            className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
                          >
                            <h3 className="font-semibold text-sm mb-1">
                              {share.category}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {share.description}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                              {share.conditions}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.security && (
                      <div className="space-y-4 mt-4">
                        {section.security.map((sec, i) => (
                          <div
                            key={i}
                            className="border-l-2 border-orange-200 pl-4"
                          >
                            <h3 className="font-semibold text-sm mb-2">
                              {sec.category}
                            </h3>
                            <ul className="space-y-1">
                              {sec.measures.map((measure, j) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-muted-foreground">
                                    {measure}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.rights && (
                      <div className="space-y-3 mt-4">
                        {section.rights.map((right, i) => (
                          <div
                            key={i}
                            className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm">
                                Right to {right.right}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {right.description}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                              How to exercise: {right.how}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.retention && (
                      <div className="space-y-3 mt-4">
                        {section.retention.map((ret, i) => (
                          <div
                            key={i}
                            className="border rounded-lg p-3 bg-purple-50 dark:bg-purple-900/20"
                          >
                            <h3 className="font-semibold text-sm mb-1">
                              {ret.type}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              Retention Period: {ret.period}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                              Purpose: {ret.purpose}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.cookies && (
                      <div className="space-y-3 mt-4">
                        {section.cookies.map((cookie, i) => (
                          <div
                            key={i}
                            className="border rounded-lg p-3 bg-yellow-50 dark:bg-yellow-900/20"
                          >
                            <h3 className="font-semibold text-sm mb-1">
                              {cookie.type}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              {cookie.purpose}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                              {cookie.control}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.services && (
                      <ul className="space-y-2 mt-3">
                        {section.services.map((service, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              {service}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.procedures && (
                      <ul className="space-y-2 mt-3">
                        {section.procedures.map((procedure, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              {procedure}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.notification && (
                      <ul className="space-y-2 mt-3">
                        {section.notification.map((method, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              {method}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.contact && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-3">
                            <div>
                              <span className="font-medium">
                                {section.contact.privacy.title}:
                              </span>
                              <p className="text-muted-foreground">
                                {section.contact.privacy.email}
                              </p>
                              <p className="text-muted-foreground">
                                {section.contact.privacy.phone}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">
                                {section.contact.security.title}:
                              </span>
                              <p className="text-muted-foreground">
                                {section.contact.security.email}
                              </p>
                              <p className="text-muted-foreground">
                                {section.contact.security.phone}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <span className="font-medium">
                                {section.contact.general.title}:
                              </span>
                              <p className="text-muted-foreground">
                                {section.contact.general.email}
                              </p>
                              <p className="text-muted-foreground">
                                {section.contact.general.phone}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">
                                Business Hours:
                              </span>
                              <p className="text-muted-foreground">
                                {section.contact.hours}
                              </p>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">
                              Mailing Address:
                            </span>
                            <p className="text-muted-foreground">
                              {section.contact.address}
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

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-blue-600" />
                <span className="font-medium">
                  Your Privacy is Our Commitment
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                ChiroCare is dedicated to maintaining the highest standards of
                privacy and security for your healthcare information. We
                continuously update our practices to ensure compliance with
                evolving healthcare privacy regulations.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  HIPAA Compliant
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  SOC 2 Certified
                </span>
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Encrypted Storage
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

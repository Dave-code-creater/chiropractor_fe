


const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "FAQ", href: "/faq" },
];

const USER_FEATURES = {
  active: [
    {
      name: "Dashboard",
      href: "/dashboard",
      description: "View your personalized dashboard",
    },
    {
      name: "Appointments",
      href: "/appointments",
      description: "Schedule and manage your appointments",
    },
    {
      name: "Profile",
      href: "/profile",
      description: "View and update your profile",
    },
    {
      name: "Chat",
      href: "/chat",
      description: "Chat with your healthcare providers",
    },
    {
      name: "Blog",
      href: "/blog",
      description: "Read health and wellness articles",
    },
    {
      name: "Report",
      href: "/report",
      description: "View your health reports",
    },
    {
      name: "Settings",
      href: "/settings",
      description: "Manage your account settings",
    },
  ],
};

const SERVICES = [
  {
    name: "Physical Therapy",
    description:
      "Expert physical therapy services for recovery and rehabilitation",
    href: "/services/physical-therapy",
    icon: "PhysicalTherapyIcon",
  },
  {
    name: "Chiropractic Care",
    description:
      "Professional chiropractic treatments for spine and joint health",
    href: "/services/chiropractic",
    icon: "ChiropracticIcon",
  },
  {
    name: "Massage Therapy",
    description: "Therapeutic massage services for relaxation and healing",
    href: "/services/massage",
    icon: "MassageIcon",
  },
  {
    name: "Rehabilitation",
    description: "Comprehensive rehabilitation programs for various conditions",
    href: "/services/rehabilitation",
    icon: "RehabilitationIcon",
  },
];

export { NAV_LINKS, USER_FEATURES, SERVICES };

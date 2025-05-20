import { Description } from "@headlessui/react"
import {
    ArrowPathIcon,

    HeartIcon,
    HomeIcon,
    DevicePhoneMobileIcon,
    BuildingOffice2Icon
} from "@heroicons/react/24/outline"
const NAV_LINKS = [
    {
        title: 'Home',
        href: '/',
        icon: HomeIcon,
    },
    {
        title: 'About',
        href: '/about',
        icon: BuildingOffice2Icon,
    },
    {
        title: 'Contact Us',
        href: '/contact',
        icon: DevicePhoneMobileIcon,
    },
]

const SERVICES = [
    {
        name: "Physical Therapy",
        description: "Recover faster with expert care.",
        href: "/services/physical-therapy",
        icon: HeartIcon,
    },
    {
        name: "Chiropractic",
        description: "Chiropractic care for pain relief.",
        href: "/services/chiropractic",
        icon: ArrowPathIcon,
    }
]



export {
    NAV_LINKS,
    SERVICES
};
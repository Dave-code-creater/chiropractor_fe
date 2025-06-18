import {
    LayoutDashboard,
    FileText,
    Notebook,
    Book,
    CalendarDays,
    Inbox,
    User,
    Settings,
    LogOut
} from 'lucide-react'
const sidebar = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        items: [
            { name: 'Initial Report', path: 'services/initial-report' },
            { name: 'Doctor Notes', path: 'services/doctor-notes' },
        ],
    },
    {
        id: 'services',
        label: 'Services',
        items: [
            { name: 'Blog', path: 'services/blog' },
            { name: 'Appointments', path: 'services/appointments' },
            { name: 'Services', path: 'services/' },

        ],
    }
];

export default sidebar;
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../../services/authApi';
import sidebar from '../../../constants/sidebar';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Sidebar({ sidebarPosition = "left" }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [dropdowns, setDropdowns] = useState({ dashboard: true, services: true });
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigate = useNavigate();
    const userID = useSelector((state) => state.data.auth.userID);
    const [logoutApi] = useLogoutMutation();

    const handleLogout = () => {
        logoutApi(userID)
            .unwrap()
            .then(() => navigate('/'))
            .catch(() => navigate('/'));
    };

    const handleNavigation = (path) => {
        navigate(`/dashboard/${userID}/${path}`);
        setMobileOpen(false);
    };

    const toggleDropdown = (key) => {
        setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            {/* Mobile toggle button */}
            <div className="md:hidden p-4">
                <button onClick={() => setMobileOpen(true)}>
                    <Bars3Icon className="h-6 text-gray-700" />
                </button>
            </div>

            {/* Mobile Sidebar */}
            {mobileOpen && (
                <div className={`fixed inset-y-0 ${sidebarPosition === "right" ? "right-0" : "left-0"} z-50 w-64 bg-white shadow-lg`}>
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">DR. DIEU PHAN D.C.</h2>
                        <button onClick={() => setMobileOpen(false)}>
                            <XMarkIcon className="h-6 w-6 text-gray-700" />
                        </button>
                    </div>
                    <div className="p-4 overflow-auto">{renderNav({ isCollapsed: false })}</div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div
                className={`hidden md:flex flex-col h-screen border-r relative transition-all duration-300 bg-white 
    ${isCollapsed ? "w-12" : "w-64"} 
    ${sidebarPosition === "right" ? "border-l" : "border-r"}`}
            >
                {/* Collapse/Expand Button */}
                <button
                    className={`absolute top-1/2 transform -translate-y-1/2 z-50 p-2 bg-white border rounded-full shadow-md hover:bg-gray-100
      ${sidebarPosition === "right" ? "left-[-14px]" : "right-[-14px]"}`}
                    onClick={() => setIsCollapsed((prev) => !prev)}
                >
                    <span className="text-lg font-bold text-gray-600">
                        {/* Toggle direction based on side + collapse state */}
                        {sidebarPosition === "right"
                            ? isCollapsed
                                ? "←"
                                : "→"
                            : isCollapsed
                                ? "→"
                                : "←"}
                    </span>
                </button>

                <div className="h-full w-full p-4 overflow-auto">
                    {!isCollapsed && renderNav({ isCollapsed })}
                </div>
            </div>
        </>
    );

    function renderNav({ isCollapsed }) {
        return (
            <nav className="flex flex-col gap-1">
                {sidebar.map(({ id, label, items }) => (
                    <div key={id}>
                        <button
                            onClick={() => toggleDropdown(id)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-gray-50 transition-all"
                        >
                            <span>{!isCollapsed && label}</span>
                            {!isCollapsed && (
                                <svg
                                    className={`w-4 h-4 transform transition-transform ${dropdowns[id] ? 'rotate-180' : 'rotate-0'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </button>
                        {dropdowns[id] && !isCollapsed && (
                            <div className="ml-6 mt-1 flex flex-col gap-1 text-sm text-gray-600">
                                {items.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => item.path && handleNavigation(item.path)}
                                        className="px-2 py-1 hover:text-indigo-600 text-left transition-colors"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <hr className="my-2 border-blue-gray-100" />

                <button onClick={() => handleNavigation('services/inbox')} className="px-3 py-2 text-left hover:text-indigo-600">
                    Inbox
                </button>
                <button onClick={() => handleNavigation('services/profile')} className="px-3 py-2 text-left hover:text-indigo-600">
                    Profile
                </button>
                <button onClick={() => handleNavigation('services/settings')} className="px-3 py-2 text-left hover:text-indigo-600">
                    Settings
                </button>
                <button onClick={handleLogout} className="px-3 py-2 text-left hover:text-indigo-600">
                    {!isCollapsed && 'Log Out'}
                </button>
            </nav>
        );
    }
}

export default Sidebar;
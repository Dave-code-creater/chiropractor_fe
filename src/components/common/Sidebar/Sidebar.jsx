import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../../features/auth/authSlice'
import sidebar from '../../../constants/sidebar'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [dropdowns, setDropdowns] = useState({
        dashboard: true,
        services: true,
    })
    const [mobileOpen, setMobileOpen] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)

    const handleLogout = () => {
        dispatch(logoutUser())
        navigate('/')
    }

    const handleNavigation = (path) => {
        navigate(`/dashboard/${user?.id}/${path}`)
        setMobileOpen(false) // close sidebar on mobile after nav
    }

    const toggleDropdown = (key) => {
        setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <>
            {/* Mobile menu toggle */}
            <div className="lg:hidden p-4">
                <button onClick={() => setMobileOpen(true)}>
                    <Bars3Icon className="h-6 text-gray-700" />
                </button>
            </div>

            {/* Sidebar (Mobile) */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">DR. DIEU PHAN D.C.</h2>
                    <button onClick={() => setMobileOpen(false)}>
                        <XMarkIcon className="h-6 w-6 text-gray-700" />
                    </button>
                </div>
                <div className="p-4">
                    {renderNav({ isCollapsed: false })}
                </div>
            </div>

            {/* Sidebar (Desktop) */}
            {!isCollapsed ? (
                <div className="hidden lg:block w-64 h-screen border-r relative transition-all duration-300">
                    <button
                        className="absolute top-1/2 right-[-14px] -translate-y-1/2 z-50 p-2 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100"
                        onClick={() => setIsCollapsed(true)}
                    >
                        <span className="text-lg font-bold text-gray-600">←</span>
                    </button>
                    <div className="h-full w-full p-4">{renderNav({ isCollapsed: false })}</div>
                </div>
            ) : (
                // Collapsed button only
                <div className="hidden lg:flex items-start justify-start p-2">
                    <button
                        className="mt-4 ml-2 p-2 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 z-50"
                        onClick={() => setIsCollapsed(false)}
                    >
                        <Bars3Icon className="h-6 w-6 text-gray-700" />
                    </button>
                </div>
            )}
        </>
    )

    // Extracted render logic for reuse
    function renderNav({ isCollapsed }) {
        return (
            <>
                <div className="flex items-center gap-4 p-4 mb-4">
                    <button
                        onClick={() => handleNavigation('')}
                        className="text-xl font-semibold text-blue-gray-900"
                    >
                        {!isCollapsed && 'DR. DIEU PHAN D.C.'}
                    </button>
                </div>

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
                                        className={`w-4 h-4 transform transition-transform ${dropdowns[id] ? 'rotate-180' : 'rotate-0'
                                            }`}
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
                    <button
                        onClick={() => handleNavigation('services/inbox')}
                        className="w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-gray-50 text-left hover:text-indigo-600"
                    >
                        Inbox
                    </button>
                    <button
                        onClick={() => handleNavigation('services/profile')}
                        className="w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-gray-50 text-left hover:text-indigo-600"
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => handleNavigation('services/settings')}
                        className="w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-gray-50 text-left hover:text-indigo-600"
                    >
                        Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-gray-50 text-left hover:text-indigo-600"
                    >
                        {!isCollapsed && 'Log Out'}
                    </button>
                </nav>
            </>
        )
    }
}

export default Sidebar
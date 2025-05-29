import React from 'react'
import Blog from '../../../blog/components/Blog'
function Homepage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white  to-indigo-100 font-sans grid grid-cols-8 grid-rows-6 gap-[9px] p-4">

            {/* Initial Report */}
            <div className="bg-white col-span-6 row-span-3 rounded-lg shadow-md p-4 flex flex-col justify-between">
                <h1 className="text-xl font-semibold text-gray-800">Initial Report</h1>
                {/* Add content here */}
            </div>

            {/* Inbox */}
            <div className="bg-blue-100 col-span-2 row-span-2 col-start-7 rounded-lg shadow-md p-4">
                <h1 className="text-lg font-medium text-gray-800">Inbox</h1>
            </div>

            {/* Blog */}
            <div className="bg-green-100 col-span-2 row-span-2 col-start-7 row-start-3 rounded-lg shadow-md p-4">
                <h1 className="text-lg font-medium text-gray-800">Blog</h1>

            </div>

            {/* Doctor Notes */}
            <div className="bg-yellow-100 col-span-2 row-span-2 col-start-7 row-start-5 rounded-lg shadow-md p-4">
                <h1 className="text-lg font-medium text-gray-800">Doctor Notes</h1>
            </div>

            {/* Appointments */}
            <div className="bg-pink-200 col-span-4 row-span-3 col-start-1 row-start-4 rounded-lg shadow-md p-4">
                <h1 className="text-lg font-medium text-gray-800">Appointments</h1>
            </div>

            {/* Profile */}
            <div className="bg-purple-200 col-span-2 row-span-3 col-start-5 row-start-4 rounded-lg shadow-md p-4">
                <h1 className="text-lg font-medium text-gray-800">Profile</h1>
            </div>

        </div>
    )
}

export default Homepage
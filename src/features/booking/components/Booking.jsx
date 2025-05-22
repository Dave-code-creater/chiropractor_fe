


function Booking() {
    return (
        <div classname="relative w-full h-screen bg-cover bg-centen" style="background-image: url('https://images.unsplash.com/photo-1601922027920-4f8a2b1c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60');">
            {/* Black translucent background box */}
            <div className="absolute top-1/2 left-1/2 right-1/2 transform -translate-x-1/2  -translate-y-1/2 bg-black bg-opacity-70 text-white rounded-xl p-8 w-full max-w-3xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Book Your Appointment</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your name" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input type="email" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your email" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input type="tel" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your phone number" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Preferred Date</label>
                        <input type="date" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Book Now</button>
                </form>
            </div>
        </div>
    );
    }
export default Booking;

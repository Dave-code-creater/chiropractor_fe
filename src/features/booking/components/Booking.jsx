import {react, useState, useEffect} from 'react';

function Booking() {
    const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
    const timesSar = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
    const [selectedDate, setSelectedDate] = useState('');
    const dayOfWeek = selectedDate ? new Date(selectedDate).getDay() : null;
    const isTueOrThu = dayOfWeek === 2 || dayOfWeek === 4;
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedTime, setSelectedTime] = useState(isTueOrThu ? times[0] : timesSar[0]);

    const slotButtons = (isTueOrThu ? times : timesSar).map((time, idx) => (
        <button
            key={idx}
            onClick={() => {
                setSelectedTime(time);
                setErrorMessage("");
            }}
            className={`rounded-lg px-4 py-2 border border-gray-400 font-medium transition active:scale-95 ${
                selectedTime === time
                ? "bg-indigo-600 text-white"
                : "bg-white text-black hover:bg-indigo-100"
            }`}
            

        >
            {time}
        </button>
    ));


    return (
        
        <div className=" flex justify-center bg-white from-emerald-100 to-emerald-300 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white text-black w-full">
                {/* Booking Form */}
                <div className="w-full">
                    <div className="relative mx-auto mt-10 mb-10 max-w-2xl overflow-hidden rounded-t-2xl bg-white bg-opacity-100 py-16 text-center">
                        <h1 className="px-8 text-3xl font-bold text-black md:text-5xl">Book an appointment</h1>
                        <p className="mt-4 text-lg text-black">Get an appointment with our experienced chiropractors</p>
                        <img
                            className="absolute top-0 left-0 -z-10 h-full w-full object-cover opacity-30"
                            src="https://images.unsplash.com/photo-1504672281656-e4981d70414b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
                            alt=""
                        />
                    </div>

                    <div className="mx-auto grid max-w-2xl px-6 pb-10">
                        {/* Service Selection */}
                        <div>
                            <p className="font-serif text-xl font-bold text-black">Select a service</p>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                { [
                                    { id: 1, label: "New patient" },
                                    { id: 2, label: "Old patient" },
                                    
                                ].map((service, idx) => (
                                    <div className="relative" key={service.id}>
                                        <input
                                            className="peer hidden"
                                            id={`radio_${service.id}`}
                                            type="radio"
                                            name="radio"
                                            defaultChecked={idx === 0}
                                        />
                                        <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-indigo-500"></span>
                                        <label
                                            className="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg bg-white peer-checked:bg-indigo-600 peer-checked:text-white transition"
                                            htmlFor={`radio_${service.id}`}
                                        >
                                            <span className="mt-2 font-medium">{service.label}</span>
                                            
                                        </label>
                                    </div>
                                )) }
                            </div>
                        </div>

                        {/* Date Picker */}
                        <div>
                            <p className="mt-8 font-serif text-xl font-bold text-black">Select a date</p>
                            <div className="relative mt-4 w-56">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg aria-hidden="true" className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {const date = e.target.value;
                                        const day = new Date(date).getDay();
                                        if (day === 2 || day === 4 || day === 6) {
                                            setSelectedDate(date);
                                            setErrorMessage("");
                                        } else {
                                            setSelectedDate("");
                                            setErrorMessage("Please select a Tuesday, Thursday or Saturday.");
                                        }
                                    
                                    }}  
                                    className="block w-full rounded-lg border border-indigo-300 bg-indigo-50 p-2.5 pl-10 text-black outline-none ring-opacity-30 placeholder:text-black focus:ring focus:ring-indigo-300 sm:text-sm"
                                    placeholder="Select date"
                                />
                               
                            </div>
                               
                            {errorMessage && (  
                                <p className="mt-2 text-sm text-red-500">
                                    {errorMessage}
                                </p>
                            )}
                        </div>

                        {/* Time Selection */}
                        <div>
                            <p className="mt-8 font-serif text-xl font-bold text-black">Select a time</p>
                            <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl ">
                                {slotButtons}
                            </div>
                        </div>

                        {/* Book Now Button */}
                        <button className="mt-8 w-56 rounded-full border-8 border-indigo-400 bg-indigo-600 px-10 py-4 text-lg font-bold text-white transition hover:translate-y-1 hover:bg-indigo-700 shadow-lg mx-auto">
                            Book Now
                        </button>
                    </div>
                </div>

                {/* Contact & Office Hours */}
                <div className="col-span-1 flex flex-col px-8 py-12 items-center md:items-start bg-white bg-opacity-100 rounded-r-2xl">
                    <div className="flex flex-col items-center w-full mt-30">
                        <h2 className=" text-2xl font-bold mb-6 text-center text-indigo-600">Contact Us</h2>
                        <p className="text-lg text-black mb-2">For any inquiries, please reach out to us:</p>
                        <p className="text-lg text-black mb-2">Phone: <span className="font-semibold">+1 720-579-7655</span></p>
                        <p className="text-lg text-black mb-2">Email: <span className="font-semibold">drdieuphanchiropractor@gmai.com</span></p>
                        <p className="text-lg text-black mb-2">Address: <span className="font-semibold">1385W Alameda Ave, Denver, CO, 80223</span></p>

                        <h2 className="text-2xl mt-10 font-bold mb-6 text-center text-indigo-600">Office Hours</h2>
                        <div className="grid grid-rows-3 w-full text-black border border-indigo-400 rounded-xl bg-indigo-50 mx-auto py-4"> 
                            <div className="grid grid-cols-2 px-4 py-2">
                                <p className="text-center text-lg">Tuesday-Thursday:</p>
                                <p className="text-lg text-center">9:00 AM - 5:00 PM</p>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-2">
                                <p className="text-center text-lg">Saturday:</p>
                                <p className="text-lg text-center">10:00 AM - 3:00 PM</p>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-2">
                                <p className="text-center text-lg">Sunday:</p>
                                <p className="text-lg text-center">Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Booking;

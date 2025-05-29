import React, { useState } from 'react';

function Profile() {
    const [areaCode, setAreaCode] = useState("720");
    const [phoneNumber, setPhoneNumber] = useState("567 890");
    const [insurance, setInsurance] = useState("Select or type your insurance…");
    const [numberSSN, setNumberSSN] = useState("123-45-6789");
    const [dateBirth, setDateBirth] = useState("1998-01-01");
    const [ageUser, setAge] = useState("25");
    const [gender, setGender] = useState("male")
    const [nationality, setNationality] = useState("Asia");
    const [medicalHistory, setMedicalHistory] = useState("Allergies: None; Chronic: Hypertension");
    const [homeAdress, setHomeAddress] = useState("1385 W Alameda Ave, Denver, CO 80223");
    const [emergencyContact, setEmergencyContact] = useState("Huy Doan, Spouse, 123-456-7890");
    return (
        <div>
            <div className="hidden text:start md:block">
                <div className="flex flex-col space-y-8 lg:flex-row  lg:space-y-0">
                    <div className="flex-1 lg:max-w-5xl">

                        <div className=" rounded-lg divide-y divide-gray-200">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <dt className="text-md font-bold text-gray-900">Full name:</dt>
                                <dd className="text-md text-gray-900">Huy Doan</dd>

                                {/* SSN */}
                                <dt className="text-md font-bold text-gray-900">SSN:</dt>
                                <dd>
                                    <input
                                        type="number"
                                        onChange={(e) => setNumberSSN(e.target.value)}
                                        id="ssn"
                                        name="ssn"
                                        placeholder="XXX-XX-XXXX"
                                        className="w-full text-md text-gray-900 border rounded-xl∂"
                                        value={numberSSN}

                                    />
                                </dd>

                                {/* Date of Birth */}
                                <dt className="text-md font-bold text-gray-900">Date of Birth:</dt>
                                <dd>
                                    <input
                                        type="date"
                                        id="date"
                                        onChange={(e) => setDateBirth(e.target.value)}
                                        name="date"
                                        className="w-full border rounded-xl∂ text-md"
                                        value={dateBirth}
                                        placeholder='YYYY-MM-DD'
                                    />
                                </dd>

                                {/* Age */}
                                <dt className="text-md font-bold text-gray-900">Age:</dt>
                                <dd>
                                    <input
                                        type="number"
                                        className="w-full text-md text-gray-900 border rounded-xl∂"
                                        value={ageUser}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="XX or XXX"
                                    />
                                </dd>

                                {/* Gender */}
                                <dt className="text-md font-bold text-gray-900">Gender:</dt>
                                <dd className="flex items-center gap-4">
                                    <input
                                        id="gender-male"
                                        name="gender"
                                        type="radio"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-blue-500"

                                    />
                                    <label htmlFor="gender-male" className="text-md text-gray-900">Male</label>
                                    <input
                                        id="gender-female"
                                        name="gender"
                                        type="radio"
                                        value="female"
                                        checked={gender === "female"}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                    />
                                    <label htmlFor="gender-female" className="text-md text-gray-900">Female</label>
                                </dd>

                                {/* Nationality */}
                                <dt className="text-md font-bold text-gray-900">Nationality:</dt>
                                <dd>
                                    <input
                                        className="w-full text-md text-gray-900 border rounded-xl∂"
                                        value={nationality}
                                        type="text"
                                        onChange={(e) => setNationality(e.target.value)}
                                    />
                                </dd>

                                {/* Cell Phone */}
                                <dt className="text-md font-bold text-gray-900">Cell phone:</dt>
                                <dd>
                                    <div className="flex gap-2">
                                        <select
                                            id="areaCode"
                                            name="areaCode"
                                            value={areaCode}
                                            onChange={(e) => setAreaCode(e.target.value)}
                                            className="border border-gray-300 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <optgroup label="Minnesota">
                                                <option value="612">612</option>
                                                <option value="651">651</option>
                                                <option value="763">763</option>
                                                <option value="952">952</option>
                                            </optgroup>
                                            <optgroup label="Colorado">
                                                <option value="303">303</option>
                                                <option value="719">719</option>
                                                <option value="720">720</option>
                                                <option value="970">970</option>
                                            </optgroup>
                                        </select>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="567 890"
                                            className="flex-1∂ text-md border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                </dd>

                                {/* Home Address */}
                                <dt className="text-md font-bold text-gray-900">Home Address:</dt>
                                <dd>
                                    <input
                                        type="text"
                                        className="w-full text-md text-gray-900 border rounded-xl∂"
                                        value={homeAdress}
                                        onChange={(e) => setHomeAddress(e.target.value)}
                                        placeholder="1385 W Alameda Ave, Denver, CO 80223"
                                    />
                                </dd>

                                {/* Medical History */}
                                <dt className="text-md font-bold text-gray-900">Medical History:</dt>
                                <dd>
                                    <textarea
                                        id="medical-history"
                                        rows="2"
                                        className="w-full border rounded-xl∂ text-md text-gray-900"
                                        value={medicalHistory}
                                        onChange={(e) => setMedicalHistory(e.target.value)}
                                        placeholder="Allergies: None; Chronic: Hypertension; Surgeries: None; Medications: None"
                                    >Allergies: None; Chronic: Hypertension; Surgeries: None; Medications: None</textarea>

                                </dd>

                                {/* Medical Insurance */}
                                <dt className="text-md font-bold text-gray-900">Medical Insurance:</dt>
                                <dd>
                                    <div className="flex flex-col gap-2">
                                        <select
                                            id="insuranceSelect"
                                            name="insurance"
                                            value={insurance}
                                            onChange={(e) => setInsurance(e.target.value)}
                                            className="border border-gray-300 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        >
                                            <option value="Select or type your insurance…" disabled>Select or type your insurance…</option>
                                            <option value="Group Insurance">Group Insurance</option>
                                            <option value="Blue Cross / Blue Shield">Blue Cross / Blue Shield</option>
                                            <option value="Worker’s Compensation">Worker’s Compensation</option>
                                            <option value="Auto Insurance">Auto Insurance</option>
                                            <option value="Medicare">Medicare</option>
                                            <option value="Personal Injury">Personal Injury</option>
                                            <option value="Other Insurance">Other Insurance</option>
                                        </select>
                                        <input
                                            type="file"
                                            multiple
                                            className="w-full border rounded-xl∂"
                                            placeholder="Choose your file"
                                        />
                                    </div>
                                </dd>

                                {/* Date & Time of Accident */}
                                {/* <dt className="text-md font-bold text-gray-900 col-span-1 md:col-span-2">Date & Time of Accident:</dt>
                                <dd className="col-span-1 md:col-span-2 flex flex-wrap gap-4 items-center">
                                    <label htmlFor="dateAccident" className="text-md text-gray-900">Date:</label>
                                    <input
                                        type="date"
                                        id="dateAccident"
                                        name="dateAccident"
                                        value={dateAccident}
                                        onChange={e => setDateAccident(e.target.value)}
                                        className="text-center w-48 border rounded-xl∂py-1 text-md"
                                    />
                                    <label htmlFor="timeAccident" className="text-md text-gray-900">Time:</label>
                                    <input
                                        type="time"
                                        id="timeAccident"
                                        name="timeAccident"
                                        value={timeAccident}
                                        onChange={e => setTimeAccident(e.target.value)}
                                        className="w-32 border rounded-xl∂py-1 text-md"
                                    />
                                </dd>

                                {/* Location of Accident */}
                                {/* <dt className="text-md font-bold text-gray-900">Location of Accident:</dt>
                                <dd>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        defaultValue="1385 W Alameda Ave, Denver, CO 80223"
                                        className="w-full border rounded-xl∂py-1"
                                    />
                                </dd>

                                {/* How it occurs */}
                                {/* <dt className="text-md font-bold text-gray-900">How it occurs:</dt>
                                <dd>
                                    <input
                                        type="text"
                                        id="howItOccurs"
                                        name="howItOccurs"
                                        defaultValue="Auto collision"
                                        className="w-full border rounded-xl∂py-1"
                                    />
                                </dd>  */}

                                {/* Emergency Contact */}
                                <dt className="text-md font-bold text-gray-900">Emergency Contact:</dt>
                                <dd>
                                    <input
                                        id="emergency-contact"
                                        type="text"
                                        className="w-full∂border rounded-xl focus:ring-2 focus:ring-blue-500"
                                        value={emergencyContact}
                                        onChange={(e) => setEmergencyContact(e.target.value)}
                                        placeholder="Name, Relationship, Phone Number"
                                    />
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;


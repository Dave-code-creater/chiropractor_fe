import React, { useState } from 'react';
import {
    Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import {
    Popover, PopoverTrigger, PopoverContent
} from "@/components/ui/popover";
import {
    Button
} from "@/components/ui/button";
import {
    Command, CommandInput, CommandItem, CommandGroup, CommandEmpty
} from "@/components/ui/command";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { toast } from "sonner";

function Profile() {
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateBirth, setDateBirth] = useState("01/01/1998");
    const [gender, setGender] = useState("Male");
    const [race, setRace] = useState("Asian");

    const [areaCode, setAreaCode] = useState("720");
    const [phoneNumber, setPhoneNumber] = useState("567 890");
    const [email, setEmail] = useState("your@email.com");
    const [homeAdress, setHomeAddress] = useState("1385 W Alameda Ave, Denver, CO 80223");

    const [emergencyName, setEmergencyName] = useState("");
    const [emergencyRelation, setEmergencyRelation] = useState("");
    const [emergencyPhone, setEmergencyPhone] = useState("");
    const [emergencyPhoneCode, setEmergencyPhoneCode] = useState("720");

    const [insurance, setInsurance] = useState("");
    const [insuranceOpen, setInsuranceOpen] = useState(false);
    const [numberSSN, setNumberSSN] = useState("123-45-6789");
    const [hasAllergies, setHasAllergies] = useState("No");
    const [allergies, setAllergies] = useState("");
    const [medicalHistory, setMedicalHistory] = useState("");

    const [maritalStatus, setMaritalStatus] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [hearingIssues, setHearingIssues] = useState("No");
    const [visionIssues, setVisionIssues] = useState("No");



    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">User Profile</h1>

                <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="mb-6 flex justify-center space-x-4">
                        <TabsTrigger value="personal">Personal Info</TabsTrigger>
                        <TabsTrigger value="contact">Contact Info</TabsTrigger>
                        <TabsTrigger value="medical">Medical Info</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal">
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField label="First Name" value={firstName} onChange={setFirstName} />
                            <FormField label="Middle Name (Optional)" value={middleName} onChange={setMiddleName} />
                            <FormField label="Last Name" value={lastName} onChange={setLastName} />
                            <FormField label="Date of Birth" value={dateBirth} onChange={setDateBirth} placeholder="dd/mm/yyyy" />
                            <FormSelect label="Gender" value={gender} onChange={setGender} options={["Male", "Female", "Other"]} />
                            <FormSelect label="Race" value={race} onChange={setRace} options={["Asian", "Black", "White", "Hispanic", "Native American", "Other"]} />
                            <FormSelect label="Marital Status" value={maritalStatus} onChange={setMaritalStatus} options={["Single", "Married", "Widowed", "Divorced"]} />
                        </div>
                    </TabsContent>

                    <TabsContent value="contact">
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField label="Email Address" value={email} onChange={setEmail} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="flex gap-2">
                                    <Select value={areaCode} onValueChange={setAreaCode}>
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="720">+1 (720)</SelectItem>
                                            <SelectItem value="303">+1 (303)</SelectItem>
                                            <SelectItem value="970">+1 (970)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <input
                                        type="tel"
                                        className="flex-1 border rounded-md px-3 py-2 text-sm"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                            <FormField label="Home Address" value={homeAdress} onChange={setHomeAddress} />
                            <div className="md:col-span-2">
                                <TooltipProvider>
                                    <div className="flex items-center gap-1 mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                Full name, relationship, and phone number of someone we can call in an emergency.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TooltipProvider>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <FormField label="Name" value={emergencyName} onChange={setEmergencyName} />
                                    <FormField label="Relationship" value={emergencyRelation} onChange={setEmergencyRelation} />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <div className="flex gap-2">
                                            <Select value={emergencyPhoneCode} onValueChange={setEmergencyPhoneCode}>
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="720">+1 (720)</SelectItem>
                                                    <SelectItem value="303">+1 (303)</SelectItem>
                                                    <SelectItem value="970">+1 (970)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <input
                                                type="tel"
                                                className="flex-1 border rounded-md px-3 py-2 text-sm"
                                                value={emergencyPhone}
                                                onChange={(e) => setEmergencyPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="medical">
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField label="SSN" value={numberSSN} onChange={setNumberSSN} />
                            <FormField label="Height (inch)" value={height} onChange={setHeight} />
                            <FormField label="Weight (feet)" value={weight} onChange={setWeight} />
                            <FormSelect label="Blood Type" value={bloodType} onChange={setBloodType} options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} />
                            <FormSelect label="Hearing Difficulty?" value={hearingIssues} onChange={setHearingIssues} options={["No", "Yes"]} />
                            <FormSelect label="Vision Difficulty?" value={visionIssues} onChange={setVisionIssues} options={["No", "Yes"]} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                                <Popover open={insuranceOpen} onOpenChange={setInsuranceOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {insurance || "Select or type insurance"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Type or search insurance..." />
                                            <CommandEmpty>No match found.</CommandEmpty>
                                            <CommandGroup>
                                                {["Medicare", "Private", "Blue Cross", "Cigna"].map((item) => (
                                                    <CommandItem
                                                        key={item}
                                                        onSelect={() => {
                                                            setInsurance(item);
                                                            setInsuranceOpen(false);
                                                        }}
                                                    >
                                                        {item}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <FormSelect
                                    label="Known Allergies"
                                    value={hasAllergies}
                                    onChange={setHasAllergies}
                                    options={["No", "Yes"]}
                                />
                                {hasAllergies === "Yes" && (
                                    <div className='mt-4'>
                                        <FormField
                                            label="Allergy Details"
                                            value={allergies}
                                            onChange={setAllergies}
                                            placeholder="e.g., Penicillin, peanuts"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                                <textarea
                                    className="w-full border rounded-md px-3 py-2 text-sm"
                                    rows="4"
                                    value={medicalHistory}
                                    onChange={(e) => setMedicalHistory(e.target.value)}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <Button
                    className="mt-6 w-full"
                    onClick={() => {
                        toast.success("Your profile was updated successfully.");
                    }}
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}

function FormField({ label, value, onChange, readOnly = false, type = "text", placeholder = "" }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                readOnly={readOnly}
                placeholder={placeholder}
            />
        </div>
    );
}

function FormSelect({ label, value, onChange, options }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
}

export default Profile;
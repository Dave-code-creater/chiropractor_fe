import React from 'react'
import { toast } from "sonner";
import {
    Select, SelectTrigger, SelectValue,
    SelectContent, SelectItem
} from "@/components/ui/select";
import { Info } from "lucide-react";
import {
    Tooltip, TooltipContent,
    TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

function MedicalInfo() {
    const [bloodType, setBloodType] = React.useState('');
    const [allergies, setAllergies] = React.useState('');
    const [conditions, setConditions] = React.useState('');
    const [physicianName, setPhysicianName] = React.useState('');
    const [physicianPhoneCode, setPhysicianPhoneCode] = React.useState('');
    const [physicianPhone, setPhysicianPhone] = React.useState('');
    const [insuranceProvider, setInsuranceProvider] = React.useState('');
    const [policyNumber, setPolicyNumber] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            bloodType,
            allergies,
            conditions,
            physicianName,
            physicianPhoneCode,
            physicianPhone,
            insuranceProvider,
            policyNumber
        });
        toast.success("Medical information updated successfully!");
    }

    return (
        <div className="w-full space-y-8">
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 border border-gray-200">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Update Your Medical Information</h2>
                    <p className="text-sm text-gray-500 mt-1">Edit your medical profile for emergencies and care coordination.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                            <Select value={bloodType} onValueChange={setBloodType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <FormField label="Known Allergies" value={allergies} onChange={setAllergies} placeholder="e.g. Penicillin, Nuts" />
                        <FormField label="Chronic Conditions" value={conditions} onChange={setConditions} placeholder="e.g. Diabetes, Hypertension" />
                        <FormField label="Primary Physician" value={physicianName} onChange={setPhysicianName} />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Physician Phone</label>
                            <div className="flex gap-2">
                                <Select value={physicianPhoneCode} onValueChange={setPhysicianPhoneCode}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Code" />
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
                                    value={physicianPhone}
                                    onChange={(e) => setPhysicianPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <FormField label="Insurance Provider" value={insuranceProvider} onChange={setInsuranceProvider} />
                        <FormField label="Policy Number" value={policyNumber} onChange={setPolicyNumber} />
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        Save Changes
                    </Button>
                </form>
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

export default MedicalInfo;
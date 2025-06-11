import React from 'react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import {
    Button
} from "@/components/ui/button";
import { toast } from "sonner";
export default function PersonalInfo() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [middleName, setMiddleName] = React.useState('');
    const [dateOfBirth, setDateOfBirth] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [race, setRace] = React.useState('');
    const [maritalStatus, setMaritalStatus] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({
            firstName,
            middleName,
            lastName,
            dateOfBirth,
            race,
            gender,
            maritalStatus
        });

        toast.success("Information updated successfully!");
    }

    return (
        <div className="w-full space-y-8">
            <div className="max-w-4xl mx-auto bg-card shadow-sm rounded-xl p-8 border border-border">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Manage your information</h2>
                    <p className="text-sm text-muted-foreground mt-1">Edit your general information</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField label="First Name" value={firstName} onChange={setFirstName} />
                        <FormField label="Middle Name (Optional)" value={middleName} onChange={setMiddleName} />
                        <FormField label="Last Name" value={lastName} onChange={setLastName} />
                        <FormField label="Date of Birth" value={dateOfBirth} onChange={setDateOfBirth} placeholder="dd/mm/yyyy" />

                        {/* Gender Select */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Gender</label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {["Male", "Female", "Other"].map((option) => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Race Select */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Race</label>
                            <Select value={race} onValueChange={setRace}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {["Asian", "Black", "White", "Hispanic", "Native American", "Other"].map((option) => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Marital Status Select */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Marital Status</label>
                            <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {["Single", "Married", "Widowed", "Divorced"].map((option) => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full text-primary-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2  focus:ring-offset-2"
                        onClick={handleSubmit}
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
            <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
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
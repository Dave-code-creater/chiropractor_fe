import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import API service for profile updates
import { useUpdateProfileMutation } from "@/api/services/profileApi";

export default function PersonalInfo() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [race, setRace] = React.useState("");
  const [maritalStatus, setMaritalStatus] = React.useState("");

  // API mutation hook
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Transform to snake_case format for backend
    const profileData = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      gender: gender,
      race: race,
      marital_status: maritalStatus,
    };

    try {
      const response = await updateProfile(profileData).unwrap();
      
      if (response.success) {
        toast.success("Personal information updated successfully!");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error.data?.message || 
        "Failed to update personal information. Please try again."
      );
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage your information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Edit your general information
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="First Name"
              value={firstName}
              onChange={setFirstName}
              required
            />
            <FormField
              label="Middle Name (Optional)"
              value={middleName}
              onChange={setMiddleName}
            />
            <FormField
              label="Last Name"
              value={lastName}
              onChange={setLastName}
              required
            />
            <FormField
              label="Date of Birth"
              value={dateOfBirth}
              onChange={setDateOfBirth}
              type="date"
              required
            />

            {/* Gender Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {["Male", "Female", "Other"].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Race Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Race/Ethnicity
              </label>
              <Select value={race} onValueChange={setRace}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Asian",
                    "Black",
                    "White",
                    "Hispanic",
                    "Native American",
                    "Other",
                  ].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Marital Status Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marital Status
              </label>
              <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {["Single", "Married", "Widowed", "Divorced"].map(
                    (option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  readOnly = false,
  type = "text",
  placeholder = "",
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        className="w-full border rounded-md px-3 py-2 text-sm"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

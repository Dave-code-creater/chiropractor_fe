import React from "react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import FormattedInput from "../../../components/forms/FormattedInput";

// Import API service for contact updates
import { useUpdateContactInfoMutation } from "@/api/services/profileApi";

function ContactInfo() {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [homeAddress, setHomeAddress] = React.useState("");
  const [state, setState] = React.useState("");
  const [city, setCity] = React.useState("");
  const [zipCode, setZipCode] = React.useState("");
  const [emergencyName, setEmergencyName] = React.useState("");
  const [emergencyRelation, setEmergencyRelation] = React.useState("");
  const [emergencyPhone, setEmergencyPhone] = React.useState("");

  // API mutation hook
  const [updateContactInfo, { isLoading }] = useUpdateContactInfoMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transform to snake_case format for backend
    const contactData = {
      phone_number: phoneNumber,
      home_address: homeAddress,
      city: city,
      state: state,
      zip_code: zipCode,
      emergency_contact: {
        name: emergencyName,
        relationship: emergencyRelation,
        phone_number: emergencyPhone,
      },
    };

    try {
      const response = await updateContactInfo(contactData).unwrap();

      if (response.success) {
        toast.success("Contact information updated successfully!");
      }
    } catch (error) {
      console.error("Contact update error:", error);
      toast.error(
        error.data?.message ||
        "Failed to update contact information. Please try again."
      );
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Update Contact Information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Edit your address, phone number and emergency contact
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Home Address"
              value={homeAddress}
              onChange={setHomeAddress}
            />
            <FormField label="City" value={city} onChange={setCity} />
            <FormField label="State" value={state} onChange={setState} />
            <FormField
              label="ZIP Code"
              value={zipCode}
              onChange={setZipCode}
              type="number"
              placeholder="Enter ZIP code"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <FormattedInput
                type="phone"
                value={phoneNumber}
                onChange={setPhoneNumber}
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <TooltipProvider>
                <div className="flex items-center gap-1 mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Emergency Contact
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Full name, relationship, and phone number of someone we
                      can call in an emergency.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Name"
                  value={emergencyName}
                  onChange={setEmergencyName}
                />
                <FormField
                  label="Relationship"
                  value={emergencyRelation}
                  onChange={setEmergencyRelation}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <FormattedInput
                    type="phone"
                    value={emergencyPhone}
                    onChange={setEmergencyPhone}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full  text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2  focus:ring-offset-2"
            onClick={handleSubmit}
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
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
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

export default ContactInfo;

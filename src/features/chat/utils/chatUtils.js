import { Users, UserCheck, Stethoscope, Shield } from "lucide-react";

export const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) {
        return "Just now";
    }

    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
    }

    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
    }

    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}d ago`;
    }

    return date.toLocaleDateString();
};

export const getRoleIconComponent = (role) => {
    const iconClass = "h-2.5 w-2.5 sm:h-3 sm:w-3";

    switch (role?.toLowerCase()) {
        case 'patient':
            return <Users className={`${iconClass} text-blue-600`} />;
        case 'doctor':
            return <Stethoscope className={`${iconClass} text-green-600`} />;
        case 'admin':
            return <Shield className={`${iconClass} text-purple-600`} />;
        default:
            return <UserCheck className={`${iconClass} text-gray-600`} />;
    }
};

export const extractDataFromResponse = (data) => {
    if (!data) return [];

    if (Array.isArray(data))
        return data;

    if (data.data) {
        if (Array.isArray(data.data)) return data.data;
        if (data.data.conversations) return data.data.conversations;
        if (data.data.messages) return data.data.messages;
        if (data.data.users)
            return data.data.users;

        if (data.data.doctors && Array.isArray(data.data.doctors))
            return data.data.doctors;
        if (data.data.admin && Array.isArray(data.data.admin))
            return data.data.admin;

        if (data.data.doctors || data.data.admin) {
            const combined = [];
            if (data.data.doctors) combined.push(...data.data.doctors);
            if (data.data.admin) combined.push(...data.data.admin);
            return combined;
        }
    }

    if (data.conversations) return data.conversations;
    if (data.messages) return data.messages;
    if (data.users) return data.users;

    return [];
};

export const getParticipantInfo = (conversation, userRole) => {
    if (!conversation) {
        return { name: "Unknown", role: "unknown", avatar: null };
    }

    const isCurrentUserPatient = userRole === 'patient';

    if (isCurrentUserPatient) {
        let doctorName = conversation.doctor_name || "Healthcare Provider";

        doctorName = doctorName.replace(/\b(null|undefined)\b/gi, '').replace(/ +/g, ' ').trim();
        if (!doctorName) doctorName = "Healthcare Provider";

        return {
            name: doctorName,
            role: "doctor",
            avatar: null
        };
    } else {
        let patientName =
            conversation.patient_name ||
            conversation.full_name ||
            ((conversation.patient_first_name && conversation.patient_last_name)
                ? `${conversation.patient_first_name} ${conversation.patient_last_name}`
                : null) ||
            ((conversation.first_name && conversation.last_name)
                ? `${conversation.first_name} ${conversation.last_name}`
                : null) ||
            conversation.username ||
            "Patient";

        patientName = patientName.replace(/\b(null|undefined)\b/gi, '').replace(/ +/g, ' ').trim();
        if (!patientName) patientName = "Patient";

        return {
            name: patientName,
            role: "patient",
            avatar: null
        };
    }
};

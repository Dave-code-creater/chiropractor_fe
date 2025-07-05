import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from '@/state/data/authSlice';
import DoctorAppointments from './doctor/DoctorAppointments';
import PatientAppointments from './patient/PatientAppointments';
import StaffAppointments from './staff/StaffAppointments';

const AppointmentManagement = () => {
  const userRole = useSelector(selectUserRole);

  const renderRoleBasedView = () => {
    switch (userRole) {
      case 'doctor':
        return <DoctorAppointments />;
      case 'patient':
        return <PatientAppointments />;
      case 'staff':
      case 'admin':
        return <StaffAppointments />;
      default:
        return <div>Unauthorized Access</div>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {renderRoleBasedView()}
    </div>
  );
};

export default AppointmentManagement;

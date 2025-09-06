# API Services Documentation

## Overview
This directory contains RTK Query API services with unique, non-overlapping responsibilities.

## API Services

### 1. **authApi** - Authentication & Authorization
- `login` - User authentication
- `register` - User registration
- `logout` - User logout
- `forgotPassword` - Password reset request
- `resetPassword` - Password reset with token
- `verifyResetToken` - Validate reset token
- `oauthLogin` - OAuth-based authentication

### 2. **userApi** - User & Patient Management
- `getUserProfile` - Get current user profile
- `createPatient` - Create new patient record
- `getPatients` - List all patients with filtering
- `getPatientById` - Get specific patient details
- `updatePatient` - Update patient information

### 3. **profileApi** - Profile Updates
- `updateProfile` - Update personal information
- `updateContactInfo` - Update contact details
- `updateMedicalInfo` - Update medical information

### 4. **appointmentApi** - Appointment Management
- `getAvailableDoctors` - Get doctors available for appointments
- `getDoctorAvailability` - Check doctor's available time slots
- `createAppointment` - Schedule new appointment
- `getMyAppointments` - Get user's appointments
- `getAppointments` - List all appointments (staff/admin)
- `updateAppointment` - Modify appointment details
- `getPatientAppointments` - Get appointments for specific patient
- `checkAvailability` - Validate appointment slot
- `getAppointmentStats` - Appointment statistics
- `getAppointmentById` - Get specific appointment
- `rescheduleAppointment` - Change appointment time
- `cancelAppointment` - Cancel appointment

### 5. **clinicalNotesApi** - Clinical Documentation
- `getClinicalNotes` - List clinical notes with filters
- `getClinicalNotesByPatient` - Patient-specific notes
- `getClinicalNote` - Single note details
- `createClinicalNote` - Create new clinical note
- `updateClinicalNote` - Edit clinical note
- `deleteClinicalNote` - Remove clinical note
- `createSOAPNote` - Create SOAP format note
- `updateSOAPNote` - Edit SOAP note
- `getSOAPNotes` - List SOAP notes
- `searchClinicalNotes` - Search through notes
- `getNoteTemplates` - Get note templates
- `getTreatmentPlan` - Get treatment plan
- `updateTreatmentPlan` - Edit treatment plan
- `createTreatmentPlan` - Create treatment plan
- `getPatientIncidents` - Patient incident history
- `getIncidentDetails` - Specific incident details
- `getPatientCase` - Patient case overview
- `getPatientNotes` - Patient clinical notes
- `createPatientNote` - Add note to patient
- `updatePatientNote` - Edit patient note
- `deletePatientNote` - Remove patient note
- `getDoctorPatients` - Get doctor's assigned patients

### 6. **doctorScheduleApi** - Doctor Schedule Management
- `getDoctorProfiles` - List doctor profiles with schedules
- `getDoctorProfile` - Specific doctor profile
- `updateDoctorProfile` - Edit doctor profile
- `getDoctorWorkingHours` - Get doctor's working hours
- `updateDoctorWorkingHours` - Set doctor's working hours
- `getDoctorSchedule` - Get doctor's schedule
- `getAllDoctorsSchedule` - All doctors' schedules
- `getTimeOffRequests` - Time-off requests
- `createTimeOffRequest` - Request time off
- `updateTimeOffRequest` - Edit time-off request
- `deleteTimeOffRequest` - Cancel time-off request
- `approveTimeOffRequest` - Approve/deny time off
- `getDoctorConflicts` - Schedule conflicts
- `getScheduleStatistics` - Schedule analytics

### 7. **chatApi** - Communication System
- `createConversation` - Start new conversation
- `getConversationUsers` - Get available users for chat
- `getConversations` - List user's conversations
- `getConversation` - Get specific conversation
- `updateConversationStatus` - Change conversation status
- `deleteConversation` - Remove conversation
- `getMessages` - Get conversation messages
- `sendMessage` - Send new message
- `pollForNewMessages` - Check for new messages
- `getMessageStatus` - Message delivery status
- `getAvailableUsers` - Get users available for chat

### 8. **blogApi** - Content Management
- `getBlogPosts` - List blog posts
- `createBlogPost` - Create new blog post
- `getBlogPostById` - Get specific blog post
- `updateBlogPost` - Edit blog post
- `deleteBlogPost` - Remove blog post
- `publishBlogPost` - Publish blog post
- `getPublicBlogPosts` - Public blog posts
- `getCategories` - Blog categories

### 9. **reportApi** - Incident Reporting
- `createIncident` - Report new incident
- `getIncidents` - List incidents
- `getIncidentById` - Get specific incident
- `updateIncident` - Edit incident
- `deleteIncident` - Remove incident
- `saveIncidentForm` - Save incident form
- `updateIncidentForm` - Edit incident form
- `addIncidentNote` - Add note to incident
- `getCompleteIncidentForms` - Get complete forms
- `getIncidentForm` - Get specific form
- `submitIncidentForms` - Submit incident forms
- `submitPatientInfoForm` - Submit patient info
- `submitHealthInsuranceForm` - Submit insurance form
- `submitPainDescriptionFormNew` - Submit pain description
- `submitPainAssessmentFormNew` - Submit pain assessment
- `submitMedicalHistoryFormNew` - Submit medical history
- `submitLifestyleImpactFormNew` - Submit lifestyle impact

## Key Changes Made
1. **Removed Duplicates**: Eliminated `getPatients` from `appointmentApi` and `clinicalNotesApi` - now only in `userApi`
2. **Renamed for Clarity**: Changed `getDoctors` to `getAvailableDoctors` in `appointmentApi`
3. **Added Missing Endpoint**: Added `getUserProfile` to `userApi`
4. **Clean Structure**: Each API now has a single, clear responsibility

## Usage Guidelines
- Use the appropriate API based on the feature area
- Patient data queries should use `userApi`
- Doctor availability queries should use `appointmentApi`
- Doctor profile management should use `doctorScheduleApi`
- All authentication should use `authApi`
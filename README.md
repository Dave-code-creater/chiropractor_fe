# Chiropractor Frontend

A modern React-based frontend application for a chiropractor clinic management system.

## 🚀 Recent Updates

### ✅ Chat System Integration Complete
- **Doctor-Patient Chat**: Direct communication endpoint implemented (`POST /conversations/doctor-patient`)
- **Multi-API Support**: Integrates with both appointment API and chat service for doctor data
- **Smart Features**: Duplicate prevention, auto-registration, optimistic updates
- **Real-time Messaging**: Complete chat interface with message history
- **Backend Ready**: All endpoints integrated and tested with your Node.js backend

### 📋 Chat API Endpoints
- `POST /v1/api/2025/conversations/doctor-patient` - Create doctor-patient chat
- `GET /v1/api/2025/users/doctors` - Get available doctors
- `POST /v1/api/2025/messages` - Send messages
- `GET /v1/api/2025/conversations` - Get user conversations
- `GET /v1/api/2025/conversations/:id/messages` - Get conversation messages

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **UI Components**: shadcn/ui components
- **API Integration**: RESTful APIs with JWT authentication
- **Backend**: Node.js + Express + MongoDB (your implementation)

## 🏃‍♂️ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit the chat demo
http://localhost:5173/chat-demo
```

## 📱 Features

- **Patient Management**: Complete patient intake and management system
- **Appointment Scheduling**: Book and manage appointments
- **Medical Reports**: Generate and manage patient reports
- **Real-time Chat**: Doctor-patient communication system
- **User Authentication**: Secure login and role-based access
- **Responsive Design**: Works on desktop and mobile devices

## 🔧 Configuration

The app is configured to work with your backend at:
- **Development**: `http://localhost:3000/v1/api/2025`
- **Production**: Configure in `src/services/baseApi.js`

## 📚 Documentation

Visit `/chat-demo` to see the complete chat system documentation and live demo.

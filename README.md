# Chiropractor Practice Management System - Frontend

> **Dr. Dieu Phan D.C.** - Modern React-based frontend for chiropractic clinic management

A comprehensive, production-ready frontend application built with React and modern web technologies for managing chiropractic clinic operations, patient records, appointments, and doctor-patient communication.

## ⚡ Performance Optimizations (NEW!)

**Recent optimizations implemented:**

✅ **Route-based lazy loading** - Reduces initial bundle by ~80%  
✅ **Image lazy loading** - Progressive image loading  
✅ **Advanced code splitting** - 40+ optimized chunks  
✅ **Error boundaries** - Graceful error handling  

⚠️ **ACTION REQUIRED:** Compress background images (currently 16MB → should be <1MB)
- Use [Squoosh.app](https://squoosh.app/) or [TinyPNG](https://tinypng.com/)
- Convert to WebP format, 75-80% quality
- Target: Each image < 200KB

**Performance Monitoring:**
```javascript
import { performanceTracker } from '@/api/core/baseApi';
console.log(performanceTracker.getStats()); // View API performance
```

---

## 🎯 Overview

This is the complete frontend application for Dr. Dieu Phan's chiropractic practice management system. It provides an intuitive, responsive interface for patients, doctors, and administrators to manage all aspects of clinic operations.

### Key Features

- **🔐 Secure Authentication**: JWT-based authentication with refresh token support
- **👥 Patient Management**: Complete patient intake, records, and medical history
- **📅 Appointment Scheduling**: Intelligent booking system with doctor availability
- **💬 Real-time Chat**: Doctor-patient messaging system with live updates
- **📝 Clinical Documentation**: SOAP notes, vitals tracking, and medical records
- **📊 Reports & Analytics**: Patient reports and clinic analytics
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI**: Clean, professional interface using shadcn/ui components
- **♿ Accessibility**: WCAG compliant with keyboard navigation support
- **🌐 PWA Ready**: Progressive Web App capabilities for offline access
- **📱 Mobile Apps**: Native iOS and Android apps via Capacitor
- **⚡ Performance**: Lazy loading, code splitting, and optimized bundles

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend Framework** | React 18 with Hooks + Lazy Loading |
| **Build Tool** | Vite (fast HMR & optimized builds) |
| **State Management** | Redux Toolkit + RTK Query |
| **Styling** | Tailwind CSS 3 |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Forms** | React Hook Form + Zod validation |
| **Routing** | React Router v6 + Code Splitting |
| **HTTP Client** | Fetch API with custom interceptors |
| **Authentication** | JWT tokens with secure storage |
| **Icons** | Radix Icons + Lucide React |
| **Date Handling** | date-fns |
| **Mobile Apps** | Capacitor 7 (iOS & Android) |
| **Testing** | Vitest + React Testing Library |
| **Code Quality** | ESLint + Prettier |
| **Performance** | Lazy Loading + Advanced Code Splitting |

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **Backend API**: Running on `http://localhost:3000` (see backend README)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd chiropractor_fe

# 2. Install dependencies
npm install

# 3. Create environment file (optional)
cp .env.example .env

# 4. Configure environment (if needed)
# The app auto-detects localhost for development
# Edit .env only if using custom API endpoint

# 5. Start development server
npm run dev

# 6. Open your browser
# Visit: http://localhost:5173
```

The application will automatically connect to your backend API at `http://localhost:3000/api/v1/2025`.

### First-Time Setup

After starting the app:

1. **Register a new account** or login with existing credentials
2. **Complete your profile** with required information
3. **Explore features** based on your role (Patient/Doctor/Admin)

### Development Server

```bash
# Start with hot-reload
npm run dev

# The app will be available at:
# - Local:   http://localhost:5173
# - Network: http://[your-ip]:5173
```

## 📱 Building for Production

### Web Application

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Build output will be in ./dist directory
```

### Mobile Applications

#### Android

```bash
# Build and sync Android app
npm run mobile:android

# This will:
# 1. Build the web app
# 2. Copy to Capacitor Android project
# 3. Open Android Studio
```

#### iOS

```bash
# Build and sync iOS app
npm run mobile:ios

# This will:
# 1. Build the web app
# 2. Copy to Capacitor iOS project
# 3. Open Xcode
```

### Desktop Application (Electron)

```bash
# Start electron in development
npm run electron:dev

# Build desktop apps
npm run dist              # All platforms
npm run dist:win          # Windows
npm run dist:mac          # macOS
npm run dist:linux        # Linux
```

## 🌍 Environment Configuration

### API Configuration

The app automatically detects the environment and connects to the appropriate API:

**Development** (localhost):
```
http://localhost:3000/api/v1/2025
```

**Staging**:
```
http://staging.drdieuphanchiropractor.com/api/v1/2025
```

**Production**:
```
https://api.drdieuphanchiropractor.com/api/v1/2025
```

### Custom Configuration

Create `.env` file for custom settings:

```env
# API Environment (development, staging, production)
VITE_API_ENVIRONMENT=development

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=true
```

The app intelligently determines the API URL:
1. Uses `VITE_API_ENVIRONMENT` if set
2. Detects `staging` subdomain
3. Falls back to `localhost` for development
4. Uses production URL otherwise

## 📁 Project Structure

```
chiropractor_fe/
├── src/
│   ├── main.jsx                     # Application entry point
│   ├── App.jsx                      # Root component with routing
│   ├── api/                         # API integration layer
│   │   ├── config/
│   │   │   └── config.js           # API URLs and configuration
│   │   ├── core/
│   │   │   ├── baseApi.js          # Base API client with interceptors
│   │   │   └── tokenManager.js     # JWT token management
│   │   └── index.js
│   ├── components/                  # Reusable React components
│   │   ├── auth/                   # Authentication components
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── forms/                  # Form components
│   │   ├── chat/                   # Chat components
│   │   └── ...
│   ├── pages/                       # Page components (routes)
│   │   ├── Dashboard/
│   │   ├── Appointments/
│   │   ├── Patients/
│   │   ├── Chat/
│   │   ├── Profile/
│   │   └── ...
│   ├── layouts/                     # Layout components
│   │   ├── MainLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── ...
│   ├── features/                    # Feature-based modules
│   │   ├── appointments/
│   │   ├── patients/
│   │   ├── chat/
│   │   └── ...
│   ├── store/                       # Redux store configuration
│   │   ├── index.js
│   │   └── slices/
│   ├── routes/                      # Route definitions
│   │   └── index.jsx
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useNotification.js
│   │   └── ...
│   ├── utils/                       # Utility functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── ...
│   ├── constants/                   # Constants and enums
│   ├── contexts/                    # React contexts
│   ├── assets/                      # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   └── lib/                         # Third-party library configs
├── public/                          # Public static files
├── android/                         # Capacitor Android project
├── ios/                            # Capacitor iOS project
├── test/                           # Test files
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── capacitor.config.ts             # Capacitor configuration
└── package.json                    # Dependencies and scripts
```

## 🎨 Key Features

### 🔐 Authentication & Security
- JWT-based authentication with auto-refresh
- Secure token storage
- Role-based access control (Patient, Doctor, Admin)
- OAuth integration (Google)
- Password reset flow
- Session timeout handling
- Token expiration monitoring

### 👥 Patient Management
- Comprehensive intake forms
- Medical history tracking
- Insurance information
- Emergency contacts
- Document uploads
- Patient search and filtering

### 📅 Appointment System
- Visual calendar interface
- Doctor availability checking
- Multiple appointment types
- Email/SMS reminders
- Easy rescheduling
- Recurring appointments
- Appointment history

### 💬 Real-Time Chat
- Doctor-patient messaging
- Conversation history
- Unread message indicators
- Typing indicators
- File attachments
- Message search
- Long-polling for real-time updates

### 📊 Analytics & Reports
- Patient analytics dashboard
- Treatment history reports
- Export to PDF/CSV
- Custom report generation
- Data visualizations

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Run linting
npm run lint:check       # Check without fixing
npm test                 # Run tests

# Mobile
npm run mobile:build     # Build and sync
npm run mobile:android   # Open Android Studio
npm run mobile:ios       # Open Xcode

# Desktop (Electron)
npm run electron:dev     # Dev mode
npm run dist             # Build all platforms
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🚀 Deployment

### Web Deployment

```bash
# Build for production
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - Your hosting provider
```

### Mobile App Deployment

**Android**:
1. Build: `npm run mobile:build`
2. Open Android Studio
3. Generate signed APK/Bundle
4. Deploy to Google Play Store

**iOS**:
1. Build: `npm run mobile:ios`
2. Open Xcode
3. Archive and sign
4. Deploy to App Store

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

- **Documentation**: This README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/Dave-code-creater/chiropractor_fe/issues)
- **Email**: support@drdieuphanchiropractor.com

## 🎯 Roadmap

- [ ] Enhanced mobile app features
- [ ] Offline mode support
- [ ] Advanced analytics
- [ ] Video consultation integration
- [ ] Multi-language support
- [ ] Accessibility improvements

---

**Built with ❤️ for Dr. Dieu Phan D.C.**

[Report Bug](https://github.com/Dave-code-creater/chiropractor_fe/issues) · [Request Feature](https://github.com/Dave-code-creater/chiropractor_fe/issues)
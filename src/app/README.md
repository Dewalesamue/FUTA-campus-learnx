# 🎓 Campus LearnHub

<div align="center">

**A Modern Learning Management System for Federal University of Technology Akure**

[![Built with React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

**Campus LearnHub** is a comprehensive e-learning platform designed specifically for Federal University of Technology Akure (FUTA). The platform provides a seamless learning experience with role-based access control, video content management, AI-assisted learning, and advanced analytics.

### 🎯 Purpose

- Enable **students** to access course materials, track progress, and learn at their own pace
- Empower **lecturers** to upload and manage educational content effortlessly
- Provide **admins** with powerful tools to monitor platform activity and manage users
- Support **super-admins** with complete control over the entire platform ecosystem

---

## ✨ Features

### 🔐 **Multi-Role Authentication System**
- **Students**: Register with university level (100-500), access level-appropriate content
- **Lecturers**: Upload videos, manage courses, view student engagement
- **Admins**: Monitor activities, manage users, moderate content
- **Super-Admins**: Complete platform control, create/remove admins, advanced management

### 🎬 **Video Learning Platform**
- Integrated video player with smooth playback
- AI assistance for enhanced learning experience
- Level-based video filtering (100, 200, 300, 400, 500)
- Topic-based organization with custom input fields
- Video metadata: course, topic, lecturer, difficulty level

### 📊 **Advanced Dashboard System**
- **Student Dashboard**: 
  - Course progress tracking
  - Recommended videos based on level
  - Learning analytics and statistics
  - Recently watched videos
  
- **Lecturer Dashboard**: 
  - Video upload with custom topics
  - Student engagement metrics
  - Content management tools
  
- **Admin Dashboard**: 
  - User management (promote lecturers to admin)
  - Platform statistics
  - Activity monitoring
  - Content moderation

### 🎨 **Modern UI/UX**
- Professional blue and purple color scheme (#1e3a8a, #3b82f6, #8b5cf6)
- Full dark mode support with persistent preferences
- Responsive mobile-first design
- Professional loading animation with Campus LearnHub branding
- Smooth transitions and animations
- PWA-ready with custom favicon and manifest

### 🔒 **Security & Validation**
- Role-based access control (RBAC)
- Student ID validation (Format: IFT/23/4098)
- Password strength requirements
- Admin email pattern validation
- Secure authentication flows

### 🌓 **Dark Mode**
- Comprehensive dark mode support across all pages
- Automatic system preference detection
- Toggle switch in navigation
- Persistent user preference storage
- Optimized color contrast for accessibility

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 18.2** - UI library with hooks and modern patterns
- **TypeScript 5.0** - Type-safe development
- **Vite 4.4** - Lightning-fast build tool

### **Styling**
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Motion (Framer Motion)** - Animation library
- **Lucide React** - Beautiful icon library
- **Shadcn/UI** - High-quality component library

### **State Management**
- React Hooks (`useState`, `useEffect`, `useCallback`)
- Local Storage for persistence
- Component-level state management

### **Build & Deployment**
- Vercel-ready configuration
- Optimized production builds
- PWA support with manifest.json

### **Development Tools**
- ESLint for code quality
- TypeScript for type safety
- PostCSS & Autoprefixer

---

## 📦 Installation

### **Prerequisites**
- Node.js 18.x or higher
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### **Quick Start**

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/campus-learnhub.git
cd campus-learnhub

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

### **Build for Production**

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🚀 Deployment

Campus LearnHub is configured and ready to deploy on multiple platforms. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### **Recommended: Vercel (Free & Easy)**

#### **Option 1: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### **Option 2: Vercel Dashboard**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy (auto-configured!)

### **Alternative Free Platforms**

| Platform | Free Tier | Best For | Deploy Time |
|----------|-----------|----------|-------------|
| **Vercel** ⭐ | Unlimited projects, 100GB bandwidth | React/Vite apps | 2-3 min |
| **Netlify** | 100GB bandwidth/month | SPAs with forms | 3-5 min |
| **Cloudflare Pages** | Unlimited bandwidth | Global CDN | 3-4 min |
| **Firebase Hosting** | 10GB storage, 360MB/day | Integrated backend | 5-10 min |
| **Render** | 750 hours/month | Full-stack apps | 5-7 min |

**Live Demo**: [campus-learnhub.vercel.app](https://campus-learnhub.vercel.app) *(deploy to get your URL)*

---

## 🎮 Demo Credentials

The platform uses **mock authentication** for preview purposes:

### **Students**
```
Email: student@futa.edu.ng
Password: any password (min 8 characters)
Student ID: IFT/23/4098
Level: 100-500
```

### **Lecturers**
```
Email: lecturer@futa.edu.ng
Password: any password
```

### **Admins**
```
Email: admin@futa.edu.ng (or any email with "admin")
Password: any password
```

**Note**: Admin emails must contain: `admin`, `administrator`, `sysadmin`, `system`, `manager`, `director`, or `@futa.edu.ng`

---

## 📁 Project Structure

```
campus-learnhub/
├── App.tsx                      # Main application entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── vercel.json                  # Deployment configuration
├── .gitignore                   # Git ignore rules
│
├── components/                  # React components
│   ├── LandingPage.tsx         # Landing/home page
│   ├── AuthPage.tsx            # Login/registration
│   ├── StudentDashboard.tsx    # Student interface
│   ├── LecturerDashboard.tsx   # Lecturer interface
│   ├── AdminDashboard.tsx      # Admin interface
│   ├── VideoPlayer.tsx         # Video playback
│   ├── VideoUploadModal.tsx    # Video upload form
│   ├── LoadingAnimation.tsx    # Startup loading screen
│   ├── DarkModeToggle.tsx      # Dark mode switcher
│   ├── SettingsPage.tsx        # User settings
│   └── ui/                     # Reusable UI components (shadcn/ui)
│
├── public/                      # Static assets
│   ├── favicon.svg             # App icon
│   ├── logo-192.png            # PWA icon
│   └── manifest.json           # PWA manifest
│
├── styles/                      # Global styles
│   └── globals.css             # Tailwind + custom CSS
│
├── guidelines/                  # Development guidelines
│   └── Guidelines.md           # Coding standards
│
├── docs/                        # Documentation
│   ├── DEPLOYMENT_GUIDE.md     # Deployment instructions
│   ├── FEATURE_SUGGESTIONS.md  # Roadmap and ideas
│   └── LOADING_ANIMATION.md    # Loading animation docs
│
└── src/                         # Source code (alternative structure)
    ├── main.tsx                # Entry point
    ├── services/               # API services
    ├── types/                  # TypeScript interfaces
    └── context/                # React context providers
```

---

## 🎨 Design System

### **Color Palette**

```css
/* Primary Colors */
--color-deep-blue: #1e3a8a;    /* Primary brand */
--color-sky-blue: #3b82f6;     /* Interactive elements */
--color-purple: #8b5cf6;       /* Accent color */
--color-indigo: #6366f1;       /* Links */

/* Dark Mode Support */
Dark mode automatically adjusts all colors for optimal contrast
```

### **Typography**
- **Font**: Inter, Roboto, Poppins, system-ui
- **Base Size**: 14px
- **Weights**: Normal (400), Medium (500)

### **Components**
Built with [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible UI elements.

---

## 🏗️ Development

### **Code Structure**
All components follow a consistent pattern:
```typescript
// 1. Imports (React, libraries, components)
// 2. TypeScript interfaces
// 3. Main component function
//    ├── State declarations
//    ├── Effect hooks
//    ├── Event handlers
//    ├── Utility functions
//    └── JSX return
```

### **Coding Standards**
See [guidelines/Guidelines.md](./guidelines/Guidelines.md) for comprehensive coding standards including:
- Component organization
- TypeScript best practices
- Styling guidelines
- Security patterns
- Performance optimization

### **Key Conventions**
- **Components**: PascalCase (`StudentDashboard.tsx`)
- **Utilities**: kebab-case (`auth-service.ts`)
- **Variables**: camelCase (`currentUser`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

---

## 🔑 Key Features Implementation

### **Level-Based Video Filtering**
```typescript
// Students only see videos for their level
const filteredVideos = videos.filter(video => 
  video.level === user.level || user.role === 'super-admin'
);
```

### **Role-Based Access Control**
```typescript
// Only lecturers can be promoted to admin
const canPromoteToAdmin = (user: User) => 
  user.role === 'lecturer';
```

### **Student ID Validation**
```typescript
// Format: Department/Year/Number (e.g., IFT/23/4098)
const STUDENT_ID_PATTERN = /^[A-Z]{3}\/\d{2}\/\d{4}$/;
```

### **Dark Mode Persistence**
```typescript
// Automatically saves and restores dark mode preference
localStorage.setItem('darkMode', isDarkMode.toString());
```

---

## 📊 Feature Roadmap

See [FEATURE_SUGGESTIONS.md](./FEATURE_SUGGESTIONS.md) for detailed feature ideas including:

### **Phase 1: Quick Wins**
- [ ] Search & Filter System
- [ ] Video Progress Tracking
- [ ] Bookmarks & Favorites

### **Phase 2: Core Features**
- [ ] Notification System
- [ ] Enhanced Analytics
- [ ] Video Notes Feature

### **Phase 3: Community**
- [ ] Comments & Discussions
- [ ] Course Enrollment
- [ ] Enhanced PWA Features

### **Phase 4: Advanced**
- [ ] Quiz & Assessment
- [ ] Certificate Generation
- [ ] Live Streaming

---

## 📸 Screenshots

### Landing Page
Beautiful purple and white design with clear call-to-action buttons.

### Student Dashboard
- Course overview with progress tracking
- Recommended videos based on level
- Recently watched section
- Dark mode support

### Lecturer Dashboard
- Video upload with custom topics
- Student engagement metrics
- Content management

### Admin Dashboard
- User management interface
- Platform statistics
- Activity monitoring

### Loading Animation
Professional loading screen with:
- Animated Campus LearnHub logo
- Pulsing ring effects
- University branding
- Dark mode support

---

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Student registration with valid ID
- [ ] Lecturer login and video upload
- [ ] Admin user management
- [ ] Video playback on all devices
- [ ] Dark mode toggle
- [ ] Level-based filtering
- [ ] Responsive design (mobile/tablet/desktop)

### **Browser Compatibility**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🤝 Contributing

We welcome contributions to Campus LearnHub! Please follow these guidelines:

### **Development Workflow**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow coding standards in `guidelines/Guidelines.md`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### **Code Review Checklist**
- [ ] Follows project file structure
- [ ] TypeScript interfaces defined
- [ ] Responsive design maintained
- [ ] Dark mode support added
- [ ] Comments for complex logic
- [ ] No hardcoded values
- [ ] Proper error handling

---

## 📚 Documentation

- **[Guidelines.md](./guidelines/Guidelines.md)** - Comprehensive development standards
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment instructions for all platforms
- **[FEATURE_SUGGESTIONS.md](./FEATURE_SUGGESTIONS.md)** - Feature roadmap and ideas
- **[LOADING_ANIMATION.md](./LOADING_ANIMATION.md)** - Loading animation documentation

---

## 🔧 Environment Variables

For production deployment with real Firebase:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Note**: Currently uses mock Firebase for preview/demo purposes.

---

## 🐛 Known Issues

- Mock Firebase doesn't persist data across sessions
- Video URLs need real hosting service for production
- Some analytics features require backend integration

---

## 📞 Support

For questions or issues:
- Check [Guidelines.md](./guidelines/Guidelines.md) for development help
- Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment issues
- Open an issue on GitHub

---

## 📄 License

This project is developed for **Federal University of Technology Akure (FUTA)** internal use.  
**All rights reserved.** © 2025 FUTA

---

## 🙏 Acknowledgments

- **FUTA** - Federal University of Technology Akure
- **React Team** - For the amazing framework
- **Vercel** - For free hosting and deployment tools
- **Shadcn/UI** - For beautiful accessible components
- **Tailwind CSS** - For utility-first styling

---

<div align="center">

### 🎓 **Campus LearnHub**
*Empowering education through technology*

**Built with ❤️ for Federal University of Technology Akure**

[⬆ Back to Top](#-campus-learnhub)

</div>

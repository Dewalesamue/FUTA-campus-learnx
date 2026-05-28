# Campus LearnHub - Development Guidelines

## 📋 Table of Contents
1. [General Development Standards](#general-development-standards)
2. [React Component Guidelines](#react-component-guidelines)
3. [Styling and Design System](#styling-and-design-system)
4. [TypeScript Best Practices](#typescript-best-practices)
5. [State Management](#state-management)
6. [Authentication & Security](#authentication--security)
7. [Performance Optimization](#performance-optimization)

---

## 🔧 General Development Standards

### File Organization
- **Components**: Place in `/components/` directory with PascalCase naming
- **Utilities**: Use kebab-case for utility files
- **Types**: Define interfaces at the top of files or in separate type files
- **Constants**: Group related constants together with descriptive comments

### Code Structure
```typescript
// ✅ Preferred component structure
export function ComponentName() {
  // 1. State declarations
  // 2. Effect hooks
  // 3. Event handlers
  // 4. Utility functions
  // 5. Render functions (if complex)
  // 6. Main JSX return
}
```

### Import Organization
```typescript
// 1. React imports
import { useState, useEffect } from "react";

// 2. External library imports
import { motion } from "motion/react";

// 3. UI component imports
import { Button } from "./ui/button";
import { Card } from "./ui/card";

// 4. Local component imports
import { CustomComponent } from "./CustomComponent";

// 5. Type imports (separate from value imports)
import type { UserType, AuthState } from "./types";
```

---

## ⚛️ React Component Guidelines

### Component Organization
```typescript
/**
 * Component description and purpose
 * @param props - Description of props
 */
export function StudentDashboard({ onLogout, onVideoSelect }: Props) {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  const [activeTab, setActiveTab] = useState('overview');
  const [videos, setVideos] = useState<Video[]>([]);
  
  // ===========================
  // EVENT HANDLERS  
  // ===========================
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // ===========================
  // UTILITY FUNCTIONS
  // ===========================
  const calculateProgress = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };
  
  // ===========================
  // RENDER FUNCTIONS
  // ===========================
  const renderVideoGrid = () => (
    // Complex JSX for video grid
  );
  
  // ===========================
  // MAIN RENDER
  // ===========================
  return (
    <div className="min-h-screen bg-futa-gray-50">
      {/* Component content */}
    </div>
  );
}
```

### Props and Interfaces
```typescript
// ✅ Define interfaces at component top
interface StudentDashboardProps {
  onLogout: () => void;
  onVideoSelect: (video: Video) => void;
  currentUser?: User;
}

// ✅ Use descriptive prop names
interface VideoCardProps {
  video: Video;
  onPlay: (videoId: string) => void;
  showProgress?: boolean;
  className?: string;
}
```

### Event Handling
```typescript
// ✅ Descriptive handler names
const handleVideoClick = (video: Video) => {
  onVideoSelect(video);
};

const handleLogoutConfirm = () => {
  if (confirm('Are you sure you want to logout?')) {
    onLogout();
  }
};

// ✅ Form submission handling
const handleFormSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Handle form logic
};
```

---

## 🎨 Styling and Design System

### Tailwind CSS Usage
```typescript
// ✅ Use FUTA custom colors
className="bg-futa-green text-white hover:bg-futa-green/90"

// ✅ Consistent spacing
className="p-6 mb-4 space-y-4"

// ❌ Avoid font classes (handled by globals.css)
className="text-lg font-bold" // Don't use

// ✅ Use semantic HTML instead
<h2 className="text-futa-gray-900">Title</h2>
```

### Button Styling Standards
```typescript
// ✅ Primary button
className="bg-primary hover:bg-primary/90 text-white transition-all duration-200"

// ✅ Secondary button  
className="border border-futa-gray-300 bg-white hover:bg-futa-gray-50 hover:border-futa-gray-400 text-futa-gray-700"

// ✅ Danger button
className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"

// ❌ Avoid white hover backgrounds
className="hover:bg-white" // Creates poor contrast
```

### Responsive Design
```typescript
// ✅ Mobile-first approach
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// ✅ Responsive padding/margins
className="px-4 md:px-6 lg:px-8"

// ✅ Responsive text sizes (when needed)
className="text-sm md:text-base lg:text-lg"
```

### Color Usage Guidelines
```typescript
// ✅ FUTA Brand Colors
const brandColors = {
  primary: 'futa-green',      // #006400
  secondary: 'futa-teal',     // #20b2aa
  gray: 'futa-gray-*',        // 50-900 scale
  admin: 'red-600',           // Admin-specific red
};

// ✅ Status colors
const statusColors = {
  success: 'green-500',
  warning: 'yellow-500', 
  error: 'red-500',
  info: 'blue-500',
};
```

---

## 📝 TypeScript Best Practices

### Interface Definitions
```typescript
// ✅ Descriptive interface names
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string; // Optional properties with ?
}

// ✅ Enum for role management
type UserRole = 'student' | 'lecturer' | 'admin';

// ✅ Generic types for reusability
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

### Function Typing
```typescript
// ✅ Explicit return types for complex functions
const validateStudentId = (studentId: string): boolean => {
  const pattern = /^[A-Z]{3}\/\d{2}\/\d{4}$/;
  return pattern.test(studentId);
};

// ✅ Event handler typing
const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  e.preventDefault();
  // Handle submission
};
```

---

## 🔄 State Management

### useState Best Practices
```typescript
// ✅ Descriptive state names
const [isLoading, setIsLoading] = useState(false);
const [authError, setAuthError] = useState<string | null>(null);
const [formData, setFormData] = useState<FormData>(initialFormData);

// ✅ State update patterns
const updateFormField = (field: keyof FormData, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### Complex State Management
```typescript
// ✅ Use reducer pattern for complex state
interface AppState {
  currentUser: User | null;
  currentView: ViewType;
  selectedVideo: Video | null;
  isLoading: boolean;
}

const initialState: AppState = {
  currentUser: null,
  currentView: 'landing',
  selectedVideo: null,
  isLoading: false,
};
```

---

## 🔐 Authentication & Security

### User Role Validation
```typescript
// ✅ Role-based access control
const hasAdminAccess = (user: User | null): boolean => {
  return user?.role === 'admin';
};

const canAccessLecturerFeatures = (user: User | null): boolean => {
  return user?.role === 'lecturer' || user?.role === 'admin';
};
```

### Input Validation
```typescript
// ✅ Student ID validation
const STUDENT_ID_PATTERN = /^[A-Z]{3}\/\d{2}\/\d{4}$/;

const validateStudentId = (id: string): ValidationResult => {
  if (!STUDENT_ID_PATTERN.test(id)) {
    return {
      isValid: false,
      error: 'Format: Department/Year/Number (e.g., IFT/23/4098)'
    };
  }
  return { isValid: true };
};

// ✅ Password validation
const validatePassword = (password: string): PasswordValidation => {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    isStrong: password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)
  };
};
```

### Admin Email Patterns
```typescript
// ✅ Admin access validation
const ADMIN_PATTERNS = [
  'admin',
  'administrator',
  'sysadmin',
  'system',
  'manager',
  'director',
  'futa.edu.ng'
] as const;

const isValidAdminEmail = (email: string): boolean => {
  const emailLower = email.toLowerCase();
  return ADMIN_PATTERNS.some(pattern => 
    emailLower.includes(pattern) || emailLower.endsWith('@futa.edu.ng')
  );
};
```

---

## 🚀 Performance Optimization

### Component Optimization
```typescript
// ✅ Use React.memo for expensive components
export const VideoCard = React.memo(({ video, onPlay }: VideoCardProps) => {
  return (
    // Component JSX
  );
});

// ✅ Optimize re-renders with useCallback
const handleVideoSelect = useCallback((video: Video) => {
  onVideoSelect(video);
}, [onVideoSelect]);
```

### Loading States
```typescript
// ✅ Consistent loading patterns
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true);
      // Load data
    } catch (error) {
      console.error('Data loading error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  loadData();
}, []);

// ✅ Loading UI component
if (isLoading) {
  return <LoadingSpinner />;
}
```

---

## 🧪 Error Handling

### Form Validation
```typescript
// ✅ Comprehensive form validation
const validateForm = (data: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  return errors;
};
```

### Error Boundaries
```typescript
// ✅ User-friendly error messages
const handleAuthError = (error: AuthError) => {
  switch (error.code) {
    case 'invalid-credentials':
      setAuthError('Invalid email or password. Please try again.');
      break;
    case 'admin-access-denied':
      setAuthError('Admin access denied. Please contact your system administrator.');
      break;
    default:
      setAuthError('An unexpected error occurred. Please try again.');
  }
};
```

---

## 📖 Documentation Standards

### Component Documentation
```typescript
/**
 * StudentDashboard - Main dashboard interface for student users
 * 
 * Features:
 * - Course progress tracking
 * - Video library access
 * - Learning analytics
 * 
 * @param onLogout - Callback function for user logout
 * @param onVideoSelect - Callback function for video selection
 * @param currentUser - Currently authenticated user object
 * 
 * @example
 * <StudentDashboard
 *   onLogout={() => handleLogout()}
 *   onVideoSelect={(video) => setSelectedVideo(video)}
 *   currentUser={user}
 * />
 */
export function StudentDashboard({ onLogout, onVideoSelect }: Props) {
  // Component implementation
}
```

### Function Documentation
```typescript
/**
 * Validates FUTA student ID format
 * 
 * @param studentId - Student ID string to validate
 * @returns Boolean indicating if format is valid
 * 
 * @example
 * validateStudentId('IFT/23/4098') // returns true
 * validateStudentId('invalid-id')  // returns false
 */
const validateStudentId = (studentId: string): boolean => {
  const pattern = /^[A-Z]{3}\/\d{2}\/\d{4}$/;
  return pattern.test(studentId);
};
```

---

## 🔍 VS Code Configuration

### Recommended Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

### Workspace Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "typescript.preferences.organizeImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

---

## 🚀 Final Notes

### Code Review Checklist
- [ ] Component follows established file structure
- [ ] All imports are properly organized
- [ ] TypeScript interfaces are defined and used
- [ ] Proper error handling is implemented
- [ ] Responsive design is maintained
- [ ] FUTA brand colors are used correctly
- [ ] Comments explain complex logic
- [ ] No hardcoded values (use constants)
- [ ] Proper loading states are shown
- [ ] Accessibility considerations included

### Performance Checklist
- [ ] Components are properly memoized where needed
- [ ] Event handlers are optimized with useCallback
- [ ] Large lists use proper keys
- [ ] Images have proper loading states
- [ ] No unnecessary re-renders
- [ ] Bundle size is reasonable

---

*These guidelines ensure consistent, maintainable, and scalable code for the Campus LearnHub project.*
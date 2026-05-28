/**
 * ====================================
 * CAMPUS LEARNHUB - MAIN APPLICATION
 * ====================================
 * 
 * Main entry point for the Campus LearnHub application
 * Handles routing, authentication, and state management
 * 
 * Features:
 * - Multi-role authentication (Student, Lecturer, Admin)
 * - Role-based dashboard routing with access control
 * - AI-powered video player functionality
 * - Optimized state management and error handling
 * 
 * @author Campus LearnHub Team
 * @version 2.0.0
 */

import { useState, useEffect } from "react";

// ====================================
// COMPONENT IMPORTS
// ====================================
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { LecturerDashboard } from "./components/LecturerDashboard";
import { VideoPlayer } from "./components/VideoPlayer";
import { AdminDashboard } from "./components/AdminDashboard";
import { SettingsPage } from "./components/SettingsPage";
import { LoadingAnimation } from "./components/LoadingAnimation";

// ====================================
// TYPE DEFINITIONS
// ====================================

/**
 * Application state enum for routing and navigation
 */
type AppState = 
  | 'landing'           // Landing/home page with platform info
  | 'student-auth'      // Student authentication (login/register)
  | 'lecturer-auth'     // Lecturer authentication (login/register)
  | 'admin-auth'        // Admin authentication (login only)
  | 'super-admin-auth'  // Super-admin authentication (login only)
  | 'student-dashboard' // Student learning dashboard
  | 'lecturer-dashboard'// Lecturer teaching dashboard
  | 'admin-dashboard'   // Admin management dashboard
  | 'video-player'      // AI-powered video viewing interface
  | 'settings';         // User settings and preferences page

/**
 * Video object interface for media content
 */
interface Video {
  id: string;
  title: string;
  lecturer: string;
  course: string;        // Changed from "subject" to "course"
  duration: string;
  rating: number;        // 0-5 star rating
  thumbnail: string;     // Video thumbnail URL
  level?: number;        // University level (100, 200, 300, 400, 500)
}

/**
 * User object interface for authentication and authorization
 */
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin' | 'super-admin';
  studentId?: string;    // Required for students (format: IFT/23/4098)
  level?: number;        // Student level (100, 200, 300, 400, 500)
}

// ====================================
// MAIN APPLICATION COMPONENT
// ====================================

export default function App() {
  // ====================================
  // STATE MANAGEMENT
  // ====================================
  
  /** Loading state for initial app initialization */
  const [isLoading, setIsLoading] = useState(true);
  
  /** Current application state for routing */
  const [currentState, setCurrentState] = useState<AppState>('landing');
  
  /** Available users for admin management */
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  /** Currently selected video for playback */
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  /** Currently authenticated user */
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ====================================
  // INITIALIZATION EFFECT
  // ====================================

  /**
   * Simulates app initialization and displays loading animation
   * Performs initial setup tasks before showing the main application
   */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate loading time for app initialization
        // In production, this would load user session, check authentication, etc.
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================

  /**
   * Validates if an email qualifies for super-admin access
   * Super-admin has highest privileges in the system
   * 
   * @param email - Email address to validate
   * @returns Boolean indicating super-admin access eligibility
   */
  const isValidSuperAdminEmail = (email: string): boolean => {
    const superAdminPatterns = [
      'superadmin',
      'super-admin',
      'super.admin',
      'owner',
      'root',
      'system.admin',
      'platform.admin',
      'campus.owner',
      'learnhub.owner'
    ] as const;
    
    const emailLower = email.toLowerCase();
    
    // Specific super-admin emails with ultimate access
    const specificSuperAdminEmails = [
      'admin@futa.edu.ng',
      'superadmin@futa.edu.ng',
      'owner@futa.edu.ng',
      'root@futa.edu.ng',
      'system.admin@futa.edu.ng',
      'platform.admin@futa.edu.ng'
    ];
    
    // Check for specific super-admin emails
    if (specificSuperAdminEmails.includes(emailLower)) {
      return true;
    }
    
    // Check for super admin patterns
    const hasSuperAdminPattern = superAdminPatterns.some(pattern => 
      emailLower.includes(pattern) || 
      emailLower.startsWith('superadmin') ||
      emailLower.includes('superadmin@')
    );
    
    // For development purposes
    const isDevSuperAdmin = (emailLower.endsWith('@gmail.com') || 
                            emailLower.endsWith('@yahoo.com') || 
                            emailLower.endsWith('@outlook.com')) && 
                           (emailLower.includes('superadmin') || 
                            emailLower.includes('owner') || 
                            emailLower.includes('root'));
    
    return hasSuperAdminPattern || isDevSuperAdmin;
  };

  /**
   * Validates if an email qualifies for admin access
   * Uses pattern matching for security and role validation
   * Includes development-friendly patterns for testing
   * 
   * @param email - Email address to validate
   * @returns Boolean indicating admin access eligibility
   */
  const isValidAdminEmail = (email: string): boolean => {
    const adminPatterns = [
      'admin',
      'administrator', 
      'sysadmin',
      'system',
      'manager',
      'director',
      'futa.edu.ng'
    ] as const;
    
    // Development/Testing email patterns
    const devPatterns = [
      'test',
      'demo',
      'dev',
      'development',
      'sample',
      'adeleke',
      'campus',
      'learnhub'
    ] as const;
    
    const emailLower = email.toLowerCase();
    
    // Check against admin patterns and FUTA domain
    const hasAdminPattern = adminPatterns.some(pattern => 
      emailLower.includes(pattern) || 
      emailLower.endsWith('@futa.edu.ng') ||
      emailLower.startsWith('admin') ||
      emailLower.includes('admin@')
    );
    
    // Check against development patterns for testing
    const hasDevPattern = devPatterns.some(pattern => 
      emailLower.includes(pattern)
    );
    
    // For development purposes, also allow gmail.com domains with specific patterns
    const isDevEmail = (emailLower.endsWith('@gmail.com') || 
                       emailLower.endsWith('@yahoo.com') || 
                       emailLower.endsWith('@outlook.com')) && hasDevPattern;
    
    return hasAdminPattern || hasDevPattern || isDevEmail;
  };

  /**
   * Validates student ID format according to FUTA standards
   * 
   * @param studentId - Student ID to validate
   * @returns Boolean indicating if format is valid
   */
  const validateStudentIdFormat = (studentId: string): boolean => {
    const STUDENT_ID_PATTERN = /^[A-Z]{3}\/\d{2}\/\d{4}$/;
    return STUDENT_ID_PATTERN.test(studentId);
  };

  // ====================================
  // AUTHENTICATION HANDLERS
  // ====================================

  /**
   * Handles student login authentication
   * Creates mock user session for demonstration
   * 
   * @param email - Student email address
   * @param password - Student password
   */
  const handleStudentLogin = (email: string, password: string) => {
    console.log('Student login attempt:', { email });
    
    // Create mock student user for demo
    const mockUser: User = {
      id: 'student-1',
      name: 'John Student',
      email,
      role: 'student',
      studentId: 'IFT/23/4098',
      level: 300  // Default level for demo
    };
    
    setCurrentUser(mockUser);
    setCurrentState('student-dashboard');
  };

  /**
   * Handles lecturer login authentication
   * Creates mock lecturer session for demonstration
   * 
   * @param email - Lecturer email address
   * @param password - Lecturer password
   */
  const handleLecturerLogin = (email: string, password: string) => {
    console.log('Lecturer login attempt:', { email });
    
    // Create mock lecturer user for demo
    const mockUser: User = {
      id: 'lecturer-1',
      name: 'Dr. Johnson',
      email,
      role: 'lecturer'
    };
    
    setCurrentUser(mockUser);
    setCurrentState('lecturer-dashboard');
  };

  /**
   * Handles admin login authentication with enhanced security validation
   * Regular admin access only (does not include super-admin)
   * 
   * @param email - Admin email address
   * @param password - Admin password
   */
  const handleAdminLogin = (email: string, password: string) => {
    console.log('Admin login attempt:', { email });
    
    // Validate required fields
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    // Check admin email eligibility
    if (isValidAdminEmail(email)) {
      const mockUser: User = {
        id: 'admin-1',
        name: 'System Administrator',
        email,
        role: 'admin'
      };
      
      setCurrentUser(mockUser);
      setCurrentState('admin-dashboard');
      console.log('Admin login successful:', mockUser);
    } else {
      console.error('Admin access denied for email:', email);
      alert('Access denied. Invalid administrator credentials. Please contact your system administrator if you believe this is an error.');
    }
  };

  /**
   * Handles super-admin login authentication with highest security validation
   * Super-admin has ultimate system privileges
   * 
   * @param email - Super-admin email address
   * @param password - Super-admin password
   */
  const handleSuperAdminLogin = (email: string, password: string) => {
    console.log('Super-admin login attempt:', { email });
    
    // Validate required fields
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    // Check for super-admin access
    if (isValidSuperAdminEmail(email)) {
      const mockUser: User = {
        id: 'super-admin-1',
        name: 'Platform Owner',
        email,
        role: 'super-admin'
      };
      
      setCurrentUser(mockUser);
      setCurrentState('admin-dashboard');
      console.log('Super-admin login successful:', mockUser);
    } else {
      console.error('Super-admin access denied for email:', email);
      alert('Access denied. Super-administrator credentials required. This incident will be logged.');
    }
  };

  /**
   * Handles student registration with comprehensive validation
   * 
   * @param email - Student email
   * @param password - Student password
   * @param name - Student full name
   * @param studentId - Student ID (format: IFT/23/4098)
   * @param level - Student level (100-500)
   */
  const handleStudentRegister = (email: string, password: string, name: string, studentId?: string, level?: string) => {
    console.log('Student registration attempt:', { email, name, studentId, level });
    
    // Validate student ID format if provided
    if (studentId && !validateStudentIdFormat(studentId)) {
      console.error('Invalid student ID format');
      alert('Invalid student ID format. Please use format like: IFT/23/4098');
      return;
    }
    
    // Validate level
    if (!level) {
      alert('Please select your level');
      return;
    }
    
    // Convert level string to number
    const numericLevel = parseInt(level);
    
    // Create new student user
    const mockUser: User = {
      id: 'student-new',
      name,
      email,
      role: 'student',
      studentId,
      level: numericLevel
    };
    
    setCurrentUser(mockUser);
    setCurrentState('student-dashboard');
  };

  /**
   * Handles lecturer registration
   * 
   * @param email - Lecturer email
   * @param password - Lecturer password
   * @param name - Lecturer full name
   */
  const handleLecturerRegister = (email: string, password: string, name: string) => {
    console.log('Lecturer registration attempt:', { email, name });
    
    // Create new lecturer user
    const mockUser: User = {
      id: 'lecturer-new',
      name,
      email,
      role: 'lecturer'
    };
    
    setCurrentUser(mockUser);
    setCurrentState('lecturer-dashboard');
  };

  /**
   * Handles admin registration (restricted for security)
   * Admin accounts cannot be self-registered
   * 
   * @param email - Admin email
   * @param password - Admin password
   * @param name - Admin full name
   */
  const handleAdminRegister = (email: string, password: string, name: string) => {
    console.log('Admin registration attempt blocked:', { email, name });
    
    // Admin registration is restricted for security
    console.warn('Admin registration attempt blocked');
    alert('Admin account registration is not permitted. Please contact your system administrator.');
  };

  // ====================================
  // NAVIGATION HANDLERS
  // ====================================

  /**
   * Handles video selection for AI-powered playback
   * 
   * @param video - Selected video object
   */
  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setCurrentState('video-player');
  };

  /**
   * Handles user logout and state cleanup
   * Clears all user session data
   */
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentState('landing');
    setSelectedVideo(null);
    console.log('User session ended successfully');
  };

  /**
   * Navigates back to landing page
   */
  const handleBackToLanding = () => {
    setCurrentState('landing');
  };

  /**
   * Navigates back to appropriate dashboard based on user role
   * Implements role-based routing
   */
  const handleBackToDashboard = () => {
    if (!currentUser) {
      setCurrentState('landing');
      return;
    }

    switch (currentUser.role) {
      case 'student':
        setCurrentState('student-dashboard');
        break;
      case 'lecturer':
        setCurrentState('lecturer-dashboard');
        break;
      case 'admin':
      case 'super-admin':
        setCurrentState('admin-dashboard');
        break;
      default:
        setCurrentState('landing');
    }
  };

  /**
   * Navigates to settings page
   */
  const handleGoToSettings = () => {
    setCurrentState('settings');
  };

  /**
   * Handles user profile updates from settings
   * 
   * @param updatedUser - Updated user object
   */
  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    console.log('User profile updated:', updatedUser);
  };

  // ====================================
  // ACCESS CONTROL COMPONENTS
  // ====================================

  /**
   * Renders access denied page for unauthorized access attempts
   * 
   * @param title - Error title
   * @param message - Error message
   * @param hint - Optional hint text
   * @returns Access denied JSX element
   */
  const renderAccessDenied = (title: string, message: string, hint?: string) => (
    <div className="min-h-screen flex items-center justify-center bg-campus-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <h2 className="text-xl font-semibold text-campus-gray-900 mb-2">{title}</h2>
        <p className="text-campus-gray-600 mb-4">{message}</p>
        {hint && <p className="text-sm text-campus-gray-500 mb-4">{hint}</p>}
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  /**
   * Renders error page for unknown application states
   * 
   * @param errorMessage - Error message to display
   * @returns Error page JSX element
   */
  const renderErrorPage = (errorMessage: string) => (
    <div className="min-h-screen flex items-center justify-center bg-campus-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <h2 className="text-xl font-semibold text-campus-gray-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-campus-gray-600 mb-4">{errorMessage}</p>
        <button 
          onClick={() => setCurrentState('landing')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
        >
          Go to Home
        </button>
      </div>
    </div>
  );

  // ====================================
  // LOADING STATE
  // ====================================

  /**
   * Display loading animation during app initialization
   */
  if (isLoading) {
    return <LoadingAnimation />;
  }

  // ====================================
  // MAIN ROUTING LOGIC
  // ====================================

  switch (currentState) {
    // Landing Page with Platform Information
    case 'landing':
      return (
        <LandingPage
          onStudentLogin={() => setCurrentState('student-auth')}
          onLecturerLogin={() => setCurrentState('lecturer-auth')}
          onAdminLogin={() => setCurrentState('admin-auth')}
          onSuperAdminLogin={() => setCurrentState('super-admin-auth')}
        />
      );

    // Authentication Pages
    case 'student-auth':
      return (
        <AuthPage
          userType="student"
          onLogin={handleStudentLogin}
          onRegister={handleStudentRegister}
          onBack={handleBackToLanding}
        />
      );

    case 'lecturer-auth':
      return (
        <AuthPage
          userType="lecturer"
          onLogin={handleLecturerLogin}
          onRegister={handleLecturerRegister}
          onBack={handleBackToLanding}
        />
      );

    case 'admin-auth':
      return (
        <AuthPage
          userType="admin"
          onLogin={handleAdminLogin}
          onRegister={handleAdminRegister}
          onBack={handleBackToLanding}
        />
      );

    case 'super-admin-auth':
      return (
        <AuthPage
          userType="super-admin"
          onLogin={handleSuperAdminLogin}
          onRegister={handleAdminRegister}
          onBack={handleBackToLanding}
        />
      );

    // Dashboard Pages with Role-Based Access Control
    case 'student-dashboard':
      return currentUser?.role === 'student' ? (
        <StudentDashboard
          onLogout={handleLogout}
          onVideoSelect={handleVideoSelect}
          onGoToSettings={handleGoToSettings}
          currentUser={currentUser}
        />
      ) : (
        renderAccessDenied(
          "Access Denied",
          "You don't have permission to access the student dashboard."
        )
      );

    case 'lecturer-dashboard':
      return currentUser?.role === 'lecturer' ? (
        <LecturerDashboard
          onLogout={handleLogout}
        />
      ) : (
        renderAccessDenied(
          "Access Denied",
          "You don't have permission to access the lecturer dashboard."
        )
      );

    case 'admin-dashboard':
      return (currentUser?.role === 'admin' || currentUser?.role === 'super-admin') ? (
        <AdminDashboard 
          onLogout={handleLogout} 
          currentUser={currentUser}
          allUsers={allUsers}
          setAllUsers={setAllUsers}
        />
      ) : (
        renderAccessDenied(
          "Admin Access Required",
          "You need administrator privileges to access this area.",
          "Please contact your system administrator for access."
        )
      );

    // User Settings and Preferences
    case 'settings':
      return currentUser ? (
        <SettingsPage
          currentUser={currentUser}
          onBack={handleBackToDashboard}
          onUpdateUser={handleUpdateUser}
        />
      ) : (
        renderAccessDenied(
          "Authentication Required",
          "You must be logged in to access settings.",
          "Please log in to your account to view and modify your settings."
        )
      );

    // AI-Powered Video Player
    case 'video-player':
      return selectedVideo ? (
        <VideoPlayer
          video={selectedVideo}
          onBack={handleBackToDashboard}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-campus-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <h2 className="text-xl font-semibold text-campus-gray-900 mb-2">Video Not Found</h2>
            <p className="text-campus-gray-600 mb-4">The requested video could not be loaded. Please try again.</p>
            <button 
              onClick={handleBackToDashboard}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );

    // Default case for unknown states
    default:
      return renderErrorPage('An unexpected error occurred. Please try refreshing the page.');
  }
}

// ====================================
// END OF FILE
// ====================================
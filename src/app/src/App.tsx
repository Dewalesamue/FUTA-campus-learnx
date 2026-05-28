import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { LecturerDashboard } from "./pages/lecturer/LecturerDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { VideoPlayer } from "./components/VideoPlayer";
import { User, Video } from "./types";

type AppState = 
  | 'landing' 
  | 'student-auth' 
  | 'lecturer-auth' 
  | 'admin-auth'
  | 'student-dashboard' 
  | 'lecturer-dashboard'
  | 'admin-dashboard'
  | 'video-player';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Route user to appropriate dashboard based on role
  useEffect(() => {
    if (user && !selectedVideo) {
      switch (user.role) {
        case 'student':
          setCurrentState('student-dashboard');
          break;
        case 'lecturer':
          setCurrentState('lecturer-dashboard');
          break;
        case 'admin':
          setCurrentState('admin-dashboard');
          break;
        default:
          setCurrentState('landing');
      }
    } else if (!user && currentState !== 'landing' && !currentState.includes('auth')) {
      setCurrentState('landing');
    }
  }, [user, selectedVideo]);

  // Handle hash-based navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && !user) {
      switch (hash) {
        case 'student-auth':
          setCurrentState('student-auth');
          break;
        case 'lecturer-auth':
          setCurrentState('lecturer-auth');
          break;
        case 'admin-auth':
          setCurrentState('admin-auth');
          break;
        default:
          setCurrentState('landing');
      }
    }
  }, [user]);

  // Authentication handlers
  const handleStudentLogin = (email: string, password: string) => {
    console.log('Student login:', { email, password });
    // Auth context will handle the actual login
  };

  const handleLecturerLogin = (email: string, password: string) => {
    console.log('Lecturer login:', { email, password });
    // Auth context will handle the actual login
  };

  const handleAdminLogin = (email: string, password: string) => {
    console.log('Admin login:', { email, password });
    // Auth context will handle the actual login
  };

  const handleStudentRegister = (email: string, password: string, name: string, studentId?: string) => {
    console.log('Student register:', { email, password, name, studentId });
    // Auth context will handle the actual registration
  };

  const handleLecturerRegister = (email: string, password: string, name: string) => {
    console.log('Lecturer register:', { email, password, name });
    // Auth context will handle the actual registration
  };

  const handleAdminRegister = (email: string, password: string, name: string) => {
    console.log('Admin register:', { email, password, name });
    // Auth context will handle the actual registration
  };

  // Navigation handlers
  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setCurrentState('video-player');
  };

  const handleLogout = () => {
    setCurrentState('landing');
    setSelectedVideo(null);
    window.location.hash = '';
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
    window.location.hash = '';
  };

  const handleBackToDashboard = () => {
    if (user) {
      switch (user.role) {
        case 'student':
          setCurrentState('student-dashboard');
          break;
        case 'lecturer':
          setCurrentState('lecturer-dashboard');
          break;
        case 'admin':
          setCurrentState('admin-dashboard');
          break;
      }
    }
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-futa-gray-50">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  // Render current state
  switch (currentState) {
    case 'landing':
      return (
        <LandingPage
          onStudentLogin={() => setCurrentState('student-auth')}
          onLecturerLogin={() => setCurrentState('lecturer-auth')}
          onAdminLogin={() => setCurrentState('admin-auth')}
        />
      );

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

    case 'student-dashboard':
      return (
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard
            onLogout={handleLogout}
            onVideoSelect={handleVideoSelect}
          />
        </ProtectedRoute>
      );

    case 'lecturer-dashboard':
      return (
        <ProtectedRoute allowedRoles={['lecturer']}>
          <LecturerDashboard
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      );

    case 'admin-dashboard':
      return (
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      );

    case 'video-player':
      return selectedVideo ? (
        <ProtectedRoute allowedRoles={['student', 'lecturer', 'admin']}>
          <VideoPlayer
            video={selectedVideo}
            onBack={handleBackToDashboard}
          />
        </ProtectedRoute>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p>Video not found</p>
        </div>
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Unknown state</p>
        </div>
      );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
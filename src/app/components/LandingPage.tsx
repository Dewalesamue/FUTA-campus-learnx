import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  GraduationCap, 
  Users, 
  Video, 
  Shield, 
  BookOpen, 
  Brain,
  Play,
  Award,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';

// ===========================
// INTERFACES & TYPES
// ===========================

interface LandingPageProps {
  onStudentLogin: () => void;
  onLecturerLogin: () => void;
  onAdminLogin: () => void;
  onSuperAdminLogin: () => void;
}

// ===========================
// MAIN COMPONENT
// ===========================

export function LandingPage({ onStudentLogin, onLecturerLogin, onAdminLogin, onSuperAdminLogin }: LandingPageProps) {
  
  // ===========================
  // MOCK DATA
  // ===========================

  const platformStats = [
    { label: 'Active Students', value: '2,500+', icon: Users },
    { label: 'Video Lectures', value: '850+', icon: Video },
    { label: 'Expert Lecturers', value: '120+', icon: GraduationCap },
    { label: 'Course Hours', value: '1,200+', icon: BookOpen }
  ];

  const keyFeatures = [
    {
      title: 'AI-Powered Learning Assistant',
      description: 'Get instant answers to your questions while watching videos with our intelligent AI assistant.',
      icon: Brain
    },
    {
      title: 'Flexible Learning Pace',
      description: 'Learn at your own speed with pause, rewind, and replay functionality for every lecture.',
      icon: Play
    },
    {
      title: 'Quality Assurance',
      description: 'All videos are validated by AI to ensure content matches course topics and quality standards.',
      icon: Award
    },
    {
      title: 'Interactive Content',
      description: 'Engage with multimedia content designed for modern digital learning experiences.',
      icon: CheckCircle
    }
  ];

  const userTypes = [
    {
      title: 'Students',
      description: 'Access comprehensive video lectures, track your progress, and learn with AI assistance',
      icon: GraduationCap,
      onClick: onStudentLogin,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700'
    },
    {
      title: 'Lecturers',
      description: 'Upload video content, manage courses, and track student engagement analytics',
      icon: Users,
      onClick: onLecturerLogin,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700'
    },
    {
      title: 'Administrators',
      description: 'Manage users, oversee platform operations, and ensure quality standards',
      icon: Shield,
      onClick: onAdminLogin,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-campus-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-purple-600 dark:bg-campus-deep-blue text-white py-4 px-6 sticky top-0 z-50 border-b-4 border-purple-700 dark:border-campus-purple transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8" />
            <div>
              <h1 className="text-white">Campus LearnHub</h1>
              <p className="text-purple-100 dark:text-campus-gray-300">Federal University of Technology Akure</p>
            </div>
          </div>
          <Button
            onClick={onSuperAdminLogin}
            variant="outline"
            className="bg-white dark:bg-campus-gray-800 text-purple-600 dark:text-campus-purple border-white dark:border-campus-gray-600 hover:bg-purple-50 dark:hover:bg-campus-gray-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            Super Admin
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white dark:bg-campus-gray-900 py-16 md:py-24 px-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl text-purple-900 dark:text-campus-purple leading-tight">
                  Welcome to Campus LearnHub
                </h1>
                <p className="text-xl md:text-2xl text-purple-700 dark:text-campus-gray-400 leading-relaxed">
                  A comprehensive learning management platform designed for Federal University of Technology Akure.
                  Access quality video lectures, interactive learning tools, and AI-powered assistance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={onStudentLogin}
                  size="lg"
                  className="bg-purple-600 dark:bg-campus-purple hover:bg-purple-700 dark:hover:bg-purple-500 text-white px-8 py-6 text-lg transition-colors duration-200"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Get Started as Student
                </Button>
                <Button
                  onClick={onLecturerLogin}
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-600 dark:border-campus-purple text-purple-600 dark:text-campus-purple hover:bg-purple-50 dark:hover:bg-campus-gray-800 px-8 py-6 text-lg transition-colors duration-200"
                >
                  <Users className="w-5 h-5 mr-2" />
                  I'm a Lecturer
                </Button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-200 dark:border-campus-gray-700">
                <img
                  src="https://images.unsplash.com/photo-1758270704534-fd9715bffc0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBsZWFybmluZ3xlbnwxfHx8fDE3NTk5NzA1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Students learning"
                  className="w-full h-auto object-cover"
                />
                {/* Purple overlay for brand consistency */}
                <div className="absolute inset-0 bg-purple-900 dark:bg-purple-950 opacity-10 dark:opacity-30 pointer-events-none"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 dark:bg-purple-900 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-300 dark:bg-purple-800 rounded-full opacity-40 blur-2xl"></div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {platformStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                >
                  <Card className="bg-purple-50 dark:bg-campus-gray-800 border-purple-200 dark:border-campus-gray-700 transition-colors duration-200">
                    <CardContent className="p-6 text-center">
                      <Icon className="w-8 h-8 text-purple-600 dark:text-campus-purple mx-auto mb-3" />
                      <h3 className="text-purple-900 dark:text-campus-gray-100 mb-1">{stat.value}</h3>
                      <p className="text-purple-600 dark:text-campus-gray-400">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Type Selection */}
      <section className="bg-purple-50 dark:bg-campus-gray-800 py-20 px-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-purple-900 dark:text-campus-purple mb-4">Choose Your Portal</h2>
            <p className="text-purple-700 dark:text-campus-gray-400">
              Select your role to access the appropriate dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  <Card className={`${type.bgColor} dark:bg-campus-gray-900 ${type.borderColor} dark:border-campus-gray-700 border-2 hover:shadow-lg transition-all duration-300`}>
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 ${type.buttonBg} dark:bg-campus-purple rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className={`${type.textColor} dark:text-campus-gray-100`}>{type.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-purple-600 dark:text-campus-gray-400">{type.description}</p>
                      <Button
                        onClick={type.onClick}
                        className={`w-full ${type.buttonBg} dark:bg-campus-purple ${type.buttonHover} dark:hover:bg-purple-500 text-white transition-colors duration-200`}
                      >
                        Access {type.title} Portal
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-campus-gray-900 py-20 px-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-purple-900 dark:text-campus-purple mb-4">Platform Features</h2>
            <p className="text-purple-700 dark:text-campus-gray-400">
              Everything you need for an enhanced learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="bg-white dark:bg-campus-gray-800 border-purple-200 dark:border-campus-gray-700 border hover:border-purple-400 dark:hover:border-campus-purple transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-campus-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-purple-600 dark:text-campus-purple" />
                      </div>
                      <h3 className="text-purple-900 dark:text-campus-gray-100 mb-3">{feature.title}</h3>
                      <p className="text-purple-600 dark:text-campus-gray-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-600 dark:bg-campus-deep-blue text-white py-8 px-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="w-6 h-6" />
            <h3 className="text-white">Campus LearnHub</h3>
          </div>
          <p className="text-purple-100 dark:text-campus-gray-300">
            Federal University of Technology Akure
          </p>
          <p className="text-purple-200 dark:text-campus-gray-400 mt-2">
            © 2025 Campus LearnHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
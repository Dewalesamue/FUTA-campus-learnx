import { useState, useEffect } from 'react';
import { User, LogOut, Play, Clock, BookOpen, Video, Edit3, Camera, Search, Filter, GraduationCap, Calendar, Users, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';

// ===========================
// INTERFACES & TYPES
// ===========================

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin' | 'super-admin';
  studentId?: string;
  level?: number;  // University level (100, 200, 300, 400, 500)
}

interface StudentDashboardProps {
  onLogout: () => void;
  onVideoSelect: (video: Video) => void;
  onGoToSettings?: () => void;
  currentUser: User;
}

interface Video {
  id: string;
  title: string;
  lecturer: string;
  course: string;
  duration: string;
  rating: number;
  thumbnail: string;
  level?: number;  // University level (100, 200, 300, 400, 500)
}

interface Course {
  id: string;
  name: string;
  code: string;
  lecturer: string;
  videoCount: number;
  lastAccessed?: string;
  department: string;
}

interface Profile {
  name: string;
  email: string;
  studentId: string;
  department: string;
  level: string;
  profileImage?: string;
}

// ===========================
// MAIN COMPONENT
// ===========================

export function StudentDashboard({ onLogout, onVideoSelect, onGoToSettings, currentUser }: StudentDashboardProps) {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  
  const [activeTab, setActiveTab] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [profile, setProfile] = useState<Profile>({
    name: currentUser.name || 'John Adebayo',
    email: currentUser.email || 'john.adebayo@student.futa.edu.ng',
    studentId: currentUser.studentId || 'IFT/21/4098',
    department: 'Computer Science',
    level: currentUser.level ? `${currentUser.level} Level` : '300 Level',
    profileImage: undefined
  });

  // ===========================
  // MOCK DATA
  // ===========================

  const mockCourses: Course[] = [
    {
      id: '1',
      name: 'Data Structures and Algorithms',
      code: 'CSC 301',
      lecturer: 'Dr. Johnson Okafor',
      videoCount: 12,
      lastAccessed: '2024-01-15',
      department: 'Computer Science'
    },
    {
      id: '2',
      name: 'Database Management Systems',
      code: 'CSC 302',
      lecturer: 'Prof. Sarah Ahmed',
      videoCount: 15,
      lastAccessed: '2024-01-14',
      department: 'Computer Science'
    },
    {
      id: '3',
      name: 'Software Engineering',
      code: 'CSC 303',
      lecturer: 'Dr. Michael Adeoye',
      videoCount: 18,
      lastAccessed: '2024-01-13',
      department: 'Computer Science'
    },
    {
      id: '4',
      name: 'Computer Networks',
      code: 'CSC 304',
      lecturer: 'Dr. Fatima Ibrahim',
      videoCount: 10,
      lastAccessed: '2024-01-12',
      department: 'Computer Science'
    },
    {
      id: '5',
      name: 'Operating Systems',
      code: 'CSC 305',
      lecturer: 'Prof. Emmanuel Olumide',
      videoCount: 14,
      department: 'Computer Science'
    },
    {
      id: '6',
      name: 'Web Technologies',
      code: 'CSC 306',
      lecturer: 'Dr. Grace Nkomo',
      videoCount: 8,
      department: 'Computer Science'
    }
  ];

  const mockVideos: Video[] = [
    {
      id: '1',
      title: 'Introduction to Programming Concepts',
      lecturer: 'Dr. Johnson Okafor',
      course: 'Introduction to Computer Science',
      duration: '45:30',
      rating: 4.8,
      thumbnail: '/api/placeholder/300/200',
      level: 100
    },
    {
      id: '2',
      title: 'Basic Web Development',
      lecturer: 'Prof. Sarah Ahmed',
      course: 'Web Fundamentals',
      duration: '38:45',
      rating: 4.9,
      thumbnail: '/api/placeholder/300/200',
      level: 100
    },
    {
      id: '3',
      title: 'Data Structures Fundamentals',
      lecturer: 'Dr. Michael Adeoye',
      course: 'Data Structures',
      duration: '52:15',
      rating: 4.7,
      thumbnail: '/api/placeholder/300/200',
      level: 200
    },
    {
      id: '4',
      title: 'Object-Oriented Programming',
      lecturer: 'Dr. Fatima Ibrahim',
      course: 'Advanced Programming',
      duration: '41:20',
      rating: 4.6,
      thumbnail: '/api/placeholder/300/200',
      level: 200
    },
    {
      id: '5',
      title: 'Introduction to Binary Trees',
      lecturer: 'Dr. Johnson Okafor',
      course: 'Data Structures and Algorithms',
      duration: '45:30',
      rating: 4.8,
      thumbnail: '/api/placeholder/300/200',
      level: 300
    },
    {
      id: '6',
      title: 'SQL Fundamentals',
      lecturer: 'Prof. Sarah Ahmed',
      course: 'Database Management Systems',
      duration: '38:45',
      rating: 4.9,
      thumbnail: '/api/placeholder/300/200',
      level: 300
    },
    {
      id: '7',
      title: 'Software Development Life Cycle',
      lecturer: 'Dr. Michael Adeoye',
      course: 'Software Engineering',
      duration: '52:15',
      rating: 4.7,
      thumbnail: '/api/placeholder/300/200',
      level: 300
    },
    {
      id: '8',
      title: 'Advanced Algorithms',
      lecturer: 'Dr. Fatima Ibrahim',
      course: 'Algorithm Design',
      duration: '41:20',
      rating: 4.6,
      thumbnail: '/api/placeholder/300/200',
      level: 400
    },
    {
      id: '9',
      title: 'Machine Learning Basics',
      lecturer: 'Prof. Emmanuel Olumide',
      course: 'Introduction to AI',
      duration: '55:10',
      rating: 4.9,
      thumbnail: '/api/placeholder/300/200',
      level: 400
    },
    {
      id: '10',
      title: 'Advanced Software Architecture',
      lecturer: 'Dr. Grace Nkomo',
      course: 'Software Design',
      duration: '48:25',
      rating: 4.8,
      thumbnail: '/api/placeholder/300/200',
      level: 500
    },
    {
      id: '11',
      title: 'Deep Learning and Neural Networks',
      lecturer: 'Prof. Emmanuel Olumide',
      course: 'Advanced AI',
      duration: '62:15',
      rating: 4.9,
      thumbnail: '/api/placeholder/300/200',
      level: 500
    }
  ];

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================

  /**
   * Filters videos based on student level
   * Students can only see videos for their level
   * Super-admins can see all videos
   */
  const filterVideosByLevel = (videos: Video[]): Video[] => {
    // Super-admins can see all videos
    if (currentUser.role === 'super-admin') {
      return videos;
    }
    
    // Students can only see videos matching their level
    if (currentUser.role === 'student' && currentUser.level) {
      return videos.filter(video => video.level === currentUser.level);
    }
    
    return videos;
  };

  const filteredVideos = filterVideosByLevel(mockVideos);
  const recentVideos = filteredVideos.slice(0, 4);

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // ===========================
  // EVENT HANDLERS
  // ===========================

  const handleVideoPlay = (video: Video) => {
    onVideoSelect(video);
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          profileImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = () => {
    // Here you would typically save to backend
    setIsEditingProfile(false);
  };

  // ===========================
  // RENDER FUNCTIONS
  // ===========================

  /**
   * Renders the dashboard header with user profile
   */
  const renderHeader = () => (
    <div className="bg-white dark:bg-campus-gray-800 border-b border-futa-gray-200 dark:border-campus-gray-700 px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.profileImage} alt={profile.name} />
            <AvatarFallback className="bg-campus-sky-blue dark:bg-campus-purple text-white">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-campus-deep-blue dark:text-campus-purple">Welcome back, {profile.name.split(' ')[0]}</h1>
            <p className="text-campus-gray-600 dark:text-campus-gray-400">{profile.studentId} • {profile.level}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-campus-deep-blue dark:text-campus-purple border-campus-deep-blue dark:border-campus-purple">
            {profile.department}
          </Badge>
          {onGoToSettings && (
            <Button
              onClick={onGoToSettings}
              variant="outline"
              className="border-campus-gray-300 dark:border-campus-gray-600 text-campus-gray-700 dark:text-campus-gray-300 hover:bg-campus-gray-50 dark:hover:bg-campus-gray-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          )}
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  /**
   * Renders the course grid
   */
  const renderCourseGrid = () => {
    const filteredCourses = mockCourses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || course.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-white dark:bg-campus-gray-800 border-campus-gray-200 dark:border-campus-gray-700 transition-colors duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="bg-campus-sky-blue/20 dark:bg-campus-purple/20 text-campus-deep-blue dark:text-campus-purple">
                    {course.code}
                  </Badge>
                  <div className="flex items-center text-campus-gray-500 dark:text-campus-gray-400">
                    <Video className="w-4 h-4 mr-1" />
                    <span>{course.videoCount}</span>
                  </div>
                </div>
                <CardTitle className="text-campus-navy dark:text-campus-gray-100 line-clamp-2">
                  {course.name}
                </CardTitle>
                <p className="text-campus-gray-600 dark:text-campus-gray-400">
                  {course.lecturer}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                {course.lastAccessed && (
                  <div className="flex items-center text-campus-gray-600 dark:text-campus-gray-400 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    Last accessed: {formatDate(course.lastAccessed)}
                  </div>
                )}
                <Button 
                  className="w-full bg-campus-deep-blue dark:bg-campus-purple text-white hover:bg-campus-sky-blue dark:hover:bg-campus-purple/90"
                  onClick={() => setActiveTab('videos')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  View Course Content
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  /**
   * Renders the video grid with level-based filtering
   */
  const renderVideoGrid = () => {
    const searchFilteredVideos = filteredVideos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    if (searchFilteredVideos.length === 0) {
      return (
        <div className="text-center py-12">
          <Video className="w-16 h-16 mx-auto text-campus-gray-400 dark:text-campus-gray-600 mb-4" />
          <h3 className="text-campus-gray-900 dark:text-campus-gray-100 mb-2">No videos available</h3>
          <p className="text-campus-gray-600 dark:text-campus-gray-400">
            {searchQuery 
              ? "No videos match your search criteria."
              : `No videos are currently available for ${currentUser.level} Level students.`}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {searchFilteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-white dark:bg-campus-gray-800 border-campus-gray-200 dark:border-campus-gray-700 overflow-hidden transition-colors duration-200">
              <div className="aspect-video bg-campus-gray-100 dark:bg-campus-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-campus-gray-400 dark:text-campus-gray-500" />
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-campus-deep-blue dark:bg-campus-purple text-white">
                    {video.level} Level
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-campus-navy dark:text-campus-gray-100 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-campus-gray-600 dark:text-campus-gray-400 mb-2">{video.course}</p>
                <p className="text-campus-gray-600 dark:text-campus-gray-400 mb-3">{video.lecturer}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-campus-gray-600 dark:text-campus-gray-400">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{video.rating}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-campus-deep-blue dark:bg-campus-purple text-white hover:bg-campus-sky-blue dark:hover:bg-campus-purple/90"
                    onClick={() => handleVideoPlay(video)}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  /**
   * Renders the profile management section
   */
  const renderProfile = () => (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white dark:bg-campus-gray-800 border-campus-gray-200 dark:border-campus-gray-700 transition-colors duration-200">
        <CardHeader>
          <CardTitle className="text-campus-navy dark:text-campus-gray-100">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.profileImage} alt={profile.name} />
                <AvatarFallback className="bg-campus-deep-blue dark:bg-campus-purple text-white text-xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              {isEditingProfile && (
                <label className="absolute -bottom-2 -right-2 bg-campus-deep-blue dark:bg-campus-purple text-white p-2 rounded-full cursor-pointer hover:bg-campus-sky-blue dark:hover:bg-campus-purple/90 transition-colors duration-200">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageUpload}
                  />
                </label>
              )}
            </div>
            <div>
              <h3 className="text-campus-navy dark:text-campus-gray-100">{profile.name}</h3>
              <p className="text-campus-gray-600 dark:text-campus-gray-400">{profile.studentId}</p>
              <p className="text-campus-gray-600 dark:text-campus-gray-400">{profile.level}</p>
            </div>
          </div>

          {/* Profile Form */}
          {isEditingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-campus-gray-700 dark:text-campus-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="border-campus-gray-300 dark:border-campus-gray-600 bg-white dark:bg-campus-gray-700 text-campus-gray-900 dark:text-campus-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-campus-gray-700 dark:text-campus-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="border-campus-gray-300 dark:border-campus-gray-600 bg-white dark:bg-campus-gray-700 text-campus-gray-900 dark:text-campus-gray-100"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentId" className="text-campus-gray-700 dark:text-campus-gray-300">Student ID</Label>
                  <Input
                    id="studentId"
                    value={profile.studentId}
                    disabled
                    className="border-campus-gray-300 dark:border-campus-gray-600 bg-campus-gray-50 dark:bg-campus-gray-900 text-campus-gray-600 dark:text-campus-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="text-campus-gray-700 dark:text-campus-gray-300">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    disabled
                    className="border-campus-gray-300 dark:border-campus-gray-600 bg-campus-gray-50 dark:bg-campus-gray-900 text-campus-gray-600 dark:text-campus-gray-400"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleProfileSave}
                  className="bg-campus-deep-blue dark:bg-campus-purple text-white hover:bg-campus-sky-blue dark:hover:bg-campus-purple/90"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  className="border-campus-gray-300 dark:border-campus-gray-600 text-campus-gray-700 dark:text-campus-gray-300 hover:bg-campus-gray-50 dark:hover:bg-campus-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-campus-gray-700 dark:text-campus-gray-300">Full Name</Label>
                  <p className="text-campus-navy dark:text-campus-gray-100 mt-1">{profile.name}</p>
                </div>
                <div>
                  <Label className="text-campus-gray-700 dark:text-campus-gray-300">Email</Label>
                  <p className="text-campus-navy dark:text-campus-gray-100 mt-1">{profile.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-campus-gray-700 dark:text-campus-gray-300">Student ID</Label>
                  <p className="text-campus-navy dark:text-campus-gray-100 mt-1">{profile.studentId}</p>
                </div>
                <div>
                  <Label className="text-campus-gray-700 dark:text-campus-gray-300">Department</Label>
                  <p className="text-campus-navy dark:text-campus-gray-100 mt-1">{profile.department}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-campus-gray-700 dark:text-campus-gray-300">Level</Label>
                <p className="text-campus-navy dark:text-campus-gray-100 mt-1">{profile.level}</p>
              </div>

              <Button 
                onClick={() => setIsEditingProfile(true)}
                className="bg-campus-deep-blue dark:bg-campus-purple text-white hover:bg-campus-sky-blue dark:hover:bg-campus-purple/90"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  /**
   * Renders recent videos section with level-based filtering
   */
  const renderRecentVideos = () => {
    if (recentVideos.length === 0) {
      return null;
    }

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-campus-navy dark:text-campus-gray-100">Continue Watching</h2>
          <Badge variant="outline" className="border-campus-deep-blue dark:border-campus-purple text-campus-deep-blue dark:text-campus-purple">
            {currentUser.level} Level
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentVideos.map((video) => (
            <Card key={video.id} className="bg-white dark:bg-campus-gray-800 border-campus-gray-200 dark:border-campus-gray-700 overflow-hidden transition-colors duration-200">
              <div className="aspect-video bg-campus-gray-100 dark:bg-campus-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-8 h-8 text-campus-gray-400 dark:text-campus-gray-500" />
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-campus-deep-blue dark:bg-campus-purple text-white text-xs">
                    {video.level}L
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-3">
                <h4 className="text-campus-navy dark:text-campus-gray-100 text-sm mb-1 line-clamp-2">{video.title}</h4>
                <p className="text-campus-gray-600 dark:text-campus-gray-400 text-xs mb-2">{video.course}</p>
                <Button
                  size="sm"
                  className="w-full bg-campus-deep-blue dark:bg-campus-purple text-white hover:bg-campus-sky-blue dark:hover:bg-campus-purple/90"
                  onClick={() => handleVideoPlay(video)}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Continue
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ===========================
  // MAIN RENDER
  // ===========================

  return (
    <div className="min-h-screen bg-campus-gray-50 dark:bg-campus-gray-900 transition-colors duration-200">
      {renderHeader()}
      
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-white dark:bg-campus-gray-800 border border-campus-gray-200 dark:border-campus-gray-700">
            <TabsTrigger 
              value="courses" 
              className="data-[state=active]:bg-campus-deep-blue dark:data-[state=active]:bg-campus-purple data-[state=active]:text-white dark:text-campus-gray-300"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger 
              value="videos"
              className="data-[state=active]:bg-campus-deep-blue dark:data-[state=active]:bg-campus-purple data-[state=active]:text-white dark:text-campus-gray-300"
            >
              <Video className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-futa-green data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {renderRecentVideos()}
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-campus-gray-400 dark:text-campus-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-campus-gray-300 dark:border-campus-gray-600 bg-white dark:bg-campus-gray-800 text-campus-gray-900 dark:text-campus-gray-100"
                />
              </div>
            </div>

            <div>
              <h2 className="text-campus-navy dark:text-campus-gray-100 mb-4">Your Courses</h2>
              {renderCourseGrid()}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            {/* Level Info Banner */}
            <Card className="bg-campus-sky-blue/10 dark:bg-campus-purple/10 border-campus-sky-blue/20 dark:border-campus-purple/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-campus-deep-blue dark:text-campus-purple mt-0.5" />
                  <div>
                    <h3 className="text-campus-deep-blue dark:text-campus-purple mb-1">Level-Based Content</h3>
                    <p className="text-campus-gray-700 dark:text-campus-gray-300 text-sm">
                      You are viewing videos for <strong>{currentUser.level} Level</strong> students. 
                      Videos are curated specifically for your academic level to ensure relevant and appropriate content.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-campus-gray-400 dark:text-campus-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-campus-gray-300 dark:border-campus-gray-600 bg-white dark:bg-campus-gray-800 text-campus-gray-900 dark:text-campus-gray-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-campus-navy dark:text-campus-gray-100">All Videos</h2>
                <Badge variant="outline" className="border-campus-deep-blue dark:border-campus-purple text-campus-deep-blue dark:text-campus-purple">
                  {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} available
                </Badge>
              </div>
              {renderVideoGrid()}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            {renderProfile()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
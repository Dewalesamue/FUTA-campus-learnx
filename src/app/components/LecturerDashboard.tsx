import { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { VideoUploadModal } from './VideoUploadModal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  User,
  LogOut,
  Upload,
  Play,
  Eye,
  BookOpen,
  Video,
  Plus,
  Edit3,
  Camera,
  Users,
  Clock,
  Star,
  Calendar,
  Settings,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';

// ===========================
// INTERFACES & TYPES
// ===========================

interface LecturerDashboardProps {
  onLogout: () => void;
  onGoToSettings?: () => void;
}

interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  enrolledStudents: number;
  totalVideos: number;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
}

interface Video {
  id: string;
  title: string;
  course: string;
  duration: string;
  views: number;
  uploadDate: string;
  status: 'published' | 'processing' | 'draft';
  thumbnail: string;
}

interface Profile {
  name: string;
  email: string;
  staffId: string;
  department: string;
  title: string;
  bio: string;
  profileImage?: string;
  officeLocation: string;
  phone: string;
}

interface Analytics {
  totalStudents: number;
  totalVideos: number;
  totalViews: number;
  totalCourses: number;
}

// ===========================
// MAIN COMPONENT
// ===========================

export function LecturerDashboard({ onLogout }: LecturerDashboardProps) {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [profile, setProfile] = useState<Profile>({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@futa.edu.ng',
    staffId: 'FUTA/CSC/001',
    department: 'Computer Science',
    title: 'Senior Lecturer',
    bio: 'Experienced educator specializing in Data Structures, Algorithms, and Software Engineering with over 10 years of teaching experience.',
    profileImage: undefined,
    officeLocation: 'CSC Building, Room 201',
    phone: '+234 801 234 5678'
  });

  // ===========================
  // MOCK DATA
  // ===========================

  const analytics: Analytics = {
    totalStudents: 1250,
    totalVideos: 48,
    totalViews: 15420,
    totalCourses: 6
  };

  const mockCourses: Course[] = [
    {
      id: '1',
      name: 'Data Structures and Algorithms',
      code: 'CSC 301',
      department: 'Computer Science',
      enrolledStudents: 245,
      totalVideos: 12,
      lastUpdated: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Software Engineering',
      code: 'CSC 401',
      department: 'Computer Science',
      enrolledStudents: 180,
      totalVideos: 15,
      lastUpdated: '2024-01-14',
      status: 'active'
    },
    {
      id: '3',
      name: 'Advanced Algorithms',
      code: 'CSC 501',
      department: 'Computer Science',
      enrolledStudents: 95,
      totalVideos: 8,
      lastUpdated: '2024-01-13',
      status: 'draft'
    },
    {
      id: '4',
      name: 'Machine Learning Fundamentals',
      code: 'CSC 502',
      department: 'Computer Science',
      enrolledStudents: 120,
      totalVideos: 10,
      lastUpdated: '2024-01-12',
      status: 'active'
    }
  ];

  const mockVideos: Video[] = [
    {
      id: '1',
      title: 'Introduction to Binary Trees',
      course: 'Data Structures and Algorithms',
      duration: '45:30',
      views: 1245,
      uploadDate: '2024-01-15',
      status: 'published',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Graph Traversal Algorithms',
      course: 'Data Structures and Algorithms',
      duration: '52:15',
      views: 980,
      uploadDate: '2024-01-14',
      status: 'published',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'Software Development Life Cycle',
      course: 'Software Engineering',
      duration: '38:45',
      views: 756,
      uploadDate: '2024-01-13',
      status: 'published',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '4',
      title: 'Neural Network Basics',
      course: 'Machine Learning Fundamentals',
      duration: '41:20',
      views: 432,
      uploadDate: '2024-01-12',
      status: 'processing',
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================

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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
      case 'published':
        return 'bg-futa-green text-white';
      case 'draft':
        return 'bg-futa-light-green text-futa-navy';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-futa-gray-100 text-futa-gray-600';
      default:
        return 'bg-futa-gray-100 text-futa-gray-600';
    }
  };

  // ===========================
  // EVENT HANDLERS
  // ===========================

  const handleVideoUpload = (videoData: any) => {
    console.log('Video uploaded:', videoData);
    setIsUploadModalOpen(false);
    // Here you would typically add the video to your state or refresh the data
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
   * Renders the dashboard header
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
            <h1 className="text-campus-deep-blue dark:text-campus-purple">Welcome, {profile.name}</h1>
            <p className="text-campus-gray-600 dark:text-campus-gray-400">{profile.title} • {profile.department}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-campus-purple dark:bg-campus-purple hover:bg-purple-700 dark:hover:bg-purple-500 text-white transition-colors duration-200"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  /**
   * Renders analytics cards
   */
  const renderAnalyticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white border-futa-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-futa-gray-600">Total Students</p>
              <p className="text-2xl text-futa-navy">{analytics.totalStudents.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-futa-green" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-futa-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-futa-gray-600">Total Videos</p>
              <p className="text-2xl text-futa-navy">{analytics.totalVideos}</p>
            </div>
            <Video className="w-8 h-8 text-futa-green" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-futa-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-futa-gray-600">Total Views</p>
              <p className="text-2xl text-futa-navy">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-futa-green" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-futa-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-futa-gray-600">Active Courses</p>
              <p className="text-2xl text-futa-navy">{analytics.totalCourses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-futa-green" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  /**
   * Renders course management section
   */
  const renderCourseManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-futa-navy">Your Courses</h2>
        <Button className="bg-futa-green text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-white border-futa-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-futa-navy border-futa-navy">
                        {course.code}
                      </Badge>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-futa-navy">
                      {course.name}
                    </CardTitle>
                  </div>
                  <Button size="sm" variant="outline" className="border-futa-gray-300">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-futa-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {course.enrolledStudents} students
                  </div>
                  <div className="flex items-center text-futa-gray-600">
                    <Video className="w-4 h-4 mr-2" />
                    {course.totalVideos} videos
                  </div>
                </div>
                
                <div className="flex items-center text-futa-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Updated {formatDate(course.lastUpdated)}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-futa-green text-white"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Add Video
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-futa-gray-300"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  /**
   * Renders video management section
   */
  const renderVideoManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-futa-navy">Your Videos</h2>
        <Button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-futa-green text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New Video
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-white border-futa-gray-200 overflow-hidden">
              <div className="aspect-video bg-futa-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-futa-gray-400" />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(video.status)}>
                    {video.status}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-futa-navy mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-futa-gray-600 text-sm mb-3">{video.course}</p>
                
                <div className="flex items-center justify-between text-sm text-futa-gray-600 mb-3">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {video.views} views
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(video.uploadDate)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-futa-green text-white">
                    <Play className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-futa-gray-300">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  /**
   * Renders profile management section
   */
  const renderProfile = () => (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-white border-futa-gray-200">
        <CardHeader>
          <CardTitle className="text-futa-navy">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profileImage} alt={profile.name} />
                <AvatarFallback className="bg-futa-green text-white text-2xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              {isEditingProfile && (
                <label className="absolute -bottom-2 -right-2 bg-futa-green text-white p-2 rounded-full cursor-pointer">
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
              <h3 className="text-futa-navy text-xl">{profile.name}</h3>
              <p className="text-futa-gray-600">{profile.title}</p>
              <p className="text-futa-gray-600">{profile.staffId}</p>
            </div>
          </div>

          {/* Profile Form */}
          {isEditingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="border-futa-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="border-futa-gray-300"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                    className="border-futa-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="border-futa-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="staffId">Staff ID</Label>
                  <Input
                    id="staffId"
                    value={profile.staffId}
                    disabled
                    className="border-futa-gray-300 bg-futa-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="office">Office Location</Label>
                  <Input
                    id="office"
                    value={profile.officeLocation}
                    onChange={(e) => setProfile(prev => ({ ...prev, officeLocation: e.target.value }))}
                    className="border-futa-gray-300"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="border-futa-gray-300"
                  rows={4}
                />
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleProfileSave}
                  className="bg-futa-green text-white"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  className="border-futa-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="text-futa-navy mt-1">{profile.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-futa-navy mt-1">{profile.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <p className="text-futa-navy mt-1">{profile.title}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-futa-navy mt-1">{profile.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Staff ID</Label>
                  <p className="text-futa-navy mt-1">{profile.staffId}</p>
                </div>
                <div>
                  <Label>Office Location</Label>
                  <p className="text-futa-navy mt-1">{profile.officeLocation}</p>
                </div>
              </div>
              
              <div>
                <Label>Bio</Label>
                <p className="text-futa-navy mt-1 leading-relaxed">{profile.bio}</p>
              </div>

              <Button 
                onClick={() => setIsEditingProfile(true)}
                className="bg-futa-green text-white"
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

  // ===========================
  // MAIN RENDER
  // ===========================

  return (
    <div className="min-h-screen bg-campus-gray-50 dark:bg-campus-gray-900 transition-colors duration-200">
      {renderHeader()}
      
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-4 mb-8 bg-white dark:bg-campus-gray-800 border border-campus-gray-200 dark:border-campus-gray-700 transition-colors duration-200">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-futa-green data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="courses"
              className="data-[state=active]:bg-futa-green data-[state=active]:text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger 
              value="videos"
              className="data-[state=active]:bg-futa-green data-[state=active]:text-white"
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

          <TabsContent value="overview">
            {renderAnalyticsCards()}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="bg-white border-futa-gray-200">
                <CardHeader>
                  <CardTitle className="text-futa-navy">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-futa-green rounded-full"></div>
                      <p className="text-futa-gray-600">Video "Introduction to Binary Trees" uploaded</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-futa-green rounded-full"></div>
                      <p className="text-futa-gray-600">Course "Advanced Algorithms" updated</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-futa-green rounded-full"></div>
                      <p className="text-futa-gray-600">245 new student enrollments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-futa-gray-200">
                <CardHeader>
                  <CardTitle className="text-futa-navy">Top Performing Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-futa-gray-600">Introduction to Binary Trees</p>
                      <span className="text-futa-navy">1,245 views</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-futa-gray-600">Graph Traversal Algorithms</p>
                      <span className="text-futa-navy">980 views</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-futa-gray-600">Software Development Life Cycle</p>
                      <span className="text-futa-navy">756 views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            {renderCourseManagement()}
          </TabsContent>

          <TabsContent value="videos">
            {renderVideoManagement()}
          </TabsContent>

          <TabsContent value="profile">
            {renderProfile()}
          </TabsContent>
        </Tabs>
      </div>

      {isUploadModalOpen && (
        <VideoUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleVideoUpload}
        />
      )}
    </div>
  );
}
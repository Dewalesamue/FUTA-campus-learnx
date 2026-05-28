import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import {
  Home,
  Users,
  Video,
  Shield,
  Settings,
  Upload,
  Crown,
  GraduationCap,
  Menu,
  LogOut,
  X,
  Search,
  AlertCircle,
  UserX,
  Ban,
  UserCheck,
  UserMinus,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin' | 'super-admin';
  studentId?: string;
  status: 'active' | 'suspended' | 'pending' | 'banned';
  createdAt: string;
  lastLogin?: string;
  suspendedUntil?: string;
}

interface Video {
  id: string;
  title: string;
  lecturer: string;
  lecturerId: string;
  course: string;
  duration: string;
  description?: string;
  uploadDate: string;
  views: number;
  students: number;
  status: 'published' | 'draft' | 'pending' | 'rejected';
  thumbnail: string;
  rating: number;
}

interface AdminStats {
  totalStudents: number;
  totalLecturers: number;
  totalVideos: number;
  pendingApprovals: number;
  activeUsers: number;
  suspendedUsers: number;
  totalAdmins: number;
  bannedUsers: number;
}

interface AdminDashboardProps {
  onLogout?: () => void;
  currentUser?: User;
  allUsers?: User[];
  setAllUsers?: (users: User[]) => void;
}

export function AdminDashboard({ onLogout, currentUser, allUsers = [], setAllUsers }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'videos' | 'admins' | 'content' | 'settings'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>(allUsers);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'ban' | 'promote' | 'delete' | 'unsuspend' | 'demote' | null>(null);
  const [suspendDuration, setSuspendDuration] = useState('7');
  const [suspendReason, setSuspendReason] = useState('');

  const isSuperAdmin = currentUser?.role === 'super-admin';

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data with enhanced stats
  const mockStats: AdminStats = {
    totalStudents: 1247,
    totalLecturers: 89,
    totalVideos: 342,
    pendingApprovals: 12,
    activeUsers: 1205,
    suspendedUsers: 5,
    totalAdmins: 3,
    bannedUsers: 2
  };

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Adebayo',
      email: 'john@student.futa.edu.ng',
      role: 'student',
      studentId: 'IFT/21/4098',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20'
    },
    {
      id: '2',
      name: 'Jane Ogundipe',
      email: 'jane@student.futa.edu.ng',
      role: 'student',
      studentId: 'ENG/21/2045',
      status: 'suspended',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-18',
      suspendedUntil: '2024-02-10'
    },
    {
      id: '3',
      name: 'Dr. Adebayo Johnson',
      email: 'adebayo@lecturer.futa.edu.ng',
      role: 'lecturer',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-21'
    },
    {
      id: '4',
      name: 'Michael Adeolu',
      email: 'michael@student.futa.edu.ng',
      role: 'student',
      studentId: 'CSC/21/1567',
      status: 'pending',
      createdAt: '2024-01-22',
    },
    {
      id: '5',
      name: 'System Admin',
      email: 'admin@futa.edu.ng',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-21'
    },
    {
      id: '6',
      name: 'Prof. Williams',
      email: 'prof.williams@futa.edu.ng',
      role: 'lecturer',
      status: 'banned',
      createdAt: '2023-12-15',
      lastLogin: '2024-01-15'
    }
  ];

  const mockVideos: Video[] = [
    {
      id: '1',
      title: 'Introduction to Data Structures',
      lecturer: 'Dr. Adebayo Johnson',
      lecturerId: '3',
      course: 'Computer Science',
      duration: '45 min',
      description: 'Basic concepts of arrays, linked lists, and their applications.',
      uploadDate: '2024-01-15',
      views: 245,
      students: 89,
      status: 'published',
      thumbnail: '/api/placeholder/400/300',
      rating: 4.8
    },
    {
      id: '2',
      title: 'Organic Chemistry Fundamentals',
      lecturer: 'Dr. Michael Ogbonna',
      lecturerId: 'lecturer-2',
      course: 'Chemistry',
      duration: '55 min',
      description: 'Introduction to organic chemistry principles.',
      uploadDate: '2024-01-22',
      views: 0,
      students: 0,
      status: 'pending',
      thumbnail: '/api/placeholder/400/300',
      rating: 0
    },
    {
      id: '3',
      title: 'Engineering Mathematics',
      lecturer: 'Prof. Williams',
      lecturerId: '6',
      course: 'Engineering',
      duration: '60 min',
      description: 'Advanced mathematics for engineering students.',
      uploadDate: '2024-01-10',
      views: 150,
      students: 45,
      status: 'published',
      thumbnail: '/api/placeholder/400/300',
      rating: 4.2
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats(mockStats);
      setUsers(allUsers.length > 0 ? allUsers : mockUsers);
      setVideos(mockVideos);
      setLoading(false);
    }, 1000);
  }, [allUsers]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'videos', label: 'Video Management', icon: Video },
    ...(isSuperAdmin ? [
      { id: 'admins', label: 'Admin Management', icon: Shield },
      { id: 'content', label: 'Content Creation', icon: Upload }
    ] : []),
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-campus-sky-blue text-white">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-500 text-white">Suspended</Badge>;
      case 'banned':
        return <Badge className="bg-red-600 text-white">Banned</Badge>;
      case 'pending':
        return <Badge className="bg-campus-purple text-white">Pending</Badge>;
      case 'published':
        return <Badge className="bg-campus-sky-blue text-white">Published</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600 text-white">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super-admin':
        return <Badge className="bg-campus-purple text-white"><Crown className="w-3 h-3 mr-1" />Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-campus-deep-blue text-white"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'lecturer':
        return <Badge className="bg-campus-sky-blue text-white"><GraduationCap className="w-3 h-3 mr-1" />Lecturer</Badge>;
      case 'student':
        return <Badge className="bg-campus-gray-500 text-white"><Users className="w-3 h-3 mr-1" />Student</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.studentId && user.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'admins') {
      return (user.role === 'admin' || user.role === 'super-admin') && matchesSearch;
    }
    
    return matchesSearch;
  });

  const handleUserAction = (user: User, action: string) => {
    setSelectedUser(user);
    setActionType(action as any);
    setActionDialogOpen(true);
  };

  const executeUserAction = () => {
    if (!selectedUser || !actionType) return;

    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        switch (actionType) {
          case 'suspend':
            const suspendDate = new Date();
            suspendDate.setDate(suspendDate.getDate() + parseInt(suspendDuration));
            return { 
              ...user, 
              status: 'suspended' as const,
              suspendedUntil: suspendDate.toISOString().split('T')[0]
            };
          case 'unsuspend':
            return { ...user, status: 'active' as const, suspendedUntil: undefined };
          case 'ban':
            return { ...user, status: 'banned' as const };
          case 'promote':
            return { ...user, role: user.role === 'lecturer' ? 'admin' as const : user.role };
          case 'demote':
            return { ...user, role: user.role === 'admin' ? 'lecturer' as const : user.role };
          case 'delete':
            return null;
          default:
            return user;
        }
      }
      return user;
    }).filter(user => user !== null) as User[];

    setUsers(updatedUsers);
    if (setAllUsers) {
      setAllUsers(updatedUsers);
    }
    setActionDialogOpen(false);
    setSelectedUser(null);
    setActionType(null);
    setSuspendReason('');
  };

  const handleVideoAction = (videoId: string, action: 'approve' | 'reject' | 'delete') => {
    const updatedVideos = videos.map(video => {
      if (video.id === videoId) {
        switch (action) {
          case 'approve':
            return { ...video, status: 'published' as const };
          case 'reject':
            return { ...video, status: 'rejected' as const };
          case 'delete':
            return null;
          default:
            return video;
        }
      }
      return video;
    }).filter(video => video !== null) as Video[];

    setVideos(updatedVideos);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('Logout clicked');
      window.location.reload();
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-campus-light-blue">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-campus-gray-200 border-t-campus-sky-blue rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-campus-gray-600">Loading admin dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-campus-gray-50 dark:bg-campus-gray-900 flex relative transition-colors duration-200">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${
              isMobile ? 'fixed' : 'relative'
            } w-64 bg-white dark:bg-campus-gray-800 border-r border-campus-gray-200 dark:border-campus-gray-700 flex flex-col z-50 h-screen transition-colors duration-200`}
          >
            {/* Logo */}
            <div className="p-6 border-b border-campus-gray-200 dark:border-campus-gray-700">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-8 h-8 bg-campus-deep-blue dark:bg-campus-purple rounded-lg flex items-center justify-center">
                    {isSuperAdmin ? (
                      <Crown className="w-4 h-4 text-white" />
                    ) : (
                      <Shield className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-campus-deep-blue dark:text-campus-purple">
                      {isSuperAdmin ? 'Super Admin' : 'Admin Panel'}
                    </h1>
                    <p className="text-campus-gray-600 dark:text-campus-gray-400">System Management</p>
                  </div>
                </motion.div>
                
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="lg:hidden text-campus-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-campus-deep-blue dark:bg-campus-purple text-white'
                        : 'text-campus-gray-600 dark:text-campus-gray-400 hover:bg-campus-gray-100 dark:hover:bg-campus-gray-700'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* Admin Profile */}
            <motion.div 
              className="p-4 border-t border-campus-gray-200 dark:border-campus-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-campus-deep-blue dark:bg-campus-purple text-white">
                    {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-campus-deep-blue dark:text-campus-purple">{currentUser?.name || 'Administrator'}</p>
                  <div className="flex items-center space-x-1">
                    {isSuperAdmin ? (
                      <Crown className="w-3 h-3 text-campus-purple dark:text-purple-400" />
                    ) : (
                      <Shield className="w-3 h-3 text-campus-deep-blue dark:text-campus-purple" />
                    )}
                    <p className="text-campus-gray-600 dark:text-campus-gray-400">{isSuperAdmin ? 'Super Admin' : 'System Admin'}</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full text-campus-gray-600 dark:text-campus-gray-400 hover:text-campus-deep-blue dark:hover:text-campus-purple transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="bg-white dark:bg-campus-gray-800 border-b border-campus-gray-200 dark:border-campus-gray-700 p-4 lg:hidden transition-colors duration-200">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-campus-gray-600 dark:text-campus-gray-300"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-campus-deep-blue dark:text-campus-purple">Campus LearnHub {isSuperAdmin ? 'Super ' : ''}Admin</h1>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <h1 className="text-campus-deep-blue dark:text-campus-purple mb-2">
                  {isSuperAdmin ? 'Super Admin' : 'Admin'} Dashboard
                </h1>
                <p className="text-campus-gray-600 dark:text-campus-gray-400">Monitor and manage the Federal University of Technology Akure learning platform</p>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <Card className="bg-campus-deep-blue text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-campus-light-blue">Total Students</p>
                          <p className="text-2xl text-white">{stats?.totalStudents || 0}</p>
                        </div>
                        <Users className="w-8 h-8 text-campus-sky-blue" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Card className="bg-campus-sky-blue text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80">Total Lecturers</p>
                          <p className="text-2xl text-white">{stats?.totalLecturers || 0}</p>
                        </div>
                        <GraduationCap className="w-8 h-8 text-white/80" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <Card className="bg-campus-purple text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80">Total Videos</p>
                          <p className="text-2xl text-white">{stats?.totalVideos || 0}</p>
                        </div>
                        <Video className="w-8 h-8 text-white/80" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Card className="border-campus-gray-200 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-campus-gray-600">Pending Approvals</p>
                          <p className="text-2xl text-campus-deep-blue">{stats?.pendingApprovals || 0}</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Additional stats for super admin */}
              {isSuperAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <Card className="border-campus-gray-200 bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-campus-gray-600">Total Admins</p>
                            <p className="text-2xl text-campus-deep-blue">{stats?.totalAdmins || 0}</p>
                          </div>
                          <Shield className="w-8 h-8 text-campus-deep-blue" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <Card className="border-campus-gray-200 bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-campus-gray-600">Suspended Users</p>
                            <p className="text-2xl text-campus-deep-blue">{stats?.suspendedUsers || 0}</p>
                          </div>
                          <UserX className="w-8 h-8 text-yellow-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <Card className="border-campus-gray-200 bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-campus-gray-600">Banned Users</p>
                            <p className="text-2xl text-campus-deep-blue">{stats?.bannedUsers || 0}</p>
                          </div>
                          <Ban className="w-8 h-8 text-red-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              )}

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Card className="bg-white border-campus-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-campus-deep-blue">
                      <Clock className="w-5 h-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                      >
                        <div className="w-2 h-2 bg-campus-sky-blue rounded-full mt-2" />
                        <div>
                          <p className="text-campus-deep-blue">New student registration</p>
                          <p className="text-campus-gray-500">Michael Adeolu - 2 hours ago</p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                      >
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                        <div>
                          <p className="text-campus-deep-blue">Video pending approval</p>
                          <p className="text-campus-gray-500">Organic Chemistry - 4 hours ago</p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.4 }}
                      >
                        <div className="w-2 h-2 bg-campus-sky-blue rounded-full mt-2" />
                        <div>
                          <p className="text-campus-deep-blue">Video approved and published</p>
                          <p className="text-campus-gray-500">Data Structures - 6 hours ago</p>
                        </div>
                      </motion.div>

                      {isSuperAdmin && (
                        <motion.div 
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0, duration: 0.4 }}
                        >
                          <div className="w-2 h-2 bg-campus-purple rounded-full mt-2" />
                          <div>
                            <p className="text-campus-deep-blue">User promoted to admin</p>
                            <p className="text-campus-gray-500">Dr. Johnson - 8 hours ago</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-campus-deep-blue">User Management</h2>
                  <p className="text-campus-gray-600">Manage all platform users and their permissions</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-5 h-5 text-campus-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-64 border-campus-gray-300"
                    />
                  </div>
                </div>
              </div>

              <Card className="bg-white border-campus-gray-200">
                <CardHeader>
                  <CardTitle className="text-campus-deep-blue">All Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-campus-gray-200 rounded-lg space-y-3 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-campus-sky-blue text-white">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-campus-deep-blue">{user.name}</h3>
                              {getRoleBadge(user.role)}
                            </div>
                            <p className="text-campus-gray-600">{user.email}</p>
                            {user.studentId && (
                              <p className="text-campus-gray-500">ID: {user.studentId}</p>
                            )}
                            {user.suspendedUntil && (
                              <p className="text-red-500">Suspended until: {new Date(user.suspendedUntil).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-campus-gray-600">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                            {user.lastLogin && (
                              <p className="text-campus-gray-500">
                                Last seen {new Date(user.lastLogin).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(user.status)}
                            
                            {(isSuperAdmin || (currentUser?.role === 'admin' && user.role !== 'admin' && user.role !== 'super-admin')) && (
                              <div className="flex space-x-1">
                                {user.status === 'suspended' ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUserAction(user, 'unsuspend')}
                                    className="text-campus-sky-blue border-campus-sky-blue hover:bg-campus-sky-blue hover:text-white"
                                  >
                                    <UserCheck className="w-3 h-3" />
                                  </Button>
                                ) : user.status === 'active' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUserAction(user, 'suspend')}
                                    className="text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white"
                                  >
                                    <UserX className="w-3 h-3" />
                                  </Button>
                                )}
                                
                                {user.status !== 'banned' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUserAction(user, 'ban')}
                                    className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                  >
                                    <Ban className="w-3 h-3" />
                                  </Button>
                                )}

                                {isSuperAdmin && user.role !== 'super-admin' && (
                                  <>
                                    {user.role === 'lecturer' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleUserAction(user, 'promote')}
                                        className="text-campus-purple border-campus-purple hover:bg-campus-purple hover:text-white"
                                        title="Promote to Admin"
                                      >
                                        <UserCheck className="w-3 h-3" />
                                      </Button>
                                    )}
                                    
                                    {user.role === 'admin' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleUserAction(user, 'demote')}
                                        className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
                                      >
                                        <UserMinus className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </>
                                )}

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserAction(user, 'delete')}
                                  className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Video Management Tab */}
          {activeTab === 'videos' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-campus-deep-blue">Video Management</h2>
                  <p className="text-campus-gray-600">Review and manage all uploaded videos</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Card className="overflow-hidden bg-white border-campus-gray-200">
                      <div className="relative">
                        <div className="w-full h-48 bg-campus-gray-100 flex items-center justify-center">
                          <Video className="w-12 h-12 text-campus-gray-400" />
                        </div>
                        <div className="absolute top-2 left-2">
                          {getStatusBadge(video.status)}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                          {video.duration}
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="text-campus-deep-blue mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-campus-gray-600 mb-2">by {video.lecturer}</p>
                        <p className="text-campus-gray-500 mb-3">{video.course}</p>
                        
                        <div className="flex items-center justify-between text-campus-gray-500 mb-4">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {video.views} views
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {video.students} students
                          </span>
                          <span>{video.uploadDate}</span>
                        </div>

                        <div className="flex space-x-2">
                          {video.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleVideoAction(video.id, 'approve')}
                                className="bg-campus-sky-blue hover:bg-campus-deep-blue text-white"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVideoAction(video.id, 'reject')}
                                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVideoAction(video.id, 'delete')}
                            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Admin Management Tab (Super Admin Only) */}
          {activeTab === 'admins' && isSuperAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-campus-deep-blue flex items-center">
                    <Crown className="w-6 h-6 mr-2 text-campus-purple" />
                    Admin Management
                  </h2>
                  <p className="text-campus-gray-600">Manage administrator accounts and permissions</p>
                </div>
              </div>

              <Card className="bg-white border-campus-gray-200">
                <CardHeader>
                  <CardTitle className="text-campus-deep-blue">System Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.filter(user => user.role === 'admin' || user.role === 'super-admin').map((admin, index) => (
                      <motion.div
                        key={admin.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-campus-gray-200 rounded-lg space-y-3 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className={admin.role === 'super-admin' ? 'bg-campus-purple text-white' : 'bg-campus-deep-blue text-white'}>
                              {admin.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-campus-deep-blue">{admin.name}</h3>
                              {getRoleBadge(admin.role)}
                            </div>
                            <p className="text-campus-gray-600">{admin.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-campus-gray-600">
                              Since {new Date(admin.createdAt).toLocaleDateString()}
                            </p>
                            {admin.lastLogin && (
                              <p className="text-campus-gray-500">
                                Last active {new Date(admin.lastLogin).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          
                          {admin.role !== 'super-admin' && admin.id !== currentUser?.id && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(admin, 'demote')}
                                className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
                              >
                                <UserMinus className="w-3 h-3 mr-1" />
                                Demote
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(admin, 'delete')}
                                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Content Creation Tab (Super Admin Only) */}
          {activeTab === 'content' && isSuperAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center py-12">
                <Upload className="w-16 h-16 text-campus-gray-400 mx-auto mb-4" />
                <h3 className="text-campus-deep-blue mb-2">Content Creation</h3>
                <p className="text-campus-gray-600 mb-6">Upload videos, create content, and manage educational materials.</p>
                <div className="space-y-4 max-w-md mx-auto">
                  <Button className="w-full bg-campus-purple hover:bg-campus-deep-blue text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video Content
                  </Button>
                  <Button variant="outline" className="w-full border-campus-purple text-campus-purple hover:bg-campus-purple hover:text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comment on Videos
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-campus-gray-400 mx-auto mb-4" />
                <h3 className="text-campus-deep-blue mb-2">Settings Coming Soon</h3>
                <p className="text-campus-gray-600">System settings and configuration options will be available soon.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-campus-deep-blue">
              {actionType === 'suspend' && 'Suspend User'}
              {actionType === 'ban' && 'Ban User'}
              {actionType === 'promote' && 'Promote to Admin'}
              {actionType === 'demote' && 'Demote Admin'}
              {actionType === 'delete' && 'Delete User'}
              {actionType === 'unsuspend' && 'Unsuspend User'}
            </DialogTitle>
            <DialogDescription className="text-campus-gray-600">
              {actionType === 'suspend' && 'Temporarily suspend this user account with a specified duration.'}
              {actionType === 'ban' && 'Permanently ban this user account from the platform.'}
              {actionType === 'promote' && 'Grant administrator privileges to this user account.'}
              {actionType === 'demote' && 'Remove administrator privileges from this user account.'}
              {actionType === 'delete' && 'Permanently delete this user account and all associated data.'}
              {actionType === 'unsuspend' && 'Remove suspension and restore full access to this user account.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedUser && (
              <div className="p-4 bg-campus-light-blue rounded-lg">
                <p className="text-campus-deep-blue">
                  <strong>User:</strong> {selectedUser.name} ({selectedUser.email})
                </p>
                <p className="text-campus-gray-600">
                  <strong>Current Role:</strong> {selectedUser.role}
                </p>
              </div>
            )}

            {actionType === 'suspend' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-campus-deep-blue mb-2">Suspension Duration</label>
                  <Select value={suspendDuration} onValueChange={setSuspendDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                      <SelectItem value="90">3 months</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-campus-deep-blue mb-2">Reason (Optional)</label>
                  <Textarea
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder="Enter reason for suspension..."
                    className="border-campus-gray-300"
                  />
                </div>
              </div>
            )}

            {(actionType === 'ban' || actionType === 'delete') && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This action cannot be undone. Are you sure you want to proceed?
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={executeUserAction}
                className={`flex-1 ${
                  actionType === 'delete' || actionType === 'ban' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : actionType === 'promote'
                    ? 'bg-campus-purple hover:bg-campus-deep-blue'
                    : 'bg-campus-sky-blue hover:bg-campus-deep-blue'
                } text-white`}
              >
                Confirm {actionType}
              </Button>
              <Button
                variant="outline"
                onClick={() => setActionDialogOpen(false)}
                className="flex-1 border-campus-gray-300 text-campus-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
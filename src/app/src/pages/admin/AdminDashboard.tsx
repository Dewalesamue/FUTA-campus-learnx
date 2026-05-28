import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { UserManagement } from '../../components/admin/UserManagement';
import { VideoManagement } from '../../components/admin/VideoManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  GraduationCap, 
  Video, 
  AlertCircle,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { AdminStats } from '../../types';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadStats();
    }
  }, [activeTab]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" message="Loading dashboard..." />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-futa-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-futa-gray-600">Here's what's happening on Campus LearnHub today.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 overflow-hidden">
              <CardContent className="p-6 relative">
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-primary-foreground/80">Total Students</p>
                    <motion.p 
                      className="text-2xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stats?.totalStudents || 0}
                    </motion.p>
                  </div>
                  <Users className="w-8 h-8 text-primary-foreground/80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gradient-to-r from-accent to-accent/80 text-white border-0 overflow-hidden">
              <CardContent className="p-6 relative">
                <motion.div
                  className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-accent-foreground/80">Total Lecturers</p>
                    <motion.p 
                      className="text-2xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                      {stats?.totalLecturers || 0}
                    </motion.p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-accent-foreground/80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="border-futa-gray-200 overflow-hidden">
              <CardContent className="p-6 relative">
                <motion.div
                  className="absolute top-0 right-0 w-12 h-12 bg-blue-100 rounded-full -mr-6 -mt-6"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-futa-gray-600">Total Videos</p>
                    <motion.p 
                      className="text-2xl font-bold text-futa-gray-900"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    >
                      {stats?.totalVideos || 0}
                    </motion.p>
                  </div>
                  <Video className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="border-futa-gray-200 overflow-hidden">
              <CardContent className="p-6 relative">
                <motion.div
                  className="absolute top-0 right-0 w-10 h-10 bg-yellow-100 rounded-full -mr-5 -mt-5"
                  animate={{ pulse: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-futa-gray-600">Pending Approvals</p>
                    <motion.p 
                      className="text-2xl font-bold text-futa-gray-900"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    >
                      {stats?.pendingApprovals || 0}
                    </motion.p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-futa-gray-600">Active Users</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{stats?.activeUsers || 0}</span>
                      <Badge className="bg-green-500 text-white">Online</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-futa-gray-600">Suspended Users</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{stats?.suspendedUsers || 0}</span>
                      <Badge className="bg-red-500 text-white">Suspended</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-futa-gray-600">System Health</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <Badge className="bg-green-500 text-white">Healthy</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
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
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <p className="text-sm text-futa-gray-900">New student registration</p>
                      <p className="text-xs text-futa-gray-500">Michael Peters - 2 hours ago</p>
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
                      <p className="text-sm text-futa-gray-900">Video pending approval</p>
                      <p className="text-xs text-futa-gray-500">Organic Chemistry - 4 hours ago</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p className="text-sm text-futa-gray-900">Video approved and published</p>
                      <p className="text-xs text-futa-gray-500">Advanced Calculus - 6 hours ago</p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'students':
        return <UserManagement userRole="student" />;
      case 'lecturers':
        return <UserManagement userRole="lecturer" />;
      case 'videos':
        return <VideoManagement />;
      case 'analytics':
        return (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-futa-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-futa-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-futa-gray-600">Advanced analytics and reporting features will be available soon.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-futa-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-futa-gray-900 mb-2">Settings Coming Soon</h3>
            <p className="text-futa-gray-600">System settings and configuration options will be available soon.</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-futa-gray-50 flex">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
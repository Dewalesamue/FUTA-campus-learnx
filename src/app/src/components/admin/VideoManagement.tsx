import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Eye,
  Play,
  Clock,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Video } from '../../types';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export function VideoManagement() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'published' | 'rejected'>('all');

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    let filtered = videos;

    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.lecturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(video => video.status === filterStatus);
    }

    setFilteredVideos(filtered);
  }, [searchQuery, videos, filterStatus]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllVideos();
      setVideos(data);
      setFilteredVideos(data);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVideo = async (videoId: string) => {
    try {
      setActionLoading(videoId);
      await adminService.approveVideo(videoId, user?.id || '');
      await loadVideos();
    } catch (error) {
      console.error('Failed to approve video:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectVideo = async (videoId: string) => {
    try {
      setActionLoading(videoId);
      await adminService.rejectVideo(videoId);
      await loadVideos();
    } catch (error) {
      console.error('Failed to reject video:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(videoId);
      await adminService.deleteVideo(videoId);
      await loadVideos();
    } catch (error) {
      console.error('Failed to delete video:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: Video['status']) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500 text-white">Published</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading videos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-futa-gray-900">Video Management</h2>
          <p className="text-futa-gray-600">Review and manage all uploaded videos</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 text-futa-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-futa-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-futa-gray-600">Total Videos</p>
                  <p className="text-2xl font-bold text-futa-gray-900">{videos.length}</p>
                </div>
                <Play className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-futa-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {videos.filter(v => v.status === 'published').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-futa-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {videos.filter(v => v.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-futa-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {videos.reduce((sum, v) => sum + v.views, 0)}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(video.status)}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-futa-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-futa-gray-600 mb-2">by {video.lecturer}</p>
                  <p className="text-xs text-futa-gray-500 mb-3">{video.subject}</p>
                  
                  <div className="flex items-center justify-between text-xs text-futa-gray-500 mb-4">
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
                  
                  {actionLoading === video.id ? (
                    <div className="flex justify-center">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {video.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveVideo(video.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectVideo(video.id)}
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Play className="w-16 h-16 text-futa-gray-400 mx-auto mb-4" />
          <p className="text-lg text-futa-gray-600 mb-2">No videos found</p>
          <p className="text-sm text-futa-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
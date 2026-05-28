import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Sidebar } from "../components/Sidebar";
import { 
  Upload,
  Video,
  BarChart3,
  Users,
  Eye,
  Calendar,
  Plus
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";

interface Video {
  id: string;
  title: string;
  lecturer: string;
  subject: string;
  duration: string;
  progress: number;
  rating: number;
  thumbnail: string;
  isCompleted: boolean;
  description?: string;
  uploadDate?: string;
  views?: number;
  students?: number;
  status?: 'published' | 'draft';
}

interface LecturerDashboardProps {
  onLogout: () => void;
}

export function LecturerDashboard({ onLogout }: LecturerDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'upload' | 'videos'>('home');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    subject: '',
    description: '',
    duration: ''
  });

  // Mock data for lecturer videos
  const videos: Video[] = [
    {
      id: '1',
      title: 'Introduction to Data Structures',
      lecturer: 'Dr. Adebayo Johnson',
      subject: 'Computer Science',
      duration: '45 min',
      progress: 0,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      isCompleted: false,
      description: 'Basic concepts of arrays, linked lists, and their applications in programming.',
      uploadDate: '2024-01-15',
      views: 245,
      students: 89,
      status: 'published'
    },
    {
      id: '2',
      title: 'Advanced Algorithms Analysis',
      lecturer: 'Dr. Adebayo Johnson',
      subject: 'Computer Science',
      duration: '60 min',
      progress: 0,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      isCompleted: false,
      description: 'Deep dive into algorithm complexity and optimization techniques.',
      uploadDate: '2024-01-20',
      views: 156,
      students: 67,
      status: 'published'
    },
    {
      id: '3',
      title: 'Database Design Patterns',
      lecturer: 'Dr. Adebayo Johnson',
      subject: 'Computer Science',
      duration: '50 min',
      progress: 0,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
      isCompleted: false,
      description: 'Learn about normalization, indexing, and query optimization.',
      uploadDate: '2024-01-25',
      views: 0,
      students: 0,
      status: 'draft'
    }
  ];

  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
  const totalStudents = videos.reduce((acc, v) => acc + (v.students || 0), 0);
  const publishedVideos = videos.filter(v => v.status === 'published').length;

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Uploading video:', uploadForm);
    // Handle video upload logic here
    setUploadForm({ title: '', subject: '', description: '', duration: '' });
  };

  return (
    <div className="min-h-screen bg-futa-gray-50 flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <motion.div 
            className="p-8"
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
              <h1 className="text-2xl font-bold text-futa-gray-900 mb-2">
                Welcome back, {user?.name || 'Lecturer'}! 👨‍🏫
              </h1>
              <p className="text-futa-gray-600">Manage your courses and track student engagement</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-foreground/80">Published Videos</p>
                        <p className="text-2xl font-bold">{publishedVideos}</p>
                      </div>
                      <Video className="w-8 h-8 text-primary-foreground/80" />
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
                <Card className="bg-gradient-to-r from-accent to-accent/80 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-accent-foreground/80">Total Views</p>
                        <p className="text-2xl font-bold">{totalViews}</p>
                      </div>
                      <Eye className="w-8 h-8 text-accent-foreground/80" />
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
                <Card className="border-futa-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-futa-gray-600">Active Students</p>
                        <p className="text-2xl font-bold text-futa-gray-900">{totalStudents}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border-futa-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-futa-gray-600">Avg. Rating</p>
                        <p className="text-2xl font-bold text-futa-gray-900">4.8</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Videos */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <h2 className="text-lg font-semibold text-futa-gray-900 mb-4">Recent Videos</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {videos.slice(0, 2).map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <Card className="border-futa-gray-200">
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <div className="w-24 h-16 bg-futa-gray-200 rounded-lg overflow-hidden">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-futa-gray-900">{video.title}</h3>
                              <Badge variant={video.status === 'published' ? 'default' : 'secondary'}>
                                {video.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-futa-gray-600 mb-2">{video.subject}</p>
                            <div className="flex items-center space-x-4 text-xs text-futa-gray-500">
                              <span>{video.views} views</span>
                              <span>{video.students} students</span>
                              <span>{video.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <motion.div 
            className="p-8"
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
              <h1 className="text-2xl font-bold text-futa-gray-900 mb-2">Upload New Video</h1>
              <p className="text-futa-gray-600">Share your knowledge with students</p>
            </motion.div>

            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-futa-gray-200">
                <CardContent className="p-8">
                  <form onSubmit={handleUpload} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-futa-gray-700 mb-2">
                        Video Title
                      </label>
                      <Input
                        placeholder="Enter video title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-futa-gray-700 mb-2">
                        Subject
                      </label>
                      <Input
                        placeholder="e.g., Computer Science, Mathematics"
                        value={uploadForm.subject}
                        onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-futa-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        className="w-full min-h-[100px] px-3 py-2 border border-futa-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Describe what this video covers"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-futa-gray-700 mb-2">
                        Video File
                      </label>
                      <div className="border-2 border-dashed border-futa-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <Upload className="w-12 h-12 text-futa-gray-400 mx-auto mb-4" />
                        <p className="text-futa-gray-600 mb-2">Drag and drop your video file here</p>
                        <p className="text-sm text-futa-gray-500">or click to browse</p>
                        <input type="file" className="hidden" accept="video/*" />
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex space-x-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                    >
                      <Button type="button" variant="outline" className="flex-1">
                        Save as Draft
                      </Button>
                      <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Video
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* My Videos Tab */}
        {activeTab === 'videos' && (
          <motion.div 
            className="p-8"
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
              <h1 className="text-2xl font-bold text-futa-gray-900 mb-2">My Videos</h1>
              <p className="text-futa-gray-600">Manage your uploaded content</p>
            </motion.div>

            <div className="space-y-6">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <Card className="border-futa-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-6">
                        <div className="w-32 h-20 bg-futa-gray-200 rounded-lg overflow-hidden">
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-futa-gray-900 mb-1">{video.title}</h3>
                              <p className="text-sm text-futa-gray-600">{video.subject} • {video.duration}</p>
                            </div>
                            <Badge variant={video.status === 'published' ? 'default' : 'secondary'}>
                              {video.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-futa-gray-600 mb-4">{video.description}</p>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-futa-gray-500">Views</p>
                              <p className="font-medium">{video.views || 0}</p>
                            </div>
                            <div>
                              <p className="text-futa-gray-500">Students</p>
                              <p className="font-medium">{video.students || 0}</p>
                            </div>
                            <div>
                              <p className="text-futa-gray-500">Rating</p>
                              <p className="font-medium">{video.rating}</p>
                            </div>
                            <div>
                              <p className="text-futa-gray-500">Uploaded</p>
                              <p className="font-medium">{video.uploadDate}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Analytics</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Sidebar } from "../components/Sidebar";
import { 
  Home, 
  Play, 
  Brain, 
  BarChart3, 
  Clock, 
  Star,
  MessageCircle,
  Search,
  Filter
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
}

interface StudentDashboardProps {
  onLogout: () => void;
  onVideoSelect: (video: Video) => void;
}

export function StudentDashboard({ onLogout, onVideoSelect }: StudentDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'ai' | 'progress'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const videos: Video[] = [
    {
      id: '1',
      title: 'Introduction to Data Structures',
      lecturer: 'Dr. Adebayo Johnson',
      subject: 'Computer Science',
      duration: '45 min',
      progress: 75,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      isCompleted: false
    },
    {
      id: '2',
      title: 'Advanced Calculus: Integration',
      lecturer: 'Prof. Sarah Okafor',
      subject: 'Mathematics',
      duration: '60 min',
      progress: 100,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400',
      isCompleted: true
    },
    {
      id: '3',
      title: 'Organic Chemistry Fundamentals',
      lecturer: 'Dr. Michael Ogbonna',
      subject: 'Chemistry',
      duration: '55 min',
      progress: 30,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1532634926-8b875965f5c5?w=400',
      isCompleted: false
    },
    {
      id: '4',
      title: 'Nigerian Economic History',
      lecturer: 'Prof. Fatima Aliyu',
      subject: 'Economics',
      duration: '40 min',
      progress: 0,
      rating: 4.6,
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      isCompleted: false
    }
  ];

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.lecturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedVideos = videos.filter(v => v.isCompleted).length;
  const totalProgress = Math.round(videos.reduce((acc, v) => acc + v.progress, 0) / videos.length);

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
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <p className="text-futa-gray-600">Continue your learning journey</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
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
                        <p className="text-primary-foreground/80">Videos Completed</p>
                        <motion.p 
                          className="text-2xl font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {completedVideos}/{videos.length}
                        </motion.p>
                      </div>
                      <Play className="w-8 h-8 text-primary-foreground/80" />
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
                <Card className="bg-gradient-to-r from-accent to-accent/80 text-white border-0 overflow-hidden">
                  <CardContent className="p-6 relative">
                    <motion.div
                      className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-accent-foreground/80">Overall Progress</p>
                        <motion.p 
                          className="text-2xl font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        >
                          {totalProgress}%
                        </motion.p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-accent-foreground/80" />
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
                      className="absolute top-0 right-0 w-12 h-12 bg-yellow-100 rounded-full -mr-6 -mt-6"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-futa-gray-600">Study Streak</p>
                        <motion.p 
                          className="text-2xl font-bold text-futa-gray-900"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        >
                          7 days
                        </motion.p>
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star className="w-8 h-8 text-yellow-500" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Continue Watching */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2 className="text-lg font-semibold text-futa-gray-900 mb-4">Continue Watching</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {videos.filter(v => v.progress > 0 && v.progress < 100).map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    onClick={() => onVideoSelect(video)}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow border-futa-gray-200">
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <motion.div 
                            className="relative w-24 h-16 bg-futa-gray-200 rounded-lg overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-medium text-futa-gray-900 mb-1">{video.title}</h3>
                            <p className="text-sm text-futa-gray-600 mb-2">by {video.lecturer}</p>
                            <Progress value={video.progress} className="h-2" />
                            <p className="text-xs text-futa-gray-500 mt-1">{video.progress}% complete</p>
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

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <motion.div 
            className="p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <motion.h1 
                className="text-2xl font-bold text-futa-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Video Library
              </motion.h1>
              
              {/* Search and Filter */}
              <motion.div 
                className="flex space-x-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-futa-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search videos, lecturers, or subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="border-futa-gray-200">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => onVideoSelect(video)}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-futa-gray-200 overflow-hidden">
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Play className="w-12 h-12 text-white" />
                        </motion.div>
                      </div>
                      <div className="absolute top-2 right-2">
                        {video.isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 15 }}
                          >
                            <Badge className="bg-green-500 text-white">Completed</Badge>
                          </motion.div>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </motion.div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-futa-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-futa-gray-600 mb-2">by {video.lecturer}</p>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">{video.subject}</Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-futa-gray-600">{video.rating}</span>
                        </div>
                      </div>
                      {video.progress > 0 && (
                        <div>
                          <Progress value={video.progress} className="h-2 mb-1" />
                          <p className="text-xs text-futa-gray-500">{video.progress}% complete</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && (
          <motion.div 
            className="p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <h1 className="text-2xl font-bold text-futa-gray-900 mb-2">AI Learning Assistant</h1>
                <p className="text-futa-gray-600">Ask questions about your courses and get instant answers</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card className="border-futa-gray-200">
                  <CardContent className="p-6">
                    <div className="h-96 bg-futa-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                      <div className="space-y-4">
                        <motion.div 
                          className="flex justify-end"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2 max-w-xs">
                            Can you explain the difference between arrays and linked lists?
                          </div>
                        </motion.div>
                        <motion.div 
                          className="flex"
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <div className="bg-white border border-futa-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 max-w-md">
                            <p className="mb-2">Great question! Here are the key differences:</p>
                            <p className="mb-2"><strong>Arrays:</strong> Store elements in contiguous memory locations with fixed size and direct index access.</p>
                            <p><strong>Linked Lists:</strong> Use pointers to connect nodes, offering dynamic size but sequential access.</p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                    <motion.div 
                      className="flex space-x-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <Input
                        placeholder="Ask a question about your courses..."
                        className="flex-1"
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="bg-primary hover:bg-primary/90">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
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
              <h1 className="text-2xl font-bold text-futa-gray-900 mb-2">Learning Progress</h1>
              <p className="text-futa-gray-600">Track your academic journey</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
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
                        <div className="flex items-start space-x-4">
                          <motion.div 
                            className="w-16 h-12 bg-futa-gray-200 rounded-lg overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-medium text-futa-gray-900 mb-1">{video.title}</h3>
                            <p className="text-sm text-futa-gray-600 mb-2">{video.lecturer} • {video.subject}</p>
                            <div className="flex items-center space-x-4">
                              <div className="flex-1">
                                <Progress value={video.progress} className="h-2" />
                              </div>
                              <span className="text-sm text-futa-gray-600">{video.progress}%</span>
                              {video.isCompleted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 15 }}
                                >
                                  <Badge className="bg-green-500 text-white text-xs">✓</Badge>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Card className="border-futa-gray-200">
                    <CardHeader>
                      <CardTitle>Overall Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Total Progress</span>
                            <span>{totalProgress}%</span>
                          </div>
                          <Progress value={totalProgress} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{completedVideos}</p>
                            <p className="text-sm text-futa-gray-600">Completed</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-accent">{videos.length - completedVideos}</p>
                            <p className="text-sm text-futa-gray-600">In Progress</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
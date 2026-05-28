import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Maximize,
  MessageCircle,
  BookOpen,
  Brain,
  Share2,
  Download
} from "lucide-react";
import { motion } from "motion/react";

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

interface VideoPlayerProps {
  video: Video;
  onBack: () => void;
}

export function VideoPlayer({ video, onBack }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(25); // Mock current time in minutes
  const [showTranscript, setShowTranscript] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

  const transcript = [
    { time: "00:00", text: "Welcome to today's lecture on Data Structures. In this session, we'll explore the fundamental concepts of arrays and linked lists." },
    { time: "02:15", text: "Arrays are contiguous memory structures that store elements of the same type. They provide O(1) access time for any element." },
    { time: "05:30", text: "Linked lists, on the other hand, use pointers to connect nodes. This allows for dynamic memory allocation." },
    { time: "08:45", text: "The main advantage of linked lists is their flexibility in size, while arrays have fixed size once allocated." },
    { time: "12:00", text: "Let's now examine the implementation details of both structures in different programming languages." }
  ];

  const aiResponses = [
    "Arrays store elements in contiguous memory locations, allowing direct access via indices. Linked lists use pointers to connect nodes, requiring sequential traversal.",
    "The time complexity for array access is O(1), while linked list access is O(n). However, insertion/deletion in linked lists can be O(1) if you have the node reference.",
    "Choose arrays when you need fast random access to elements. Choose linked lists when you frequently insert/delete elements and the size varies dynamically."
  ];

  return (
    <div className="min-h-screen bg-futa-gray-900">
      {/* Header */}
      <motion.div 
        className="bg-futa-gray-800 border-b border-futa-gray-700 px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:bg-futa-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-white">{video.title}</h1>
              <p className="text-sm text-futa-gray-400">by {video.lecturer}</p>
            </div>
          </motion.div>
          
          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="text-white hover:bg-futa-gray-700">
                <Share2 className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="text-white hover:bg-futa-gray-700">
                <Download className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="flex">
        {/* Main Video Area */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Video Player */}
            <div className="relative bg-black rounded-xl overflow-hidden mb-6">
              <div className="aspect-video bg-gradient-to-br from-futa-gray-800 to-futa-gray-900 flex items-center justify-center">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <motion.button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Video Controls */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex items-center space-x-4 mb-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-primary transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <Volume2 className="w-5 h-5 text-white" />
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-white text-sm">{currentTime}:00</span>
                    <Progress value={video.progress} className="flex-1 h-1" />
                    <span className="text-white text-sm">{video.duration}</span>
                  </div>
                  <Maximize className="w-5 h-5 text-white cursor-pointer hover:text-primary transition-colors" />
                </div>
              </motion.div>
            </div>

            {/* Video Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="bg-futa-gray-800 border-futa-gray-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                      <p className="text-futa-gray-400 mb-2">by {video.lecturer}</p>
                      <Badge className="bg-primary text-white">{video.subject}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{video.rating}</p>
                      <p className="text-sm text-futa-gray-400">Rating</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <motion.button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="flex items-center space-x-2 text-futa-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Transcript</span>
                    </motion.button>
                    <span className="text-futa-gray-600">•</span>
                    <span className="text-futa-gray-400">{video.duration}</span>
                    <span className="text-futa-gray-600">•</span>
                    <span className="text-futa-gray-400">{video.progress}% Complete</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div 
          className="w-96 p-6 space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Transcript */}
          {showTranscript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-futa-gray-800 border-futa-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    {transcript.map((item, index) => (
                      <motion.div
                        key={index}
                        className="text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <span className="text-primary font-medium">{item.time}</span>
                        <p className="text-futa-gray-300 mt-1">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* AI Assistant */}
          <Card className="bg-futa-gray-800 border-futa-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-futa-gray-700 rounded-lg p-3">
                  <p className="text-sm text-futa-gray-300">
                    I can help explain concepts from this video. Ask me anything!
                  </p>
                </div>
                
                <div className="space-y-2">
                  <motion.div 
                    className="bg-primary/10 border border-primary/20 rounded-lg p-3 cursor-pointer hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <p className="text-sm text-white">What's the difference between arrays and linked lists?</p>
                  </motion.div>
                  <motion.div 
                    className="bg-primary/10 border border-primary/20 rounded-lg p-3 cursor-pointer hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <p className="text-sm text-white">When should I use each data structure?</p>
                  </motion.div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="flex-1 px-3 py-2 bg-futa-gray-700 border border-futa-gray-600 rounded-lg text-white placeholder-futa-gray-400 focus:outline-none focus:border-primary"
                  />
                  <motion.button
                    className="px-4 py-2 bg-primary rounded-lg text-white hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="bg-futa-gray-800 border-futa-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-futa-gray-400">Course Progress</span>
                    <span className="text-white">{video.progress}%</span>
                  </div>
                  <Progress value={video.progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{currentTime}</p>
                    <p className="text-xs text-futa-gray-400">Minutes Watched</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">85%</p>
                    <p className="text-xs text-futa-gray-400">Comprehension</p>
                  </div>
                </div>

                {video.progress === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Badge className="w-full justify-center bg-green-500 text-white py-2">
                      ✓ Course Completed!
                    </Badge>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
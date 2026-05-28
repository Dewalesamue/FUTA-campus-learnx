import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  MessageCircle,
  Send,
  Bot,
  User,
  BookOpen,
  Clock,
  Star,
  Lightbulb,
  Search,
  Minimize2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ===========================
// INTERFACES & TYPES
// ===========================

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    lecturer: string;
    subject: string;
    duration: string;
    progress: number;
    rating: number;
    thumbnail: string;
    isCompleted: boolean;
  };
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
  context?: string; // Video timestamp context
}

interface VideoTranscript {
  timestamp: string;
  text: string;
  speaker?: string;
}

interface AIResponse {
  answer: string;
  confidence: number;
  relatedTimestamps: string[];
  suggestedQuestions: string[];
}

// ===========================
// MAIN COMPONENT
// ===========================

export function VideoPlayer({ video, onBack }: VideoPlayerProps) {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  
  // AI Assistant states
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  // Video analysis states
  const [transcript, setTranscript] = useState<VideoTranscript[]>([]);
  const [isTranscriptLoaded, setIsTranscriptLoaded] = useState(false);
  const [videoAnalysis, setVideoAnalysis] = useState<{
    topics: string[];
    difficulty: string;
    keyPoints: string[];
    summary: string;
  } | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // ===========================
  // MOCK DATA
  // ===========================

  const mockTranscript: VideoTranscript[] = [
    {
      timestamp: '00:00',
      text: 'Welcome to today\'s lecture on Binary Trees. In computer science, a binary tree is a tree data structure where each node has at most two children.',
      speaker: video.lecturer
    },
    {
      timestamp: '00:30',
      text: 'Binary trees are fundamental structures used in many algorithms and applications. Let\'s start by understanding the basic properties.',
      speaker: video.lecturer
    },
    {
      timestamp: '01:00',
      text: 'Each node in a binary tree contains data and references to its left and right child nodes. The topmost node is called the root.',
      speaker: video.lecturer
    },
    {
      timestamp: '01:30',
      text: 'Tree traversal is an important concept. We have three main types: preorder, inorder, and postorder traversal.',
      speaker: video.lecturer
    },
    {
      timestamp: '02:00',
      text: 'Let\'s implement a simple binary tree in code and see how these concepts work in practice.',
      speaker: video.lecturer
    }
  ];

  const mockVideoAnalysis = {
    topics: ['Binary Trees', 'Data Structures', 'Tree Traversal', 'Computer Science'],
    difficulty: 'Intermediate',
    keyPoints: [
      'Binary trees have at most two children per node',
      'Root is the topmost node',
      'Three types of traversal: preorder, inorder, postorder',
      'Fundamental for many algorithms'
    ],
    summary: 'This lecture introduces binary trees as fundamental data structures in computer science, covering their properties, structure, and traversal methods.'
  };

  const initialSuggestedQuestions = [
    'What is the difference between binary trees and binary search trees?',
    'How do you implement tree traversal algorithms?',
    'What are the time complexities for binary tree operations?',
    'Can you explain the concept of balanced trees?',
    'What are some real-world applications of binary trees?'
  ];

  // ===========================
  // LIFECYCLE HOOKS
  // ===========================

  useEffect(() => {
    // Simulate loading transcript and video analysis
    setTimeout(() => {
      setTranscript(mockTranscript);
      setVideoAnalysis(mockVideoAnalysis);
      setIsTranscriptLoaded(true);
      setSuggestedQuestions(initialSuggestedQuestions);
      
      // Add welcome message from AI
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'ai',
        message: `Hello! I'm your AI learning assistant for "${video.title}". I've analyzed the video content and I'm ready to help you understand the concepts better. Feel free to ask me any questions!`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages([welcomeMessage]);
    }, 1500);
  }, [video.title]);

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Auto-hide controls after 3 seconds of inactivity
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  // ===========================
  // VIDEO CONTROL HANDLERS
  // ===========================

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (seekTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // ===========================
  // AI ASSISTANT HANDLERS
  // ===========================

  /**
   * Processes user question and generates AI response
   */
  const processAIQuestion = async (question: string): Promise<AIResponse> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Simple keyword matching for demo purposes
    const questionLower = question.toLowerCase();
    let response: AIResponse;

    if (questionLower.includes('binary tree') || questionLower.includes('tree')) {
      response = {
        answer: 'A binary tree is a hierarchical data structure where each node has at most two children, referred to as left and right child. In this video, the lecturer explains that binary trees are fundamental structures used in computer science for organizing data efficiently. The root node is at the top, and each node can have 0, 1, or 2 children.',
        confidence: 0.95,
        relatedTimestamps: ['00:00', '01:00'],
        suggestedQuestions: [
          'What are the different types of binary trees?',
          'How do you insert nodes in a binary tree?',
          'What is tree height and depth?'
        ]
      };
    } else if (questionLower.includes('traversal')) {
      response = {
        answer: 'Tree traversal refers to the process of visiting each node in a tree data structure exactly once. As mentioned in the video at 01:30, there are three main types: Preorder (root-left-right), Inorder (left-root-right), and Postorder (left-right-root). Each method serves different purposes in algorithms.',
        confidence: 0.92,
        relatedTimestamps: ['01:30'],
        suggestedQuestions: [
          'Can you show me the code for each traversal method?',
          'When should I use each type of traversal?',
          'What is the time complexity of tree traversal?'
        ]
      };
    } else if (questionLower.includes('implement') || questionLower.includes('code')) {
      response = {
        answer: 'The lecturer mentions implementing binary trees in code at the 02:00 mark. A basic binary tree implementation typically includes a Node class with data, left, and right properties, plus methods for insertion, deletion, and traversal. The structure allows for efficient searching and sorting operations.',
        confidence: 0.88,
        relatedTimestamps: ['02:00'],
        suggestedQuestions: [
          'What programming language is best for binary trees?',
          'How do you handle memory management in tree structures?',
          'What are common bugs in tree implementations?'
        ]
      };
    } else if (questionLower.includes('application') || questionLower.includes('use')) {
      response = {
        answer: 'Binary trees have many real-world applications including: file systems (directory structures), expression parsing in compilers, database indexing, decision trees in machine learning, and heap implementations for priority queues. They provide efficient searching, insertion, and deletion operations.',
        confidence: 0.87,
        relatedTimestamps: ['00:30'],
        suggestedQuestions: [
          'How are binary trees used in databases?',
          'What is the difference between trees and graphs?',
          'Can you explain binary search trees specifically?'
        ]
      };
    } else {
      response = {
        answer: 'I understand you\'re asking about binary trees and data structures. Based on the video content, I can help explain concepts like tree structure, node relationships, traversal methods, and implementation details. Could you be more specific about what aspect you\'d like to understand better?',
        confidence: 0.75,
        relatedTimestamps: [],
        suggestedQuestions: [
          'What exactly is a binary tree?',
          'How do tree traversal algorithms work?',
          'What are some examples of binary tree applications?'
        ]
      };
    }

    return response;
  };

  /**
   * Handles sending a new message in the chat
   */
  const handleSendMessage = async () => {
    if (!currentQuestion.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentQuestion,
      timestamp: new Date().toLocaleTimeString(),
      context: formatTime(currentTime)
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsAITyping(true);

    try {
      const aiResponse = await processAIQuestion(currentQuestion);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponse.answer,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setSuggestedQuestions(aiResponse.suggestedQuestions);
      
      // Jump to relevant timestamp if available
      if (aiResponse.relatedTimestamps.length > 0) {
        const timestamp = aiResponse.relatedTimestamps[0];
        const [minutes, seconds] = timestamp.split(':').map(Number);
        const seekTime = minutes * 60 + seconds;
        setTimeout(() => handleSeek(seekTime), 1000);
      }
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: 'I apologize, but I\'m having trouble processing your question right now. Please try again or ask a different question.',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAITyping(false);
    }
  };

  /**
   * Handles clicking on a suggested question
   */
  const handleSuggestedQuestion = (question: string) => {
    setCurrentQuestion(question);
    handleSendMessage();
  };

  // ===========================
  // RENDER FUNCTIONS
  // ===========================

  /**
   * Renders the AI chat interface
   */
  const renderAIChat = () => (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed right-0 top-0 h-full bg-white border-l border-futa-gray-200 shadow-xl z-50 ${
        isAIOpen ? 'w-96' : 'w-0'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-futa-gray-200 bg-primary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium">AI Learning Assistant</h3>
                <p className="text-xs text-white/80">
                  {isTranscriptLoaded ? 'Ready to help' : 'Analyzing video...'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAIOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Context */}
        <div className="p-3 bg-futa-gray-50 border-b border-futa-gray-200">
          <div className="text-xs text-futa-gray-600 mb-1">Currently watching:</div>
          <div className="font-medium text-sm text-futa-gray-900">{video.title}</div>
          <div className="text-xs text-futa-gray-500">
            {video.lecturer} • {formatTime(currentTime)} / {video.duration}
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-futa-gray-100 text-futa-gray-900'
                } rounded-lg p-3`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && (
                      <Bot className="w-4 h-4 mt-0.5 text-primary" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm">{message.message}</div>
                      <div className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-white/70' : 'text-futa-gray-500'
                      }`}>
                        {message.timestamp}
                        {message.context && ` • ${message.context}`}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* AI Typing Indicator */}
            {isAITyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-futa-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && !isAITyping && (
          <div className="p-3 border-t border-futa-gray-200 bg-futa-gray-50">
            <div className="text-xs text-futa-gray-600 mb-2 flex items-center">
              <Lightbulb className="w-3 h-3 mr-1" />
              Suggested questions:
            </div>
            <div className="space-y-1">
              {suggestedQuestions.slice(0, 2).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left text-xs text-futa-gray-700 hover:text-primary hover:bg-white p-2 rounded transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="p-4 border-t border-futa-gray-200">
          <div className="flex items-center space-x-2">
            <Input
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Ask a question about the video..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 text-sm"
              disabled={!isTranscriptLoaded || isAITyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentQuestion.trim() || !isTranscriptLoaded || isAITyping}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  /**
   * Renders video controls overlay
   */
  const renderVideoControls = () => (
    <AnimatePresence>
      {showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col justify-between p-6"
        >
          {/* Top Controls */}
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsAIOpen(!isAIOpen)}
                variant="ghost"
                className={`text-white hover:bg-white/20 transition-colors ${
                  isAIOpen ? 'bg-white/20' : ''
                }`}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                AI Assistant
                {isTranscriptLoaded && (
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Center Play Button */}
          <div className="flex items-center justify-center">
            <motion.button
              onClick={togglePlayPause}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
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

          {/* Bottom Controls */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center space-x-4 text-white text-sm">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 bg-white/20 rounded-full h-1 cursor-pointer">
                <div
                  className="bg-primary rounded-full h-1 transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span>{video.duration}</span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlayPause}
                  className="text-white hover:text-primary transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
                
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-primary transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button className="text-white hover:text-primary transition-colors">
                  <Maximize className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ===========================
  // MAIN RENDER
  // ===========================

  return (
    <div className="min-h-screen bg-black relative">
      {/* Video Container */}
      <div 
        className="relative w-full h-screen cursor-pointer"
        onClick={() => setShowControls(true)}
        onMouseMove={() => setShowControls(true)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={video.thumbnail}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
        >
          <source src="/api/placeholder/video" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Controls Overlay */}
        {renderVideoControls()}

        {/* Video Info Overlay */}
        <div className="absolute top-20 left-6 right-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-white/80">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {video.lecturer}
              </span>
              <span className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {video.subject}
              </span>
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                {video.rating}
              </span>
              {videoAnalysis && (
                <Badge className="bg-white/20 text-white border-white/30">
                  {videoAnalysis.difficulty}
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <AnimatePresence>
        {isAIOpen && renderAIChat()}
      </AnimatePresence>

      {/* Loading Overlay for Transcript Analysis */}
      {!isTranscriptLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-sm">Analyzing video content...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
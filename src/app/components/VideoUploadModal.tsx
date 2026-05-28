import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Upload, 
  X, 
  FileVideo, 
  CheckCircle, 
  AlertCircle, 
  Brain, 
  Clock,
  Tag,
  BookOpen,
  Zap,
  Eye,
  Lightbulb,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ===========================
// INTERFACES & TYPES
// ===========================

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (videoData: VideoUploadData) => void;
}

interface VideoUploadData {
  title: string;
  description: string;
  subject: string;
  topic: string;
  level: '100' | '200' | '300' | '400' | '500';
  duration: string;
  file: File;
  transcript?: string;
  aiAnalysis?: AIAnalysisResult;
}

interface AIAnalysisResult {
  contentMatch: number; // 0-100 percentage match with topic
  detectedTopics: string[];
  keyPoints: string[];
  summary: string;
  suggestedTitle: string;
  estimatedDifficulty: string;
  qualityScore: number;
  recommendations: string[];
}

interface UploadProgress {
  stage: 'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error';
  progress: number;
  message: string;
}

// ===========================
// MAIN COMPONENT
// ===========================

export function VideoUploadModal({ isOpen, onClose, onUpload }: VideoUploadModalProps) {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    topic: '',
    level: '' as '100' | '200' | '300' | '400' | '500' | ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: 'idle',
    progress: 0,
    message: ''
  });
  
  const [aiAnalysis, setAIAnalysis] = useState<AIAnalysisResult | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===========================
  // MOCK DATA
  // ===========================

  const subjects = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Engineering',
    'Biology',
    'Economics',
    'Statistics'
  ];

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================

  /**
   * Simulates AI analysis of uploaded video content
   */
  const analyzeVideoContent = async (file: File, topic: string): Promise<AIAnalysisResult> => {
    // Simulate processing delay
    const stages = [
      { stage: 'processing', message: 'Processing video file...', progress: 20 },
      { stage: 'analyzing', message: 'Extracting audio and generating transcript...', progress: 40 },
      { stage: 'analyzing', message: 'Analyzing content with AI...', progress: 60 },
      { stage: 'analyzing', message: 'Matching content with specified topic...', progress: 80 },
      { stage: 'analyzing', message: 'Generating quality assessment...', progress: 90 }
    ];

    for (const stage of stages) {
      setUploadProgress({
        stage: stage.stage as any,
        progress: stage.progress,
        message: stage.message
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Mock AI analysis results based on topic
    const topicLower = topic.toLowerCase();
    let mockAnalysis: AIAnalysisResult;

    if (topicLower.includes('data structures') || topicLower.includes('algorithm')) {
      mockAnalysis = {
        contentMatch: 92,
        detectedTopics: ['Binary Trees', 'Data Structures', 'Tree Traversal', 'Algorithms', 'Computer Science'],
        keyPoints: [
          'Introduction to binary tree concepts',
          'Node structure and relationships',
          'Tree traversal methods (preorder, inorder, postorder)',
          'Implementation examples in code',
          'Time complexity analysis'
        ],
        summary: 'This video provides a comprehensive introduction to binary trees, covering fundamental concepts, structure, and traversal methods with practical implementation examples.',
        suggestedTitle: 'Binary Trees: Fundamentals and Implementation',
        estimatedDifficulty: 'Intermediate',
        qualityScore: 87,
        recommendations: [
          'Consider adding more visual diagrams for tree structures',
          'Include complexity analysis for each operation',
          'Add practice exercises at the end'
        ]
      };
    } else if (topicLower.includes('linear algebra') || topicLower.includes('matrix')) {
      mockAnalysis = {
        contentMatch: 88,
        detectedTopics: ['Linear Algebra', 'Matrix Operations', 'Vector Spaces', 'Mathematics'],
        keyPoints: [
          'Matrix multiplication principles',
          'Properties of matrix operations',
          'Applications in computer graphics',
          'Solving linear systems'
        ],
        summary: 'Comprehensive coverage of matrix operations and their applications in various fields including computer science and engineering.',
        suggestedTitle: 'Matrix Operations and Linear Systems',
        estimatedDifficulty: 'Intermediate',
        qualityScore: 91,
        recommendations: [
          'Excellent mathematical rigor',
          'Clear step-by-step examples',
          'Consider adding real-world applications'
        ]
      };
    } else {
      mockAnalysis = {
        contentMatch: 75,
        detectedTopics: ['General Academic Content', topic],
        keyPoints: [
          'Introduction to core concepts',
          'Theoretical foundations',
          'Practical applications',
          'Summary and conclusions'
        ],
        summary: `Educational content covering ${topic} with good structure and clear explanations.`,
        suggestedTitle: `Introduction to ${topic}`,
        estimatedDifficulty: 'Beginner',
        qualityScore: 82,
        recommendations: [
          'Content matches topic reasonably well',
          'Consider more specific examples',
          'Add visual aids to enhance understanding'
        ]
      };
    }

    return mockAnalysis;
  };

  // ===========================
  // EVENT HANDLERS
  // ===========================

  /**
   * Handles file selection
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setUploadProgress({
          stage: 'idle',
          progress: 0,
          message: ''
        });
        setAIAnalysis(null);
        setShowAIAnalysis(false);
      } else {
        alert('Please select a valid video file.');
      }
    }
  };

  /**
   * Handles form field changes
   */
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handles AI analysis trigger
   */
  const handleAnalyzeContent = async () => {
    if (!selectedFile || !formData.topic) {
      alert('Please select a video file and specify a topic before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setShowAIAnalysis(true);

    try {
      const analysis = await analyzeVideoContent(selectedFile, formData.topic);
      setAIAnalysis(analysis);
      
      setUploadProgress({
        stage: 'complete',
        progress: 100,
        message: 'Analysis complete!'
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setUploadProgress({
        stage: 'error',
        progress: 0,
        message: 'Analysis failed. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Handles form submission
   */
  const handleSubmit = () => {
    if (!selectedFile || !formData.title || !formData.subject || !formData.topic || !formData.level) {
      alert('Please fill in all required fields and select a video file.');
      return;
    }

    // Check content match if analysis was performed
    if (aiAnalysis && aiAnalysis.contentMatch < 70) {
      const confirmUpload = window.confirm(
        `AI analysis shows only ${aiAnalysis.contentMatch}% content match with the specified topic "${formData.topic}". Do you want to proceed anyway?`
      );
      if (!confirmUpload) return;
    }

    const videoData: VideoUploadData = {
      ...formData,
      level: formData.level as '100' | '200' | '300' | '400' | '500',
      duration: '45 min', // This would be calculated from the actual video
      file: selectedFile,
      aiAnalysis: aiAnalysis || undefined
    };

    onUpload(videoData);
    handleClose();
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      topic: '',
      level: ''
    });
    setSelectedFile(null);
    setUploadProgress({
      stage: 'idle',
      progress: 0,
      message: ''
    });
    setAIAnalysis(null);
    setShowAIAnalysis(false);
    setIsAnalyzing(false);
    onClose();
  };

  /**
   * Gets quality score color
   */
  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Gets content match color
   */
  const getContentMatchColor = (match: number) => {
    if (match >= 85) return 'text-green-600';
    if (match >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  // ===========================
  // MAIN RENDER
  // ===========================

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex h-full">
          {/* Main Form Section */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl text-futa-gray-900">Upload New Video</h2>
                <p className="text-sm text-futa-gray-600">
                  Share educational content with your students
                </p>
              </div>
              <Button variant="ghost" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* File Upload Area */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-futa-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {selectedFile ? (
                    <div className="flex flex-col items-center space-y-2">
                      <FileVideo className="w-12 h-12 text-primary" />
                      <div>
                        <p className="text-futa-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-futa-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-12 h-12 text-futa-gray-400" />
                      <div>
                        <p className="text-futa-gray-900">Upload Video File</p>
                        <p className="text-sm text-futa-gray-500">
                          Click to browse or drag and drop
                        </p>
                        <p className="text-xs text-futa-gray-400 mt-1">
                          Supported formats: MP4, AVI, MOV (max 2GB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="title">Video Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Enter a descriptive title for your video"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Provide a detailed description of the video content..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleFormChange('subject', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="topic">Topic *</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => handleFormChange('topic', e.target.value)}
                    placeholder="Enter video topic"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="level">Level *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleFormChange('level', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                    <SelectItem value="500">500 Level</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-futa-gray-500 mt-1">
                  Only students at this level and super admins can access this video
                </p>
              </div>
            </div>

            {/* AI Analysis Button */}
            <div className="mb-6">
              <Button
                onClick={handleAnalyzeContent}
                disabled={!selectedFile || !formData.topic || isAnalyzing}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing Content...' : 'Analyze Content with AI'}
              </Button>
              <p className="text-xs text-futa-gray-500 mt-2">
                AI will verify that your video content matches the specified topic and provide quality insights.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || !formData.title || !formData.subject || !formData.topic || !formData.level}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
              >
                Upload Video
              </Button>
            </div>
          </div>

          {/* AI Analysis Panel */}
          <AnimatePresence>
            {showAIAnalysis && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 400, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-futa-gray-200 bg-futa-gray-50 overflow-hidden"
              >
                <div className="p-6 h-full overflow-y-auto">
                  {/* Analysis Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-futa-gray-900">AI Content Analysis</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAIAnalysis(false)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Progress Indicator */}
                  {isAnalyzing && (
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain className="w-4 h-4 text-primary" />
                        </motion.div>
                        <span className="text-sm text-futa-gray-900">
                          {uploadProgress.message}
                        </span>
                      </div>
                      <Progress value={uploadProgress.progress} className="mb-2" />
                      <p className="text-xs text-futa-gray-500">
                        This may take a few minutes depending on video length
                      </p>
                    </div>
                  )}

                  {/* Analysis Results */}
                  {aiAnalysis && !isAnalyzing && (
                    <div className="space-y-4">
                      {/* Quality Score */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-futa-gray-700">Quality Score</span>
                            <span className={`text-lg ${getQualityScoreColor(aiAnalysis.qualityScore)}`}>
                              {aiAnalysis.qualityScore}/100
                            </span>
                          </div>
                          <Progress value={aiAnalysis.qualityScore} className="mb-2" />
                          <p className="text-xs text-futa-gray-500">
                            Overall content quality assessment
                          </p>
                        </CardContent>
                      </Card>

                      {/* Content Match */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-futa-gray-700">Topic Match</span>
                            <span className={`text-lg ${getContentMatchColor(aiAnalysis.contentMatch)}`}>
                              {aiAnalysis.contentMatch}%
                            </span>
                          </div>
                          <Progress value={aiAnalysis.contentMatch} className="mb-2" />
                          <p className="text-xs text-futa-gray-500">
                            How well content matches "{formData.topic}"
                          </p>
                          {aiAnalysis.contentMatch < 70 && (
                            <Alert className="mt-2">
                              <AlertCircle className="w-4 h-4" />
                              <AlertDescription className="text-xs">
                                Low topic match detected. Consider reviewing your content.
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>

                      {/* Detected Topics */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Tag className="w-4 h-4 mr-2 text-futa-gray-500" />
                            <span className="text-sm text-futa-gray-700">Detected Topics</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {aiAnalysis.detectedTopics.map((topic, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Key Points */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Lightbulb className="w-4 h-4 mr-2 text-futa-gray-500" />
                            <span className="text-sm text-futa-gray-700">Key Points</span>
                          </div>
                          <ul className="space-y-1">
                            {aiAnalysis.keyPoints.slice(0, 4).map((point, index) => (
                              <li key={index} className="text-xs text-futa-gray-600 flex items-start">
                                <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Recommendations */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Zap className="w-4 h-4 mr-2 text-futa-gray-500" />
                            <span className="text-sm text-futa-gray-700">Recommendations</span>
                          </div>
                          <ul className="space-y-1">
                            {aiAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                              <li key={index} className="text-xs text-futa-gray-600 flex items-start">
                                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* AI Suggestions */}
                      {aiAnalysis.suggestedTitle !== formData.title && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center mb-2">
                              <Eye className="w-4 h-4 mr-2 text-futa-gray-500" />
                              <span className="text-sm text-futa-gray-700">Suggested Title</span>
                            </div>
                            <p className="text-xs text-futa-gray-600 italic">
                              "{aiAnalysis.suggestedTitle}"
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 text-xs"
                              onClick={() => handleFormChange('title', aiAnalysis.suggestedTitle)}
                            >
                              Use This Title
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
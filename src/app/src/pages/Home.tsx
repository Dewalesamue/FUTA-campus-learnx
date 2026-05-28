import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { GraduationCap, Play, Brain, Users, BookOpen, Star, Shield, Zap, TrendingUp, CheckCircle, ArrowRight, Quote } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";

export function Home() {
  const { login } = useAuth();

  const handleStudentLogin = () => {
    // Navigate to student auth - in a real app you'd use router
    window.location.hash = 'student-auth';
  };

  const handleLecturerLogin = () => {
    // Navigate to lecturer auth - in a real app you'd use router
    window.location.hash = 'lecturer-auth';
  };

  const features = [
    {
      icon: Play,
      title: "Interactive Video Learning",
      description: "High-quality video lectures with interactive transcripts and real-time Q&A capabilities.",
      color: "text-blue-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Assistant",
      description: "Get instant answers to your questions with our advanced AI tutoring system.",
      color: "text-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Track your learning journey with detailed progress reports and performance insights.",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with peers and engage in group discussions to enhance your understanding.",
      color: "text-orange-500"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security and privacy controls.",
      color: "text-red-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with instant video loading and seamless navigation.",
      color: "text-yellow-500"
    }
  ];

  const testimonials = [
    {
      name: "Adebayo Michael",
      role: "Computer Science Student",
      content: "Campus LearnHub has revolutionized how I study. The AI assistant helps me understand complex algorithms instantly!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rating: 5
    },
    {
      name: "Dr. Sarah Okafor",
      role: "Mathematics Lecturer",
      content: "The platform makes it so easy to upload and manage my course content. Students are more engaged than ever.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1ea?w=100",
      rating: 5
    },
    {
      name: "Fatima Aliyu",
      role: "Economics Student",
      content: "I love how I can track my progress and get personalized recommendations. It's like having a personal tutor!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Students" },
    { number: "500+", label: "Expert Lecturers" },
    { number: "2,500+", label: "Video Courses" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-futa-gray-50 to-futa-gray-100 overflow-hidden">
      {/* Header */}
      <motion.header 
        className="container mx-auto px-4 py-6 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-futa-gray-900">Campus LearnHub</h1>
              <p className="text-sm text-futa-gray-600">FUTA Learning Platform</p>
            </div>
          </motion.div>
          
          <motion.nav 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <a href="#features" className="text-futa-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="text-futa-gray-600 hover:text-primary transition-colors">Testimonials</a>
            <a href="#about" className="text-futa-gray-600 hover:text-primary transition-colors">About</a>
          </motion.nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8 relative z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  🚀 Revolutionizing Education at FUTA
                </Badge>
              </motion.div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-futa-gray-900 leading-tight">
                Restructuring Learning at{" "}
                <motion.span 
                  className="text-primary font-bold"
                  animate={{ 
                    color: ["#006400", "#20b2aa", "#006400"]
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                >
                  FUTA
                </motion.span>
              </h1>
              <p className="text-lg text-futa-gray-600 max-w-lg">
                Experience the future of education with AI-powered learning, interactive videos, 
                and personalized progress tracking designed for the modern university student.
              </p>
            </motion.div>

            {/* Login Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 100, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleStudentLogin}
                  size="lg"
                  className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl group"
                >
                  <Users className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Login as Student
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 100, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleLecturerLogin}
                  variant="outline"
                  size="lg"
                  className="flex-1 sm:flex-none border-primary text-primary hover:bg-primary/5 px-8 py-4 rounded-xl group"
                >
                  <GraduationCap className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Login as Lecturer
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                >
                  <motion.p 
                    className="text-2xl font-bold text-primary"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.number}
                  </motion.p>
                  <p className="text-sm text-futa-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 1, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "easeInOut"
              }}
            >
              <Card className="p-8 bg-white shadow-xl border-0 rounded-2xl relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 2 }}
                />
                
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-futa-gray-900">AI-Powered Learning</h3>
                      <p className="text-sm text-futa-gray-600">Smart recommendations and insights</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-futa-gray-50 rounded-xl p-4 space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-futa-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-2 bg-primary rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "75%" }}
                            transition={{ delay: 1.8, duration: 2, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-futa-gray-600">75%</span>
                    </div>
                    <p className="text-sm text-futa-gray-700">Introduction to Data Structures</p>
                  </motion.div>

                  <motion.div 
                    className="bg-accent/5 rounded-xl p-4 border border-accent/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                  >
                    <div className="flex items-start space-x-3">
                      <motion.div 
                        className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        animate={{ pulse: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Brain className="w-3 h-3 text-white" />
                      </motion.div>
                      <div className="space-y-2">
                        <p className="text-sm text-futa-gray-700">
                          "Can you explain the difference between arrays and linked lists?"
                        </p>
                        <motion.div 
                          className="bg-white rounded-lg p-3 border"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2, duration: 0.8 }}
                        >
                          <p className="text-sm text-futa-gray-600">
                            Arrays store elements in contiguous memory locations, while linked lists use pointers...
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full opacity-20"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full opacity-20"
              animate={{ 
                y: [0, 15, 0],
                rotate: [360, 180, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        id="features"
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              ✨ Platform Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-futa-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-futa-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with proven educational methods
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="p-6 h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <motion.div 
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color} bg-current/10`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-futa-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-futa-gray-600">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        id="testimonials"
        className="py-20 bg-gradient-to-br from-futa-gray-50 to-futa-gray-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
              💬 Student & Lecturer Reviews
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-futa-gray-900 mb-4">
              Loved by Our Community
            </h2>
            <p className="text-lg text-futa-gray-600 max-w-2xl mx-auto">
              See what students and lecturers are saying about Campus LearnHub
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="p-6 h-full border-0 shadow-lg bg-white">
                  <div className="flex items-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-futa-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-futa-gray-600">{testimonial.role}</p>
                    </div>
                    <Quote className="w-6 h-6 text-primary/20" />
                  </div>
                  <p className="text-futa-gray-700 mb-4">{testimonial.content}</p>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-primary to-accent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of students and lecturers who are already experiencing the future of education
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleStudentLogin}
                  size="lg"
                  className="bg-white text-primary hover:bg-futa-gray-50 px-8 py-4 rounded-xl"
                >
                  Get Started as Student
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleLecturerLogin}
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl transition-all duration-300"
                >
                  Join as Lecturer
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
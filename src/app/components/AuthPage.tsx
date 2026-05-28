import { useState } from 'react';
import { GraduationCap, Users, ArrowLeft, CheckCircle, XCircle, Shield, Eye, EyeOff, Mail } from "lucide-react";
import { motion } from "motion/react";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// ===========================
// INTERFACES & TYPES
// ===========================

interface AuthPageProps {
  userType: 'student' | 'lecturer' | 'admin' | 'super-admin';
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, name: string, studentId?: string, level?: string) => void;
  onBack: () => void;
}

// ===========================
// MAIN COMPONENT
// ===========================

export function AuthPage({ userType, onLogin, onRegister, onBack }: AuthPageProps) {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    studentId: '',
    level: ''
  });

  // Password visibility state management
  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
    confirmPassword: false
  });

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // ===========================
  // VALIDATION FUNCTIONS
  // ===========================

  /**
   * Validates password strength based on multiple criteria
   * @param password - The password to validate
   * @returns Object containing validation results
   */
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      hasMinLength,
      hasUppercase,
      hasNumber,
      isStrong: hasMinLength && hasUppercase && hasNumber
    };
  };

  /**
   * Validates student ID format (e.g., IFT/23/4098)
   * @param studentId - The student ID to validate
   * @returns Boolean indicating if format is valid
   */
  const validateStudentId = (studentId: string) => {
    const pattern = /^[A-Z]{3}\/\d{2}\/\d{4}$/;
    return pattern.test(studentId);
  };

  /**
   * Validates FUTA email format (@futa.edu.ng)
   * @param email - Email address to validate
   * @param userType - Type of user (student, lecturer, admin, super-admin)
   * @returns Boolean indicating if email format is valid
   */
  const validateFutaEmail = (email: string, userType: string) => {
    const emailLower = email.toLowerCase();
    
    // All users must have @futa.edu.ng email
    if (!emailLower.endsWith('@futa.edu.ng')) {
      return false;
    }

    // Check specific patterns for each user type
    switch (userType) {
      case 'student':
        return emailLower.includes('student@futa.edu.ng') || 
               /^[a-zA-Z0-9._-]+@futa\.edu\.ng$/.test(emailLower);
      case 'lecturer':
        return emailLower.includes('lecturer@futa.edu.ng') || 
               emailLower.includes('prof@futa.edu.ng') ||
               emailLower.includes('dr@futa.edu.ng') ||
               /^[a-zA-Z0-9._-]+@futa\.edu\.ng$/.test(emailLower);
      case 'admin':
        return emailLower.includes('admin@futa.edu.ng') ||
               /^[a-zA-Z0-9._-]+@futa\.edu\.ng$/.test(emailLower);
      case 'super-admin':
        return emailLower.includes('superadmin@futa.edu.ng') ||
               emailLower.includes('admin@futa.edu.ng') ||
               /^[a-zA-Z0-9._-]+@futa\.edu\.ng$/.test(emailLower);
      default:
        return emailLower.endsWith('@futa.edu.ng');
    }
  };

  // ===========================
  // COMPUTED VALUES
  // ===========================

  const passwordValidation = validatePassword(registerForm.password);
  const isStudentIdValid = userType === 'student' ? validateStudentId(registerForm.studentId) : true;

  // ===========================
  // EVENT HANDLERS
  // ===========================

  /**
   * Handles form submission for login
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginForm.email, loginForm.password);
  };

  /**
   * Handles form submission for registration
   */
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password confirmation check
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Student ID validation for students
    if (userType === 'student' && !isStudentIdValid) {
      alert('Please enter a valid Student ID in format: IFT/23/4098');
      return;
    }

    // Password strength validation
    if (!passwordValidation.isStrong) {
      alert('Password must be at least 8 characters with uppercase letters and numbers');
      return;
    }

    onRegister(
      registerForm.email, 
      registerForm.password, 
      registerForm.name, 
      userType === 'student' ? registerForm.studentId : undefined,
      userType === 'student' ? registerForm.level : undefined
    );
  };

  /**
   * Handles Google OAuth authentication (mock for demo)
   */
  const handleGoogleAuth = () => {
    console.log(`Google auth for ${userType}`);
  };

  /**
   * Toggles password visibility for specific fields
   * @param field - Which password field to toggle
   */
  const togglePasswordVisibility = (field: 'login' | 'register' | 'confirmPassword') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  /**
   * Handles forgot password submission
   */
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate FUTA email format
    if (!validateFutaEmail(forgotPasswordEmail, userType)) {
      alert(`Please enter a valid FUTA email address (@futa.edu.ng) for ${userType}s.`);
      return;
    }
    
    // Simulate password reset email sent
    alert(`Password reset link has been sent to ${forgotPasswordEmail}. Please check your email.`);
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
  };

  // ===========================
  // CONFIGURATION
  // ===========================

  /**
   * Gets configuration for different user types
   * @returns Configuration object with icon, titles, and descriptions
   */
  const getUserTypeConfig = () => {
    switch (userType) {
      case 'super-admin':
        return {
          icon: Shield,
          title: 'Super Admin Portal',
          welcomeText: 'Super Administrator',
          description: 'Maximum security access for platform owners'
        };
      case 'admin':
        return {
          icon: Shield,
          title: 'Admin Portal',
          welcomeText: 'Administrator',
          description: 'Sign in to access the admin dashboard'
        };
      case 'lecturer':
        return {
          icon: GraduationCap,
          title: 'Lecturer Portal',
          welcomeText: 'Lecturer',
          description: 'Sign in to access your teaching dashboard'
        };
      case 'student':
      default:
        return {
          icon: Users,
          title: 'Student Portal',
          welcomeText: 'Student',
          description: 'Sign in to access your learning dashboard'
        };
    }
  };

  const config = getUserTypeConfig();
  const Icon = config.icon;

  // ===========================
  // RENDER FUNCTIONS
  // ===========================

  /**
   * Renders password input with visibility toggle
   * @param value - Current password value
   * @param onChange - Change handler function
   * @param placeholder - Input placeholder text
   * @param showPasswordKey - Key for showPassword state
   * @param className - Additional CSS classes
   * @returns JSX element for password input with toggle
   */
  const renderPasswordInput = (
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    showPasswordKey: 'login' | 'register' | 'confirmPassword',
    className?: string
  ) => (
    <div className="relative">
      <Input
        type={showPassword[showPasswordKey] ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`py-6 pr-12 ${className || ''}`}
        required
      />
      <button
        type="button"
        onClick={() => togglePasswordVisibility(showPasswordKey)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-futa-gray-400 hover:text-futa-gray-600 transition-colors duration-200"
      >
        {showPassword[showPasswordKey] ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  );

  /**
   * Renders the admin-specific login form (no registration tab)
   */
  const renderAdminLoginForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <Card className="border-0 dark:border dark:border-campus-gray-700 shadow-xl dark:bg-campus-gray-800 overflow-hidden transition-colors duration-200">
        {/* Progress bar indicator */}
        <motion.div
          className="h-1 bg-gradient-to-r from-red-600 to-red-400 dark:from-red-500 dark:to-red-300"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        
        {/* Card Header */}
        <CardHeader className="text-center pb-4">
          <CardTitle className="dark:text-campus-gray-100">Administrator Access</CardTitle>
          <CardDescription className="dark:text-campus-gray-400">
            Sign in with your authorized admin credentials
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors duration-200"
          >
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Secure Admin Access</span>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Admin accounts have full system access. Only authorized personnel should proceed.
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form 
            onSubmit={handleLogin} 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Input
                type="email"
                placeholder="Administrator email address"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="py-6"
                required
              />
            </motion.div>
            
            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {renderPasswordInput(
                loginForm.password,
                (value) => setLoginForm({ ...loginForm, password: value }),
                "Password",
                "login"
              )}
            </motion.div>
            
            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full py-6 bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
              >
                Sign In as Administrator
              </Button>
            </motion.div>
          </motion.form>

          {/* Admin Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 transition-colors duration-200"
          >
            <p className="text-xs text-yellow-700 dark:text-yellow-400 text-center">
              <Shield className="w-3 h-3 inline mr-1" />
              Admin accounts cannot be self-registered. Contact your system administrator for access.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  /**
   * Renders the super-admin specific login form (highest security level)
   */
  const renderSuperAdminLoginForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <Card className="border-0 dark:border dark:border-campus-gray-700 shadow-xl dark:bg-campus-gray-800 overflow-hidden transition-colors duration-200">
        {/* Progress bar indicator */}
        <motion.div
          className="h-1 bg-gradient-to-r from-purple-600 to-purple-900 dark:from-purple-500 dark:to-purple-700"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        
        {/* Card Header */}
        <CardHeader className="text-center pb-4">
          <CardTitle className="dark:text-campus-gray-100">👑 Super Administrator Access</CardTitle>
          <CardDescription className="dark:text-campus-gray-400">
            Ultimate platform control - highest security clearance required
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Ultra Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 transition-colors duration-200"
          >
            <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">⚡ Maximum Security Zone</span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Super-admin access grants complete platform control. Only authorized platform owners should proceed.
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form 
            onSubmit={handleLogin} 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Input
                type="email"
                placeholder="Super-admin email address"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="py-6"
                required
              />
            </motion.div>
            
            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {renderPasswordInput(
                loginForm.password,
                (value) => setLoginForm({ ...loginForm, password: value }),
                "Master Password",
                "login"
              )}
            </motion.div>
            
            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full py-6 bg-gradient-to-r from-purple-600 to-purple-900 hover:from-purple-700 hover:to-purple-950 text-white transition-all duration-200"
              >
                🔐 Access Super Admin Portal
              </Button>
            </motion.div>
          </motion.form>

          {/* Security Warning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <p className="text-xs text-red-700 text-center">
              <Shield className="w-3 h-3 inline mr-1" />
              ⚠️ All super-admin access attempts are logged and monitored. Unauthorized access will be reported.
            </p>
          </motion.div>

          {/* Super Admin Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3"
          >
            <p className="text-xs text-purple-700 dark:text-purple-400 text-center">
              <Shield className="w-3 h-3 inline mr-1" />
              👑 Super-admin credentials cannot be self-registered. Contact platform owner for emergency access.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  /**
   * Renders the regular authentication form with tabs (for students and lecturers)
   */
  const renderRegularAuthForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <Card className="border-0 dark:border dark:border-campus-gray-700 shadow-xl dark:bg-campus-gray-800 overflow-hidden transition-colors duration-200">
        {/* Progress bar indicator */}
        <motion.div
          className="h-1 bg-gradient-to-r from-primary to-accent dark:from-campus-deep-blue dark:to-campus-purple"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        
        {/* Card Header */}
        <CardHeader className="text-center pb-4">
          <CardTitle className="dark:text-campus-gray-100">Welcome {config.welcomeText}</CardTitle>
          <CardDescription className="dark:text-campus-gray-400">
            {config.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-2 bg-futa-gray-100 dark:bg-campus-gray-700 transition-colors duration-200">
              <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-campus-gray-600 dark:text-campus-gray-300 dark:data-[state=active]:text-campus-gray-100">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-white dark:data-[state=active]:bg-campus-gray-600 dark:text-campus-gray-300 dark:data-[state=active]:text-campus-gray-100">Register</TabsTrigger>
            </TabsList>

            {/* ===========================
                LOGIN TAB CONTENT
            =========================== */}
            <TabsContent value="login" className="space-y-4">
              {/* Google OAuth Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Button
                  onClick={handleGoogleAuth}
                  variant="outline"
                  className="w-full py-6 border-futa-gray-300 bg-white hover:bg-futa-gray-50 hover:border-futa-gray-400 text-futa-gray-700 hover:text-futa-gray-900 transition-all duration-200 group shadow-sm"
                >
                  <motion.svg 
                    className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" 
                    viewBox="0 0 24 24"
                  >
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </motion.svg>
                  Continue with Google
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-futa-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-futa-gray-500">or</span>
                </div>
              </div>

              {/* Email/Password Login Form */}
              <motion.form 
                onSubmit={handleLogin} 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {/* Email Input */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="py-6"
                    required
                  />
                </motion.div>

                {/* Password Input with Visibility Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  {renderPasswordInput(
                    loginForm.password,
                    (value) => setLoginForm({ ...loginForm, password: value }),
                    "Password",
                    "login"
                  )}
                </motion.div>

                {/* Login Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-primary hover:bg-primary/90 text-white transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </motion.form>
            </TabsContent>

            {/* ===========================
                REGISTER TAB CONTENT
            =========================== */}
            <TabsContent value="register" className="space-y-4">
              {/* Google OAuth Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Button
                  onClick={handleGoogleAuth}
                  variant="outline"
                  className="w-full py-6 border-futa-gray-300 bg-white hover:bg-futa-gray-50 hover:border-futa-gray-400 text-futa-gray-700 hover:text-futa-gray-900 transition-all duration-200 group shadow-sm"
                >
                  <motion.svg 
                    className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" 
                    viewBox="0 0 24 24"
                  >
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </motion.svg>
                  Sign up with Google
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-futa-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-futa-gray-500">or</span>
                </div>
              </div>

              {/* Registration Form */}
              <motion.form 
                onSubmit={handleRegister} 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {/* Full Name Input */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="py-6"
                    required
                  />
                </motion.div>

                {/* Student ID Field - Only for students */}
                {userType === 'student' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                  >
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Student ID (e.g., IFT/23/4098)"
                        value={registerForm.studentId}
                        onChange={(e) => setRegisterForm({ ...registerForm, studentId: e.target.value })}
                        className={`py-6 ${isStudentIdValid || !registerForm.studentId ? 'border-futa-gray-200' : 'border-red-500'}`}
                        required
                      />
                      {/* Validation Icon */}
                      {registerForm.studentId && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isStudentIdValid ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {/* Error Message */}
                    {registerForm.studentId && !isStudentIdValid && (
                      <p className="text-xs text-red-500 mt-1">
                        Format: Department/Year/Number (e.g., IFT/23/4098)
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Level Input for Students */}
                {userType === 'student' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                  >
                    <Select
                      value={registerForm.level}
                      onValueChange={(value) => setRegisterForm({ ...registerForm, level: value })}
                      required
                    >
                      <SelectTrigger className="py-6">
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 Level</SelectItem>
                        <SelectItem value="200">200 Level</SelectItem>
                        <SelectItem value="300">300 Level</SelectItem>
                        <SelectItem value="400">400 Level</SelectItem>
                        <SelectItem value="500">500 Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}

                {/* Email Input */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="py-6"
                    required
                  />
                </motion.div>

                {/* Password Input with Validation and Visibility Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <div className="relative">
                    {renderPasswordInput(
                      registerForm.password,
                      (value) => setRegisterForm({ ...registerForm, password: value }),
                      "Password",
                      "register"
                    )}
                    {/* Validation Icon */}
                    {registerForm.password && (
                      <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                        {passwordValidation.isStrong ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Password Requirements */}
                  {registerForm.password && (
                    <motion.div 
                      className="mt-2 space-y-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Minimum Length Check */}
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasMinLength ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-red-600'}`}>
                          At least 8 characters
                        </span>
                      </div>
                      
                      {/* Uppercase Check */}
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasUppercase ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                          Contains uppercase letter
                        </span>
                      </div>
                      
                      {/* Number Check */}
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasNumber ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                          Contains number
                        </span>
                      </div>
                      
                      {/* Strong Password Confirmation */}
                      {passwordValidation.isStrong && (
                        <motion.div 
                          className="flex items-center space-x-2 mt-2"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">Strong Password!</span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>

                {/* Confirm Password Input with Visibility Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  {renderPasswordInput(
                    registerForm.confirmPassword,
                    (value) => setRegisterForm({ ...registerForm, confirmPassword: value }),
                    "Confirm Password",
                    "confirmPassword"
                  )}
                  {/* Password Match Error */}
                  {registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </motion.div>

                {/* Register Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-primary hover:bg-primary/90 text-white transition-all duration-200"
                    disabled={
                      !passwordValidation.isStrong || 
                      registerForm.password !== registerForm.confirmPassword ||
                      (userType === 'student' && !isStudentIdValid)
                    }
                  >
                    Create Account
                  </Button>
                </motion.div>
              </motion.form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );

  // ===========================
  // MAIN RENDER
  // ===========================

  return (
    <div className="min-h-screen bg-gradient-to-br from-campus-gray-50 to-campus-gray-100 dark:from-campus-gray-900 dark:to-campus-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
      <motion.div 
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* ===========================
            PAGE HEADER
        =========================== */}
        <div className="text-center space-y-4">
          {/* Back Button and Dark Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-start"
          >
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-campus-gray-600 dark:text-campus-gray-400 hover:text-campus-gray-900 dark:hover:text-campus-gray-100 hover:bg-campus-gray-100 dark:hover:bg-campus-gray-800 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>
          
          {/* Portal Title and Icon */}
          <motion.div 
            className="flex items-center justify-center space-x-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div 
              className={`w-12 h-12 ${userType === 'admin' ? 'bg-red-600 dark:bg-red-700' : userType === 'super-admin' ? 'bg-purple-600 dark:bg-campus-purple' : 'bg-primary dark:bg-campus-deep-blue'} rounded-xl flex items-center justify-center`}
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-campus-gray-900 dark:text-campus-gray-100">
                {config.title}
              </h1>
              <p className="text-sm text-campus-gray-600 dark:text-campus-gray-400">Campus LearnHub</p>
            </div>
          </motion.div>
        </div>

        {/* ===========================
            AUTH FORM CONTENT
        =========================== */}
        {userType === 'admin' ? renderAdminLoginForm() : userType === 'super-admin' ? renderSuperAdminLoginForm() : renderRegularAuthForm()}

        {/* ===========================
            FOOTER TEXT
        =========================== */}
        <motion.p 
          className="text-center text-sm text-campus-gray-500 dark:text-campus-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}
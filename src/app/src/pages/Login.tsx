import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { GraduationCap, Users, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

interface LoginProps {
  userType: 'student' | 'lecturer';
  onBack: () => void;
}

export function Login({ userType, onBack }: LoginProps) {
  const { login, register } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    studentId: ''
  });

  // Password validation logic
  const passwordValidation = authService.validatePassword(registerForm.password);
  const isStudentIdValid = userType === 'student' ? authService.validateStudentId(registerForm.studentId) : true;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password, userType);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password === registerForm.confirmPassword) {
      if (userType === 'student' && !isStudentIdValid) {
        alert('Please enter a valid Student ID in format: iFT/23/4098');
        return;
      }
      if (!passwordValidation.isStrong) {
        alert('Password must be at least 8 characters with uppercase letters and numbers');
        return;
      }
      try {
        await register(
          registerForm.email, 
          registerForm.password, 
          registerForm.name, 
          userType,
          userType === 'student' ? registerForm.studentId : undefined
        );
      } catch (error) {
        console.error('Registration failed:', error);
      }
    } else {
      alert('Passwords do not match');
    }
  };

  const handleGoogleAuth = () => {
    // Mock Google authentication
    console.log(`Google auth for ${userType}`);
  };

  return (
    <motion.div 
      className="w-full max-w-md space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-futa-gray-600 hover:text-futa-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
        
        <motion.div 
          className="flex items-center justify-center space-x-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div 
            className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center"
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {userType === 'student' ? (
              <Users className="w-6 h-6 text-primary-foreground" />
            ) : (
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            )}
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-futa-gray-900">
              {userType === 'student' ? 'Student Portal' : 'Lecturer Portal'}
            </h1>
            <p className="text-sm text-futa-gray-600">Campus LearnHub</p>
          </div>
        </motion.div>
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card className="border-0 shadow-xl overflow-hidden">
          <motion.div
            className="h-1 bg-gradient-to-r from-primary to-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
          
          <CardHeader className="text-center pb-4">
            <CardTitle>Welcome {userType === 'student' ? 'Student' : 'Lecturer'}</CardTitle>
            <CardDescription>
              Sign in to access your {userType === 'student' ? 'learning' : 'teaching'} dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-futa-gray-100">
                <TabsTrigger value="login" className="data-[state=active]:bg-white">Login</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-white">Register</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Button
                    onClick={handleGoogleAuth}
                    variant="outline"
                    className="w-full py-6 border-futa-gray-200 hover:bg-futa-gray-50 group"
                  >
                    <motion.svg 
                      className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" 
                      viewBox="0 0 24 24"
                    >
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </motion.svg>
                    Continue with Google
                  </Button>
                </motion.div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-futa-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-futa-gray-500">or</span>
                  </div>
                </div>

                <motion.form 
                  onSubmit={handleLogin} 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
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
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Input
                      type="password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="py-6"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button type="submit" className="w-full py-6 bg-primary hover:bg-primary/90">
                      Sign In
                    </Button>
                  </motion.div>
                </motion.form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Button
                    onClick={handleGoogleAuth}
                    variant="outline"
                    className="w-full py-6 border-futa-gray-200 hover:bg-futa-gray-50 group"
                  >
                    <motion.svg 
                      className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" 
                      viewBox="0 0 24 24"
                    >
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </motion.svg>
                    Sign up with Google
                  </Button>
                </motion.div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-futa-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-futa-gray-500">or</span>
                  </div>
                </div>

                <motion.form 
                  onSubmit={handleRegister} 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
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
                          placeholder="Student ID (e.g., iFT/23/4098)"
                          value={registerForm.studentId}
                          onChange={(e) => setRegisterForm({ ...registerForm, studentId: e.target.value })}
                          className={`py-6 ${isStudentIdValid || !registerForm.studentId ? 'border-futa-gray-200' : 'border-red-500'}`}
                          required
                        />
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
                      {registerForm.studentId && !isStudentIdValid && (
                        <p className="text-xs text-red-500 mt-1">
                          Format: Department/Year/Number (e.g., iFT/23/4098)
                        </p>
                      )}
                    </motion.div>
                  )}

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

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="py-6"
                        required
                      />
                      {registerForm.password && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      className="py-6"
                      required
                    />
                    {registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full py-6 bg-primary hover:bg-primary/90"
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

      <motion.p 
        className="text-center text-sm text-futa-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        By signing in, you agree to our Terms of Service and Privacy Policy
      </motion.p>
    </motion.div>
  );
}
/**
 * ====================================
 * CAMPUS LEARNHUB - SETTINGS PAGE
 * ====================================
 * 
 * Comprehensive settings page for all user roles
 * Features role-based settings sections and preferences
 * 
 * Features:
 * - Profile management and customization
 * - Theme and appearance settings
 * - Notification preferences
 * - Security and privacy controls
 * - Role-specific settings sections
 * - Data management and export options
 * 
 * @author Campus LearnHub Team
 * @version 2.0.0
 */

import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download, 
  Upload, 
  Monitor, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX,
  Lock,
  Key,
  Database,
  HardDrive,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

// ====================================
// UI COMPONENT IMPORTS
// ====================================
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select } from "./ui/select";
import { Tabs } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert } from "./ui/alert";

// ====================================
// TYPE DEFINITIONS
// ====================================

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin' | 'super-admin';
  studentId?: string;
  avatar?: string;
  department?: string;
  yearOfStudy?: number;
  phone?: string;
  bio?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  courseUpdates: boolean;
  assignmentReminders: boolean;
  gradeNotifications: boolean;
  systemAnnouncements: boolean;
  weeklyDigest: boolean;
  instantMessages: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'students' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  shareProgress: boolean;
  allowAnalytics: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'blue-purple' | 'classic-green' | 'modern-teal';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  showAnimations: boolean;
  highContrast: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordExpiry: number;
  sessionTimeout: number;
  loginAlerts: boolean;
  deviceTracking: boolean;
}

interface SettingsPageProps {
  currentUser: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

// ====================================
// MAIN SETTINGS COMPONENT
// ====================================

export function SettingsPage({ currentUser, onBack, onUpdateUser }: SettingsPageProps) {
  // ====================================
  // STATE MANAGEMENT
  // ====================================
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile Settings State
  const [profileData, setProfileData] = useState<User>(currentUser);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification Settings State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    courseUpdates: true,
    assignmentReminders: true,
    gradeNotifications: true,
    systemAnnouncements: true,
    weeklyDigest: false,
    instantMessages: true,
  });
  
  // Privacy Settings State
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'students',
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    showOnlineStatus: true,
    shareProgress: true,
    allowAnalytics: true,
  });
  
  // Appearance Settings State
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'light',
    colorScheme: 'blue-purple',
    fontSize: 'medium',
    compactMode: false,
    showAnimations: true,
    highContrast: false,
  });
  
  // Security Settings State
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
    loginAlerts: true,
    deviceTracking: true,
  });

  // ====================================
  // EVENT HANDLERS
  // ====================================

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setSaveStatus('saving');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user profile
      onUpdateUser(profileData);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Settings save error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate password change API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    // Simulate data export
    const data = {
      profile: profileData,
      settings: { notifications, privacy, appearance, security },
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-learnhub-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      // Reset to default values
      setNotifications({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        courseUpdates: true,
        assignmentReminders: true,
        gradeNotifications: true,
        systemAnnouncements: true,
        weeklyDigest: false,
        instantMessages: true,
      });
      
      setPrivacy({
        profileVisibility: 'students',
        showEmail: false,
        showPhone: false,
        allowDirectMessages: true,
        showOnlineStatus: true,
        shareProgress: true,
        allowAnalytics: true,
      });
      
      setAppearance({
        theme: 'light',
        colorScheme: 'blue-purple',
        fontSize: 'medium',
        compactMode: false,
        showAnimations: true,
        highContrast: false,
      });
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'student': return 'Student';
      case 'lecturer': return 'Lecturer';
      case 'admin': return 'Administrator';
      case 'super-admin': return 'Super Administrator';
      default: return 'User';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-campus-sky-blue text-white';
      case 'lecturer': return 'bg-campus-purple text-white';
      case 'admin': return 'bg-campus-indigo text-white';
      case 'super-admin': return 'bg-campus-deep-blue text-white';
      default: return 'bg-campus-gray-500 text-white';
    }
  };

  // ====================================
  // RENDER FUNCTIONS
  // ====================================

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 p-6 bg-campus-light-blue rounded-lg border border-campus-gray-200">
        <div className="w-16 h-16 bg-campus-deep-blue rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-campus-gray-900">{profileData.name}</h3>
          <p className="text-campus-gray-600">{profileData.email}</p>
          <Badge className={`mt-1 ${getRoleBadgeColor(profileData.role)}`}>
            {getRoleDisplayName(profileData.role)}
          </Badge>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="p-6 border border-campus-gray-200">
        <h4 className="text-campus-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-campus-deep-blue" />
          Basic Information
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="text-campus-gray-700">Full Name</Label>
            <Input
              id="fullName"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="mt-1 border-campus-gray-300 focus:border-campus-deep-blue"
              disabled={profileData.role === 'student'}
              readOnly={profileData.role === 'student'}
            />
            {profileData.role === 'student' && (
              <p className="text-xs text-campus-gray-500 mt-1">
                <Info className="w-3 h-3 inline mr-1" />
                This field cannot be edited
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email" className="text-campus-gray-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="mt-1 border-campus-gray-300 focus:border-campus-deep-blue"
              disabled={profileData.role === 'student'}
              readOnly={profileData.role === 'student'}
            />
            {profileData.role === 'student' && (
              <p className="text-xs text-campus-gray-500 mt-1">
                <Info className="w-3 h-3 inline mr-1" />
                This field cannot be edited
              </p>
            )}
          </div>

          {profileData.role === 'student' && (
            <div>
              <Label htmlFor="studentId" className="text-campus-gray-700">Student ID</Label>
              <Input
                id="studentId"
                value={profileData.studentId || ''}
                onChange={(e) => setProfileData({ ...profileData, studentId: e.target.value })}
                placeholder="e.g., IFT/23/4098"
                className="mt-1 border-campus-gray-300 focus:border-campus-deep-blue"
                disabled={true}
                readOnly={true}
              />
              <p className="text-xs text-campus-gray-500 mt-1">
                <Info className="w-3 h-3 inline mr-1" />
                This field cannot be edited
              </p>
            </div>
          )}
          
          <div>
            <Label htmlFor="phone" className="text-campus-gray-700">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={profileData.phone || ''}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              placeholder="+234 XXX XXX XXXX"
              className="mt-1 border-campus-gray-300 focus:border-campus-deep-blue"
            />
          </div>

          <div>
            <Label htmlFor="department" className="text-campus-gray-700">Department</Label>
            <Input
              id="department"
              value={profileData.department || ''}
              onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
              placeholder="e.g., Information Technology"
              className="mt-1 border-campus-gray-300 focus:border-campus-deep-blue"
              disabled={profileData.role === 'student'}
              readOnly={profileData.role === 'student'}
            />
            {profileData.role === 'student' && (
              <p className="text-xs text-campus-gray-500 mt-1">
                <Info className="w-3 h-3 inline mr-1" />
                This field cannot be edited
              </p>
            )}
          </div>

          {profileData.role === 'student' && (
            <div>
              <Label htmlFor="yearOfStudy" className="text-campus-gray-700">Year of Study</Label>
              <select
                id="yearOfStudy"
                value={profileData.yearOfStudy || ''}
                onChange={(e) => setProfileData({ ...profileData, yearOfStudy: parseInt(e.target.value) })}
                className="mt-1 w-full px-3 py-2 border border-campus-gray-300 rounded-md focus:border-campus-deep-blue"
                disabled={true}
              >
                <option value="">Select year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
                <option value="5">Year 5</option>
              </select>
              <p className="text-xs text-campus-gray-500 mt-1">
                <Info className="w-3 h-3 inline mr-1" />
                This field cannot be edited
              </p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Label htmlFor="bio" className="text-campus-gray-700">Bio</Label>
          <textarea
            id="bio"
            value={profileData.bio || ''}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={3}
            className="mt-1 w-full px-3 py-2 border border-campus-gray-300 rounded-md focus:border-campus-deep-blue resize-none"
          />
        </div>
      </Card>

      {/* Password Change */}
      <Card className="p-6 border border-campus-gray-200">
        <h4 className="text-campus-gray-900 mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-campus-deep-blue" />
          Change Password
        </h4>
        
        <div className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="currentPassword" className="text-campus-gray-700">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 border-campus-gray-300 focus:border-campus-deep-blue pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-campus-gray-500"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="newPassword" className="text-campus-gray-700">New Password</Label>
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 border-campus-gray-300 focus:border-campus-deep-blue"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-campus-gray-700">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 border-campus-gray-300 focus:border-campus-deep-blue"
            />
          </div>
          
          <Button
            onClick={handlePasswordChange}
            disabled={!currentPassword || !newPassword || !confirmPassword || isLoading}
            className="bg-campus-deep-blue hover:bg-campus-deep-blue/90 text-white"
          >
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card className="p-6 border border-campus-gray-200">
        <h4 className="text-campus-gray-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-campus-deep-blue" />
          Notification Preferences
        </h4>
        
        <div className="space-y-6">
          {/* General Notifications */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">General Notifications</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Email Notifications</label>
                  <p className="text-sm text-campus-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Push Notifications</label>
                  <p className="text-sm text-campus-gray-500">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">SMS Notifications</label>
                  <p className="text-sm text-campus-gray-500">Receive important alerts via SMS</p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-campus-gray-200" />

          {/* Academic Notifications */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Academic Notifications</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Course Updates</label>
                  <p className="text-sm text-campus-gray-500">New videos, materials, and announcements</p>
                </div>
                <Switch
                  checked={notifications.courseUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, courseUpdates: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Assignment Reminders</label>
                  <p className="text-sm text-campus-gray-500">Upcoming assignment deadlines</p>
                </div>
                <Switch
                  checked={notifications.assignmentReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, assignmentReminders: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Grade Notifications</label>
                  <p className="text-sm text-campus-gray-500">When new grades are available</p>
                </div>
                <Switch
                  checked={notifications.gradeNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, gradeNotifications: checked })}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-campus-gray-200" />

          {/* System Notifications */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">System Notifications</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">System Announcements</label>
                  <p className="text-sm text-campus-gray-500">Platform updates and maintenance notices</p>
                </div>
                <Switch
                  checked={notifications.systemAnnouncements}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, systemAnnouncements: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Weekly Digest</label>
                  <p className="text-sm text-campus-gray-500">Summary of your weekly activity</p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Instant Messages</label>
                  <p className="text-sm text-campus-gray-500">Direct messages from lecturers and peers</p>
                </div>
                <Switch
                  checked={notifications.instantMessages}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, instantMessages: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card className="p-6 border border-campus-gray-200">
        <h4 className="text-campus-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-campus-deep-blue" />
          Privacy Settings
        </h4>
        
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Profile Visibility</h5>
            <div className="space-y-3">
              <div>
                <label className="text-campus-gray-700 mb-2 block">Who can see your profile?</label>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value as 'public' | 'students' | 'private' })}
                  className="w-full px-3 py-2 border border-campus-gray-300 rounded-md focus:border-campus-deep-blue"
                >
                  <option value="public">Everyone</option>
                  <option value="students">Students and Staff Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Show Email Address</label>
                  <p className="text-sm text-campus-gray-500">Display your email on your profile</p>
                </div>
                <Switch
                  checked={privacy.showEmail}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Show Phone Number</label>
                  <p className="text-sm text-campus-gray-500">Display your phone number on your profile</p>
                </div>
                <Switch
                  checked={privacy.showPhone}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, showPhone: checked })}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-campus-gray-200" />

          {/* Communication */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Communication</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Allow Direct Messages</label>
                  <p className="text-sm text-campus-gray-500">Let others send you direct messages</p>
                </div>
                <Switch
                  checked={privacy.allowDirectMessages}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, allowDirectMessages: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Show Online Status</label>
                  <p className="text-sm text-campus-gray-500">Display when you're online</p>
                </div>
                <Switch
                  checked={privacy.showOnlineStatus}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, showOnlineStatus: checked })}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-campus-gray-200" />

          {/* Data Sharing */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Data Sharing</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Share Learning Progress</label>
                  <p className="text-sm text-campus-gray-500">Allow sharing of your progress with lecturers</p>
                </div>
                <Switch
                  checked={privacy.shareProgress}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, shareProgress: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Analytics Collection</label>
                  <p className="text-sm text-campus-gray-500">Help improve the platform with usage analytics</p>
                </div>
                <Switch
                  checked={privacy.allowAnalytics}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, allowAnalytics: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <Card className="p-6 border border-campus-gray-200">
        <h4 className="text-campus-gray-900 mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-campus-deep-blue" />
          Appearance Settings
        </h4>
        
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Theme</h5>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setAppearance({ ...appearance, theme: 'light' })}
                className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  appearance.theme === 'light' 
                    ? 'border-campus-deep-blue bg-campus-light-blue' 
                    : 'border-campus-gray-300 hover:border-campus-gray-400'
                }`}
              >
                <Sun className="w-6 h-6 text-campus-deep-blue" />
                <span className="text-sm text-campus-gray-700">Light</span>
              </button>
              
              <button
                onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  appearance.theme === 'dark' 
                    ? 'border-campus-deep-blue bg-campus-light-blue' 
                    : 'border-campus-gray-300 hover:border-campus-gray-400'
                }`}
              >
                <Moon className="w-6 h-6 text-campus-deep-blue" />
                <span className="text-sm text-campus-gray-700">Dark</span>
              </button>
              
              <button
                onClick={() => setAppearance({ ...appearance, theme: 'system' })}
                className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  appearance.theme === 'system' 
                    ? 'border-campus-deep-blue bg-campus-light-blue' 
                    : 'border-campus-gray-300 hover:border-campus-gray-400'
                }`}
              >
                <Monitor className="w-6 h-6 text-campus-deep-blue" />
                <span className="text-sm text-campus-gray-700">System</span>
              </button>
            </div>
          </div>

          <Separator className="bg-campus-gray-200" />

          {/* Color Scheme */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Color Scheme</h5>
            <div className="space-y-3">
              <button
                onClick={() => setAppearance({ ...appearance, colorScheme: 'blue-purple' })}
                className={`w-full p-4 border rounded-lg flex items-center space-x-3 transition-colors ${
                  appearance.colorScheme === 'blue-purple' 
                    ? 'border-campus-deep-blue bg-campus-light-blue' 
                    : 'border-campus-gray-300 hover:border-campus-gray-400'
                }`}
              >
                <div className="flex space-x-1">
                  <div className="w-4 h-4 bg-campus-deep-blue rounded"></div>
                  <div className="w-4 h-4 bg-campus-sky-blue rounded"></div>
                  <div className="w-4 h-4 bg-campus-purple rounded"></div>
                </div>
                <div>
                  <div className="text-campus-gray-900">Blue & Purple (Current)</div>
                  <div className="text-sm text-campus-gray-500">Modern professional theme</div>
                </div>
              </button>
              
              <button
                onClick={() => setAppearance({ ...appearance, colorScheme: 'classic-green' })}
                className={`w-full p-4 border rounded-lg flex items-center space-x-3 transition-colors ${
                  appearance.colorScheme === 'classic-green' 
                    ? 'border-campus-deep-blue bg-campus-light-blue' 
                    : 'border-campus-gray-300 hover:border-campus-gray-400'
                }`}
              >
                <div className="flex space-x-1">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                </div>
                <div>
                  <div className="text-campus-gray-900">Classic Green</div>
                  <div className="text-sm text-campus-gray-500">Traditional FUTA colors</div>
                </div>
              </button>
              
              <button
                onClick={() => setAppearance({ ...appearance, colorScheme: 'modern-teal' })}
                className={`w-full p-4 border rounded-lg flex items-center space-x-3 transition-colors ${
                  appearance.colorScheme === 'modern-teal' 
                    ? 'border-campus-deep-blue bg-campus-light-blue' 
                    : 'border-campus-gray-300 hover:border-campus-gray-400'
                }`}
              >
                <div className="flex space-x-1">
                  <div className="w-4 h-4 bg-teal-600 rounded"></div>
                  <div className="w-4 h-4 bg-teal-400 rounded"></div>
                  <div className="w-4 h-4 bg-cyan-200 rounded"></div>
                </div>
                <div>
                  <div className="text-campus-gray-900">Modern Teal</div>
                  <div className="text-sm text-campus-gray-500">Fresh and vibrant</div>
                </div>
              </button>
            </div>
          </div>

          <Separator className="bg-campus-gray-200" />

          {/* Display Options */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Display Options</h5>
            <div className="space-y-4">
              <div>
                <label className="text-campus-gray-700 mb-2 block">Font Size</label>
                <select
                  value={appearance.fontSize}
                  onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value as 'small' | 'medium' | 'large' })}
                  className="w-full px-3 py-2 border border-campus-gray-300 rounded-md focus:border-campus-deep-blue"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Compact Mode</label>
                  <p className="text-sm text-campus-gray-500">Reduce spacing for more content</p>
                </div>
                <Switch
                  checked={appearance.compactMode}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">Show Animations</label>
                  <p className="text-sm text-campus-gray-500">Enable smooth transitions and animations</p>
                </div>
                <Switch
                  checked={appearance.showAnimations}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, showAnimations: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-campus-gray-700">High Contrast</label>
                  <p className="text-sm text-campus-gray-500">Improve accessibility with higher contrast</p>
                </div>
                <Switch
                  checked={appearance.highContrast}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, highContrast: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="p-6 border border-campus-gray-200">
        <h4 className="text-campus-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-campus-deep-blue" />
          Security Settings
        </h4>
        
        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-campus-light-blue rounded-lg border border-campus-gray-200">
            <div>
              <h5 className="text-campus-gray-900">Two-Factor Authentication</h5>
              <p className="text-sm text-campus-gray-600">Add an extra layer of security to your account</p>
              {security.twoFactorEnabled && (
                <Badge className="mt-1 bg-green-500 text-white">Enabled</Badge>
              )}
            </div>
            <Switch
              checked={security.twoFactorEnabled}
              onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
            />
          </div>

          {/* Security Preferences */}
          <div className="space-y-4">
            <div>
              <label className="text-campus-gray-700 mb-2 block">Password Expiry (days)</label>
              <select
                value={security.passwordExpiry}
                onChange={(e) => setSecurity({ ...security, passwordExpiry: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-campus-gray-300 rounded-md focus:border-campus-deep-blue"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="365">Never</option>
              </select>
            </div>
            
            <div>
              <label className="text-campus-gray-700 mb-2 block">Session Timeout (minutes)</label>
              <select
                value={security.sessionTimeout}
                onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-campus-gray-300 rounded-md focus:border-campus-deep-blue"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-campus-gray-700">Login Alerts</label>
                <p className="text-sm text-campus-gray-500">Get notified of new login attempts</p>
              </div>
              <Switch
                checked={security.loginAlerts}
                onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-campus-gray-700">Device Tracking</label>
                <p className="text-sm text-campus-gray-500">Track devices used to access your account</p>
              </div>
              <Switch
                checked={security.deviceTracking}
                onCheckedChange={(checked) => setSecurity({ ...security, deviceTracking: checked })}
              />
            </div>
          </div>

          {/* Active Sessions */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Active Sessions</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border border-campus-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-campus-deep-blue" />
                  <div>
                    <div className="text-campus-gray-900">Current Session</div>
                    <div className="text-sm text-campus-gray-500">Chrome on Windows • Now</div>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Active</Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <Card className="p-6 border border-campus-gray-200">
        <h4 className="text-campus-gray-900 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-campus-deep-blue" />
          Data Management
        </h4>
        
        <div className="space-y-6">
          {/* Storage Usage */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Storage Usage</h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-campus-gray-700">Used Storage</span>
                <span className="text-campus-gray-900">2.1 GB of 5 GB</span>
              </div>
              <Progress value={42} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-campus-gray-500">Videos</span>
                  <span className="text-campus-gray-700">1.8 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-campus-gray-500">Documents</span>
                  <span className="text-campus-gray-700">0.3 GB</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-campus-gray-200" />

          {/* Data Export */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Data Export</h5>
            <p className="text-campus-gray-600 mb-4">Download a copy of your data for backup or transfer purposes.</p>
            <Button
              onClick={handleExportData}
              className="bg-campus-deep-blue hover:bg-campus-deep-blue/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
          </div>

          <Separator className="bg-campus-gray-200" />

          {/* Settings Reset */}
          <div>
            <h5 className="text-campus-gray-800 mb-3">Reset Settings</h5>
            <p className="text-campus-gray-600 mb-4">Reset all settings to their default values. This action cannot be undone.</p>
            <Button
              onClick={handleResetSettings}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>

          {/* Account Deletion - Only for regular users */}
          {currentUser.role !== 'admin' && currentUser.role !== 'super-admin' && (
            <>
              <Separator className="bg-campus-gray-200" />
              <div>
                <h5 className="text-red-600 mb-3">Danger Zone</h5>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h6 className="text-red-800">Delete Account</h6>
                      <p className="text-sm text-red-600 mb-3">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );

  // ====================================
  // MAIN RENDER
  // ====================================

  return (
    <div className="min-h-screen bg-campus-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-campus-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="border-campus-gray-300 text-campus-gray-700 hover:bg-campus-gray-50"
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-campus-gray-900 flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-campus-deep-blue" />
                  Settings
                </h1>
                <p className="text-campus-gray-600">Manage your account preferences and privacy settings</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {saveStatus === 'saving' && (
                <div className="flex items-center text-campus-gray-600">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved!
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Error saving
                </div>
              )}
              
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="bg-campus-deep-blue hover:bg-campus-deep-blue/90 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4 border border-campus-gray-200 sticky top-8">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-campus-deep-blue text-white'
                      : 'text-campus-gray-700 hover:bg-campus-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-campus-deep-blue text-white'
                      : 'text-campus-gray-700 hover:bg-campus-gray-100'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'privacy'
                      ? 'bg-campus-deep-blue text-white'
                      : 'text-campus-gray-700 hover:bg-campus-gray-100'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Privacy</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'appearance'
                      ? 'bg-campus-deep-blue text-white'
                      : 'text-campus-gray-700 hover:bg-campus-gray-100'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>Appearance</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'security'
                      ? 'bg-campus-deep-blue text-white'
                      : 'text-campus-gray-700 hover:bg-campus-gray-100'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Security</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('data')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'data'
                      ? 'bg-campus-deep-blue text-white'
                      : 'text-campus-gray-700 hover:bg-campus-gray-100'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Data</span>
                </button>
              </nav>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && renderProfileSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'privacy' && renderPrivacySettings()}
            {activeTab === 'appearance' && renderAppearanceSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'data' && renderDataSettings()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================
// END OF FILE
// ====================================
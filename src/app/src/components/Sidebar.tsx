import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Home, 
  Play, 
  Brain, 
  BarChart3, 
  LogOut, 
  Upload,
  Video
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();

  const studentItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'ai', label: 'Ask AI', icon: Brain },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
  ];

  const lecturerItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload Video', icon: Upload },
    { id: 'videos', label: 'My Videos', icon: Video },
  ];

  const sidebarItems = user?.type === 'student' ? studentItems : lecturerItems;

  return (
    <motion.div 
      className="w-64 bg-white border-r border-futa-gray-200 flex flex-col"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-futa-gray-200">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            {user?.type === 'student' ? (
              <Play className="w-4 h-4 text-primary-foreground" />
            ) : (
              <Video className="w-4 h-4 text-primary-foreground" />
            )}
          </div>
          <div>
            <h1 className="font-semibold text-futa-gray-900">Campus LearnHub</h1>
            <p className="text-xs text-futa-gray-600">
              {user?.type === 'student' ? 'Student Portal' : 'Lecturer Portal'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-futa-gray-600 hover:bg-futa-gray-100'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* User Profile */}
      <motion.div 
        className="p-4 border-t border-futa-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Avatar>
              <AvatarImage src={user?.type === 'student' 
                ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
              } />
              <AvatarFallback>
                {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1">
            <p className="font-medium text-futa-gray-900">{user?.name}</p>
            <p className="text-sm text-futa-gray-600 capitalize">{user?.type}</p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full text-futa-gray-600 hover:text-futa-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
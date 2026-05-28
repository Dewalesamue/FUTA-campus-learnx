import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, GraduationCap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "motion/react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  items: SidebarItem[];
  title: string;
  subtitle: string;
}

export function Sidebar({ activeTab, onTabChange, items, title, subtitle }: SidebarProps) {
  const { user, logout } = useAuth();

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarImage = () => {
    switch (user?.role) {
      case 'admin':
        return "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100";
      case 'lecturer':
        return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100";
      case 'student':
        return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100";
      default:
        return undefined;
    }
  };

  return (
    <motion.div 
      className="w-64 bg-white border-r border-futa-gray-200 flex flex-col min-h-screen"
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
            <GraduationCap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-futa-gray-900">{title}</h1>
            <p className="text-xs text-futa-gray-600">{subtitle}</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item, index) => {
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
              <AvatarImage src={getAvatarImage()} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1">
            <p className="font-medium text-futa-gray-900">{user?.name}</p>
            <p className="text-sm text-futa-gray-600 capitalize">{user?.role}</p>
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
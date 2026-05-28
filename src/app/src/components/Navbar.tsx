import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { motion } from "motion/react";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <motion.nav 
      className="bg-white border-b border-futa-gray-200 px-6 py-4"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-futa-gray-900">Campus LearnHub</h1>
            <p className="text-xs text-futa-gray-600">FUTA Learning Platform</p>
          </div>
        </motion.div>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.type === 'student' 
                  ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                  : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                } />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-futa-gray-900">{user.name}</p>
                <p className="text-sm text-futa-gray-600 capitalize">{user.type}</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-futa-gray-600 hover:text-futa-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
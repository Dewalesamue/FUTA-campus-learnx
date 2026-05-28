import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';
import { motion } from 'motion/react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: User['role'][];
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, allowedRoles, fallback }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return fallback || (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-futa-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-futa-gray-900 mb-2">Access Denied</h2>
          <p className="text-futa-gray-600">Please log in to access this page.</p>
        </div>
      </motion.div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return fallback || (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-futa-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-futa-gray-900 mb-2">Access Denied</h2>
          <p className="text-futa-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-futa-gray-500 mt-2">Required role: {allowedRoles.join(', ')}</p>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}
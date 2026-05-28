import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: User['role']) => Promise<void>;
  register: (email: string, password: string, name: string, role: User['role'], studentId?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('campus-learnhub-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('campus-learnhub-user');
      }
    }
  }, []);

  const login = async (email: string, password: string, role: User['role']) => {
    setLoading(true);
    try {
      // Mock login - in real app, this would call your API
      let mockUser: User;
      
      if (role === 'admin') {
        mockUser = {
          id: 'admin-1',
          name: 'System Administrator',
          email,
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-01',
          lastLogin: new Date().toISOString()
        };
      } else if (role === 'lecturer') {
        mockUser = {
          id: 'lecturer-1',
          name: 'Dr. Johnson',
          email,
          role: 'lecturer',
          status: 'active',
          createdAt: '2024-01-01',
          lastLogin: new Date().toISOString()
        };
      } else {
        mockUser = {
          id: 'student-1',
          name: 'John Student',
          email,
          role: 'student',
          studentId: 'iFT/23/4098',
          status: 'active',
          createdAt: '2024-01-01',
          lastLogin: new Date().toISOString()
        };
      }
      
      setUser(mockUser);
      localStorage.setItem('campus-learnhub-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: User['role'], studentId?: string) => {
    setLoading(true);
    try {
      // Mock registration - in real app, this would call your API
      const mockUser: User = {
        id: Math.random().toString(),
        name,
        email,
        role,
        studentId: role === 'student' ? studentId : undefined,
        status: role === 'admin' ? 'active' : 'pending', // Admin accounts are auto-approved
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('campus-learnhub-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campus-learnhub-user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('campus-learnhub-user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
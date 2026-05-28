import { User } from '../types';

class AuthService {
  async authenticateUser(email: string, password: string, role: User['role']): Promise<User> {
    // Mock authentication - replace with actual Firebase auth
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
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
          
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  async registerUser(userData: Partial<User>): Promise<User> {
    // Mock registration - replace with actual Firebase auth
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Math.random().toString(),
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'student',
          studentId: userData.studentId,
          status: userData.role === 'admin' ? 'active' : 'pending',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        resolve(newUser);
      }, 1000);
    });
  }

  validateStudentId(studentId: string): boolean {
    const pattern = /^[a-zA-Z]{3}\/\d{2}\/\d{4}$/;
    return pattern.test(studentId);
  }

  validatePassword(password: string) {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      hasMinLength,
      hasUppercase,
      hasNumber,
      isStrong: hasMinLength && hasUppercase && hasNumber
    };
  }

  checkUserPermissions(user: User, requiredRole: User['role']): boolean {
    if (user.role === 'admin') return true; // Admin has access to everything
    return user.role === requiredRole;
  }
}

export const authService = new AuthService();
import { User } from '../context/AuthContext';

export interface LoginCredentials {
  email: string;
  password: string;
  userType: 'student' | 'lecturer';
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  userType: 'student' | 'lecturer';
  studentId?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    // Mock API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: Math.random().toString(),
          name: credentials.userType === 'student' ? 'John Student' : 'Dr. Johnson',
          email: credentials.email,
          type: credentials.userType,
          studentId: credentials.userType === 'student' ? 'iFT/23/4098' : undefined
        };
        resolve(mockUser);
      }, 1000);
    });
  }

  async register(data: RegisterData): Promise<User> {
    // Mock API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: Math.random().toString(),
          name: data.name,
          email: data.email,
          type: data.userType,
          studentId: data.userType === 'student' ? data.studentId : undefined
        };
        resolve(mockUser);
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    // Mock API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
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
}

export const authService = new AuthService();
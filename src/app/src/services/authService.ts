import { User } from '../context/AuthContext';
import type { PDFMaterial } from '../types';

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

  // ===========================
  // PDF ACCESS CONTROL METHODS
  // ===========================

  /**
   * Check if user can upload PDF materials
   * @param user - Current user
   * @returns True if user is a lecturer, false otherwise
   */
  canUploadPDF(user: User | null): boolean {
    if (!user) return false;
    return user.type === 'lecturer';
  }

  /**
   * Check if user can delete a PDF material
   * @param user - Current user
   * @param material - PDF material to delete
   * @returns True if user is lecturer AND owns the material, false otherwise
   */
  canDeletePDF(user: User | null, material: PDFMaterial): boolean {
    if (!user) return false;
    if (user.type !== 'lecturer') return false;
    return user.id === material.lecturerId;
  }

  /**
   * Check if user can download a PDF material
   * @param user - Current user
   * @param material - PDF material to download
   * @param enrolledCourses - Array of course IDs user is enrolled in (for students)
   * @returns True if user has permission, false otherwise
   */
  canDownloadPDF(
    user: User | null,
    material: PDFMaterial,
    enrolledCourses: string[] = []
  ): boolean {
    if (!user) return false;

    // Lecturers can download any material
    if (user.type === 'lecturer') return true;

    // Students can only download materials from enrolled courses
    if (user.type === 'student') {
      return enrolledCourses.includes(material.courseId);
    }

    return false;
  }

  /**
   * Get authorization error message for failed permission check
   * @param operation - The operation that was attempted
   * @returns User-friendly error message
   */
  getAuthorizationError(operation: 'upload' | 'delete' | 'download'): string {
    switch (operation) {
      case 'upload':
        return 'This action is only available to lecturers.';
      case 'delete':
        return 'You can only delete materials you have uploaded.';
      case 'download':
        return 'You cannot download this material because you are not enrolled in the associated course.';
      default:
        return 'You do not have permission to perform this action.';
    }
  }
}

export const authService = new AuthService();
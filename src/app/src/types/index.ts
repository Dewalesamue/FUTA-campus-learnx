export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  studentId?: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

export interface Video {
  id: string;
  title: string;
  lecturer: string;
  lecturerId: string;
  subject: string;
  duration: string;
  progress: number;
  rating: number;
  thumbnail: string;
  isCompleted: boolean;
  description?: string;
  uploadDate: string;
  views: number;
  students: number;
  status: 'published' | 'draft' | 'pending' | 'rejected';
  approvedBy?: string;
}

export interface AdminStats {
  totalStudents: number;
  totalLecturers: number;
  totalVideos: number;
  pendingApprovals: number;
  activeUsers: number;
  suspendedUsers: number;
}
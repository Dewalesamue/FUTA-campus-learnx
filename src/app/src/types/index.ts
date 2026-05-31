export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  studentId?: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin?: string;
  enrolledCourses?: string[]; // Array of course IDs for students
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

// ===========================
// PDF Reading Materials Types
// ===========================

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  lecturerId: string;
  lecturerName: string;
  enrolledStudents: string[]; // Array of student IDs
  createdAt: string;
  status: 'active' | 'archived';
}

export interface PDFMaterial {
  id: string;                    // Unique identifier
  title: string;                 // Material title
  description: string;           // Material description
  courseId: string;              // Associated course ID
  courseName: string;            // Associated course name (denormalized)
  lecturerId: string;            // Uploader's user ID
  lecturerName: string;          // Uploader's name (denormalized)
  fileName: string;              // Original file name
  fileSize: number;              // File size in bytes
  fileUrl: string;               // Firebase Storage download URL
  storagePath: string;           // Firebase Storage path
  uploadDate: string;            // ISO 8601 timestamp
  downloadCount: number;         // Number of downloads
  status: 'active' | 'deleted';  // Material status
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}

export interface PDFUploadProgress {
  loaded: number;                // Bytes uploaded
  total: number;                 // Total bytes
  percentage: number;            // Upload percentage (0-100)
  speed: number;                 // Upload speed in bytes/second
  estimatedTimeRemaining: number; // Seconds remaining
}

export interface PDFMaterialMetadata {
  title: string;
  description: string;
  courseId: string;
  courseName: string;
}

export interface PDFValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PDFAnalytics {
  totalMaterials: number;
  totalDownloads: number;
  mostDownloadedMaterial: {
    title: string;
    downloadCount: number;
  } | null;
  mostRecentMaterial: {
    title: string;
    uploadDate: string;
  } | null;
}

import { User, Video, AdminStats } from '../types';

class AdminService {
  // Mock data - in real app, this would come from API
  private mockUsers: User[] = [
    {
      id: '1',
      name: 'John Student',
      email: 'john@student.futa.edu.ng',
      role: 'student',
      studentId: 'iFT/23/4098',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20'
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@student.futa.edu.ng',
      role: 'student',
      studentId: 'ENG/23/2045',
      status: 'suspended',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-18'
    },
    {
      id: '3',
      name: 'Dr. Adebayo Johnson',
      email: 'adebayo@lecturer.futa.edu.ng',
      role: 'lecturer',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-21'
    },
    {
      id: '4',
      name: 'Prof. Sarah Okafor',
      email: 'sarah@lecturer.futa.edu.ng',
      role: 'lecturer',
      status: 'active',
      createdAt: '2024-01-05',
      lastLogin: '2024-01-19'
    },
    {
      id: '5',
      name: 'Michael Peters',
      email: 'michael@student.futa.edu.ng',
      role: 'student',
      studentId: 'CSC/23/1567',
      status: 'pending',
      createdAt: '2024-01-22',
    }
  ];

  private mockVideos: Video[] = [
    {
      id: '1',
      title: 'Introduction to Data Structures',
      lecturer: 'Dr. Adebayo Johnson',
      lecturerId: '3',
      subject: 'Computer Science',
      duration: '45 min',
      progress: 0,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      isCompleted: false,
      description: 'Basic concepts of arrays, linked lists, and their applications.',
      uploadDate: '2024-01-15',
      views: 245,
      students: 89,
      status: 'published',
      approvedBy: 'admin-1'
    },
    {
      id: '2',
      title: 'Advanced Calculus: Integration',
      lecturer: 'Prof. Sarah Okafor',
      lecturerId: '4',
      subject: 'Mathematics',
      duration: '60 min',
      progress: 0,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400',
      isCompleted: false,
      description: 'Deep dive into integration techniques and applications.',
      uploadDate: '2024-01-20',
      views: 156,
      students: 67,
      status: 'published',
      approvedBy: 'admin-1'
    },
    {
      id: '3',
      title: 'Organic Chemistry Fundamentals',
      lecturer: 'Dr. Michael Ogbonna',
      lecturerId: 'lecturer-2',
      subject: 'Chemistry',
      duration: '55 min',
      progress: 0,
      rating: 0,
      thumbnail: 'https://images.unsplash.com/photo-1532634926-8b875965f5c5?w=400',
      isCompleted: false,
      description: 'Introduction to organic chemistry principles.',
      uploadDate: '2024-01-22',
      views: 0,
      students: 0,
      status: 'pending'
    }
  ];

  async getAllUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.mockUsers]), 500);
    });
  }

  async getUsersByRole(role: User['role']): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredUsers = this.mockUsers.filter(user => user.role === role);
        resolve(filteredUsers);
      }, 500);
    });
  }

  async updateUserStatus(userId: string, status: User['status']): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.mockUsers.findIndex(user => user.id === userId);
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }
        
        this.mockUsers[userIndex].status = status;
        resolve(this.mockUsers[userIndex]);
      }, 500);
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.mockUsers.findIndex(user => user.id === userId);
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }
        
        this.mockUsers.splice(userIndex, 1);
        resolve();
      }, 500);
    });
  }

  async getAllVideos(): Promise<Video[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.mockVideos]), 500);
    });
  }

  async getPendingVideos(): Promise<Video[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pendingVideos = this.mockVideos.filter(video => video.status === 'pending');
        resolve(pendingVideos);
      }, 500);
    });
  }

  async approveVideo(videoId: string, adminId: string): Promise<Video> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const videoIndex = this.mockVideos.findIndex(video => video.id === videoId);
        if (videoIndex === -1) {
          reject(new Error('Video not found'));
          return;
        }
        
        this.mockVideos[videoIndex].status = 'published';
        this.mockVideos[videoIndex].approvedBy = adminId;
        resolve(this.mockVideos[videoIndex]);
      }, 500);
    });
  }

  async rejectVideo(videoId: string): Promise<Video> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const videoIndex = this.mockVideos.findIndex(video => video.id === videoId);
        if (videoIndex === -1) {
          reject(new Error('Video not found'));
          return;
        }
        
        this.mockVideos[videoIndex].status = 'rejected';
        resolve(this.mockVideos[videoIndex]);
      }, 500);
    });
  }

  async deleteVideo(videoId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const videoIndex = this.mockVideos.findIndex(video => video.id === videoId);
        if (videoIndex === -1) {
          reject(new Error('Video not found'));
          return;
        }
        
        this.mockVideos.splice(videoIndex, 1);
        resolve();
      }, 500);
    });
  }

  async getAdminStats(): Promise<AdminStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats: AdminStats = {
          totalStudents: this.mockUsers.filter(u => u.role === 'student').length,
          totalLecturers: this.mockUsers.filter(u => u.role === 'lecturer').length,
          totalVideos: this.mockVideos.length,
          pendingApprovals: this.mockVideos.filter(v => v.status === 'pending').length + 
                           this.mockUsers.filter(u => u.status === 'pending').length,
          activeUsers: this.mockUsers.filter(u => u.status === 'active').length,
          suspendedUsers: this.mockUsers.filter(u => u.status === 'suspended').length
        };
        resolve(stats);
      }, 500);
    });
  }

  async searchUsers(query: string): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredUsers = this.mockUsers.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          (user.studentId && user.studentId.toLowerCase().includes(query.toLowerCase()))
        );
        resolve(filteredUsers);
      }, 300);
    });
  }

  async searchVideos(query: string): Promise<Video[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredVideos = this.mockVideos.filter(video => 
          video.title.toLowerCase().includes(query.toLowerCase()) ||
          video.lecturer.toLowerCase().includes(query.toLowerCase()) ||
          video.subject.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filteredVideos);
      }, 300);
    });
  }
}

export const adminService = new AdminService();
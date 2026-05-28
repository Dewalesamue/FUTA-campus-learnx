export interface Video {
  id: string;
  title: string;
  lecturer: string;
  subject: string;
  duration: string;
  progress: number;
  rating: number;
  thumbnail: string;
  isCompleted: boolean;
  description?: string;
  uploadDate?: string;
  views?: number;
  students?: number;
  status?: 'published' | 'draft';
}

class CourseService {
  async getStudentVideos(): Promise<Video[]> {
    // Mock API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockVideos: Video[] = [
          {
            id: '1',
            title: 'Introduction to Data Structures',
            lecturer: 'Dr. Adebayo Johnson',
            subject: 'Computer Science',
            duration: '45 min',
            progress: 75,
            rating: 4.8,
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
            isCompleted: false
          },
          {
            id: '2',
            title: 'Advanced Calculus: Integration',
            lecturer: 'Prof. Sarah Okafor',
            subject: 'Mathematics',
            duration: '60 min',
            progress: 100,
            rating: 4.9,
            thumbnail: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400',
            isCompleted: true
          },
          {
            id: '3',
            title: 'Organic Chemistry Fundamentals',
            lecturer: 'Dr. Michael Ogbonna',
            subject: 'Chemistry',
            duration: '55 min',
            progress: 30,
            rating: 4.7,
            thumbnail: 'https://images.unsplash.com/photo-1532634926-8b875965f5c5?w=400',
            isCompleted: false
          },
          {
            id: '4',
            title: 'Nigerian Economic History',
            lecturer: 'Prof. Fatima Aliyu',
            subject: 'Economics',
            duration: '40 min',
            progress: 0,
            rating: 4.6,
            thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
            isCompleted: false
          }
        ];
        resolve(mockVideos);
      }, 500);
    });
  }

  async getLecturerVideos(): Promise<Video[]> {
    // Mock API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockVideos: Video[] = [
          {
            id: '1',
            title: 'Introduction to Data Structures',
            lecturer: 'Dr. Adebayo Johnson',
            subject: 'Computer Science',
            duration: '45 min',
            progress: 0,
            rating: 4.8,
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
            isCompleted: false,
            description: 'Basic concepts of arrays, linked lists, and their applications in programming.',
            uploadDate: '2024-01-15',
            views: 245,
            students: 89,
            status: 'published'
          },
          {
            id: '2',
            title: 'Advanced Algorithms Analysis',
            lecturer: 'Dr. Adebayo Johnson',
            subject: 'Computer Science',
            duration: '60 min',
            progress: 0,
            rating: 4.9,
            thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
            isCompleted: false,
            description: 'Deep dive into algorithm complexity and optimization techniques.',
            uploadDate: '2024-01-20',
            views: 156,
            students: 67,
            status: 'published'
          },
          {
            id: '3',
            title: 'Database Design Patterns',
            lecturer: 'Dr. Adebayo Johnson',
            subject: 'Computer Science',
            duration: '50 min',
            progress: 0,
            rating: 4.7,
            thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
            isCompleted: false,
            description: 'Learn about normalization, indexing, and query optimization.',
            uploadDate: '2024-01-25',
            views: 0,
            students: 0,
            status: 'draft'
          }
        ];
        resolve(mockVideos);
      }, 500);
    });
  }

  async uploadVideo(videoData: Partial<Video>): Promise<Video> {
    // Mock API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        const newVideo: Video = {
          id: Math.random().toString(),
          title: videoData.title || '',
          lecturer: 'Dr. Johnson',
          subject: videoData.subject || '',
          duration: '45 min',
          progress: 0,
          rating: 0,
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
          isCompleted: false,
          description: videoData.description,
          uploadDate: new Date().toISOString().split('T')[0],
          views: 0,
          students: 0,
          status: 'draft'
        };
        resolve(newVideo);
      }, 1500);
    });
  }
}

export const courseService = new CourseService();
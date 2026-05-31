import type {
  PDFMaterial,
  PDFMaterialMetadata,
  PDFUploadProgress,
  PDFAnalytics,
} from '../types';

/**
 * PDFMaterialService - Manages PDF reading materials
 * 
 * Provides methods to:
 * - Upload PDF files with metadata
 * - Query materials for lecturers and students
 * - Update and delete materials
 * - Download materials
 * - Search, filter, and sort materials
 * - Get analytics for lecturers
 */
class PDFMaterialService {
  /**
   * Upload a PDF file with metadata
   * @param file - PDF file to upload
   * @param metadata - Material metadata
   * @param onProgress - Progress callback
   * @param abortSignal - Abort signal for cancellation
   * @returns Promise resolving to created material
   */
  async uploadMaterial(
    file: File,
    metadata: PDFMaterialMetadata,
    onProgress: (progress: PDFUploadProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<PDFMaterial> {
    // TODO: Replace with actual Firebase Storage upload
    // For now, simulate upload with progress tracking
    
    return new Promise((resolve, reject) => {
      const materialId = `material-${Date.now()}`;
      const uploadStartTime = Date.now();
      let uploadedBytes = 0;
      const totalBytes = file.size;

      // Check if upload was aborted
      if (abortSignal?.aborted) {
        reject(new Error('Upload cancelled'));
        return;
      }

      // Listen for abort signal
      const abortHandler = () => {
        clearInterval(progressInterval);
        reject(new Error('Upload cancelled'));
      };
      abortSignal?.addEventListener('abort', abortHandler);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        uploadedBytes += totalBytes / 20; // Simulate 5% progress per interval
        
        if (uploadedBytes >= totalBytes) {
          uploadedBytes = totalBytes;
          clearInterval(progressInterval);
          abortSignal?.removeEventListener('abort', abortHandler);

          // Create material object
          const now = new Date().toISOString();
          const material: PDFMaterial = {
            id: materialId,
            title: metadata.title,
            description: metadata.description,
            courseId: metadata.courseId,
            courseName: metadata.courseName,
            lecturerId: 'current-lecturer-id', // TODO: Get from auth context
            lecturerName: 'Current Lecturer', // TODO: Get from auth context
            fileName: file.name,
            fileSize: file.size,
            fileUrl: `https://mock-storage.com/${materialId}/${file.name}`,
            storagePath: `/pdf-materials/current-lecturer-id/${materialId}/${file.name}`,
            uploadDate: now,
            downloadCount: 0,
            status: 'active',
            createdAt: now,
            updatedAt: now,
          };

          // TODO: Store in Firestore
          resolve(material);
        } else {
          // Calculate progress metrics
          const elapsedTime = (Date.now() - uploadStartTime) / 1000; // seconds
          const speed = uploadedBytes / elapsedTime; // bytes per second
          const remainingBytes = totalBytes - uploadedBytes;
          const estimatedTimeRemaining = remainingBytes / speed;

          const progress: PDFUploadProgress = {
            loaded: uploadedBytes,
            total: totalBytes,
            percentage: Math.round((uploadedBytes / totalBytes) * 100),
            speed,
            estimatedTimeRemaining,
          };

          onProgress(progress);
        }
      }, 200); // Update every 200ms
    });
  }

  /**
   * Get materials for a lecturer
   * @param lecturerId - Lecturer's user ID
   * @returns Promise resolving to array of materials
   */
  async getLecturerMaterials(lecturerId: string): Promise<PDFMaterial[]> {
    // TODO: Replace with actual Firestore query
    // Query: pdfMaterials collection where lecturerId == lecturerId AND status == 'active'
    
    // Mock data for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  }

  /**
   * Get materials available to a student
   * @param studentId - Student's user ID
   * @param enrolledCourseIds - Array of course IDs student is enrolled in
   * @returns Promise resolving to array of materials
   */
  async getStudentMaterials(
    studentId: string,
    enrolledCourseIds: string[]
  ): Promise<PDFMaterial[]> {
    // TODO: Replace with actual Firestore query
    // Query: pdfMaterials collection where courseId IN enrolledCourseIds AND status == 'active'
    
    // Mock data for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  }

  /**
   * Update material metadata
   * @param materialId - Material ID
   * @param metadata - Updated metadata
   * @returns Promise resolving to updated material
   */
  async updateMaterial(
    materialId: string,
    metadata: Partial<PDFMaterialMetadata>
  ): Promise<PDFMaterial> {
    // TODO: Replace with actual Firestore update
    // Update document in pdfMaterials collection
    
    throw new Error('Not implemented');
  }

  /**
   * Delete a material
   * @param materialId - Material ID
   * @returns Promise resolving when deletion completes
   */
  async deleteMaterial(materialId: string): Promise<void> {
    // TODO: Replace with actual Firebase Storage and Firestore deletion
    // 1. Delete file from Storage
    // 2. Update Firestore document status to 'deleted' (soft delete)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  /**
   * Download a material
   * @param materialId - Material ID
   * @returns Promise resolving to download URL
   */
  async downloadMaterial(materialId: string): Promise<string> {
    // TODO: Replace with actual Firebase Storage download URL
    // Get download URL from Storage
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://mock-storage.com/download/${materialId}`);
      }, 300);
    });
  }

  /**
   * Increment download count
   * @param materialId - Material ID
   * @returns Promise resolving when count is updated
   */
  async incrementDownloadCount(materialId: string): Promise<void> {
    // TODO: Replace with actual Firestore update
    // Increment downloadCount field in Firestore document
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  }

  /**
   * Get analytics for a lecturer
   * @param lecturerId - Lecturer's user ID
   * @returns Promise resolving to analytics data
   */
  async getLecturerAnalytics(lecturerId: string): Promise<PDFAnalytics> {
    // TODO: Replace with actual Firestore queries
    // Query all materials for lecturer and calculate analytics
    
    const materials = await this.getLecturerMaterials(lecturerId);
    
    if (materials.length === 0) {
      return {
        totalMaterials: 0,
        totalDownloads: 0,
        mostDownloadedMaterial: null,
        mostRecentMaterial: null,
      };
    }

    const totalDownloads = materials.reduce((sum, m) => sum + m.downloadCount, 0);
    
    const mostDownloaded = materials.reduce((max, m) => 
      m.downloadCount > max.downloadCount ? m : max
    );
    
    const mostRecent = materials.reduce((latest, m) => 
      new Date(m.uploadDate) > new Date(latest.uploadDate) ? m : latest
    );

    return {
      totalMaterials: materials.length,
      totalDownloads,
      mostDownloadedMaterial: {
        title: mostDownloaded.title,
        downloadCount: mostDownloaded.downloadCount,
      },
      mostRecentMaterial: {
        title: mostRecent.title,
        uploadDate: mostRecent.uploadDate,
      },
    };
  }

  /**
   * Search materials by title or description
   * @param materials - Array of materials to search
   * @param searchTerm - Search term
   * @returns Filtered array of materials
   */
  searchMaterials(materials: PDFMaterial[], searchTerm: string): PDFMaterial[] {
    if (!searchTerm.trim()) {
      return materials;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return materials.filter(material => 
      material.title.toLowerCase().includes(lowerSearchTerm) ||
      material.description.toLowerCase().includes(lowerSearchTerm)
    );
  }

  /**
   * Filter materials by course
   * @param materials - Array of materials to filter
   * @param courseId - Course ID
   * @returns Filtered array of materials
   */
  filterByCourse(materials: PDFMaterial[], courseId: string): PDFMaterial[] {
    if (!courseId) {
      return materials;
    }

    return materials.filter(material => material.courseId === courseId);
  }

  /**
   * Sort materials
   * @param materials - Array of materials to sort
   * @param sortBy - Sort criteria
   * @param order - Sort order
   * @returns Sorted array of materials
   */
  sortMaterials(
    materials: PDFMaterial[],
    sortBy: 'uploadDate' | 'title' | 'courseName' | 'downloadCount',
    order: 'asc' | 'desc'
  ): PDFMaterial[] {
    const sorted = [...materials].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'uploadDate':
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'courseName':
          comparison = a.courseName.localeCompare(b.courseName);
          break;
        case 'downloadCount':
          comparison = a.downloadCount - b.downloadCount;
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }
}

// Export singleton instance
export const pdfMaterialService = new PDFMaterialService();
export default pdfMaterialService;

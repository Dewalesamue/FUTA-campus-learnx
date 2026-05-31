import type {
  PDFMaterial,
  PDFMaterialMetadata,
  PDFUploadProgress,
  PDFAnalytics,
} from '../types';
import { supabase } from './supabase';

/**
 * PDFMaterialService - Manages PDF reading materials using Supabase
 * 
 * Provides methods to:
 * - Upload PDF files with metadata to Supabase Storage
 * - Query materials from Supabase Database
 * - Update and delete materials
 * - Download materials
 * - Search, filter, and sort materials
 * - Get analytics for lecturers
 */
class PDFMaterialService {
  private readonly STORAGE_BUCKET = 'pdf-materials';
  private readonly TABLE_NAME = 'pdf_materials';

  /**
   * Upload a PDF file with metadata to Supabase Storage
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
    try {
      // Check if upload was aborted
      if (abortSignal?.aborted) {
        throw new Error('Upload cancelled');
      }

      // Get current user (lecturer)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Generate unique file path
      const materialId = crypto.randomUUID();
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${materialId}/${file.name}`;

      // Simulate progress for now (Supabase doesn't provide native upload progress)
      const uploadStartTime = Date.now();
      let uploadedBytes = 0;
      const totalBytes = file.size;

      const progressInterval = setInterval(() => {
        if (abortSignal?.aborted) {
          clearInterval(progressInterval);
          return;
        }

        uploadedBytes = Math.min(uploadedBytes + totalBytes / 20, totalBytes);
        const elapsedTime = (Date.now() - uploadStartTime) / 1000;
        const speed = uploadedBytes / elapsedTime;
        const remainingBytes = totalBytes - uploadedBytes;
        const estimatedTimeRemaining = remainingBytes / speed;

        onProgress({
          loaded: uploadedBytes,
          total: totalBytes,
          percentage: Math.round((uploadedBytes / totalBytes) * 100),
          speed,
          estimatedTimeRemaining,
        });

        if (uploadedBytes >= totalBytes) {
          clearInterval(progressInterval);
        }
      }, 200);

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      // Create material record in database
      const now = new Date().toISOString();
      const material: Omit<PDFMaterial, 'id'> = {
        title: metadata.title,
        description: metadata.description,
        courseId: metadata.courseId,
        courseName: metadata.courseName,
        lecturerId: user.id,
        lecturerName: user.user_metadata?.name || user.email || 'Unknown',
        fileName: file.name,
        fileSize: file.size,
        fileUrl: publicUrl,
        storagePath: filePath,
        uploadDate: now,
        downloadCount: 0,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };

      const { data: insertedMaterial, error: insertError } = await supabase
        .from(this.TABLE_NAME)
        .insert(material)
        .select()
        .single();

      if (insertError) {
        // Cleanup: delete uploaded file if database insert fails
        await supabase.storage.from(this.STORAGE_BUCKET).remove([filePath]);
        throw new Error(`Failed to save material: ${insertError.message}`);
      }

      return insertedMaterial as PDFMaterial;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Upload failed');
    }
  }

  /**
   * Get materials for a lecturer from Supabase
   * @param lecturerId - Lecturer's user ID
   * @returns Promise resolving to array of materials
   */
  async getLecturerMaterials(lecturerId: string): Promise<PDFMaterial[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('lecturerId', lecturerId)
      .eq('status', 'active')
      .order('uploadDate', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch materials: ${error.message}`);
    }

    return data as PDFMaterial[];
  }

  /**
   * Get materials available to a student from Supabase
   * @param studentId - Student's user ID
   * @param enrolledCourseIds - Array of course IDs student is enrolled in
   * @returns Promise resolving to array of materials
   */
  async getStudentMaterials(
    studentId: string,
    enrolledCourseIds: string[]
  ): Promise<PDFMaterial[]> {
    if (enrolledCourseIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .in('courseId', enrolledCourseIds)
      .eq('status', 'active')
      .order('uploadDate', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch materials: ${error.message}`);
    }

    return data as PDFMaterial[];
  }

  /**
   * Update material metadata in Supabase
   * @param materialId - Material ID
   * @param metadata - Updated metadata
   * @returns Promise resolving to updated material
   */
  async updateMaterial(
    materialId: string,
    metadata: Partial<PDFMaterialMetadata>
  ): Promise<PDFMaterial> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        ...metadata,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', materialId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update material: ${error.message}`);
    }

    return data as PDFMaterial;
  }

  /**
   * Delete a material from Supabase (soft delete)
   * @param materialId - Material ID
   * @returns Promise resolving when deletion completes
   */
  async deleteMaterial(materialId: string): Promise<void> {
    // Soft delete: update status to 'deleted'
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        status: 'deleted',
        updatedAt: new Date().toISOString(),
      })
      .eq('id', materialId);

    if (error) {
      throw new Error(`Failed to delete material: ${error.message}`);
    }

    // Note: We keep the file in storage for potential recovery
    // To hard delete, uncomment the following:
    // const { data: material } = await supabase
    //   .from(this.TABLE_NAME)
    //   .select('storagePath')
    //   .eq('id', materialId)
    //   .single();
    // if (material) {
    //   await supabase.storage.from(this.STORAGE_BUCKET).remove([material.storagePath]);
    // }
  }

  /**
   * Download a material (get download URL)
   * @param materialId - Material ID
   * @returns Promise resolving to download URL
   */
  async downloadMaterial(materialId: string): Promise<string> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('fileUrl')
      .eq('id', materialId)
      .single();

    if (error) {
      throw new Error(`Failed to get download URL: ${error.message}`);
    }

    return data.fileUrl;
  }

  /**
   * Increment download count in Supabase
   * @param materialId - Material ID
   * @returns Promise resolving when count is updated
   */
  async incrementDownloadCount(materialId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_download_count', {
      material_id: materialId,
    });

    if (error) {
      // Fallback: manual increment if RPC function doesn't exist
      const { data: material } = await supabase
        .from(this.TABLE_NAME)
        .select('downloadCount')
        .eq('id', materialId)
        .single();

      if (material) {
        await supabase
          .from(this.TABLE_NAME)
          .update({ downloadCount: material.downloadCount + 1 })
          .eq('id', materialId);
      }
    }
  }

  /**
   * Get analytics for a lecturer from Supabase
   * @param lecturerId - Lecturer's user ID
   * @returns Promise resolving to analytics data
   */
  async getLecturerAnalytics(lecturerId: string): Promise<PDFAnalytics> {
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

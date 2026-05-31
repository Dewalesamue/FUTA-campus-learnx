import type { PDFValidationResult } from '../types';

/**
 * FileValidationService - Validates PDF files before upload
 * 
 * Provides methods to:
 * - Validate PDF file type and size
 * - Check file format (MIME type)
 * - Verify file size limits
 * - Format file sizes for display
 */
class FileValidationService {
  private static readonly MAX_FILE_SIZE_MB = 25;
  private static readonly MAX_FILE_SIZE_BYTES = FileValidationService.MAX_FILE_SIZE_MB * 1024 * 1024;
  private static readonly VALID_PDF_MIME_TYPE = 'application/pdf';

  /**
   * Validate a PDF file
   * @param file - File to validate
   * @returns Validation result with isValid flag and optional error message
   */
  validatePDFFile(file: File): PDFValidationResult {
    // Check if file is a PDF
    if (!this.isPDFFile(file)) {
      return {
        isValid: false,
        error: 'Please select a valid PDF file. Only PDF documents are supported.',
      };
    }

    // Check if file size is within limit
    if (!this.isWithinSizeLimit(file, FileValidationService.MAX_FILE_SIZE_MB)) {
      return {
        isValid: false,
        error: `File size exceeds the ${FileValidationService.MAX_FILE_SIZE_MB}MB limit. Please select a smaller file.`,
      };
    }

    return {
      isValid: true,
    };
  }

  /**
   * Check if file is PDF format
   * @param file - File to check
   * @returns True if PDF, false otherwise
   */
  isPDFFile(file: File): boolean {
    return file.type === FileValidationService.VALID_PDF_MIME_TYPE;
  }

  /**
   * Check if file size is within limit
   * @param file - File to check
   * @param maxSizeMB - Maximum size in megabytes
   * @returns True if within limit, false otherwise
   */
  isWithinSizeLimit(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Format file size for display
   * @param bytes - File size in bytes
   * @returns Formatted string (e.g., "2.5 MB")
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, i);

    // Format with 1 decimal place for MB and GB, no decimals for Bytes and KB
    const decimals = i >= 2 ? 1 : 0;
    
    return `${size.toFixed(decimals)} ${sizes[i]}`;
  }
}

// Export singleton instance
export const fileValidationService = new FileValidationService();
export default fileValidationService;

import { useState, useRef } from 'react';
import type { PDFMaterial, PDFMaterialMetadata, PDFUploadProgress, Course } from '../types';
import { fileValidationService } from '../services/fileValidationService';
import { pdfMaterialService } from '../services/pdfMaterialService';

// ===========================
// INTERFACES & TYPES
// ===========================

interface PDFUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (material: PDFMaterial) => void;
  availableCourses: Course[];
}

// ===========================
// MAIN COMPONENT
// ===========================

/**
 * PDFUploadModal - Modal component for uploading PDF reading materials
 * 
 * Features:
 * - File validation (PDF type, 25MB max)
 * - Metadata validation (title, description, course)
 * - Upload progress tracking with speed and ETA
 * - Upload cancellation support
 * - Success/error message display
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback when modal is closed
 * @param onUploadSuccess - Callback when upload succeeds
 * @param availableCourses - Array of courses for dropdown
 */
export function PDFUploadModal({ 
  isOpen, 
  onClose, 
  onUploadSuccess, 
  availableCourses 
}: PDFUploadModalProps) {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    courseId: '',
  });
  
  const [uploadProgress, setUploadProgress] = useState<PDFUploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================

  /**
   * Validate metadata fields
   * @returns True if all fields are valid
   */
  const validateMetadata = (): boolean => {
    const errors = {
      title: '',
      description: '',
      courseId: '',
    };
    
    let isValid = true;

    // Validate title
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
      isValid = false;
    }

    // Validate description
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
      isValid = false;
    }

    // Validate course selection
    if (!formData.courseId) {
      errors.courseId = 'Please select a course';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  /**
   * Format upload speed for display
   * @param bytesPerSecond - Speed in bytes per second
   * @returns Formatted string (e.g., "2.5 MB/s")
   */
  const formatSpeed = (bytesPerSecond: number): string => {
    const mbPerSecond = bytesPerSecond / (1024 * 1024);
    return `${mbPerSecond.toFixed(2)} MB/s`;
  };

  /**
   * Format time remaining for display
   * @param seconds - Time in seconds
   * @returns Formatted string (e.g., "2m 30s")
   */
  const formatTimeRemaining = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) {
      return 'Calculating...';
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setSelectedFile(null);
    setFileError(null);
    setFormData({
      title: '',
      description: '',
      courseId: '',
    });
    setFormErrors({
      title: '',
      description: '',
      courseId: '',
    });
    setUploadProgress(null);
    setIsUploading(false);
    setUploadError(null);
    setUploadSuccess(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ===========================
  // EVENT HANDLERS
  // ===========================

  /**
   * Handle file selection
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Validate file
    const validationResult = fileValidationService.validatePDFFile(file);
    
    if (!validationResult.isValid) {
      setFileError(validationResult.error || 'Invalid file');
      setSelectedFile(null);
      return;
    }

    // File is valid
    setSelectedFile(file);
    setFileError(null);
    setUploadError(null);
    setUploadSuccess(false);
  };

  /**
   * Handle form field changes
   */
  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    setFormErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  /**
   * Handle upload cancellation
   */
  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setIsUploading(false);
    setUploadProgress(null);
    setUploadError('Upload cancelled');
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate file selection
    if (!selectedFile) {
      setFileError('Please select a PDF file');
      return;
    }

    // Validate metadata
    if (!validateMetadata()) {
      return;
    }

    // Get selected course name
    const selectedCourse = availableCourses.find(
      course => course.id === formData.courseId
    );
    
    if (!selectedCourse) {
      setFormErrors(prev => ({
        ...prev,
        courseId: 'Invalid course selection',
      }));
      return;
    }

    // Prepare metadata
    const metadata: PDFMaterialMetadata = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      courseId: formData.courseId,
      courseName: selectedCourse.name,
    };

    // Start upload
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      const material = await pdfMaterialService.uploadMaterial(
        selectedFile,
        metadata,
        (progress: PDFUploadProgress) => {
          setUploadProgress(progress);
        },
        abortControllerRef.current.signal
      );

      // Upload successful
      setUploadSuccess(true);
      setIsUploading(false);
      setUploadProgress(null);
      
      // Notify parent component
      onUploadSuccess(material);
      
      // Close modal after short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(null);
      
      if (error instanceof Error) {
        setUploadError(error.message);
      } else {
        setUploadError('Upload failed. Please try again.');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    // Don't allow closing during upload
    if (isUploading) {
      return;
    }
    
    resetForm();
    onClose();
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  // ===========================
  // MAIN RENDER
  // ===========================

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-futa-gray-200">
          <div>
            <h2 className="text-xl text-futa-gray-900">Upload PDF Material</h2>
            <p className="text-sm text-futa-gray-600 mt-1">
              Share reading materials with your students
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-futa-gray-400 hover:text-futa-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Section */}
          <div>
            <label className="block text-sm text-futa-gray-700 mb-2">
              PDF File *
            </label>
            <div className="border-2 border-dashed border-futa-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="pdf-file-input"
              />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-futa-gray-900 font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-futa-gray-500">
                      {fileValidationService.formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-primary hover:text-primary/90"
                    >
                      Change File
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-futa-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <label
                      htmlFor="pdf-file-input"
                      className="text-primary hover:text-primary/90 cursor-pointer"
                    >
                      Click to upload
                    </label>
                    <p className="text-sm text-futa-gray-500 mt-1">
                      PDF files only, max 25MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            {fileError && (
              <p className="text-sm text-red-600 mt-2">{fileError}</p>
            )}
          </div>

          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm text-futa-gray-700 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              disabled={isUploading}
              placeholder="Enter material title"
              className="w-full px-4 py-2 border border-futa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-futa-gray-100 disabled:cursor-not-allowed"
            />
            {formErrors.title && (
              <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm text-futa-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              disabled={isUploading}
              placeholder="Enter material description"
              rows={4}
              className="w-full px-4 py-2 border border-futa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-futa-gray-100 disabled:cursor-not-allowed resize-none"
            />
            {formErrors.description && (
              <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
            )}
          </div>

          {/* Course Selection */}
          <div>
            <label htmlFor="course" className="block text-sm text-futa-gray-700 mb-2">
              Course *
            </label>
            <select
              id="course"
              value={formData.courseId}
              onChange={(e) => handleFormChange('courseId', e.target.value)}
              disabled={isUploading}
              className="w-full px-4 py-2 border border-futa-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-futa-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a course</option>
              {availableCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
            {formErrors.courseId && (
              <p className="text-sm text-red-600 mt-1">{formErrors.courseId}</p>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="bg-futa-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-futa-gray-700">Uploading...</span>
                <span className="text-futa-gray-900 font-medium">
                  {uploadProgress.percentage}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-futa-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
              
              {/* Upload Stats */}
              <div className="flex items-center justify-between text-xs text-futa-gray-600">
                <span>
                  Speed: {formatSpeed(uploadProgress.speed)}
                </span>
                <span>
                  ETA: {formatTimeRemaining(uploadProgress.estimatedTimeRemaining)}
                </span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-green-800 font-medium">
                  Upload successful!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Your PDF material has been uploaded successfully.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-red-800 font-medium">Upload failed</p>
                <p className="text-sm text-red-700 mt-1">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            {isUploading ? (
              <button
                type="button"
                onClick={handleCancelUpload}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Cancel Upload
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-futa-gray-300 bg-white hover:bg-futa-gray-50 hover:border-futa-gray-400 text-futa-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || uploadSuccess}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload Material
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

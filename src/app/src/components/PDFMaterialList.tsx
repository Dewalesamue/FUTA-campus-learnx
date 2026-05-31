import { Download, Edit, Trash2, FileText, Calendar, User, HardDrive, Eye } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { LoadingSpinner } from './common/LoadingSpinner';
import { fileValidationService } from '../services/fileValidationService';
import type { PDFMaterial } from '../types';

/**
 * PDFMaterialList - Display PDF materials in a responsive grid
 * 
 * Features:
 * - Responsive grid layout (1 column mobile, 2-3 columns desktop)
 * - Role-based UI (student vs lecturer view)
 * - Download, edit, and delete actions
 * - Loading and empty states
 * - Formatted dates and file sizes
 * - Touch-friendly buttons (44px minimum height)
 * 
 * @param materials - Array of PDF materials to display
 * @param userRole - Current user's role ('student' | 'lecturer')
 * @param onDownload - Callback for download action
 * @param onEdit - Callback for edit action (lecturer only)
 * @param onDelete - Callback for delete action (lecturer only)
 * @param isLoading - Loading state flag
 * 
 * @example
 * <PDFMaterialList
 *   materials={materials}
 *   userRole="student"
 *   onDownload={(material) => handleDownload(material)}
 *   onEdit={(material) => handleEdit(material)}
 *   onDelete={(material) => handleDelete(material)}
 *   isLoading={false}
 * />
 */

interface PDFMaterialListProps {
  materials: PDFMaterial[];
  userRole: 'student' | 'lecturer';
  onDownload: (material: PDFMaterial) => void;
  onEdit: (material: PDFMaterial) => void;
  onDelete: (material: PDFMaterial) => void;
  isLoading: boolean;
}

export function PDFMaterialList({
  materials,
  userRole,
  onDownload,
  onEdit,
  onDelete,
  isLoading,
}: PDFMaterialListProps) {
  // ===========================
  // UTILITY FUNCTIONS
  // ===========================

  /**
   * Format date as relative time (e.g., "2 days ago")
   * @param dateString - ISO 8601 date string
   * @returns Formatted relative time string
   */
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now';
    }

    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }

    // Less than a month
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    }

    // Less than a year
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }

    // Years
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  };

  // ===========================
  // EVENT HANDLERS
  // ===========================

  const handleDownloadClick = (material: PDFMaterial) => {
    onDownload(material);
  };

  const handleEditClick = (material: PDFMaterial) => {
    onEdit(material);
  };

  const handleDeleteClick = (material: PDFMaterial) => {
    onDelete(material);
  };

  // ===========================
  // RENDER FUNCTIONS
  // ===========================

  /**
   * Render loading state
   */
  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-16">
      <LoadingSpinner size="lg" message="Loading materials..." />
    </div>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 mb-4 rounded-full bg-futa-gray-100 flex items-center justify-center">
        <FileText className="w-8 h-8 text-futa-gray-400" />
      </div>
      <h3 className="text-lg text-futa-gray-900 mb-2">No materials available</h3>
      <p className="text-sm text-futa-gray-600 text-center max-w-md">
        {userRole === 'lecturer'
          ? 'Upload your first PDF material to get started.'
          : 'No reading materials have been uploaded yet. Check back later.'}
      </p>
    </div>
  );

  /**
   * Render material card
   */
  const renderMaterialCard = (material: PDFMaterial) => (
    <Card
      key={material.id}
      className="hover:shadow-lg transition-shadow duration-200 bg-white border-futa-gray-200"
    >
      <CardContent className="p-6 space-y-4">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-futa-gray-900 line-clamp-2 mb-1">
              {material.title}
            </h3>
            <p className="text-sm text-futa-gray-600 line-clamp-2">
              {material.description}
            </p>
          </div>
        </div>

        {/* Course name */}
        <div className="flex items-center gap-2 text-sm text-futa-gray-700">
          <div className="px-3 py-1 rounded-full bg-futa-gray-100 text-futa-gray-700 font-medium">
            {material.courseName}
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-futa-gray-200">
          {/* Upload date */}
          <div className="flex items-center gap-2 text-sm text-futa-gray-600">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">{formatRelativeTime(material.uploadDate)}</span>
          </div>

          {/* File size */}
          <div className="flex items-center gap-2 text-sm text-futa-gray-600">
            <HardDrive className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {fileValidationService.formatFileSize(material.fileSize)}
            </span>
          </div>

          {/* Lecturer view: Download count */}
          {userRole === 'lecturer' && (
            <div className="flex items-center gap-2 text-sm text-futa-gray-600">
              <Eye className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {material.downloadCount} {material.downloadCount === 1 ? 'download' : 'downloads'}
              </span>
            </div>
          )}

          {/* Student view: Lecturer name */}
          {userRole === 'student' && (
            <div className="flex items-center gap-2 text-sm text-futa-gray-600 col-span-2">
              <User className="w-4 h-4 shrink-0" />
              <span className="truncate">{material.lecturerName}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          {/* Download button - available to all users */}
          <Button
            onClick={() => handleDownloadClick(material)}
            className="flex-1 bg-primary hover:bg-primary/90 text-white transition-all duration-200 min-h-[44px]"
            aria-label={`Download ${material.title}`}
          >
            <Download className="w-4 h-4" />
            Download
          </Button>

          {/* Edit and Delete buttons - lecturer only */}
          {userRole === 'lecturer' && (
            <>
              <Button
                onClick={() => handleEditClick(material)}
                variant="outline"
                className="border-futa-gray-300 bg-white hover:bg-futa-gray-50 hover:border-futa-gray-400 text-futa-gray-700 transition-all duration-200 min-h-[44px]"
                aria-label={`Edit ${material.title}`}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleDeleteClick(material)}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 min-h-[44px]"
                aria-label={`Delete ${material.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // ===========================
  // MAIN RENDER
  // ===========================

  // Show loading state
  if (isLoading) {
    return renderLoadingState();
  }

  // Show empty state
  if (materials.length === 0) {
    return renderEmptyState();
  }

  // Show materials grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => renderMaterialCard(material))}
    </div>
  );
}

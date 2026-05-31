import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Course } from '../types';

/**
 * PDFSearchFilter - Search and filter component for PDF materials
 * 
 * Features:
 * - Search input with debounce (300ms)
 * - Course filter dropdown
 * - Clear button to reset filters
 * - Responsive layout (stacked on mobile, horizontal on desktop)
 * - FUTA brand colors
 * - Touch-friendly buttons (44px minimum height)
 * 
 * @param onSearchChange - Callback when search term changes (debounced)
 * @param onCourseFilterChange - Callback when course filter changes
 * @param availableCourses - Array of courses for filter dropdown
 * @param currentSearchTerm - Current search term value
 * @param currentCourseFilter - Current course filter value
 * 
 * @example
 * <PDFSearchFilter
 *   onSearchChange={(term) => setSearchTerm(term)}
 *   onCourseFilterChange={(courseId) => setCourseFilter(courseId)}
 *   availableCourses={courses}
 *   currentSearchTerm={searchTerm}
 *   currentCourseFilter={courseFilter}
 * />
 */

interface PDFSearchFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onCourseFilterChange: (courseId: string) => void;
  availableCourses: Course[];
  currentSearchTerm: string;
  currentCourseFilter: string;
}

export function PDFSearchFilter({
  onSearchChange,
  onCourseFilterChange,
  availableCourses,
  currentSearchTerm,
  currentCourseFilter,
}: PDFSearchFilterProps) {
  // ===========================
  // STATE MANAGEMENT
  // ===========================

  const [localSearchTerm, setLocalSearchTerm] = useState(currentSearchTerm);

  // ===========================
  // DEBOUNCE LOGIC
  // ===========================

  /**
   * Debounce search input changes (300ms)
   * Calls onSearchChange after user stops typing
   */
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (localSearchTerm !== currentSearchTerm) {
        onSearchChange(localSearchTerm);
      }
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [localSearchTerm, currentSearchTerm, onSearchChange]);

  /**
   * Sync local state with prop changes
   * Handles external updates to search term
   */
  useEffect(() => {
    setLocalSearchTerm(currentSearchTerm);
  }, [currentSearchTerm]);

  // ===========================
  // EVENT HANDLERS
  // ===========================

  /**
   * Handle search input change
   * Updates local state (debounced callback fires via useEffect)
   */
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  /**
   * Handle course filter change
   * Immediately calls callback (no debounce needed for dropdown)
   */
  const handleCourseFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCourseFilterChange(e.target.value);
  };

  /**
   * Handle clear button click
   * Resets both search and filter to defaults
   */
  const handleClearFilters = useCallback(() => {
    setLocalSearchTerm('');
    onSearchChange('');
    onCourseFilterChange('');
  }, [onSearchChange, onCourseFilterChange]);

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================

  /**
   * Check if any filters are active
   * Used to show/hide clear button
   */
  const hasActiveFilters = localSearchTerm.trim() !== '' || currentCourseFilter !== '';

  // ===========================
  // MAIN RENDER
  // ===========================

  return (
    <div className="bg-white rounded-lg border border-futa-gray-200 p-4 md:p-6 space-y-4">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-futa-gray-900">
          Search & Filter
        </h2>
        {hasActiveFilters && (
          <Button
            onClick={handleClearFilters}
            variant="ghost"
            size="sm"
            className="text-futa-gray-600 hover:text-futa-gray-900 hover:bg-futa-gray-100 transition-all duration-200"
            aria-label="Clear all filters"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter controls - stacked on mobile, horizontal on desktop */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 text-futa-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by title or description"
            value={localSearchTerm}
            onChange={handleSearchInputChange}
            className="pl-10 h-11 border-futa-gray-300 focus:border-primary focus:ring-primary/20 transition-all duration-200"
            aria-label="Search PDF materials"
          />
        </div>

        {/* Course filter dropdown */}
        <div className="md:w-64">
          <select
            value={currentCourseFilter}
            onChange={handleCourseFilterChange}
            className="w-full h-11 px-3 rounded-md border border-futa-gray-300 bg-white text-futa-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all duration-200 cursor-pointer hover:border-futa-gray-400"
            aria-label="Filter by course"
          >
            <option value="">All Courses</option>
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-futa-gray-200">
          <span className="text-sm text-futa-gray-600">Active filters:</span>
          {localSearchTerm.trim() !== '' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
              Search: "{localSearchTerm}"
            </span>
          )}
          {currentCourseFilter !== '' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
              Course: {availableCourses.find((c) => c.id === currentCourseFilter)?.code || 'Unknown'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

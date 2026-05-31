/**
 * PDFSearchFilter Component - Usage Examples
 * 
 * This file demonstrates how to use the PDFSearchFilter component
 * in different scenarios within the Campus LearnHub application.
 */

import { useState, useEffect } from 'react';
import { PDFSearchFilter } from './PDFSearchFilter';
import { PDFMaterialList } from './PDFMaterialList';
import type { Course, PDFMaterial } from '../types';

// ===========================
// EXAMPLE 1: Basic Usage
// ===========================

export function BasicExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);

  // Load courses from your service
  useEffect(() => {
    // Example: Load courses
    // const loadedCourses = await courseService.getCourses();
    // setCourses(loadedCourses);
  }, []);

  return (
    <div className="space-y-6">
      <PDFSearchFilter
        onSearchChange={setSearchTerm}
        onCourseFilterChange={setCourseFilter}
        availableCourses={courses}
        currentSearchTerm={searchTerm}
        currentCourseFilter={courseFilter}
      />
      
      {/* Your filtered content here */}
      <div className="text-sm text-futa-gray-600">
        Search: {searchTerm || 'None'}
        <br />
        Course: {courseFilter || 'All'}
      </div>
    </div>
  );
}

// ===========================
// EXAMPLE 2: Integrated with PDFMaterialList
// ===========================

export function IntegratedExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<PDFMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<PDFMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load courses and materials from your services
        // const loadedCourses = await courseService.getCourses();
        // const loadedMaterials = await pdfMaterialService.getMaterials();
        // setCourses(loadedCourses);
        // setMaterials(loadedMaterials);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...materials];

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (material) =>
          material.title.toLowerCase().includes(searchLower) ||
          material.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply course filter
    if (courseFilter !== '') {
      filtered = filtered.filter((material) => material.courseId === courseFilter);
    }

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, courseFilter]);

  const handleDownload = (material: PDFMaterial) => {
    console.log('Download:', material.title);
    // Implement download logic
  };

  const handleEdit = (material: PDFMaterial) => {
    console.log('Edit:', material.title);
    // Implement edit logic
  };

  const handleDelete = (material: PDFMaterial) => {
    console.log('Delete:', material.title);
    // Implement delete logic
  };

  return (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <PDFSearchFilter
        onSearchChange={setSearchTerm}
        onCourseFilterChange={setCourseFilter}
        availableCourses={courses}
        currentSearchTerm={searchTerm}
        currentCourseFilter={courseFilter}
      />

      {/* Results count */}
      {!isLoading && (
        <div className="text-sm text-futa-gray-600">
          Showing {filteredMaterials.length} of {materials.length} materials
        </div>
      )}

      {/* Material list */}
      <PDFMaterialList
        materials={filteredMaterials}
        userRole="lecturer"
        onDownload={handleDownload}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}

// ===========================
// EXAMPLE 3: With Custom Filtering Logic
// ===========================

export function CustomFilterExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<PDFMaterial[]>([]);

  // Custom filter function with additional logic
  const getFilteredMaterials = (): PDFMaterial[] => {
    let filtered = [...materials];

    // Search filter - search in title, description, and lecturer name
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (material) =>
          material.title.toLowerCase().includes(searchLower) ||
          material.description.toLowerCase().includes(searchLower) ||
          material.lecturerName.toLowerCase().includes(searchLower) ||
          material.fileName.toLowerCase().includes(searchLower)
      );
    }

    // Course filter
    if (courseFilter !== '') {
      filtered = filtered.filter((material) => material.courseId === courseFilter);
    }

    // Sort by upload date (most recent first)
    filtered.sort((a, b) => {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    });

    return filtered;
  };

  const filteredMaterials = getFilteredMaterials();

  return (
    <div className="space-y-6">
      <PDFSearchFilter
        onSearchChange={setSearchTerm}
        onCourseFilterChange={setCourseFilter}
        availableCourses={courses}
        currentSearchTerm={searchTerm}
        currentCourseFilter={courseFilter}
      />

      {/* Custom results display */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMaterials.map((material) => (
          <div key={material.id} className="p-4 border rounded-lg">
            <h3 className="font-medium">{material.title}</h3>
            <p className="text-sm text-futa-gray-600">{material.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================
// EXAMPLE 4: Controlled State from Parent
// ===========================

export function ControlledExample() {
  // Parent component manages all state
  const [filters, setFilters] = useState({
    search: '',
    course: '',
  });
  const [courses] = useState<Course[]>([]);

  // Single handler for all filter changes
  const handleFilterChange = (type: 'search' | 'course', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));

    // Optional: Save to localStorage or URL params
    localStorage.setItem(`filter_${type}`, value);
  };

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedSearch = localStorage.getItem('filter_search') || '';
    const savedCourse = localStorage.getItem('filter_course') || '';
    setFilters({
      search: savedSearch,
      course: savedCourse,
    });
  }, []);

  return (
    <PDFSearchFilter
      onSearchChange={(value) => handleFilterChange('search', value)}
      onCourseFilterChange={(value) => handleFilterChange('course', value)}
      availableCourses={courses}
      currentSearchTerm={filters.search}
      currentCourseFilter={filters.course}
    />
  );
}

// ===========================
// EXAMPLE 5: With URL Query Parameters
// ===========================

export function URLParamsExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [courses] = useState<Course[]>([]);

  // Load filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search') || '';
    const course = params.get('course') || '';
    setSearchTerm(search);
    setCourseFilter(course);
  }, []);

  // Update URL when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURL({ search: value, course: courseFilter });
  };

  const handleCourseChange = (value: string) => {
    setCourseFilter(value);
    updateURL({ search: searchTerm, course: value });
  };

  const updateURL = (params: { search: string; course: string }) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.course) searchParams.set('course', params.course);
    
    const newURL = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
  };

  return (
    <PDFSearchFilter
      onSearchChange={handleSearchChange}
      onCourseFilterChange={handleCourseChange}
      availableCourses={courses}
      currentSearchTerm={searchTerm}
      currentCourseFilter={courseFilter}
    />
  );
}

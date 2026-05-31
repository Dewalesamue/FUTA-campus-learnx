# Implementation Plan: PDF Reading Materials Management

## Overview

This implementation plan breaks down the PDF reading materials feature into discrete, actionable coding tasks. The feature enables lecturers to upload, manage, and organize PDF documents as course materials, while students can browse, search, and download these resources. The implementation follows a phased approach: core infrastructure → upload functionality → display and management → student features → access control → testing.

## Tasks

- [x] 1. Set up core data models and type definitions
  - Create `PDFMaterial`, `PDFUploadProgress`, `PDFMaterialMetadata`, `PDFValidationResult`, and `PDFAnalytics` interfaces in `src/app/src/types/index.ts`
  - Extend the existing `User` interface to include `enrolledCourses?: string[]` field
  - Create new `Course` interface with fields: id, name, code, description, lecturerId, lecturerName, enrolledStudents, createdAt, status
  - _Requirements: 1.1-1.10, 2.1-2.8, 4.1-4.8_

- [x] 2. Implement File Validation Service
  - [x] 2.1 Create `src/app/src/services/fileValidationService.ts` with FileValidationService class
    - Implement `validatePDFFile(file: File): PDFValidationResult` method to check file type and size
    - Implement `isPDFFile(file: File): boolean` method to verify MIME type is 'application/pdf'
    - Implement `isWithinSizeLimit(file: File, maxSizeMB: number): boolean` method to check file size <= 25MB
    - Implement `formatFileSize(bytes: number): string` method to format bytes as human-readable string (e.g., "2.5 MB")
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 2.2 Write property test for file validation
    - **Property 1: File Validation Completeness**
    - **Validates: Requirements 1.1, 1.2**
    - Generate files with various MIME types and sizes, verify validation logic correctly identifies valid PDFs and rejects invalid files

  - [ ]* 2.3 Write unit tests for FileValidationService
    - Test validation with valid PDF files
    - Test rejection of non-PDF files (images, documents, etc.)
    - Test rejection of files exceeding 25MB
    - Test file size formatting for various byte values
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. Implement PDF Material Service - Core CRUD Operations
  - [x] 3.1 Create `src/app/src/services/pdfMaterialService.ts` with PDFMaterialService class
    - Implement `uploadMaterial(file: File, metadata: PDFMaterialMetadata, onProgress: callback, abortSignal?: AbortSignal): Promise<PDFMaterial>` method
    - Use Firebase Storage to upload file to path: `/pdf-materials/{lecturerId}/{materialId}/{fileName}.pdf`
    - Track upload progress and call onProgress callback with PDFUploadProgress data
    - Support upload cancellation via AbortSignal
    - Store material metadata in Firestore `pdfMaterials` collection
    - _Requirements: 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10_

  - [x] 3.2 Implement material query methods in PDFMaterialService
    - Implement `getLecturerMaterials(lecturerId: string): Promise<PDFMaterial[]>` to query materials by lecturerId
    - Implement `getStudentMaterials(studentId: string, enrolledCourseIds: string[]): Promise<PDFMaterial[]>` to query materials by courseId in enrolled courses
    - Filter materials by status='active' in both methods
    - _Requirements: 2.1, 4.1_

  - [x] 3.3 Implement material update and delete methods in PDFMaterialService
    - Implement `updateMaterial(materialId: string, metadata: Partial<PDFMaterialMetadata>): Promise<PDFMaterial>` to update Firestore document
    - Implement `deleteMaterial(materialId: string): Promise<void>` to delete file from Storage and document from Firestore
    - Set material status to 'deleted' instead of hard delete (soft delete pattern)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 3.4 Write property test for lecturer material filtering
    - **Property 3: Lecturer Material Filtering**
    - **Validates: Requirements 2.1**
    - Generate materials with random lecturer IDs, verify filtering returns only materials matching the querying lecturer's ID

  - [ ]* 3.5 Write property test for student material filtering
    - **Property 5: Student Material Filtering by Enrollment**
    - **Validates: Requirements 4.1**
    - Generate materials and enrollment lists, verify filtering returns only materials for enrolled courses

- [x] 4. Checkpoint - Ensure core services are working
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement download functionality in PDF Material Service
  - [x] 5.1 Add download methods to PDFMaterialService
    - Implement `downloadMaterial(materialId: string): Promise<string>` to get Firebase Storage download URL
    - Implement `incrementDownloadCount(materialId: string): Promise<void>` to increment downloadCount field in Firestore
    - Ensure download URL preserves original filename
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 5.2 Write property test for download filename preservation
    - **Property 6: Download Filename Preservation**
    - **Validates: Requirements 5.2**
    - Generate materials with various filenames, verify download serves file with original filename

  - [ ]* 5.3 Write property test for download count increment
    - **Property 7: Download Count Increment**
    - **Validates: Requirements 5.4**
    - Generate materials with initial download counts, perform downloads, verify count increments correctly

  - [ ]* 5.4 Write unit tests for download functionality
    - Test download URL generation
    - Test download count increment
    - Test error handling for missing materials
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 6. Implement search, filter, and sort methods in PDF Material Service
  - [x] 6.1 Add search and filter methods to PDFMaterialService
    - Implement `searchMaterials(materials: PDFMaterial[], searchTerm: string): PDFMaterial[]` to filter by title or description (case-insensitive)
    - Implement `filterByCourse(materials: PDFMaterial[], courseId: string): PDFMaterial[]` to filter by courseId
    - Implement `sortMaterials(materials: PDFMaterial[], sortBy: criteria, order: 'asc'|'desc'): PDFMaterial[]` supporting uploadDate, title, courseName, downloadCount
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [ ]* 6.2 Write property test for search term matching
    - **Property 13: Search Term Matching**
    - **Validates: Requirements 7.2, 7.3**
    - Generate materials and search terms, verify search returns only materials with matching title or description

  - [ ]* 6.3 Write property test for course filter application
    - **Property 14: Course Filter Application**
    - **Validates: Requirements 7.5**
    - Generate materials with different course IDs, verify filtering returns only materials for selected course

  - [ ]* 6.4 Write property test for material sorting correctness
    - **Property 15: Material Sorting Correctness**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.5, 9.6, 9.7**
    - Generate materials with random values, verify sorting produces correctly ordered lists for all criteria and directions

  - [ ]* 6.5 Write unit tests for search, filter, and sort
    - Test search with various terms
    - Test course filtering
    - Test sorting by each criteria in both directions
    - Test empty results
    - _Requirements: 7.1-7.6, 9.1-9.7_

- [x] 7. Implement analytics functionality in PDF Material Service
  - [x] 7.1 Add analytics method to PDFMaterialService
    - Implement `getLecturerAnalytics(lecturerId: string): Promise<PDFAnalytics>` method
    - Calculate total materials count for lecturer
    - Calculate total downloads across all lecturer's materials
    - Find most downloaded material (title and count)
    - Find most recently uploaded material (title and date)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ]* 7.2 Write property test for analytics calculations
    - **Property 17: Analytics Calculations**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**
    - Generate material collections, verify analytics correctly calculates totals, max download, and most recent upload

  - [ ]* 7.3 Write unit tests for analytics
    - Test analytics with various material collections
    - Test edge cases (no materials, all zero downloads)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 8. Checkpoint - Ensure all service methods are complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement Access Control Service extensions
  - [x] 9.1 Extend existing `src/app/src/services/authService.ts` with PDF access control methods
    - Implement `canUploadPDF(user: User | null): boolean` to verify user role is 'lecturer'
    - Implement `canDeletePDF(user: User | null, material: PDFMaterial): boolean` to verify user is lecturer AND material owner
    - Implement `canDownloadPDF(user: User | null, material: PDFMaterial): boolean` to verify user is student/lecturer AND (if student) enrolled in course
    - Return authorization errors when permissions fail
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 9.2 Write property test for role-based upload and delete access
    - **Property 8: Role-Based Upload and Delete Access**
    - **Validates: Requirements 6.1, 6.2**
    - Generate users with different roles, verify only lecturers can upload/delete

  - [ ]* 9.3 Write property test for ownership verification
    - **Property 9: Ownership Verification for Deletion**
    - **Validates: Requirements 6.3**
    - Generate materials with different owners, verify only owner can delete

  - [ ]* 9.4 Write property test for role-based download access
    - **Property 10: Role-Based Download Access**
    - **Validates: Requirements 6.4**
    - Generate users with different roles, verify students and lecturers can download

  - [ ]* 9.5 Write property test for enrollment verification
    - **Property 11: Enrollment Verification for Student Downloads**
    - **Validates: Requirements 6.5**
    - Generate students with different enrollments, verify download only allowed for enrolled courses

  - [ ]* 9.6 Write property test for authorization errors
    - **Property 12: Authorization Error on Permission Failure**
    - **Validates: Requirements 6.6**
    - Generate unauthorized operations, verify all are denied with authorization errors

  - [ ]* 9.7 Write unit tests for access control
    - Test upload permission for different roles
    - Test delete permission with ownership checks
    - Test download permission with enrollment checks
    - Test authorization error messages
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 10. Implement PDF Upload Modal Component
  - [x] 10.1 Create `src/app/src/components/PDFUploadModal.tsx` component
    - Use existing dialog component from UI library (shadcn/ui)
    - Add file input with accept="application/pdf" attribute
    - Display file validation errors inline
    - Add form fields for title (required), description (required), and course selection (required dropdown)
    - Validate metadata: reject empty or whitespace-only title/description
    - Display upload progress bar with percentage, speed (MB/s), and estimated time remaining
    - Add cancel button that aborts upload via AbortController
    - Show success message on completion, error message on failure
    - Call FileValidationService for validation, PDFMaterialService for upload
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [ ]* 10.2 Write property test for required metadata validation
    - **Property 2: Required Metadata Validation**
    - **Validates: Requirements 1.4, 1.5, 1.6**
    - Generate form submissions with various metadata combinations, verify rejection of invalid submissions

  - [ ]* 10.3 Write property test for upload progress calculations
    - **Property 16: Upload Progress Calculations**
    - **Validates: Requirements 10.2, 10.3**
    - Generate progress states with loaded/total bytes and elapsed time, verify percentage, speed, and ETA calculations

  - [ ]* 10.4 Write unit tests for PDFUploadModal
    - Test file selection and validation feedback
    - Test metadata form validation
    - Test upload progress display
    - Test upload cancellation
    - Test success and error states
    - _Requirements: 1.1-1.10, 10.1-10.7_

- [ ] 11. Implement PDF Material List Component
  - [ ] 11.1 Create `src/app/src/components/PDFMaterialList.tsx` component
    - Accept props: materials array, userRole ('student'|'lecturer'), onDownload, onEdit, onDelete callbacks, isLoading
    - Display materials in responsive grid layout (single column on mobile, multi-column on desktop)
    - For each material, show: title, description, course name, upload date (formatted), file size (formatted), download count (lecturer view), lecturer name (student view)
    - Add download button for all users, edit/delete buttons for lecturers only
    - Show loading spinner when isLoading is true
    - Show empty state message when materials array is empty
    - Ensure touch targets are at least 44px height on mobile
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 11.2 Write property test for material display completeness
    - **Property 4: Material Display Completeness**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7**
    - Generate materials with random data, verify all required fields appear in rendered output

  - [ ]* 11.3 Write unit tests for PDFMaterialList
    - Test material rendering for lecturer view
    - Test material rendering for student view
    - Test empty state display
    - Test loading state display
    - Test responsive layout
    - Test action button visibility based on role
    - _Requirements: 2.1-2.8, 4.1-4.8, 11.1-11.5_

- [ ] 12. Implement PDF Search and Filter Component
  - [ ] 12.1 Create `src/app/src/components/PDFSearchFilter.tsx` component
    - Add search input field with placeholder "Search by title or description"
    - Add course filter dropdown with "All Courses" option
    - Call onSearchChange callback when search input changes (debounced)
    - Call onCourseFilterChange callback when course filter changes
    - Display current search term and course filter values
    - Add clear button to reset search and filters
    - Use responsive layout (stacked on mobile, horizontal on desktop)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 12.2 Write unit tests for PDFSearchFilter
    - Test search input and callback
    - Test course filter dropdown and callback
    - Test clear functionality
    - Test responsive layout
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 13. Implement PDF Analytics Component
  - [ ] 13.1 Create `src/app/src/components/PDFAnalytics.tsx` component
    - Display analytics in card layout with 4 metrics: total materials, total downloads, most downloaded material, most recent material
    - Format numbers with commas (e.g., "1,234 downloads")
    - Format dates as relative time (e.g., "2 days ago")
    - Show loading state while fetching analytics
    - Handle null values for most downloaded/recent when no materials exist
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ]* 13.2 Write unit tests for PDFAnalytics
    - Test analytics display with various data
    - Test loading state
    - Test empty state (no materials)
    - Test number and date formatting
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 14. Checkpoint - Ensure all components render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Integrate PDF upload functionality into Lecturer Dashboard
  - [ ] 15.1 Add PDF materials section to `src/app/src/pages/lecturer/LecturerDashboard.tsx`
    - Add "Upload PDF" button that opens PDFUploadModal
    - Fetch lecturer's materials on component mount using PDFMaterialService.getLecturerMaterials
    - Add sorting controls (dropdown with options: upload date, title, course, downloads)
    - Display PDFAnalytics component at top of section
    - Display PDFMaterialList component with lecturer role
    - Handle edit action: open modal with pre-filled metadata, call updateMaterial on submit
    - Handle delete action: show confirmation dialog, call deleteMaterial on confirm
    - Show success/error toasts for all operations
    - _Requirements: 2.1-2.8, 3.1-3.5, 8.1-8.7, 9.1-9.7, 12.1-12.5_

  - [ ]* 15.2 Write integration tests for lecturer PDF management
    - Test upload flow: open modal → select file → fill metadata → upload → success
    - Test edit flow: click edit → modify metadata → save → success
    - Test delete flow: click delete → confirm → deletion → success
    - Test sorting functionality
    - Test analytics display
    - _Requirements: 2.1-2.8, 3.1-3.5, 8.1-8.7, 9.1-9.7, 12.1-12.5_

- [ ] 16. Integrate PDF access functionality into Student Dashboard
  - [ ] 16.1 Add PDF materials section to `src/app/src/pages/student/StudentDashboard.tsx`
    - Fetch student's enrolled courses from user profile
    - Fetch available materials using PDFMaterialService.getStudentMaterials with enrolled course IDs
    - Add PDFSearchFilter component
    - Apply search and course filters to materials list
    - Display PDFMaterialList component with student role
    - Handle download action: call downloadMaterial, trigger browser download, increment download count
    - Show success/error toasts for download operations
    - _Requirements: 4.1-4.8, 5.1-5.5, 7.1-7.6_

  - [ ]* 16.2 Write integration tests for student PDF access
    - Test material listing for enrolled courses
    - Test search functionality
    - Test course filtering
    - Test download flow: click download → file downloads → count increments
    - Test access control: verify cannot download materials from non-enrolled courses
    - _Requirements: 4.1-4.8, 5.1-5.5, 7.1-7.6_

- [ ] 17. Implement Firebase Storage and Firestore setup
  - [ ] 17.1 Update `src/app/src/services/firebase.ts` with real Firebase configuration
    - Replace mock functions with actual Firebase SDK imports
    - Add Firebase Storage initialization
    - Add Firestore initialization
    - Configure Firebase Storage CORS for file uploads
    - _Requirements: 1.7, 1.8, 5.1, 5.2_

  - [ ] 17.2 Create Firestore security rules for pdfMaterials collection
    - Allow lecturers to create materials
    - Allow lecturers to update/delete only their own materials
    - Allow students to read materials for enrolled courses
    - Allow students/lecturers to increment download count
    - Deny all other operations
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ] 17.3 Create Firestore indexes for efficient queries
    - Create composite index: `lecturerId + status`
    - Create composite index: `courseId + status`
    - Create single-field index: `uploadDate` (descending)
    - Create single-field index: `downloadCount` (descending)
    - _Requirements: 2.1, 4.1, 9.2, 9.6_

- [ ] 18. Add error handling and user feedback
  - [ ] 18.1 Implement comprehensive error handling across all components
    - Add try-catch blocks around all async operations
    - Display user-friendly error messages using toast notifications
    - Log errors to console for debugging
    - Implement retry logic for network errors (exponential backoff)
    - Preserve form data on upload failures
    - _Requirements: 1.3, 1.10, 3.5, 5.5_

  - [ ]* 18.2 Write unit tests for error handling
    - Test validation error display
    - Test network error handling
    - Test permission error handling
    - Test retry logic
    - _Requirements: 1.3, 1.10, 3.5, 5.5_

- [ ] 19. Implement responsive design refinements
  - [ ] 19.1 Ensure all PDF components are mobile-responsive
    - Test PDFUploadModal on mobile: verify stacked layout, 44px touch targets
    - Test PDFMaterialList on mobile: verify single-column grid, 44px touch targets
    - Test PDFSearchFilter on mobile: verify stacked layout
    - Test PDFAnalytics on mobile: verify card stacking
    - Add mobile-specific styles where needed
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 19.2 Write visual regression tests for responsive design
    - Test component rendering at mobile breakpoint (320px)
    - Test component rendering at tablet breakpoint (768px)
    - Test component rendering at desktop breakpoint (1024px)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 20. Final checkpoint - End-to-end testing and polish
  - [ ] 20.1 Perform end-to-end testing of complete feature
    - Test complete lecturer workflow: login → upload PDF → view materials → edit metadata → delete material
    - Test complete student workflow: login → browse materials → search → filter → download
    - Test access control: verify students cannot access non-enrolled course materials
    - Test error scenarios: invalid files, network errors, permission errors
    - Test responsive design on actual mobile devices
    - _Requirements: All requirements_

  - [ ] 20.2 Performance optimization
    - Implement pagination for material lists (20 items per page)
    - Add debouncing to search input (300ms delay)
    - Optimize Firestore queries with proper indexing
    - Add loading skeletons for better perceived performance
    - _Requirements: 2.1, 4.1, 7.1_

  - [ ] 20.3 Accessibility improvements
    - Add ARIA labels to all interactive elements
    - Ensure keyboard navigation works for all components
    - Add focus indicators to all focusable elements
    - Test with screen reader
    - Verify color contrast meets WCAG AA standards
    - _Requirements: All requirements_

  - [ ] 20.4 Final polish and documentation
    - Add inline code comments for complex logic
    - Update README with PDF feature documentation
    - Create user guide for lecturers and students
    - Ensure all console.log statements are removed or converted to proper logging
    - _Requirements: All requirements_

- [ ] 21. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- Property tests validate universal correctness properties defined in the design document
- Unit tests validate specific examples, edge cases, and component behavior
- Integration tests validate complete user flows across multiple components
- The implementation uses TypeScript with React 18, Firebase, and Tailwind CSS
- All components follow the project's existing patterns and guidelines (see guidelines/Guidelines.md)
- Firebase is currently mocked; task 17 replaces mocks with real Firebase SDK
- Access control is enforced both client-side (UI) and server-side (Firestore security rules)

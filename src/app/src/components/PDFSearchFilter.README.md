# PDFSearchFilter Component

A production-ready React component for searching and filtering PDF reading materials in the Campus LearnHub application.

## Features

✅ **Search Input**
- Debounced search (300ms delay)
- Searches by title or description
- Real-time feedback with active filter badges
- Search icon for visual clarity

✅ **Course Filter**
- Dropdown with "All Courses" option
- Shows course code and name
- Immediate filtering (no debounce)

✅ **Clear Functionality**
- Clear button appears when filters are active
- Resets both search and course filter
- Smooth transitions

✅ **Responsive Design**
- Stacked layout on mobile devices
- Horizontal layout on desktop (md breakpoint)
- Touch-friendly buttons (44px minimum height)

✅ **FUTA Brand Styling**
- Uses FUTA green (#006400) as primary color
- Consistent with project design system
- Follows Tailwind CSS conventions

✅ **Accessibility**
- Proper ARIA labels
- Keyboard navigation support
- Focus states for all interactive elements

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSearchChange` | `(searchTerm: string) => void` | Yes | Callback when search term changes (debounced) |
| `onCourseFilterChange` | `(courseId: string) => void` | Yes | Callback when course filter changes |
| `availableCourses` | `Course[]` | Yes | Array of courses for filter dropdown |
| `currentSearchTerm` | `string` | Yes | Current search term value |
| `currentCourseFilter` | `string` | Yes | Current course filter value (course ID or empty string) |

## Type Definitions

```typescript
interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  lecturerId: string;
  lecturerName: string;
  enrolledStudents: string[];
  createdAt: string;
  status: 'active' | 'archived';
}
```

## Basic Usage

```tsx
import { useState } from 'react';
import { PDFSearchFilter } from './components/PDFSearchFilter';
import type { Course } from './types';

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);

  return (
    <PDFSearchFilter
      onSearchChange={setSearchTerm}
      onCourseFilterChange={setCourseFilter}
      availableCourses={courses}
      currentSearchTerm={searchTerm}
      currentCourseFilter={courseFilter}
    />
  );
}
```

## Advanced Usage

### With Material Filtering

```tsx
import { useState, useEffect } from 'react';
import { PDFSearchFilter } from './components/PDFSearchFilter';
import { PDFMaterialList } from './components/PDFMaterialList';
import type { Course, PDFMaterial } from './types';

function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<PDFMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<PDFMaterial[]>([]);

  // Apply filters whenever they change
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
      filtered = filtered.filter(
        (material) => material.courseId === courseFilter
      );
    }

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, courseFilter]);

  return (
    <div className="space-y-6">
      <PDFSearchFilter
        onSearchChange={setSearchTerm}
        onCourseFilterChange={setCourseFilter}
        availableCourses={courses}
        currentSearchTerm={searchTerm}
        currentCourseFilter={courseFilter}
      />

      <PDFMaterialList
        materials={filteredMaterials}
        userRole="student"
        onDownload={(material) => console.log('Download:', material)}
        onEdit={(material) => console.log('Edit:', material)}
        onDelete={(material) => console.log('Delete:', material)}
        isLoading={false}
      />
    </div>
  );
}
```

### With URL Query Parameters

```tsx
import { useState, useEffect } from 'react';
import { PDFSearchFilter } from './components/PDFSearchFilter';

function MaterialsPageWithURL() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);

  // Load filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchTerm(params.get('search') || '');
    setCourseFilter(params.get('course') || '');
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
    
    const newURL = `${window.location.pathname}${
      searchParams.toString() ? '?' + searchParams.toString() : ''
    }`;
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
```

### With LocalStorage Persistence

```tsx
import { useState, useEffect } from 'react';
import { PDFSearchFilter } from './components/PDFSearchFilter';

function MaterialsPageWithStorage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedSearch = localStorage.getItem('pdf_search') || '';
    const savedCourse = localStorage.getItem('pdf_course') || '';
    setSearchTerm(savedSearch);
    setCourseFilter(savedCourse);
  }, []);

  // Save to localStorage when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    localStorage.setItem('pdf_search', value);
  };

  const handleCourseChange = (value: string) => {
    setCourseFilter(value);
    localStorage.setItem('pdf_course', value);
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
```

## Component Structure

```
PDFSearchFilter
├── Filter Header
│   ├── Title ("Search & Filter")
│   └── Clear Button (conditional)
├── Filter Controls
│   ├── Search Input
│   │   ├── Search Icon
│   │   └── Text Input (debounced)
│   └── Course Dropdown
│       ├── "All Courses" option
│       └── Course options (code - name)
└── Active Filters Summary (conditional)
    ├── Search badge
    └── Course badge
```

## Styling

The component uses:
- **FUTA Colors**: Primary green (#006400), gray scale
- **Tailwind CSS**: Utility-first styling
- **Responsive Breakpoints**: 
  - Mobile: Stacked layout
  - Desktop (md+): Horizontal layout
- **Transitions**: Smooth 200ms transitions on interactive elements

## Debounce Behavior

The search input uses a 300ms debounce to prevent excessive callback invocations:

1. User types in search input
2. Local state updates immediately (instant feedback)
3. After 300ms of no typing, `onSearchChange` callback fires
4. Parent component receives the search term

This provides a smooth UX while optimizing performance.

## Accessibility

- All interactive elements have proper ARIA labels
- Keyboard navigation fully supported
- Focus states clearly visible
- Minimum touch target size of 44px
- Semantic HTML structure

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- CSS Custom Properties

## Dependencies

- React 18+
- lucide-react (for icons)
- Tailwind CSS
- UI components from `./ui/` directory

## Related Components

- `PDFMaterialList` - Displays filtered PDF materials
- `PDFUploadModal` - Upload new PDF materials
- `Input` - Base input component
- `Button` - Base button component

## Testing Considerations

When testing this component:

1. **Debounce Testing**: Use `jest.useFakeTimers()` to control debounce
2. **Callback Testing**: Verify callbacks fire with correct arguments
3. **Filter Logic**: Test search and course filtering separately
4. **Clear Functionality**: Verify both filters reset
5. **Responsive Layout**: Test at different viewport sizes

## Performance Notes

- Debounced search prevents excessive re-renders
- Course dropdown changes fire immediately (no debounce needed)
- Component is lightweight and optimized for frequent updates
- No unnecessary re-renders when props don't change

## Future Enhancements

Potential improvements:
- [ ] Add date range filter
- [ ] Add sort options (date, title, downloads)
- [ ] Add lecturer filter for students
- [ ] Add file type filter (if supporting multiple formats)
- [ ] Add saved filter presets
- [ ] Add filter analytics/tracking

## License

Part of the Campus LearnHub project - FUTA

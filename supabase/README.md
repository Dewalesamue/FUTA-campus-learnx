# Supabase Setup for PDF Reading Materials

This directory contains the Supabase configuration and migrations for the PDF reading materials feature.

## Prerequisites

1. A Supabase project (create one at https://supabase.com)
2. Supabase CLI installed (optional, for local development)

## Setup Instructions

### 1. Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait for the project to be provisioned (takes ~2 minutes)
3. Note your project URL and anon key from Settings > API

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Run Database Migrations

#### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `migrations/001_create_pdf_materials.sql`
4. Paste and run the SQL

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Verify Setup

After running the migration, verify:

1. **Table created**: Check that `pdf_materials` table exists in Table Editor
2. **Storage bucket**: Check that `pdf-materials` bucket exists in Storage
3. **RLS policies**: Check that Row Level Security policies are active

## Database Schema

### pdf_materials Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Material title |
| description | TEXT | Material description |
| course_id | TEXT | Associated course ID |
| course_name | TEXT | Course name (denormalized) |
| lecturer_id | UUID | Uploader's user ID (FK to auth.users) |
| lecturer_name | TEXT | Lecturer name (denormalized) |
| file_name | TEXT | Original filename |
| file_size | BIGINT | File size in bytes |
| file_url | TEXT | Public URL to file |
| storage_path | TEXT | Storage path in bucket |
| upload_date | TIMESTAMPTZ | Upload timestamp |
| download_count | INTEGER | Number of downloads |
| status | TEXT | 'active' or 'deleted' |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### Indexes

- `idx_pdf_materials_lecturer_id`: Fast lecturer queries
- `idx_pdf_materials_course_id`: Fast course queries
- `idx_pdf_materials_status`: Filter by status
- `idx_pdf_materials_upload_date`: Sort by date
- `idx_pdf_materials_lecturer_status`: Composite for lecturer + status
- `idx_pdf_materials_course_status`: Composite for course + status

### Storage Bucket

- **Name**: `pdf-materials`
- **Public**: Yes (with RLS policies)
- **Structure**: `{lecturer_id}/{material_id}/{filename}.pdf`

## Row Level Security (RLS) Policies

### Database Policies

1. **Lecturers can insert materials**: Lecturers can only insert materials with their own user ID
2. **Lecturers can view own materials**: Lecturers can view all their uploaded materials
3. **Students can view course materials**: Students can view materials from enrolled courses
4. **Lecturers can update own materials**: Lecturers can update their own materials
5. **Lecturers can delete own materials**: Lecturers can soft-delete their own materials

### Storage Policies

1. **Lecturers can upload PDFs**: Lecturers can upload to their own folder
2. **Authenticated users can read PDFs**: All authenticated users can read PDFs
3. **Lecturers can delete own PDFs**: Lecturers can delete files from their own folder

## Functions

### increment_download_count(material_id UUID)

Atomically increments the download count for a material. This prevents race conditions when multiple users download simultaneously.

**Usage:**
```sql
SELECT increment_download_count('material-uuid-here');
```

## Troubleshooting

### Issue: "relation pdf_materials does not exist"

**Solution**: Run the migration SQL in the Supabase SQL Editor

### Issue: "permission denied for table pdf_materials"

**Solution**: Check that RLS policies are enabled and correctly configured

### Issue: "storage bucket not found"

**Solution**: Ensure the storage bucket creation SQL ran successfully

### Issue: Upload fails with "policy violation"

**Solution**: Verify the user is authenticated and the storage path matches the policy pattern

## Next Steps

After setup:

1. Test file upload from the lecturer dashboard
2. Verify files appear in Supabase Storage
3. Test student access to materials
4. Monitor download counts

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

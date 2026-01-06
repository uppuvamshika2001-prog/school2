# 📚 Homework Assignment System

## Overview
The Homework Assignment System allows teachers to create and manage homework assignments that are automatically reflected in students' class diaries.

## Features

### For Teachers
- **Create Homework**: Assign homework with details like subject, title, description, and due date
- **Edit Homework**: Modify existing homework assignments
- **Delete Homework**: Remove homework assignments
- **Class Selection**: Assign homework to specific classes
- **Multiple Types**: Support for Homework, Classwork, Assignment, and Project types
- **Color-Coded UI**: Different colors for different homework types (Purple, Blue, Orange, Green)

### For Students
- **View Homework**: See all homework assigned by teachers in the Class Diary
- **Teacher Attribution**: Know which teacher assigned the homework
- **Due Dates**: See when homework is due
- **Date Filtering**: Filter homework by date
- **Subject Organization**: Homework organized by subject

## How It Works

### 1. Teacher Creates Homework
1. Login as a teacher
2. Navigate to **Homework Assignment** from the sidebar
3. Click **New Homework** button
4. Fill in the form:
   - Assignment Date
   - Class (e.g., 10-A)
   - Subject (e.g., Mathematics)
   - Type (Homework/Classwork/Assignment/Project)
   - Title (e.g., "Quadratic Equations Practice")
   - Description (detailed instructions)
   - Due Date (optional)
5. Click **Create Homework**

### 2. Student Views Homework
1. Login as a student
2. Navigate to **Class Diary** from the sidebar
3. Select a date using the date picker
4. View all homework assigned for that date
5. See teacher name, due date, and homework details

## Technical Implementation

### Data Flow
```
Teacher Creates Homework → Homework Store (Zustand) → Student Diary Page
```

### Key Files
- **Store**: `/src/stores/homework.store.ts` - Manages homework state
- **Teacher Page**: `/src/app/dashboard/teacher/homework/page.tsx` - Homework creation interface
- **Student Page**: `/src/app/dashboard/student/diary/page.tsx` - Homework viewing interface
- **Navigation**: `/src/components/layout/sidebar.tsx` - Added homework link

### Data Persistence
- Homework is stored in browser's localStorage using Zustand persist middleware
- Data persists across page refreshes
- Each homework has a unique ID generated on creation

## Homework Types & Colors

| Type | Color | Use Case |
|------|-------|----------|
| Homework | Purple | Regular homework assignments |
| Classwork | Blue | In-class work to be completed |
| Assignment | Orange | Longer assignments |
| Project | Green | Project-based work |

## Future Enhancements
- Backend API integration for persistent storage
- File attachments for homework
- Homework submission by students
- Homework completion tracking
- Notifications for new homework
- Parent visibility of homework
- Homework analytics and reports

## Demo Credentials

### Teacher Login
- Email: teacher@school.edu
- Password: teacher123

### Student Login
- Email: student@school.edu
- Password: student123

## Usage Example

### Teacher Workflow
```
1. Login as teacher
2. Go to "Homework Assignment"
3. Click "New Homework"
4. Fill form:
   - Date: 2026-01-02
   - Class: 10-A
   - Subject: Mathematics
   - Type: Homework
   - Title: "Solve Quadratic Equations"
   - Description: "Complete Exercise 4.2, Questions 1-10"
   - Due Date: 2026-01-05
5. Click "Create Homework"
```

### Student Workflow
```
1. Login as student (Class 10-A)
2. Go to "Class Diary"
3. Select date: 2026-01-02
4. View homework:
   - Subject: Mathematics
   - Type: Homework (Purple badge)
   - Title: "Solve Quadratic Equations"
   - Assigned by: [Teacher Name]
   - Description: "Complete Exercise 4.2, Questions 1-10"
   - Due: 05 Jan 2026
```

## Notes
- Homework is class-specific (students only see homework for their class)
- Teachers can edit/delete their own homework
- All subjects are shown in the diary (with "No Specific Homework" for subjects without assignments)
- Date picker defaults to today's date
- Homework is sorted by date (newest first) in teacher view

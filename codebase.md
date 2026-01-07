# 📚 School ERP - Production Codebase Documentation

> **Last Updated:** January 7, 2026  
> **Version:** 1.1.0  
> **Framework:** Next.js 14.0.4 (App Router)  
> **Environment:** Production Ready

---

## 📁 Project Architecture

```
school-erp/
├── 📂 src/
│   ├── 📂 app/                           # Next.js App Router (Pages)
│   │   ├── 📂 dashboard/                 # Protected Dashboard Routes
│   │   │   ├── 📂 [module]/              # Feature Modules
│   │   │   ├── layout.tsx                # Dashboard Layout
│   │   │   └── page.tsx                  # Dashboard Home
│   │   ├── 📂 login/                     # Authentication
│   │   ├── globals.css                   # Global Styles
│   │   ├── layout.tsx                    # Root Layout
│   │   └── page.tsx                      # Landing Page
│   │
│   ├── 📂 components/                    # Reusable Components
│   │   ├── 📂 layout/                    # Layout Components
│   │   │   ├── Sidebar.tsx               # Navigation Sidebar
│   │   │   ├── Header.tsx                # Top Header
│   │   │   └── MainLayout.tsx            # Main Layout Wrapper
│   │   ├── 📂 ui/                        # Base UI Components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── dropdown-menu.tsx
│   │   └── providers.tsx                 # React Query Provider
│   │
│   ├── 📂 services/                      # API Service Layer
│   │   ├── calendar.service.ts           # Calendar API
│   │   ├── class.service.ts              # Class API
│   │   ├── exam.service.ts               # Examination API
│   │   ├── fee.service.ts                # Fee Management API
│   │   ├── feedback.service.ts           # Feedback API
│   │   ├── library.service.ts            # Library API
│   │   └── teacher.service.ts            # Teacher API
│   │
│   ├── 📂 stores/                        # Zustand State Management
│   │   ├── auth.store.ts                 # Authentication State
│   │   ├── calendar.store.ts             # Calendar State
│   │   ├── class.store.ts                # Class State
│   │   ├── exam.store.ts                 # Examination State
│   │   ├── fee.store.ts                  # Fee State
│   │   ├── feedback.store.ts             # Feedback State
│   │   ├── homework.store.ts             # Homework State
│   │   ├── library.store.ts              # Library State
│   │   └── teacher.store.ts              # Teacher State
│   │
│   ├── 📂 types/                         # TypeScript Definitions
│   │   ├── calendar.types.ts             # Calendar Types
│   │   ├── class.types.ts                # Class Types
│   │   ├── exam.types.ts                 # Examination Types
│   │   ├── fee.types.ts                  # Fee Types
│   │   ├── feedback.types.ts             # Feedback Types
│   │   ├── library.types.ts              # Library Types
│   │   └── teacher.types.ts              # Teacher Types
│   │
│   ├── 📂 hooks/                         # Custom React Hooks
│   │   ├── usePreventBackNavigation.ts
│   │   └── useTour.ts
│   │
│   ├── 📂 lib/                           # Utilities & Config
│   │   ├── api.ts                        # Axios Client
│   │   └── utils.ts                      # Helper Functions
│   │
│   └── 📂 data/                          # Static Data / Mock Data
│
├── 📂 public/                            # Static Assets
├── 📂 Documentation/                     # Project Documentation
├── .env                                  # Environment Variables
├── .env.example                          # Environment Template
├── tailwind.config.js                    # Tailwind Configuration
├── tsconfig.json                         # TypeScript Configuration
├── next.config.js                        # Next.js Configuration
├── package.json                          # Dependencies
└── Dockerfile                            # Docker Deployment
```

---

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 14.0.4 | React Framework with App Router |
| **Language** | TypeScript | 5.3.3 | Type-safe JavaScript |
| **Styling** | Tailwind CSS | 3.4.0 | Utility-first CSS |
| **State Management** | Zustand | 4.4.7 | Lightweight State Management |
| **Data Fetching** | React Query | 5.17.0 | Server State Management |
| **Forms** | React Hook Form | 7.49.2 | Form Handling |
| **Validation** | Zod | 3.22.4 | Schema Validation |
| **HTTP Client** | Axios | 1.6.2 | API Requests |
| **Charts** | Recharts | 2.10.3 | Data Visualization |
| **Icons** | Lucide React | 0.303.0 | Icon Library |
| **Dates** | date-fns | 3.0.6 | Date Utilities |
| **Toasts** | Sonner | 1.3.1 | Notifications |
| **UI Library** | Radix UI | Various | Accessible Components |

---

## 👥 User Roles & Access Control

| Role | Access Level | Primary Features |
|------|--------------|------------------|
| **Super Admin** | Full System Access | All modules, system settings, multi-school |
| **School Admin** | School-wide Access | Student/Teacher management, reports |
| **Teacher** | Teaching Features | Attendance, grades, homework, timetable |
| **Student** | Student Portal | Dashboard, results, fees, library |
| **Parent** | Parent Portal | Child tracking, fees, feedback |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@schoolerp.com` | demo123 |
| School Admin | `admin@demo-school.edu` | demo123 |
| Teacher | `sarah.wilson@school.edu` | demo123 |
| Student | `arjun.sharma@school.edu` | demo123 |

---

## 📱 Module Architecture

### Core Modules (Admin)

| Module | Route | Pages | Status |
|--------|-------|-------|--------|
| **Dashboard** | `/dashboard` | 1 | ✅ Complete |
| **Academics** | `/dashboard/academics` | 3 | ✅ Complete |
| **Attendance** | `/dashboard/attendance` | 1 | ✅ Complete |
| **Announcements** | `/dashboard/announcements` | 1 | ✅ Complete |
| **Bus Tracking** | `/dashboard/bus-tracking` | 1 | ✅ Complete |
| **Calendar** | `/dashboard/calendar` | 3 | ✅ Complete |
| **Examinations** | `/dashboard/examinations` | 3 | ✅ Complete |
| **Feedback** | `/dashboard/feedback` | 3 | ✅ Complete |
| **Fees** | `/dashboard/fees` | 4 | ✅ Complete |
| **Library** | `/dashboard/library` | 4 | ✅ Complete |
| **Messages** | `/dashboard/messages` | 1 | ✅ Complete |
| **Reports** | `/dashboard/reports` | 1 | ✅ Complete |
| **Settings** | `/dashboard/settings` | 3 | ✅ Complete |
| **Students** | `/dashboard/students` | 2 | ✅ Complete |
| **Teachers** | `/dashboard/teachers` | 3 | ✅ Complete |
| **Timetable** | `/dashboard/timetable` | 1 | ✅ Complete |

---

## 📂 Detailed Module Structure

### 1️⃣ Academics Module
```
📂 academics/
├── 📂 classes/
│   └── page.tsx              # Class List & Management
├── 📂 subjects/
│   └── page.tsx              # Subject Management
└── page.tsx                  # Academics Overview
```
**Features:** Class management, Subject assignment, Academic year configuration

---

### 2️⃣ Calendar Module
```
📂 calendar/
├── 📂 [id]/
│   └── page.tsx              # Event Detail View
├── 📂 create/
│   └── page.tsx              # Create/Edit Event
└── page.tsx                  # Academic Calendar (Monthly)
```
**Features:** 
- Monthly calendar with color-coded events
- Event types: Holiday, Exam, Academic, Event, Meeting
- Date click interaction
- Role-based event visibility

---

### 3️⃣ Examinations Module
```
📂 examinations/
├── 📂 marks-entry/
│   └── page.tsx              # Marks Entry System
├── 📂 weekly-tests/
│   └── page.tsx              # Weekly Test Management
└── page.tsx                  # Examination Dashboard
```
**Features:** Exam scheduling, Marks entry, Grade calculation, Result generation.  
**Access Note:** Marks entry and scheduling are restricted to Teachers/Admins; Super Admin focus is on oversight.

---

### 4️⃣ Feedback Module
```
📂 feedback/
├── 📂 [id]/
│   └── page.tsx              # Feedback Detail (Admin)
├── 📂 submit/
│   └── page.tsx              # Submit Feedback (Student/Parent)
└── page.tsx                  # Feedback Analysis Dashboard
```
**Features:**
- Feedback types: Positive, Suggestion, Concern
- Anonymous submission option
- Role-based visibility: Analysis (Admin) vs Submission (Student/Parent)
- Sentiment-based summary statistics
- Clean, focused list view without status clutter

---

### 5️⃣ Fees Module
```
📂 fees/
├── 📂 payments/
│   └── page.tsx              # Payment History
├── 📂 reports/
│   └── page.tsx              # Fee Reports
├── 📂 structure/
│   └── page.tsx              # Fee Structure
└── page.tsx                  # Fee Dashboard
```
**Features:** Fee collection, Payment tracking, Reports, Structure management.  
**Access Note:** Fee collection and structure management restricted to School Admin; Super Admin has monitoring access.

---

### 6️⃣ Library Module
```
📂 library/
├── 📂 [id]/
│   └── page.tsx              # Book Detail & Issue
├── 📂 digital/
│   └── page.tsx              # Digital Resources
├── 📂 manage/
│   └── page.tsx              # Add Books/Resources
└── page.tsx                  # Book Catalog
```
**Features:**
- Physical books: Search, Issue, Return, Availability
- Digital resources: PDF, Video, Audio, Presentations
- Category & subject filtering
- Download tracking
- **Super Admin Access:** Read-only catalog browsing and resource viewing.

---

### 7️⃣ Teachers Module
```
📂 teachers/
├── 📂 [id]/
│   └── page.tsx              # Teacher Profile & Timetable
├── 📂 new/
│   └── page.tsx              # Add New Teacher
├── 📂 assignments/
│   └── page.tsx              # Subject Assignments
├── 📂 timetable/
│   └── page.tsx              # Timetable Management
├── 📂 attendance/
│   └── page.tsx              # Staff Attendance
└── page.tsx                  # Teacher List
```
**Features:** Teacher profiles, Subject assignment, Timetable generation, Document management

---

### 8️⃣ Students Module
```
📂 students/
├── 📂 [id]/
│   └── page.tsx              # Student Profile
└── page.tsx                  # Student List
```
**Features:** Student enrollment, Profile management, Class assignment

---

## 📊 State Management Pattern

### Store Structure (Zustand)

```typescript
// Example: library.store.ts
interface LibraryState {
    // Data
    books: Book[];
    selectedBook: Book | null;
    digitalResources: DigitalResource[];
    summary: LibrarySummary | null;
    
    // UI State
    filters: LibraryFilters;
    isLoading: boolean;
    isSubmitting: boolean;

    // Actions
    fetchBooks: (filters?: LibraryFilters) => Promise<void>;
    addBook: (data: BookFormData) => Promise<boolean>;
    issueBook: (...) => Promise<boolean>;
    setFilters: (filters: LibraryFilters) => void;
}
```

### Store Responsibilities

| Store | Purpose |
|-------|---------|
| `auth.store.ts` | User authentication, session, role |
| `calendar.store.ts` | Events, monthly view, date selection |
| `class.store.ts` | Classes, sections, assignments |
| `exam.store.ts` | Exams, marks, results |
| `fee.store.ts` | Fees, payments, structures |
| `feedback.store.ts` | Feedback, status, analytics |
| `library.store.ts` | Books, resources, issues |
| `teacher.store.ts` | Teachers, profiles, timetables |

---

## 🔌 Service Layer Pattern

### Service Structure

```typescript
// Example: library.service.ts
export const libraryService = {
    // READ Operations
    getBooks: (filters?: LibraryFilters) => Promise<Book[]>,
    getBookById: (id: string) => Promise<Book | null>,
    getDigitalResources: (filters?: LibraryFilters) => Promise<DigitalResource[]>,
    getSummary: () => Promise<LibrarySummary>,
    
    // WRITE Operations
    addBook: (data: BookFormData) => Promise<Book>,
    issueBook: (...) => Promise<BookIssue>,
    returnBook: (issueId: string) => Promise<BookIssue>,
    
    // DELETE Operations
    deleteBook: (id: string) => Promise<boolean>,
};
```

---

## 🎨 Design System

### Color Palette

| Purpose | Color | Usage |
|---------|-------|-------|
| Primary | `hsl(217, 91%, 60%)` | Actions, links, focus |
| Success | `#22C55E` | Positive states, confirmations |
| Warning | `#EAB308` | Alerts, pending states |
| Danger | `#EF4444` | Errors, destructive actions |
| Muted | `#6B7280` | Secondary text, borders |

### Typography

| Font | Usage |
|------|-------|
| **Plus Jakarta Sans** | Headings, titles |
| **Inter** | Body text, UI elements |
| **JetBrains Mono** | Numbers, IDs, code |

### Component Standards

- Border radius: `rounded-lg` (8px), `rounded-xl` (12px)
- Shadows: `shadow-sm`, `shadow-md` for elevation
- Animations: `transition-all`, `duration-200`
- Cards: `border-none shadow-sm` for clean look

---

## 🚀 Getting Started

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/school-erp.git
cd school-erp

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=School ERP
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📋 Development Guidelines

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | `feedback/page.tsx` |
| Components | PascalCase | `FeedbackCard.tsx` |
| Services | kebab-case | `feedback.service.ts` |
| Stores | kebab-case | `feedback.store.ts` |
| Types | kebab-case | `feedback.types.ts` |
| Hooks | camelCase | `useFeedback.ts` |

### Code Organization

1. **Pages**: Only routing and layout logic
2. **Components**: Reusable UI elements
3. **Services**: API calls and data transformation
4. **Stores**: State management and actions
5. **Types**: TypeScript interfaces and types
6. **Hooks**: Custom React hooks
7. **Lib**: Utilities and configurations

---

## 📈 Module Statistics

| Category | Count |
|----------|-------|
| Total Pages | 40+ |
| UI Components | 15+ |
| Zustand Stores | 9 |
| API Services | 7 |
| Type Definitions | 7 |
| Custom Hooks | 2 |

---

## 📄 Related Documentation

| Document | Description |
|----------|-------------|
| `Documentation/PROJECT_OVERVIEW.md` | Complete project overview |
| `Documentation/DEMO_LOGIN_FIX.md` | Demo login implementation |
| `Documentation/HOMEWORK_SYSTEM.md` | Homework feature docs |
| `Documentation/DUMMY_DATA_ADDED.md` | Sample data information |

---

### Refinements (v1.3.0)
- ✅ **Super Admin Read-Only Access** - Restricted administrative actions (Create, Edit, Delete) for Super Admin across multiple modules.
- ✅ **Operational Monitoring** - Optimized Library, Examinations, Fees, and Attendance for Super Admin to focus on oversight rather than management.
- ✅ **UI Refinement** - Professional & simple design system update
- ✅ **Simplified Feedback** - Removed status-based clutter and optimized for analysis
- ✅ **Role Scaling** - Streamlined sidebar and actions based on user roles (Admin vs User)
- ✅ **Enhanced Typography** - Unified font weights and hierarchy for readability

---

## 🎓 Student Portal

### Portal Routes (`/dashboard/student/`)

| Section | Route | Description |
|---------|-------|-------------|
| **Dashboard** | `/dashboard/student` | Student home with overview |
| **Attendance** | `/dashboard/student/attendance` | View attendance records |
| **Bus Tracking** | `/dashboard/student/bus-tracking` | Track school bus location |
| **Calendar** | `/dashboard/student/calendar` | Academic calendar view |
| **Circulars** | `/dashboard/student/circulars` | School circulars & notices |
| **Diary** | `/dashboard/student/diary` | Class diary & homework |
| **Examinations** | `/dashboard/student/examinations` | Exam schedules & results |
| **Feedback** | `/dashboard/student/feedback` | Submit feedback |
| **Fees** | `/dashboard/student/fees` | Fee status & payments |
| **Gallery** | `/dashboard/student/gallery` | Photo gallery |
| **Library** | `/dashboard/student/library` | Library access |
| **Profile** | `/dashboard/student/profile` | Student profile |
| **PTO** | `/dashboard/student/pto` | Parent-teacher organization |
| **Reports** | `/dashboard/student/reports` | Academic reports |
| **Timetable** | `/dashboard/student/timetable` | Class schedule |

### Portal Features
- **14 Integrated Sections**
- Role-restricted access
- Parent visibility for child's data
- Real-time updates

---

## 👩‍🏫 Teacher Portal

### Portal Routes (`/dashboard/teacher/`)

| Section | Route | Description |
|---------|-------|-------------|
| **Dashboard** | `/dashboard/teacher` | Teacher home overview |
| **Attendance** | `/dashboard/teacher/attendance` | Mark class attendance |
| **Examinations** | `/dashboard/teacher/examinations` | Manage exams & marks |
| **Homework** | `/dashboard/teacher/homework` | Assign homework |
| **Leaves** | `/dashboard/teacher/leaves` | Leave management |
| **Live Attendance** | `/dashboard/teacher/live-attendance` | Real-time tracking |
| **Profile** | `/dashboard/teacher/profile` | Teacher profile |
| **Timetable** | `/dashboard/teacher/timetable` | Teaching schedule |

### Portal Features
- **7 Core Sections**
- Class & subject assignment integration
- Quick actions for daily tasks
- Timetable synchronization

---

## 🔗 API Endpoints Structure

### Authentication
```
POST   /api/v1/auth/login          # User login
POST   /api/v1/auth/logout         # User logout
POST   /api/v1/auth/refresh        # Refresh token
GET    /api/v1/auth/me             # Get current user
```

### Students
```
GET    /api/v1/students            # List all students
GET    /api/v1/students/:id        # Get student details
POST   /api/v1/students            # Create student
PUT    /api/v1/students/:id        # Update student
DELETE /api/v1/students/:id        # Delete student
GET    /api/v1/students/:id/fees   # Get student fees
```

### Teachers
```
GET    /api/v1/teachers            # List all teachers
GET    /api/v1/teachers/:id        # Get teacher details
POST   /api/v1/teachers            # Create teacher
PUT    /api/v1/teachers/:id        # Update teacher
DELETE /api/v1/teachers/:id        # Delete teacher
GET    /api/v1/teachers/:id/timetable  # Get teacher timetable
```

### Calendar
```
GET    /api/v1/calendar/events     # List events
GET    /api/v1/calendar/events/:id # Get event details
POST   /api/v1/calendar/events     # Create event
PUT    /api/v1/calendar/events/:id # Update event
DELETE /api/v1/calendar/events/:id # Delete event
GET    /api/v1/calendar/summary    # Get calendar summary
```

### Library
```
GET    /api/v1/library/books       # List books
GET    /api/v1/library/books/:id   # Get book details
POST   /api/v1/library/books       # Add book
PUT    /api/v1/library/books/:id   # Update book
DELETE /api/v1/library/books/:id   # Delete book
POST   /api/v1/library/issue       # Issue book
POST   /api/v1/library/return      # Return book
GET    /api/v1/library/digital     # Digital resources
```

### Feedback
```
GET    /api/v1/feedback            # List all feedback
GET    /api/v1/feedback/:id        # Get feedback details
POST   /api/v1/feedback            # Submit feedback
PUT    /api/v1/feedback/:id/status # Update status
GET    /api/v1/feedback/summary    # Get summary stats
```

### Fees
```
GET    /api/v1/fees                # List fee records
GET    /api/v1/fees/:id            # Get fee details
POST   /api/v1/fees/payment        # Process payment
GET    /api/v1/fees/structure      # Fee structure
GET    /api/v1/fees/reports        # Fee reports
```

---

## 🐳 Deployment

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Commands

```bash
# Build image
docker build -t school-erp .

# Run container
docker run -p 3000:3000 school-erp

# Docker Compose
docker-compose up -d
```

### Environment Configuration

```env
# .env.production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.school-erp.com/api/v1
NEXT_PUBLIC_APP_NAME=School ERP
NEXT_PUBLIC_APP_URL=https://school-erp.com

# Database (Backend)
DATABASE_URL=postgresql://user:pass@host:5432/school_erp

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# File Storage
STORAGE_BUCKET=school-erp-files
STORAGE_REGION=ap-south-1
```

### Cloud Deployment Options

| Platform | Configuration |
|----------|---------------|
| **Vercel** | Auto-deploy from GitHub |
| **AWS** | ECS + ECR + RDS |
| **GCP** | Cloud Run + Cloud SQL |
| **Azure** | App Service + PostgreSQL |
| **Railway** | One-click deploy |

---

## 🧪 Testing Guidelines

### Testing Stack

| Tool | Purpose |
|------|---------|
| **Jest** | Unit testing |
| **React Testing Library** | Component testing |
| **Playwright** | E2E testing |
| **MSW** | API mocking |

### Test File Structure

```
src/
├── __tests__/
│   ├── components/
│   │   └── Button.test.tsx
│   ├── pages/
│   │   └── dashboard.test.tsx
│   ├── services/
│   │   └── library.service.test.ts
│   └── stores/
│       └── auth.store.test.ts
├── e2e/
│   ├── login.spec.ts
│   ├── library.spec.ts
│   └── feedback.spec.ts
```

### Test Naming Conventions

```typescript
// Unit Tests
describe('LibraryService', () => {
    it('should fetch all books', async () => {});
    it('should filter books by category', async () => {});
    it('should handle empty results', async () => {});
});

// Component Tests
describe('BookCard', () => {
    it('renders book title and author', () => {});
    it('shows available badge when copies available', () => {});
    it('calls onIssue when issue button clicked', () => {});
});

// E2E Tests
test('user can issue a book from library', async ({ page }) => {
    await page.goto('/dashboard/library');
    // ...
});
```

### Running Tests

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run specific test file
npm run test -- library.service.test.ts
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Approach

```tsx
// Example responsive component
<div className="
    grid 
    grid-cols-1          // Mobile
    sm:grid-cols-2       // Tablet
    lg:grid-cols-3       // Desktop
    xl:grid-cols-4       // Large
    gap-4
">
```

---

## ♿ Accessibility Standards

### WCAG Compliance

| Criterion | Implementation |
|-----------|----------------|
| **Color Contrast** | Minimum 4.5:1 ratio |
| **Keyboard Navigation** | All interactive elements focusable |
| **Screen Readers** | Semantic HTML + ARIA labels |
| **Focus Indicators** | Visible focus rings |
| **Alt Text** | All images have descriptions |

### Component Patterns

```tsx
// Accessible Button
<Button 
    aria-label="Add new book"
    aria-pressed={isActive}
    disabled={isLoading}
>
    <Plus className="w-4 h-4" aria-hidden="true" />
    <span>Add Book</span>
</Button>

// Accessible Form
<form aria-labelledby="form-title">
    <h2 id="form-title">Add New Book</h2>
    <label htmlFor="book-title">Title</label>
    <input 
        id="book-title" 
        aria-required="true"
        aria-invalid={!!errors.title}
        aria-describedby="title-error"
    />
    {errors.title && (
        <span id="title-error" role="alert">
            {errors.title.message}
        </span>
    )}
</form>
```

---

## 🔐 Security Best Practices

### Authentication Flow

```
1. User submits credentials
2. Server validates & returns JWT + Refresh Token
3. JWT stored in memory (not localStorage)
4. Refresh token in httpOnly cookie
5. JWT attached to API requests
6. Auto-refresh before expiry
```

### Security Measures

| Measure | Implementation |
|---------|----------------|
| **XSS Prevention** | Content sanitization, CSP headers |
| **CSRF Protection** | Same-site cookies, CSRF tokens |
| **SQL Injection** | Parameterized queries (Prisma) |
| **Rate Limiting** | API rate limits (100 req/min) |
| **Input Validation** | Zod schemas on all inputs |
| **Secure Headers** | HSTS, X-Frame-Options |

### Role-Based Access Control

```typescript
// Route protection middleware
const protectedRoute = (allowedRoles: Role[]) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                error: 'Access denied' 
            });
        }
        next();
    };
};

// Usage
app.get('/api/admin/users', 
    protectedRoute(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
    getUsersHandler
);
```

---

## 📊 Performance Optimization

### Bundle Optimization

```javascript
// next.config.js
module.exports = {
    experimental: {
        optimizeCss: true,
    },
    images: {
        domains: ['cdn.school-erp.com'],
        formats: ['image/avif', 'image/webp'],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
};
```

### Code Splitting

```tsx
// Dynamic imports for heavy components
const DataChart = dynamic(
    () => import('@/components/charts/DataChart'),
    { 
        loading: () => <ChartSkeleton />,
        ssr: false 
    }
);
```

### Caching Strategy

| Resource | Cache Duration |
|----------|----------------|
| Static assets | 1 year |
| API responses | 5 minutes (stale-while-revalidate) |
| User data | 1 minute |
| Real-time data | No cache |

---

## 📈 Module Statistics (Updated)

| Category | Count |
|----------|-------|
| **Total Pages** | 50+ |
| **Admin Modules** | 16 |
| **Student Portal Sections** | 14 |
| **Teacher Portal Sections** | 7 |
| **UI Components** | 20+ |
| **Zustand Stores** | 9 |
| **API Services** | 7 |
| **Type Definitions** | 7 |
| **Custom Hooks** | 2 |
| **API Endpoints** | 40+ |

---

## 📄 Related Documentation

| Document | Description |
|----------|-------------|
| `backend.md` | **Backend development specification** |
| `Documentation/PROJECT_OVERVIEW.md` | Complete project overview |
| `Documentation/DEMO_LOGIN_FIX.md` | Demo login implementation |
| `Documentation/HOMEWORK_SYSTEM.md` | Homework feature docs |
| `Documentation/DUMMY_DATA_ADDED.md` | Sample data information |

---

## 🗺️ Roadmap

### Q1 2026
- [ ] Real-time notifications (WebSocket)
- [ ] Parent mobile app
- [ ] Offline support (PWA)

### Q2 2026
- [ ] AI-powered analytics
- [ ] Multi-language support (i18n)
- [ ] Advanced reporting

### Q3 2026
- [ ] Integration with payment gateways
- [ ] LMS (Learning Management System)
- [ ] Video conferencing integration

---

> **Maintained by:** Development Team  
> **Last Review:** January 7, 2026  
> **Documentation Version:** 2.1

# 🔧 School ERP - Backend Development Prompt

> **Frontend:** Next.js 14 + TypeScript (Already Built)  
> **Backend:** Node.js + Express + Prisma + PostgreSQL

---

## 📋 TASK

Build a production-ready REST API for School ERP system. The frontend is already complete and expects the API endpoints defined below.

---

## 🛠️ TECH STACK

| Technology | Purpose |
|------------|---------|
| Node.js 18+ | Runtime |
| Express.js | API Framework |
| TypeScript | Language |
| PostgreSQL | Database |
| Prisma | ORM |
| JWT + bcrypt | Authentication |
| Zod | Validation |

---

## 📁 PROJECT STRUCTURE

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validator.ts
│   │   │
│   │   ├── student/
│   │   │   ├── student.controller.ts
│   │   │   ├── student.service.ts
│   │   │   ├── student.routes.ts
│   │   │   └── student.validator.ts
│   │   │
│   │   ├── teacher/
│   │   │   ├── teacher.controller.ts
│   │   │   ├── teacher.service.ts
│   │   │   ├── teacher.routes.ts
│   │   │   └── teacher.validator.ts
│   │   │
│   │   ├── class/
│   │   │   ├── class.controller.ts
│   │   │   ├── class.service.ts
│   │   │   └── class.routes.ts
│   │   │
│   │   ├── attendance/
│   │   │   ├── attendance.controller.ts
│   │   │   ├── attendance.service.ts
│   │   │   └── attendance.routes.ts
│   │   │
│   │   ├── calendar/
│   │   │   ├── calendar.controller.ts
│   │   │   ├── calendar.service.ts
│   │   │   └── calendar.routes.ts
│   │   │
│   │   ├── exam/
│   │   │   ├── exam.controller.ts
│   │   │   ├── exam.service.ts
│   │   │   └── exam.routes.ts
│   │   │
│   │   ├── fee/
│   │   │   ├── fee.controller.ts
│   │   │   ├── fee.service.ts
│   │   │   └── fee.routes.ts
│   │   │
│   │   ├── feedback/
│   │   │   ├── feedback.controller.ts
│   │   │   ├── feedback.service.ts
│   │   │   └── feedback.routes.ts
│   │   │
│   │   └── library/
│   │       ├── library.controller.ts
│   │       ├── library.service.ts
│   │       └── library.routes.ts
│   │
│   ├── common/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── password.ts
│   │   │   ├── token.ts
│   │   │   └── response.ts
│   │   │
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── config/
│   │   └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## 📊 DATABASE SCHEMA

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========== ENUMS ==========

enum Role {
  SUPER_ADMIN
  SCHOOL_ADMIN
  TEACHER
  STUDENT
  PARENT
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum EventType {
  HOLIDAY
  EXAM
  ACADEMIC
  EVENT
  MEETING
}

enum FeedbackType {
  POSITIVE
  NEUTRAL
  NEGATIVE
}

enum FeedbackStatus {
  PENDING
  REVIEWED
  RESOLVED
}

enum FeeStatus {
  PENDING
  PAID
  OVERDUE
}

enum BookStatus {
  AVAILABLE
  ISSUED
}

enum BookCategory {
  FICTION
  NON_FICTION
  SCIENCE
  MATHEMATICS
  HISTORY
  LITERATURE
  REFERENCE
  OTHER
}

// ========== MODELS ==========

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  role        Role
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  student     Student?
  teacher     Teacher?

  @@map("users")
}

model Student {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  firstName       String
  lastName        String
  admissionNumber String   @unique
  dateOfBirth     DateTime
  gender          Gender
  phone           String?
  address         String?
  photo           String?
  
  classId         String?
  class           Class?   @relation(fields: [classId], references: [id])
  rollNumber      Int?
  
  fatherName      String?
  fatherPhone     String?
  motherName      String?
  motherPhone     String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  attendance      Attendance[]
  feeRecords      FeeRecord[]
  examResults     ExamResult[]
  bookIssues      BookIssue[]
  feedbacks       Feedback[]

  @@map("students")
}

model Teacher {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  firstName       String
  lastName        String
  employeeId      String   @unique
  phone           String
  gender          Gender?
  qualification   String?
  joiningDate     DateTime
  photo           String?
  
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  classTeacher    Class?   @relation("ClassTeacher")
  timetableSlots  TimetableSlot[]
  attendance      Attendance[]
  calendarEvents  CalendarEvent[]
  bookIssues      BookIssue[]

  @@map("teachers")
}

model Class {
  id              String   @id @default(cuid())
  name            String   // "10-A"
  grade           Int
  section         String
  academicYear    String
  
  classTeacherId  String?  @unique
  classTeacher    Teacher? @relation("ClassTeacher", fields: [classTeacherId], references: [id])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  students        Student[]
  timetableSlots  TimetableSlot[]
  attendance      Attendance[]
  exams           Exam[]
  feeRecords      FeeRecord[]

  @@unique([grade, section, academicYear])
  @@map("classes")
}

model Subject {
  id          String   @id @default(cuid())
  name        String
  code        String   @unique
  
  createdAt   DateTime @default(now())

  timetableSlots TimetableSlot[]
  exams       Exam[]

  @@map("subjects")
}

model TimetableSlot {
  id          String   @id @default(cuid())
  classId     String
  class       Class    @relation(fields: [classId], references: [id])
  subjectId   String
  subject     Subject  @relation(fields: [subjectId], references: [id])
  teacherId   String
  teacher     Teacher  @relation(fields: [teacherId], references: [id])
  
  dayOfWeek   Int      // 0-4 (Mon-Fri)
  period      Int
  startTime   String
  endTime     String

  @@unique([classId, dayOfWeek, period])
  @@map("timetable_slots")
}

model Attendance {
  id          String   @id @default(cuid())
  studentId   String
  student     Student  @relation(fields: [studentId], references: [id])
  classId     String
  class       Class    @relation(fields: [classId], references: [id])
  date        DateTime @db.Date
  status      String   // PRESENT, ABSENT, LATE
  
  markedById  String
  markedBy    Teacher  @relation(fields: [markedById], references: [id])
  createdAt   DateTime @default(now())

  @@unique([studentId, date])
  @@map("attendance")
}

model CalendarEvent {
  id          String    @id @default(cuid())
  title       String
  description String?
  type        EventType
  startDate   DateTime  @db.Date
  endDate     DateTime  @db.Date
  startTime   String?
  endTime     String?
  isAllDay    Boolean   @default(true)
  location    String?
  
  applicableRoles   String[]
  applicableClasses String[]
  
  createdById String
  createdBy   Teacher   @relation(fields: [createdById], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("calendar_events")
}

model Exam {
  id          String   @id @default(cuid())
  name        String
  type        String   // MIDTERM, FINAL, WEEKLY
  classId     String
  class       Class    @relation(fields: [classId], references: [id])
  subjectId   String
  subject     Subject  @relation(fields: [subjectId], references: [id])
  
  date        DateTime @db.Date
  maxMarks    Int
  passingMarks Int
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  results     ExamResult[]

  @@map("exams")
}

model ExamResult {
  id            String   @id @default(cuid())
  examId        String
  exam          Exam     @relation(fields: [examId], references: [id])
  studentId     String
  student       Student  @relation(fields: [studentId], references: [id])
  
  marksObtained Float
  grade         String?
  isAbsent      Boolean  @default(false)
  
  createdAt     DateTime @default(now())

  @@unique([examId, studentId])
  @@map("exam_results")
}

model FeeStructure {
  id          String   @id @default(cuid())
  name        String
  amount      Float
  frequency   String   // MONTHLY, QUARTERLY, YEARLY
  grade       Int?
  academicYear String
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  feeRecords  FeeRecord[]

  @@map("fee_structures")
}

model FeeRecord {
  id              String    @id @default(cuid())
  studentId       String
  student         Student   @relation(fields: [studentId], references: [id])
  classId         String
  class           Class     @relation(fields: [classId], references: [id])
  feeStructureId  String
  feeStructure    FeeStructure @relation(fields: [feeStructureId], references: [id])
  
  amount          Float
  dueDate         DateTime  @db.Date
  status          FeeStatus @default(PENDING)
  paidAmount      Float     @default(0)
  paidDate        DateTime?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("fee_records")
}

model Feedback {
  id          String         @id @default(cuid())
  type        FeedbackType
  category    String
  message     String
  isAnonymous Boolean        @default(false)
  status      FeedbackStatus @default(PENDING)
  
  studentId   String?
  student     Student?       @relation(fields: [studentId], references: [id])
  
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@map("feedbacks")
}

model Book {
  id              String       @id @default(cuid())
  title           String
  author          String
  isbn            String       @unique
  category        BookCategory
  publisher       String?
  totalCopies     Int          @default(1)
  availableCopies Int          @default(1)
  status          BookStatus   @default(AVAILABLE)
  location        String?
  
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  issues          BookIssue[]

  @@map("books")
}

model BookIssue {
  id          String    @id @default(cuid())
  bookId      String
  book        Book      @relation(fields: [bookId], references: [id])
  
  studentId   String?
  student     Student?  @relation(fields: [studentId], references: [id])
  teacherId   String?
  teacher     Teacher?  @relation(fields: [teacherId], references: [id])
  
  issueDate   DateTime  @db.Date
  dueDate     DateTime  @db.Date
  returnDate  DateTime? @db.Date
  status      String    @default("ACTIVE")
  fine        Float?
  
  createdAt   DateTime  @default(now())

  @@map("book_issues")
}

model DigitalResource {
  id          String       @id @default(cuid())
  title       String
  description String?
  subject     String
  category    BookCategory
  type        String       // PDF, VIDEO, AUDIO
  fileUrl     String
  fileSize    String?
  downloads   Int          @default(0)
  
  applicableClasses String[]
  
  createdAt   DateTime     @default(now())

  @@map("digital_resources")
}
```

---

## 🔗 API ENDPOINTS

### Auth `/api/v1/auth`
```
POST   /login              # Login
POST   /logout             # Logout
POST   /refresh            # Refresh token
GET    /me                 # Current user
```

### Students `/api/v1/students`
```
GET    /                   # List students
GET    /:id                # Get student
POST   /                   # Create student
PUT    /:id                # Update student
DELETE /:id                # Delete student
GET    /:id/attendance     # Student attendance
GET    /:id/fees           # Student fees
GET    /:id/results        # Student results
```

### Teachers `/api/v1/teachers`
```
GET    /                   # List teachers
GET    /:id                # Get teacher
POST   /                   # Create teacher
PUT    /:id                # Update teacher
DELETE /:id                # Delete teacher
GET    /:id/timetable      # Teacher timetable
```

### Classes `/api/v1/classes`
```
GET    /                   # List classes
GET    /:id                # Get class
POST   /                   # Create class
PUT    /:id                # Update class
GET    /:id/students       # Class students
GET    /:id/timetable      # Class timetable
```

### Attendance `/api/v1/attendance`
```
GET    /class/:classId     # Class attendance
POST   /mark               # Mark attendance
GET    /student/:studentId # Student attendance
```

### Calendar `/api/v1/calendar`
```
GET    /events             # List events
GET    /events/:id         # Get event
POST   /events             # Create event
PUT    /events/:id         # Update event
DELETE /events/:id         # Delete event
GET    /summary            # Calendar summary
```

### Library `/api/v1/library`
```
GET    /books              # List books
GET    /books/:id          # Get book
POST   /books              # Add book
PUT    /books/:id          # Update book
POST   /issue              # Issue book
POST   /return             # Return book
GET    /digital            # Digital resources
GET    /summary            # Library stats
```

### Feedback `/api/v1/feedback`
```
GET    /                   # List feedback
GET    /:id                # Get feedback
POST   /                   # Submit feedback
PUT    /:id/status         # Update status
GET    /summary            # Feedback stats
```

### Fees `/api/v1/fees`
```
GET    /                   # List records
POST   /payment            # Process payment
GET    /structure          # Fee structure
GET    /student/:studentId # Student fees
GET    /reports            # Fee reports
```

### Exams `/api/v1/exams`
```
GET    /                   # List exams
POST   /                   # Create exam
POST   /:id/results        # Submit results
GET    /:id/results        # Get results
GET    /class/:classId     # Class exams
```

---

## 🔐 AUTH MIDDLEWARE

```typescript
// src/common/middleware/auth.middleware.ts
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// src/common/middleware/role.middleware.ts
export const authorize = (...roles: Role[]) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
```

---

## 📝 RESPONSE FORMAT

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}

// Error
{
  "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "..." }
}
```

---

## ⚙️ ENVIRONMENT

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/school_erp
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 SETUP

```bash
npm init -y
npm install express typescript prisma @prisma/client
npm install jsonwebtoken bcryptjs zod cors helmet
npm install -D @types/node @types/express nodemon ts-node

npx tsc --init
npx prisma init
npx prisma migrate dev
npm run dev
```

---

## ✅ IMPLEMENTATION ORDER

1. **Setup** - Express, Prisma, middleware
2. **Auth** - Login, JWT, role middleware
3. **Core** - Students, Teachers, Classes
4. **Features** - Attendance, Calendar, Exams
5. **Modules** - Fees, Library, Feedback
6. **Testing** - Unit & integration tests

---

> Build API endpoints to match the frontend service layer exactly.

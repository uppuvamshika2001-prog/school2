export type TeacherStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface TeacherQualification {
  id: string;
  degree: string;
  institution: string;
  yearOfCompletion: number;
  specialization?: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string; // e.g. "Mathematics", "Science"
  joinDate: string;
  status: TeacherStatus;
  qualifications: TeacherQualification[];
  avatarUrl?: string;
  documents?: TeacherDocument[];
}

export interface TeacherDocument {
  id: string;
  name: string;
  type: string; // e.g., 'PDF', 'Image'
  uploadDate: string; // ISO date string
  url: string; // Mock URL
  size: string; // e.g. '2.5 MB'
}

export interface SubjectAssignment {
  id: string;
  teacherId: string;
  subjectName: string;
  subjectCode: string;
  classId: string; // e.g. "10", "5"
  sectionId: string; // e.g. "A", "B"
  academicYear: string;
}

export interface TimetableEntry {
  id: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
  startTime: string; // "09:00"
  endTime: string;   // "09:45"
  subjectId: string;
  classId: string;
  sectionId: string;
  teacherId: string;
  roomNo?: string;
}

export interface TeacherAttendance {
  id: string;
  teacherId: string;
  date: string; // ISO Date
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  attendanceRate: number;
}

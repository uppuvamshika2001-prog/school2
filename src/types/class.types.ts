
export type AcademicYear = string;

export interface Section {
    id: string;
    name: string; // e.g., 'A', 'B'
    capacity: number;
    studentCount: number;
    classTeacherId?: string;
    classTeacherName?: string;
    classMonitorId?: string;
    classMonitorName?: string;
}

export interface Class {
    id: string;
    name: string; // e.g., 'Class 1', 'Class 2'
    sections: Section[];
    academicYear: AcademicYear;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface TimetableEntry {
    id: string;
    dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
    period: number;
    startTime: string;
    endTime: string;
    subjectId: string;
    subjectName: string;
    teacherId: string;
    teacherName: string;
    classId: string;
    sectionId: string;
    roomNo?: string;
}

export interface Student {
    id: string;
    name: string;
    rollNo: string;
    fatherName: string;
    motherName: string;
    guardianName: string;
    contactNumber: string;
    sectionId: string;
}

export interface ClassAssignmentRequest {
    classId: string;
    sectionId: string;
    teacherId?: string;
    monitorId?: string;
    academicYear: AcademicYear;
}

export interface ClassFilters {
    academicYear?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'ALL';
    search?: string;
}

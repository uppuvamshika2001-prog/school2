
export type ExamType = 'FA1' | 'FA2' | 'SA1' | 'FA3' | 'FA4' | 'SA2';

export interface StudentScore {
    id: string;
    studentId: string;
    studentName: string;
    rollNo: string;
    marks: number;
    maxMarks: number;
    percentage: number;
    status: 'Passed' | 'Failed';
}

export interface Exam {
    id: string;
    name: string;
    type: ExamType;
    startDate: string;
    endDate: string;
    status: 'Scheduled' | 'Upcoming' | 'Completed';
    classes: string[];
    totalSubjects: number;
    resultsPublished: boolean;
    averagePercentage?: number;
}

export interface SubjectResult {
    subjectId: string;
    subjectName: string;
    highestMarks: number;
    highestScorer: string;
    lowestMarks: number;
    lowestScorer: string;
    averageMarks: number;
    passPercentage: number;
}

export interface ClassResult {
    classId: string;
    className: string;
    examId: string;
    totalStudents: number;
    passed: number;
    failed: number;
    averageMarks: number;
    passPercentage: number;
    subjects: SubjectResult[];
}

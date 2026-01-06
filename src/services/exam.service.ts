
import { Exam, ClassResult, StudentScore, ExamType } from '@/types/exam.types';

// Mock Data
const MOCK_EXAMS: Exam[] = [
    {
        id: '1',
        name: 'Formative Assessment 1 (FA1) 2025-26',
        type: 'FA1',
        startDate: '2025-07-15',
        endDate: '2025-07-20',
        status: 'Completed',
        classes: ['10-A', '9-A', '11-A', '12-A'],
        totalSubjects: 8,
        resultsPublished: true,
        averagePercentage: 78.5,
    },
    {
        id: '2',
        name: 'Summative Assessment 1 (SA1) 2025-26',
        type: 'SA1',
        startDate: '2025-10-15',
        endDate: '2025-10-28',
        status: 'Completed',
        classes: ['10-A', '9-B', '10-B'],
        totalSubjects: 8,
        resultsPublished: true,
        averagePercentage: 72.8,
    }
];

const MOCK_SCORES: Record<string, StudentScore[]> = {
    'exam1-10A-math': [
        { id: '1', studentId: 'std-1', studentName: 'Arjun Sharma', rollNo: '10A001', marks: 95, maxMarks: 100, percentage: 95, status: 'Passed' },
        { id: '2', studentId: 'std-2', studentName: 'Priya Patel', rollNo: '10A002', marks: 88, maxMarks: 100, percentage: 88, status: 'Passed' },
        { id: '3', studentId: 'std-3', studentName: 'Rahul Kumar', rollNo: '10A003', marks: 35, maxMarks: 100, percentage: 35, status: 'Failed' },
    ]
};

class ExamService {
    async getExams(): Promise<Exam[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_EXAMS;
    }

    async getExamById(id: string): Promise<Exam | null> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_EXAMS.find(e => e.id === id) || null;
    }

    async getStudentsForMarksEntry(examId: string, classId: string, subjectId: string): Promise<StudentScore[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const key = `${examId}-${classId}-${subjectId}`;
        return MOCK_SCORES[key] || [
            { id: '1', studentId: 'std-1', studentName: 'Arjun Sharma', rollNo: '10A001', marks: 0, maxMarks: 100, percentage: 0, status: 'Failed' },
            { id: '2', studentId: 'std-2', studentName: 'Priya Patel', rollNo: '10A002', marks: 0, maxMarks: 100, percentage: 0, status: 'Failed' },
            { id: '3', studentId: 'std-3', studentName: 'Rahul Kumar', rollNo: '10A003', marks: 0, maxMarks: 100, percentage: 0, status: 'Failed' },
        ];
    }

    async saveMarks(examId: string, classId: string, subjectId: string, scores: StudentScore[]): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const key = `${examId}-${classId}-${subjectId}`;
        MOCK_SCORES[key] = scores;
    }

    async getResults(filters: { academicYear?: string; classId?: string; examType?: ExamType }): Promise<ClassResult[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mocking class-wise results
        return [
            {
                classId: 'cls-10a',
                className: '10-A',
                examId: '1',
                totalStudents: 35,
                passed: 32,
                failed: 3,
                averageMarks: 78.5,
                passPercentage: 91.4,
                subjects: [
                    {
                        subjectId: 'sub-math',
                        subjectName: 'Mathematics',
                        highestMarks: 98,
                        highestScorer: 'Arjun Sharma',
                        lowestMarks: 42,
                        lowestScorer: 'Rahul Kumar',
                        averageMarks: 75.2,
                        passPercentage: 88.5
                    },
                    {
                        subjectId: 'sub-sci',
                        subjectName: 'Science',
                        highestMarks: 95,
                        highestScorer: 'Priya Patel',
                        lowestMarks: 38,
                        lowestScorer: 'Suresh Babu',
                        averageMarks: 72.8,
                        passPercentage: 85.7
                    }
                ]
            }
        ];
    }
}

export const examService = new ExamService();

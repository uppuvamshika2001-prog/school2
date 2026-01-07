
import { Exam, ClassResult, StudentScore, ExamType, SubjectResult } from '@/types/exam.types';

export interface WeeklyTest {
    id: string;
    week: string;
    subject: string;
    class: string;
    date: string;
    maxMarks: number;
    status: 'Scheduled' | 'Upcoming' | 'Completed';
}

// Shared data storage
let customExams: Exam[] = [];
let customWeeklyTests: WeeklyTest[] = [];
let savedScores: Record<string, StudentScore[]> = {};
let savedWeeklyScores: Record<string, StudentScore[]> = {};

// Default exams
const DEFAULT_EXAMS: Exam[] = [
    {
        id: 'exam-1',
        name: 'Formative Assessment 1 (FA1) 2025-26',
        type: 'FA1',
        startDate: '2025-07-15',
        endDate: '2025-07-20',
        status: 'Completed',
        classes: ['10-A', '10-B', '9-A', '9-B'],
        totalSubjects: 8,
        resultsPublished: true,
        averagePercentage: 78.5,
    },
    {
        id: 'exam-2',
        name: 'Summative Assessment 1 (SA1) 2025-26',
        type: 'SA1',
        startDate: '2025-10-15',
        endDate: '2025-10-28',
        status: 'Completed',
        classes: ['10-A', '10-B', '9-A', '9-B'],
        totalSubjects: 8,
        resultsPublished: true,
        averagePercentage: 72.8,
    }
];

// Default Weekly Tests
const DEFAULT_WEEKLY: WeeklyTest[] = [
    { id: 'w-1', week: 'Week 1', subject: 'Mathematics', class: '10-A', date: '2025-08-01', maxMarks: 25, status: 'Completed' },
    { id: 'w-2', week: 'Week 1', subject: 'Science', class: '10-A', date: '2025-08-02', maxMarks: 25, status: 'Completed' },
];

// Default students for marks entry
const DEFAULT_STUDENTS = [
    { id: '1', studentId: 'std-1', studentName: 'Arjun Sharma', rollNo: '001' },
    { id: '2', studentId: 'std-2', studentName: 'Priya Patel', rollNo: '002' },
    { id: '3', studentId: 'std-3', studentName: 'Rahul Kumar', rollNo: '003' },
    { id: '4', studentId: 'std-4', studentName: 'Sneha Gupta', rollNo: '004' },
    { id: '5', studentId: 'std-5', studentName: 'Vikram Singh', rollNo: '005' },
    { id: '6', studentId: 'std-6', studentName: 'Ananya Rao', rollNo: '006' },
    { id: '7', studentId: 'std-7', studentName: 'Karthik Iyer', rollNo: '007' },
    { id: '8', studentId: 'std-8', studentName: 'Meera Nair', rollNo: '008' },
    { id: '9', studentId: 'std-9', studentName: 'Suresh Babu', rollNo: '009' },
    { id: '10', studentId: 'std-10', studentName: 'Lakshmi Rao', rollNo: '010' },
];

class ExamService {
    // Regular Exams
    async getExams(): Promise<Exam[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return [...DEFAULT_EXAMS, ...customExams];
    }

    async addExam(exam: Omit<Exam, 'id' | 'resultsPublished' | 'averagePercentage'>): Promise<Exam> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newExam: Exam = {
            id: `exam-${Date.now()}`,
            ...exam,
            resultsPublished: false,
            averagePercentage: 0,
        };
        customExams.push(newExam);
        return newExam;
    }

    // Weekly Tests
    async getWeeklyTests(): Promise<WeeklyTest[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return [...DEFAULT_WEEKLY, ...customWeeklyTests];
    }

    async addWeeklyTest(test: Omit<WeeklyTest, 'id'>): Promise<WeeklyTest> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newTest: WeeklyTest = {
            id: `weekly-${Date.now()}`,
            ...test,
        };
        customWeeklyTests.push(newTest);
        return newTest;
    }

    // Marks Entry
    async getStudentsForMarksEntry(examId: string, classId: string, subjectId: string, isWeekly: boolean = false): Promise<StudentScore[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const key = `${examId}-${classId}-${subjectId}`;
        const scoresRef = isWeekly ? savedWeeklyScores : savedScores;

        if (scoresRef[key]) {
            return scoresRef[key];
        }

        // Find max marks for the exam/test
        let maxMarks = 100;
        if (isWeekly) {
            const test = [...DEFAULT_WEEKLY, ...customWeeklyTests].find(t => t.id === examId);
            if (test) maxMarks = test.maxMarks;
        }

        return DEFAULT_STUDENTS.map(student => ({
            ...student,
            rollNo: `${classId.toUpperCase()}${student.rollNo}`,
            marks: 0,
            maxMarks: maxMarks,
            percentage: 0,
            status: 'Failed' as const
        }));
    }

    async saveMarks(examId: string, classId: string, subjectId: string, scores: StudentScore[], isWeekly: boolean = false): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const key = `${examId}-${classId}-${subjectId}`;
        if (isWeekly) {
            savedWeeklyScores[key] = scores;
        } else {
            savedScores[key] = scores;
        }
    }

    // Results
    async getResults(filters: { classId?: string; examType?: ExamType }): Promise<ClassResult[]> {
        return this.computeResults(savedScores, [...DEFAULT_EXAMS, ...customExams], filters);
    }

    async getWeeklyResults(filters: { classId?: string; weekName?: string }): Promise<ClassResult[]> {
        return this.computeResults(savedWeeklyScores, [...DEFAULT_WEEKLY, ...customWeeklyTests].map(t => ({ id: t.id, name: t.week, type: 'FA1' as any, startDate: t.date, endDate: t.date, status: t.status, classes: [t.class], totalSubjects: 1, resultsPublished: true })), filters as any);
    }

    private computeResults(scoresSource: Record<string, StudentScore[]>, examRef: any[], filters: { classId?: string; examType?: string }): ClassResult[] {
        const results: ClassResult[] = [];
        const groupedData: Record<string, Record<string, Record<string, StudentScore[]>>> = {};

        for (const [key, scores] of Object.entries(scoresSource)) {
            const parts = key.split('-');
            const examId = parts[0];
            const classId = parts[1];
            const subjectId = parts.slice(2).join('-');

            if (filters.classId && classId !== filters.classId) continue;

            if (!groupedData[examId]) groupedData[examId] = {};
            if (!groupedData[examId][classId]) groupedData[examId][classId] = {};
            groupedData[examId][classId][subjectId] = scores;
        }

        for (const [examId, classData] of Object.entries(groupedData)) {
            const exam = examRef.find(e => e.id === examId);
            if (filters.examType && exam?.type !== filters.examType) continue;

            for (const [classId, subjectData] of Object.entries(classData)) {
                const subjects: SubjectResult[] = [];
                let allScores: StudentScore[] = [];

                for (const [subjectId, scores] of Object.entries(subjectData)) {
                    const subjectName = subjectId.charAt(0).toUpperCase() + subjectId.slice(1);
                    const validScores = scores.filter(s => s.marks >= 0);
                    if (validScores.length === 0) continue;

                    allScores = [...allScores, ...validScores];
                    const passed = validScores.filter(s => s.percentage >= 40).length;
                    const avgMarks = validScores.reduce((sum, s) => sum + s.percentage, 0) / validScores.length;

                    const sorted = [...validScores].sort((a, b) => b.marks - a.marks);
                    subjects.push({
                        subjectId, subjectName,
                        highestMarks: sorted[0]?.marks || 0,
                        highestScorer: sorted[0]?.studentName || '-',
                        lowestMarks: sorted[sorted.length - 1]?.marks || 0,
                        lowestScorer: sorted[sorted.length - 1]?.studentName || '-',
                        averageMarks: Math.round(avgMarks * 10) / 10,
                        passPercentage: Math.round((passed / validScores.length) * 1000) / 10
                    });
                }

                if (subjects.length > 0) {
                    const uniqueStudents = Array.from(new Map(allScores.map(s => [s.studentId, s])).values());
                    const passed = uniqueStudents.filter(s => s.percentage >= 40).length;
                    results.push({
                        classId: `${examId}-${classId}`,
                        className: `${classId.toUpperCase()} - ${exam?.name || exam?.week || 'Result'}`,
                        examId,
                        totalStudents: uniqueStudents.length,
                        passed,
                        failed: uniqueStudents.length - passed,
                        averageMarks: Math.round((allScores.reduce((sum, s) => sum + s.percentage, 0) / allScores.length) * 10) / 10,
                        passPercentage: Math.round((passed / uniqueStudents.length) * 1000) / 10,
                        subjects
                    });
                }
            }
        }
        return results;
    }

    private getDefaultResults(): ClassResult[] {
        return [{
            classId: 'cls-10a', className: '10-A - Default Results', examId: 'exam-1',
            totalStudents: 35, passed: 32, failed: 3, averageMarks: 78.5, passPercentage: 91.4,
            subjects: [{
                subjectId: 'mathematics', subjectName: 'Mathematics', highestMarks: 98, highestScorer: 'Arjun Sharma',
                lowestMarks: 42, lowestScorer: 'Rahul Kumar', averageMarks: 75.2, passPercentage: 88.5
            }]
        }];
    }
}

export const examService = new ExamService();

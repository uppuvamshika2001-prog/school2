
import { create } from 'zustand';
import { Exam, ClassResult, StudentScore, ExamType } from '@/types/exam.types';
import { examService, WeeklyTest } from '@/services/exam.service';

interface ExamState {
    exams: Exam[];
    weeklyTests: WeeklyTest[];
    isLoading: boolean;
    error: string | null;
    currentScores: StudentScore[];
    results: ClassResult[];
    weeklyResults: ClassResult[];

    // Actions
    fetchExams: () => Promise<void>;
    fetchWeeklyTests: () => Promise<void>;
    addExam: (exam: Omit<Exam, 'id' | 'resultsPublished' | 'averagePercentage'>) => Promise<Exam>;
    addWeeklyTest: (test: Omit<WeeklyTest, 'id'>) => Promise<WeeklyTest>;
    fetchScores: (examId: string, classId: string, subjectId: string, isWeekly?: boolean) => Promise<void>;
    saveScores: (examId: string, classId: string, subjectId: string, scores: StudentScore[], isWeekly?: boolean) => Promise<void>;
    fetchResults: (filters: { classId?: string; examType?: ExamType }) => Promise<void>;
    fetchWeeklyResults: (filters: { classId?: string; weekName?: string }) => Promise<void>;
}

export const useExamStore = create<ExamState>((set) => ({
    exams: [],
    weeklyTests: [],
    isLoading: false,
    error: null,
    currentScores: [],
    results: [],
    weeklyResults: [],

    fetchExams: async () => {
        set({ isLoading: true });
        try {
            const data = await examService.getExams();
            set({ exams: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    fetchWeeklyTests: async () => {
        set({ isLoading: true });
        try {
            const data = await examService.getWeeklyTests();
            set({ weeklyTests: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    addExam: async (examData) => {
        set({ isLoading: true });
        try {
            const newExam = await examService.addExam(examData);
            const data = await examService.getExams();
            set({ exams: data, isLoading: false });
            return newExam;
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
            throw err;
        }
    },

    addWeeklyTest: async (testData) => {
        set({ isLoading: true });
        try {
            const newTest = await examService.addWeeklyTest(testData);
            const data = await examService.getWeeklyTests();
            set({ weeklyTests: data, isLoading: false });
            return newTest;
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
            throw err;
        }
    },

    fetchScores: async (examId, classId, subjectId, isWeekly) => {
        set({ isLoading: true, currentScores: [] });
        try {
            const data = await examService.getStudentsForMarksEntry(examId, classId, subjectId, isWeekly);
            set({ currentScores: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    saveScores: async (examId, classId, subjectId, scores, isWeekly) => {
        set({ isLoading: true });
        try {
            await examService.saveMarks(examId, classId, subjectId, scores, isWeekly);
            set({ isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    fetchResults: async (filters) => {
        set({ isLoading: true });
        try {
            const data = await examService.getResults(filters);
            set({ results: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    fetchWeeklyResults: async (filters) => {
        set({ isLoading: true });
        try {
            const data = await examService.getWeeklyResults(filters);
            set({ weeklyResults: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    }
}));

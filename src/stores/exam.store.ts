
import { create } from 'zustand';
import { Exam, ClassResult, StudentScore, ExamType } from '@/types/exam.types';
import { examService } from '@/services/exam.service';

interface ExamState {
    exams: Exam[];
    isLoading: boolean;
    error: string | null;
    currentScores: StudentScore[];
    results: ClassResult[];

    // Actions
    fetchExams: () => Promise<void>;
    fetchScores: (examId: string, classId: string, subjectId: string) => Promise<void>;
    saveScores: (examId: string, classId: string, subjectId: string, scores: StudentScore[]) => Promise<void>;
    fetchResults: (filters: { classId?: string; examType?: ExamType }) => Promise<void>;
}

export const useExamStore = create<ExamState>((set) => ({
    exams: [],
    isLoading: false,
    error: null,
    currentScores: [],
    results: [],

    fetchExams: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await examService.getExams();
            set({ exams: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    fetchScores: async (examId, classId, subjectId) => {
        set({ isLoading: true, error: null });
        try {
            const data = await examService.getStudentsForMarksEntry(examId, classId, subjectId);
            set({ currentScores: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    saveScores: async (examId, classId, subjectId, scores) => {
        set({ isLoading: true, error: null });
        try {
            await examService.saveMarks(examId, classId, subjectId, scores);
            set({ isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    fetchResults: async (filters) => {
        set({ isLoading: true, error: null });
        try {
            const data = await examService.getResults(filters);
            set({ results: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    }
}));

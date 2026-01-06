
import { create } from 'zustand';
import { feeService } from '@/services/fee.service';
import { FeeStructure, ClassFeeSummary, StudentFeeStatus } from '@/types/fee.types';

interface FeeState {
    structures: FeeStructure[];
    summaries: ClassFeeSummary[];
    studentFees: StudentFeeStatus[];
    isLoading: boolean;
    error: string | null;

    fetchStructures: () => Promise<void>;
    fetchSummaries: () => Promise<void>;
    fetchStudentFees: (classId?: string) => Promise<void>;
    addStructure: (structure: Partial<FeeStructure>) => Promise<void>;
}

export const useFeeStore = create<FeeState>((set) => ({
    structures: [],
    summaries: [],
    studentFees: [],
    isLoading: false,
    error: null,

    fetchStructures: async () => {
        set({ isLoading: true, error: null });
        try {
            const structures = await feeService.getFeeStructures();
            set({ structures, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch fee structures', isLoading: false });
        }
    },

    fetchSummaries: async () => {
        set({ isLoading: true, error: null });
        try {
            const summaries = await feeService.getClassSummaries();
            set({ summaries, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch fee summaries', isLoading: false });
        }
    },

    fetchStudentFees: async (classId?: string) => {
        set({ isLoading: true, error: null });
        try {
            const studentFees = await feeService.getStudentFeeStatus(classId);
            set({ studentFees, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch student fee status', isLoading: false });
        }
    },

    addStructure: async (structure: Partial<FeeStructure>) => {
        set({ isLoading: true, error: null });
        try {
            const newStructure = await feeService.saveFeeStructure(structure);
            set((state) => ({
                structures: [newStructure, ...state.structures],
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to save fee structure', isLoading: false });
        }
    }
}));

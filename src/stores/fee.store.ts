
import { create } from 'zustand';
import { feeService } from '@/services/fee.service';
import { FeeStructure, ClassFeeSummary, StudentFeeStatus } from '@/types/fee.types';

interface PaymentRecord {
    id: string;
    student: string;
    admissionNumber: string;
    class: string;
    type: string;
    amount: number;
    date: string;
    mode: string;
    status: 'Success' | 'Pending' | 'Failed';
    utrNumber?: string;
    chequeNumber?: string;
    bankName?: string;
}

interface FeeState {
    structures: FeeStructure[];
    summaries: ClassFeeSummary[];
    studentFees: StudentFeeStatus[];
    payments: PaymentRecord[];
    isLoading: boolean;
    error: string | null;

    fetchStructures: () => Promise<void>;
    fetchSummaries: () => Promise<void>;
    fetchStudentFees: (classId?: string) => Promise<void>;
    addStructure: (structure: Partial<FeeStructure>) => Promise<void>;
    collectPayment: (payment: Omit<PaymentRecord, 'id' | 'status'> & { status?: PaymentRecord['status'] }) => void;
}

export const useFeeStore = create<FeeState>((set) => ({
    structures: [],
    summaries: [],
    studentFees: [],
    payments: [
        { id: 'RCP-2024-001', student: 'Aarav Patel', admissionNumber: '2024-AD-001', class: '10-A', type: 'Tuition Fee (Jan)', amount: 5500, date: '2024-01-02', mode: 'Online', status: 'Success' },
        { id: 'RCP-2024-002', student: 'Diya Sharma', admissionNumber: '2024-AD-002', class: '9-B', type: 'Tuition Fee (Jan)', amount: 5500, date: '2024-01-02', mode: 'Cash', status: 'Success' },
        { id: 'RCP-2024-003', student: 'Vihaan Kumar', admissionNumber: '2024-AD-003', class: '12-A', type: 'Science Lab Fee', amount: 12000, date: '2024-01-01', mode: 'Online', status: 'Pending' },
        { id: 'RCP-2024-004', student: 'Ananya Singh', admissionNumber: '2024-AD-004', class: '8-C', type: 'Transport Fee (Q4)', amount: 4500, date: '2023-12-31', mode: 'Cheque', status: 'Success' },
        { id: 'RCP-2024-005', student: 'Rohan Gupta', admissionNumber: '2024-AD-005', class: '11-B', type: 'Tuition Fee (Jan)', amount: 6500, date: '2023-12-30', mode: 'Online', status: 'Failed' },
        { id: 'RCP-2024-006', student: 'Myra Reddy', admissionNumber: '2024-AD-006', class: '5-A', type: 'Annual Fee', amount: 25000, date: '2023-12-28', mode: 'Bank Transfer', status: 'Success' },
        { id: 'RCP-2024-007', student: 'Arjun Nair', admissionNumber: '2024-AD-007', class: '7-B', type: 'Tuition Fee (Jan)', amount: 4500, date: '2023-12-28', mode: 'Online', status: 'Success' },
        { id: 'RCP-2024-008', student: 'Ishaan Verma', admissionNumber: '2024-AD-008', class: '10-C', type: 'Library Fine', amount: 150, date: '2023-12-27', mode: 'Cash', status: 'Success' },
    ],
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
    },

    collectPayment: (payment) => {
        set((state) => {
            const newId = `RCP-2024-${String(state.payments.length + 1).padStart(3, '0')}`;
            const newStatus = (payment as any).status || 'Success';
            const newPayment = { ...payment, id: newId, status: newStatus as any };
            return {
                payments: [newPayment, ...state.payments]
            };
        });
    }
}));

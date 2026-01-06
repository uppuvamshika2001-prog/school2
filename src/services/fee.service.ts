
import { FeeStructure, ClassFeeSummary, StudentFeeStatus, PaymentTransaction } from '@/types/fee.types';

const MOCK_STRUCTURES: FeeStructure[] = [
    {
        id: '1',
        classId: 'cls-1',
        className: 'Class 10',
        academicYear: '2025-26',
        categories: [
            { category: 'Tuition', amount: 45000 },
            { category: 'Transport', amount: 12000 },
            { category: 'Examination', amount: 3000 }
        ],
        totalAmount: 60000,
        updatedAt: '2024-03-15T10:00:00Z'
    },
    {
        id: '2',
        classId: 'cls-2',
        className: 'Class 9',
        academicYear: '2025-26',
        categories: [
            { category: 'Tuition', amount: 42000 },
            { category: 'Transport', amount: 12000 },
            { category: 'Examination', amount: 3000 }
        ],
        totalAmount: 57000,
        updatedAt: '2024-03-14T11:30:00Z'
    }
];

const MOCK_SUMMARIES: ClassFeeSummary[] = [
    {
        classId: 'cls-1',
        className: 'Class 10',
        totalStudents: 158,
        collectedCount: 120,
        pendingCount: 38,
        totalAmount: 9480000,
        collectedAmount: 7200000,
        pendingAmount: 2280000
    },
    {
        classId: 'cls-2',
        className: 'Class 9',
        totalStudents: 145,
        collectedCount: 95,
        pendingCount: 50,
        totalAmount: 8265000,
        collectedAmount: 5415000,
        pendingAmount: 2850000
    }
];

const MOCK_STUDENT_FEES: StudentFeeStatus[] = [
    {
        studentId: 'st-1',
        studentName: 'Arjun Sharma',
        rollNo: '10A001',
        classId: 'cls-10',
        className: 'Class 10-A',
        totalFee: 60000,
        paidAmount: 60000,
        balanceAmount: 0,
        status: 'Paid',
        lastPaymentDate: '2024-01-10'
    },
    {
        studentId: 'st-2',
        studentName: 'Priya Patel',
        rollNo: '10A002',
        classId: 'cls-10',
        className: 'Class 10-A',
        totalFee: 60000,
        paidAmount: 45000,
        balanceAmount: 15000,
        status: 'Partial',
        lastPaymentDate: '2024-02-15'
    },
    {
        studentId: 'st-3',
        studentName: 'Rahul Kumar',
        rollNo: '10A003',
        classId: 'cls-10',
        className: 'Class 10-A',
        totalFee: 60000,
        paidAmount: 0,
        balanceAmount: 60000,
        status: 'Unpaid'
    },
    {
        studentId: 'st-4',
        studentName: 'Amit Singh',
        rollNo: '09A001',
        classId: 'cls-9',
        className: 'Class 9-A',
        totalFee: 57000,
        paidAmount: 57000,
        balanceAmount: 0,
        status: 'Paid',
        lastPaymentDate: '2024-01-05'
    }
];

export const feeService = {
    getFeeStructures: async (): Promise<FeeStructure[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_STRUCTURES), 500));
    },

    getClassSummaries: async (): Promise<ClassFeeSummary[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_SUMMARIES), 500));
    },

    getStudentFeeStatus: async (classId?: string): Promise<StudentFeeStatus[]> => {
        const filtered = classId ? MOCK_STUDENT_FEES.filter(s => s.classId === classId) : MOCK_STUDENT_FEES;
        return new Promise((resolve) => setTimeout(() => resolve(filtered), 500));
    },

    saveFeeStructure: async (structure: Partial<FeeStructure>): Promise<FeeStructure> => {
        const newStructure = {
            ...structure,
            id: Math.random().toString(36).substr(2, 9),
            updatedAt: new Date().toISOString()
        } as FeeStructure;
        return new Promise((resolve) => setTimeout(() => resolve(newStructure), 800));
    }
};

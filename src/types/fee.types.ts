
export type FeeCategory = 'Tuition' | 'Transport' | 'Hostel' | 'Examination' | 'Library' | 'Others';

export interface FeeStructure {
    id: string;
    classId: string;
    className: string;
    academicYear: string;
    categories: {
        category: FeeCategory;
        amount: number;
    }[];
    totalAmount: number;
    updatedAt: string;
}

export interface ClassFeeSummary {
    classId: string;
    className: string;
    totalStudents: number;
    collectedCount: number;
    pendingCount: number;
    totalAmount: number;
    collectedAmount: number;
    pendingAmount: number;
}

export interface StudentFeeStatus {
    studentId: string;
    studentName: string;
    admissionNumber: string;
    rollNo: string;
    classId: string;
    className: string;
    totalFee: number;
    paidAmount: number;
    balanceAmount: number;
    status: 'Paid' | 'Partial' | 'Unpaid';
    lastPaymentDate?: string;
}

export interface PaymentTransaction {
    id: string;
    studentId: string;
    studentName: string;
    admissionNumber: string;
    amount: number;
    category: FeeCategory;
    method: 'Cash' | 'Card' | 'UPI' | 'Net Banking';
    status: 'Success' | 'Pending' | 'Failed';
    date: string;
}

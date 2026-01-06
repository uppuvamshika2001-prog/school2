export type LeaveRole = 'STUDENT' | 'TEACHER';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Leave {
    id: string;
    userId: string;
    userName: string; // Added for display purposes
    role: LeaveRole;
    fromDate: string; // ISO Date string
    toDate: string; // ISO Date string
    reason: string;
    status: LeaveStatus;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLeavePayload {
    fromDate: Date;
    toDate: Date;
    reason: string;
}

export interface LeaveFilters {
    status?: LeaveStatus;
    role?: LeaveRole;
}

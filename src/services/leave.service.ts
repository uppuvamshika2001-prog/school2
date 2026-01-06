import axios from 'axios';
import { CreateLeavePayload, Leave, LeaveRole } from '@/types/leave';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const MOCK_TEACHER_LEAVES: Leave[] = [
    {
        id: '101',
        userId: 't1',
        userName: 'Priya Sharma',
        role: 'TEACHER',
        fromDate: new Date(Date.now() + 86400000).toISOString(),
        toDate: new Date(Date.now() + 172800000).toISOString(),
        reason: 'Personal leave for family function',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '102',
        userId: 't2',
        userName: 'Rahul Verma',
        role: 'TEACHER',
        fromDate: new Date(Date.now() + 432000000).toISOString(),
        toDate: new Date(Date.now() + 518400000).toISOString(),
        reason: 'Medical checkup',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '103',
        userId: 't3',
        userName: 'Anjali Gupta',
        role: 'TEACHER',
        fromDate: new Date(Date.now() + 632000000).toISOString(),
        toDate: new Date(Date.now() + 718400000).toISOString(),
        reason: 'Urgent personal work',
        status: 'REJECTED',
        rejectionReason: 'School event on this date',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

const MOCK_STUDENT_LEAVES: Leave[] = [
    {
        id: '201',
        userId: 's1',
        userName: 'Aarav Patel',
        role: 'STUDENT',
        fromDate: new Date(Date.now() + 172800000).toISOString(),
        toDate: new Date(Date.now() + 259200000).toISOString(),
        reason: 'Sister marriage',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '202',
        userId: 's2',
        userName: 'Diya Singh',
        role: 'STUDENT',
        fromDate: new Date(Date.now() - 432000000).toISOString(),
        toDate: new Date(Date.now() - 345600000).toISOString(),
        reason: 'Sick leave',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

class LeaveService {
    // STUDENT & TEACHER: Apply for leave
    async applyLeave(payload: CreateLeavePayload, role: LeaveRole): Promise<Leave> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newLeave: Leave = {
            id: Math.random().toString(36).substr(2, 9),
            userId: 'current-user',
            userName: 'Current User',
            role,
            fromDate: payload.fromDate.toISOString(),
            toDate: payload.toDate.toISOString(),
            reason: payload.reason,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        if (role === 'TEACHER') MOCK_TEACHER_LEAVES.unshift(newLeave);
        else MOCK_STUDENT_LEAVES.unshift(newLeave);
        return newLeave;
    }

    // STUDENT & TEACHER: Get my leaves
    async getMyLeaves(): Promise<Leave[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...MOCK_TEACHER_LEAVES, ...MOCK_STUDENT_LEAVES].filter(l => l.userId === 'current-user');
    }

    // ADMIN: Get all leaves by type
    async getLeavesByRole(role: LeaveRole): Promise<Leave[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (role === 'TEACHER') return [...MOCK_TEACHER_LEAVES];
        if (role === 'STUDENT') return [...MOCK_STUDENT_LEAVES];
        return [];
    }

    // ADMIN: Approve leave
    async approveLeave(leaveId: string): Promise<Leave> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const leave = [...MOCK_TEACHER_LEAVES, ...MOCK_STUDENT_LEAVES].find(l => l.id === leaveId);
        if (leave) {
            leave.status = 'APPROVED';
            leave.updatedAt = new Date().toISOString();
            return { ...leave };
        }
        throw new Error('Leave not found');
    }

    // ADMIN: Reject leave
    async rejectLeave(leaveId: string, reason: string): Promise<Leave> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const leave = [...MOCK_TEACHER_LEAVES, ...MOCK_STUDENT_LEAVES].find(l => l.id === leaveId);
        if (leave) {
            leave.status = 'REJECTED';
            leave.rejectionReason = reason;
            leave.updatedAt = new Date().toISOString();
            return { ...leave };
        }
        throw new Error('Leave not found');
    }
}


export const leaveService = new LeaveService();


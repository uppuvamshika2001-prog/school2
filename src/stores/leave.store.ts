import { create } from 'zustand';
import { CreateLeavePayload, Leave, LeaveRole } from '@/types/leave';
import { leaveService } from '@/services/leave.service';
import { toast } from 'sonner';

interface LeaveState {
    myLeaves: Leave[];
    studentLeaves: Leave[];
    teacherLeaves: Leave[];
    selectedLeave: Leave | null;
    isLoading: boolean;
    isSubmitting: boolean;

    // Actions
    fetchMyLeaves: () => Promise<void>;
    fetchStudentLeaves: () => Promise<void>;
    fetchTeacherLeaves: () => Promise<void>;
    setSelectedLeave: (leave: Leave | null) => void;
    applyLeave: (payload: CreateLeavePayload, role: LeaveRole) => Promise<boolean>;
    approveLeave: (leaveId: string) => Promise<void>;
    rejectLeave: (leaveId: string, reason: string) => Promise<void>;
}

export const useLeaveStore = create<LeaveState>((set, get) => ({
    myLeaves: [],
    studentLeaves: [],
    teacherLeaves: [],
    selectedLeave: null,
    isLoading: false,
    isSubmitting: false,

    setSelectedLeave: (leave) => set({ selectedLeave: leave }),

    fetchMyLeaves: async () => {
        set({ isLoading: true });
        try {
            const data = await leaveService.getMyLeaves();
            set({ myLeaves: data });
        } catch (error) {
            console.error('Failed to fetch leaves:', error);
            toast.error('Failed to load your leave history');
        } finally {
            set({ isLoading: false });
        }
    },

    fetchStudentLeaves: async () => {
        set({ isLoading: true });
        try {
            const data = await leaveService.getLeavesByRole('STUDENT');
            set({ studentLeaves: data });
        } catch (error) {
            toast.error('Failed to load student leaves');
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTeacherLeaves: async () => {
        set({ isLoading: true });
        try {
            const data = await leaveService.getLeavesByRole('TEACHER');
            set({ teacherLeaves: data });
        } catch (error) {
            toast.error('Failed to load teacher leaves');
        } finally {
            set({ isLoading: false });
        }
    },

    applyLeave: async (payload, role) => {
        set({ isSubmitting: true });
        try {
            const newLeave = await leaveService.applyLeave(payload, role);
            set(state => ({
                myLeaves: [newLeave, ...state.myLeaves]
            }));
            toast.success('Leave application submitted successfully');
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit leave application');
            return false;
        } finally {
            set({ isSubmitting: false });
        }
    },

    approveLeave: async (leaveId) => {
        try {
            const updatedLeave = await leaveService.approveLeave(leaveId);

            // Update local state in all lists to stay in sync
            set(state => ({
                studentLeaves: state.studentLeaves.map(l => l.id === leaveId ? updatedLeave : l),
                teacherLeaves: state.teacherLeaves.map(l => l.id === leaveId ? updatedLeave : l),
                myLeaves: state.myLeaves.map(l => l.id === leaveId ? updatedLeave : l)
            }));

            toast.success('Leave approved');
        } catch (error) {
            toast.error('Failed to approve leave');
        }
    },

    rejectLeave: async (leaveId, reason) => {
        try {
            const updatedLeave = await leaveService.rejectLeave(leaveId, reason);

            // Update local state in all lists to stay in sync
            set(state => ({
                studentLeaves: state.studentLeaves.map(l => l.id === leaveId ? updatedLeave : l),
                teacherLeaves: state.teacherLeaves.map(l => l.id === leaveId ? updatedLeave : l),
                myLeaves: state.myLeaves.map(l => l.id === leaveId ? updatedLeave : l)
            }));

            toast.success('Leave rejected');
        } catch (error) {
            toast.error('Failed to reject leave');
        }
    }
}));

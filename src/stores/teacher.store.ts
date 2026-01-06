import { create } from 'zustand';
import { Teacher } from '@/types/teacher.types';
import { teacherService } from '@/services/teacher.service';

interface TeacherState {
    teachers: Teacher[];
    isLoading: boolean;
    error: string | null;
    selectedTeacher: Teacher | null;
    filters: {
        search: string;
        status: string;
    };

    // Actions
    fetchTeachers: () => Promise<void>;
    setSearch: (query: string) => void;
    setStatusFilter: (status: string) => void;
    selectTeacher: (id: string | null) => void;
}

export const useTeacherStore = create<TeacherState>((set, get) => ({
    teachers: [],
    isLoading: false,
    error: null,
    selectedTeacher: null,
    filters: {
        search: '',
        status: 'ALL',
    },

    fetchTeachers: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const data = await teacherService.getTeachers(filters);
            set({ teachers: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    setSearch: (query) => {
        set(state => ({ filters: { ...state.filters, search: query } }));
        get().fetchTeachers();
    },

    setStatusFilter: (status) => {
        set(state => ({ filters: { ...state.filters, status } }));
        get().fetchTeachers();
    },

    selectTeacher: async (id) => {
        if (!id) {
            set({ selectedTeacher: null });
            return;
        }

        // Optimistically check if already in list
        const existing = get().teachers.find(t => t.id === id);
        if (existing) {
            set({ selectedTeacher: existing });
        }

        // Fetch fresh details
        try {
            set({ isLoading: true });
            const freshData = await teacherService.getTeacherById(id);
            set({ selectedTeacher: freshData, isLoading: false });
        } catch (err) {
            set({ error: 'Failed to load teacher details', isLoading: false });
        }
    }
}));

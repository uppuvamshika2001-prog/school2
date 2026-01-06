
import { create } from 'zustand';
import { Class, ClassFilters, TimetableEntry, Student } from '@/types/class.types';
import { classService } from '@/services/class.service';

interface ClassState {
    classes: Class[];
    isLoading: boolean;
    error: string | null;
    selectedClass: Class | null;
    timetable: TimetableEntry[];
    students: Student[];
    filters: ClassFilters;

    // Actions
    fetchClasses: () => Promise<void>;
    fetchClassById: (id: string) => Promise<void>;
    fetchTimetable: (classId: string, sectionId: string) => Promise<void>;
    fetchStudents: (classId: string, sectionId?: string) => Promise<void>;
    setFilters: (filters: Partial<ClassFilters>) => void;
    assignTeacher: (classId: string, sectionId: string, teacherId: string) => Promise<void>;
    assignMonitor: (classId: string, sectionId: string, monitorId: string) => Promise<void>;
    createClass: (data: Omit<Class, 'id' | 'sections'>) => Promise<void>;
    addSection: (classId: string, data: { name: string; capacity: number }) => Promise<void>;
}

export const useClassStore = create<ClassState>((set, get) => ({
    classes: [],
    isLoading: false,
    error: null,
    selectedClass: null,
    timetable: [],
    students: [],
    filters: {
        academicYear: '2023-2024',
        status: 'ALL',
        search: '',
    },

    fetchClasses: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await classService.getClasses(get().filters);
            set({ classes: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    fetchClassById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await classService.getClassById(id);
            set({ selectedClass: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    fetchTimetable: async (classId, sectionId) => {
        set({ isLoading: true, error: null });
        try {
            const data = await classService.getTimetable(classId, sectionId);
            set({ timetable: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    fetchStudents: async (classId, sectionId) => {
        set({ isLoading: true, error: null });
        try {
            const data = await classService.getStudents(classId, sectionId);
            set({ students: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    setFilters: (newFilters) => {
        set((state) => ({ filters: { ...state.filters, ...newFilters } }));
        get().fetchClasses();
    },

    assignTeacher: async (classId, sectionId, teacherId) => {
        set({ isLoading: true });
        try {
            await classService.assignClassTeacher({
                classId,
                sectionId,
                teacherId,
                academicYear: get().filters.academicYear || '2023-2024'
            });
            await get().fetchClassById(classId); // Refresh details
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    assignMonitor: async (classId, sectionId, monitorId) => {
        set({ isLoading: true });
        try {
            await classService.assignClassMonitor({
                classId,
                sectionId,
                monitorId,
                academicYear: get().filters.academicYear || '2023-2024'
            });
            await get().fetchClassById(classId); // Refresh details
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    createClass: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await classService.createClass(data);
            await get().fetchClasses(); // Refresh list
            set({ isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    addSection: async (classId, data) => {
        set({ isLoading: true, error: null });
        try {
            await classService.addSection(classId, data);
            await get().fetchClassById(classId); // Refresh details
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    }
}));

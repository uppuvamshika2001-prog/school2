// ===========================================
// 📚 HOMEWORK STORE
// Zustand store for homework management
// ===========================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ===========================================
// 📋 TYPES
// ===========================================

export interface Homework {
    id: string;
    date: string;
    subject: string;
    title: string;
    content: string;
    type: 'Homework' | 'Classwork' | 'Assignment' | 'Project';
    class: string;
    section?: string;
    teacherId: string;
    teacherName: string;
    dueDate?: string;
    attachments?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface HomeworkState {
    homeworks: Homework[];
    isLoading: boolean;
    error: string | null;
}

export interface HomeworkActions {
    addHomework: (homework: Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateHomework: (id: string, updates: Partial<Homework>) => void;
    deleteHomework: (id: string) => void;
    getHomeworkByDate: (date: string, classId?: string) => Homework[];
    getHomeworkByClass: (classId: string) => Homework[];
    clearError: () => void;
}

// ===========================================
// 🏪 HOMEWORK STORE
// ===========================================

export const useHomeworkStore = create<HomeworkState & HomeworkActions>()(
    persist(
        (set, get) => ({
            // State
            homeworks: [],
            isLoading: false,
            error: null,

            // Actions
            addHomework: (homework) => {
                const newHomework: Homework = {
                    ...homework,
                    id: `HW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                set((state) => ({
                    homeworks: [...state.homeworks, newHomework],
                    error: null,
                }));
            },

            updateHomework: (id, updates) => {
                set((state) => ({
                    homeworks: state.homeworks.map((hw) =>
                        hw.id === id
                            ? { ...hw, ...updates, updatedAt: new Date().toISOString() }
                            : hw
                    ),
                    error: null,
                }));
            },

            deleteHomework: (id) => {
                set((state) => ({
                    homeworks: state.homeworks.filter((hw) => hw.id !== id),
                    error: null,
                }));
            },

            getHomeworkByDate: (date, classId) => {
                const { homeworks } = get();
                return homeworks.filter((hw) => {
                    const matchesDate = hw.date === date;
                    const matchesClass = classId ? hw.class === classId : true;
                    return matchesDate && matchesClass;
                });
            },

            getHomeworkByClass: (classId) => {
                const { homeworks } = get();
                return homeworks.filter((hw) => hw.class === classId);
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'homework-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

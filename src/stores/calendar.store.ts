// Calendar State Management (Zustand)
// ====================================

import { create } from 'zustand';
import { calendarService } from '@/services/calendar.service';
import {
    CalendarEvent,
    CalendarEventFormData,
    CalendarFilters,
    CalendarSummary
} from '@/types/calendar.types';

interface CalendarState {
    // Data
    events: CalendarEvent[];
    selectedEvent: CalendarEvent | null;
    selectedDate: string | null;
    dateEvents: CalendarEvent[];
    summary: CalendarSummary | null;

    // View state
    currentMonth: number;
    currentYear: number;

    // Loading states
    isLoading: boolean;
    isSubmitting: boolean;

    // Actions
    fetchEvents: (filters?: CalendarFilters) => Promise<void>;
    fetchEventsByDate: (date: string) => Promise<void>;
    fetchEventById: (id: string) => Promise<void>;
    fetchSummary: () => Promise<void>;
    createEvent: (data: CalendarEventFormData) => Promise<boolean>;
    updateEvent: (id: string, data: Partial<CalendarEventFormData>) => Promise<boolean>;
    deleteEvent: (id: string) => Promise<boolean>;
    setSelectedDate: (date: string | null) => void;
    setMonth: (month: number, year: number) => void;
    clearSelectedEvent: () => void;
}

const today = new Date();

export const useCalendarStore = create<CalendarState>((set, get) => ({
    // Initial state
    events: [],
    selectedEvent: null,
    selectedDate: null,
    dateEvents: [],
    summary: null,
    currentMonth: today.getMonth(),
    currentYear: today.getFullYear(),
    isLoading: false,
    isSubmitting: false,

    // Fetch all events
    fetchEvents: async (filters?: CalendarFilters) => {
        set({ isLoading: true });
        try {
            const { currentMonth, currentYear } = get();
            const events = await calendarService.getEvents({
                month: currentMonth,
                year: currentYear,
                ...filters
            });
            set({ events, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch events:', error);
            set({ isLoading: false });
        }
    },

    // Fetch events for a specific date
    fetchEventsByDate: async (date: string) => {
        try {
            const dateEvents = await calendarService.getEventsByDate(date);
            set({ dateEvents, selectedDate: date });
        } catch (error) {
            console.error('Failed to fetch events for date:', error);
        }
    },

    // Fetch single event
    fetchEventById: async (id: string) => {
        set({ isLoading: true });
        try {
            const selectedEvent = await calendarService.getEventById(id);
            set({ selectedEvent, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch event:', error);
            set({ isLoading: false });
        }
    },

    // Fetch summary
    fetchSummary: async () => {
        try {
            const { currentMonth, currentYear } = get();
            const summary = await calendarService.getSummary(currentMonth, currentYear);
            set({ summary });
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    },

    // Create event
    createEvent: async (data: CalendarEventFormData) => {
        set({ isSubmitting: true });
        try {
            await calendarService.createEvent(data);
            await get().fetchEvents();
            await get().fetchSummary();
            set({ isSubmitting: false });
            return true;
        } catch (error) {
            console.error('Failed to create event:', error);
            set({ isSubmitting: false });
            return false;
        }
    },

    // Update event
    updateEvent: async (id: string, data: Partial<CalendarEventFormData>) => {
        set({ isSubmitting: true });
        try {
            await calendarService.updateEvent(id, data);
            await get().fetchEvents();
            set({ isSubmitting: false });
            return true;
        } catch (error) {
            console.error('Failed to update event:', error);
            set({ isSubmitting: false });
            return false;
        }
    },

    // Delete event
    deleteEvent: async (id: string) => {
        try {
            const success = await calendarService.deleteEvent(id);
            if (success) {
                await get().fetchEvents();
                await get().fetchSummary();
            }
            return success;
        } catch (error) {
            console.error('Failed to delete event:', error);
            return false;
        }
    },

    // Set selected date
    setSelectedDate: (date: string | null) => {
        set({ selectedDate: date });
        if (date) {
            get().fetchEventsByDate(date);
        } else {
            set({ dateEvents: [] });
        }
    },

    // Set month/year
    setMonth: (month: number, year: number) => {
        set({ currentMonth: month, currentYear: year });
        get().fetchEvents();
        get().fetchSummary();
    },

    // Clear selected event
    clearSelectedEvent: () => {
        set({ selectedEvent: null });
    },
}));

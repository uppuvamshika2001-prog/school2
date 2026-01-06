// Feedback State Management (Zustand)
// ====================================

import { create } from 'zustand';
import { feedbackService } from '@/services/feedback.service';
import {
    Feedback,
    FeedbackFormData,
    FeedbackSummary,
    FeedbackFilters
} from '@/types/feedback.types';

interface FeedbackState {
    // Data
    feedbackList: Feedback[];
    summary: FeedbackSummary | null;
    selectedFeedback: Feedback | null;
    filters: FeedbackFilters;

    // Loading states
    isLoading: boolean;
    isSubmitting: boolean;

    // Actions
    fetchFeedback: (filters?: FeedbackFilters) => Promise<void>;
    fetchSummary: () => Promise<void>;
    fetchFeedbackById: (id: string) => Promise<void>;
    submitFeedback: (data: FeedbackFormData) => Promise<boolean>;
    updateStatus: (id: string, status: 'pending' | 'reviewed' | 'resolved', notes?: string) => Promise<boolean>;
    setFilters: (filters: FeedbackFilters) => void;
    clearSelectedFeedback: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
    // Initial state
    feedbackList: [],
    summary: null,
    selectedFeedback: null,
    filters: {},
    isLoading: false,
    isSubmitting: false,

    // Fetch all feedback with filters
    fetchFeedback: async (filters?: FeedbackFilters) => {
        set({ isLoading: true });
        try {
            const feedbackList = await feedbackService.getFeedback(filters || get().filters);
            set({ feedbackList, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
            set({ isLoading: false });
        }
    },

    // Fetch summary stats
    fetchSummary: async () => {
        try {
            const summary = await feedbackService.getSummary();
            set({ summary });
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    },

    // Fetch single feedback
    fetchFeedbackById: async (id: string) => {
        set({ isLoading: true });
        try {
            const selectedFeedback = await feedbackService.getFeedbackById(id);
            set({ selectedFeedback, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
            set({ isLoading: false });
        }
    },

    // Submit new feedback
    submitFeedback: async (data: FeedbackFormData) => {
        set({ isSubmitting: true });
        try {
            await feedbackService.submitFeedback(data);
            set({ isSubmitting: false });
            return true;
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            set({ isSubmitting: false });
            return false;
        }
    },

    // Update feedback status
    updateStatus: async (id: string, status: 'pending' | 'reviewed' | 'resolved', notes?: string) => {
        try {
            await feedbackService.updateFeedbackStatus(id, status, notes);
            // Refresh list and selected
            await get().fetchFeedback();
            if (get().selectedFeedback?.id === id) {
                await get().fetchFeedbackById(id);
            }
            return true;
        } catch (error) {
            console.error('Failed to update status:', error);
            return false;
        }
    },

    // Set filters
    setFilters: (filters: FeedbackFilters) => {
        set({ filters });
    },

    // Clear selected feedback
    clearSelectedFeedback: () => {
        set({ selectedFeedback: null });
    },
}));

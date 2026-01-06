// Feedback API Service Layer
// ==========================

import {
    Feedback,
    FeedbackFormData,
    FeedbackSummary,
    FeedbackFilters
} from '@/types/feedback.types';

// Mock Data for Development
const MOCK_FEEDBACK: Feedback[] = [
    {
        id: 'fb-001',
        type: 'positive',
        category: 'teachers',
        message: 'Mrs. Sharma has been incredibly supportive in helping my child understand complex mathematics concepts. Her patience and dedication are truly commendable.',
        isAnonymous: false,
        submittedBy: { id: 'p-001', name: 'Rajesh Kumar', role: 'PARENT', class: '10-A' },
        submittedAt: '2026-01-05T10:30:00Z',
        status: 'reviewed',
    },
    {
        id: 'fb-002',
        type: 'negative',
        category: 'facilities',
        message: 'The library computers are outdated and often crash during usage. This affects research work significantly.',
        isAnonymous: true,
        submittedAt: '2026-01-04T14:15:00Z',
        status: 'pending',
    },
    {
        id: 'fb-003',
        type: 'neutral',
        category: 'cafeteria',
        message: 'The cafeteria food is decent but could use more variety. Would appreciate healthier snack options.',
        isAnonymous: false,
        submittedBy: { id: 's-015', name: 'Arjun Patel', role: 'STUDENT', class: '12-B' },
        submittedAt: '2026-01-03T09:45:00Z',
        status: 'resolved',
    },
    {
        id: 'fb-004',
        type: 'positive',
        category: 'academics',
        message: 'The new science lab equipment has significantly improved practical learning. Students are more engaged now.',
        isAnonymous: false,
        submittedBy: { id: 'p-022', name: 'Meera Singh', role: 'PARENT', class: '9-C' },
        submittedAt: '2026-01-02T16:20:00Z',
        status: 'reviewed',
    },
    {
        id: 'fb-005',
        type: 'negative',
        category: 'transport',
        message: 'Bus route 5 has been consistently late for the past two weeks. Children are missing morning assembly.',
        isAnonymous: false,
        submittedBy: { id: 'p-031', name: 'Sanjay Verma', role: 'PARENT', class: '7-A' },
        submittedAt: '2026-01-01T08:00:00Z',
        status: 'pending',
    },
    {
        id: 'fb-006',
        type: 'positive',
        category: 'administration',
        message: 'The new online fee payment system is very convenient. Great initiative by the school administration!',
        isAnonymous: true,
        submittedAt: '2025-12-30T11:30:00Z',
        status: 'reviewed',
    },
    {
        id: 'fb-007',
        type: 'neutral',
        category: 'other',
        message: 'The annual day preparations are going well. Hoping for better stage lighting this year.',
        isAnonymous: false,
        submittedBy: { id: 's-042', name: 'Diya Sharma', role: 'STUDENT', class: '11-A' },
        submittedAt: '2025-12-28T13:00:00Z',
        status: 'pending',
    },
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const feedbackService = {
    // Get all feedback with optional filters
    async getFeedback(filters?: FeedbackFilters): Promise<Feedback[]> {
        await delay(800);

        let result = [...MOCK_FEEDBACK];

        if (filters) {
            if (filters.type) {
                result = result.filter(f => f.type === filters.type);
            }
            if (filters.category) {
                result = result.filter(f => f.category === filters.category);
            }
            if (filters.status) {
                result = result.filter(f => f.status === filters.status);
            }
            if (filters.isAnonymous !== undefined) {
                result = result.filter(f => f.isAnonymous === filters.isAnonymous);
            }
        }

        return result.sort((a, b) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
    },

    // Get feedback summary/stats
    async getSummary(): Promise<FeedbackSummary> {
        await delay(500);

        return {
            totalCount: MOCK_FEEDBACK.length,
            positiveCount: MOCK_FEEDBACK.filter(f => f.type === 'positive').length,
            negativeCount: MOCK_FEEDBACK.filter(f => f.type === 'negative').length,
            neutralCount: MOCK_FEEDBACK.filter(f => f.type === 'neutral').length,
            pendingCount: MOCK_FEEDBACK.filter(f => f.status === 'pending').length,
            resolvedCount: MOCK_FEEDBACK.filter(f => f.status === 'resolved').length,
        };
    },

    // Get single feedback by ID
    async getFeedbackById(id: string): Promise<Feedback | null> {
        await delay(400);
        return MOCK_FEEDBACK.find(f => f.id === id) || null;
    },

    // Submit new feedback
    async submitFeedback(data: FeedbackFormData): Promise<Feedback> {
        await delay(1000);

        const newFeedback: Feedback = {
            id: `fb-${Date.now()}`,
            ...data,
            submittedAt: new Date().toISOString(),
            status: 'pending',
            submittedBy: data.isAnonymous ? undefined : {
                id: 'current-user',
                name: 'Current User',
                role: 'STUDENT',
                class: '10-A',
            },
        };

        MOCK_FEEDBACK.unshift(newFeedback);
        return newFeedback;
    },

    // Update feedback status (admin)
    async updateFeedbackStatus(
        id: string,
        status: 'pending' | 'reviewed' | 'resolved',
        notes?: string
    ): Promise<Feedback | null> {
        await delay(600);

        const feedback = MOCK_FEEDBACK.find(f => f.id === id);
        if (feedback) {
            feedback.status = status;
            if (notes) feedback.adminNotes = notes;
        }
        return feedback || null;
    },
};

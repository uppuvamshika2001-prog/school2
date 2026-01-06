// Feedback Management Types
// ========================

export type FeedbackType = 'positive' | 'negative' | 'neutral';

export type FeedbackCategory =
    | 'academics'
    | 'facilities'
    | 'administration'
    | 'teachers'
    | 'transport'
    | 'cafeteria'
    | 'other';

export interface Feedback {
    id: string;
    type: FeedbackType;
    category: FeedbackCategory;
    message: string;
    isAnonymous: boolean;
    submittedBy?: {
        id: string;
        name: string;
        role: 'STUDENT' | 'PARENT';
        class?: string;
    };
    submittedAt: string;
    status: 'pending' | 'reviewed' | 'resolved';
    adminNotes?: string;
}

export interface FeedbackFormData {
    type: FeedbackType;
    category: FeedbackCategory;
    message: string;
    isAnonymous: boolean;
}

export interface FeedbackSummary {
    totalCount: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    pendingCount: number;
    resolvedCount: number;
}

export interface FeedbackFilters {
    type?: FeedbackType;
    category?: FeedbackCategory;
    status?: 'pending' | 'reviewed' | 'resolved';
    dateFrom?: string;
    dateTo?: string;
    isAnonymous?: boolean;
}

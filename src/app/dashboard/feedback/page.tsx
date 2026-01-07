'use client';

// Feedback Admin Dashboard
// =========================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    ThumbsUp,
    ThumbsDown,
    Minus,
    MessageSquare,
    Filter,
    Search,
    Eye,
    EyeOff,
    Clock,
    CheckCircle2,
    AlertCircle,
    Calendar,
    ChevronRight,
    Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFeedbackStore } from '@/stores/feedback.store';
import { Feedback, FeedbackType, FeedbackCategory } from '@/types/feedback.types';
import { toast } from 'sonner';
import { useIsAdmin } from '@/stores/auth.store';

const typeConfig: Record<FeedbackType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    positive: {
        label: 'Positive',
        icon: <ThumbsUp className="w-4 h-4" />,
        color: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-900/30'
    },
    neutral: {
        label: 'Suggestion',
        icon: <Minus className="w-4 h-4" />,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    negative: {
        label: 'Concern',
        icon: <ThumbsDown className="w-4 h-4" />,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30'
    },
};

const categoryLabels: Record<FeedbackCategory, string> = {
    academics: 'Academics',
    facilities: 'Facilities',
    administration: 'Administration',
    teachers: 'Teachers',
    transport: 'Transport',
    cafeteria: 'Cafeteria',
    other: 'Other',
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function truncateMessage(message: string, maxLength: number = 100): string {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
}

export default function FeedbackDashboard() {
    const {
        feedbackList,
        summary,
        isLoading,
        fetchFeedback,
        fetchSummary,
        filters,
        setFilters
    } = useFeedbackStore();

    const isAdmin = useIsAdmin();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<FeedbackType | ''>('');

    useEffect(() => {
        fetchFeedback();
        fetchSummary();
    }, [fetchFeedback, fetchSummary]);

    useEffect(() => {
        const newFilters: any = {};
        if (typeFilter) newFilters.type = typeFilter;
        setFilters(newFilters);
        fetchFeedback(newFilters);
    }, [typeFilter, setFilters, fetchFeedback]);

    const filteredFeedback = feedbackList.filter(f =>
        f.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.submittedBy?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const StatCard = ({
        title,
        value,
        icon,
        color,
        bg,
        onClick,
        isActive
    }: {
        title: string;
        value: number;
        icon: React.ReactNode;
        color: string;
        bg: string;
        onClick?: () => void;
        isActive?: boolean;
    }) => (
        <Card
            className={`border shadow-sm hover:shadow-md transition-all group cursor-pointer overflow-hidden
                ${isActive ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
                        <h3 className="text-3xl font-bold mt-2">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${bg} ${color} transition-transform`}>
                        {icon}
                    </div>
                </div>
                {isActive && (
                    <div className="mt-4 pt-4 border-t flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Filtered View</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const [activeCard, setActiveCard] = useState<string | null>(null);

    const handleCardClick = (cardType: string) => {
        if (activeCard === cardType) {
            // Clear filters
            setActiveCard(null);
            setTypeFilter('');
        } else {
            setActiveCard(cardType);
            // Set appropriate filters based on card clicked
            if (cardType === 'total') {
                setTypeFilter('');
            } else if (cardType === 'positive') {
                setTypeFilter('positive');
            } else if (cardType === 'concerns') {
                setTypeFilter('negative');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Feedback Analysis</h1>
                    <p className="text-muted-foreground mt-1 font-medium">Monitor and respond to community feedback</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="gap-2 text-muted-foreground" onClick={() => toast.info('Export feature coming soon')}>
                        <Calendar className="w-4 h-4" />
                        Custom Report
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Feedback"
                    value={summary?.totalCount || 0}
                    icon={<MessageSquare className="w-6 h-6" />}
                    color="text-primary"
                    bg="bg-primary/5"
                    onClick={() => handleCardClick('total')}
                    isActive={activeCard === 'total'}
                />
                <StatCard
                    title="Positive"
                    value={summary?.positiveCount || 0}
                    icon={<ThumbsUp className="w-6 h-6" />}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                    onClick={() => handleCardClick('positive')}
                    isActive={activeCard === 'positive'}
                />
                <StatCard
                    title="Concerns"
                    value={summary?.negativeCount || 0}
                    icon={<ThumbsDown className="w-6 h-6" />}
                    color="text-rose-600"
                    bg="bg-rose-50"
                    onClick={() => handleCardClick('concerns')}
                    isActive={activeCard === 'concerns'}
                />
            </div>

            {/* Feedback List */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/20 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Recent Feedback</CardTitle>
                            <CardDescription>View and manage all submitted feedback</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search feedback..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border rounded-lg bg-background 
                                        focus:ring-2 focus:ring-primary outline-none w-64
                                        border-muted-foreground/20"
                                />
                            </div>
                            {/* Type Filter */}
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as FeedbackType | '')}
                                className="h-10 px-3 text-sm border rounded-lg bg-background 
                                    focus:ring-2 focus:ring-primary outline-none font-medium
                                    border-muted-foreground/20"
                            >
                                <option value="">All Types</option>
                                <option value="positive">Positive</option>
                                <option value="neutral">Suggestions</option>
                                <option value="negative">Concerns</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="mt-4 text-muted-foreground font-medium">Loading feedback...</p>
                        </div>
                    ) : filteredFeedback.length === 0 ? (
                        <div className="p-12 text-center">
                            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30" />
                            <p className="mt-4 font-bold text-lg">No feedback found</p>
                            <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredFeedback.map((feedback) => (
                                <Link
                                    key={feedback.id}
                                    href={`/dashboard/feedback/${feedback.id}`}
                                    className="block p-5 hover:bg-muted/30 transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Type Icon */}
                                        <div className={`p-3 rounded-lg ${typeConfig[feedback.type].bg} ${typeConfig[feedback.type].color} shrink-0 group-hover:scale-105 transition-transform`}>
                                            {typeConfig[feedback.type].icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                                                    {categoryLabels[feedback.category]}
                                                </span>
                                            </div>

                                            <p className="text-sm font-medium text-foreground/90 leading-relaxed mb-3">
                                                {truncateMessage(feedback.message, 140)}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                                                    {!feedback.isAnonymous && feedback.submittedBy && (
                                                        <span className="font-semibold text-foreground/70">
                                                            {feedback.submittedBy.name}
                                                            <span className="font-normal border-l ml-2 pl-2 border-border">
                                                                {feedback.submittedBy.role === 'PARENT' ? 'Parent' : 'Student'}
                                                            </span>
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1 font-medium">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDate(feedback.submittedAt)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-primary text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View <ChevronRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

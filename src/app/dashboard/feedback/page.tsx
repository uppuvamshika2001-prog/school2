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
    TrendingUp,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFeedbackStore } from '@/stores/feedback.store';
import { Feedback, FeedbackType, FeedbackCategory } from '@/types/feedback.types';
import { toast } from 'sonner';

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

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500', icon: <Clock className="w-3 h-3" /> },
    reviewed: { label: 'Reviewed', color: 'bg-blue-500', icon: <Eye className="w-3 h-3" /> },
    resolved: { label: 'Resolved', color: 'bg-green-500', icon: <CheckCircle2 className="w-3 h-3" /> },
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

    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<FeedbackType | ''>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        fetchFeedback();
        fetchSummary();
    }, [fetchFeedback, fetchSummary]);

    useEffect(() => {
        const newFilters: any = {};
        if (typeFilter) newFilters.type = typeFilter;
        if (statusFilter) newFilters.status = statusFilter;
        setFilters(newFilters);
        fetchFeedback(newFilters);
    }, [typeFilter, statusFilter, setFilters, fetchFeedback]);

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
            className={`border-2 shadow-sm hover:shadow-md transition-all group cursor-pointer
                ${isActive ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/30'}`}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{title}</p>
                        <h3 className="text-3xl font-black mt-2">{value}</h3>
                    </div>
                    <div className={`p-4 rounded-2xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                        {icon}
                    </div>
                </div>
                {isActive && (
                    <p className="text-xs text-primary font-bold mt-3 uppercase tracking-wider">Currently viewing</p>
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
            setStatusFilter('');
        } else {
            setActiveCard(cardType);
            // Set appropriate filters based on card clicked
            if (cardType === 'total') {
                setTypeFilter('');
                setStatusFilter('');
            } else if (cardType === 'positive') {
                setTypeFilter('positive');
                setStatusFilter('');
            } else if (cardType === 'concerns') {
                setTypeFilter('negative');
                setStatusFilter('');
            } else if (cardType === 'pending') {
                setTypeFilter('');
                setStatusFilter('pending');
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
                    <Button variant="outline" className="gap-2" onClick={() => toast.info('Export feature coming soon')}>
                        <Calendar className="w-4 h-4" />
                        This Week
                    </Button>
                    <Button className="gap-2" asChild>
                        <Link href="/dashboard/feedback/submit">
                            <MessageSquare className="w-4 h-4" />
                            Submit Feedback
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Summary Cards - Now Clickable */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Feedback"
                    value={summary?.totalCount || 0}
                    icon={<MessageSquare className="w-6 h-6" />}
                    color="text-primary"
                    bg="bg-primary/10"
                    onClick={() => handleCardClick('total')}
                    isActive={activeCard === 'total'}
                />
                <StatCard
                    title="Positive"
                    value={summary?.positiveCount || 0}
                    icon={<ThumbsUp className="w-6 h-6" />}
                    color="text-green-600"
                    bg="bg-green-100 dark:bg-green-900/30"
                    onClick={() => handleCardClick('positive')}
                    isActive={activeCard === 'positive'}
                />
                <StatCard
                    title="Concerns"
                    value={summary?.negativeCount || 0}
                    icon={<ThumbsDown className="w-6 h-6" />}
                    color="text-red-600"
                    bg="bg-red-100 dark:bg-red-900/30"
                    onClick={() => handleCardClick('concerns')}
                    isActive={activeCard === 'concerns'}
                />
                <StatCard
                    title="Pending Review"
                    value={summary?.pendingCount || 0}
                    icon={<AlertCircle className="w-6 h-6" />}
                    color="text-yellow-600"
                    bg="bg-yellow-100 dark:bg-yellow-900/30"
                    onClick={() => handleCardClick('pending')}
                    isActive={activeCard === 'pending'}
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
                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-10 px-3 text-sm border rounded-lg bg-background 
                                    focus:ring-2 focus:ring-primary outline-none font-medium
                                    border-muted-foreground/20"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="resolved">Resolved</option>
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
                                    className="block p-6 hover:bg-muted/30 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Type Icon */}
                                        <div className={`p-3 rounded-xl ${typeConfig[feedback.type].bg} ${typeConfig[feedback.type].color} shrink-0`}>
                                            {typeConfig[feedback.type].icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={`${statusConfig[feedback.status].color} text-white text-[10px] gap-1`}>
                                                    {statusConfig[feedback.status].icon}
                                                    {statusConfig[feedback.status].label}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground font-medium uppercase">
                                                    {categoryLabels[feedback.category]}
                                                </span>
                                                {feedback.isAnonymous && (
                                                    <Badge variant="outline" className="text-[10px] gap-1">
                                                        <EyeOff className="w-3 h-3" />
                                                        Anonymous
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-sm font-medium leading-relaxed">
                                                {truncateMessage(feedback.message, 150)}
                                            </p>

                                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                                {!feedback.isAnonymous && feedback.submittedBy && (
                                                    <span className="font-bold">
                                                        {feedback.submittedBy.name}
                                                        <span className="font-normal ml-1">
                                                            ({feedback.submittedBy.role === 'PARENT' ? 'Parent' : 'Student'})
                                                        </span>
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDate(feedback.submittedAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
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

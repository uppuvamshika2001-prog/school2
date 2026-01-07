'use client';

// Feedback Detail View (Admin)
// =============================

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ThumbsUp,
    ThumbsDown,
    Minus,
    ChevronLeft,
    Clock,
    User,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Tag,
    MessageSquare,
    GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFeedbackStore } from '@/stores/feedback.store';
import { FeedbackType, FeedbackCategory } from '@/types/feedback.types';
import { toast } from 'sonner';

const typeConfig: Record<FeedbackType, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
    positive: {
        label: 'Positive Feedback',
        icon: <ThumbsUp className="w-6 h-6" />,
        color: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-200'
    },
    neutral: {
        label: 'Suggestion',
        icon: <Minus className="w-6 h-6" />,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-200'
    },
    negative: {
        label: 'Concern / Issue',
        icon: <ThumbsDown className="w-6 h-6" />,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-200'
    },
};

const statusConfig = {
    pending: {
        label: 'Pending',
        color: 'bg-amber-500',
        icon: <Clock className="w-4 h-4" />,
        description: 'Waiting for administration review'
    },
    reviewed: {
        label: 'Under Review',
        color: 'bg-blue-500',
        icon: <Eye className="w-4 h-4" />,
        description: 'This feedback is being reviewed by administration'
    },
    resolved: {
        label: 'Resolved',
        color: 'bg-green-500',
        icon: <CheckCircle2 className="w-4 h-4" />,
        description: 'This feedback has been addressed'
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
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function FeedbackDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { selectedFeedback, isLoading, fetchFeedbackById, updateStatus, clearSelectedFeedback } = useFeedbackStore();

    const feedbackId = params.id as string;

    useEffect(() => {
        if (feedbackId) {
            fetchFeedbackById(feedbackId);
        }
        return () => clearSelectedFeedback();
    }, [feedbackId, fetchFeedbackById, clearSelectedFeedback]);

    const handleStatusUpdate = async (status: 'pending' | 'reviewed' | 'resolved') => {
        const success = await updateStatus(feedbackId, status);
        if (success) {
            toast.success(`Feedback marked as ${status}`);
        } else {
            toast.error('Failed to update status');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-muted-foreground font-medium">Loading feedback...</p>
                </div>
            </div>
        );
    }

    if (!selectedFeedback) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Card className="max-w-md w-full text-center border-none shadow-lg">
                    <CardContent className="pt-12 pb-8 space-y-4">
                        <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground/30" />
                        <h2 className="text-xl font-bold">Feedback Not Found</h2>
                        <p className="text-muted-foreground">
                            The feedback you are looking for does not exist or has been removed.
                        </p>
                        <Button onClick={() => router.push('/dashboard/feedback')}>
                            Back to Feedback
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const feedback = selectedFeedback;
    const typeInfo = typeConfig[feedback.type];
    const statusInfo = statusConfig[feedback.status];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/feedback">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">{typeInfo.label}</h1>
                        <Badge className={`${statusInfo.color} text-white border-none py-0.5 px-2.5 text-[10px] font-bold uppercase tracking-wider`}>
                            {statusInfo.icon}
                            <span className="ml-1.5">{statusInfo.label}</span>
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">{statusInfo.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Feedback Type Card */}
                    <Card className={`border shadow-sm overflow-hidden`}>
                        <div className={`p-4 ${typeInfo.bg} border-b flex items-center gap-4`}>
                            <div className={`p-3 bg-white rounded-xl shadow-sm ${typeInfo.color}`}>
                                {typeInfo.icon}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{typeInfo.label}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.1em]">
                                    {categoryLabels[feedback.category]}
                                </p>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <p className="text-base leading-relaxed whitespace-pre-wrap">
                                {feedback.message}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Admin Actions */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Update Status</CardTitle>
                            <CardDescription>Change the status of this feedback</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant={feedback.status === 'pending' ? 'default' : 'outline'}
                                    className="gap-2"
                                    onClick={() => handleStatusUpdate('pending')}
                                >
                                    <Clock className="w-4 h-4" />
                                    Mark Pending
                                </Button>
                                <Button
                                    variant={feedback.status === 'reviewed' ? 'default' : 'outline'}
                                    className="gap-2"
                                    onClick={() => handleStatusUpdate('reviewed')}
                                >
                                    <Eye className="w-4 h-4" />
                                    Mark Reviewed
                                </Button>
                                <Button
                                    variant={feedback.status === 'resolved' ? 'default' : 'outline'}
                                    className="gap-2 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleStatusUpdate('resolved')}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Mark Resolved
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Submitted By */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Submitted By
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {feedback.isAnonymous ? (
                                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <EyeOff className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Anonymous</p>
                                        <p className="text-xs text-muted-foreground">Identity hidden</p>
                                    </div>
                                </div>
                            ) : feedback.submittedBy ? (
                                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {feedback.submittedBy.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold">{feedback.submittedBy.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {feedback.submittedBy.role === 'PARENT' ? 'Parent' : 'Student'}
                                            {feedback.submittedBy.class && ` • Class ${feedback.submittedBy.class}`}
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Submitted</p>
                                    <p className="text-sm font-medium">{formatDate(feedback.submittedAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Category</p>
                                    <p className="text-sm font-medium">{categoryLabels[feedback.category]}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <GraduationCap className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Feedback ID</p>
                                    <p className="text-sm font-mono font-medium">{feedback.id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

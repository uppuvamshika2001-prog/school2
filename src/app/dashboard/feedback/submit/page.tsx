'use client';

// Feedback Submission Page (Student / Parent)
// ============================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    ThumbsUp,
    ThumbsDown,
    Minus,
    Send,
    EyeOff,
    Eye,
    MessageSquare,
    ChevronLeft,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFeedbackStore } from '@/stores/feedback.store';
import { FeedbackType, FeedbackCategory, FeedbackFormData } from '@/types/feedback.types';
import Link from 'next/link';

// Form validation schema
const feedbackSchema = z.object({
    type: z.enum(['positive', 'negative', 'neutral'], {
        required_error: 'Please select a feedback type',
    }),
    category: z.enum(['academics', 'facilities', 'administration', 'teachers', 'transport', 'cafeteria', 'other'], {
        required_error: 'Please select a category',
    }),
    message: z.string()
        .min(20, 'Feedback must be at least 20 characters')
        .max(1000, 'Feedback cannot exceed 1000 characters'),
    isAnonymous: z.boolean(),
});

type FormValues = z.infer<typeof feedbackSchema>;

const feedbackTypes: { value: FeedbackType; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
    {
        value: 'positive',
        label: 'Positive',
        icon: <ThumbsUp className="w-5 h-5" />,
        color: 'text-green-600',
        bg: 'bg-green-50 border-green-200 hover:border-green-400 data-[selected=true]:border-green-500 data-[selected=true]:bg-green-100'
    },
    {
        value: 'neutral',
        label: 'Suggestion',
        icon: <Minus className="w-5 h-5" />,
        color: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200 hover:border-blue-400 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-100'
    },
    {
        value: 'negative',
        label: 'Concern',
        icon: <ThumbsDown className="w-5 h-5" />,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200 hover:border-red-400 data-[selected=true]:border-red-500 data-[selected=true]:bg-red-100'
    },
];

const categories: { value: FeedbackCategory; label: string }[] = [
    { value: 'academics', label: 'Academics' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'administration', label: 'Administration' },
    { value: 'transport', label: 'Transport' },
    { value: 'cafeteria', label: 'Cafeteria' },
    { value: 'other', label: 'Other' },
];

export default function FeedbackSubmitPage() {
    const router = useRouter();
    const { submitFeedback, isSubmitting } = useFeedbackStore();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            type: undefined,
            category: undefined,
            message: '',
            isAnonymous: false,
        },
    });

    const selectedType = watch('type');
    const isAnonymous = watch('isAnonymous');
    const message = watch('message') || '';

    const onSubmit = async (data: FormValues) => {
        const success = await submitFeedback(data as FeedbackFormData);
        if (success) {
            setIsSubmitted(true);
            toast.success('Thank you! Your feedback has been submitted.');
        } else {
            toast.error('Failed to submit feedback. Please try again.');
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Card className="max-w-md w-full text-center border-none shadow-lg">
                    <CardContent className="pt-12 pb-8 space-y-6">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-green-700">Feedback Submitted!</h2>
                            <p className="text-muted-foreground mt-2">
                                Thank you for helping us improve. Your feedback is valuable to us.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center pt-4">
                            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                                Submit Another
                            </Button>
                            <Button onClick={() => router.push('/dashboard')}>
                                Back to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Share Your Feedback</h1>
                    <p className="text-muted-foreground mt-1">Help us improve your school experience</p>
                </div>
            </div>

            <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <MessageSquare className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Feedback Form</CardTitle>
                            <CardDescription>Your voice matters. Share your thoughts with us.</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Feedback Type Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                What type of feedback is this?
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {feedbackTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setValue('type', type.value)}
                                        data-selected={selectedType === type.value}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${type.bg}`}
                                    >
                                        <div className={`${type.color} flex flex-col items-center gap-2`}>
                                            {type.icon}
                                            <span className="font-bold text-sm">{type.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {errors.type && (
                                <p className="text-sm text-destructive font-medium">{errors.type.message}</p>
                            )}
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Category (Optional)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setValue('category', cat.value)}
                                        data-selected={watch('category') === cat.value}
                                        className="px-4 py-2 rounded-full border text-sm font-medium transition-all
                                            data-[selected=false]:bg-muted/50 data-[selected=false]:hover:bg-muted
                                            data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground
                                            data-[selected=true]:border-primary"
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    Your Feedback
                                </label>
                                <span className={`text-xs font-mono ${message.length > 900 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                    {message.length}/1000
                                </span>
                            </div>
                            <textarea
                                {...register('message')}
                                placeholder="Please share your detailed feedback here. Be specific about what worked well or what could be improved..."
                                rows={6}
                                className="w-full p-4 rounded-xl border border-muted-foreground/20 bg-background 
                                    focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none
                                    text-sm leading-relaxed"
                            />
                            {errors.message && (
                                <p className="text-sm text-destructive font-medium">{errors.message.message}</p>
                            )}
                        </div>

                        {/* Anonymous Toggle */}
                        <div
                            onClick={() => setValue('isAnonymous', !isAnonymous)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between
                                ${isAnonymous
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted-foreground/20 hover:border-muted-foreground/40'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {isAnonymous ? (
                                    <EyeOff className="w-5 h-5 text-primary" />
                                ) : (
                                    <Eye className="w-5 h-5 text-muted-foreground" />
                                )}
                                <div>
                                    <p className="font-bold text-sm">Submit Anonymously</p>
                                    <p className="text-xs text-muted-foreground">
                                        {isAnonymous
                                            ? 'Your identity will be hidden from administrators'
                                            : 'Your name and class will be visible to administrators'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className={`w-12 h-7 rounded-full transition-colors duration-200 flex items-center px-1
                                ${isAnonymous ? 'bg-primary' : 'bg-muted'}`}>
                                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200
                                    ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                            <input type="hidden" {...register('isAnonymous')} />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 gap-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Sparkles className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Feedback
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

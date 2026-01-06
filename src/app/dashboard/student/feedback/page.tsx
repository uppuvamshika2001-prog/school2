'use client';

import { useState } from 'react';
import { Smile, Frown, Meh, Send } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function StudentFeedbackPage() {
    const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative' | null>(null);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sentiment) return toast.error('Please select a sentiment');

        toast.success("Thank you! Your feedback has been submitted to the administration.");
        setMessage('');
        setSentiment(null);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Parent Feedback</h1>
                <p className="text-muted-foreground">We value your suggestions. Please share your experience.</p>
            </div>

            <div className="bg-card p-8 rounded-2xl border shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-center block">How would you rate your experience?</label>
                        <div className="flex justify-center gap-6">
                            <button
                                type="button"
                                onClick={() => setSentiment('positive')}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105",
                                    sentiment === 'positive' ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-transparent bg-secondary"
                                )}
                            >
                                <Smile className={cn("w-10 h-10", sentiment === 'positive' ? "text-green-500" : "text-muted-foreground")} />
                                <span className="text-xs font-medium">Positive</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSentiment('neutral')}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105",
                                    sentiment === 'neutral' ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "border-transparent bg-secondary"
                                )}
                            >
                                <Meh className={cn("w-10 h-10", sentiment === 'neutral' ? "text-yellow-500" : "text-muted-foreground")} />
                                <span className="text-xs font-medium">Neutral</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSentiment('negative')}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105",
                                    sentiment === 'negative' ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-transparent bg-secondary"
                                )}
                            >
                                <Frown className={cn("w-10 h-10", sentiment === 'negative' ? "text-red-500" : "text-muted-foreground")} />
                                <span className="text-xs font-medium">Negative</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Comments</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="w-full min-h-[150px] p-4 rounded-lg border bg-background resize-none focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Please share your detailed feedback, suggestions, or concerns here..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!sentiment || !message}
                        className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
}

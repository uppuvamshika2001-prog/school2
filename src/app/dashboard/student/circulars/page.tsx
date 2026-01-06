'use client';

import { mockNotices } from '@/data/student-mock';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentCircularsPage() {
    const getUrgencyIcon = (urgency: string) => {
        switch (urgency) {
            case 'High': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'Medium': return <Info className="w-5 h-5 text-orange-500" />;
            default: return <CheckCircle className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Circulars & Notices</h1>
                <p className="text-muted-foreground">Stay updated with the latest announcements</p>
            </div>

            <div className="grid gap-4">
                {mockNotices.map((notice) => (
                    <div key={notice.id} className="bg-card p-4 rounded-xl border shadow-sm flex items-start gap-4">
                        <div className={cn(
                            "p-3 rounded-xl shrink-0",
                            notice.urgency === 'High' ? "bg-red-100 dark:bg-red-900/30" :
                                notice.urgency === 'Medium' ? "bg-orange-100 dark:bg-orange-900/30" :
                                    "bg-blue-100 dark:bg-blue-900/30"
                        )}>
                            {getUrgencyIcon(notice.urgency)}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-lg">{notice.title}</h3>
                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">{notice.date}</span>
                            </div>
                            <p className="text-muted-foreground text-sm">{notice.content}</p>
                            <div className="pt-2">
                                <span className={cn(
                                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                                    notice.urgency === 'High' ? "bg-red-100 text-red-700" :
                                        notice.urgency === 'Medium' ? "bg-orange-100 text-orange-700" :
                                            "bg-blue-100 text-blue-700"
                                )}>
                                    {notice.urgency} Priority
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

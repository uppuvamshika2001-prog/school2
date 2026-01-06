'use client';

import { mockClassDiary } from '@/data/student-mock';
import { useHomeworkStore } from '@/stores/homework.store';
import { useAuthStore } from '@/stores/auth.store';
import { BookOpen, Calendar, ChevronRight, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';

const ALL_SUBJECTS = [
    'Mathematics',
    'Science',
    'English',
    'Hindi',
    'Social Studies',
    'Computer Science',
    'General Knowledge',
    'Physical Education'
];

export default function StudentDiaryPage() {
    const { user } = useAuthStore();
    const { getHomeworkByDate } = useHomeworkStore();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const diaryForDate = useMemo(() => {
        // Get student's class from user profile (assuming format like "10-A")
        const studentClass = user?.role === 'STUDENT' ? '10-A' : '10-A'; // Default to 10-A for demo

        // Get homework from store for this date and class
        const homeworkFromStore = getHomeworkByDate(selectedDate, studentClass);

        // Combine with mock data
        const existingEntries = [...mockClassDiary.filter(item => item.date === selectedDate), ...homeworkFromStore];

        // Ensure all subjects are present
        return ALL_SUBJECTS.map(subject => {
            const entry = existingEntries.find(e => e.subject === subject);
            if (entry) return entry;

            return {
                id: `default-${subject}`,
                date: selectedDate,
                subject: subject,
                title: 'No Specific Homework',
                content: 'Revise today\'s class',
                type: 'Self Study',
                teacherName: undefined
            };
        });
    }, [selectedDate, getHomeworkByDate, user]);

    return (
        <div className="space-y-8 p-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-2xl border">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Daily Class Diary</h1>
                    <p className="text-muted-foreground mt-1">Stay updated with your daily academic schedule and homework</p>
                </div>
                <div className="flex items-center gap-3 bg-background p-2 rounded-xl border shadow-sm">
                    <Calendar className="w-5 h-5 text-primary" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent font-bold focus:outline-none"
                    />
                </div>
            </div>

            <div className="grid gap-6">
                {diaryForDate.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "group bg-card p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden",
                            item.type === 'Self Study' ? "border-l-4 border-l-muted" : "border-l-4 border-l-primary"
                        )}
                    >
                        <div className="flex flex-col md:flex-row gap-6 justify-between">
                            <div className="flex gap-6 items-start">
                                <div className={cn(
                                    "p-4 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                    item.type === 'Homework' && "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
                                    item.type === 'Classwork' && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                                    item.type === 'Self Study' && "bg-muted text-muted-foreground"
                                )}>
                                    {item.type === 'Self Study' ? <CheckCircle2 className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-xl">{item.subject}</h3>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                                            item.type === 'Homework' ? "bg-purple-100 text-purple-700" :
                                                item.type === 'Classwork' ? "bg-blue-100 text-blue-700" :
                                                    item.type === 'Assignment' ? "bg-orange-100 text-orange-700" :
                                                        item.type === 'Project' ? "bg-green-100 text-green-700" :
                                                            "bg-muted text-muted-foreground"
                                        )}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-foreground/70 mb-2">{item.title}</p>
                                    {(item as any).teacherName && (
                                        <p className="text-xs text-muted-foreground mb-1">
                                            Assigned by: <span className="font-bold">{(item as any).teacherName}</span>
                                        </p>
                                    )}
                                    <p className={cn(
                                        "text-sm leading-relaxed",
                                        item.type === 'Self Study' ? "text-muted-foreground italic" : "text-foreground"
                                    )}>
                                        {item.content}
                                    </p>
                                    {(item as any).dueDate && (
                                        <p className="text-xs text-red-600 dark:text-red-400 font-bold mt-2">
                                            Due: {format(new Date((item as any).dueDate), 'dd MMM yyyy')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex md:flex-col justify-between items-end gap-2 shrink-0">
                                <div className="text-xs font-bold text-muted-foreground bg-muted/30 px-3 py-1 rounded-full flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {format(new Date(item.date), 'dd MMM yyyy')}
                                </div>
                                {item.type !== 'Self Study' && (
                                    <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                                        Mark as Done
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status watermark for default entries */}
                        {item.type === 'Self Study' && (
                            <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                                <Info className="w-32 h-32" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <Info className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 italic">Antigravity Tip:</h4>
                    <p className="text-sm text-blue-800/80 dark:text-blue-200/80 mt-1 leading-relaxed">
                        If no homework is assigned, don't waste your time! Always utilize your extra minutes to <strong>revise today's class</strong> and stay ahead of the curve.
                    </p>
                </div>
            </div>
        </div>
    );
}

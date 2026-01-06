'use client';

import { useAuthStore } from '@/stores/auth.store';
import { mockStudentProfile, mockNotices, mockClassDiary } from '@/data/student-mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    CalendarDays,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText
} from 'lucide-react';

export default function StudentDashboardPage() {
    const { user } = useAuthStore();
    const stats = mockStudentProfile.stats;

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {mockStudentProfile.name} 👋</h1>
                    <p className="text-muted-foreground mt-1">
                        Class {mockStudentProfile.class} | Roll No: {mockStudentProfile.rollNo}
                    </p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stats.attendance < 75 ? 'text-red-500' : 'text-green-600'}`}>
                            {stats.attendance}%
                        </div>
                        <p className="text-xs text-muted-foreground">Current academic year</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
                        <BookOpen className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.assignmentsPending}</div>
                        <p className="text-xs text-muted-foreground">Tasks to complete</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
                        <AlertCircle className={`h-4 w-4 ${stats.feeDue > 0 ? 'text-red-500' : 'text-green-500'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.feeDue > 0 ? `₹${stats.feeDue}` : 'Paid'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.feeDue > 0 ? 'Due immediately' : 'No dues pending'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Event</CardTitle>
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.upcomingExams}</div>
                        <p className="text-xs text-muted-foreground">Upcoming in 7 days</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Homework/Diary */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Class Diary Updates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockClassDiary.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex items-start space-x-4 p-3 rounded-lg border bg-card/50">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.subject}</p>
                                        <p className="text-xs text-muted-foreground">{item.title}</p>
                                        <div className="text-xs bg-secondary inline-block px-2 py-0.5 rounded-full mt-1">
                                            {item.type}
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{item.date}</div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full" size="sm">View All Diary Entries</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notices */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Did You Know?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockNotices.map((notice) => (
                                <div key={notice.id} className="flex flex-col space-y-2 p-3 rounded-lg border border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-semibold">{notice.title}</h4>
                                        <span className="text-xs text-muted-foreground">{notice.date}</span>
                                    </div>
                                    <p className="text-sm text-foreground/80 line-clamp-2">
                                        {notice.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

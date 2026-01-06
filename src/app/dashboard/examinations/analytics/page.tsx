
'use client';

import { useState, useEffect } from 'react';
import { useExamStore } from '@/stores/exam.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    Trophy,
    TrendingDown,
    Users,
    Target,
    BarChart3,
    ArrowRight,
    Search
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
    const { results, fetchResults } = useExamStore();
    const [selectedExam, setSelectedExam] = useState('1');

    useEffect(() => {
        fetchResults({});
    }, [fetchResults]);

    const activeResult = results.find(r => r.examId === selectedExam) || results[0];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/examinations">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
                    <p className="text-muted-foreground">Detailed insights into highest and lowest performers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['1', '2', '3'].map((id) => (
                    <Button
                        key={id}
                        variant={selectedExam === id ? 'default' : 'outline'}
                        onClick={() => setSelectedExam(id)}
                        className="h-16 justify-between px-6"
                    >
                        <div className="text-left">
                            <p className="text-[10px] uppercase font-bold opacity-70">Examination</p>
                            <p className="font-bold">Term {id} Analysis</p>
                        </div>
                        <Target className="h-5 w-5" />
                    </Button>
                ))}
            </div>

            {activeResult && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-green-500/10 border-b">
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    <Trophy className="h-5 w-5" /> Top Performers
                                </CardTitle>
                                <CardDescription>Highest scorers per subject in {activeResult.className}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {activeResult.subjects.map((sub) => (
                                        <div key={sub.subjectId} className="flex items-center justify-between p-4 hover:bg-green-50/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                                    {sub.subjectName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{sub.highestScorer}</p>
                                                    <p className="text-xs text-muted-foreground">{sub.subjectName}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-green-600">{sub.highestMarks}</p>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Marks</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-red-500/10 border-b">
                                <CardTitle className="flex items-center gap-2 text-red-700">
                                    <TrendingDown className="h-5 w-5" /> Area of Improvement
                                </CardTitle>
                                <CardDescription>Lowest scorers per subject in {activeResult.className}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {activeResult.subjects.map((sub) => (
                                        <div key={sub.subjectId} className="flex items-center justify-between p-4 hover:bg-red-50/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
                                                    {sub.subjectName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{sub.lowestScorer}</p>
                                                    <p className="text-xs text-muted-foreground">{sub.subjectName}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-red-600">{sub.lowestMarks}</p>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Marks</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" /> Class Performance Distribution
                            </CardTitle>
                            <CardDescription>Average marks comparison across subjects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-end gap-2 pt-10 px-4 border-b border-l">
                                {activeResult.subjects.map((sub) => (
                                    <div key={sub.subjectId} className="flex-1 flex flex-col items-center group relative">
                                        <div
                                            className="w-full max-w-[40px] bg-primary/20 group-hover:bg-primary/40 transition-all rounded-t-lg relative"
                                            style={{ height: `${sub.averageMarks}%` }}
                                        >
                                            <div
                                                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold py-1 px-2 rounded border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                                            >
                                                Avg: {sub.averageMarks}%
                                            </div>
                                        </div>
                                        <div className="h-1 w-full max-w-[40px] bg-primary rounded-b-lg mb-2" />
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground rotate-45 origin-left whitespace-nowrap mt-2">
                                            {sub.subjectName}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

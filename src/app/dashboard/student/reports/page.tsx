'use client';

import { BarChart3, Download, TrendingUp, Award, BookOpen, Target, Calendar, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A1';
    if (percentage >= 80) return 'A2';
    if (percentage >= 70) return 'B1';
    if (percentage >= 60) return 'B2';
    if (percentage >= 50) return 'C1';
    if (percentage >= 40) return 'C2';
    return 'D';
};

const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
};

export default function StudentReportsPage() {
    const [activeTab, setActiveTab] = useState<'overall' | 'fa1' | 'fa2' | 'sa1'>('overall');

    const reportData = [
        { subject: 'Mathematics', fa1: 18, fa2: 19, sa1: 72 },
        { subject: 'Science', fa1: 17, fa2: 18, sa1: 68 },
        { subject: 'Social Studies', fa1: 19, fa2: 20, sa1: 75 },
        { subject: 'English', fa1: 16, fa2: 18, sa1: 65 },
        { subject: 'Hindi', fa1: 18, fa2: 19, sa1: 70 },
    ];

    const stats = useMemo(() => {
        const totalSubjects = reportData.length;

        const sumFA1 = reportData.reduce((acc, curr) => acc + curr.fa1, 0);
        const percFA1 = (sumFA1 / (totalSubjects * 20)) * 100;

        const sumFA2 = reportData.reduce((acc, curr) => acc + curr.fa2, 0);
        const percFA2 = (sumFA2 / (totalSubjects * 20)) * 100;

        const sumSA1 = reportData.reduce((acc, curr) => acc + curr.sa1, 0);
        const percSA1 = (sumSA1 / (totalSubjects * 80)) * 100;

        const sumOverall = sumFA1 + sumFA2 + sumSA1;
        const percOverall = (sumOverall / (totalSubjects * 120)) * 100;

        return {
            fa1: { percentage: percFA1, grade: getGrade(percFA1), total: sumFA1, max: totalSubjects * 20 },
            fa2: { percentage: percFA2, grade: getGrade(percFA2), total: sumFA2, max: totalSubjects * 20 },
            sa1: { percentage: percSA1, grade: getGrade(percSA1), total: sumSA1, max: totalSubjects * 80 },
            overall: { percentage: percOverall, grade: getGrade(percOverall), total: sumOverall, max: totalSubjects * 120 }
        };
    }, [reportData]);

    const tabs = [
        { id: 'overall', label: 'Overall Summary', icon: Award, color: 'indigo' },
        { id: 'fa1', label: 'Formative 1', icon: Target, color: 'green' },
        { id: 'fa2', label: 'Formative 2', icon: Target, color: 'orange' },
        { id: 'sa1', label: 'Summative 1', icon: BookOpen, color: 'purple' },
    ] as const;

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Academic Reports
                    </h1>
                    <p className="text-muted-foreground mt-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Academic Year 2023-24 | Student Portal
                    </p>
                </div>
                <button className="group flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                    <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    Download PDF
                </button>
            </div>

            {/* Navigation Tabs (Dropdown-like tabs) */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-muted/50 rounded-2xl w-fit border border-muted-foreground/10">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                                isActive
                                    ? "bg-background text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Selected Tab Content */}
            <div className="space-y-6">
                {/* Highlight Card for Selected Tab */}
                <div className={cn(
                    "p-8 rounded-3xl border shadow-xl relative overflow-hidden text-white transition-all duration-500",
                    activeTab === 'overall' && "bg-gradient-to-br from-indigo-600 to-blue-700",
                    activeTab === 'fa1' && "bg-gradient-to-br from-green-600 to-emerald-700",
                    activeTab === 'fa2' && "bg-gradient-to-br from-orange-500 to-red-600",
                    activeTab === 'sa1' && "bg-gradient-to-br from-purple-600 to-indigo-700",
                )}>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-2">
                                {activeTab === 'overall' ? 'Consolidated Performance' : `${activeTab.toUpperCase()} Results`}
                            </p>
                            <h2 className="text-6xl font-black">{stats[activeTab].percentage.toFixed(1)}%</h2>
                            <div className="flex items-center gap-4 mt-4">
                                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-lg font-black">
                                    Grade: {stats[activeTab].grade}
                                </span>
                                <span className="text-white/60 font-bold">
                                    Total: {stats[activeTab].total} / {stats[activeTab].max}
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            {activeTab === 'overall' ? <Award className="w-32 h-32 text-white/20" /> : <Target className="w-32 h-32 text-white/20" />}
                        </div>
                    </div>
                    {/* Decorative Background Element */}
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                </div>

                {/* Subjekt List for Selected Tab */}
                <div className="bg-card rounded-3xl border shadow-sm overflow-hidden border-muted-foreground/10">
                    <div className="p-6 border-b bg-muted/20">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Subject-wise {activeTab.toUpperCase()} Performance
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/30 text-xs uppercase text-muted-foreground font-black border-b">
                                    <th className="px-8 py-5 text-left">Subject</th>
                                    <th className="px-8 py-5 text-center">Marks Obtained</th>
                                    <th className="px-8 py-5 text-center">Percentage</th>
                                    <th className="px-8 py-5 text-center">Grade</th>
                                    <th className="px-8 py-5 text-right w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-muted-foreground/5">
                                {reportData.map((row) => {
                                    let marks: number;
                                    let max: number;

                                    if (activeTab === 'overall') {
                                        marks = row.fa1 + row.fa2 + row.sa1;
                                        max = 120;
                                    } else {
                                        marks = row[activeTab];
                                        max = activeTab === 'sa1' ? 80 : 20;
                                    }

                                    const perc = (marks / max) * 100;
                                    const grade = getGrade(perc);

                                    return (
                                        <tr key={row.subject} className="hover:bg-primary/5 transition-all group cursor-default">
                                            <td className="px-8 py-6">
                                                <span className="font-extrabold text-foreground text-lg group-hover:text-primary transition-colors">
                                                    {row.subject}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="inline-flex items-center gap-1.5 font-black text-xl">
                                                    {marks}
                                                    <span className="text-muted-foreground text-sm font-bold">/ {max}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="font-black text-lg">{perc.toFixed(1)}%</span>
                                                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                                                        <div
                                                            className={cn(
                                                                "h-full transition-all duration-1000 ease-out",
                                                                activeTab === 'overall' && "bg-indigo-500",
                                                                activeTab === 'fa1' && "bg-green-500",
                                                                activeTab === 'fa2' && "bg-orange-500",
                                                                activeTab === 'sa1' && "bg-purple-500",
                                                            )}
                                                            style={{ width: `${perc}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={cn(
                                                    "px-6 py-2 rounded-2xl text-sm font-black shadow-sm transition-all group-hover:scale-110 block w-fit mx-auto",
                                                    getGradeColor(grade)
                                                )}>
                                                    {grade}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Grading System Legend */}
            <div className="bg-gradient-to-r from-muted/30 to-muted/10 p-8 rounded-3xl border border-dashed border-primary/20">
                <h4 className="font-black text-sm mb-6 uppercase tracking-widest text-primary flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Grading System
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { range: '91-100%', grade: 'A1', desc: 'Outstanding', color: 'green' },
                        { range: '81-90%', grade: 'A2', desc: 'Excellent', color: 'emerald' },
                        { range: '71-80%', grade: 'B1', desc: 'Very Good', color: 'blue' },
                        { range: '61-70%', grade: 'B2', desc: 'Good', color: 'cyan' },
                        { range: '51-60%', grade: 'C1', desc: 'Above Avg', color: 'yellow' },
                        { range: '41-50%', grade: 'C2', desc: 'Average', color: 'orange' },
                        { range: 'Below 40%', grade: 'D', desc: 'Needs Improvement', color: 'red' },
                    ].map((item) => (
                        <div key={item.grade} className="flex flex-col gap-1 p-3 rounded-2xl bg-background shadow-sm border border-muted-foreground/5">
                            <span className="text-xs font-black text-muted-foreground uppercase">{item.range}</span>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-black text-primary">{item.grade}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted">{item.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

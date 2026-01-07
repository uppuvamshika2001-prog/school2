'use client';

import { useState, useEffect } from 'react';
import { useExamStore } from '@/stores/exam.store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ChevronLeft,
    Trophy,
    TrendingDown,
    TrendingUp,
    Users,
    Award,
    BarChart3,
    Percent,
    Target
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
    const { results, exams, fetchResults, fetchExams } = useExamStore();
    const [selectedExam, setSelectedExam] = useState<string>('all');

    useEffect(() => {
        fetchExams();
        fetchResults({});
    }, [fetchExams, fetchResults]);

    // Get filtered results
    const filteredResults = selectedExam === 'all'
        ? results
        : results.filter(r => r.examId === selectedExam);

    // Calculate overall stats
    const totalStudents = filteredResults.reduce((sum, r) => sum + r.totalStudents, 0);
    const totalPassed = filteredResults.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = filteredResults.reduce((sum, r) => sum + r.failed, 0);
    const overallPassRate = totalStudents > 0 ? Math.round((totalPassed / totalStudents) * 100) : 0;
    const avgMarks = filteredResults.length > 0
        ? Math.round(filteredResults.reduce((sum, r) => sum + r.averageMarks, 0) / filteredResults.length * 10) / 10
        : 0;

    // Get all subjects across all results
    const allSubjects = filteredResults.flatMap(r => r.subjects);
    const subjectStats = allSubjects.reduce((acc, sub) => {
        if (!acc[sub.subjectName]) {
            acc[sub.subjectName] = {
                count: 0,
                totalAvg: 0,
                totalPass: 0,
                highestMarks: 0,
                highestScorer: '',
                lowestMarks: 100,
                lowestScorer: ''
            };
        }
        acc[sub.subjectName].count++;
        acc[sub.subjectName].totalAvg += sub.averageMarks;
        acc[sub.subjectName].totalPass += sub.passPercentage;
        if (sub.highestMarks > acc[sub.subjectName].highestMarks) {
            acc[sub.subjectName].highestMarks = sub.highestMarks;
            acc[sub.subjectName].highestScorer = sub.highestScorer;
        }
        if (sub.lowestMarks < acc[sub.subjectName].lowestMarks) {
            acc[sub.subjectName].lowestMarks = sub.lowestMarks;
            acc[sub.subjectName].lowestScorer = sub.lowestScorer;
        }
        return acc;
    }, {} as Record<string, { count: number; totalAvg: number; totalPass: number; highestMarks: number; highestScorer: string; lowestMarks: number; lowestScorer: string }>);

    const subjectList = Object.entries(subjectStats).map(([name, stats]) => ({
        name,
        avgMarks: Math.round(stats.totalAvg / stats.count * 10) / 10,
        passRate: Math.round(stats.totalPass / stats.count * 10) / 10,
        highestMarks: stats.highestMarks,
        highestScorer: stats.highestScorer,
        lowestMarks: stats.lowestMarks,
        lowestScorer: stats.lowestScorer
    })).sort((a, b) => b.avgMarks - a.avgMarks);

    // Best and worst subjects
    const bestSubject = subjectList[0];
    const worstSubject = subjectList[subjectList.length - 1];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/examinations">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold">Performance Analytics</h1>
                        <p className="text-sm text-muted-foreground mt-1">Insights from examination data</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={selectedExam} onValueChange={setSelectedExam}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Exam" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Examinations</SelectItem>
                            {exams.map(exam => (
                                <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Students</p>
                                <p className="text-xl font-bold">{totalStudents}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Award className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Passed</p>
                                <p className="text-xl font-bold text-green-600">{totalPassed}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Failed</p>
                                <p className="text-xl font-bold text-red-600">{totalFailed}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Percent className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Pass Rate</p>
                                <p className="text-xl font-bold text-purple-600">{overallPassRate}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Target className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Marks</p>
                                <p className="text-xl font-bold text-orange-600">{avgMarks}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subject Performance Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Subject-wise Performance
                        </h2>
                    </div>
                    {subjectList.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No exam data available. Enter marks in Marks Entry to see analytics.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Subject</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Avg Marks</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Pass Rate</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Top Scorer</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Needs Attention</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Performance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjectList.map((subject, index) => (
                                        <tr key={subject.name} className="border-b hover:bg-muted/20">
                                            <td className="h-14 px-4 font-medium">{subject.name}</td>
                                            <td className="h-14 px-4">
                                                <span className="font-semibold">{subject.avgMarks}%</span>
                                            </td>
                                            <td className="h-14 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${subject.passRate >= 80 ? 'bg-green-100 text-green-700' :
                                                        subject.passRate >= 60 ? 'bg-blue-100 text-blue-700' :
                                                            'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {subject.passRate}%
                                                </span>
                                            </td>
                                            <td className="h-14 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-sm">{subject.highestScorer}</span>
                                                    <span className="text-xs text-muted-foreground">({subject.highestMarks})</span>
                                                </div>
                                            </td>
                                            <td className="h-14 px-4">
                                                <div className="flex items-center gap-2">
                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                    <span className="text-sm">{subject.lowestScorer}</span>
                                                    <span className="text-xs text-muted-foreground">({subject.lowestMarks})</span>
                                                </div>
                                            </td>
                                            <td className="h-14 px-4">
                                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${subject.avgMarks >= 75 ? 'bg-green-500' :
                                                                subject.avgMarks >= 50 ? 'bg-blue-500' :
                                                                    'bg-orange-500'
                                                            }`}
                                                        style={{ width: `${subject.avgMarks}%` }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Best & Worst Subject Summary */}
            {subjectList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-green-200 bg-green-50/30">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Best Performing Subject</p>
                                    <p className="text-lg font-bold text-green-700">{bestSubject?.name}</p>
                                    <div className="mt-2 flex gap-4 text-sm">
                                        <span>Avg: <strong>{bestSubject?.avgMarks}%</strong></span>
                                        <span>Pass Rate: <strong>{bestSubject?.passRate}%</strong></span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-red-200 bg-red-50/30">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Needs Improvement</p>
                                    <p className="text-lg font-bold text-red-700">{worstSubject?.name}</p>
                                    <div className="mt-2 flex gap-4 text-sm">
                                        <span>Avg: <strong>{worstSubject?.avgMarks}%</strong></span>
                                        <span>Pass Rate: <strong>{worstSubject?.passRate}%</strong></span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Class-wise Results */}
            {filteredResults.length > 0 && (
                <Card>
                    <CardContent className="p-0">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold">Class-wise Results Summary</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Class</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Total</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Passed</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Failed</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Avg Marks</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Pass %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResults.map(result => (
                                        <tr key={result.classId} className="border-b hover:bg-muted/20">
                                            <td className="h-14 px-4 font-medium">{result.className}</td>
                                            <td className="h-14 px-4">{result.totalStudents}</td>
                                            <td className="h-14 px-4 text-green-600 font-medium">{result.passed}</td>
                                            <td className="h-14 px-4 text-red-600 font-medium">{result.failed}</td>
                                            <td className="h-14 px-4 font-medium">{result.averageMarks}%</td>
                                            <td className="h-14 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${result.passPercentage >= 80 ? 'bg-green-100 text-green-700' :
                                                        result.passPercentage >= 60 ? 'bg-blue-100 text-blue-700' :
                                                            'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {result.passPercentage}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

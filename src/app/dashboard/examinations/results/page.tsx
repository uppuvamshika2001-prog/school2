
'use client';

import { useState, useEffect } from 'react';
import { useExamStore } from '@/stores/exam.store';
import { useClassStore } from '@/stores/class.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Trophy,
    Target,
    Users,
    Download,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function ResultsViewPage() {
    const {
        results, fetchResults,
        weeklyResults, fetchWeeklyResults,
        currentScores, fetchScores,
        isLoading
    } = useExamStore();
    const { classes, fetchClasses } = useClassStore();

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('ALL');
    const [selectedWeekClass, setSelectedWeekClass] = useState('');
    const [selectedWeek, setSelectedWeek] = useState('ALL');

    const [activeTab, setActiveTab] = useState<'exam' | 'weekly'>('exam');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    // Details Modal State
    const [showDetails, setShowDetails] = useState(false);
    const [activeDetailInfo, setActiveDetailInfo] = useState<{
        subjectName: string;
        className: string;
        examName: string;
    } | null>(null);

    useEffect(() => {
        fetchClasses();
        fetchResults({});
        fetchWeeklyResults({});
    }, [fetchClasses, fetchResults, fetchWeeklyResults]);

    const handleApplyExamFilters = () => {
        fetchResults({
            classId: selectedClass || undefined,
            examType: selectedExamType === 'ALL' ? undefined : (selectedExamType as any)
        });
    };

    const handleApplyWeeklyFilters = () => {
        fetchWeeklyResults({
            classId: selectedWeekClass || undefined,
            weekName: selectedWeek === 'ALL' ? undefined : selectedWeek
        });
    };

    // Determine which results to display and sort classes
    const currentResults = [...(activeTab === 'exam' ? results : weeklyResults)].sort((a, b) => {
        if (sortOrder === 'desc') {
            return b.averageMarks - a.averageMarks;
        } else {
            return a.averageMarks - b.averageMarks;
        }
    });

    // Helper to sort subjects
    const sortSubjects = (subjects: any[]) => {
        return [...subjects].sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.highestMarks - a.highestMarks;
            } else {
                return a.highestMarks - b.highestMarks;
            }
        });
    };

    const handleRowClick = async (result: any, sub: any) => {
        // Extract original classId from the concatenated result.classId (examId-classId)
        const actualClassId = result.classId.replace(`${result.examId}-`, '');

        setActiveDetailInfo({
            subjectName: sub.subjectName,
            className: result.className.split(' - ')[0],
            examName: result.className.split(' - ')[1] || (activeTab === 'weekly' ? 'Weekly Test' : 'Exam')
        });

        await fetchScores(result.examId, actualClassId, sub.subjectId, activeTab === 'weekly');
        setShowDetails(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/examinations">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Examination Results</h1>
                        <p className="text-muted-foreground">Comprehensive view of student performance across subjects</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="gap-2"
                    >
                        {sortOrder === 'desc' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export Results
                    </Button>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex gap-4 border-b">
                <button
                    onClick={() => setActiveTab('exam')}
                    className={`pb-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'exam' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Exam Results
                </button>
                <button
                    onClick={() => setActiveTab('weekly')}
                    className={`pb-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'weekly' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Weekly Result
                </button>
            </div>

            <Card className="border-none shadow-sm bg-muted/20">
                <CardContent className="p-4">
                    {activeTab === 'exam' ? (
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="space-y-1 flex-1">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Class & Section</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border bg-background"
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                >
                                    <option value="">All Classes</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1 flex-1">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Exam Type</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border bg-background"
                                    value={selectedExamType}
                                    onChange={(e) => setSelectedExamType(e.target.value)}
                                >
                                    <option value="ALL">All Types</option>
                                    <option value="FA1">FA 1</option>
                                    <option value="FA2">FA 2</option>
                                    <option value="SA1">SA 1</option>
                                    <option value="FA3">FA 3</option>
                                    <option value="FA4">FA 4</option>
                                    <option value="SA2">SA 2</option>
                                </select>
                            </div>
                            <Button onClick={handleApplyExamFilters} className="px-8">
                                Apply
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="space-y-1 flex-1">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Class & Section</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border bg-background"
                                    value={selectedWeekClass}
                                    onChange={(e) => setSelectedWeekClass(e.target.value)}
                                >
                                    <option value="">All Classes</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1 flex-1">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Select Week</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border bg-background"
                                    value={selectedWeek}
                                    onChange={(e) => setSelectedWeek(e.target.value)}
                                >
                                    <option value="ALL">All Weeks</option>
                                    <option value="Week 1">Week 1</option>
                                    <option value="Week 2">Week 2</option>
                                    <option value="Week 3">Week 3</option>
                                    <option value="Week 4">Week 4</option>
                                </select>
                            </div>
                            <Button onClick={handleApplyWeeklyFilters} className="px-8">
                                Apply
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    {currentResults.map((result) => (
                        <Card key={result.classId} className="border-none shadow-sm bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg">{result.className}</CardTitle>
                                <CardDescription>Overall Performance</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold">Pass Rate</p>
                                        <p className="text-3xl font-bold text-primary">{result.passPercentage}%</p>
                                    </div>
                                    <Badge variant="success" className="mb-1">
                                        <ArrowUpRight className="h-3 w-3 mr-1" /> Best
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase">Passed</p>
                                        <p className="text-lg font-bold text-green-600">{result.passed}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase">Failed</p>
                                        <p className="text-lg font-bold text-red-600">{result.failed}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="lg:col-span-3 space-y-6">
                    {currentResults.map((result) => (
                        <Card key={result.classId + '-details'} className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{activeTab === 'weekly' ? 'Weekly Test Analysis' : 'Subject-wise Breakdown'}</CardTitle>
                                        <CardDescription>Metrics for {result.className}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">{result.totalStudents} Students</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-muted/20 text-muted-foreground text-[10px] uppercase font-bold">
                                            <tr>
                                                <th className="px-6 py-4">Subject</th>
                                                <th className="px-6 py-4 text-center">Avg marks</th>
                                                <th className="px-6 py-4">Highest Scorer</th>
                                                <th className="px-6 py-4">Lowest Scorer</th>
                                                <th className="px-6 py-4 text-center">Pass %</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {sortSubjects(result.subjects).map((sub) => (
                                                <tr
                                                    key={sub.subjectId}
                                                    className="hover:bg-primary/5 cursor-pointer transition-colors group"
                                                    onClick={() => handleRowClick(result, sub)}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-sm group-hover:text-primary transition-colors">{sub.subjectName}</span>
                                                            <span className="text-[10px] text-muted-foreground font-medium">Click to view all student marks</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-bold text-blue-600">{sub.averageMarks}%</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold flex items-center gap-1.5 text-green-700">
                                                                {sub.highestScorer} <Trophy className="h-3 w-3" />
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground font-bold">Marks: {sub.highestMarks}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold flex items-center gap-1.5 text-red-700">
                                                                {sub.lowestScorer} <ArrowDownRight className="h-3 w-3" />
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground font-bold">Marks: {sub.lowestMarks}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className={`text-xs font-bold ${sub.passPercentage >= 90 ? 'text-green-600' : 'text-blue-600'}`}>
                                                                {sub.passPercentage}%
                                                            </span>
                                                            <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary"
                                                                    style={{ width: `${sub.passPercentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Student Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0">
                    <DialogHeader className="p-6 pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                    {activeDetailInfo?.subjectName} Results
                                    <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-none text-xs">
                                        {activeTab === 'weekly' ? 'Weekly Result' : 'Exam'}
                                    </Badge>
                                </DialogTitle>
                                <DialogDescription className="text-base mt-1">
                                    Student performance for <span className="font-bold text-foreground">{activeDetailInfo?.className}</span> in <span className="font-bold text-foreground">{activeDetailInfo?.examName}</span>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        <div className="bg-muted/30 rounded-xl border overflow-hidden mt-4">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-bold sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4">Roll No</th>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4 text-center">Marks</th>
                                        <th className="px-6 py-4 text-center">Percentage</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {currentScores.map((score) => (
                                        <tr key={score.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm">{score.rollNo}</td>
                                            <td className="px-6 py-4 font-bold text-sm">{score.studentName}</td>
                                            <td className="px-6 py-4 text-center font-bold text-base">
                                                {score.marks} / {score.maxMarks}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-sm font-bold text-primary">{score.percentage.toFixed(1)}%</span>
                                                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${score.percentage >= 75 ? 'bg-green-500' : score.percentage >= 40 ? 'bg-blue-500' : 'bg-red-500'}`}
                                                            style={{ width: `${score.percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    {score.status === 'Passed' ? (
                                                        <Badge variant="success" className="gap-1 px-3">
                                                            <CheckCircle2 className="h-3 w-3" /> Passed
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="destructive" className="gap-1 px-3">
                                                            <XCircle className="h-3 w-3" /> Failed
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

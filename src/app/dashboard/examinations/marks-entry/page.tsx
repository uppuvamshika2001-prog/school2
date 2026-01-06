
'use client';

import { useState, useEffect } from 'react';
import { useExamStore } from '@/stores/exam.store';
import { useClassStore } from '@/stores/class.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    Save,
    Search,
    CheckCircle2,
    AlertCircle,
    BookOpen,
    Users,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MarksEntryPage() {
    const { exams, fetchExams, currentScores, fetchScores, saveScores, isLoading } = useExamStore();
    const { classes, fetchClasses } = useClassStore();

    const [selectedExam, setSelectedExam] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [scores, setScores] = useState(currentScores);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchExams();
        fetchClasses();
    }, [fetchExams, fetchClasses]);

    useEffect(() => {
        if (selectedExam && selectedClass && selectedSubject) {
            fetchScores(selectedExam, selectedClass, selectedSubject);
        }
    }, [selectedExam, selectedClass, selectedSubject, fetchScores]);

    useEffect(() => {
        setScores(currentScores);
    }, [currentScores]);

    const handleMarkChange = (id: string, value: string) => {
        const numericValue = value === '' ? 0 : parseFloat(value);
        if (isNaN(numericValue)) return;

        setScores(prev => prev.map(score => {
            if (score.id === id) {
                const percentage = (numericValue / score.maxMarks) * 100;
                return {
                    ...score,
                    marks: numericValue,
                    percentage: percentage,
                    status: percentage >= 40 ? 'Passed' : 'Failed'
                };
            }
            return score;
        }));
    };

    const handleSave = async () => {
        if (!selectedExam || !selectedClass || !selectedSubject) {
            toast.error('Please select all fields');
            return;
        }

        try {
            await saveScores(selectedExam, selectedClass, selectedSubject, scores);
            toast.success('Marks updated successfully');
        } catch (error) {
            toast.error('Failed to save marks');
        }
    };

    const filteredStudents = scores.filter(s =>
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/examinations">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Marks Entry</h1>
                    <p className="text-muted-foreground">Record and update student examination marks</p>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-muted/20">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-primary" /> Examination
                            </label>
                            <select
                                className="w-full h-10 px-3 rounded-md border bg-background"
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                            >
                                <option value="">Select Exam</option>
                                {exams.map(exam => (
                                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" /> Class & Section
                            </label>
                            <select
                                className="w-full h-10 px-3 rounded-md border bg-background"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">Select Class</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" /> Subject
                            </label>
                            <select
                                className="w-full h-10 px-3 rounded-md border bg-background"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(sub => (
                                    <option key={sub} value={sub.toLowerCase()}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedExam && selectedClass && selectedSubject ? (
                <Card className="border-none shadow-sm h-full">
                    <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div className="space-y-1">
                            <CardTitle>Student List</CardTitle>
                            <CardDescription>Enter marks for the selected segment. Max Marks: {scores[0]?.maxMarks || 100}</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search student..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                                {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <Save className="h-4 w-4" />}
                                Save Marks
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Roll No</th>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4 w-32 text-center">Marks Obtained</th>
                                        <th className="px-6 py-4 text-center">Percentage</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Validation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">{student.rollNo}</td>
                                            <td className="px-6 py-4 font-medium">{student.studentName}</td>
                                            <td className="px-6 py-4">
                                                <Input
                                                    type="number"
                                                    value={student.marks}
                                                    max={student.maxMarks}
                                                    onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                    className={`w-24 mx-auto text-center font-bold ${student.marks > student.maxMarks ? 'border-red-500 bg-red-50' : ''}`}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-bold">{student.percentage.toFixed(1)}%</span>
                                                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all ${student.percentage >= 75 ? 'bg-green-500' : student.percentage >= 40 ? 'bg-blue-500' : 'bg-red-500'}`}
                                                            style={{ width: `${Math.min(student.percentage, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={student.status === 'Passed' ? 'success' : 'destructive'} className="rounded-md">
                                                    {student.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.marks > student.maxMarks ? (
                                                    <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                                                        <AlertCircle className="h-3.5 w-3.5" />
                                                        Exceeds Max
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-green-500 text-xs font-bold">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Valid
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-xl border-2 border-dashed">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <GraduationCap className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold">Specify Selections</h3>
                    <p className="text-muted-foreground max-w-sm text-center mt-2">
                        Please select an examination, class, and subject from the filters above to start entering marks.
                    </p>
                </div>
            )}
        </div>
    );
}

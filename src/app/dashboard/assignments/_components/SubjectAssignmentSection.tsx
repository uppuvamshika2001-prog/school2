'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Check, X, ClipboardList, BookOpen, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function SubjectAssignmentSection() {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');

    const handleAssign = () => {
        if (!selectedClass || !selectedSection || !selectedSubject || !selectedTeacher) {
            toast.error('Please fill all fields');
            return;
        }

        toast.success('Subject assigned successfully');
        setSelectedSubject('');
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Assignment Form */}
            <div className="xl:col-span-2 space-y-6">
                <Card className="border shadow-lg overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b">
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-primary" />
                            New Subject Allocation
                        </CardTitle>
                        <CardDescription>Link a teacher to a specific subject and class</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold">Academic Class</Label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">Class 10</SelectItem>
                                        <SelectItem value="9">Class 9</SelectItem>
                                        <SelectItem value="8">Class 8</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Section</Label>
                                <Select value={selectedSection} onValueChange={setSelectedSection}>
                                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Section" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">Section A</SelectItem>
                                        <SelectItem value="B">Section B</SelectItem>
                                        <SelectItem value="C">Section C</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold">Subject / Course</Label>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="math">Mathematics</SelectItem>
                                    <SelectItem value="phy">Physics</SelectItem>
                                    <SelectItem value="eng">English</SelectItem>
                                    <SelectItem value="hist">History</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold">Assign Teacher</Label>
                            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Teacher" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tch-1">Sarah Johnson (Math)</SelectItem>
                                    <SelectItem value="tch-2">Robert Smith (Physics)</SelectItem>
                                    <SelectItem value="tch-3">Emily Brown (English)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full h-11 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all gap-2"
                            onClick={handleAssign}
                        >
                            <Check className="h-5 w-5" />
                            Confirm Assignment
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Current Assignments Preview */}
            <div className="xl:col-span-3 space-y-6">
                <Card className="border shadow-lg">
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-muted-foreground" />
                            Active Subject Allocations
                        </CardTitle>
                        <CardDescription>Recently updated teacher-subject links</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="group flex items-center justify-between p-4 border rounded-2xl bg-card hover:border-primary/50 hover:bg-primary/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Mathematics</p>
                                            <p className="text-xs text-muted-foreground font-medium">Class 10-A • Sarah Johnson</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

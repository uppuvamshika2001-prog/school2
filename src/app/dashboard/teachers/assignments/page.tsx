'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function SubjectAssignmentPage() {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');

    const handleAssign = () => {
        if (!selectedClass || !selectedSection || !selectedSubject || !selectedTeacher) {
            toast.error('Please fill all fields');
            return;
        }

        // In production: Call API
        toast.success('Subject assigned successfully');

        // Reset form
        setSelectedSubject('');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Subject Assignments</h1>
                <p className="text-muted-foreground">Assign subjects and teachers to classes for the academic year.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assignment Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>New Assignment</CardTitle>
                        <CardDescription>Link a teacher to a specific subject and class</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">Class 10</SelectItem>
                                        <SelectItem value="9">Class 9</SelectItem>
                                        <SelectItem value="8">Class 8</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Section</Label>
                                <Select value={selectedSection} onValueChange={setSelectedSection}>
                                    <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">Section A</SelectItem>
                                        <SelectItem value="B">Section B</SelectItem>
                                        <SelectItem value="C">Section C</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="math">Mathematics</SelectItem>
                                    <SelectItem value="phy">Physics</SelectItem>
                                    <SelectItem value="eng">English</SelectItem>
                                    <SelectItem value="hist">History</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Teacher</Label>
                            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                <SelectTrigger><SelectValue placeholder="Select Teacher" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tch-1">Sarah Johnson (Math)</SelectItem>
                                    <SelectItem value="tch-2">Robert Smith (Physics)</SelectItem>
                                    <SelectItem value="tch-3">Emily Brown (English)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full mt-4" onClick={handleAssign}>
                            <Check className="mr-2 h-4 w-4" />
                            Assign Subject
                        </Button>
                    </CardContent>
                </Card>

                {/* Current Assignments Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Assignments</CardTitle>
                        <CardDescription>Recently updated allocations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                                    <div>
                                        <p className="font-semibold text-sm">Mathematics</p>
                                        <p className="text-xs text-muted-foreground">Class 10-A • Sarah Johnson</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
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

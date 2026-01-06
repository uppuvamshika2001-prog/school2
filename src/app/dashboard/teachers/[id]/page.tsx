'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTeacherStore } from '@/stores/teacher.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, Mail, Phone, Calendar, User, BookOpen, Clock, FileText, MapPin } from 'lucide-react';
import { teacherService } from '@/services/teacher.service';
import { SubjectAssignment, TimetableEntry } from '@/types/teacher.types';
import { cn } from '@/lib/utils';

export default function TeacherProfilePage() {
    const params = useParams();

    const id = params.id as string;
    const { selectedTeacher, selectTeacher, isLoading } = useTeacherStore();

    const [activeTab, setActiveTab] = useState('overview');
    const [assignments, setAssignments] = useState<SubjectAssignment[]>([]);
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);

    useEffect(() => {
        if (id) {
            selectTeacher(id);

            // Load related data
            teacherService.getAssignments(id).then(setAssignments);
            teacherService.getTimetable(id).then(setTimetable);
        }
    }, [id, selectTeacher]);

    if (isLoading || !selectedTeacher) {
        return <div className="p-8 text-center text-muted-foreground">Loading teacher profile...</div>;
    }

    const teacher = selectedTeacher;

    return (
        <div className="space-y-6">
            {/* Header Profile Card */}
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                            <AvatarImage src={teacher.avatarUrl} />
                            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                {teacher.firstName[0]}{teacher.lastName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
                            <h1 className="text-3xl font-bold">{teacher.firstName} {teacher.lastName}</h1>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{teacher.specialization} Teacher</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    <span>{teacher.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    <span>{teacher.phone}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset 
                  ${teacher.status === 'ACTIVE' ? 'bg-green-100 text-green-700 ring-green-600/20' :
                                    teacher.status === 'ON_LEAVE' ? 'bg-yellow-100 text-yellow-800 ring-yellow-600/20' :
                                        'bg-gray-100 text-gray-700 ring-gray-600/10'}`}>
                                {teacher.status.replace('_', ' ')}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Joined: {new Date(teacher.joinDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full md:w-[400px] grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                    <TabsTrigger value="timetable">Timetable</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Personal Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Full Name</p>
                                        <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Employee ID</p>
                                        <p className="font-medium">{teacher.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Email</p>
                                        <p className="font-medium">{teacher.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Phone</p>
                                        <p className="font-medium">{teacher.phone}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    Qualifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {teacher.qualifications.map((qual, idx) => (
                                        <div key={qual.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{qual.degree}</p>
                                                <p className="text-xs text-muted-foreground">{qual.institution}, {qual.yearOfCompletion}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Classes Tab */}
                <TabsContent value="classes" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subject Assignments</CardTitle>
                            <CardDescription>Current academic year subject allocation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {assignments.map((assign) => (
                                    <div key={assign.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                                                {assign.classId} - {assign.sectionId}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{assign.subjectCode}</span>
                                        </div>
                                        <h3 className="font-bold">{assign.subjectName}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">Academic Year: {assign.academicYear}</p>
                                    </div>
                                ))}
                                {assignments.length === 0 && <p className="text-muted-foreground col-span-full">No active assignments.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Timetable Tab */}
                <TabsContent value="timetable" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle>Weekly Teaching Schedule</CardTitle>
                                <CardDescription>Comprehensive grid view of your weekly periods</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-xl border shadow-sm overflow-hidden bg-background">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-muted/50 border-b">
                                                <th className="px-4 py-4 text-left font-bold text-primary border-r min-w-[100px]">Day / Time</th>
                                                {['09:00', '10:00', '11:00', '01:00', '02:00'].map((time) => (
                                                    <th key={time} className="px-4 py-4 text-center font-semibold text-muted-foreground min-w-[140px]">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <Clock className="w-4 h-4 text-primary" />
                                                            <span>{time}</span>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map((day) => (
                                                <tr key={day} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-6 font-black text-primary border-r bg-muted/20">
                                                        {day.charAt(0) + day.slice(1).toLowerCase()}
                                                    </td>
                                                    {['09:00', '10:00', '11:00', '13:00', '14:00'].map((timeSlot) => {
                                                        const entry = timetable.find(e => e.dayOfWeek === day && e.startTime === timeSlot);
                                                        return (
                                                            <td key={timeSlot} className="p-2 min-h-[100px]">
                                                                {entry ? (
                                                                    <div className={cn(
                                                                        "p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center h-full transition-all hover:scale-105 hover:shadow-md",
                                                                        entry.subjectId.toLowerCase().includes('math') ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800" :
                                                                            entry.subjectId.toLowerCase().includes('physic') ? "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800" :
                                                                                "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800"
                                                                    )}>
                                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                                                                            Class {entry.classId}-{entry.sectionId}
                                                                        </span>
                                                                        <span className="font-bold text-sm mb-1">{entry.subjectId}</span>
                                                                        <span className="text-[10px] font-medium flex items-center gap-1 opacity-70">
                                                                            <MapPin className="w-2.5 h-2.5" />
                                                                            {entry.roomNo || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-full w-full flex items-center justify-center py-8 opacity-20 group">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:scale-150 transition-transform" />
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Documents Tab */}
                <TabsContent value="documents" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                            <CardDescription>Uploaded certificates, resumes, and other contracts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(teacher.documents || []).map((doc) => (
                                    <div key={doc.id} className="flex items-center gap-3 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
                                        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm truncate" title={doc.name}>{doc.name}</h4>
                                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span>{doc.type}</span>
                                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                <span>{doc.size}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {(!teacher.documents || teacher.documents.length === 0) && (
                                    <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                        <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                        <p>No documents uploaded.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

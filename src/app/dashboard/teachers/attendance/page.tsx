'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { useIsSuperAdmin } from '@/stores/auth.store';
import { format } from 'date-fns';

const TEACHERS_LIST = [
    { id: '1', name: 'Sarah Johnson', status: 'PRESENT' },
    { id: '2', name: 'Robert Smith', status: 'ABSENT' },
    { id: '3', name: 'Emily Brown', status: 'UNMARKED' },
    { id: '4', name: 'Michael Chen', status: 'LATE' },
    { id: '5', name: 'Jessica Davis', status: 'UNMARKED' },
];

export default function TeacherAttendancePage() {
    const isSuperAdmin = useIsSuperAdmin();
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Daily Attendance</h1>
                <p className="text-muted-foreground">Manage and track staff attendance records</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Date</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border mx-auto"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                            <CardDescription>Stats for {date ? format(date, 'dd MMMM yyyy') : 'selected date'}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Check className="h-4 w-4 text-green-600" /> Present
                                </span>
                                <span className="font-bold">42</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <X className="h-4 w-4 text-red-600" /> Absent
                                </span>
                                <span className="font-bold">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 text-yellow-600" /> Late
                                </span>
                                <span className="font-bold">5</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* List View */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Staff List</CardTitle>
                            <CardDescription>Mark attendance for the selected date</CardDescription>
                        </div>
                        {!isSuperAdmin && <Button>Save Changes</Button>}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {TEACHERS_LIST.map((teacher) => (
                                <div key={teacher.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-primary/5 text-xs">{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{teacher.name}</p>
                                            <p className="text-xs text-muted-foreground">ID: T-{teacher.id.padStart(3, '0')}</p>
                                        </div>
                                    </div>

                                    {!isSuperAdmin && (
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button
                                                size="sm"
                                                variant={teacher.status === 'PRESENT' ? 'default' : 'outline'}
                                                className={teacher.status === 'PRESENT' ? 'bg-green-600 hover:bg-green-700' : ''}
                                            >
                                                Present
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={teacher.status === 'ABSENT' ? 'destructive' : 'outline'}
                                            >
                                                Absent
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={teacher.status === 'LATE' ? 'default' : 'outline'}
                                                className={teacher.status === 'LATE' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                            >
                                                Late
                                            </Button>
                                        </div>
                                    )}
                                    {isSuperAdmin && (
                                        <div className="flex items-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${teacher.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                                                    teacher.status === 'ABSENT' ? 'bg-red-100 text-red-700' :
                                                        teacher.status === 'LATE' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {teacher.status === 'UNMARKED' ? 'Not Marked' : teacher.status}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

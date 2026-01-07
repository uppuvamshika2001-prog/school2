
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useClassStore } from '@/stores/class.store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Printer,
    Download,
    ChevronLeft,
    Clock,
    Plus,
    Filter
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TimetableEntry } from '@/types/class.types';
import { toast } from 'sonner';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

const SUBJECTS = [
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'english', name: 'English' },
    { id: 'hindi', name: 'Hindi' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' },
    { id: 'computer', name: 'Computer Science' },
    { id: 'pe', name: 'Physical Education' },
];

const TEACHERS = [
    { id: 'tch-1', name: 'Sarah Johnson' },
    { id: 'tch-2', name: 'Robert Smith' },
    { id: 'tch-3', name: 'Emily Brown' },
    { id: 'tch-4', name: 'Dr. Amanda White' },
    { id: 'tch-5', name: 'Michael Clark' },
    { id: 'tch-6', name: 'David Lee' },
];

const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
    1: { start: '09:00', end: '09:45' },
    2: { start: '10:00', end: '10:45' },
    3: { start: '11:00', end: '11:45' },
    4: { start: '12:00', end: '12:45' },
    5: { start: '13:00', end: '13:45' },
    6: { start: '14:00', end: '14:45' },
    7: { start: '15:00', end: '15:45' },
    8: { start: '16:00', end: '16:45' },
};

export default function ClassTimetableView() {
    const { id } = useParams();
    const router = useRouter();
    const { selectedClass, timetable, isLoading, fetchClassById, fetchTimetable } = useClassStore();
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [localTimetable, setLocalTimetable] = useState<TimetableEntry[]>([]);

    const [newEntry, setNewEntry] = useState({
        dayOfWeek: '' as typeof DAYS[number] | '',
        period: 0,
        subjectId: '',
        teacherId: '',
        roomNo: '',
    });

    useEffect(() => {
        if (id) fetchClassById(id as string);
    }, [id, fetchClassById]);

    useEffect(() => {
        if (selectedClass && selectedClass.sections.length > 0 && !selectedSection) {
            setSelectedSection(selectedClass.sections[0].id);
        }
    }, [selectedClass, selectedSection]);

    useEffect(() => {
        if (id && selectedSection) {
            fetchTimetable(id as string, selectedSection);
        }
    }, [id, selectedSection, fetchTimetable]);

    useEffect(() => {
        setLocalTimetable(timetable);
    }, [timetable]);

    const getEntry = (day: string, period: number) => {
        return localTimetable.find(entry => entry.dayOfWeek === day && entry.period === period);
    };

    const handleAddPeriod = () => {
        if (!newEntry.dayOfWeek || !newEntry.period || !newEntry.subjectId || !newEntry.teacherId) {
            toast.error('Please fill all required fields');
            return;
        }

        // Check if slot is already occupied
        const existingEntry = getEntry(newEntry.dayOfWeek, newEntry.period);
        if (existingEntry) {
            toast.error('This time slot is already occupied');
            return;
        }

        const subject = SUBJECTS.find(s => s.id === newEntry.subjectId);
        const teacher = TEACHERS.find(t => t.id === newEntry.teacherId);
        const periodTime = PERIOD_TIMES[newEntry.period];

        const newTimetableEntry: TimetableEntry = {
            id: `tt-${Date.now()}`,
            dayOfWeek: newEntry.dayOfWeek as typeof DAYS[number],
            period: newEntry.period,
            startTime: periodTime.start,
            endTime: periodTime.end,
            subjectId: newEntry.subjectId,
            subjectName: subject?.name || '',
            teacherId: newEntry.teacherId,
            teacherName: teacher?.name || '',
            classId: id as string,
            sectionId: selectedSection,
            roomNo: newEntry.roomNo || '101',
        };

        setLocalTimetable(prev => [...prev, newTimetableEntry]);
        toast.success('Period added successfully');

        // Reset form
        setNewEntry({
            dayOfWeek: '',
            period: 0,
            subjectId: '',
            teacherId: '',
            roomNo: '',
        });
        setIsAddDialogOpen(false);
    };

    const handleCellClick = (day: typeof DAYS[number], period: number) => {
        const entry = getEntry(day, period);
        if (!entry) {
            setNewEntry({
                dayOfWeek: day,
                period: period,
                subjectId: '',
                teacherId: '',
                roomNo: '',
            });
            setIsAddDialogOpen(true);
        }
    };

    if (!selectedClass) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Class Timetable</h1>
                        <p className="text-muted-foreground">{selectedClass.name} • {selectedClass.academicYear}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                    <Button className="gap-2">
                        <Download className="h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
            </div>

            <Card className="bg-muted/30 border-none">
                <CardContent className="p-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filter Section:</span>
                    </div>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger className="w-40 bg-background">
                            <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedClass.sections.map(sec => (
                                <SelectItem key={sec.id} value={sec.id}>Section {sec.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="ml-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-background border-dashed"
                            onClick={() => setIsAddDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4" /> Add Period
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-muted/50">
                            <th className="p-4 text-left font-semibold border-b border-r w-24">Period</th>
                            {DAYS.map(day => (
                                <th key={day} className="p-4 text-center font-semibold border-b min-w-[150px]">
                                    {day.charAt(0) + day.slice(1).toLowerCase()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {PERIODS.map(period => (
                            <tr key={period} className="hover:bg-muted/20 transition-colors">
                                <td className="p-4 border-b border-r font-medium text-center">
                                    <div className="text-sm text-primary">P{period}</div>
                                    <div className="text-[10px] text-muted-foreground mt-1">
                                        {PERIOD_TIMES[period].start} - {PERIOD_TIMES[period].end}
                                    </div>
                                </td>
                                {DAYS.map(day => {
                                    const entry = getEntry(day, period);
                                    return (
                                        <td key={`${day}-${period}`} className="p-2 border-b">
                                            {entry ? (
                                                <div className="h-full min-h-[80px] p-3 rounded-lg bg-primary/10 border border-primary/20 flex flex-col justify-between group cursor-pointer hover:bg-primary/15 transition-all">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="text-xs font-bold text-primary truncate max-w-[100px]">{entry.subjectName}</span>
                                                            <Badge variant="outline" className="text-[8px] h-3 px-1 bg-background border-primary/20 text-primary">
                                                                RM {entry.roomNo}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-2.5 w-2.5" />
                                                            {entry.startTime}
                                                        </div>
                                                    </div>
                                                    <div className="pt-2 border-t border-primary/10 mt-2">
                                                        <p className="text-[9px] font-medium truncate">{entry.teacherName}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="h-full min-h-[80px] rounded-lg border border-dashed border-muted flex items-center justify-center group hover:border-primary/50 cursor-pointer transition-all"
                                                    onClick={() => handleCellClick(day, period)}
                                                >
                                                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
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

            <Card className="mt-8 border-dashed bg-muted/20">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <h4 className="font-semibold">Timetable Compliance</h4>
                        <p className="text-sm text-muted-foreground">All mandatory subjects for Class {selectedClass.name} have been scheduled.</p>
                    </div>
                    <Badge variant="secondary" className="px-4 py-1">Fully Scheduled</Badge>
                </CardContent>
            </Card>

            {/* Add Period Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Period</DialogTitle>
                        <DialogDescription>
                            Add a new period to the timetable for {selectedClass.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Day</Label>
                                <Select
                                    value={newEntry.dayOfWeek}
                                    onValueChange={(v) => setNewEntry({ ...newEntry, dayOfWeek: v as typeof DAYS[number] })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DAYS.map(day => (
                                            <SelectItem key={day} value={day}>
                                                {day.charAt(0) + day.slice(1).toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Period</Label>
                                <Select
                                    value={newEntry.period ? newEntry.period.toString() : ''}
                                    onValueChange={(v) => setNewEntry({ ...newEntry, period: parseInt(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PERIODS.map(p => (
                                            <SelectItem key={p} value={p.toString()}>
                                                P{p} ({PERIOD_TIMES[p].start})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Select
                                value={newEntry.subjectId}
                                onValueChange={(v) => setNewEntry({ ...newEntry, subjectId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUBJECTS.map(subject => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Teacher</Label>
                            <Select
                                value={newEntry.teacherId}
                                onValueChange={(v) => setNewEntry({ ...newEntry, teacherId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TEACHERS.map(teacher => (
                                        <SelectItem key={teacher.id} value={teacher.id}>
                                            {teacher.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Room Number (Optional)</Label>
                            <Input
                                value={newEntry.roomNo}
                                onChange={(e) => setNewEntry({ ...newEntry, roomNo: e.target.value })}
                                placeholder="e.g., 101"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddPeriod}>
                            Add Period
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

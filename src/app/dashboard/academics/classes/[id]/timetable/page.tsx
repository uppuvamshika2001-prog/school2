
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useClassStore } from '@/stores/class.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ClassTimetableView() {
    const { id } = useParams();
    const router = useRouter();
    const { selectedClass, timetable, isLoading, fetchClassById, fetchTimetable } = useClassStore();
    const [selectedSection, setSelectedSection] = useState<string>('');

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

    const getEntry = (day: string, period: number) => {
        return timetable.find(entry => entry.dayOfWeek === day && entry.period === period);
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
                        <Button variant="outline" size="sm" className="gap-2 bg-background border-dashed">
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
                                    <div className="text-[10px] text-muted-foreground mt-1">09:00 - 09:45</div>
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
                                                <div className="h-full min-h-[80px] rounded-lg border border-dashed border-muted flex items-center justify-center group hover:border-primary/50 cursor-pointer transition-all">
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
                    <Badge variant="success" className="px-4 py-1">Fully Scheduled</Badge>
                </CardContent>
            </Card>
        </div>
    );
}


'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useClassStore } from '@/stores/class.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    UserCheck,
    Calendar,
    ChevronLeft,
    Settings,
    Plus,
    Clock,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { AssignmentDialog } from '@/components/academics/AssignmentDialog';
import { useIsAdmin } from '@/stores/auth.store';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ClassDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { selectedClass, isLoading, fetchClassById, addSection, students, fetchStudents } = useClassStore();
    const [activeTab, setActiveTab] = useState('overview');
    const isAdmin = useIsAdmin();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'TEACHER' | 'MONITOR'>('TEACHER');
    const [activeSection, setActiveSection] = useState<{ id: string, name: string } | null>(null);

    const [showAddSectionModal, setShowAddSectionModal] = useState(false);
    const [studentSectionId, setStudentSectionId] = useState('');

    useEffect(() => {
        if (id) fetchClassById(id as string);
    }, [id, fetchClassById]);

    // Set default section for students tab when class loads
    useEffect(() => {
        if (selectedClass?.sections && selectedClass.sections.length > 0 && !studentSectionId) {
            setStudentSectionId(selectedClass.sections[0].id);
        }
    }, [selectedClass, studentSectionId]);

    // Fetch students when section changes
    useEffect(() => {
        if (selectedClass?.id && studentSectionId) {
            fetchStudents(selectedClass.id, studentSectionId);
        }
    }, [selectedClass, studentSectionId, fetchStudents]);


    const openAssignment = (type: 'TEACHER' | 'MONITOR', section: { id: string, name: string }) => {
        setDialogType(type);
        setActiveSection(section);
        setDialogOpen(true);
    };

    if (isLoading && !selectedClass) {
        return <div className="p-8 text-center">Loading class details...</div>;
    }

    if (!selectedClass) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold">Class not found</h2>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{selectedClass.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{selectedClass.academicYear}</Badge>
                        <Badge variant={selectedClass.status === 'ACTIVE' ? 'success' : 'secondary'}>{selectedClass.status}</Badge>
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    {isAdmin && (
                        <Button variant="outline" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Configure
                        </Button>
                    )}
                    <Link href={`/dashboard/academics/classes/${id}/timetable`}>
                        <Button className="gap-2">
                            <Clock className="h-4 w-4" />
                            View Timetable
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="sections">Sections</TabsTrigger>
                            <TabsTrigger value="students">Students</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-primary/5 border-none">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="text-primary font-medium">Total Students</CardDescription>
                                        <CardTitle className="text-3xl">{selectedClass.sections.reduce((acc, s) => acc + s.studentCount, 0)}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card className="bg-blue-500/5 border-none">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="text-blue-600 font-medium">Total Sections</CardDescription>
                                        <CardTitle className="text-3xl">{selectedClass.sections.length}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Class Structure</CardTitle>
                                    <CardDescription>Section-wise distribution and assigned leadership.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {selectedClass.sections.map((section) => (
                                            <div key={section.id} className="p-4 border rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {section.name}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-lg">Section {section.name}</h3>
                                                            <p className="text-sm text-muted-foreground">{section.studentCount} / {section.capacity} Students enrolled</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="bg-background">ID: {section.id}</Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                                                <Users className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Class Teacher</p>
                                                                <p className="text-sm font-medium">{section.classTeacherName || 'Not Assigned'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                                                                <UserCheck className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Class Monitor</p>
                                                                <p className="text-sm font-medium">{section.classMonitorName || 'Not Assigned'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="sections">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Manage Sections</CardTitle>
                                        <CardDescription>Add or remove sections for {selectedClass.name}.</CardDescription>
                                    </div>
                                    <Button size="sm" className="gap-2" disabled={!isAdmin} onClick={() => setShowAddSectionModal(true)}>
                                        <Plus className="h-4 w-4" /> Add Section
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {selectedClass.sections.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedClass.sections.map((section) => (
                                                <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-background rounded-full flex items-center justify-center border font-bold text-lg">
                                                            {section.name}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">Section {section.name}</p>
                                                            <p className="text-sm text-muted-foreground">Capacity: {section.capacity} • Students: {section.studentCount}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => openAssignment('TEACHER', section)}>
                                                            Teacher
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => openAssignment('MONITOR', section)}>
                                                            Monitor
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            No sections found. Add one to get started.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="students">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Student Details</CardTitle>
                                            <CardDescription>View and manage students enrolled in {selectedClass.name}.</CardDescription>
                                        </div>
                                        <div className="w-[200px]">
                                            <Select
                                                value={studentSectionId}
                                                onValueChange={setStudentSectionId}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Section" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {selectedClass.sections.map((section) => (
                                                        <SelectItem key={section.id} value={section.id}>
                                                            Section {section.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted/50 text-muted-foreground">
                                                <tr>
                                                    <th className="p-4 font-medium">Roll No</th>
                                                    <th className="p-4 font-medium">Name</th>
                                                    <th className="p-4 font-medium">Guardian</th>
                                                    <th className="p-4 font-medium">Contact</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.length > 0 ? (
                                                    students.map((student) => (
                                                        <tr key={student.id} className="border-t hover:bg-muted/50">
                                                            <td className="p-4">{student.rollNo}</td>
                                                            <td className="p-4 font-medium">{student.name}</td>
                                                            <td className="p-4">{student.guardianName}</td>
                                                            <td className="p-4">{student.contactNumber}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                            No students found in this section.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Calendar</CardTitle>
                            <CardDescription>Key dates for {selectedClass.academicYear}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-primary" />
                                <div className="text-sm">
                                    <p className="font-medium">Term 1 Starts</p>
                                    <p className="text-muted-foreground text-xs">Aug 15, 2023</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-primary" />
                                <div className="text-sm">
                                    <p className="font-medium">Mid-Term Exams</p>
                                    <p className="text-muted-foreground text-xs">Oct 20, 2023</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="secondary" className="w-full justify-start gap-2 bg-white/10 border-none text-white hover:bg-white/20">
                                Generate Report Card
                            </Button>
                            <Button variant="secondary" className="w-full justify-start gap-2 bg-white/10 border-none text-white hover:bg-white/20">
                                Bulk Attendance
                            </Button>
                            <Button variant="secondary" className="w-full justify-start gap-2 bg-white/10 border-none text-white hover:bg-white/20">
                                Announce to Class
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {activeSection && (
                <AssignmentDialog
                    isOpen={dialogOpen}
                    onOpenChange={setDialogOpen}
                    type={dialogType}
                    classId={selectedClass.id}
                    className={selectedClass.name}
                    sectionId={activeSection.id}
                    sectionName={activeSection.name}
                    options={
                        dialogType === 'TEACHER'
                            ? [
                                { id: 'tch-1', name: 'Sarah Johnson' },
                                { id: 'tch-2', name: 'Robert Smith' },
                                { id: 'tch-3', name: 'Emily Brown' },
                            ]
                            : [
                                { id: 'std-1', name: 'Arjun Sharma' },
                                { id: 'std-2', name: 'Priya Patel' },
                            ]
                    }
                />
            )}

            {/* Add Section Modal */}
            <AddSectionModal
                isOpen={showAddSectionModal}
                onOpenChange={setShowAddSectionModal}
                classId={selectedClass.id}
            />
        </div>
    );
}

// Add Section Modal Component (Internal or External, putting here for simplicity)
function AddSectionModal({ isOpen, onOpenChange, classId }: { isOpen: boolean, onOpenChange: (open: boolean) => void, classId: string }) {
    const { addSection, isLoading } = useClassStore();
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState(40);

    const handleSubmit = async () => {
        if (!name) return;
        await addSection(classId, { name, capacity });
        toast.success('Section added successfully');
        setName('');
        setCapacity(40);
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Section</DialogTitle>
                    <DialogDescription>
                        Create a new section for this class.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. C, D"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity" className="text-right">
                            Capacity
                        </Label>
                        <Input
                            id="capacity"
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(parseInt(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading || !name}>Add Section</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

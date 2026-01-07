'use client';

import { useState } from 'react';
import { useHomeworkStore } from '@/stores/homework.store';
import { useAuthStore, useIsAdmin } from '@/stores/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import { format } from 'date-fns';

const SUBJECTS = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies',
    'Computer Science', 'General Knowledge', 'Physical Education'
];

const CLASSES = [
    '1-A', '1-B', '2-A', '2-B', '3-A', '3-B', '4-A', '4-B',
    '5-A', '5-B', '6-A', '6-B', '7-A', '7-B', '8-A', '8-B',
    '9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'
];

const HOMEWORK_TYPES = ['Homework', 'Classwork', 'Assignment', 'Project'] as const;

export default function HomeworkSection() {
    const { user } = useAuthStore();
    const isAdmin = useIsAdmin();
    const { homeworks, addHomework, updateHomework, deleteHomework } = useHomeworkStore();
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        subject: SUBJECTS[0],
        title: '',
        content: '',
        type: 'Homework' as typeof HOMEWORK_TYPES[number],
        class: CLASSES[0],
        dueDate: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (editingId) {
            updateHomework(editingId, formData);
            setEditingId(null);
        } else {
            addHomework({
                ...formData,
                teacherId: user.id || 'admin',
                teacherName: user.id ? `${user.firstName} ${user.lastName}` : 'Admin',
            });
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            date: format(new Date(), 'yyyy-MM-dd'),
            subject: SUBJECTS[0],
            title: '',
            content: '',
            type: 'Homework',
            class: CLASSES[0],
            dueDate: '',
        });
        setIsAddingNew(false);
        setEditingId(null);
    };

    const handleEdit = (homework: any) => {
        setFormData({
            date: homework.date,
            subject: homework.subject,
            title: homework.title,
            content: homework.content,
            type: homework.type,
            class: homework.class,
            dueDate: homework.dueDate || '',
        });
        setEditingId(homework.id);
        setIsAddingNew(true);
    };

    const displayHomeworks = isAdmin ? homeworks : homeworks.filter(hw => hw.teacherId === user?.id);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        {displayHomeworks.length} task{displayHomeworks.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                {!isAdmin && (
                    <Button
                        onClick={() => setIsAddingNew(!isAddingNew)}
                        variant={isAddingNew ? "outline" : "default"}
                    >
                        {isAddingNew ? (
                            <>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" />
                                New Task
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Add/Edit Form */}
            {isAddingNew && (
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">
                            {editingId ? 'Edit Task' : 'Create New Task'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Class</Label>
                                    <Select value={formData.class} onValueChange={(v) => setFormData({ ...formData, class: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CLASSES.map(cls => (
                                                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUBJECTS.map(subject => (
                                                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {HOMEWORK_TYPES.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Due Date (Optional)</Label>
                                    <Input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Enter task description"
                                    rows={3}
                                    required
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingId ? 'Update' : 'Create'} Task
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Tasks Table */}
            <Card>
                <CardContent className="p-0">
                    {displayHomeworks.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No tasks found. Click "New Task" to create one.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Class</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Subject</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Due Date</th>
                                        {isAdmin && <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Teacher</th>}
                                        {!isAdmin && <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground w-24">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayHomeworks
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map((homework) => (
                                            <tr key={homework.id} className="border-b last:border-0 hover:bg-muted/20">
                                                <td className="h-14 px-4 text-sm">{format(new Date(homework.date), 'dd MMM yyyy')}</td>
                                                <td className="h-14 px-4 text-sm">{homework.class}</td>
                                                <td className="h-14 px-4 text-sm font-medium">{homework.subject}</td>
                                                <td className="h-14 px-4 text-sm">
                                                    <div>
                                                        <p className="font-medium">{homework.title}</p>
                                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{homework.content}</p>
                                                    </div>
                                                </td>
                                                <td className="h-14 px-4 text-sm">
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted">
                                                        {homework.type}
                                                    </span>
                                                </td>
                                                <td className="h-14 px-4 text-sm">
                                                    {homework.dueDate ? format(new Date(homework.dueDate), 'dd MMM yyyy') : '-'}
                                                </td>
                                                {isAdmin && <td className="h-14 px-4 text-sm text-muted-foreground">{homework.teacherName}</td>}
                                                {!isAdmin && (
                                                    <td className="h-14 px-4">
                                                        {homework.teacherId === user?.id && (
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={() => handleEdit(homework)}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-destructive"
                                                                    onClick={() => deleteHomework(homework.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


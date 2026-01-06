'use client';

import { useState } from 'react';
import { useHomeworkStore } from '@/stores/homework.store';
import { useAuthStore } from '@/stores/auth.store';
import { BookOpen, Calendar, Plus, Trash2, Edit, Save, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const SUBJECTS = [
    'Mathematics',
    'Science',
    'English',
    'Hindi',
    'Social Studies',
    'Computer Science',
    'General Knowledge',
    'Physical Education'
];

const CLASSES = [
    '1-A', '1-B', '2-A', '2-B', '3-A', '3-B', '4-A', '4-B',
    '5-A', '5-B', '6-A', '6-B', '7-A', '7-B', '8-A', '8-B',
    '9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'
];

const HOMEWORK_TYPES = ['Homework', 'Classwork', 'Assignment', 'Project'] as const;

export default function TeacherHomeworkPage() {
    const { user } = useAuthStore();
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
                teacherId: user.id,
                teacherName: `${user.firstName} ${user.lastName}`,
            });
        }

        // Reset form
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

    const handleCancel = () => {
        setIsAddingNew(false);
        setEditingId(null);
        setFormData({
            date: format(new Date(), 'yyyy-MM-dd'),
            subject: SUBJECTS[0],
            title: '',
            content: '',
            type: 'Homework',
            class: CLASSES[0],
            dueDate: '',
        });
    };

    // Filter homeworks created by this teacher
    const myHomeworks = homeworks.filter(hw => hw.teacherId === user?.id);

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 rounded-2xl border">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Homework Assignment Portal</h1>
                    <p className="text-muted-foreground mt-1">Create and manage homework for your classes</p>
                </div>
                <button
                    onClick={() => setIsAddingNew(!isAddingNew)}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl",
                        isAddingNew
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    )}
                >
                    {isAddingNew ? (
                        <>
                            <X className="w-5 h-5" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            New Homework
                        </>
                    )}
                </button>
            </div>

            {/* Add/Edit Form */}
            {isAddingNew && (
                <div className="bg-card p-8 rounded-2xl border shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                        {editingId ? 'Edit Homework' : 'Create New Homework'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Assignment Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Class */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Class</label>
                                <select
                                    value={formData.class}
                                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    required
                                >
                                    {CLASSES.map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Subject</label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    required
                                >
                                    {SUBJECTS.map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    required
                                >
                                    {HOMEWORK_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Due Date (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Quadratic Equations Practice"
                                className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-bold mb-2">Description</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Detailed instructions for the homework..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                                required
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 rounded-xl border font-bold hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                            >
                                <Save className="w-5 h-5" />
                                {editingId ? 'Update' : 'Create'} Homework
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Homework List */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    My Homework Assignments ({myHomeworks.length})
                </h2>

                {myHomeworks.length === 0 ? (
                    <div className="bg-card p-12 rounded-2xl border text-center">
                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                        <p className="text-muted-foreground text-lg">No homework assignments yet</p>
                        <p className="text-sm text-muted-foreground mt-2">Click "New Homework" to create your first assignment</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {myHomeworks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((homework) => (
                            <div
                                key={homework.id}
                                className={cn(
                                    "group bg-card p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md border-l-4",
                                    homework.type === 'Homework' && "border-l-purple-500",
                                    homework.type === 'Classwork' && "border-l-blue-500",
                                    homework.type === 'Assignment' && "border-l-orange-500",
                                    homework.type === 'Project' && "border-l-green-500"
                                )}
                            >
                                <div className="flex flex-col md:flex-row gap-6 justify-between">
                                    <div className="flex gap-6 items-start flex-1">
                                        <div className={cn(
                                            "p-4 rounded-2xl flex items-center justify-center shrink-0",
                                            homework.type === 'Homework' && "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
                                            homework.type === 'Classwork' && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                                            homework.type === 'Assignment' && "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
                                            homework.type === 'Project' && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                        )}>
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="font-bold text-xl">{homework.subject}</h3>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                                                    homework.type === 'Homework' && "bg-purple-100 text-purple-700",
                                                    homework.type === 'Classwork' && "bg-blue-100 text-blue-700",
                                                    homework.type === 'Assignment' && "bg-orange-100 text-orange-700",
                                                    homework.type === 'Project' && "bg-green-100 text-green-700"
                                                )}>
                                                    {homework.type}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-muted text-muted-foreground">
                                                    {homework.class}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-foreground/70 mb-2">{homework.title}</p>
                                            <p className="text-sm leading-relaxed text-foreground">{homework.content}</p>
                                            {homework.dueDate && (
                                                <p className="text-xs text-red-600 dark:text-red-400 font-bold mt-2">
                                                    Due: {format(new Date(homework.dueDate), 'dd MMM yyyy')}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col justify-between items-end gap-2 shrink-0">
                                        <div className="text-xs font-bold text-muted-foreground bg-muted/30 px-3 py-1 rounded-full flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {format(new Date(homework.date), 'dd MMM yyyy')}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(homework)}
                                                className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteHomework(homework.id)}
                                                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useHomeworkStore } from '@/stores/homework.store';
import { useAuthStore, useIsAdmin } from '@/stores/auth.store';
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

    // Filter homeworks: Teachers see only theirs, Admins see all
    const displayHomeworks = isAdmin ? homeworks : homeworks.filter(hw => hw.teacherId === user?.id);

    return (
        <div className="space-y-8">
            {/* Action Header */}
            <div className="flex justify-between items-center bg-card p-6 rounded-2xl border shadow-sm">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <CheckCircle2 className="w-5 h-5" />
                        {isAdmin ? 'Global Task Overview' : 'Manage My Assignments'}
                    </h2>
                    <p className="text-sm text-muted-foreground">Showing {displayHomeworks.length} total tasks</p>
                </div>
                <button
                    onClick={() => setIsAddingNew(!isAddingNew)}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl",
                        isAddingNew
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-primary hover:bg-primary/90 text-white"
                    )}
                >
                    {isAddingNew ? (
                        <>
                            <X className="w-4 h-4" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            New Task
                        </>
                    )}
                </button>
            </div>

            {/* Add/Edit Form */}
            {isAddingNew && (
                <div className="bg-card p-8 rounded-2xl border shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        {editingId ? 'Edit Task Details' : 'Create New Task'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Assignment Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Target Class</label>
                                <select
                                    value={formData.class}
                                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    {CLASSES.map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Subject</label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    {SUBJECTS.map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    className="input-field"
                                    required
                                >
                                    {HOMEWORK_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Due Date (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Quadratic Equations Practice"
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Description / Instructions</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Detailed instructions for the assignment..."
                                rows={4}
                                className="input-field resize-none"
                                required
                            />
                        </div>

                        <div className="flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2.5 rounded-xl border font-bold hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                            >
                                <Save className="w-4 h-4" />
                                {editingId ? 'Update' : 'Publish'} Task
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Task Cards */}
            <div className="grid grid-cols-1 gap-4">
                {displayHomeworks.length === 0 ? (
                    <div className="bg-card p-12 rounded-2xl border text-center border-dashed">
                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground text-lg italic">No assignments found for the current selection</p>
                    </div>
                ) : (
                    displayHomeworks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((homework) => (
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
                                        "p-4 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                        homework.type === 'Homework' && "bg-purple-50 text-purple-600 dark:bg-purple-900/30",
                                        homework.type === 'Classwork' && "bg-blue-50 text-blue-600 dark:bg-blue-900/30",
                                        homework.type === 'Assignment' && "bg-orange-50 text-orange-600 dark:bg-orange-900/30",
                                        homework.type === 'Project' && "bg-green-50 text-green-600 dark:bg-green-900/30"
                                    )}>
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="font-bold text-xl">{homework.subject}</h3>
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                homework.type === 'Homework' && "bg-purple-100 text-purple-700",
                                                homework.type === 'Classwork' && "bg-blue-100 text-blue-700",
                                                homework.type === 'Assignment' && "bg-orange-100 text-orange-700",
                                                homework.type === 'Project' && "bg-green-100 text-green-700"
                                            )}>
                                                {homework.type}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-muted text-muted-foreground border">
                                                {homework.class}
                                            </span>
                                            {isAdmin && (
                                                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 opacity-60">
                                                    by {homework.teacherName}
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-bold text-foreground/80 mb-1">{homework.title}</p>
                                        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 group-hover:line-clamp-none transition-all">
                                            {homework.content}
                                        </p>
                                        <div className="mt-4 flex items-center gap-4 flex-wrap">
                                            <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Assigned: {format(new Date(homework.date), 'dd MMM yyyy')}
                                            </div>
                                            {homework.dueDate && (
                                                <div className="text-xs font-black text-rose-500 flex items-center gap-1.5">
                                                    <X className="w-3.5 h-3.5" />
                                                    Due: {format(new Date(homework.dueDate), 'dd MMM yyyy')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex md:flex-col justify-end gap-2 shrink-0">
                                    {(isAdmin || homework.teacherId === user?.id) && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(homework)}
                                                className="p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors border border-transparent hover:border-blue-200"
                                                title="Edit Task"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteHomework(homework.id)}
                                                className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 transition-colors border border-transparent hover:border-rose-200"
                                                title="Delete Task"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

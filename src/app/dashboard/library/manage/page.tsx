'use client';

// Library Management (Admin/Librarian)
// =====================================

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    ChevronLeft,
    BookOpen,
    Upload,
    Save,
    Plus,
    Sparkles,
    FileText,
    Video,
    Headphones,
    Presentation,
    File
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLibraryStore } from '@/stores/library.store';
import { BookCategory, ResourceType, BookFormData, DigitalResourceFormData } from '@/types/library.types';
import { useIsSuperAdmin } from '@/stores/auth.store';

// Book Form Schema
const bookSchema = z.object({
    title: z.string().min(2, 'Title is required').max(200),
    author: z.string().min(2, 'Author is required').max(100),
    isbn: z.string().min(10, 'Valid ISBN required').max(17),
    category: z.enum(['fiction', 'non-fiction', 'science', 'mathematics', 'history', 'geography', 'literature', 'reference', 'biography', 'other']),
    publisher: z.string().min(2, 'Publisher is required').max(100),
    publicationYear: z.number().min(1800).max(new Date().getFullYear()),
    totalCopies: z.number().min(1).max(100),
    location: z.string().min(1, 'Shelf location is required').max(20),
    description: z.string().max(500).optional(),
});

// Resource Form Schema
const resourceSchema = z.object({
    title: z.string().min(3, 'Title is required').max(200),
    description: z.string().min(10, 'Description is required').max(500),
    subject: z.string().min(2, 'Subject is required'),
    category: z.enum(['fiction', 'non-fiction', 'science', 'mathematics', 'history', 'geography', 'literature', 'reference', 'biography', 'other']),
    type: z.enum(['pdf', 'video', 'audio', 'document', 'presentation']),
    applicableClasses: z.array(z.string()).min(1, 'Select at least one class'),
});

type BookFormValues = z.infer<typeof bookSchema>;
type ResourceFormValues = z.infer<typeof resourceSchema>;

const categories: { value: BookCategory; label: string }[] = [
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'science', label: 'Science' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'literature', label: 'Literature' },
    { value: 'reference', label: 'Reference' },
    { value: 'biography', label: 'Biography' },
    { value: 'other', label: 'Other' },
];

const resourceTypes: { value: ResourceType; label: string; icon: React.ReactNode }[] = [
    { value: 'pdf', label: 'PDF', icon: <FileText className="w-5 h-5" /> },
    { value: 'video', label: 'Video', icon: <Video className="w-5 h-5" /> },
    { value: 'audio', label: 'Audio', icon: <Headphones className="w-5 h-5" /> },
    { value: 'document', label: 'Document', icon: <File className="w-5 h-5" /> },
    { value: 'presentation', label: 'Presentation', icon: <Presentation className="w-5 h-5" /> },
];

const classes = [
    '1-A', '1-B', '2-A', '2-B', '3-A', '3-B', '4-A', '4-B', '5-A', '5-B',
    '6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B',
    '11-A', '11-B', '12-A', '12-B'
];

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Computer Science'];

export default function LibraryManagePage() {
    const router = useRouter();
    const { addBook, addDigitalResource, isSubmitting } = useLibraryStore();
    const [activeTab, setActiveTab] = useState<'book' | 'resource'>('book');
    const isSuperAdmin = useIsSuperAdmin();

    // Redirect super admin - they should not have access to manage library
    useEffect(() => {
        if (isSuperAdmin) {
            toast.error('Super Admin does not have permission to manage library');
            router.push('/dashboard/library');
        }
    }, [isSuperAdmin, router]);

    // Book Form
    const bookForm = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: '',
            author: '',
            isbn: '',
            category: 'other',
            publisher: '',
            publicationYear: new Date().getFullYear(),
            totalCopies: 1,
            location: '',
            description: '',
        },
    });

    // Resource Form
    const resourceForm = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            title: '',
            description: '',
            subject: '',
            category: 'other',
            type: 'pdf',
            applicableClasses: [],
        },
    });

    const selectedClasses = resourceForm.watch('applicableClasses') || [];
    const selectedType = resourceForm.watch('type');

    const toggleClass = (cls: string) => {
        const newClasses = selectedClasses.includes(cls)
            ? selectedClasses.filter(c => c !== cls)
            : [...selectedClasses, cls];
        resourceForm.setValue('applicableClasses', newClasses);
    };

    const onSubmitBook = async (data: BookFormValues) => {
        const success = await addBook(data as BookFormData);
        if (success) {
            toast.success('Book added successfully!');
            router.push('/dashboard/library');
        } else {
            toast.error('Failed to add book');
        }
    };

    const onSubmitResource = async (data: ResourceFormValues) => {
        const success = await addDigitalResource(data as DigitalResourceFormData);
        if (success) {
            toast.success('Resource uploaded successfully!');
            router.push('/dashboard/library/digital');
        } else {
            toast.error('Failed to upload resource');
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/library">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Library Management</h1>
                    <p className="text-muted-foreground mt-1">Add books and upload digital resources</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab('book')}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2
                        ${activeTab === 'book'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    <BookOpen className="w-4 h-4" />
                    Add Physical Book
                </button>
                <button
                    onClick={() => setActiveTab('resource')}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2
                        ${activeTab === 'resource'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    <Upload className="w-4 h-4" />
                    Upload Digital Resource
                </button>
            </div>

            {/* Book Form */}
            {activeTab === 'book' && (
                <form onSubmit={bookForm.handleSubmit(onSubmitBook)} className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Book Information</CardTitle>
                            <CardDescription>Add a new physical book to the library</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Title</label>
                                    <Input {...bookForm.register('title')} placeholder="Book title" className="h-11" />
                                    {bookForm.formState.errors.title && (
                                        <p className="text-sm text-destructive">{bookForm.formState.errors.title.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Author</label>
                                    <Input {...bookForm.register('author')} placeholder="Author name" className="h-11" />
                                    {bookForm.formState.errors.author && (
                                        <p className="text-sm text-destructive">{bookForm.formState.errors.author.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">ISBN</label>
                                    <Input {...bookForm.register('isbn')} placeholder="978-0-000-00000-0" className="h-11 font-mono" />
                                    {bookForm.formState.errors.isbn && (
                                        <p className="text-sm text-destructive">{bookForm.formState.errors.isbn.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Category</label>
                                    <select
                                        {...bookForm.register('category')}
                                        className="w-full h-11 px-3 border rounded-lg bg-background"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Publisher</label>
                                    <Input {...bookForm.register('publisher')} placeholder="Publisher name" className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Publication Year</label>
                                    <Input
                                        {...bookForm.register('publicationYear', { valueAsNumber: true })}
                                        type="number"
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Total Copies</label>
                                    <Input
                                        {...bookForm.register('totalCopies', { valueAsNumber: true })}
                                        type="number"
                                        min={1}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Shelf Location</label>
                                    <Input {...bookForm.register('location')} placeholder="e.g., A-12" className="h-11" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold">Description (Optional)</label>
                                <textarea
                                    {...bookForm.register('description')}
                                    placeholder="Brief description of the book..."
                                    rows={3}
                                    className="w-full p-3 border rounded-lg bg-background resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 gap-2" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Sparkles className="w-4 h-4 animate-spin" /> Adding...</>
                            ) : (
                                <><Plus className="w-4 h-4" /> Add Book</>
                            )}
                        </Button>
                    </div>
                </form>
            )}

            {/* Resource Form */}
            {activeTab === 'resource' && (
                <form onSubmit={resourceForm.handleSubmit(onSubmitResource)} className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Resource Information</CardTitle>
                            <CardDescription>Upload a new digital resource</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Resource Type */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    Resource Type
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {resourceTypes.map(type => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => resourceForm.setValue('type', type.value)}
                                            className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2
                                                ${selectedType === type.value
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-muted hover:border-primary/50'}`}
                                        >
                                            {type.icon}
                                            <span className="font-medium">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Title</label>
                                    <Input {...resourceForm.register('title')} placeholder="Resource title" className="h-11" />
                                    {resourceForm.formState.errors.title && (
                                        <p className="text-sm text-destructive">{resourceForm.formState.errors.title.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Subject</label>
                                    <select
                                        {...resourceForm.register('subject')}
                                        className="w-full h-11 px-3 border rounded-lg bg-background"
                                    >
                                        <option value="">Select subject</option>
                                        {subjects.map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold">Description</label>
                                <textarea
                                    {...resourceForm.register('description')}
                                    placeholder="Describe the resource content..."
                                    rows={3}
                                    className="w-full p-3 border rounded-lg bg-background resize-none"
                                />
                                {resourceForm.formState.errors.description && (
                                    <p className="text-sm text-destructive">{resourceForm.formState.errors.description.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold">Category</label>
                                <select
                                    {...resourceForm.register('category')}
                                    className="w-full h-11 px-3 border rounded-lg bg-background"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Upload File</label>
                                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                                    <p className="font-bold">Click to upload or drag and drop</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        PDF, Video, Audio, or Document (max 500MB)
                                    </p>
                                </div>
                            </div>

                            {/* Applicable Classes */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    Applicable Classes
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {classes.map(cls => (
                                        <button
                                            key={cls}
                                            type="button"
                                            onClick={() => toggleClass(cls)}
                                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
                                                ${selectedClasses.includes(cls)
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'hover:border-primary/50'}`}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                                {resourceForm.formState.errors.applicableClasses && (
                                    <p className="text-sm text-destructive">{resourceForm.formState.errors.applicableClasses.message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 gap-2" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Sparkles className="w-4 h-4 animate-spin" /> Uploading...</>
                            ) : (
                                <><Upload className="w-4 h-4" /> Upload Resource</>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}

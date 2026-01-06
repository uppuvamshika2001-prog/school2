'use client';

// Book Detail View
// ================

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft,
    BookOpen,
    MapPin,
    Calendar,
    User,
    Edit,
    Trash2,
    BookCopy,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLibraryStore } from '@/stores/library.store';
import { BookCategory, BookStatus } from '@/types/library.types';
import { toast } from 'sonner';

const categoryLabels: Record<BookCategory, string> = {
    fiction: 'Fiction',
    'non-fiction': 'Non-Fiction',
    science: 'Science',
    mathematics: 'Mathematics',
    history: 'History',
    geography: 'Geography',
    literature: 'Literature',
    reference: 'Reference',
    biography: 'Biography',
    other: 'Other',
};

const statusConfig: Record<BookStatus, { label: string; color: string; bg: string }> = {
    available: { label: 'Available', color: 'text-green-600', bg: 'bg-green-500' },
    issued: { label: 'All Copies Issued', color: 'text-yellow-600', bg: 'bg-yellow-500' },
    reserved: { label: 'Reserved', color: 'text-blue-600', bg: 'bg-blue-500' },
    lost: { label: 'Lost', color: 'text-red-600', bg: 'bg-red-500' },
};

export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { selectedBook, isLoading, isSubmitting, fetchBookById, issueBook, clearSelectedBook } = useLibraryStore();

    const bookId = params.id as string;
    const [showIssueForm, setShowIssueForm] = useState(false);
    const [borrowerName, setBorrowerName] = useState('');
    const [borrowerId, setBorrowerId] = useState('');
    const [borrowerClass, setBorrowerClass] = useState('');

    useEffect(() => {
        if (bookId) {
            fetchBookById(bookId);
        }
        return () => clearSelectedBook();
    }, [bookId, fetchBookById, clearSelectedBook]);

    const handleIssue = async () => {
        if (!borrowerName || !borrowerId) {
            toast.error('Please fill in borrower details');
            return;
        }

        const success = await issueBook(bookId, borrowerId, borrowerName, 'STUDENT', borrowerClass);
        if (success) {
            toast.success(`Book issued to ${borrowerName}`);
            setShowIssueForm(false);
            setBorrowerName('');
            setBorrowerId('');
            setBorrowerClass('');
        } else {
            toast.error('Failed to issue book');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-muted-foreground font-medium">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (!selectedBook) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Card className="max-w-md w-full text-center border-none shadow-lg">
                    <CardContent className="pt-12 pb-8 space-y-4">
                        <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground/30" />
                        <h2 className="text-xl font-bold">Book Not Found</h2>
                        <p className="text-muted-foreground">
                            The book you are looking for does not exist or has been removed.
                        </p>
                        <Button onClick={() => router.push('/dashboard/library')}>
                            Back to Library
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const book = selectedBook;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/library">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${statusConfig[book.status].bg} text-white`}>
                                {statusConfig[book.status].label}
                            </Badge>
                            <Badge variant="outline">{categoryLabels[book.category]}</Badge>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">{book.title}</h1>
                        <p className="text-muted-foreground">by {book.author}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Book Info */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <div className="h-2 bg-primary" />
                        <CardContent className="p-6">
                            <div className="flex gap-6">
                                {/* Book Cover */}
                                <div className="w-32 h-44 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 
                                    flex items-center justify-center shrink-0 border">
                                    <BookCopy className="w-12 h-12 text-primary/60" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Description</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {book.description || 'No description available.'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold">ISBN</p>
                                            <p className="font-mono font-medium">{book.isbn}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold">Publisher</p>
                                            <p className="font-medium">{book.publisher}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold">Year</p>
                                            <p className="font-medium">{book.publicationYear}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold">Location</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                Shelf {book.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Issue Form */}
                    {showIssueForm && (
                        <Card className="border-2 border-primary shadow-sm">
                            <CardHeader>
                                <CardTitle>Issue Book</CardTitle>
                                <CardDescription>Enter borrower details to issue this book</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Borrower ID</label>
                                        <Input
                                            value={borrowerId}
                                            onChange={(e) => setBorrowerId(e.target.value)}
                                            placeholder="Student/Teacher ID"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Borrower Name</label>
                                        <Input
                                            value={borrowerName}
                                            onChange={(e) => setBorrowerName(e.target.value)}
                                            placeholder="Full name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Class (for students)</label>
                                    <Input
                                        value={borrowerClass}
                                        onChange={(e) => setBorrowerClass(e.target.value)}
                                        placeholder="e.g., 10-A"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" onClick={() => setShowIssueForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleIssue} disabled={isSubmitting}>
                                        {isSubmitting ? 'Issuing...' : 'Confirm Issue'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Availability */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Availability
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center p-4 bg-muted/30 rounded-xl">
                                <p className="text-4xl font-black text-primary">{book.availableCopies}</p>
                                <p className="text-sm text-muted-foreground">of {book.totalCopies} copies available</p>
                            </div>

                            {book.availableCopies > 0 && !showIssueForm && (
                                <Button
                                    className="w-full mt-4 gap-2"
                                    onClick={() => setShowIssueForm(true)}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Issue Book
                                </Button>
                            )}

                            {book.availableCopies === 0 && (
                                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                                    <Clock className="w-5 h-5 mx-auto text-yellow-600 mb-1" />
                                    <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                                        All copies issued
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Meta Info */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Catalog Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold">Added to Library</p>
                                <p className="font-medium">
                                    {new Date(book.addedAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold">Category</p>
                                <p className="font-medium">{categoryLabels[book.category]}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

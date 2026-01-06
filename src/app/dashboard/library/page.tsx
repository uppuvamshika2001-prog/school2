'use client';

// Library Books View
// ===================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Search,
    Filter,
    Plus,
    BookMarked,
    Users,
    AlertTriangle,
    Download,
    ChevronRight,
    BookCopy,
    MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLibraryStore } from '@/stores/library.store';
import { Book, BookCategory, BookStatus } from '@/types/library.types';
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
    issued: { label: 'All Issued', color: 'text-yellow-600', bg: 'bg-yellow-500' },
    reserved: { label: 'Reserved', color: 'text-blue-600', bg: 'bg-blue-500' },
    lost: { label: 'Lost', color: 'text-red-600', bg: 'bg-red-500' },
};

export default function LibraryPage() {
    const {
        books,
        summary,
        isLoading,
        fetchBooks,
        fetchSummary,
        setFilters
    } = useLibraryStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<BookCategory | ''>('');
    const [statusFilter, setStatusFilter] = useState<BookStatus | ''>('');

    useEffect(() => {
        fetchBooks();
        fetchSummary();
    }, [fetchBooks, fetchSummary]);

    useEffect(() => {
        const filters: any = {};
        if (searchQuery) filters.search = searchQuery;
        if (categoryFilter) filters.category = categoryFilter;
        if (statusFilter) filters.status = statusFilter;
        setFilters(filters);
        fetchBooks(filters);
    }, [searchQuery, categoryFilter, statusFilter, setFilters, fetchBooks]);

    const StatCard = ({
        title,
        value,
        icon,
        color,
        bg
    }: {
        title: string;
        value: number;
        icon: React.ReactNode;
        color: string;
        bg: string;
    }) => (
        <Card className="border-none shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
                        <h3 className="text-2xl font-black mt-1">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${bg} ${color}`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Library</h1>
                    <p className="text-muted-foreground mt-1 font-medium">
                        Browse and manage the school's book collection
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" asChild>
                        <Link href="/dashboard/library/digital">
                            <Download className="w-4 h-4" />
                            Digital Library
                        </Link>
                    </Button>
                    <Button className="gap-2" asChild>
                        <Link href="/dashboard/library/manage">
                            <Plus className="w-4 h-4" />
                            Add Book
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Books"
                    value={summary?.totalBooks || 0}
                    icon={<BookOpen className="w-5 h-5" />}
                    color="text-primary"
                    bg="bg-primary/10"
                />
                <StatCard
                    title="Available"
                    value={summary?.availableBooks || 0}
                    icon={<BookMarked className="w-5 h-5" />}
                    color="text-green-600"
                    bg="bg-green-100 dark:bg-green-900/30"
                />
                <StatCard
                    title="Issued"
                    value={summary?.issuedBooks || 0}
                    icon={<Users className="w-5 h-5" />}
                    color="text-blue-600"
                    bg="bg-blue-100 dark:bg-blue-900/30"
                />
                <StatCard
                    title="Overdue"
                    value={summary?.overdueBooks || 0}
                    icon={<AlertTriangle className="w-5 h-5" />}
                    color="text-red-600"
                    bg="bg-red-100 dark:bg-red-900/30"
                />
            </div>

            {/* Books List */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/20 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Book Catalog</CardTitle>
                            <CardDescription>Search and browse available books</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search title, author, ISBN..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border rounded-lg bg-background 
                                        focus:ring-2 focus:ring-primary outline-none w-64
                                        border-muted-foreground/20"
                                />
                            </div>
                            {/* Category Filter */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value as BookCategory | '')}
                                className="h-10 px-3 text-sm border rounded-lg bg-background 
                                    focus:ring-2 focus:ring-primary outline-none font-medium
                                    border-muted-foreground/20"
                            >
                                <option value="">All Categories</option>
                                {Object.entries(categoryLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as BookStatus | '')}
                                className="h-10 px-3 text-sm border rounded-lg bg-background 
                                    focus:ring-2 focus:ring-primary outline-none font-medium
                                    border-muted-foreground/20"
                            >
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="issued">Issued</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="mt-4 text-muted-foreground font-medium">Loading books...</p>
                        </div>
                    ) : books.length === 0 ? (
                        <div className="p-12 text-center">
                            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30" />
                            <p className="mt-4 font-bold text-lg">No books found</p>
                            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {books.map(book => (
                                <Link
                                    key={book.id}
                                    href={`/dashboard/library/${book.id}`}
                                    className="block p-6 hover:bg-muted/30 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Book Icon */}
                                        <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 
                                            flex items-center justify-center shrink-0 border">
                                            <BookCopy className="w-8 h-8 text-primary/60" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className={`${statusConfig[book.status].bg} text-white text-[10px]`}>
                                                    {statusConfig[book.status].label}
                                                </Badge>
                                                <Badge variant="outline" className="text-[10px]">
                                                    {categoryLabels[book.category]}
                                                </Badge>
                                            </div>

                                            <h3 className="font-bold text-lg truncate">{book.title}</h3>
                                            <p className="text-sm text-muted-foreground">by {book.author}</p>

                                            <div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground">
                                                <span className="font-mono">ISBN: {book.isbn}</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    Shelf {book.location}
                                                </span>
                                                <span className="font-bold">
                                                    {book.availableCopies}/{book.totalCopies} available
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { mockLibrary } from '@/data/student-mock';
import { Book, Globe, Search, ExternalLink, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentLibraryPage() {
    const [activeTab, setActiveTab] = useState<'physical' | 'digital'>('physical');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Library & Resources</h1>
                <p className="text-muted-foreground">Access physical books and digital learning materials for Class 5-10</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab('physical')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'physical' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    Physical Books
                </button>
                <button
                    onClick={() => setActiveTab('digital')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'digital' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    Digital Library
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search books by title, author..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {activeTab === 'physical' ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mockLibrary.physical.map((book) => (
                            <div key={book.id} className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-between h-full">
                                <div className="space-y-2">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 w-fit rounded-lg">
                                        <Book className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                                    <p className="text-sm text-muted-foreground">{book.author}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-xs font-semibold",
                                        book.status === 'Available' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    )}>
                                        {book.status}
                                    </span>
                                    {book.dueDate && (
                                        <div className="flex items-center gap-1 text-red-500">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-xs">Due: {book.dueDate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mockLibrary.digital.map((book) => (
                            <div key={book.id} className="bg-card p-4 rounded-xl border shadow-sm hover:border-primary/50 transition-colors group cursor-pointer">
                                <div className="flex items-start justify-between">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 w-fit rounded-lg">
                                        <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                </div>
                                <div className="mt-4 space-y-1">
                                    <h3 className="font-semibold">{book.title}</h3>
                                    <p className="text-sm text-muted-foreground">{book.author}</p>
                                </div>
                                <button className="mt-4 w-full py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                    Read Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

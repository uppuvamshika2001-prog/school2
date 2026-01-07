'use client';

// Digital Library View
// ====================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FileText,
    Video,
    Headphones,
    Presentation,
    File,
    Search,
    Download,
    Eye,
    ChevronLeft,
    Plus,
    Users,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLibraryStore } from '@/stores/library.store';
import { DigitalResource, ResourceType, BookCategory } from '@/types/library.types';
import { toast } from 'sonner';
import { useIsSuperAdmin } from '@/stores/auth.store';

const resourceTypeConfig: Record<ResourceType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    pdf: {
        label: 'PDF',
        icon: <FileText className="w-5 h-5" />,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30'
    },
    video: {
        label: 'Video',
        icon: <Video className="w-5 h-5" />,
        color: 'text-purple-600',
        bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    audio: {
        label: 'Audio',
        icon: <Headphones className="w-5 h-5" />,
        color: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-900/30'
    },
    document: {
        label: 'Document',
        icon: <File className="w-5 h-5" />,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    presentation: {
        label: 'Presentation',
        icon: <Presentation className="w-5 h-5" />,
        color: 'text-orange-600',
        bg: 'bg-orange-100 dark:bg-orange-900/30'
    },
};

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

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography'];

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

export default function DigitalLibraryPage() {
    const isSuperAdmin = useIsSuperAdmin();
    const {
        digitalResources,
        isLoading,
        fetchDigitalResources,
    } = useLibraryStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState<ResourceType | ''>('');

    useEffect(() => {
        fetchDigitalResources();
    }, [fetchDigitalResources]);

    useEffect(() => {
        const filters: any = {};
        if (searchQuery) filters.search = searchQuery;
        if (subjectFilter) filters.subject = subjectFilter;
        fetchDigitalResources(filters);
    }, [searchQuery, subjectFilter, fetchDigitalResources]);

    const filteredResources = digitalResources.filter(r =>
        !typeFilter || r.type === typeFilter
    );

    const handleDownload = (resource: DigitalResource) => {
        toast.success(`Downloading "${resource.title}"...`);
    };

    const handleView = (resource: DigitalResource) => {
        toast.info(`Opening "${resource.title}" in viewer...`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/library">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Digital Library</h1>
                        <p className="text-muted-foreground mt-1 font-medium">
                            Access educational resources, videos, and documents
                        </p>
                    </div>
                </div>
                {!isSuperAdmin && (
                    <Button className="gap-2" asChild>
                        <Link href="/dashboard/library/manage">
                            <Plus className="w-4 h-4" />
                            Upload Resource
                        </Link>
                    </Button>
                )}
            </div>

            {/* Resource Type Tabs */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setTypeFilter('')}
                    className={`px-4 py-2 rounded-full font-medium transition-all
                        ${!typeFilter
                            ? 'bg-primary text-primary-foreground'
                            : 'border hover:border-primary/50'}`}
                >
                    All Resources
                </button>
                {Object.entries(resourceTypeConfig).map(([type, config]) => (
                    <button
                        key={type}
                        onClick={() => setTypeFilter(type as ResourceType)}
                        className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2
                            ${typeFilter === type
                                ? `${config.bg} ${config.color}`
                                : 'border hover:border-primary/50'}`}
                    >
                        {config.icon}
                        {config.label}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search resources by title or subject..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg bg-background 
                                    focus:ring-2 focus:ring-primary outline-none
                                    border-muted-foreground/20"
                            />
                        </div>
                        {/* Subject Filter */}
                        <select
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                            className="h-10 px-4 text-sm border rounded-lg bg-background 
                                focus:ring-2 focus:ring-primary outline-none font-medium
                                border-muted-foreground/20 min-w-[180px]"
                        >
                            <option value="">All Subjects</option>
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Resources Grid */}
            {isLoading ? (
                <div className="p-12 text-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-muted-foreground font-medium">Loading resources...</p>
                </div>
            ) : filteredResources.length === 0 ? (
                <Card className="border-none shadow-sm">
                    <CardContent className="p-12 text-center">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground/30" />
                        <p className="mt-4 font-bold text-lg">No resources found</p>
                        <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(resource => {
                        const typeInfo = resourceTypeConfig[resource.type];
                        return (
                            <Card key={resource.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
                                <div className={`h-2 ${typeInfo.bg.replace('bg-', 'bg-').replace('/30', '')}`} />
                                <CardContent className="p-5">
                                    {/* Header */}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className={`p-3 rounded-xl ${typeInfo.bg} ${typeInfo.color}`}>
                                            {typeInfo.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="secondary" className="text-[10px]">
                                                    {resource.subject}
                                                </Badge>
                                                <Badge variant="outline" className="text-[10px]">
                                                    {typeInfo.label}
                                                </Badge>
                                            </div>
                                            <h3 className="font-bold truncate">{resource.title}</h3>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {resource.description}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(resource.uploadedAt)}
                                        </span>
                                        <span className="font-mono">{resource.fileSize}</span>
                                        <span className="flex items-center gap-1">
                                            <Download className="w-3 h-3" />
                                            {resource.downloads}
                                        </span>
                                    </div>

                                    {/* Classes */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {resource.applicableClasses.slice(0, 4).map(cls => (
                                            <span key={cls} className="text-[10px] px-2 py-0.5 rounded bg-muted font-medium">
                                                {cls}
                                            </span>
                                        ))}
                                        {resource.applicableClasses.length > 4 && (
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-medium">
                                                +{resource.applicableClasses.length - 4}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={() => handleView(resource)}
                                        >
                                            <Eye className="w-3 h-3" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={() => handleDownload(resource)}
                                        >
                                            <Download className="w-3 h-3" />
                                            Download
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

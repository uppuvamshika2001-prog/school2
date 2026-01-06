
'use client';

import { useEffect } from 'react';
import { useClassStore } from '@/stores/class.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Search,
    Filter,
    Users,
    BookOpen,
    ChevronRight,
    LayoutGrid,
    List
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useIsSuperAdmin } from '@/stores/auth.store';

export default function ClassListPage() {
    const { classes, isLoading, fetchClasses, filters, setFilters } = useClassStore();
    const isSuperAdmin = useIsSuperAdmin();

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Classes</h1>
                    <p className="text-muted-foreground">Manage school classes, sections, and assignments.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <LayoutGrid className="h-4 w-4" />
                        Grid
                    </Button>
                    {!isSuperAdmin && (
                        <Link href="/dashboard/academics/classes/new">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Class
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <Card className="border-none shadow-sm bg-muted/20">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search classes..."
                                className="pl-10 bg-background"
                                value={filters.search}
                                onChange={(e) => setFilters({ search: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 bg-background">
                                        <Filter className="h-4 w-4" />
                                        Year: {filters.academicYear}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setFilters({ academicYear: '2023-2024' })}>2023-2024</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilters({ academicYear: '2022-2023' })}>2022-2023</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 bg-background">
                                        Status: {filters.status === 'ALL' ? 'All' : filters.status}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setFilters({ status: 'ALL' })}>All Statuses</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilters({ status: 'ACTIVE' })}>Active</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilters({ status: 'INACTIVE' })}>Inactive</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="animate-pulse h-48 bg-muted" />
                    ))
                ) : classes.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                            <BookOpen className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No classes found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    classes.map((cls) => (
                        <Card key={cls.id} className="group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-bold">{cls.name}</CardTitle>
                                        <CardDescription>{cls.academicYear}</CardDescription>
                                    </div>
                                    <Badge variant={cls.status === 'ACTIVE' ? 'success' : 'secondary'} className="rounded-md">
                                        {cls.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-4 w-4" />
                                            <span>{cls.sections.length} Sections</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-4 w-4" />
                                            <span>{cls.sections.reduce((acc, s) => acc + s.studentCount, 0)} Students</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {cls.sections.map(sec => (
                                            <Badge key={sec.id} variant="outline" className="bg-primary/5 hover:bg-primary/10 transition-colors">
                                                Sec {sec.name}
                                            </Badge>
                                        ))}
                                    </div>

                                    <Link href={`/dashboard/academics/classes/${cls.id}`} className="block">
                                        <Button variant="secondary" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            View Details
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

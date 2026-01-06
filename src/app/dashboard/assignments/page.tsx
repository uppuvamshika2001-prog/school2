'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore, useIsAdmin } from '@/stores/auth.store';
import { BookOpen, ClipboardList, PenTool, CheckCircle2 } from 'lucide-react';

// Import the components/sections
import HomeworkSection from './_components/HomeworkSection';
import SubjectAssignmentSection from './_components/SubjectAssignmentSection';

export default function AssignmentPortalPage() {
    const { user } = useAuthStore();
    const isAdmin = useIsAdmin();
    const [activeTab, setActiveTab] = useState('homework');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Assignment & Task Portal
                </h1>
                <p className="text-muted-foreground">Central hub for managing student homework and academic subject assignments.</p>
            </div>

            <Tabs defaultValue="homework" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full md:w-[600px] grid-cols-2 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger
                        value="homework"
                        className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 py-2.5"
                    >
                        <PenTool className="w-4 h-4" />
                        Homework & Classwork
                    </TabsTrigger>
                    {isAdmin && (
                        <TabsTrigger
                            value="subject-assign"
                            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 py-2.5"
                        >
                            <ClipboardList className="w-4 h-4" />
                            Subject Assignments
                        </TabsTrigger>
                    )}
                </TabsList>

                <div className="mt-8">
                    <TabsContent value="homework" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                        <HomeworkSection />
                    </TabsContent>

                    {isAdmin && (
                        <TabsContent value="subject-assign" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                            <SubjectAssignmentSection />
                        </TabsContent>
                    )}
                </div>
            </Tabs>
        </div>
    );
}

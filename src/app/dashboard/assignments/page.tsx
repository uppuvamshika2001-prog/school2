'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore, useIsAdmin } from '@/stores/auth.store';

// Import the components/sections
import HomeworkSection from './_components/HomeworkSection';
import SubjectAssignmentSection from './_components/SubjectAssignmentSection';

export default function AssignmentPortalPage() {
    const { user } = useAuthStore();
    const isAdmin = useIsAdmin();
    const [activeTab, setActiveTab] = useState('homework');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Assignment & Task Portal</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage homework, classwork, and subject assignments</p>
            </div>

            <Tabs defaultValue="homework" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="homework">Homework & Classwork</TabsTrigger>
                    {isAdmin && (
                        <TabsTrigger value="subject-assign">Subject Assignments</TabsTrigger>
                    )}
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="homework" className="m-0">
                        <HomeworkSection />
                    </TabsContent>

                    {isAdmin && (
                        <TabsContent value="subject-assign" className="m-0">
                            <SubjectAssignmentSection />
                        </TabsContent>
                    )}
                </div>
            </Tabs>
        </div>
    );
}

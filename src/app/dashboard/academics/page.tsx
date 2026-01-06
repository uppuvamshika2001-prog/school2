'use client';

import { BookOpen } from 'lucide-react';

export default function AcademicsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Academics Management</h1>
            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { name: 'Classes', href: '/dashboard/academics/classes', icon: BookOpen },
                    { name: 'Subjects', href: '/dashboard/academics/subjects', icon: BookOpen }
                ].map((item) => (
                    <a key={item.name} href={item.href} className="block p-6 border rounded-xl bg-card hover:shadow-lg transition-all cursor-pointer">
                        <item.icon className="w-8 h-8 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                        <p className="text-muted-foreground text-sm">Manage {item.name.toLowerCase()}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}

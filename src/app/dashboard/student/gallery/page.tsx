'use client';

import { Image as ImageIcon } from 'lucide-react';

export default function StudentGalleryPage() {
    const photos = [
        { id: 1, title: 'Annual Sports Day 2025', count: 12 },
        { id: 2, title: 'Science Exhibition', count: 8 },
        { id: 3, title: 'Independence Day Celebration', count: 15 },
        { id: 4, title: 'Class 10 Field Trip', count: 20 },
        { id: 5, title: 'Art & Craft Workshop', count: 5 },
        { id: 6, title: 'School Assembly', count: 4 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Photo Gallery</h1>
                <p className="text-muted-foreground">Memories from school events and activities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((album) => (
                    <div key={album.id} className="group cursor-pointer bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all">
                        <div className="aspect-video bg-secondary flex items-center justify-center relative overflow-hidden">
                            {/* Placeholder pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-500 via-gray-300 to-gray-200"></div>
                            <ImageIcon className="w-12 h-12 text-muted-foreground/50 group-hover:scale-110 transition-transform duration-500" />

                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                                <span className="text-white text-sm font-medium">{album.count} Photos</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{album.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

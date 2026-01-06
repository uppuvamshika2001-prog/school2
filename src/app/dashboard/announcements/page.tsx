'use client';

import { useState } from 'react';
import { Bell, Plus, Calendar, Users, Eye, Trash2, X, Megaphone, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

const initialAnnouncements = [
    {
        id: '1',
        title: 'Winter Vacation Notice',
        content: 'School will remain closed from January 1st to January 10th for winter break. All students are advised to complete their holiday homework during this period.',
        category: 'Holiday',
        priority: 'High',
        audience: 'All',
        author: 'Principal Office',
        date: '2025-12-28',
        views: 342
    },
    {
        id: '2',
        title: 'Annual Sports Day',
        content: 'Annual Sports Day will be held on January 20th. All students are requested to participate in at least one event. Practice sessions start from January 15th.',
        category: 'Event',
        priority: 'Medium',
        audience: 'Students',
        author: 'Sports Department',
        date: '2025-12-26',
        views: 256
    },
    {
        id: '3',
        title: 'Parent-Teacher Meeting',
        content: 'PTM for Classes 9-12 will be held on January 25th from 10 AM to 2 PM. Parents are requested to attend without fail.',
        category: 'Meeting',
        priority: 'High',
        audience: 'Parents',
        author: 'Academic Office',
        date: '2025-12-24',
        views: 189
    },
    {
        id: '4',
        title: 'Science Exhibition Registration',
        content: 'Registrations are open for the upcoming Science Exhibition. Students interested in participating should register with their class teacher by January 5th.',
        category: 'Event',
        priority: 'Medium',
        audience: 'Students',
        author: 'Science Department',
        date: '2025-12-22',
        views: 145
    },
    {
        id: '5',
        title: 'Fee Payment Reminder',
        content: 'This is a reminder that Term 2 fees are due by January 15th. Late payments will incur a penalty of 5% per week.',
        category: 'Administrative',
        priority: 'High',
        audience: 'Parents',
        author: 'Accounts Department',
        date: '2025-12-20',
        views: 412
    },
    {
        id: '6',
        title: 'Library Books Return',
        content: 'All library books must be returned before the winter break. Students with pending books will not be issued new books next term.',
        category: 'Administrative',
        priority: 'Low',
        audience: 'Students',
        author: 'Library',
        date: '2025-12-18',
        views: 98
    }
];

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        category: 'Event',
        priority: 'Medium',
        audience: 'All'
    });

    const handleAddAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        const announcement = {
            id: (announcements.length + 1).toString(),
            ...newAnnouncement,
            author: 'Admin',
            date: new Date().toISOString().split('T')[0],
            views: 0
        };
        setAnnouncements([announcement, ...announcements]);
        setShowAddModal(false);
        setNewAnnouncement({ title: '', content: '', category: 'Event', priority: 'Medium', audience: 'All' });
        toast.success('Announcement created successfully!');
    };

    const handleDelete = (id: string) => {
        setAnnouncements(announcements.filter(a => a.id !== id));
        toast.success('Announcement deleted');
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Holiday': return <Calendar className="w-4 h-4" />;
            case 'Event': return <Megaphone className="w-4 h-4" />;
            case 'Meeting': return <Users className="w-4 h-4" />;
            case 'Administrative': return <Info className="w-4 h-4" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                    <p className="text-muted-foreground mt-1">Broadcast messages to students, parents and staff.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Announcement</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl font-bold mt-1">{announcements.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Bell className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">High Priority</p>
                            <p className="text-2xl font-bold mt-1 text-red-600">{announcements.filter(a => a.priority === 'High').length}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">This Week</p>
                            <p className="text-2xl font-bold mt-1">4</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Views</p>
                            <p className="text-2xl font-bold mt-1">{announcements.reduce((sum, a) => sum + a.views, 0)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Eye className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                                        {announcement.priority}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {getCategoryIcon(announcement.category)}
                                        {announcement.category}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        <Users className="w-3 h-3 inline mr-1" />
                                        {announcement.audience}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{announcement.title}</h3>
                                <p className="text-muted-foreground text-sm">{announcement.content}</p>
                                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                                    <span>By {announcement.author}</span>
                                    <span>•</span>
                                    <span>{announcement.date}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" /> {announcement.views} views
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(announcement.id)}
                                className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">New Announcement</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddAnnouncement} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <input
                                    required
                                    type="text"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    placeholder="Announcement title"
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                    placeholder="Announcement content..."
                                    className="w-full p-2 border rounded-md resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <select
                                        value={newAnnouncement.category}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value="Event">Event</option>
                                        <option value="Holiday">Holiday</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Administrative">Administrative</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Priority</label>
                                    <select
                                        value={newAnnouncement.priority}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Audience</label>
                                    <select
                                        value={newAnnouncement.audience}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, audience: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value="All">All</option>
                                        <option value="Students">Students</option>
                                        <option value="Parents">Parents</option>
                                        <option value="Teachers">Teachers</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Publish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

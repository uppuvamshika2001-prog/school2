'use client';

import { useState } from 'react';
import { Save, User, Building2, Bell, Shield, Mail, Globe, Palette } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        schoolName: 'Springfield High School',
        address: '742 Evergreen Terrace, Springfield',
        phone: '+1 (555) 0123-4567',
        email: 'admin@springfieldhigh.edu',
        website: 'www.springfieldhigh.edu',
        academicYear: '2024-2025',
        language: 'English',
        timezone: 'UTC-5 (Eastern Time)',
        theme: 'light',
        emailNotifications: true,
        smsNotifications: false,
        parentLogin: true,
        showGradesToStudents: true,
        maintenanceMode: false
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Settings saved successfully!');
    };

    const tabs = [
        { id: 'general', label: 'General Profile', icon: Building2 },
        { id: 'academic', label: 'Academic Config', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security & Roles', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage system preferences and configurations.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 bg-card rounded-xl border p-2 h-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-card rounded-xl border p-6">
                    <form onSubmit={handleSave}>
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">School Profile</h3>
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">School Name</label>
                                            <input
                                                type="text"
                                                value={settings.schoolName}
                                                onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={settings.phone}
                                                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                                    className="w-full p-2 border rounded-md"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={settings.email}
                                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                                    className="w-full p-2 border rounded-md"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Address</label>
                                            <textarea
                                                rows={3}
                                                value={settings.address}
                                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                                className="w-full p-2 border rounded-md resize-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Website</label>
                                            <input
                                                type="text"
                                                value={settings.website}
                                                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'academic' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Academic Configuration</h3>
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Current Academic Year</label>
                                            <select
                                                value={settings.academicYear}
                                                onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                            >
                                                <option>2023-2024</option>
                                                <option>2024-2025</option>
                                                <option>2025-2026</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Default Language</label>
                                            <select
                                                value={settings.language}
                                                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                            >
                                                <option>English</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                                <option>Hindi</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                                            <div>
                                                <p className="font-medium">Show Grades to Students</p>
                                                <p className="text-xs text-muted-foreground">Allow students to view their report cards online</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.showGradesToStudents}
                                                    onChange={(e) => setSettings({ ...settings, showGradesToStudents: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Email Notifications</p>
                                                    <p className="text-xs text-muted-foreground">Receive system alerts via email</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.emailNotifications}
                                                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Bell className="w-5 h-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">SMS Notifications</p>
                                                    <p className="text-xs text-muted-foreground">Receive critical alerts via SMS</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.smsNotifications}
                                                    onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {['security', 'appearance'].includes(activeTab) && (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="bg-muted p-4 rounded-full mb-3">
                                    <Shield className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium">Coming Soon</h3>
                                <p className="text-muted-foreground">This section is currently under development.</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Save, Building2, Bell, Shield, Palette, Globe, 
  Mail, Phone, User, Lock, Key, Activity, Clock,
  Sun, Moon, Monitor, Check, X
} from 'lucide-react';
import { toast } from 'sonner';
import {
  GeneralSettings,
  AcademicSettings,
  NotificationSettings,
  SecuritySettings,
  AppearanceSettings,
  AllSettings,
  defaultGeneralSettings,
  defaultAcademicSettings,
  defaultNotificationSettings,
  defaultSecuritySettings,
  defaultAppearanceSettings,
} from './types/settings.types';

export default function SettingsPage() {
    const { user, setUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // Settings state
    const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(defaultGeneralSettings);
    const [academicSettings, setAcademicSettings] = useState<AcademicSettings>(defaultAcademicSettings);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(defaultSecuritySettings);
    const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings);

    // Load settings from localStorage on mount
    useEffect(() => {
        const loadSettings = () => {
            try {
                const saved = localStorage.getItem('appSettings');
                if (saved) {
                    const parsed: AllSettings = JSON.parse(saved);
                    setGeneralSettings({ ...defaultGeneralSettings, ...parsed.general });
                    setAcademicSettings({ ...defaultAcademicSettings, ...parsed.academic });
                    setNotificationSettings({ ...defaultNotificationSettings, ...parsed.notifications });
                    setSecuritySettings({ ...defaultSecuritySettings, ...parsed.security });
                    setAppearanceSettings({ ...defaultAppearanceSettings, ...parsed.appearance });
                }
                
                // Load user data into general settings
                if (user) {
                    setGeneralSettings(prev => ({
                        ...prev,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        personalEmail: user.email,
                        personalPhone: user.phone || '',
                    }));
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
                toast.error('Failed to load settings');
            }
        };

        loadSettings();
    }, [user]);

    // Save settings
    const handleSave = async () => {
        setIsLoading(true);
        try {
            const allSettings: AllSettings = {
                general: generalSettings,
                academic: academicSettings,
                notifications: notificationSettings,
                security: securitySettings,
                appearance: appearanceSettings,
            };

            // Save to localStorage
            localStorage.setItem('appSettings', JSON.stringify(allSettings));

            // Update user in store if general settings changed
            if (user) {
                setUser({
                    ...user,
                    firstName: generalSettings.firstName,
                    lastName: generalSettings.lastName,
                    email: generalSettings.personalEmail,
                    phone: generalSettings.personalPhone,
                });
            }

            // Apply theme if changed
            if (appearanceSettings.theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else if (appearanceSettings.theme === 'light') {
                document.documentElement.classList.remove('dark');
            }

            toast.success('Settings saved successfully!');
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error('Failed to save settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General Profile', icon: Building2 },
        { id: 'academic', label: 'Academic Config', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security & Roles', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
    ];

    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN';

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage system preferences and configurations.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>

            {hasUnsavedChanges && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        You have unsaved changes. Don't forget to save before leaving!
                    </p>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 bg-card rounded-xl border p-2 h-fit">
                    {tabs.map((tab) => {
                        // Hide security tab for non-admins
                        if (tab.id === 'security' && !isAdmin) return null;
                        
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-card rounded-xl border p-6">
                    {/* GENERAL PROFILE SECTION */}
                    {activeTab === 'general' && (
                        <div className="space-y-8">
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </h3>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <input
                                                type="text"
                                                value={generalSettings.firstName}
                                                onChange={(e) => {
                                                    setGeneralSettings({ ...generalSettings, firstName: e.target.value });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <input
                                                type="text"
                                                value={generalSettings.lastName}
                                                onChange={(e) => {
                                                    setGeneralSettings({ ...generalSettings, lastName: e.target.value });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email Address</label>
                                            <input
                                                type="email"
                                                value={generalSettings.personalEmail}
                                                onChange={(e) => {
                                                    setGeneralSettings({ ...generalSettings, personalEmail: e.target.value });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                                placeholder="john.doe@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={generalSettings.personalPhone}
                                                onChange={(e) => {
                                                    setGeneralSettings({ ...generalSettings, personalPhone: e.target.value });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Organization Information */}
                            {isAdmin && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Building2 className="w-5 h-5" />
                                        Organization Profile
                                    </h3>
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Organization Name</label>
                                            <input
                                                type="text"
                                                value={generalSettings.organizationName}
                                                onChange={(e) => {
                                                    setGeneralSettings({ ...generalSettings, organizationName: e.target.value });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Contact Phone</label>
                                                <input
                                                    type="text"
                                                    value={generalSettings.contactPhone}
                                                    onChange={(e) => {
                                                        setGeneralSettings({ ...generalSettings, contactPhone: e.target.value });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="w-full p-2 border rounded-md bg-background"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Contact Email</label>
                                                <input
                                                    type="email"
                                                    value={generalSettings.contactEmail}
                                                    onChange={(e) => {
                                                        setGeneralSettings({ ...generalSettings, contactEmail: e.target.value });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="w-full p-2 border rounded-md bg-background"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Address</label>
                                            <textarea
                                                rows={3}
                                                value={generalSettings.address}
                                                onChange={(e) => {
                                                    setGeneralSettings({ ...generalSettings, address: e.target.value });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md resize-none bg-background"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Website</label>
                                                <input
                                                    type="text"
                                                    value={generalSettings.website}
                                                    onChange={(e) => {
                                                        setGeneralSettings({ ...generalSettings, website: e.target.value });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="w-full p-2 border rounded-md bg-background"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Timezone</label>
                                                <select
                                                    value={generalSettings.timezone}
                                                    onChange={(e) => {
                                                        setGeneralSettings({ ...generalSettings, timezone: e.target.value });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="w-full p-2 border rounded-md bg-background"
                                                >
                                                    <option>UTC-5 (Eastern Time)</option>
                                                    <option>UTC-6 (Central Time)</option>
                                                    <option>UTC-7 (Mountain Time)</option>
                                                    <option>UTC-8 (Pacific Time)</option>
                                                    <option>UTC+0 (GMT)</option>
                                                    <option>UTC+5:30 (IST)</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Currency</label>
                                                <select
                                                    value={generalSettings.currency}
                                                    onChange={(e) => {
                                                        setGeneralSettings({ ...generalSettings, currency: e.target.value });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="w-full p-2 border rounded-md bg-background"
                                                >
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="GBP">GBP (£)</option>
                                                    <option value="INR">INR (₹)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ACADEMIC CONFIG SECTION */}
                    {activeTab === 'academic' && isAdmin && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Academic Configuration</h3>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Current Academic Year</label>
                                            <select
                                                value={academicSettings.academicYear}
                                                onChange={(e) => {
                                                    setAcademicSettings({ ...academicSettings, academicYear: e.target.value });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                            >
                                                <option>2023-2024</option>
                                                <option>2024-2025</option>
                                                <option>2025-2026</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Default Language</label>
                                            <select
                                                value={academicSettings.language}
                                                onChange={(e) => {
                                                    setAcademicSettings({ ...academicSettings, language: e.target.value });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                            >
                                                <option>English</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                                <option>Hindi</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grading System */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Grading System</h3>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Grade Scale</label>
                                            <select
                                                value={academicSettings.gradeScale}
                                                onChange={(e) => {
                                                    setAcademicSettings({ ...academicSettings, gradeScale: e.target.value as any });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                            >
                                                <option value="letter">Letter (A-F)</option>
                                                <option value="percentage">Percentage</option>
                                                <option value="gpa">GPA (0-4)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Passing Grade (%)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={academicSettings.passingGrade}
                                                onChange={(e) => {
                                                    setAcademicSettings({ ...academicSettings, passingGrade: parseInt(e.target.value) });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Calculation Method</label>
                                            <select
                                                value={academicSettings.gradeCalculation}
                                                onChange={(e) => {
                                                    setAcademicSettings({ ...academicSettings, gradeCalculation: e.target.value as any });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                            >
                                                <option value="average">Average</option>
                                                <option value="weighted">Weighted Average</option>
                                                <option value="best">Best Performance</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Settings */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Attendance Settings</h3>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Minimum Attendance (%)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={academicSettings.minimumAttendance}
                                                onChange={(e) => {
                                                    setAcademicSettings({ ...academicSettings, minimumAttendance: parseInt(e.target.value) });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Late Arrival Grace (minutes)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={academicSettings.lateArrivalGrace}
                                                onChange={(e) => {
                                                    setAcademicSettings({ ...academicSettings, lateArrivalGrace: parseInt(e.target.value) });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="w-full p-2 border rounded-md bg-background"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                                        <div>
                                            <p className="font-medium">Show Grades to Students</p>
                                            <p className="text-xs text-muted-foreground">Allow students to view their report cards online</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={academicSettings.showGradesToStudents}
                                                onChange={(e) => {
                                                    setAcademicSettings({ ...academicSettings, showGradesToStudents: e.target.checked });
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS SECTION - Continued in next message due to length */}
                </div>
            </div>
        </div>
    );
}

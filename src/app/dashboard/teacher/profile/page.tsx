'use client';

import { useAuthStore } from '@/stores/auth.store';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export default function TeacherProfilePage() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and preferences</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Card */}
                <div className="md:col-span-2">
                    <div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                            <p className="text-muted-foreground capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        {user.phone}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    Demo School, Mumbai
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Professional Details */}
                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Professional Details</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Employee ID</span>
                            <span className="font-medium">T-2024-001</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Department</span>
                            <span className="font-medium">Mathematics</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Designation</span>
                            <span className="font-medium">Senior Teacher</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Joining Date</span>
                            <span className="font-medium">{format(new Date(), 'MMMM d, yyyy')}</span>
                        </div>
                    </div>
                </div>

                {/* Academic Info */}
                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Academic Information</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Qualification</span>
                            <span className="font-medium">M.Sc, B.Ed</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Specialization</span>
                            <span className="font-medium">Algebra & Geometry</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Teaching Classes</span>
                            <span className="font-medium">Class 9, Class 10</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Experience</span>
                            <span className="font-medium">8 Years</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

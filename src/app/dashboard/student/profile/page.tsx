'use client';

import { mockStudentProfile } from '@/data/student-mock';
import { User, Phone, Mail, MapPin, Calendar, Shield, Heart, GraduationCap, Award, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentProfilePage() {
    const { parents, guardian, stats } = mockStudentProfile;

    return (
        <div className="space-y-5 p-4 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        My Student Profile
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your academic and personal identity</p>
                </div>
            </div>

            {/* STUDENT DETAILS - FIRST */}
            <div className="bg-card rounded-2xl border shadow-lg overflow-hidden border-t-4 border-t-primary">
                <div className="p-5 border-b bg-gradient-to-r from-primary/10 to-blue-500/10">
                    <h2 className="text-lg font-black flex items-center gap-2 text-primary">
                        <GraduationCap className="w-5 h-5" />
                        Student Information
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Personal and academic details</p>
                </div>

                <div className="p-5">
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Profile Picture Section */}
                        <div className="md:col-span-1 flex flex-col items-center text-center">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-4xl text-white font-black shadow-xl border-4 border-background">
                                    {mockStudentProfile.name[0]}
                                </div>
                                <div className="absolute -bottom-1 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-background" />
                            </div>
                            <h3 className="text-lg font-black mt-4">{mockStudentProfile.name}</h3>
                            <p className="text-primary font-bold uppercase tracking-widest text-[10px] mt-1.5">
                                Class {mockStudentProfile.class} | Roll #{mockStudentProfile.rollNo}
                            </p>
                            <div className="mt-4 w-full space-y-1.5">
                                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <p className="text-[10px] font-bold text-green-700 dark:text-green-400">Active Student</p>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400">Joined: June 2023</p>
                                </div>
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <h4 className="font-black text-base mb-3 flex items-center gap-2 text-primary">
                                    <User className="w-4 h-4" />
                                    Personal Details
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <DetailField label="Student ID" value={mockStudentProfile.id} />
                                    <DetailField label="Full Name" value={mockStudentProfile.name} />
                                    <DetailField label="Class & Section" value={mockStudentProfile.class} />
                                    <DetailField label="Roll Number" value={mockStudentProfile.rollNo} />
                                    <DetailField label="Date of Birth" value={mockStudentProfile.dob} />
                                    <DetailField label="Email Address" value={mockStudentProfile.email} />
                                    <DetailField label="Phone Number" value={mockStudentProfile.phone} />
                                    <div className="md:col-span-2">
                                        <DetailField label="Residential Address" value={mockStudentProfile.address} />
                                    </div>
                                </div>
                            </div>

                            {/* Academic Stats */}
                            <div className="pt-4 border-t">
                                <h4 className="font-black text-base mb-3 flex items-center gap-2 text-primary">
                                    <Award className="w-4 h-4" />
                                    Academic Overview
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <StatCard label="Attendance" value={`${stats.attendance}%`} color="green" />
                                    <StatCard label="Pending Work" value={stats.assignmentsPending} color="orange" />
                                    <StatCard label="Upcoming Exams" value={stats.upcomingExams} color="blue" />
                                    <StatCard label="Fee Due" value={stats.feeDue === 0 ? 'Paid' : `₹${stats.feeDue}`} color={stats.feeDue === 0 ? 'green' : 'red'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PARENT DETAILS - SECOND */}
            <div className="bg-card rounded-2xl border shadow-lg overflow-hidden border-t-4 border-t-pink-500">
                <div className="p-5 border-b bg-pink-50/30 dark:bg-pink-900/10">
                    <h2 className="text-lg font-black flex items-center gap-2 text-pink-600 dark:text-pink-400">
                        <Heart className="w-5 h-5" />
                        Parent Information
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Father and mother contact details</p>
                </div>
                <div className="p-5 grid md:grid-cols-2 gap-8">
                    {/* Father's Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base">Father's Details</h4>
                                <p className="text-[10px] text-muted-foreground uppercase font-black">Primary Parent</p>
                            </div>
                        </div>
                        <div className="space-y-3 ml-2">
                            <DetailFieldWithIcon icon={User} label="Full Name" value={parents?.father.name} />
                            <DetailFieldWithIcon icon={BookOpen} label="Occupation" value={parents?.father.occupation} />
                            <DetailFieldWithIcon icon={Phone} label="Phone Number" value={parents?.father.phone} />
                            <DetailFieldWithIcon icon={Mail} label="Email Address" value={parents?.father.email} />
                        </div>
                    </div>

                    {/* Mother's Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                                <User className="w-5 h-5 text-pink-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base">Mother's Details</h4>
                                <p className="text-[10px] text-muted-foreground uppercase font-black">Secondary Parent</p>
                            </div>
                        </div>
                        <div className="space-y-3 ml-2">
                            <DetailFieldWithIcon icon={User} label="Full Name" value={parents?.mother.name} />
                            <DetailFieldWithIcon icon={BookOpen} label="Occupation" value={parents?.mother.occupation} />
                            <DetailFieldWithIcon icon={Phone} label="Phone Number" value={parents?.mother.phone} />
                            <DetailFieldWithIcon icon={Mail} label="Email Address" value={parents?.mother.email} />
                        </div>
                    </div>
                </div>
            </div>

            {/* GUARDIAN DETAILS - THIRD */}
            <div className="bg-card rounded-2xl border shadow-lg overflow-hidden border-t-4 border-t-indigo-500">
                <div className="p-5 border-b bg-indigo-50/30 dark:bg-indigo-900/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-black flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Shield className="w-5 h-5" />
                            Guardian Details
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Emergency contact information</p>
                    </div>
                    <span className="text-[10px] font-black px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700">
                        EMERGENCY CONTACT
                    </span>
                </div>
                <div className="p-5">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <DetailFieldWithIcon icon={User} label="Guardian Name" value={guardian.name} />
                            <DetailFieldWithIcon icon={Heart} label="Relationship" value={guardian.relation} />
                        </div>
                        <div className="space-y-3">
                            <DetailFieldWithIcon icon={Phone} label="Contact Phone" value={guardian.phone} />
                            <DetailFieldWithIcon icon={Mail} label="Email ID" value={guardian.email} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function DetailField({ label, value }: { label: string, value: any }) {
    return (
        <div className="group">
            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{value || '—'}</p>
        </div>
    );
}

function DetailFieldWithIcon({ icon: Icon, label, value }: { icon: any, label: string, value: any }) {
    return (
        <div className="flex items-start gap-3 group">
            <div className="p-2 bg-muted rounded-lg text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors break-words">{value || '—'}</p>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string, value: string | number, color: string }) {
    return (
        <div className={cn(
            "p-3 rounded-xl border-2 text-center transition-all hover:shadow-md hover:-translate-y-0.5",
            color === 'green' && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
            color === 'orange' && "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
            color === 'blue' && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
            color === 'red' && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        )}>
            <p className="text-xl font-black mb-0.5">{value}</p>
            <p className={cn(
                "text-[10px] font-bold uppercase tracking-wide",
                color === 'green' && "text-green-700 dark:text-green-400",
                color === 'orange' && "text-orange-700 dark:text-orange-400",
                color === 'blue' && "text-blue-700 dark:text-blue-400",
                color === 'red' && "text-red-700 dark:text-red-400"
            )}>{label}</p>
        </div>
    );
}

'use client';

import { useAuthStore, useIsSuperAdmin, useIsAdmin } from '@/stores/auth.store';
import { cn, formatNumber, formatCurrency } from '@/lib/utils';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Calendar,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isSuperAdmin = useIsSuperAdmin();
  const isAdmin = useIsAdmin();
  const token = Cookies.get('accessToken');

  // Teacher Dashboard View
  if (user?.role === 'TEACHER') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.firstName}! Here's your daily overview.</p>
        </div>

        {/* Teacher Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Attendance</p>
                <h3 className="text-2xl font-bold mt-2">95%</h3>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Present 22/23 days</p>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leave Balance</p>
                <h3 className="text-2xl font-bold mt-2">8</h3>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Available leaves this year</p>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <h3 className="text-2xl font-bold mt-2">1</h3>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Awaiting approval</p>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Classes</p>
                <h3 className="text-2xl font-bold mt-2">5</h3>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">3 completed, 2 remaining</p>
          </div>
        </div>

        {/* Recent Activity / Schedule */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold mb-4">Today's Schedule</h3>
            <div className="space-y-4">
              {[
                { time: '09:00 AM', class: 'Class 10-A', subject: 'Mathematics', status: 'Completed' },
                { time: '10:00 AM', class: 'Class 9-B', subject: 'Algebra', status: 'Completed' },
                { time: '11:30 AM', class: 'Class 8-A', subject: 'Geometry', status: 'In Progress' },
                { time: '02:00 PM', class: 'Class 10-B', subject: 'Mathematics', status: 'Upcoming' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-xs font-bold text-primary">
                      {item.time}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.subject}</p>
                      <p className="text-xs text-muted-foreground">{item.class}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-background border">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold mb-4">Recent Notices</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">Staff Meeting</h4>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly staff meeting at 3:30 PM in the Conference Hall.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">Exam Schedule</h4>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mid-term examination schedule has been finalized. Please check your email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch tenant statistics
  const { data: tenantStats, isLoading: loadingTenantStats } = useQuery({
    queryKey: ['tenant-statistics', user?.tenantId],
    queryFn: async () => {
      if (!user?.tenantId) return null;
      const response = await axios.get(
        `${API_BASE}/tenants/${user.tenantId}/statistics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data.statistics;
    },
    enabled: !!user?.tenantId && !!token && isAdmin,
  });

  // Fetch student statistics
  const { data: studentStats, isLoading: loadingStudentStats } = useQuery({
    queryKey: ['student-statistics'],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE}/students/statistics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data.statistics;
    },
    enabled: !!token && !isSuperAdmin,
  });

  // Fetch all tenants for super admin
  const { data: tenantsData, isLoading: loadingTenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE}/tenants?limit=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    },
    enabled: !!token && isSuperAdmin,
  });

  const isLoading = loadingTenantStats || loadingStudentStats || loadingTenants;

  // Combine stats from API
  const stats = {
    totalStudents: studentStats?.totalStudents || tenantStats?.totalStudents || 0,
    totalTeachers: tenantStats?.totalTeachers || 0,
    totalClasses: tenantStats?.totalClasses || 0,
    totalRevenue: tenantStats?.totalRevenue || 0,
    attendance: studentStats?.attendanceRate || 0,
    pendingFees: tenantStats?.pendingFees || 0,
    // Super Admin specific
    totalTenants: tenantsData?.meta?.total || 0,
    activeSchools: tenantsData?.tenants?.filter((t: any) => t.isActive).length || 0,
  };

  const statCards = [
    ...(isSuperAdmin
      ? [
        {
          label: 'Total Schools',
          value: formatNumber(stats.totalTenants),
          change: '+2',
          trend: 'up',
          icon: Building2,
          color: 'bg-violet-500',
        },
        {
          label: 'Active Schools',
          value: formatNumber(stats.activeSchools),
          change: '100%',
          trend: 'up',
          icon: TrendingUp,
          color: 'bg-emerald-500',
        },
      ]
      : []),
    {
      label: 'Total Students',
      value: formatNumber(stats.totalStudents),
      change: '+12',
      trend: 'up',
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Teachers',
      value: formatNumber(stats.totalTeachers),
      change: '+3',
      trend: 'up',
      icon: Users,
      color: 'bg-orange-500',
    },
    {
      label: 'Total Classes',
      value: formatNumber(stats.totalClasses),
      change: '0',
      trend: 'neutral',
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      label: 'Attendance Today',
      value: `${stats.attendance}%`,
      change: '+2.3%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-green-500',
    },
    ...(isAdmin
      ? [
        {
          label: 'Total Revenue',
          value: formatCurrency(stats.totalRevenue),
          change: '+15%',
          trend: 'up',
          icon: DollarSign,
          color: 'bg-emerald-500',
        },
        {
          label: 'Pending Fees',
          value: formatCurrency(stats.pendingFees),
          change: '-8%',
          trend: 'down',
          icon: DollarSign,
          color: 'bg-red-500',
        },
      ]
      : []),
  ];

  const recentActivities = [
    { type: 'enrollment', message: 'New student enrolled in Class 10-A', time: '2 mins ago' },
    { type: 'fee', message: 'Fee payment received from Priya Sharma', time: '15 mins ago' },
    { type: 'attendance', message: 'Attendance marked for Class 8-B', time: '30 mins ago' },
    { type: 'exam', message: 'Mid-term exam results published', time: '1 hour ago' },
    { type: 'announcement', message: 'Holiday announcement for Republic Day', time: '2 hours ago' },
  ];

  const upcomingEvents = [
    { title: 'Parent-Teacher Meeting', date: 'Jan 15, 2024', type: 'meeting' },
    { title: 'Annual Sports Day', date: 'Jan 20, 2024', type: 'event' },
    { title: 'Mid-Term Exams', date: 'Feb 1, 2024', type: 'exam' },
    { title: 'Science Exhibition', date: 'Feb 10, 2024', type: 'event' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at {user?.tenant?.name || 'your school'} today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>3 New Alerts</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="stat-card group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={cn('p-3 rounded-xl text-white', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {stat.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : stat.trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              ) : null}
              <span
                className={cn(
                  'text-sm font-medium',
                  stat.trend === 'up' ? 'text-green-500' :
                    stat.trend === 'down' ? 'text-red-500' :
                      'text-muted-foreground'
                )}
              >
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title text-lg">Recent Activities</h3>
            <p className="card-description">Latest updates from your school</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full mt-2',
                      activity.type === 'enrollment' && 'bg-blue-500',
                      activity.type === 'fee' && 'bg-green-500',
                      activity.type === 'attendance' && 'bg-orange-500',
                      activity.type === 'exam' && 'bg-purple-500',
                      activity.type === 'announcement' && 'bg-red-500'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title text-lg">Upcoming Events</h3>
            <p className="card-description">Important dates and events</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center text-white',
                      event.type === 'meeting' && 'bg-blue-500',
                      event.type === 'event' && 'bg-purple-500',
                      event.type === 'exam' && 'bg-orange-500'
                    )}
                  >
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                  </div>
                  <span
                    className={cn(
                      'badge',
                      event.type === 'meeting' && 'badge-primary',
                      event.type === 'event' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                      event.type === 'exam' && 'badge-warning'
                    )}
                  >
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {isAdmin && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title text-lg">Quick Actions</h3>
            <p className="card-description">Frequently used actions</p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Add Student', icon: GraduationCap, href: '/dashboard/students' },
                { label: 'Add Teacher', icon: Users, href: '/dashboard/teachers' },
                { label: 'Mark Attendance', icon: Calendar, href: '/dashboard/attendance' },
                { label: 'Create Announcement', icon: Bell, href: '/dashboard/announcements' },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.href)}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <action.icon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

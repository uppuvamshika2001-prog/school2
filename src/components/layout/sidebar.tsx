'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, useIsSuperAdmin, useIsAdmin } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  IndianRupee,
  Bell,
  Settings,
  Building2,
  UserCircle,
  User,
  ClipboardList,
  ClipboardCheck,
  FileText,
  BarChart3,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Bus,
  Send,
  Plus,
  Award,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavItem[];
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Students',
    href: '/dashboard/students',
    icon: GraduationCap,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
    children: [
      { label: 'All Students', href: '/dashboard/students', icon: GraduationCap, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
      { label: 'Leave Management', href: '/dashboard/students/leaves', icon: FileText, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
    ],
  },
  {
    label: 'Teachers',
    href: '/dashboard/teachers',
    icon: Users,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
    children: [
      { label: 'All Teachers', href: '/dashboard/teachers', icon: Users },
      { label: 'Attendance', href: '/dashboard/teachers/attendance', icon: ClipboardCheck },
      { label: 'Leave Management', href: '/dashboard/leaves', icon: FileText },
    ],
  },
  {
    label: 'Assignment',
    href: '/dashboard/assignments',
    icon: BookOpen,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'],
  },
  {
    label: 'Academics',
    href: '/dashboard/academics',
    icon: BookOpen,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
    children: [
      { label: 'Classes', href: '/dashboard/academics/classes', icon: BookOpen },
      { label: 'Subjects', href: '/dashboard/academics/subjects', icon: FileText },
      { label: 'Timetable', href: '/dashboard/timetable', icon: Clock },
    ],
  },
  {
    label: 'Attendance',
    href: '/dashboard/attendance',
    icon: ClipboardCheck,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
  },

  {
    label: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    children: [
      { label: 'Academic Calendar', href: '/dashboard/calendar', icon: Calendar },
      { label: 'Add Event', href: '/dashboard/calendar/create', icon: Plus },
    ],
  },
  {
    label: 'Examinations',
    href: '/dashboard/examinations',
    icon: ClipboardList,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
    children: [
      { label: 'Exams', href: '/dashboard/examinations', icon: ClipboardList },
      { label: 'Results', href: '/dashboard/examinations/results', icon: Award },
    ],
  },
  {
    label: 'Library',
    href: '/dashboard/library',
    icon: BookOpen,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    children: [
      { label: 'Book Catalog', href: '/dashboard/library', icon: BookOpen },
      { label: 'Digital Library', href: '/dashboard/library/digital', icon: FileText },
      { label: 'Manage Library', href: '/dashboard/library/manage', icon: Settings },
    ],
  },
  {
    label: 'Fee Management',
    href: '/dashboard/fees',
    icon: IndianRupee,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PARENT'],
    children: [
      { label: 'Overview', href: '/dashboard/fees', icon: BarChart3 },
      { label: 'Fee Structure', href: '/dashboard/fees/structure', icon: FileText },
      { label: 'Student Accounts', href: '/dashboard/fees/students', icon: Users },
      { label: 'Payments', href: '/dashboard/fees/payments', icon: IndianRupee },
    ],
  },
  {
    label: 'Announcements',
    href: '/dashboard/announcements',
    icon: Bell,
    badge: 3,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
  },
  {
    label: 'Feedback',
    href: '/dashboard/feedback',
    icon: MessageSquare,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'STUDENT', 'PARENT'],
    children: [
      { label: 'Feedback Analysis', href: '/dashboard/feedback', icon: BarChart3, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
      { label: 'Submit Feedback', href: '/dashboard/feedback/submit', icon: Send, roles: ['STUDENT', 'PARENT'] },
    ],
  },

  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
  },
  {
    label: 'My Profile',
    href: '/dashboard/teacher/profile',
    icon: User,
    roles: ['TEACHER'],
  },
  {
    label: 'My Attendance',
    href: '/dashboard/teacher/attendance',
    icon: Calendar,
    roles: ['TEACHER'],
  },
  {
    label: 'Live Attendance',
    href: '/dashboard/teacher/live-attendance',
    icon: ClipboardCheck,
    roles: ['TEACHER'],
  },
  {
    label: 'My Leaves',
    href: '/dashboard/teacher/leaves',
    icon: FileText,
    roles: ['TEACHER'],
  },
  {
    label: 'My Timetable',
    href: '/dashboard/teacher/timetable',
    icon: Clock,
    roles: ['TEACHER'],
  },
  {
    label: 'Examinations',
    href: '/dashboard/teacher/examinations',
    icon: ClipboardList,
    roles: ['TEACHER'],
  },
  // STUDENT PORTAL ITEMS
  {
    label: 'My Profile',
    href: '/dashboard/student/profile',
    icon: User,
    roles: ['STUDENT'],
  },
  {
    label: 'Class Diary',
    href: '/dashboard/student/diary',
    icon: BookOpen,
    roles: ['STUDENT'],
  },
  {
    label: 'Attendance',
    href: '/dashboard/student/attendance',
    icon: Calendar,
    roles: ['STUDENT'],
  },
  {
    label: 'My Leaves',
    href: '/dashboard/student/leaves',
    icon: FileText,
    roles: ['STUDENT'],
  },
  {
    label: 'Timetable',
    href: '/dashboard/student/timetable',
    icon: Clock,
    roles: ['STUDENT'],
  },
  {
    label: 'Examinations',
    href: '/dashboard/student/examinations',
    icon: ClipboardList,
    roles: ['STUDENT'],
  },
  {
    label: 'Library',
    href: '/dashboard/student/library',
    icon: BookOpen,
    roles: ['STUDENT'],
  },
  {
    label: 'Calendar',
    href: '/dashboard/student/calendar',
    icon: Calendar,
    roles: ['STUDENT'],
  },
  {
    label: 'Gallery',
    href: '/dashboard/student/gallery',
    icon: Users, // Using Users as temporary icon, or Image if available (need to import)
    roles: ['STUDENT'],
  },
  {
    label: 'Circulars',
    href: '/dashboard/student/circulars',
    icon: Bell,
    roles: ['STUDENT'],
  },
  {
    label: 'Fees',
    href: '/dashboard/student/fees',
    icon: IndianRupee,
    roles: ['STUDENT'],
  },
  {
    label: 'Reports',
    href: '/dashboard/student/reports',
    icon: BarChart3,
    roles: ['STUDENT'],
  },
  {
    label: 'Parent Feedback',
    href: '/dashboard/student/feedback',
    icon: MessageSquare,
    roles: ['STUDENT'],
  },
  {
    label: 'PTO Meetings',
    href: '/dashboard/student/pto',
    icon: Users,
    roles: ['STUDENT'],
  },
  {
    label: 'Bus Tracking',
    href: '/dashboard/student/bus-tracking',
    icon: Bus,
    roles: ['STUDENT'],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isSuperAdmin = useIsSuperAdmin();

  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const filteredNavItems = navItems.map(item => {
    // Filter children based on roles first
    if (item.children) {
      return {
        ...item,
        children: item.children.filter(child => {
          if (!child.roles) {
            // For super admin, hide add/create/manage type links
            if (isSuperAdmin) {
              const label = child.label.toLowerCase();
              if (label.includes('add') || label.includes('create') || label.includes('manage') || label.includes('new')) {
                return false;
              }
            }
            return true;
          }
          if (!user) return false;
          // For super admin, hide add/create/manage type links
          if (isSuperAdmin) {
            const label = child.label.toLowerCase();
            if (label.includes('add') || label.includes('create') || label.includes('manage') || label.includes('new')) {
              return false;
            }
          }
          return child.roles.includes(user.role);
        })
      };
    }
    return item;
  }).filter((item) => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) =>
    item.children?.some((child) => pathname === child.href);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-white shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-card border-r z-50 transition-transform duration-300',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="p-2 bg-primary rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold">School ERP</span>
            <p className="text-xs text-muted-foreground">
              {isSuperAdmin ? 'Platform Admin' : user?.tenant?.name || 'Dashboard'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                // Parent with children
                <div>
                  <button
                    data-tour={`sidebar-${item.label.toLowerCase().replace(' ', '-')}`}
                    onClick={() => toggleExpanded(item.label)}
                    className={cn(
                      'sidebar-item w-full justify-between',
                      isParentActive(item) && 'bg-primary/10 text-primary'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {expandedItems.includes(item.label) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {/* Children */}
                  {expandedItems.includes(item.label) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'sidebar-item',
                            isActive(child.href) && 'sidebar-item-active'
                          )}
                        >
                          <child.icon className="w-4 h-4" />
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Single item
                <Link
                  href={item.href}
                  data-tour={`sidebar-${item.label.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'sidebar-item',
                    isActive(item.href) && 'sidebar-item-active'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-destructive text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

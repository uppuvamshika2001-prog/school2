'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { cn, getInitials, formatRole } from '@/lib/utils';
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Moon,
  Sun,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTour } from '@/hooks/useTour';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { startTour } = useTour();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    // Use replace to prevent back navigation to authenticated pages
    router.replace('/login');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const notifications = [
    { id: 1, title: 'New student enrolled', message: 'Priya Sharma enrolled in Class 10-A', time: '2 mins ago', unread: true },
    { id: 2, title: 'Fee payment received', message: 'Payment of ₹15,000 received', time: '15 mins ago', unread: true },
    { id: 3, title: 'Attendance alert', message: 'Low attendance in Class 8-B', time: '1 hour ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 bg-background/95 backdrop-blur border-b">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md" data-tour="header-search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students, teachers, classes..."
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg border bg-muted/50",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "placeholder:text-muted-foreground/70 text-sm"
              )}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            data-tour="header-theme"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {/* Help */}
          <button
            onClick={startTour}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Start Tour"
            data-tour="header-help"
          >
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              data-tour="header-notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-card rounded-xl border shadow-lg z-50 overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-4 border-b last:border-b-0 hover:bg-muted cursor-pointer transition-colors',
                          notification.unread && 'bg-primary/5'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          )}
                          <div className={cn(!notification.unread && 'ml-5')}>
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t">
                    <button className="w-full text-sm text-primary hover:underline">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              data-tour="header-profile"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                {getInitials(user?.firstName || '', user?.lastName)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRole(user?.role || '')}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl border shadow-lg z-50 overflow-hidden">
                  <div className="p-4 border-b">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        const profileLink = user?.role === 'TEACHER' ? '/dashboard/teacher/profile' :
                          user?.role === 'STUDENT' ? '/dashboard/student/profile' :
                            '/dashboard/profile';
                        router.push(profileLink);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/dashboard/settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                  <div className="p-2 border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Menu, X, LogOut, LayoutDashboard, MessagesSquare, Rocket,
  ClipboardList, FlaskConical, CheckSquare, Users, UserCircle,
  CheckCheck, Building2,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { useAppStore } from '@/lib/stores/app';
import { Button, Badge } from './UI';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// Role-specific nav configs
const departmentNav: NavItem[] = [
  { label: 'Dashboard',         href: '/dashboard',    icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'My Challenges',     href: '/challenges',   icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Discover Startups', href: '/startups',     icon: <Rocket className="h-4 w-4" /> },
  { label: 'Review Proposals',  href: '/proposals',    icon: <MessagesSquare className="h-4 w-4" /> },
  { label: 'Manage Pilots',     href: '/pilots',       icon: <FlaskConical className="h-4 w-4" /> },
];

const startupNav: NavItem[] = [
  { label: 'Dashboard',         href: '/dashboard',        icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Browse Challenges', href: '/challenges',        icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'My Proposals',      href: '/proposals',         icon: <MessagesSquare className="h-4 w-4" /> },
  { label: 'My Pilots',         href: '/pilots',            icon: <FlaskConical className="h-4 w-4" /> },
  { label: 'My Profile',        href: '/startups/profile',  icon: <UserCircle className="h-4 w-4" /> },
];

const evaluatorNav: NavItem[] = [
  { label: 'Dashboard',          href: '/dashboard',   icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'My Evaluations',     href: '/evaluations', icon: <CheckSquare className="h-4 w-4" /> },
  { label: 'All Challenges',     href: '/challenges',  icon: <ClipboardList className="h-4 w-4" /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard',   href: '/dashboard',  icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Challenges',  href: '/challenges', icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Startups',    href: '/startups',   icon: <Rocket className="h-4 w-4" /> },
  { label: 'Proposals',   href: '/proposals',  icon: <MessagesSquare className="h-4 w-4" /> },
  { label: 'Pilots',      href: '/pilots',     icon: <FlaskConical className="h-4 w-4" /> },
  { label: 'Evaluations', href: '/evaluations',icon: <CheckSquare className="h-4 w-4" /> },
  { label: 'Users',       href: '/users',      icon: <Users className="h-4 w-4" /> },
];

function getNavItems(role?: string): NavItem[] {
  switch (role) {
    case 'department': return departmentNav;
    case 'startup':    return startupNav;
    case 'evaluator':  return evaluatorNav;
    case 'admin':      return adminNav;
    default:           return departmentNav;
  }
}

const roleLabel: Record<string, string> = {
  department: 'Government Dept.',
  startup:    'Startup',
  evaluator:  'Expert Evaluator',
  admin:      'Administrator',
};

const roleIcon: Record<string, React.ReactNode> = {
  department: <Building2 className="w-3 h-3" />,
  startup:    <Rocket className="w-3 h-3" />,
  evaluator:  <CheckSquare className="w-3 h-3" />,
  admin:      <Users className="w-3 h-3" />,
};

// ─── Header ────────────────────────────────────────────────────────────────────
export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const {
    sidebarOpen, setSidebarOpen,
    notifications, unreadCount,
    fetchNotifications, markNotificationRead,
  } = useAppStore();

  const [showNotifications, setShowNotifications] = React.useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!showNotifications) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNotifications]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleNotifClick = useCallback(
    (id: number, isRead: boolean) => {
      if (!isRead) markNotificationRead(id);
    },
    [markNotificationRead]
  );

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#fffdf8]/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg text-slate-900 dark:text-slate-50 tracking-tight">
              StartupHub
            </span>
          </Link>
        </div>

        {/* Right: notifications + user */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications((p) => !p)}
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-50">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs text-slate-500">{unreadCount} unread</span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotifClick(notif.id, notif.is_read)}
                          className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                            !notif.is_read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {!notif.is_read && (
                              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                            )}
                            <div className={!notif.is_read ? '' : 'ml-4'}>
                              <p className="font-medium text-sm text-slate-900 dark:text-slate-50">{notif.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                        <CheckCheck className="w-8 h-8 opacity-40" />
                        <p className="text-sm">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="block px-4 py-2.5 text-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800 transition-colors"
                  >
                    View All Notifications
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-sm text-slate-900 dark:text-slate-50 leading-none">{user?.full_name}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                {roleIcon[user?.role ?? '']}
                <p className="text-xs text-slate-500 dark:text-slate-400">{roleLabel[user?.role ?? ''] ?? user?.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// ─── Sidebar ───────────────────────────────────────────────────────────────────
export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const navItems = getNavItems(user?.role);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-64
          overflow-y-auto border-r border-stone-200 bg-[#fffdf8]
          dark:border-slate-800 dark:bg-slate-900
          transition-transform duration-300 ease-in-out
          lg:static lg:top-0 lg:h-full lg:translate-x-0 lg:z-auto lg:shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Role badge at top */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-100 dark:border-primary-800/30">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white flex-shrink-0">
              {roleIcon[user?.role ?? '']}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 truncate">
                {roleLabel[user?.role ?? ''] ?? user?.role}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.organization || user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive =
              router.pathname === item.href ||
              (item.href !== '/dashboard' && router.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`flex-shrink-0 transition-transform duration-150 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-sm tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-5 bg-primary-600 dark:bg-primary-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { useAppStore } from '@/lib/stores/app';
import { Layout } from '@/components/Layout';
import { Card, Badge, Button } from '@/components/UI';
import { formatDistanceToNow } from 'date-fns';
import type { NextPageWithLayout } from './_app';

const typeColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
  proposal_submitted: 'primary',
  proposal_accepted: 'success',
  proposal_rejected: 'danger',
  pilot_started: 'secondary',
  milestone_completed: 'success',
  evaluation_done: 'info',
  general: 'primary',
};

const NotificationsPage: NextPageWithLayout = () => {
  const { notifications, notificationsLoading, unreadCount, fetchNotifications, markNotificationRead } = useAppStore();

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const handleMarkRead = (id: number, isRead: boolean) => {
    if (!isRead) markNotificationRead(id);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-3xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Notifications</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              notifications
                .filter((n) => !n.is_read)
                .forEach((n) => markNotificationRead(n.id));
            }}
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        )}
      </motion.div>

      {/* Notifications list */}
      {notificationsLoading ? (
        <motion.div variants={itemVariants} className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </motion.div>
      ) : notifications.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-16">
            <Bell className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">No notifications</h3>
            <p className="text-slate-500 dark:text-slate-400">
              You'll be notified here about important updates
            </p>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-3">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              onClick={() => handleMarkRead(notif.id, notif.is_read)}
              className={`
                flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-150
                hover:shadow-md
                ${!notif.is_read
                  ? 'border-primary-200 bg-primary-50 dark:border-primary-800/50 dark:bg-primary-900/20'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }
              `}
            >
              {/* Dot indicator */}
              <div className="mt-1 flex-shrink-0">
                {!notif.is_read ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-500 block" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 block" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className={`font-semibold text-sm ${!notif.is_read ? 'text-primary-900 dark:text-primary-100' : 'text-slate-900 dark:text-slate-50'}`}>
                    {notif.title}
                  </p>
                  <Badge variant={typeColors[notif.type] ?? 'primary'}>
                    <span className="text-xs capitalize">{notif.type?.replace(/_/g, ' ')}</span>
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                  {notif.message}
                </p>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap flex-shrink-0">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

NotificationsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default NotificationsPage;

import React from 'react';
import { Bell, CheckCheck, Clock, AlertTriangle, UserCheck, Sparkles, X } from 'lucide-react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { supportRepository } from '../../services/supportRepository';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (id: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectConversation,
}) => {
  const { t, language } = useI18n();
  const notifications = supportRepository.getNotifications();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-sm w-full bg-white dark:bg-slate-900 border-l rtl:border-r rtl:border-l-0 border-slate-200 dark:border-slate-800 shadow-xl flex flex-col z-10 animate-in slide-in-from-right rtl:slide-in-from-left duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.actions.notifications}
            </h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500 text-white rounded">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => supportRepository.markAllNotificationsRead()}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تعيين الكل كمقروء' : 'Mark all read'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.map((notif) => {
            const Icon =
              notif.type === 'sla_warning'
                ? Clock
                : notif.type === 'customer_escalation'
                ? AlertTriangle
                : notif.type === 'assignment'
                ? UserCheck
                : Sparkles;

            const iconColor =
              notif.type === 'sla_warning'
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                : notif.type === 'customer_escalation'
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                : notif.type === 'assignment'
                ? 'text-sky-500 bg-sky-50 dark:bg-sky-950/40'
                : 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40';

            return (
              <div
                key={notif.id}
                onClick={() => {
                  supportRepository.markNotificationRead(notif.id);
                  if (notif.linkConversationId) {
                    onSelectConversation(notif.linkConversationId);
                    onClose();
                  }
                }}
                className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                  !notif.read ? 'bg-indigo-50/30 dark:bg-indigo-950/15' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-semibold ${!notif.read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {notif.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

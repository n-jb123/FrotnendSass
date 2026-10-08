import React from 'react';
import { ConversationStatus, PriorityLevel, SentimentType } from '../../types/models';
import { useI18n } from '../../lib/i18n/I18nContext';

export interface StatusBadgeProps {
  status?: ConversationStatus;
  priority?: PriorityLevel;
  sentiment?: SentimentType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  priority,
  sentiment,
  className = '',
}) => {
  const { t } = useI18n();

  if (status) {
    const config = {
      open: {
        label: t.status.open,
        bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-500',
      },
      pending: {
        label: t.status.pending,
        bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
        dot: 'bg-amber-500',
      },
      resolved: {
        label: t.status.resolved,
        bg: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20',
        dot: 'bg-slate-400',
      },
      closed: {
        label: t.status.closed,
        bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-500 border-slate-500/20',
        dot: 'bg-slate-400',
      },
    }[status];

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border ${config.bg} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
        <span>{config.label}</span>
      </span>
    );
  }

  if (priority) {
    const config = {
      low: {
        label: t.status.low,
        color: 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60',
      },
      medium: {
        label: t.status.medium,
        color: 'text-sky-700 dark:text-sky-400 border-sky-500/20 bg-sky-500/10',
      },
      high: {
        label: t.status.high,
        color: 'text-amber-700 dark:text-amber-400 border-amber-500/20 bg-amber-500/10',
      },
      urgent: {
        label: t.status.urgent,
        color: 'text-rose-700 dark:text-rose-400 border-rose-500/20 bg-rose-500/10 font-semibold',
      },
    }[priority];

    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 text-xs rounded border ${config.color} ${className}`}
      >
        {config.label}
      </span>
    );
  }

  if (sentiment) {
    const config = {
      positive: {
        label: t.status.positive,
        text: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      },
      neutral: {
        label: t.status.neutral,
        text: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20',
      },
      frustrated: {
        label: t.status.frustrated,
        text: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      },
      angry: {
        label: t.status.angry,
        text: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20 font-semibold',
      },
    }[sentiment];

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${config.text} ${className}`}
      >
        {config.label}
      </span>
    );
  }

  return null;
};

import React from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { supportRepository } from '../../services/supportRepository';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  Smile,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface DashboardViewProps {
  onSelectConversation: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectConversation,
  onNavigateTab,
}) => {
  const { t, direction, language } = useI18n();

  const conversations = supportRepository.getConversations();
  const tickets = supportRepository.getTickets();

  const openConversations = conversations.filter((c) => c.status === 'open');
  const urgentTickets = tickets.filter((t) => t.priority === 'urgent' || t.priority === 'high');

  const kpis = [
    {
      title: t.dashboard.kpis.openConversations,
      value: `${openConversations.length}`,
      delta: language === 'ar' ? '+2 منذ 09:00 صباحاً' : '+2 since 09:00',
      isPositive: false,
      icon: MessageSquare,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      title: t.dashboard.kpis.avgResponseTime,
      value: '1m 42s',
      delta: language === 'ar' ? '-28 ثانية مقارنة بهدف SLA' : '-28s vs SLA target',
      isPositive: true,
      icon: Clock,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: t.dashboard.kpis.resolutionRate,
      value: '94.8%',
      delta: language === 'ar' ? '+3.2% هذا الأسبوع' : '+3.2% this week',
      isPositive: true,
      icon: CheckCircle2,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40',
    },
    {
      title: t.dashboard.kpis.csatScore,
      value: '4.88 / 5',
      delta: language === 'ar' ? '98.2% تقييمات إيجابية' : '98.2% positive reviews',
      isPositive: true,
      icon: Smile,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: t.dashboard.kpis.aiResolutionRate,
      value: '48.2%',
      delta: language === 'ar' ? '+1,420 حُلّت ذاتياً بالذكاء الاصطناعي' : '+1,420 auto-resolved',
      isPositive: true,
      icon: Sparkles,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('inbox')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'فتح صندوق الوارد الموحد' : 'Open Unified Inbox'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800/80 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {kpi.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{kpi.delta}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Urgent Attention Queue + Weekly Volume Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Attention Queue */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.dashboard.urgentQueue}
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('tickets')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t.actions.viewAll}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {urgentTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => {
                  const conv = conversations.find((c) => c.customerId === ticket.customerId);
                  if (conv) {
                    onSelectConversation(conv.id);
                    onNavigateTab('inbox');
                  }
                }}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={ticket.customerAvatar}
                    alt={ticket.customerName}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500">
                        {ticket.ticketNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {ticket.customerName}
                      </span>
                      <StatusBadge priority={ticket.priority} />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5 font-medium">
                      {ticket.subject}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right rtl:text-left">
                  <div className="hidden sm:block">
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 block tabular-nums">
                      {ticket.slaDue}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{ticket.assigneeName}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 dark:text-slate-500 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Channel Volume Breakdown */}
        <div className="rounded-xl bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800/80 shadow-2xs p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.dashboard.channelBreakdown}
          </h2>

          <div className="space-y-3">
            {[
              {
                channel: language === 'ar' ? 'الواجهات البرمجية والـ Webhooks' : 'Webhooks & REST API',
                count: '4,890',
                pct: 44,
                color: 'bg-indigo-600 dark:bg-indigo-500',
              },
              {
                channel: language === 'ar' ? 'أداة المحادثة المباشرة' : 'Live Chat Widget',
                count: '3,210',
                pct: 29,
                color: 'bg-sky-500',
              },
              {
                channel: language === 'ar' ? 'البريد الإلكتروني ومزامنة Gmail' : 'Email & Gmail Sync',
                count: '2,150',
                pct: 19,
                color: 'bg-emerald-500',
              },
              {
                channel: language === 'ar' ? 'قنوات Slack Connect' : 'Slack Connect Channels',
                count: '890',
                pct: 8,
                color: 'bg-amber-500',
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600 dark:text-slate-300">{item.channel}</span>
                  <span className="text-slate-900 dark:text-slate-100 tabular-nums">
                    {item.count} ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-semibold block mb-0.5 text-indigo-600 dark:text-indigo-400">
              {language === 'ar' ? 'رؤية الطيار الآلي للذكاء الاصطناعي' : 'AI Autopilot Insight'}
            </span>
            <span>
              {language === 'ar'
                ? 'سجلت استفسارات حدود سرعة الـ API ارتفاعاً بنسبة 40% اليوم. تم إعداد مقترح بزيادة حصة التدفق الفوري.'
                : 'API rate limit questions experienced a 40% surge today. Suggested webhook burst quota increase prepared.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

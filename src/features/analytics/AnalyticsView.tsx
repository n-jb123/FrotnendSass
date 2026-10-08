import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { supportRepository } from '../../services/supportRepository';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Sparkles,
  Users,
  Smile,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { t, language } = useI18n();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const teamMembers = supportRepository.getTeamMembers();

  const roleArabic: Record<string, string> = {
    Owner: 'المالك',
    Admin: 'مسؤول',
    Supervisor: 'مشرف',
    Agent: 'وكيل دعم',
    Analyst: 'محلل',
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.analytics.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.analytics.subtitle}
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center p-0.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                dateRange === range
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {range === '7d'
                ? (language === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days')
                : range === '30d'
                ? (language === 'ar' ? 'آخر 30 يوماً' : 'Last 30 Days')
                : (language === 'ar' ? 'آخر 90 يوماً' : 'Last 90 Days')}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Key Performance Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">
            {language === 'ar' ? 'حل التذكرة من أول تواصل' : 'First Contact Resolution'}
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            78.4%
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {language === 'ar' ? '+4.2% مقارنة بالفترة السابقة' : '+4.2% vs prior period'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">
            {language === 'ar' ? 'متوسط سرعة أول رد' : 'Median First Response Time'}
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            1m 12s
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {language === 'ar' ? 'الالتزام باتفاقية الخدمة: 99.4%' : 'SLA compliance: 99.4%'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">
            {language === 'ar' ? 'التذاكر المحلولة ذاتياً بالذكاء' : 'AI Autopilot Deflection'}
          </span>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
            48.2%
          </div>
          <span className="text-[11px] text-slate-500">
            {language === 'ar' ? '1,420 تذكرة حُلّت دون تدخل بشري' : '1,420 tickets resolved without agent'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">
            {language === 'ar' ? 'مؤشر رضا العملاء الإيجابي' : 'CSAT Positive Benchmark'}
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            4.88 / 5
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {language === 'ar' ? '98% مشاعر إيجابية' : '98% positive sentiment'}
          </span>
        </div>
      </div>

      {/* Row 2: AI Autopilot vs Human Escalation & Topic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card A: Automation Ratio */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>{t.analytics.humanVsAi}</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {language === 'ar' ? 'الإجمالي: 2,946' : 'Total: 2,946'}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {language === 'ar' ? 'الحل الذاتي التلقائي بالذكاء الاصطناعي' : 'AI Autopilot Autonomous Resolution'}
                </span>
                <span className="font-bold tabular-nums">1,420 (48.2%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '48.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {language === 'ar' ? 'التذاكر المعالجة أو المصعدة لوكلاء الفريق' : 'Human Agent Handled / Escalated'}
                </span>
                <span className="font-bold tabular-nums">1,526 (51.8%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-600 dark:bg-slate-400 h-full rounded-full" style={{ width: '51.8%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            {language === 'ar'
              ? 'تم قبول اقتراحات الذكاء الاصطناعي دون تعديل في 89.4% من الحالات. متوسط الوقت الموفر لكل تذكرة: 4.8 دقيقة.'
              : 'AI suggestions were accepted by agents without modification in 89.4% of responses. Average time saved per ticket: 4.8 minutes.'}
          </div>
        </div>

        {/* Card B: Top Inquiry Topics */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.analytics.topCategories}
            </h2>
            <span className="text-xs text-slate-500">
              {language === 'ar' ? 'حسب التكرار' : 'By frequency'}
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { topic: language === 'ar' ? 'حدود معدل استدعاء API وأخطاء 429' : 'API Rate Limits & 429 Errors', count: 820, pct: 28 },
              { topic: language === 'ar' ? 'التحقق من توقيعات Webhook HMAC' : 'Webhook HMAC Verification & Signatures', count: 640, pct: 22 },
              { topic: language === 'ar' ? 'تحديث شهادات Okta / Azure SAML 2.0' : 'Okta / Azure SAML 2.0 SSO Rotation', count: 530, pct: 18 },
              { topic: language === 'ar' ? 'الفواتير وإعفاءات ضريبة القيمة المضافة' : 'Invoicing & Cross-Border VAT Exemption', count: 480, pct: 16 },
              { topic: language === 'ar' ? 'رموز إشعارات الخلفية في حزمة تطبيقات الهاتف' : 'Mobile SDK APNs Background Tokens', count: 476, pct: 16 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.topic}
                  </span>
                  <span className="text-slate-500 tabular-nums">
                    {item.count} {language === 'ar' ? 'تذكرة' : 'tickets'} ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Agent Productivity Leaderboard */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {language === 'ar' ? 'أداء ونشاط وكلاء الدعم' : 'Agent Performance & Activity'}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">{language === 'ar' ? 'عضو الفريق' : 'Team Member'}</th>
                <th className="px-4 py-3">{language === 'ar' ? 'الدور' : 'Role'}</th>
                <th className="px-4 py-3">{t.team.assignedConversations}</th>
                <th className="px-4 py-3">{language === 'ar' ? 'تم حلها اليوم' : 'Resolved Today'}</th>
                <th className="px-4 py-3">{language === 'ar' ? 'متوسط سرعة الرد' : 'Avg Response'}</th>
                <th className="px-4 py-3">{language === 'ar' ? 'تقييم الرضا CSAT' : 'CSAT Rating'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-slate-500 block">{member.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                    {language === 'ar' ? (roleArabic[member.role] || member.role) : member.role}
                  </td>
                  <td className="px-4 py-3.5 font-bold tabular-nums">{member.activeConversations}</td>
                  <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {member.resolvedToday}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-slate-600 dark:text-slate-400">1m 24s</td>
                  <td className="px-4 py-3.5 font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                    4.9 / 5.0
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

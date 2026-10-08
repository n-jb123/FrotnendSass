import React, { useState } from 'react';
import { Conversation, Customer } from '../../types/models';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../lib/i18n/I18nContext';
import { useToast } from '../../components/ui/Toast';
import {
  Sparkles,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Tag,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  X,
  ShieldAlert,
} from 'lucide-react';

interface CustomerContextPanelProps {
  conversation: Conversation;
  onClose: () => void;
  onInsertReply: (text: string) => void;
}

export const CustomerContextPanel: React.FC<CustomerContextPanelProps> = ({
  conversation,
  onClose,
  onInsertReply,
}) => {
  const { t, language } = useI18n();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'ai' | 'customer'>('ai');
  const [feedbackSent, setFeedbackSent] = useState<boolean | null>(null);

  const { customer, aiInsight } = conversation;

  const handleCopySuggestion = () => {
    if (aiInsight?.suggestedReply) {
      navigator.clipboard.writeText(aiInsight.suggestedReply);
      showToast(t.actions.copied);
    }
  };

  const handleSendFeedback = (helpful: boolean) => {
    setFeedbackSent(helpful);
    showToast(
      helpful
        ? (language === 'ar' ? 'شكراً لك! تم تسجيل عينة تدريب الذكاء الاصطناعي' : 'Thank you! AI training sample recorded')
        : (language === 'ar' ? 'تم تسجيل الملاحظة لتحسين وضبط النموذج' : 'Feedback recorded for model tuning')
    );
  };

  return (
    <div className="w-80 xl:w-88 border-l rtl:border-r rtl:border-l-0 border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c1220] text-slate-900 dark:text-slate-100 flex flex-col shrink-0 h-full">
      {/* Top Bar with Tabs and Close */}
      <div className="p-2.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-xs font-medium flex-1">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مساعد الذكاء الاصطناعي' : 'AI Copilot'}</span>
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.inbox.customerContext}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 cursor-pointer"
          aria-label="Close side panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab 1: AI Copilot */}
      {activeTab === 'ai' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.inbox.summaryTitle}</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'تم تحليل 4 رسائل' : '4 msgs analyzed'}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {aiInsight?.content || 'Customer is reporting connection errors on their webhook queue during peak volume periods.'}
            </p>
          </div>

          {/* Sentiment & Intent Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#131c31]">
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                {t.inbox.detectedSentiment}
              </span>
              <StatusBadge sentiment={conversation.sentiment} />
            </div>

            <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#131c31]">
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                {t.inbox.detectedIntent}
              </span>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate block">
                {language === 'ar' ? 'حدود واجهة API التقنية' : 'Technical API Limit'}
              </span>
            </div>
          </div>

          {/* Suggested Reply Card */}
          {aiInsight?.suggestedReply && (
            <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-[#131c31] space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.inbox.suggestedReplyTitle}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopySuggestion}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 cursor-pointer"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                {aiInsight.suggestedReply}
              </p>

              <div className="flex items-center justify-between pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onInsertReply(aiInsight.suggestedReply!)}
                  className="w-full text-xs"
                >
                  {t.actions.insertReply}
                </Button>
              </div>

              {/* Feedback Controls */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>{language === 'ar' ? 'هل كان الاقتراح دقيقاً ومفيداً؟' : 'Was this suggestion accurate?'}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSendFeedback(true)}
                    className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                      feedbackSent === true ? 'text-emerald-600 font-bold' : ''
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleSendFeedback(false)}
                    className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                      feedbackSent === false ? 'text-rose-600 font-bold' : ''
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Knowledge Article */}
          {aiInsight?.suggestedArticleTitle && (
            <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#131c31] space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {t.inbox.suggestedArticleTitle}
              </span>
              <div className="flex items-start gap-2 pt-1">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:underline cursor-pointer">
                    {aiInsight.suggestedArticleTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'ar' ? `يُوصى بمشاركته مع ${customer.name} لتفادي تكرار الاستفسار.` : `Recommended to share with ${customer.name} to avoid future escalations.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Customer Profile */}
      {activeTab === 'customer' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Customer Avatar & Bio */}
          <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-800">
            <img
              src={customer.avatarUrl}
              alt={customer.name}
              className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-indigo-500/30 dark:ring-indigo-400/30 mb-2"
            />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {customer.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {customer.role} · {customer.company}
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800">
                {language === 'ar' ? `باقة ${customer.plan === 'Enterprise' ? 'المؤسسات' : customer.plan === 'Pro' ? 'الاحترافية' : 'البداية'}` : `${customer.plan} Tier`}
              </span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${
                customer.status === 'at-risk'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
              }`}>
                {customer.status === 'at-risk' ? (language === 'ar' ? 'في خطر' : 'At Risk') : (language === 'ar' ? 'نشط' : 'Active')}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {language === 'ar' ? 'بيانات الاتصال والموقع' : 'Contact & Location'}
            </span>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{customer.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>{customer.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>{customer.timezone}</span>
            </div>
          </div>

          {/* Account Metrics */}
          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#131c31] space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {language === 'ar' ? 'مؤشرات العقد والاشتراك' : 'Contract Metrics'}
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">{t.customers.ltv}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {customer.ltv}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">{language === 'ar' ? 'تاريخ الانضمام' : 'Member Since'}</span>
              <span className="text-slate-700 dark:text-slate-300 tabular-nums">
                {customer.createdAt}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">{t.customers.lastActive}</span>
              <span className="text-slate-700 dark:text-slate-300 tabular-nums">
                {customer.lastActivityAt}
              </span>
            </div>
          </div>

          {/* Account Tags */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {t.customers.tags}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {customer.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { Button } from '../../components/ui/Button';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  TrendingDown,
  AlertTriangle,
  FileQuestion,
  Lightbulb,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  dataReferences?: string[];
}

export const AiStudioView: React.FC<{ onNavigateToConversation?: (id: string) => void }> = ({
  onNavigateToConversation,
}) => {
  const { t, language } = useI18n();

  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      content:
        language === 'ar'
          ? 'مرحباً أليكس. أنا مساعد عمليات الدعم الذكي الخاص بك في SupportFlow. أقوم بتحليل كافة تذاكر العملاء الواردة وسجلات الأداء ومؤشرات استجابة الفريق في الوقت الفعلي.\n\nيمكنك سؤالي عن أي شيء يخص الحالات غير المحلولة، أو نقاط الاحتكاك المتكررة مع المشتركين، أو مقترحات الأتمتة الذكية.'
          : 'Hello Alex. I am your SupportFlow Operations Copilot. I analyze all incoming customer tickets, telemetry traces, and team response metrics in real time.\n\nAsk me anything regarding unresolved incidents, recurring customer friction, or automated macro suggestions.',
      timestamp: language === 'ar' ? 'اليوم، 09:00' : 'Today, 09:00',
    },
  ]);

  const handleAsk = (customQuery?: string) => {
    const q = customQuery || prompt;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: language === 'ar' ? 'الآن' : 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setIsProcessing(true);

    setTimeout(() => {
      let responseText = '';
      let refs: string[] = [];

      const queryLower = q.toLowerCase();
      if (queryLower.includes('unresolved') || queryLower.includes('issue') || queryLower.includes('المشكلات') || queryLower.includes('العاجلة')) {
        responseText =
          language === 'ar'
            ? '**ملخص العمليات للمشكلات غير المحلولة اليوم (تذكرتان مفتوحتان):**\n\n1. **مايا تشن (HyperScale Cloud)**: تواجه أخطاء تجاوز معدل الطلبات HTTP 429 على المسار `/v2/events` أثناء ارتفاع حركة المرور للدفعات (>3,200 طلب/ثانية). وافق فريق DevOps على رفع مؤقت للحصة (+5,000 طلب/ثانية).\n2. **كريم حداد (FinEdge Payments)**: فشل التحقق من توقيع التسوية في الإنتاج بسبب التحقق من ترويسة `X-Signature-SHA256` القديمة بدلاً من ترويسة 2026 المحدثة. متبقي 12 دقيقة قبل انتهاء هدف SLA.'
            : '**Operational Summary of Today’s Unresolved Issues (2 Open Tickets):**\n\n1. **Maya Chen (HyperScale Cloud)**: Encountering HTTP 429 rate limit errors on `/v2/events` during batch traffic surges (>3,200 req/sec). DevOps approved temporary quota boost (+5,000 req/sec burst).\n2. **Karim Haddad (FinEdge Payments)**: Production payment settlement signature failures due to verifying obsolete `X-Signature-SHA256` header instead of the updated 2026 header. 12 minutes before SLA target.';
        refs = language === 'ar' ? ['محادثة 101 (HyperScale)', 'محادثة 102 (FinEdge)'] : ['conv-101 (HyperScale)', 'conv-102 (FinEdge)'];
      } else if (queryLower.includes('billing') || queryLower.includes('complaint') || queryLower.includes('الفوترة') || queryLower.includes('شكاوى')) {
        responseText =
          language === 'ar'
            ? '**أنماط احتكاك الفوترة والفواتير هذا الأسبوع:**\n\n- **صوفيا مارتن (MedPulse Health)** طلبت إعفاء ضريبة القيمة المضافة VIES للاتحاد الأوروبي للفاتورة رقم #INV-9812. تم التحقق من إشعار دائن بقيمة 342 دولار وتطبيقه.\n- **تنبيه اتجاه**: 3 حسابات شركات كبرى طلبت فوترة بنظام الاحتساب العكسي. يُوصى بإضافة التحقق الذاتي من VIES مباشرة في إعدادات بوابة العميل.'
            : '**Billing & Invoice Friction Patterns This Week:**\n\n- **Sofia Martin (MedPulse Health)** requested EU VIES VAT exemption credit for invoice #INV-9812. Credit note of $342 has been verified and applied.\n- **Trend Alert**: 3 Enterprise accounts requested reverse charge invoicing. Recommended adding self-service VIES verification directly in Customer Portal Settings.';
        refs = language === 'ar' ? ['محادثة 103 (MedPulse)', 'مقال 4 (دليل ضريبة EU)'] : ['conv-103 (MedPulse)', 'Art-4 (EU VAT Guide)'];
      } else if (queryLower.includes('gap') || queryLower.includes('escalat') || queryLower.includes('الفجوات') || queryLower.includes('التصعيد')) {
        responseText =
          language === 'ar'
            ? '**الفجوات المعرفية المحددة ومسببات التصعيد:**\n\n- العملاء الذين قاموا بالترقية إلى واجهة Webhook API 2026 يواجهون باستمرار فشل التحقق من التوقيع لأن دليل ترحيل حزم Python/Go لم يُنشر بعد.\n- **فرصة التحسين**: تقديرات نشر عينة كود HMAC-SHA256 لعام 2026 ستوفر **64 ساعة دعم** هذا الشهر.'
            : '**Identified Knowledge Base Gaps & Escalation Drivers:**\n\n- Customers upgrading to the 2026 Webhook API repeatedly hit signature verification failures because the Python/Go SDK migration guide was unpublished.\n- **Opportunity**: Publishing the HMAC-SHA256 2026 code sample is estimated to deflect **64 support hours** this month.';
        refs = language === 'ar' ? ['مقال 2 (مواصفات HMAC)'] : ['Art-2 (HMAC Spec)'];
      } else {
        responseText =
          language === 'ar'
            ? `بناءً على آخر 2,946 تفاعلاً مع العملاء عبر مساحة العمل:\n\n- يبلغ الالتزام الإجمالي باتفاقيات مستوى الخدمة (SLA) **99.4%**.\n- نجح مساعد الذكاء الاصطناعي التلقائي في حل **48.2%** من الاستفسارات الواردة دون تصعيد بشري.\n- الموضوع الأكثر استفساراً اليوم: **حدود معدل واجهة API واندفاعات حركة الـ Webhook**.`
            : `Based on the latest 2,946 customer interactions across your workspace:\n\n- Overall SLA compliance is holding steady at **99.4%**.\n- AI Autopilot has successfully resolved **48.2%** of incoming inquiries with zero human escalation.\n- Top inquiry topic today: **API Rate Limits and Webhook Traffic Bursts**.`;
        refs = language === 'ar' ? ['مؤشرات خوادم US-West', 'سجل طيار الدعم الآلي'] : ['Cluster Metrics US-West', 'SupportFlow Autopilot Log'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          content: responseText,
          timestamp: language === 'ar' ? 'الآن' : 'Just now',
          dataReferences: refs,
        },
      ]);
      setIsProcessing(false);
    }, 450);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>{t.aiStudio.title}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.aiStudio.subtitle}
          </p>
        </div>
      </div>

      {/* Usage & Infrastructure Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">{t.aiStudio.usageTokens}</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums font-mono">
            4.28M
          </div>
          <span className="text-[11px] text-slate-400">
            {language === 'ar' ? 'رموز ضمن باقة Pro المتاحة' : 'Tokens within Pro allowance'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">{t.aiStudio.aiCost}</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            $48.20
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {language === 'ar' ? '-$4,200 توفير تقديري في تكلفة الوكلاء' : '-$4,200 estimated agent cost saved'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">{t.aiStudio.accuracy}</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            94.6%
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {language === 'ar' ? 'نسبة قبول عالية من الوكلاء' : 'High agent acceptance'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">
            {language === 'ar' ? 'متوسط سرعة استجابة النموذج' : 'Median Inference Latency'}
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums font-mono">
            380ms
          </div>
          <span className="text-[11px] text-slate-400">
            {language === 'ar' ? 'نموذج بث طرفي فائق السرعة' : 'Optimized streaming edge model'}
          </span>
        </div>
      </div>

      {/* Main Copilot Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Chat Interaction */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col h-[520px] overflow-hidden">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 text-xs ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-xl max-w-xl space-y-2 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {m.dataReferences && m.dataReferences.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px] flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">{language === 'ar' ? 'المراجع:' : 'References:'}</span>
                      {m.dataReferences.map((ref, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px]"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 p-2">
                <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>{language === 'ar' ? 'جاري تحليل الرسم المعرفي للعمليات...' : 'Analyzing operational knowledge graph...'}</span>
              </div>
            )}
          </div>

          {/* Prompt Input Form */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.aiStudio.askPlaceholder}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Button variant="primary" size="md" type="submit" disabled={isProcessing}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Suggested Operational Prompts & Autonomous Insights */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {language === 'ar' ? 'استفسارات العمليات المقترحة' : 'Suggested Operations Queries'}
            </h3>
            <div className="space-y-1.5">
              {t.aiStudio.suggestedQuestions.map((qText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(qText)}
                  className="w-full text-left rtl:text-right p-2.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-slate-100 dark:border-slate-800/60 leading-snug flex items-start gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{qText}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Autonomous Insights Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200/80 dark:border-indigo-900/60 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>{t.aiStudio.insightsTitle}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'ar'
                ? 'اكتشف فرز التذاكر زيادة بنسبة 28% في استفسارات توقيع webhook HMAC بعد إصدار API 2026.1. يُوصى بإنشاء رد جاهز آلي لتحديث الترويسة.'
                : 'Ticket triage detected a 28% increase in webhook HMAC signature inquiries following the API 2026.1 release. Creating an automated macro for the header update is recommended.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

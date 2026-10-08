import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { Button } from '../../components/ui/Button';
import {
  Sparkles,
  Inbox,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Headphones,
  BarChart3,
  Globe,
  Lock,
  ChevronDown,
} from 'lucide-react';

interface MarketingViewProps {
  onLaunchDemo: () => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({ onLaunchDemo }) => {
  const { t, direction, language } = useI18n();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: language === 'ar' ? 'البداية' : 'Starter',
      price: billingPeriod === 'monthly' ? '$39' : '$31',
      period: language === 'ar' ? '/ شهر' : '/ month',
      desc: language === 'ar' ? 'للشركات الناشئة في مراحلها الأولى وفرق الدعم الصغيرة.' : 'For early-stage startups and small customer teams.',
      features: [
        language === 'ar' ? 'حتى 3 مقاعد دعم' : 'Up to 3 support seats',
        language === 'ar' ? 'بريد إلكتروني ومحادثة ويب موحدة' : 'Unified Email & Web chat',
        language === 'ar' ? 'ردود مقترحة بالذكاء الاصطناعي' : 'Basic AI suggested replies',
        language === 'ar' ? 'قاعدة معرفة قياسية قابلة للبحث' : 'Standard knowledge base',
        language === 'ar' ? 'دعم المجتمع والمنتديات' : 'Community support',
      ],
      highlight: false,
    },
    {
      name: language === 'ar' ? 'الاحترافية' : 'Pro',
      price: billingPeriod === 'monthly' ? '$99' : '$79',
      period: language === 'ar' ? '/ شهر' : '/ month',
      desc: language === 'ar' ? 'للعمليات المتوسعة التي تحتاج فرزاً آلياً بالذكاء الاصطناعي.' : 'For scaling operations needing automated AI triage.',
      features: [
        language === 'ar' ? 'حتى 15 مقعد دعم' : 'Up to 15 support seats',
        language === 'ar' ? 'قنوات متعددة (بريد، دردشة، Webhooks، Slack)' : 'Omnichannel (Email, Chat, Webhooks, Slack)',
        language === 'ar' ? 'طيار آلي متكامل مع تحليل المشاعر' : 'Full AI Autopilot with sentiment analysis',
        language === 'ar' ? 'دعم كامل ومثالي للعربية والإنجليزية RTL' : 'Bilingual English & Arabic RTL support',
        language === 'ar' ? 'إشعارات Webhook مخصصة ومؤقتات SLA' : 'Custom webhooks & SLA timers',
        language === 'ar' ? 'دعم تقني ذو أولوية على مدار الساعة' : 'Priority 24/7 technical desk',
      ],
      highlight: true,
    },
    {
      name: language === 'ar' ? 'المؤسسات' : 'Enterprise',
      price: billingPeriod === 'monthly' ? '$249' : '$199',
      period: language === 'ar' ? '/ شهر' : '/ month',
      desc: language === 'ar' ? 'للمنصات ذات الحجم الكبير واشتراطات الأمان الصارمة.' : 'For high-volume platforms with strict security & SLA needs.',
      features: [
        language === 'ar' ? 'مقاعد دعم غير محدودة' : 'Unlimited support seats',
        language === 'ar' ? 'حصص مخصصة لمعدل تدفق الطلبات' : 'Dedicated token-bucket burst rate limits',
        language === 'ar' ? 'تسجيل دخول موحد Okta وAzure AD SAML 2.0' : 'Okta & Azure AD SAML 2.0 Single Sign-On',
        language === 'ar' ? 'نماذج ذكاء اصطناعي مدربة على وثائقك الخاصة' : 'Custom fine-tuned AI models on private docs',
        language === 'ar' ? 'حزمة تقارير تدقيق امتثال SOC2 Type II' : 'SOC2 Type II compliance audit packet',
        language === 'ar' ? 'مهندس حلول تقنية مخصص لحسابك' : 'Dedicated Solutions Architect',
      ],
      highlight: false,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'الجيل القادم من منصات دعم العملاء والذكاء الاصطناعي' : 'Next-Generation Customer Support SaaS UI Kit'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight md:leading-tight">
          {language === 'ar'
            ? 'حل استفسارات العملاء بسرعة فائقة مع مساعد الذكاء الاصطناعي المفسَّر.'
            : 'Resolve Customer Inquiries Faster with Explainable AI Assistance.'}
        </h1>

        <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {language === 'ar'
            ? 'يجمع SupportFlow AI صندوق الوارد وسجلات الأداء وقاعدة المعرفة في بيئة عمل موحدة. يبقى فريقك في كامل السيطرة بينما يصيغ الذكاء الاصطناعي ردوداً دقيقة خلال أجزاء من الثانية.'
            : 'SupportFlow AI unites your inbox, telemetry traces, and knowledge base into a cohesive workflow. Human agents stay in full control while AI drafts accurate answers in milliseconds.'}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onLaunchDemo}
            leftIcon={<Inbox className="w-4 h-4" />}
            rightIcon={<ArrowRight className={`w-4 h-4 ${direction === 'rtl' ? 'rotate-180' : ''}`} />}
          >
            {language === 'ar' ? 'تشغيل التطبيق التفاعلي' : 'Launch Interactive App'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const el = document.getElementById('pricing');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {language === 'ar' ? 'استعراض الباقات والأسعار' : 'Explore Plans & Pricing'}
          </Button>
        </div>

        {/* Live Interface Preview Mockup */}
        <div className="mt-12 p-2 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-5xl mx-auto text-left rtl:text-right">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 rtl:mr-2 rtl:ml-0 font-mono text-slate-400">app.supportflow.io/inbox</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
              {language === 'ar' ? 'معاينة حية لصندوق الوارد الموحد' : 'Live Unified Inbox Preview'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2 border border-slate-200/60 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                {language === 'ar' ? '1. بلاغ العميل' : '1. Customer Incident'}
              </span>
              <p className="text-slate-500 text-[11px]">
                {language === 'ar'
                  ? '"نقطة نهاية الـ webhook تعيد خطأ 429 تجاوز الحد أثناء ارتفاع الطلبات على المسار /v2/events."'
                  : '"Webhook endpoint returning 429 Too Many Requests during event spikes on /v2/events."'}
              </p>
            </div>

            <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-lg space-y-2 border border-indigo-200/60 dark:border-indigo-900/40">
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? '2. تشخيص مساعد الذكاء الاصطناعي' : '2. AI Copilot Diagnosis'}</span>
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                {language === 'ar'
                  ? '"وصلت حركة مرور العميل إلى ذروة 3,450 طلب/ث. الإجراء المقترح: رفع الحصة المؤقتة وتقديم دليل إعادة المحاولة مع التراجع الأسي."'
                  : '"Customer traffic reached 3,450 req/sec burst. Suggested action: Boost temporary quota and provide jittered exponential backoff guide."'}
              </p>
            </div>

            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-lg space-y-2 border border-emerald-200/60 dark:border-emerald-900/40">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300 block">
                {language === 'ar' ? '3. حل بنقرة واحدة' : '3. One-Click Resolution'}
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                {language === 'ar'
                  ? 'يراجع الوكيل الرد المقترح، ويخصص النبرة، ويحل التذكرة في أقل من 90 ثانية مع تحقيق رضا 98%.'
                  : 'Agent reviews suggested response, customizes tone, and resolves ticket in under 90 seconds with 98% CSAT.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {language === 'ar' ? 'مصمم خصيصاً لعمليات شركات الـ SaaS الحديثة' : 'Engineered for Modern SaaS Operations'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === 'ar'
                ? 'مجموعة أدوات متكاملة تلبي التحديات اليومية الفعلية لفرق الدعم التقني والعمليات.'
                : 'A comprehensive toolkit answering the real day-to-day challenges of technical support teams.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-left rtl:text-right">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Inbox className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">{language === 'ar' ? 'صندوق وارد موحد فوري' : 'Unified Real-Time Inbox'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'ar'
                  ? 'ربط التدفقات الواردة من البريد والدردشة وأحداث الـ Webhook وSlack في محطة عمل كثيفة ثلاثية الأجزاء مصممة للسرعة.'
                  : 'Connect incoming streams from email, live chat, webhook events, and Slack into a dense 3-pane workstation designed for speed.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-left rtl:text-right">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">{language === 'ar' ? 'مساعد ذكاء اصطناعي مفسَّر' : 'Explainable AI Assistance'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'ar'
                  ? 'لا توجد صناديق سوداء غامضة. كل اقتراح يوضح مستندات المصدر، وتحليل المشاعر، ونسب الثقة مع إدراج فوري بنقرة واحدة.'
                  : 'No magic black boxes. Every suggestion discloses source documents, sentiment detection, and confidence levels with 1-click insertion.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-left rtl:text-right">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">{language === 'ar' ? 'ثنائي اللغة (عربي RTL وإنجليزي LTR)' : 'Bilingual English & Arabic RTL'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'ar'
                  ? 'تبديل فوري لاتجاه الواجهة بالكامل دون ازدواجية في الكود، مع طباعة عربية أصلية تلائم معايير مؤسسات الشرق الأوسط.'
                  : 'Instant bidirectional layout switching without duplicate code. Native Arabic typography tailored for Gulf and MENA enterprise standards.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {language === 'ar' ? 'أسعار واضحة وشفافة' : 'Transparent, Predictable Pricing'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'ar'
              ? 'اختر الخطة المناسبة لحجم فريقك الحالي. يمكنك الترقية أو توسيع المقاعد في أي وقت.'
              : 'Choose the plan that fits your current team volume. Upgrade or scale seats anytime.'}
          </p>

          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mt-4 text-xs font-semibold">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-slate-100'
                  : 'text-slate-500'
              }`}
            >
              {language === 'ar' ? 'اشتراك شهري' : 'Monthly Billing'}
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                billingPeriod === 'annual'
                  ? 'bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-slate-100'
                  : 'text-slate-500'
              }`}
            >
              {language === 'ar' ? 'اشتراك سنوي (خصم 20%)' : 'Annual Billing (Save 20%)'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left rtl:text-right">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border flex flex-col justify-between space-y-6 ${
                p.highlight
                  ? 'border-indigo-600 ring-2 ring-indigo-600 shadow-lg relative'
                  : 'border-slate-200 dark:border-slate-800 shadow-2xs'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
                  {language === 'ar' ? 'الأكثر طلباً لشركات الـ SaaS' : 'Most Popular for SaaS'}
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tabular-nums">{p.price}</span>
                  <span className="text-xs text-slate-500">{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant={p.highlight ? 'primary' : 'outline'}
                size="md"
                onClick={onLaunchDemo}
                className="w-full text-xs font-semibold"
              >
                {language === 'ar' ? 'بدء التجربة المجانية' : 'Start Free Trial'}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
            <Headphones className="w-4 h-4 text-indigo-600" />
            <span>SupportFlow AI</span>
          </div>
          <p>{language === 'ar' ? '© 2026 شركة SupportFlow Technologies. جميع الحقوق محفوظة.' : '© 2026 SupportFlow Technologies Inc. All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="hover:underline">{language === 'ar' ? 'الأسعار' : 'Pricing'}</a>
            <button onClick={onLaunchDemo} className="hover:underline cursor-pointer">{language === 'ar' ? 'التطبيق التفاعلي' : 'Interactive App'}</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

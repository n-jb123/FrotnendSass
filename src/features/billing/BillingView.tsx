import React from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { supportRepository } from '../../services/supportRepository';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
  CreditCard,
  CheckCircle2,
  Download,
  Zap,
  Users,
  MessageSquare,
  HardDrive,
  Sparkles,
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const { t, language, direction } = useI18n();
  const { showToast } = useToast();
  const invoices = supportRepository.getInvoices();

  const handleDownloadInvoice = (invoiceNum: string) => {
    showToast(language === 'ar' ? `جاري تحميل إيصال الفاتورة ${invoiceNum}` : `Downloading receipt for invoice ${invoiceNum}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.billing.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.billing.subtitle}
          </p>
        </div>
      </div>

      {/* Plan Card & Usage Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Subscription Card */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                {t.billing.currentPlan}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {language === 'ar' ? 'نشط' : 'Active'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold">{t.billing.proPlan}</h2>
            <div className="text-3xl font-bold tabular-nums">
              $349 <span className="text-xs font-normal text-slate-300">{language === 'ar' ? '/ شهر' : '/ month'}</span>
            </div>
            <p className="text-xs text-slate-300">{t.billing.renewalDate}</p>
          </div>

          <div className="space-y-2 pt-4 border-t border-indigo-800/60">
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'ar' ? 'تشمل 25 مقعداً ومزامنة بريد إلكتروني غير محدودة' : 'Includes 25 seats & unlimited email sync'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'ar' ? 'ردود ذكاء اصطناعي كاملة وفرز تذاكر تلقائي' : 'Full AI copilot replies & auto-triage'}</span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => showToast(language === 'ar' ? 'تم فتح خيارات ترقية الباقة' : 'Upgraded tier preview opened')}
            className="w-full text-xs font-semibold"
          >
            {t.actions.upgrade}
          </Button>
        </div>

        {/* Right 2 Cols: Usage Meters */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {language === 'ar' ? 'الحصص التشغيلية الشهرية' : 'Monthly Operational Quotas'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Seats */}
            <div className="space-y-1.5 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>{t.billing.seatsUsed}</span>
                </span>
                <span className="font-bold tabular-nums">18 / 25</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '72%' }} />
              </div>
              <span className="text-[10px] text-slate-400">{language === 'ar' ? 'متبقي 7 مقاعد' : '7 seats remaining'}</span>
            </div>

            {/* Conversations */}
            <div className="space-y-1.5 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <MessageSquare className="w-4 h-4 text-sky-500" />
                  <span>{t.billing.conversationsMeter}</span>
                </span>
                <span className="font-bold tabular-nums">2,946 / 5,000</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '58.9%' }} />
              </div>
              <span className="text-[10px] text-slate-400">{language === 'ar' ? 'تتجدد خلال 24 يوماً' : 'Resets in 24 days'}</span>
            </div>

            {/* AI Automated Responses */}
            <div className="space-y-1.5 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>{t.billing.aiMeter}</span>
                </span>
                <span className="font-bold tabular-nums">1,420 / 3,000</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '47.3%' }} />
              </div>
              <span className="text-[10px] text-slate-400">{language === 'ar' ? 'متبقي 1,580 رصيد ذكاء اصطناعي' : '1,580 AI credits remaining'}</span>
            </div>

            {/* File Storage */}
            <div className="space-y-1.5 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <HardDrive className="w-4 h-4 text-amber-500" />
                  <span>{language === 'ar' ? 'سعة تخزين المرفقات والسجلات' : 'Attachments & Logs Storage'}</span>
                </span>
                <span className="font-bold tabular-nums">42 GB / 100 GB</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '42%' }} />
              </div>
              <span className="text-[10px] text-slate-400">{language === 'ar' ? '58 جيجابايت شاغرة' : '58 GB free'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.billing.invoices}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">{t.billing.invoiceNumber}</th>
                <th className="px-4 py-3">{language === 'ar' ? 'تاريخ الفاتورة' : 'Billing Date'}</th>
                <th className="px-4 py-3">{t.billing.amount}</th>
                <th className="px-4 py-3">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="px-4 py-3 text-right rtl:text-left">{language === 'ar' ? 'الإيصال' : 'Receipt'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3.5 font-mono font-medium text-slate-900 dark:text-slate-100">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{inv.date}</td>
                  <td className="px-4 py-3.5 font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {inv.amount}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {language === 'ar' ? 'مدفوعة' : 'Paid'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right rtl:text-left">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadInvoice(inv.invoiceNumber)}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                    >
                      {t.billing.downloadPdf}
                    </Button>
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

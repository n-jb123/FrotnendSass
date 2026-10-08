import React, { useState } from 'react';
import { Integration } from '../../types/models';
import { supportRepository } from '../../services/supportRepository';
import { useI18n } from '../../lib/i18n/I18nContext';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { useToast } from '../../components/ui/Toast';
import {
  MessageSquare,
  ShoppingBag,
  CreditCard,
  GitBranch,
  Mail,
  Users,
  Zap,
  CheckSquare,
  CheckCircle2,
  Settings,
  ExternalLink,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { t, language } = useI18n();
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(
    supportRepository.getIntegrations()
  );
  const [selectedConfig, setSelectedConfig] = useState<Integration | null>(null);

  const handleToggle = (id: string, name: string, willConnect: boolean) => {
    supportRepository.toggleIntegration(id);
    setIntegrations(supportRepository.getIntegrations());
    showToast(
      willConnect
        ? (language === 'ar' ? `تم ربط ${name} بنجاح` : `${name} connected successfully`)
        : (language === 'ar' ? `تم إلغاء ربط ${name}` : `${name} disconnected`)
    );
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-sky-500" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-purple-500" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-rose-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-amber-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-indigo-600" />;
      case 'CheckSquare':
        return <CheckSquare className="w-5 h-5 text-blue-500" />;
      default:
        return <Zap className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.nav.integrations}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ar'
              ? 'ربط مصادر البيانات، إشعارات الويب، ومزودي خدمات الدفع بصندوق الوارد الموحد.'
              : 'Connect data sources, notification webhooks, and payment providers to your unified inbox.'}
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shrink-0">
                  {getIcon(item.iconName)}
                </div>

                {item.isConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{language === 'ar' ? 'متصل' : 'Connected'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {language === 'ar' ? 'متاح للربط' : 'Available'}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              {item.lastSynced ? (
                <span className="text-[11px] text-slate-400 tabular-nums">
                  {language === 'ar' ? `مزامنة ${item.lastSynced}` : `Synced ${item.lastSynced}`}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  {language === 'ar' ? 'جاهز للإعداد' : 'Ready to pair'}
                </span>
              )}

              <div className="flex items-center gap-2">
                {item.isConnected && (
                  <button
                    onClick={() => setSelectedConfig(item)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                    title={language === 'ar' ? 'إعداد التكامل' : 'Configure integration'}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}

                <Button
                  size="sm"
                  variant={item.isConnected ? 'outline' : 'primary'}
                  onClick={() => handleToggle(item.id, item.name, !item.isConnected)}
                >
                  {item.isConnected ? t.actions.disconnect : t.actions.connect}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Dialog */}
      {selectedConfig && (
        <Dialog
          isOpen={!!selectedConfig}
          onClose={() => setSelectedConfig(null)}
          title={language === 'ar' ? `إعداد تكامل ${selectedConfig.name}` : `Configure ${selectedConfig.name}`}
          description={language === 'ar' ? `إدارة بيانات الاعتماد ومعايير مزامنة الويب لـ ${selectedConfig.name}` : `Manage live credentials and webhook sync parameters for ${selectedConfig.name}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'نقطة نهاية الـ Webhook' : 'Webhook Callback Endpoint'}
              </label>
              <input
                type="text"
                readOnly
                value={`https://api.supportflow.io/v2/webhooks/${selectedConfig.id}`}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'مفتاح التوقيع السري (HMAC-SHA256)' : 'Signing Secret (HMAC-SHA256)'}
              </label>
              <input
                type="password"
                readOnly
                value="whsec_984f8281a8b928194e82"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-[11px]"
              />
            </div>

            <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-300 leading-relaxed">
              {language === 'ar'
                ? `الأحداث النشطة: إنشاء التذكرة، تغير الحالة، تصعيد المشاعر. إجمالي الإرسال هذا الشهر: ${selectedConfig.eventCount?.toLocaleString() || 890}.`
                : `Active Events: Ticket Created, Status Changed, Sentiment Escalation. Total payload dispatches this month: ${selectedConfig.eventCount?.toLocaleString() || 890}.`}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="primary" onClick={() => setSelectedConfig(null)}>
                {language === 'ar' ? 'تم' : 'Done'}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

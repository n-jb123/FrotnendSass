import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import type { Language } from '../../types/models';
import { useTheme } from '../../lib/theme/ThemeContext';
import { supportRepository } from '../../services/supportRepository';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { useToast } from '../../components/ui/Toast';
import {
  Settings,
  Sliders,
  Bell,
  Shield,
  Key,
  Globe,
  Sun,
  Moon,
  Check,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const { theme, setTheme, density, setDensity } = useTheme();
  const { showToast } = useToast();

  type SettingsTab = 'general' | 'appearance' | 'notifications' | 'security' | 'api-keys';
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [workspaceName, setWorkspaceName] = useState('Acme Global Support');
  const [timezone, setTimezone] = useState('UTC (Universal Coordinated Time)');

  // API Keys state
  const [apiKeys, setApiKeys] = useState(supportRepository.getApiKeys());
  const [isNewKeyModalOpen, setIsNewKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(language === 'ar' ? 'تم حفظ إعدادات مساحة العمل' : 'Workspace settings saved');
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const rawToken = `sf_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 12)}`;
    supportRepository.createApiKey(newKeyName);
    setApiKeys(supportRepository.getApiKeys());
    setGeneratedSecret(rawToken);
    showToast(language === 'ar' ? 'تم إنشاء مفتاح API بنجاح' : 'API key created successfully');
  };

  const handleRevokeKey = (id: string) => {
    supportRepository.revokeApiKey(id);
    setApiKeys(supportRepository.getApiKeys());
    showToast(language === 'ar' ? 'تم إلغاء مفتاح API' : 'API key revoked');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.settings.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.settings.subtitle}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-px">
        {[
          { id: 'general', label: t.settings.general, icon: Settings },
          { id: 'appearance', label: t.settings.appearance, icon: Sliders },
          { id: 'notifications', label: t.settings.notifications, icon: Bell },
          { id: 'security', label: t.settings.security, icon: Shield },
          { id: 'api-keys', label: t.settings.apiKeys, icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'اسم مساحة العمل' : 'Workspace Name'}
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.settings.languageLabel}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="en">English (US / Global - LTR)</option>
              <option value="ar">العربية (Arabic - RTL)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="UTC (Universal Coordinated Time)">UTC (Universal Coordinated Time)</option>
              <option value="EST (UTC-5)">EST (New York / Eastern)</option>
              <option value="PST (UTC-8)">PST (San Francisco / Pacific)</option>
              <option value="GST (UTC+4)">GST (Dubai / Gulf)</option>
              <option value="CET (UTC+1)">CET (Madrid / Berlin)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" type="submit">
              {t.actions.save}
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Appearance */}
      {activeTab === 'appearance' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {language === 'ar' ? 'سمة الألوان والمظهر' : 'Color Theme'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border text-left rtl:text-right flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="text-xs font-bold block">{t.settings.themeLight}</span>
                    <span className="text-[11px] text-slate-500">
                      {language === 'ar' ? 'مظهر نهاري فاتح عالي التباين' : 'Crisp high-contrast daylight'}
                    </span>
                  </div>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-indigo-600" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border text-left rtl:text-right flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-950/20 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Moon className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="text-xs font-bold block">{t.settings.themeDark}</span>
                    <span className="text-[11px] text-slate-500">
                      {language === 'ar' ? 'لوحة داكنة مريحة للعين' : 'Deep neutral slate canvas'}
                    </span>
                  </div>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {language === 'ar' ? 'كثافة العرض والمحاذاة' : 'Layout Density'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDensity('comfortable')}
                className={`p-3.5 rounded-xl border text-left rtl:text-right flex items-center justify-between cursor-pointer ${
                  density === 'comfortable'
                    ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{t.settings.densityComfortable}</span>
                  <span className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'هوامش مريحة للقراءة المطولة' : 'Comfortable padding for long reading'}
                  </span>
                </div>
                {density === 'comfortable' && <Check className="w-4 h-4 text-indigo-600" />}
              </button>

              <button
                type="button"
                onClick={() => setDensity('compact')}
                className={`p-3.5 rounded-xl border text-left rtl:text-right flex items-center justify-between cursor-pointer ${
                  density === 'compact'
                    ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{t.settings.densityCompact}</span>
                  <span className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'شبكة بيانات مكثفة للفرز السريع' : 'High-density data grid for fast triage'}
                  </span>
                </div>
                {density === 'compact' && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {language === 'ar' ? 'محفزات الإشعارات والتنبيهات' : 'Notification Triggers'}
          </h3>
          {[
            {
              title: language === 'ar' ? 'محادثة عميل جديدة' : 'New Customer Conversation',
              desc: language === 'ar' ? 'إشعار فوري عند وصول تذكرة غير معينة إلى قائمة الانتظار.' : 'Notify when an unassigned ticket arrives on your queue.'
            },
            {
              title: language === 'ar' ? 'تنبيه وشوك خرق اتفاقية SLA' : 'SLA Imminent Breach Alert',
              desc: language === 'ar' ? 'تحذير عند بقاء أقل من 15 دقيقة على موعد حل التذكرة.' : 'Warn when a high or urgent ticket is within 15 minutes of SLA target.'
            },
            {
              title: language === 'ar' ? 'تصعيد مشاعر العميل الغاضب' : 'Customer Frustration Escalation',
              desc: language === 'ar' ? 'تنبيه فوري عبر Slack عندما يرصد الذكاء الاصطناعي استياء العميل.' : 'Trigger instant Slack ping when AI detects angry sentiment.'
            },
            {
              title: language === 'ar' ? 'تنبيه انخفاض ثقة الذكاء الاصطناعي' : 'AI Copilot Low-Confidence Flag',
              desc: language === 'ar' ? 'إبلاغ المشرف عندما تنخفض نسبة الثقة عن 70% لإجراء مراجعة.' : 'Notify supervisor when AI confidence falls below 70% threshold.'
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">{item.title}</span>
                <span className="text-[11px] text-slate-500">{item.desc}</span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                {t.settings.twoFactorEnabled}
              </h4>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                {language === 'ar'
                  ? 'يتم إلزام جميع أعضاء الفريق بالمصادقة الثنائية بواسطة مفاتيح الأمان أو تطبيقات TOTP.'
                  : 'All team members are enforced to authenticate with hardware keys or TOTP authenticators.'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t.settings.activeSessions}
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold block">Chrome 130 on macOS (San Francisco, CA)</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    {language === 'ar' ? 'الجلسة النشطة الحالية' : 'Current active session'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">198.51.100.42</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold block">Safari 18 on iOS (Cupertino, CA)</span>
                  <span className="text-[11px] text-slate-400">
                    {language === 'ar' ? 'نشطة منذ ساعتين' : 'Active 2 hours ago'}
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={() => showToast(language === 'ar' ? 'تم إنهاء الجلسة' : 'Session revoked')}>
                  {language === 'ar' ? 'إنهاء الجلسة' : 'Revoke'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: API Keys */}
      {activeTab === 'api-keys' && (
        <div className="max-w-3xl bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {language === 'ar' ? 'رموز API للمطورين' : 'Developer API Tokens'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'ar'
                  ? 'المصادقة على إرسال الـ Webhooks بين الخوادم واستدعاءات واجهة API الخارجية.'
                  : 'Authenticate server-to-server webhook dispatches and external API calls.'}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setGeneratedSecret(null);
                setNewKeyName('');
                setIsNewKeyModalOpen(true);
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              {t.actions.createApiKey}
            </Button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                    {key.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-slate-500 text-[11px]">{key.prefix}</span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar' ? `أُنشئ ${key.createdAt}` : `Created ${key.createdAt}`}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar' ? `آخر استخدام: ${key.lastUsed}` : `Last used: ${key.lastUsed}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      key.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {key.status === 'active' ? (language === 'ar' ? 'نشط' : 'active') : (language === 'ar' ? 'ملغى' : 'revoked')}
                  </span>

                  {key.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRevokeKey(key.id)}
                      leftIcon={<Trash2 className="w-3 h-3 text-rose-500" />}
                    >
                      {language === 'ar' ? 'إلغاء' : 'Revoke'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* New Key Modal */}
          <Dialog
            isOpen={isNewKeyModalOpen}
            onClose={() => setIsNewKeyModalOpen(false)}
            title={t.actions.createApiKey}
            description={language === 'ar' ? 'إنشاء مفتاح سري محدد النطاق للتكامل البرمجي' : 'Create a scoped secret key for programmatic API ingestion'}
          >
            {!generatedSecret ? (
              <form onSubmit={handleCreateKey} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ar' ? 'اسم معرف المفتاح' : 'Key Identifier Name'}
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: مزامنة دفعات الفوترة' : 'e.g. Billing Sync Worker'}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewKeyModalOpen(false)}>
                    {t.actions.cancel}
                  </Button>
                  <Button variant="primary" type="submit">
                    {language === 'ar' ? 'توليد المفتاح' : 'Generate Key'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-900 dark:text-amber-200 text-xs">
                  {language === 'ar' ? 'انسخ هذا المفتاح الآن. لدواعي الأمان، لن يتم عرضه مرة أخرى.' : 'Copy this key immediately. For security, it will not be shown again.'}
                </div>

                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs flex items-center justify-between">
                  <span className="truncate pr-2">{generatedSecret}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedSecret);
                      showToast(t.actions.copied);
                    }}
                    className="p-1 hover:text-indigo-400 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="primary" onClick={() => setIsNewKeyModalOpen(false)}>
                    {language === 'ar' ? 'تم' : 'Done'}
                  </Button>
                </div>
              </div>
            )}
          </Dialog>
        </div>
      )}
    </div>
  );
};

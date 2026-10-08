import React, { useState } from 'react';
import { Customer } from '../../types/models';
import { supportRepository } from '../../services/supportRepository';
import { useI18n } from '../../lib/i18n/I18nContext';
import { Dialog } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import {
  Search,
  Mail,
  Phone,
  Building,
  MapPin,
  Clock,
  MessageSquare,
  DollarSign,
  Tag,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface CustomersViewProps {
  onSelectCustomerConversation: (id: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  onSelectCustomerConversation,
}) => {
  const { t, direction, language } = useI18n();
  const customers = supportRepository.getCustomers();
  const conversations = supportRepository.getConversations();

  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(search.toLowerCase()) ||
      cust.email.toLowerCase().includes(search.toLowerCase()) ||
      cust.company.toLowerCase().includes(search.toLowerCase());

    const matchesPlan = selectedPlan === 'all' || cust.plan.toLowerCase() === selectedPlan.toLowerCase();

    return matchesSearch && matchesPlan;
  });

  const handleOpenConversation = (customerId: string) => {
    const conv = conversations.find((c) => c.customerId === customerId);
    if (conv) {
      onSelectCustomerConversation(conv.id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.customers.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.customers.subtitle}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن العملاء بالاسم، الشركة أو البريد...' : 'Search customers by name, company, or email...'}
            className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'enterprise', 'pro', 'starter'].map((plan) => {
            const planLabel =
              plan === 'all'
                ? (language === 'ar' ? 'جميع الخطط' : 'All Plans')
                : plan === 'enterprise'
                ? (language === 'ar' ? 'المؤسسات' : 'Enterprise')
                : plan === 'pro'
                ? (language === 'ar' ? 'الاحترافية' : 'Pro')
                : (language === 'ar' ? 'البداية' : 'Starter');

            return (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors shrink-0 cursor-pointer ${
                  selectedPlan === plan
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs font-semibold'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {planLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                <th className="px-4 py-3">{t.customers.company}</th>
                <th className="px-4 py-3">{t.customers.plan}</th>
                <th className="px-4 py-3">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="px-4 py-3">{t.customers.ltv}</th>
                <th className="px-4 py-3">{t.customers.lastActive}</th>
                <th className="px-4 py-3 text-right rtl:text-left">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatarUrl}
                        alt={cust.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {cust.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                          {cust.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="text-slate-800 dark:text-slate-200 font-medium block">
                      {cust.company}
                    </span>
                    <span className="text-[11px] text-slate-400">{cust.role}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        cust.plan === 'Enterprise'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          : cust.plan === 'Pro'
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {language === 'ar' ? (cust.plan === 'Enterprise' ? 'المؤسسات' : cust.plan === 'Pro' ? 'الاحترافية' : 'البداية') : cust.plan}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                        cust.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {cust.status === 'at-risk' ? (language === 'ar' ? 'في خطر' : 'At Risk') : (language === 'ar' ? 'نشط' : 'Active')}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {cust.ltv}
                  </td>

                  <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 tabular-nums">
                    {cust.lastActivityAt}
                  </td>

                  <td className="px-4 py-3.5 text-right rtl:text-left">
                    <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveCustomer(cust)}
                      >
                        {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleOpenConversation(cust.id)}
                        leftIcon={<MessageSquare className="w-3 h-3" />}
                      >
                        {language === 'ar' ? 'المحادثة' : 'Inbox'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {activeCustomer && (
        <Dialog
          isOpen={!!activeCustomer}
          onClose={() => setActiveCustomer(null)}
          title={activeCustomer.name}
          description={`${activeCustomer.role} at ${activeCustomer.company}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <img
                src={activeCustomer.avatarUrl}
                alt={activeCustomer.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {activeCustomer.name}
                </h3>
                <p className="text-xs text-slate-500">{activeCustomer.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {language === 'ar' ? `باقة ${activeCustomer.plan === 'Enterprise' ? 'المؤسسات' : activeCustomer.plan === 'Pro' ? 'الاحترافية' : 'البداية'}` : `${activeCustomer.plan} Plan`}
                  </span>
                  <span className="text-[11px] text-slate-500">{activeCustomer.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 block">{t.customers.ltv}</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {activeCustomer.ltv}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 block">{language === 'ar' ? 'المنطقة الزمنية للعميل' : 'Customer Timezone'}</span>
                <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {activeCustomer.timezone}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                {t.customers.tags}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCustomer.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActiveCustomer(null)}>
                {t.actions.cancel}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleOpenConversation(activeCustomer.id);
                  setActiveCustomer(null);
                }}
                leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
              >
                {language === 'ar' ? 'فتح في صندوق الوارد' : 'Open in Unified Inbox'}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

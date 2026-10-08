import React, { useState } from 'react';
import { Ticket } from '../../types/models';
import { supportRepository } from '../../services/supportRepository';
import { useI18n } from '../../lib/i18n/I18nContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
  Search,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface TicketsViewProps {
  onSelectConversation: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  onSelectConversation,
  onNavigateTab,
}) => {
  const { t, language, direction } = useI18n();
  const { showToast } = useToast();
  const tickets = supportRepository.getTickets();
  const conversations = supportRepository.getConversations();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTickets = tickets.filter((tk) => {
    const matchesSearch =
      tk.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      tk.subject.toLowerCase().includes(search.toLowerCase()) ||
      tk.customerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tk.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenTicketConversation = (customerId: string) => {
    const conv = conversations.find((c) => c.customerId === customerId);
    if (conv) {
      onSelectConversation(conv.id);
      onNavigateTab('inbox');
    }
  };

  const handleQuickResolve = (ticketId: string) => {
    showToast(language === 'ar' ? `تم حل التذكرة ${ticketId} بنجاح` : `Ticket ${ticketId} resolved successfully`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.tickets.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.tickets.subtitle}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن التذاكر بالرقم أو الموضوع أو العميل...' : 'Search tickets by ID, subject, or customer...'}
            className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'open', 'pending', 'resolved'].map((st) => {
            const label = st === 'all' ? (language === 'ar' ? 'الكل' : 'All') : (t.status[st as keyof typeof t.status] || st);
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">{t.tickets.ticketNumber}</th>
                <th className="px-4 py-3">{t.tickets.subject}</th>
                <th className="px-4 py-3">{t.tickets.customer}</th>
                <th className="px-4 py-3">{language === 'ar' ? 'الحالة والأولوية' : 'Status & Priority'}</th>
                <th className="px-4 py-3">{t.tickets.category}</th>
                <th className="px-4 py-3">{t.tickets.slaDue}</th>
                <th className="px-4 py-3 text-right rtl:text-left">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTickets.map((tk) => (
                <tr
                  key={tk.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3.5 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {tk.ticketNumber}
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleOpenTicketConversation(tk.customerId)}
                      className="font-medium text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 text-left rtl:text-right cursor-pointer"
                    >
                      {tk.subject}
                    </button>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{tk.createdAt}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={tk.customerAvatar}
                        alt={tk.customerName}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {tk.customerName}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={tk.status} />
                      <StatusBadge priority={tk.priority} />
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                    {tk.category}
                  </td>

                  <td className="px-4 py-3.5 font-medium tabular-nums">
                    <span
                      className={
                        tk.priority === 'urgent'
                          ? 'text-rose-600 dark:text-rose-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300'
                      }
                    >
                      {tk.slaDue}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right rtl:text-left">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenTicketConversation(tk.customerId)}
                      rightIcon={<ArrowRight className={`w-3 h-3 ${direction === 'rtl' ? 'rotate-180' : ''}`} />}
                    >
                      {language === 'ar' ? 'عرض التذكرة' : 'Open'}
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

import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, User, Ticket, FileText, ArrowRight } from 'lucide-react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { supportRepository } from '../../services/supportRepository';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectConversation,
  onNavigateTab,
}) => {
  const { t, language, direction } = useI18n();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const conversations = supportRepository.getConversations();
  const customers = supportRepository.getCustomers();
  const tickets = supportRepository.getTickets();
  const articles = supportRepository.getArticles();

  const q = query.toLowerCase().trim();

  const filteredConversations = conversations.filter(
    (c) =>
      c.subject.toLowerCase().includes(q) ||
      c.customer.name.toLowerCase().includes(q) ||
      c.customer.company.toLowerCase().includes(q)
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q)
  );

  const filteredTickets = tickets.filter(
    (tk) =>
      tk.ticketNumber.toLowerCase().includes(q) ||
      tk.subject.toLowerCase().includes(q) ||
      tk.customerName.toLowerCase().includes(q)
  );

  const filteredArticles = articles.filter(
    (a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100"
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.actions.search}
            autoFocus
            className="w-full bg-transparent text-sm focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Quick jump tabs */}
          {query.length === 0 && (
            <div className="p-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2 px-2">
                {language === 'ar' ? 'التنقل السريع' : 'Quick Navigation'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'inbox', label: t.nav.inbox, icon: MessageSquare },
                  { id: 'customers', label: t.nav.customers, icon: User },
                  { id: 'tickets', label: t.nav.tickets, icon: Ticket },
                  { id: 'knowledge-base', label: t.nav.knowledgeBase, icon: FileText },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateTab(item.id);
                      onClose();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left rtl:text-right cursor-pointer"
                  >
                    <item.icon className="w-4 h-4 text-indigo-500" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversations */}
          {filteredConversations.length > 0 && (
            <div className="p-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5 px-2">
                {t.nav.inbox}
              </span>
              {filteredConversations.slice(0, 3).map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onNavigateTab('inbox');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left rtl:text-right transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">
                        {conv.subject}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {conv.customer.name} · {conv.customer.company}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0 ml-2 rtl:mr-2 rtl:ml-0 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
              ))}
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div className="p-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5 px-2">
                {t.nav.customers}
              </span>
              {filteredCustomers.slice(0, 3).map((cust) => (
                <button
                  key={cust.id}
                  onClick={() => {
                    onNavigateTab('customers');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left rtl:text-right transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={cust.avatarUrl}
                      alt={cust.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block">
                        {cust.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {cust.company} · {cust.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {language === 'ar' ? (cust.plan === 'Enterprise' ? 'المؤسسات' : cust.plan === 'Pro' ? 'الاحترافية' : 'البداية') : cust.plan}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Articles */}
          {filteredArticles.length > 0 && (
            <div className="p-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5 px-2">
                {t.nav.knowledgeBase}
              </span>
              {filteredArticles.slice(0, 2).map((art) => (
                <button
                  key={art.id}
                  onClick={() => {
                    onNavigateTab('knowledge-base');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left rtl:text-right transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">
                        {art.title}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {art.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 tabular-nums">{art.views} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

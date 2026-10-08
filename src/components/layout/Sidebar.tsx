import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Ticket,
  BookOpen,
  BarChart3,
  Sparkles,
  Layers,
  ShieldCheck,
  CreditCard,
  Settings,
  Headphones,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n/I18nContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
  isHighlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  openConversationsCount: number;
  openTicketsCount: number;
  onCloseMobileNav?: () => void;
  activeView: 'app' | 'marketing' | 'docs' | 'public-help';
  onChangeView: (view: 'app' | 'marketing' | 'docs' | 'public-help') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  openConversationsCount,
  openTicketsCount,
  onCloseMobileNav,
  activeView,
  onChangeView,
}) => {
  const { t, direction, language } = useI18n();

  const handleNavClick = (tabId: string) => {
    if (activeView !== 'app') {
      onChangeView('app');
    }
    onSelectTab(tabId);
    if (onCloseMobileNav) onCloseMobileNav();
  };

  const navSections: NavSection[] = [
    {
      title: language === 'ar' ? 'العمليات والدعم' : 'OPERATIONS',
      items: [
        { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
        {
          id: 'inbox',
          label: t.nav.inbox,
          icon: Inbox,
          badge: openConversationsCount,
          badgeColor: 'bg-indigo-600 text-white',
        },
        { id: 'customers', label: t.nav.customers, icon: Users },
        {
          id: 'tickets',
          label: t.nav.tickets,
          icon: Ticket,
          badge: openTicketsCount,
          badgeColor: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
        },
        { id: 'knowledge-base', label: t.nav.knowledgeBase, icon: BookOpen },
      ],
    },
    {
      title: language === 'ar' ? 'الذكاء والتحليل' : 'INTELLIGENCE',
      items: [
        { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
        { id: 'ai-studio', label: t.nav.aiStudio, icon: Sparkles, isHighlight: true },
      ],
    },
    {
      title: language === 'ar' ? 'الإدارة والنظام' : 'MANAGEMENT',
      items: [
        { id: 'integrations', label: t.nav.integrations, icon: Layers },
        { id: 'team', label: t.nav.team, icon: ShieldCheck },
        { id: 'billing', label: t.nav.billing, icon: CreditCard },
        { id: 'settings', label: t.nav.settings, icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-50/90 dark:bg-[#0c1220] border-r rtl:border-l rtl:border-r-0 border-slate-200 dark:border-slate-800/80 flex flex-col shrink-0 h-full select-none text-slate-900 dark:text-slate-100">
      {/* Brand & Workspace */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Headphones className="w-4 h-4" />
          </div>
          <div className="leading-none">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight block">
              {t.appName}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
              {language === 'ar' ? 'نسخة المؤسسات v2.4' : 'Enterprise v2.4'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 block mb-1.5">
              {section.title}
            </span>
            {section.items.map((item) => {
              const isActive = activeView === 'app' && currentTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-white'
                          : item.isHighlight
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-semibold rounded tabular-nums ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Workspace Plan Indicator */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-[#0c1220]/60">
        <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
            <span>{language === 'ar' ? 'الخطة الاحترافية' : 'Pro Plan'}</span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
              {language === 'ar' ? '18 / 25 مقعد' : '18 / 25 Seats'}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '72%' }} />
          </div>
          <button
            onClick={() => handleNavClick('billing')}
            className="w-full py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>{language === 'ar' ? 'إدارة الاشتراك' : 'Manage Plan'}</span>
            <ChevronRight className={`w-3 h-3 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </aside>
  );
};

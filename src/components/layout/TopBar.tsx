import avatarDaniel from '../../assets/images/avatar_daniel_brooks_1791441190531.webp';
import React from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { useTheme } from '../../lib/theme/ThemeContext';
import { supportRepository } from '../../services/supportRepository';

interface TopBarProps {
  currentTab: string;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onToggleMobileNav: () => void;
  activeView: 'app' | 'marketing' | 'docs' | 'public-help';
  onChangeView: (view: 'app' | 'marketing' | 'docs' | 'public-help') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onOpenSearch,
  onOpenNotifications,
  onToggleMobileNav,
  activeView,
  onChangeView,
}) => {
  const { language, toggleLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const notifications = supportRepository.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabLabels: Record<string, string> = {
    dashboard: t.nav.dashboard,
    inbox: t.nav.inbox,
    customers: t.nav.customers,
    tickets: t.nav.tickets,
    'knowledge-base': t.nav.knowledgeBase,
    analytics: t.nav.analytics,
    'ai-studio': t.nav.aiStudio,
    integrations: t.nav.integrations,
    team: t.nav.team,
    billing: t.nav.billing,
    settings: t.nav.settings,
  };

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0c1220]/90 text-slate-900 dark:text-slate-100 backdrop-blur-md px-4 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Zone 1: Mobile hamburger + Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open Navigation"
        >
          <Sliders className="w-5 h-5 rotate-90" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {activeView === 'app'
              ? tabLabels[currentTab] || t.appName
              : activeView === 'marketing'
              ? (language === 'ar' ? 'صفحة المنتج والهبوط' : 'Marketing Landing')
              : activeView === 'docs'
              ? (language === 'ar' ? 'نظام التصميم والمكونات' : 'Design System')
              : (language === 'ar' ? 'مركز مساعدة العملاء' : 'Public Help Center')}
          </span>
          <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">/</span>
          <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400">
            {t.workspace}
          </span>
        </div>
      </div>

      {/* Zone 2: View Switcher (App vs Marketing vs Docs vs Help) */}
      <div className="hidden md:flex items-center p-0.5 bg-slate-100 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs font-medium">
        <button
          onClick={() => onChangeView('app')}
          className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
            activeView === 'app'
              ? 'bg-indigo-600 text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {language === 'ar' ? 'تطبيق المنصة' : 'SaaS App'}
        </button>
        <button
          onClick={() => onChangeView('marketing')}
          className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
            activeView === 'marketing'
              ? 'bg-indigo-600 text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {language === 'ar' ? 'صفحة الهبوط' : 'Landing Page'}
        </button>
        <button
          onClick={() => onChangeView('docs')}
          className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
            activeView === 'docs'
              ? 'bg-indigo-600 text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {language === 'ar' ? 'نظام التصميم' : 'Design System'}
        </button>
        <button
          onClick={() => onChangeView('public-help')}
          className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
            activeView === 'public-help'
              ? 'bg-indigo-600 text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {language === 'ar' ? 'مركز المساعدة' : 'Help Center'}
        </button>
      </div>

      {/* Zone 3: Actions (Search, Language, Theme, Notifications, Profile) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 rounded-lg border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
          title="Search anything"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">{t.actions.search}</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Language Switcher (EN 🇬🇧 / AR 🇸🇦 with RTL transition) */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
          title={language === 'en' ? 'Switch to Arabic (RTL)' : 'Switch to English (LTR)'}
        >
          <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-all active:scale-95 cursor-pointer shadow-2xs hover:text-indigo-600 dark:hover:text-indigo-400"
          aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          title={theme === 'light' ? (language === 'ar' ? 'التبديل إلى الوضع الداكن' : 'Switch to Dark Mode') : (language === 'ar' ? 'التبديل إلى الوضع الفاتح' : 'Switch to Light Mode')}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 rtl:pr-1 rtl:sm:pr-2 border-l rtl:border-r rtl:border-l-0 border-slate-200 dark:border-slate-800 ml-1 rtl:mr-1 rtl:ml-0">
          <img
            src={avatarDaniel}
            alt="Alex Mercer"
            className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/30 dark:ring-indigo-400/40"
          />
          <div className="hidden xl:block text-left rtl:text-right">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block leading-tight">
              {language === 'ar' ? 'أليكس ميرسر' : 'Alex Mercer'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
              {language === 'ar' ? 'مشرف الفريق' : 'Supervisor'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

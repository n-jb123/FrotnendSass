import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { supportRepository } from '../../services/supportRepository';
import { CommandPalette } from '../navigation/CommandPalette';
import { NotificationsDrawer } from '../navigation/NotificationsDrawer';
import { useI18n } from '../../lib/i18n/I18nContext';
import { getInitialRoute, routeForState, type AppRoute } from '../../lib/routing/appRouter';

// Views
import { InboxView } from '../../features/inbox/InboxView';
import { DashboardView } from '../../features/dashboard/DashboardView';
import { CustomersView } from '../../features/customers/CustomersView';
import { TicketsView } from '../../features/tickets/TicketsView';
import { KnowledgeBaseView } from '../../features/knowledge-base/KnowledgeBaseView';
import { AnalyticsView } from '../../features/analytics/AnalyticsView';
import { AiStudioView } from '../../features/ai/AiStudioView';
import { IntegrationsView } from '../../features/integrations/IntegrationsView';
import { TeamView } from '../../features/team/TeamView';
import { BillingView } from '../../features/billing/BillingView';
import { SettingsView } from '../../features/settings/SettingsView';
import { MarketingView } from '../../features/marketing/MarketingView';
import { DesignSystemView } from '../../features/docs/DesignSystemView';
import { PublicHelpCenterView } from '../../features/public-help/PublicHelpCenterView';

export const AppShell: React.FC = () => {
  const { direction } = useI18n();
  const initialRoute = getInitialRoute();
  const [currentTab, setCurrentTab] = useState<string>(initialRoute.currentTab);
  const [activeView, setActiveView] = useState<'app' | 'marketing' | 'docs' | 'public-help'>(initialRoute.activeView);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [targetConversationId, setTargetConversationId] = useState<string | undefined>(initialRoute.conversationId);

  const navigate = (route: AppRoute, replace = false) => {
    setActiveView(route.activeView);
    setCurrentTab(route.currentTab);
    setTargetConversationId(route.conversationId);
    const url = routeForState(route.activeView, route.currentTab, route.conversationId);
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute();
      setActiveView(route.activeView);
      setCurrentTab(route.currentTab);
      setTargetConversationId(route.conversationId);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = !!target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }

      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        if (!isTyping) setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Repository live data counts
  const [conversations, setConversations] = useState(supportRepository.getConversations());
  const [tickets, setTickets] = useState(supportRepository.getTickets());

  useEffect(() => {
    const unsub = supportRepository.subscribe(() => {
      setConversations(supportRepository.getConversations());
      setTickets(supportRepository.getTickets());
    });
    return () => unsub();
  }, []);

  const openConversationsCount = conversations.filter((c) => c.status === 'open').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;

  const handleSelectConversation = (id: string) => {
    navigate({ activeView: 'app', currentTab: 'inbox', conversationId: id });
    setIsMobileNavOpen(false);
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans"
      dir={direction}
    >
      {/* 1. Desktop & Tablet Sidebar (Only in App & Docs views) */}
      {(activeView === 'app' || activeView === 'docs') && (
        <div className="hidden lg:block h-full">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => { navigate({ activeView: 'app', currentTab: tab }); setIsMobileNavOpen(false); }}
            openConversationsCount={openConversationsCount}
            openTicketsCount={openTicketsCount}
            activeView={activeView}
            onChangeView={(view) => navigate({ activeView: view, currentTab: view === 'app' ? currentTab : 'inbox' })}
          />
        </div>
      )}

      {/* 2. Mobile Drawer Navigation */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative w-64 h-full z-10 animate-in slide-in-from-left rtl:slide-in-from-right duration-200">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => { navigate({ activeView: 'app', currentTab: tab }); setIsMobileNavOpen(false); }}
              openConversationsCount={openConversationsCount}
              openTicketsCount={openTicketsCount}
              onCloseMobileNav={() => setIsMobileNavOpen(false)}
              activeView={activeView}
              onChangeView={(view) => { navigate({ activeView: view, currentTab: view === 'app' ? currentTab : 'inbox' }); setIsMobileNavOpen(false); }}
            />
          </div>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Bar Header */}
        <TopBar
          currentTab={currentTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onToggleMobileNav={() => setIsMobileNavOpen(true)}
          activeView={activeView}
          onChangeView={(view) => navigate({ activeView: view, currentTab: view === 'app' ? currentTab : 'inbox' })}
        />

        {/* View Switcher Routing */}
        <main className="flex-1 flex overflow-hidden">
          {activeView === 'marketing' && (
            <MarketingView onLaunchDemo={() => navigate({ activeView: 'app', currentTab: 'inbox' })} />
          )}

          {activeView === 'docs' && <DesignSystemView />}

          {activeView === 'public-help' && (
            <PublicHelpCenterView onBackToApp={() => navigate({ activeView: 'app', currentTab: 'dashboard' })} />
          )}

          {activeView === 'app' && (
            <>
              {currentTab === 'inbox' && (
                <InboxView initialConversationId={targetConversationId} />
              )}
              {currentTab === 'dashboard' && (
                <DashboardView
                  onSelectConversation={handleSelectConversation}
                  onNavigateTab={(tab) => navigate({ activeView: 'app', currentTab: tab })}
                />
              )}
              {currentTab === 'customers' && (
                <CustomersView
                  onSelectCustomerConversation={handleSelectConversation}
                />
              )}
              {currentTab === 'tickets' && (
                <TicketsView
                  onSelectConversation={handleSelectConversation}
                  onNavigateTab={(tab) => navigate({ activeView: 'app', currentTab: tab })}
                />
              )}
              {currentTab === 'knowledge-base' && <KnowledgeBaseView />}
              {currentTab === 'analytics' && <AnalyticsView />}
              {currentTab === 'ai-studio' && (
                <AiStudioView onNavigateToConversation={handleSelectConversation} />
              )}
              {currentTab === 'integrations' && <IntegrationsView />}
              {currentTab === 'team' && <TeamView />}
              {currentTab === 'billing' && <BillingView />}
              {currentTab === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectConversation={handleSelectConversation}
        onNavigateTab={(tab) => {
          navigate({ activeView: 'app', currentTab: tab });
        }}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  );
};

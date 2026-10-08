export type AppView = 'app' | 'marketing' | 'docs' | 'public-help';

export interface AppRoute {
  activeView: AppView;
  currentTab: string;
  conversationId?: string;
}

const appTabs = new Set([
  'dashboard',
  'inbox',
  'customers',
  'tickets',
  'knowledge-base',
  'analytics',
  'ai-studio',
  'integrations',
  'team',
  'billing',
  'settings',
]);

export function routeForState(activeView: AppView, currentTab: string, conversationId?: string): string {
  if (activeView === 'marketing') return '/marketing';
  if (activeView === 'docs') return '/docs';
  if (activeView === 'public-help') return '/help';
  if (conversationId) return `/app/inbox/${encodeURIComponent(conversationId)}`;
  return `/app/${appTabs.has(currentTab) ? currentTab : 'inbox'}`;
}

export function getInitialRoute(pathname = window.location.pathname): AppRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/marketing') return { activeView: 'marketing', currentTab: 'inbox' };
  if (normalized === '/docs') return { activeView: 'docs', currentTab: 'inbox' };
  if (normalized === '/help') return { activeView: 'public-help', currentTab: 'inbox' };

  const segments = normalized.split('/').filter(Boolean);
  if (segments[0] === 'app') {
    const tab = segments[1] && appTabs.has(segments[1]) ? segments[1] : 'inbox';
    const conversationId = tab === 'inbox' && segments[2] ? decodeURIComponent(segments[2]) : undefined;
    return { activeView: 'app', currentTab: tab, conversationId };
  }

  return { activeView: 'app', currentTab: 'inbox' };
}

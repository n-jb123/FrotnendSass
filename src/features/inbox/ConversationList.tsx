import React from 'react';
import { Conversation, ConversationStatus, PriorityLevel } from '../../types/models';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Search, Sparkles, Filter, Mail, MessageSquare, Code, Layers } from 'lucide-react';
import { useI18n } from '../../lib/i18n/I18nContext';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  const { t } = useI18n();

  const filterTabs = [
    { id: 'all', label: t.inbox.allFolders, count: conversations.length },
    { id: 'open', label: t.inbox.openQueue, count: conversations.filter((c) => c.status === 'open').length },
    { id: 'assigned_me', label: t.inbox.assignedToMe, count: conversations.filter((c) => c.assigneeId === 'agent-1').length },
    { id: 'high_priority', label: t.inbox.highPriority, count: conversations.filter((c) => c.priority === 'high' || c.priority === 'urgent').length },
    { id: 'ai_suggested', label: t.inbox.aiSuggestedFilter, count: conversations.filter((c) => c.aiSuggested).length },
    { id: 'pending', label: t.inbox.pendingQueue, count: conversations.filter((c) => c.status === 'pending').length },
    { id: 'resolved', label: t.inbox.resolvedQueue, count: conversations.filter((c) => c.status === 'resolved').length },
  ];

  const filteredConversations = conversations.filter((conv) => {
    // text search
    const matchesSearch =
      conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // folder filters
    if (activeFilter === 'open') return conv.status === 'open';
    if (activeFilter === 'pending') return conv.status === 'pending';
    if (activeFilter === 'resolved') return conv.status === 'resolved';
    if (activeFilter === 'assigned_me') return conv.assigneeId === 'agent-1';
    if (activeFilter === 'high_priority') return conv.priority === 'high' || conv.priority === 'urgent';
    if (activeFilter === 'ai_suggested') return !!conv.aiSuggested;

    return true;
  });

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-3 h-3 text-slate-400" />;
      case 'chat':
        return <MessageSquare className="w-3 h-3 text-slate-400" />;
      case 'api':
        return <Code className="w-3 h-3 text-indigo-400" />;
      default:
        return <Layers className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c1220] text-slate-900 dark:text-slate-100 flex flex-col shrink-0 h-full">
      {/* Top Filter & Search Area */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800/80 space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.actions.search}
            className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Scrollable Filter Pills / Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 dark:bg-slate-800/70 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] tabular-nums font-semibold ${
                    isActive ? 'opacity-90' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation List Rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <Filter className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.inbox.noConversations}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = selectedId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`p-3.5 cursor-pointer transition-colors relative group ${
                  isSelected
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/20'
                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div className="absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 w-1 bg-indigo-600 dark:bg-indigo-500" />
                )}

                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={conv.customer.avatarUrl}
                        alt={conv.customer.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-2xs">
                        {getChannelIcon(conv.channel)}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate block">
                        {conv.customer.name}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                        {conv.customer.company}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {conv.aiSuggested && (
                      <span
                        title="AI suggested answer ready"
                        className="text-indigo-600 dark:text-indigo-400 flex items-center"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                      {new Date(conv.updatedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Subject */}
                <h4 className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                  {conv.subject}
                </h4>

                {/* Snippet */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                  {conv.lastMessageSnippet}
                </p>

                {/* Status Badges & Metadata */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={conv.status} />
                    <StatusBadge priority={conv.priority} />
                  </div>

                  {conv.assigneeName && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[100px]">
                      {conv.assigneeName.split(' ')[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

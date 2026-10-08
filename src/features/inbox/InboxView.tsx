import React, { useState, useEffect } from 'react';
import { supportRepository } from '../../services/supportRepository';
import { Conversation, Message } from '../../types/models';
import { ConversationList } from './ConversationList';
import { ConversationDetail } from './ConversationDetail';
import { CustomerContextPanel } from './CustomerContextPanel';
import { useI18n } from '../../lib/i18n/I18nContext';
import { MessageSquare } from 'lucide-react';

interface InboxViewProps {
  initialConversationId?: string;
}

export const InboxView: React.FC<InboxViewProps> = ({ initialConversationId }) => {
  const { t } = useI18n();
  const [conversations, setConversations] = useState<Conversation[]>(
    supportRepository.getConversations()
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    initialConversationId || conversations[0]?.id || null
  );
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(true);

  // Subscribe to changes in the repository
  useEffect(() => {
    const unsubscribe = supportRepository.subscribe(() => {
      setConversations(supportRepository.getConversations());
    });
    return () => unsubscribe();
  }, []);

  const activeConversation = conversations.find((c) => c.id === selectedId) || conversations[0];
  const messages: Message[] = activeConversation
    ? supportRepository.getMessages(activeConversation.id)
    : [];

  return (
    <div className="flex-1 flex h-full overflow-hidden relative">
      {/* 1. Left Conversation List */}
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Middle Conversation Detail */}
      {activeConversation ? (
        <ConversationDetail
          conversation={activeConversation}
          messages={messages}
          isContextPanelOpen={isContextPanelOpen}
          onToggleContextPanel={() => setIsContextPanelOpen(!isContextPanelOpen)}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950/50">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {t.inbox.allFolders}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {t.inbox.selectConversation}
          </p>
        </div>
      )}

      {/* 3. Right Customer & AI Context Panel */}
      {activeConversation && isContextPanelOpen && (
        <div className="hidden lg:block h-full">
          <CustomerContextPanel
            conversation={activeConversation}
            onClose={() => setIsContextPanelOpen(false)}
            onInsertReply={(text) => {
              // When user clicks insert reply from side panel, send directly or insert
              supportRepository.sendMessage(activeConversation.id, text, false);
            }}
          />
        </div>
      )}
    </div>
  );
};

import {
  Customer,
  Conversation,
  Message,
  Ticket,
  KnowledgeArticle,
  TeamMember,
  Integration,
  Invoice,
  NotificationItem,
  ApiKeyItem,
  ConversationStatus,
  PriorityLevel,
} from '../types/models';

/**
 * Contract used by the UI. The bundled mock implementation satisfies this
 * interface today, while a real REST/GraphQL/Supabase implementation can be
 * introduced later without changing feature components.
 */
export interface SupportDataSource {
  subscribe(listener: () => void): () => void;
  getConversations(): Conversation[];
  getConversationById(id: string): Conversation | undefined;
  getMessages(conversationId: string): Message[];
  sendMessage(conversationId: string, content: string, isInternal?: boolean): Message;
  updateConversationStatus(id: string, status: ConversationStatus): void;
  updateConversationPriority(id: string, priority: PriorityLevel): void;
  assignConversation(id: string, memberId: string): void;
  getCustomers(): Customer[];
  getCustomerById(id: string): Customer | undefined;
  getTickets(): Ticket[];
  getArticles(): KnowledgeArticle[];
  getArticleById(id: string): KnowledgeArticle | undefined;
  createArticle(article: Omit<KnowledgeArticle, 'id' | 'views' | 'helpfulCount' | 'unhelpfulCount' | 'updatedAt'>): KnowledgeArticle;
  voteArticleHelpful(id: string, helpful: boolean): void;
  getTeamMembers(): TeamMember[];
  inviteTeamMember(name: string, email: string, role: TeamMember['role']): TeamMember;
  getIntegrations(): Integration[];
  toggleIntegration(id: string): void;
  getInvoices(): Invoice[];
  getNotifications(): NotificationItem[];
  markNotificationRead(id: string): void;
  markAllNotificationsRead(): void;
  getApiKeys(): ApiKeyItem[];
  createApiKey(name: string): ApiKeyItem;
  revokeApiKey(id: string): void;
}

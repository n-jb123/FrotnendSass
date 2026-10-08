import avatarDaniel from '../assets/images/avatar_daniel_brooks_1791441190531.webp';
import avatarKarim from '../assets/images/avatar_karim_haddad_1791441167114.webp';
import avatarMaya from '../assets/images/avatar_maya_chen_1791441155214.webp';
import avatarSofia from '../assets/images/avatar_sofia_martin_1791441179265.webp';
import { SupportDataSource } from './supportDataSource';
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
import {
  mockCustomers,
  mockConversations,
  mockMessages,
  mockTickets,
  mockArticles,
  mockTeamMembers,
  mockIntegrations,
  mockInvoices,
  mockNotifications,
  mockApiKeys,
} from '../mocks/supportData';

class SupportRepository implements SupportDataSource {
  private customers: Customer[] = [...mockCustomers];
  private conversations: Conversation[] = [...mockConversations];
  private messages: Record<string, Message[]> = { ...mockMessages };
  private tickets: Ticket[] = [...mockTickets];
  private articles: KnowledgeArticle[] = [...mockArticles];
  private teamMembers: TeamMember[] = [...mockTeamMembers];
  private integrations: Integration[] = [...mockIntegrations];
  private invoices: Invoice[] = [...mockInvoices];
  private notifications: NotificationItem[] = [...mockNotifications];
  private apiKeys: ApiKeyItem[] = [...mockApiKeys];
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Conversations
  public getConversations(): Conversation[] {
    return [...this.conversations];
  }

  public getConversationById(id: string): Conversation | undefined {
    return this.conversations.find((c) => c.id === id);
  }

  public getMessages(conversationId: string): Message[] {
    return this.messages[conversationId] ? [...this.messages[conversationId]] : [];
  }

  public sendMessage(conversationId: string, content: string, isInternal = false): Message {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderType: 'agent',
      senderId: 'agent-1',
      senderName: 'Alex Mercer',
      senderAvatar: avatarDaniel,
      content,
      createdAt: new Date().toISOString(),
      isInternal,
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMessage);

    const convIndex = this.conversations.findIndex((c) => c.id === conversationId);
    if (convIndex !== -1) {
      this.conversations[convIndex] = {
        ...this.conversations[convIndex],
        lastMessageSnippet: isInternal ? `[Internal Note] ${content.slice(0, 60)}` : content.slice(0, 80),
        updatedAt: new Date().toISOString(),
      };
    }

    this.notify();
    return newMessage;
  }

  public updateConversationStatus(id: string, status: ConversationStatus): void {
    const idx = this.conversations.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.conversations[idx] = {
        ...this.conversations[idx],
        status,
        updatedAt: new Date().toISOString(),
      };
      // also update corresponding ticket if any
      const ticketIdx = this.tickets.findIndex((t) => t.id === `tick-${id.replace('conv-', '')}` || t.customerId === this.conversations[idx].customerId);
      if (ticketIdx !== -1) {
        this.tickets[ticketIdx] = {
          ...this.tickets[ticketIdx],
          status,
          updatedAt: 'Just now',
        };
      }
      this.notify();
    }
  }

  public updateConversationPriority(id: string, priority: PriorityLevel): void {
    const idx = this.conversations.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.conversations[idx] = {
        ...this.conversations[idx],
        priority,
        updatedAt: new Date().toISOString(),
      };
      this.notify();
    }
  }

  public assignConversation(id: string, memberId: string): void {
    const member = this.teamMembers.find((m) => m.id === memberId);
    const idx = this.conversations.findIndex((c) => c.id === id);
    if (idx !== -1 && member) {
      this.conversations[idx] = {
        ...this.conversations[idx],
        assigneeId: member.id,
        assigneeName: member.name,
        assigneeAvatar: member.avatarUrl,
        updatedAt: new Date().toISOString(),
      };
      this.notify();
    }
  }

  // Customers
  public getCustomers(): Customer[] {
    return [...this.customers];
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  // Tickets
  public getTickets(): Ticket[] {
    return [...this.tickets];
  }

  // Knowledge Base
  public getArticles(): KnowledgeArticle[] {
    return [...this.articles];
  }

  public getArticleById(id: string): KnowledgeArticle | undefined {
    return this.articles.find((a) => a.id === id);
  }

  public createArticle(article: Omit<KnowledgeArticle, 'id' | 'views' | 'helpfulCount' | 'unhelpfulCount' | 'updatedAt'>): KnowledgeArticle {
    const newArt: KnowledgeArticle = {
      ...article,
      id: `art-${Date.now()}`,
      views: 1,
      helpfulCount: 0,
      unhelpfulCount: 0,
      updatedAt: 'Today',
    };
    this.articles.unshift(newArt);
    this.notify();
    return newArt;
  }

  public voteArticleHelpful(id: string, helpful: boolean): void {
    const idx = this.articles.findIndex((a) => a.id === id);
    if (idx !== -1) {
      if (helpful) {
        this.articles[idx].helpfulCount += 1;
      } else {
        this.articles[idx].unhelpfulCount += 1;
      }
      this.notify();
    }
  }

  // Team
  public getTeamMembers(): TeamMember[] {
    return [...this.teamMembers];
  }

  public inviteTeamMember(name: string, email: string, role: TeamMember['role']): TeamMember {
    const newMember: TeamMember = {
      id: `agent-${Date.now()}`,
      name,
      email,
      avatarUrl: avatarMaya,
      role,
      status: 'active',
      activeConversations: 0,
      resolvedToday: 0,
      lastActive: 'Invited just now',
    };
    this.teamMembers.push(newMember);
    this.notify();
    return newMember;
  }

  // Integrations
  public getIntegrations(): Integration[] {
    return [...this.integrations];
  }

  public toggleIntegration(id: string): void {
    const idx = this.integrations.findIndex((i) => i.id === id);
    if (idx !== -1) {
      this.integrations[idx] = {
        ...this.integrations[idx],
        isConnected: !this.integrations[idx].isConnected,
        lastSynced: this.integrations[idx].isConnected ? undefined : 'Just now',
      };
      this.notify();
    }
  }

  // Invoices & Billing
  public getInvoices(): Invoice[] {
    return [...this.invoices];
  }

  // Notifications
  public getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  public markNotificationRead(id: string): void {
    const idx = this.notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      this.notifications[idx].read = true;
      this.notify();
    }
  }

  public markAllNotificationsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
    this.notify();
  }

  // API Keys
  public getApiKeys(): ApiKeyItem[] {
    return [...this.apiKeys];
  }

  public createApiKey(name: string): ApiKeyItem {
    const rawRand = Math.random().toString(36).substring(2, 10);
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name,
      prefix: `sf_live_${rawRand}...8a`,
      createdAt: 'Just now',
      lastUsed: 'Never',
      status: 'active',
    };
    this.apiKeys.unshift(newKey);
    this.notify();
    return newKey;
  }

  public revokeApiKey(id: string): void {
    const idx = this.apiKeys.findIndex((k) => k.id === id);
    if (idx !== -1) {
      this.apiKeys[idx] = { ...this.apiKeys[idx], status: 'revoked' };
      this.notify();
    }
  }
}

export const supportRepository = new SupportRepository();

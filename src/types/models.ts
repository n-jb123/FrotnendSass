export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';
export type Theme = 'light' | 'dark';

export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type ChannelType = 'email' | 'chat' | 'web' | 'api' | 'whatsapp';
export type SentimentType = 'positive' | 'neutral' | 'frustrated' | 'angry';
export type SenderType = 'customer' | 'agent' | 'ai' | 'system';

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  company: string;
  role?: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  status: 'active' | 'inactive' | 'at-risk';
  tags: string[];
  ltv: string;
  timezone: string;
  location: string;
  createdAt: string;
  lastActivityAt: string;
  phone?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: SenderType;
  senderId?: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  isInternal?: boolean;
  attachments?: Attachment[];
  aiMetadata?: {
    model?: string;
    confidence?: number;
    tokensUsed?: number;
    explanation?: string;
  };
}

export interface AIInsight {
  id: string;
  conversationId?: string;
  type: 'summary' | 'sentiment' | 'intent' | 'suggestion' | 'trend';
  title: string;
  content: string;
  confidence?: number;
  sentiment?: SentimentType;
  suggestedAction?: string;
  suggestedReply?: string;
  suggestedArticleId?: string;
  suggestedArticleTitle?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  customer: Customer;
  subject: string;
  status: ConversationStatus;
  priority: PriorityLevel;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  channel: ChannelType;
  tags: string[];
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  lastMessageSnippet: string;
  aiSuggested?: boolean;
  sentiment: SentimentType;
  aiInsight?: AIInsight;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  status: ConversationStatus;
  priority: PriorityLevel;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  category: 'Billing' | 'API & Integration' | 'Security & SSO' | 'Account' | 'Bug Report';
  createdAt: string;
  updatedAt: string;
  slaDue: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  helpfulCount: number;
  unhelpfulCount: number;
  content: string;
  excerpt: string;
  updatedAt: string;
  authorName: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'Owner' | 'Admin' | 'Supervisor' | 'Agent' | 'Analyst';
  status: 'active' | 'offline' | 'away';
  activeConversations: number;
  resolvedToday: number;
  lastActive: string;
}

export interface Integration {
  id: string;
  name: string;
  category: 'Communication' | 'CRM' | 'E-commerce' | 'Payments' | 'Developer';
  description: string;
  iconName: string;
  isConnected: boolean;
  lastSynced?: string;
  eventCount?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'assignment' | 'sla_warning' | 'ai_resolution' | 'customer_escalation' | 'system';
  timestamp: string;
  read: boolean;
  linkConversationId?: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

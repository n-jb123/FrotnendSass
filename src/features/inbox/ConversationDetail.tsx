import avatarDaniel from '../../assets/images/avatar_daniel_brooks_1791441190531.webp';
import React, { useState, useRef, useEffect } from 'react';
import {
  Conversation,
  Message,
  ConversationStatus,
  PriorityLevel,
} from '../../types/models';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../lib/i18n/I18nContext';
import { useToast } from '../../components/ui/Toast';
import { FileUpload } from '../../components/ui/FileUpload';
import { supportRepository } from '../../services/supportRepository';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  Send,
  Bookmark,
  ChevronDown,
  RotateCcw,
  Languages,
  User,
  SlidersHorizontal,
} from 'lucide-react';

interface ConversationDetailProps {
  conversation: Conversation;
  messages: Message[];
  onToggleContextPanel: () => void;
  isContextPanelOpen: boolean;
}

export const ConversationDetail: React.FC<ConversationDetailProps> = ({
  conversation,
  messages,
  onToggleContextPanel,
  isContextPanelOpen,
}) => {
  const { t, language } = useI18n();
  const { showToast } = useToast();

  const [composerMode, setComposerMode] = useState<'reply' | 'note'>('reply');
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSavedReplies, setShowSavedReplies] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStatusChange = (status: ConversationStatus) => {
    supportRepository.updateConversationStatus(conversation.id, status);
    showToast(`Conversation marked as ${status}`);
  };

  const handlePriorityChange = (priority: PriorityLevel) => {
    supportRepository.updateConversationPriority(conversation.id, priority);
    showToast(`Priority updated to ${priority}`);
  };

  const handleAssigneeChange = (memberId: string) => {
    supportRepository.assignConversation(conversation.id, memberId);
    showToast(`Conversation reassigned`);
  };

  const handleQuickResolve = () => {
    const newStatus = conversation.status === 'resolved' ? 'open' : 'resolved';
    supportRepository.updateConversationStatus(conversation.id, newStatus);
    showToast(newStatus === 'resolved' ? 'Conversation resolved successfully' : 'Conversation reopened');
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      supportRepository.sendMessage(conversation.id, replyText, composerMode === 'note');
      showToast(
        composerMode === 'note'
          ? (language === 'ar' ? 'تمت إضافة ملاحظة داخلية' : 'Internal note added')
          : (language === 'ar' ? 'تم إرسال الرد إلى العميل' : 'Reply sent to customer')
      );
      setReplyText('');
      setIsSubmitting(false);
    }, 250);
  };

  const handleInsertAiSuggestion = () => {
    if (conversation.aiInsight?.suggestedReply) {
      setReplyText(conversation.aiInsight.suggestedReply);
      setComposerMode('reply');
      showToast(language === 'ar' ? 'تم إدراج الرد المقترح بالذكاء الاصطناعي' : 'AI suggested response inserted into editor');
    }
  };

  const handleApplySavedReply = (text: string) => {
    setReplyText(text);
    setShowSavedReplies(false);
    showToast(language === 'ar' ? 'تم تطبيق قالب الرد الجاهز' : 'Saved reply template applied');
  };

  const handleApplyAiTransformation = (type: 'friendly' | 'short' | 'formal' | 'translate') => {
    if (!replyText.trim() && conversation.aiInsight?.suggestedReply) {
      setReplyText(conversation.aiInsight.suggestedReply);
    }
    const current = replyText.trim() || conversation.aiInsight?.suggestedReply || '';

    if (type === 'friendly') {
      if (language === 'ar') {
        setReplyText(`مرحباً ${conversation.customer.name}،\n\nأتمنى لك يوماً رائعاً! ${current}\n\nيرجى إعلامنا إذا كان هناك أي استفسار آخر يسعدنا مساعدتك به! أطيب التحيات.`);
        showToast('تم تعديل النبرة إلى ودودة ولطيفة');
      } else {
        setReplyText(`Hi ${conversation.customer.name},\n\nHope you're having a wonderful week! ${current}\n\nPlease let me know if there's anything else I can assist with! Warm regards.`);
        showToast('Adjusted tone to friendly');
      }
    } else if (type === 'short') {
      if (language === 'ar') {
        setReplyText(`مرحباً ${conversation.customer.name}، تم فحص المشكلة: ${current.split('\n')[0] || current} وتم تطبيق التحديثات. أخبرنا إذا احتجت مساعدة إضافية.`);
        showToast('تم تلخيص الرد بإيجاز');
      } else {
        setReplyText(`Hi ${conversation.customer.name}, we investigated the issue: ${current.split('\n')[0] || current} Changes applied. Let us know if you need more help.`);
        showToast('Summarized into concise response');
      }
    } else if (type === 'formal') {
      if (language === 'ar') {
        setReplyText(`السيد/ة المحترم/ة ${conversation.customer.name}،\n\nنشكر تواصلكم مع دعم المنصة المتقدم. بخصوص طلبكم: ${current}\n\nوتفضلوا بقبول فائق الاحترام والتقدير،\nفريق العمليات التقنية`);
        showToast('تم تحويل النبرة إلى رسمية للمؤسسات');
      } else {
        setReplyText(`Dear ${conversation.customer.name},\n\nThank you for contacting SupportFlow Enterprise Support. Regarding your ticket: ${current}\n\nSincerely,\nTechnical Operations Team`);
        showToast('Adjusted tone to formal enterprise');
      }
    } else if (type === 'translate') {
      if (language === 'ar') {
        setReplyText(`مرحباً ${conversation.customer.name}، لقد قمنا بمراجعة مشكلتك وتطبيق الحل المطلوب على خوادمك بنجاح.`);
        showToast('تمت ترجمة الرد إلى العربية');
      } else {
        setReplyText(`Hello ${conversation.customer.name}, we have reviewed your request and applied the necessary adjustments.`);
        showToast('Translation applied');
      }
    }
    setShowAiMenu(false);
  };

  const teamMembers = supportRepository.getTeamMembers();

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#090d16] min-w-0 overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Header Bar */}
      <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c1220] flex items-center justify-between shrink-0 gap-3">
        {/* Left: Customer Info & Subject */}
        <div className="min-w-0 flex items-center gap-3">
          <img
            src={conversation.customer.avatarUrl}
            alt={conversation.customer.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {conversation.customer.name}
              </h2>
              <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {conversation.customer.company}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5 font-medium">
              {conversation.subject}
            </p>
          </div>
        </div>

        {/* Right: Actions, Dropdowns, Quick Resolve */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Status Dropdown */}
          <select
            value={conversation.status}
            onChange={(e) => handleStatusChange(e.target.value as ConversationStatus)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="open">{t.status.open}</option>
            <option value="pending">{t.status.pending}</option>
            <option value="resolved">{t.status.resolved}</option>
            <option value="closed">{t.status.closed}</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={conversation.priority}
            onChange={(e) => handlePriorityChange(e.target.value as PriorityLevel)}
            className="hidden sm:block text-xs font-medium bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="low">{language === 'ar' ? 'أولوية منخفضة' : 'Low Priority'}</option>
            <option value="medium">{language === 'ar' ? 'أولوية متوسطة' : 'Medium Priority'}</option>
            <option value="high">{language === 'ar' ? 'أولوية مرتفعة' : 'High Priority'}</option>
            <option value="urgent">{language === 'ar' ? 'أولوية عاجلة' : 'Urgent'}</option>
          </select>

          {/* Assignee Dropdown */}
          <select
            value={conversation.assigneeId || ''}
            onChange={(e) => handleAssigneeChange(e.target.value)}
            className="hidden md:block text-xs font-medium bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {teamMembers.map((member) => {
              const roleArabic: Record<string, string> = {
                Owner: 'المالك',
                Admin: 'مسؤول',
                Supervisor: 'مشرف',
                Agent: 'وكيل دعم',
                Analyst: 'محلل',
              };
              const displayedRole = language === 'ar' ? (roleArabic[member.role] || member.role) : member.role;
              return (
                <option key={member.id} value={member.id}>
                  {member.name} ({displayedRole})
                </option>
              );
            })}
          </select>

          {/* Resolve / Reopen Button */}
          <Button
            variant={conversation.status === 'resolved' ? 'outline' : 'primary'}
            size="sm"
            onClick={handleQuickResolve}
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            {conversation.status === 'resolved' ? t.actions.reopen : t.actions.resolve}
          </Button>

          {/* Toggle Right Context Drawer */}
          <Button
            variant={isContextPanelOpen ? 'secondary' : 'outline'}
            size="sm"
            onClick={onToggleContextPanel}
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          >
            <span className="hidden xl:inline">{t.inbox.customerContext}</span>
          </Button>
        </div>
      </div>

      {/* Message Timeline */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => {
          if (msg.isInternal) {
            return (
              <div
                key={msg.id}
                className="max-w-2xl mx-auto p-3.5 rounded-lg bg-amber-500/10 border border-amber-600/30 text-amber-950 dark:text-amber-200 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{t.inbox.internalNoteMode}</span>
                    <span className="text-[11px] font-normal text-amber-800/80 dark:text-amber-400">
                      by {msg.senderName}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800/70 dark:text-amber-400 tabular-nums">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            );
          }

          const isCustomer = msg.senderType === 'customer';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${
                isCustomer ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              <img
                src={msg.senderAvatar || (isCustomer ? conversation.customer.avatarUrl : avatarDaniel)}
                alt={msg.senderName}
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 mt-1"
              />

              <div
                className={`rounded-xl p-4 shadow-xs text-xs space-y-1.5 ${
                  isCustomer
                    ? 'bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                <div
                  className={`flex items-center justify-between gap-4 text-[11px] pb-1 border-b ${
                    isCustomer
                      ? 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      : 'border-indigo-500/50 text-indigo-100'
                  }`}
                >
                  <span className="font-semibold">{msg.senderName}</span>
                  <span className="tabular-nums">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          );
        })}

        {/* AI Suggested Response Banner in Stream */}
        {conversation.aiInsight?.suggestedReply && (
          <div className="max-w-2xl mx-auto p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/30 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t.inbox.suggestedReplyTitle}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono">
                  {conversation.aiInsight.confidence}% {language === 'ar' ? 'تطابق' : 'match'}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleInsertAiSuggestion}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                {t.actions.insertReply}
              </Button>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
              {conversation.aiInsight.suggestedReply}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
              <span>{t.inbox.explainabilityLabel}</span>
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="p-3 md:p-4 bg-white dark:bg-[#0c1220] border-t border-slate-200 dark:border-slate-800/80 shrink-0">
        {/* Composer Mode Tabs & Quick Actions */}
        <div className="flex items-center justify-between mb-2 gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-xs font-medium">
            <button
              onClick={() => setComposerMode('reply')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                composerMode === 'reply'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.inbox.publicReplyMode}
            </button>
            <button
              onClick={() => setComposerMode('note')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                composerMode === 'note'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>{t.inbox.internalNoteMode}</span>
            </button>
          </div>

          {/* AI Tools & Canned Replies Buttons */}
          <div className="flex items-center gap-1.5 relative">
            {/* Canned Replies */}
            <div className="relative">
              <button
                onClick={() => setShowSavedReplies(!showSavedReplies)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
              >
                <Bookmark className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                <span className="hidden sm:inline">{t.inbox.cannedReplies}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showSavedReplies && (
                <div className="absolute right-0 bottom-full mb-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 block">
                    {t.inbox.cannedReplies}
                  </span>
                  <button
                    onClick={() =>
                      handleApplySavedReply(
                        language === 'ar'
                          ? `مرحباً ${conversation.customer.name}،\n\nشكراً لتواصلك معنا! لقد استلمنا تذكرتك بخصوص "${conversation.subject}" وفريقنا يراجع بيانات حسابك بنشاط.`
                          : `Hi ${conversation.customer.name},\n\nThank you for reaching out! We received your ticket regarding "${conversation.subject}" and our team is actively reviewing your account telemetry.`
                      )
                    }
                    className="w-full text-left rtl:text-right px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  >
                    {t.inbox.savedReplies.greeting}
                  </button>
                  <button
                    onClick={() =>
                      handleApplySavedReply(
                        language === 'ar'
                          ? `مرحباً ${conversation.customer.name}،\n\nفريق العمليات الهندسية لدينا قام بإعادة محاكاة السلوك على نظامك. نقوم حالياً بتطبيق التحديث وسنوافيك بالنتائج خلال أقل من 30 دقيقة.`
                          : `Hi ${conversation.customer.name},\n\nOur engineering operations team has reproduced the behavior on your cluster. We are applying a hotfix and will update you in under 30 minutes.`
                      )
                    }
                    className="w-full text-left rtl:text-right px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  >
                    {t.inbox.savedReplies.investigating}
                  </button>
                  <button
                    onClick={() =>
                      handleApplySavedReply(
                        language === 'ar'
                          ? `مرحباً ${conversation.customer.name}،\n\nلقد تحققنا من أن المشكلة تم حلها بالكامل على نظامك. يرجى التحقق من جانبك ولا تتردد في مراسلتنا إذا واجهت أي استفسار آخر.`
                          : `Hi ${conversation.customer.name},\n\nWe have verified that the issue is fully resolved on your cluster. Please verify on your side and feel free to reach back out if anything else comes up.`
                      )
                    }
                    className="w-full text-left rtl:text-right px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  >
                    {t.inbox.savedReplies.resolvedMessage}
                  </button>
                </div>
              )}
            </div>

            {/* AI Assist Menu */}
            <div className="relative">
              <button
                onClick={() => setShowAiMenu(!showAiMenu)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-md border border-indigo-200 dark:border-indigo-800/80 transition-colors font-medium cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>{t.inbox.aiAssistButton}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showAiMenu && (
                <div className="absolute right-0 bottom-full mb-1.5 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 block">
                    {language === 'ar' ? 'أدوات الصياغة بالذكاء الاصطناعي' : 'AI Rewrite Tools'}
                  </span>
                  <button
                    onClick={() => handleApplyAiTransformation('friendly')}
                    className="w-full text-left rtl:text-right px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{t.inbox.toneFriendly}</span>
                  </button>
                  <button
                    onClick={() => handleApplyAiTransformation('short')}
                    className="w-full text-left rtl:text-right px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{t.inbox.toneShort}</span>
                  </button>
                  <button
                    onClick={() => handleApplyAiTransformation('formal')}
                    className="w-full text-left rtl:text-right px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{t.inbox.toneFormal}</span>
                  </button>
                  <button
                    onClick={() => handleApplyAiTransformation('translate')}
                    className="w-full text-left rtl:text-right px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-2 cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{language === 'ar' ? t.inbox.translateToAr : t.inbox.translateToEn}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div
          className={`rounded-lg border p-2.5 transition-all ${
            composerMode === 'note'
              ? 'border-amber-400/80 bg-amber-50/40 dark:bg-amber-950/20'
              : 'border-slate-200 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-900/80 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500'
          }`}
        >
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={composerMode === 'note' ? t.inbox.placeholderNote : t.inbox.placeholderReply}
            rows={3}
            className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 mt-1">
            <FileUpload
              value={attachments}
              onChange={setAttachments}
              maxFiles={5}
              maxSizeMb={10}
              label={language === 'ar' ? 'إرفاق ملفات' : 'Attach files'}
            />

            <Button
              variant={composerMode === 'note' ? 'danger' : 'primary'}
              size="sm"
              onClick={handleSend}
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              {composerMode === 'note' ? t.actions.sendInternalNote : t.actions.send}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { TeamMember } from '../../types/models';
import { supportRepository } from '../../services/supportRepository';
import { useI18n } from '../../lib/i18n/I18nContext';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { useToast } from '../../components/ui/Toast';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  Check,
  X,
  Clock,
  MoreVertical,
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { t, language } = useI18n();
  const { showToast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>(supportRepository.getTeamMembers());
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'members' | 'roles'>('members');

  // Invite Form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Agent');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    supportRepository.inviteTeamMember(inviteName, inviteEmail, inviteRole);
    setMembers(supportRepository.getTeamMembers());
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    showToast(language === 'ar' ? `تم إرسال الدعوة إلى ${inviteEmail}` : `Invitation sent to ${inviteEmail}`);
  };

  const roleArabic: Record<string, string> = {
    Owner: 'المالك',
    Admin: 'مسؤول',
    Supervisor: 'مشرف',
    Agent: 'وكيل دعم',
    Analyst: 'محلل',
  };

  const permissionsMatrix = [
    {
      resource: language === 'ar' ? 'صندوق الوارد الموحد والردود' : 'Unified Inbox & Replies',
      owner: true, admin: true, supervisor: true, agent: true, analyst: false
    },
    {
      resource: language === 'ar' ? 'حل وإغلاق تذاكر الدعم' : 'Resolve & Close Tickets',
      owner: true, admin: true, supervisor: true, agent: true, analyst: false
    },
    {
      resource: language === 'ar' ? 'دليل العملاء وبيانات القيمة التراكمية' : 'Customer Directory & LTV Data',
      owner: true, admin: true, supervisor: true, agent: true, analyst: true
    },
    {
      resource: language === 'ar' ? 'نشر مقالات قاعدة المعرفة' : 'Knowledge Base Publishing',
      owner: true, admin: true, supervisor: true, agent: false, analyst: false
    },
    {
      resource: language === 'ar' ? 'ضبط مساعد الذكاء الاصطناعي والرؤى' : 'AI Copilot Tuning & Insights',
      owner: true, admin: true, supervisor: true, agent: false, analyst: true
    },
    {
      resource: language === 'ar' ? 'إدارة الفوترة وترقية الخطط' : 'Billing & Plan Upgrades',
      owner: true, admin: true, supervisor: false, agent: false, analyst: false
    },
    {
      resource: language === 'ar' ? 'مفاتيح API وإعدادات Webhook' : 'API Keys & Webhooks Config',
      owner: true, admin: true, supervisor: false, agent: false, analyst: false
    },
    {
      resource: language === 'ar' ? 'دعوة وإدارة أدوار الفريق' : 'Invite & Manage Team Roles',
      owner: true, admin: true, supervisor: false, agent: false, analyst: false
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.team.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.team.subtitle}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsInviteModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          {t.actions.inviteMember}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          {t.team.members} ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'roles'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          {t.team.roles}
        </button>
      </div>

      {/* Tab 1: Team Members Directory */}
      {activeTab === 'members' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">{language === 'ar' ? 'العضو' : 'Member'}</th>
                  <th className="px-4 py-3">{language === 'ar' ? 'الدور' : 'Role'}</th>
                  <th className="px-4 py-3">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3">{t.team.assignedConversations}</th>
                  <th className="px-4 py-3">{language === 'ar' ? 'تم حلها اليوم' : 'Resolved Today'}</th>
                  <th className="px-4 py-3">{t.team.lastActive}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                            {member.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {language === 'ar' ? (roleArabic[member.role] || member.role) : member.role}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{language === 'ar' ? 'نشط' : 'Active'}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-bold tabular-nums">
                      {member.activeConversations}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {member.resolvedToday}
                    </td>

                    <td className="px-4 py-3.5 text-slate-500 tabular-nums">
                      {member.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Permissions Matrix */}
      {activeTab === 'roles' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">{language === 'ar' ? 'المورد والصلاحية' : 'Resource & Capability'}</th>
                  <th className="px-4 py-3 text-center">{language === 'ar' ? 'المالك' : 'Owner'}</th>
                  <th className="px-4 py-3 text-center">{language === 'ar' ? 'مسؤول' : 'Admin'}</th>
                  <th className="px-4 py-3 text-center">{language === 'ar' ? 'مشرف' : 'Supervisor'}</th>
                  <th className="px-4 py-3 text-center">{language === 'ar' ? 'وكيل دعم' : 'Agent'}</th>
                  <th className="px-4 py-3 text-center">{language === 'ar' ? 'محلل' : 'Analyst'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {permissionsMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {row.resource}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.supervisor ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.agent ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.analyst ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Member Dialog */}
      <Dialog
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title={t.team.inviteTitle}
        description={language === 'ar' ? 'إضافة عضو جديد إلى مساحة عمليات الدعم الخاصة بك' : 'Add a team member to your support operations workspace'}
      >
        <form onSubmit={handleInvite} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
            </label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: جوردان لي' : 'e.g. Jordan Lee'}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.team.inviteEmail}
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="jordan.lee@company.com"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.team.inviteRole}
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="Agent">{language === 'ar' ? 'وكيل دعم (ردود العملاء والتذاكر)' : 'Agent (Customer Replies & Tickets)'}</option>
              <option value="Supervisor">{language === 'ar' ? 'مشرف (التصعيدات والردود الجاهزة)' : 'Supervisor (Escalations & Macros)'}</option>
              <option value="Admin">{language === 'ar' ? 'مسؤول (إدارة العمليات بالكامل)' : 'Admin (Full Operations Management)'}</option>
              <option value="Analyst">{language === 'ar' ? 'محلل (التحليلات والرؤى فقط)' : 'Analyst (Analytics & Insights Only)'}</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
              {t.actions.cancel}
            </Button>
            <Button variant="primary" type="submit">
              {t.team.sendInvite}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

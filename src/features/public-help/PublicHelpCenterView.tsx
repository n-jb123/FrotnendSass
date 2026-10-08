import React, { useState } from 'react';
import { supportRepository } from '../../services/supportRepository';
import { useI18n } from '../../lib/i18n/I18nContext';
import {
  Search,
  BookOpen,
  Headphones,
  ArrowRight,
  Shield,
  CreditCard,
  Code,
  ThumbsUp,
  X,
} from 'lucide-react';
import { KnowledgeArticle } from '../../types/models';

export const PublicHelpCenterView: React.FC<{ onBackToApp: () => void }> = ({ onBackToApp }) => {
  const { t, direction, language } = useI18n();
  const articles = supportRepository.getArticles();
  const [search, setSearch] = useState('');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Banner */}
      <div className="bg-indigo-600 text-white px-4 py-12 text-center relative">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مركز مساعدة عملاء SupportFlow' : 'SupportFlow Customer Help Center'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'ar' ? 'كيف يمكننا مساعدتك اليوم؟' : 'How can we help you today?'}
          </h1>

          <div className="relative max-w-xl mx-auto mt-4">
            <Search className="w-5 h-5 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث في الأدلة ومواصفات API وإجابات الفواتير...' : 'Search guides, API specs, and billing answers...'}
              className="w-full pl-11 pr-4 rtl:pr-11 rtl:pl-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Quick Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
            <Code className="w-6 h-6 text-indigo-600" />
            <h3 className="text-sm font-bold">{language === 'ar' ? 'واجهات API والمطورين' : 'API & Developers'}</h3>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'إشعارات الويب، والتحقق من توقيعات HMAC، ودليل إدارة ضغط معدل الطلبات.'
                : 'Webhooks, HMAC signature verification, and burst rate-limiting guides.'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
            <Shield className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm font-bold">{language === 'ar' ? 'الأمان وتسجيل الدخول الموحد' : 'Security & Single Sign-On'}</h3>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'إعداد Okta وAzure AD SAML، وتدوير الشهادات، ومزامنة SCIM والمصادقة الثنائية.'
                : 'Okta, Azure AD SAML certificate rotation, SCIM, and 2FA configuration.'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <h3 className="text-sm font-bold">{language === 'ar' ? 'الفوترة والاشتراكات' : 'Billing & Invoicing'}</h3>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'إعفاءات ضريبة الاتحاد الأوروبي VIES، وترقية الباقات، وتنزيل الإيصالات الضريبية.'
                : 'EU VIES reverse charge VAT exemptions, plan expansions, and receipt downloads.'}
            </p>
          </div>
        </div>

        {/* Featured Documentation Articles */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {search
              ? (language === 'ar' ? `نتائج البحث (${filtered.length})` : `Search Results (${filtered.length})`)
              : (language === 'ar' ? 'أدلة الدعم الأكثر قراءة' : 'Popular Support Guides')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {art.category}
                  </span>
                  <span className="text-slate-400">{art.views} {language === 'ar' ? 'قراءة' : 'reads'}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {art.excerpt}
                </p>
                <div className="pt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span>{language === 'ar' ? 'قراءة الدليل كاملاً' : 'Read full guide'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setActiveArticle(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-indigo-600">{activeArticle.category}</span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {activeArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap space-y-2">
              {activeArticle.content}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span>{language === 'ar' ? `المؤلف: ${activeArticle.authorName}` : `Author: ${activeArticle.authorName}`}</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold cursor-pointer"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

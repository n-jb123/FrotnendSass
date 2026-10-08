import React, { useState } from 'react';
import { KnowledgeArticle } from '../../types/models';
import { supportRepository } from '../../services/supportRepository';
import { useI18n } from '../../lib/i18n/I18nContext';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { useToast } from '../../components/ui/Toast';
import {
  BookOpen,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Plus,
  FileText,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { t, language } = useI18n();
  const { showToast } = useToast();
  const [articles, setArticles] = useState<KnowledgeArticle[]>(supportRepository.getArticles());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingArticle, setReadingArticle] = useState<KnowledgeArticle | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Article Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('API & Developer');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      art.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'API & Developer', 'Security & SSO', 'Billing & Account'];

  const getCategoryLabel = (cat: string) => {
    if (cat === 'all') return language === 'ar' ? 'جميع التصنيفات' : 'All Categories';
    if (cat === 'API & Developer') return language === 'ar' ? 'واجهات API والمطورين' : 'API & Developer';
    if (cat === 'Security & SSO') return language === 'ar' ? 'الأمان وتسجيل الدخول الموحد' : 'Security & SSO';
    if (cat === 'Billing & Account') return language === 'ar' ? 'الاشتراكات والفوترة' : 'Billing & Account';
    return cat;
  };

  const handleVote = (id: string, helpful: boolean) => {
    supportRepository.voteArticleHelpful(id, helpful);
    setArticles(supportRepository.getArticles());
    showToast(
      helpful
        ? (language === 'ar' ? 'شكراً لك! تم تسجيل تصويتك' : 'Thank you! Vote recorded')
        : (language === 'ar' ? 'تم تدوين الملاحظة للمراجعة التقنية' : 'Feedback noted for technical review')
    );
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    supportRepository.createArticle({
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newCategory,
      status: 'published',
      excerpt: newExcerpt || newContent.slice(0, 120),
      content: newContent,
      authorName: 'Alex Mercer',
    });

    setArticles(supportRepository.getArticles());
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewExcerpt('');
    setNewContent('');
    showToast(language === 'ar' ? 'تم نشر مقال قاعدة المعرفة بنجاح' : 'Knowledge base article published');
  };

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalHelpful = articles.reduce((sum, a) => sum + a.helpfulCount, 0);
  const totalVotes = articles.reduce((sum, a) => sum + a.helpfulCount + a.unhelpfulCount, 0);
  const helpfulRate = totalVotes > 0 ? Math.round((totalHelpful / totalVotes) * 100) : 98;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.kb.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.kb.subtitle}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {t.actions.createArticle}
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">{t.kb.articlesCount}</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {articles.length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {language === 'ar' ? '100% نشط وقابل للبحث الفوري' : '100% active and searchable'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">{t.kb.totalViews}</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'ar' ? '+18% زيادة الخدمة الذاتية' : '+18% customer self-service'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">{t.kb.helpfulRate}</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {helpfulRate}%
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {language === 'ar' ? 'مؤشر رضا متقدم' : 'High satisfaction benchmark'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.kb.searchArticles}
            className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  {getCategoryLabel(art.category)}
                </span>
                <span className="text-[11px] text-slate-400 tabular-nums flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{art.views} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
                </span>
              </div>

              <h3
                onClick={() => setReadingArticle(art)}
                className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
              >
                {art.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                {art.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <span className="text-slate-400 text-[11px]">
                {language === 'ar' ? `تم التحديث ${art.updatedAt}` : `Updated ${art.updatedAt}`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote(art.id, true)}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-600 cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{art.helpfulCount}</span>
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setReadingArticle(art)}
                >
                  {language === 'ar' ? 'قراءة المقال' : 'Read Article'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {readingArticle && (
        <Dialog
          isOpen={!!readingArticle}
          onClose={() => setReadingArticle(null)}
          title={readingArticle.title}
          description={`Category: ${readingArticle.category} · Author: ${readingArticle.authorName}`}
          maxWidth="lg"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed space-y-3">
              {readingArticle.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('# ')) {
                  return <h2 key={idx} className="text-base font-bold text-slate-900 dark:text-slate-100">{paragraph.replace('# ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={idx} className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('```')) {
                  return (
                    <pre key={idx} className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto font-mono text-[11px]">
                      {paragraph.replace(/```[a-z]*/g, '')}
                    </pre>
                  );
                }
                return <p key={idx} className="text-slate-700 dark:text-slate-300">{paragraph}</p>;
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {language === 'ar' ? 'هل كان هذا الدليل مفيداً؟' : 'Was this guide helpful?'}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleVote(readingArticle.id, true)}
                  leftIcon={<ThumbsUp className="w-3 h-3 text-emerald-500" />}
                >
                  {language === 'ar' ? 'مفيد' : 'Helpful'} ({readingArticle.helpfulCount})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleVote(readingArticle.id, false)}
                  leftIcon={<ThumbsDown className="w-3 h-3 text-rose-500" />}
                >
                  {language === 'ar' ? 'غير مفيد' : 'Not Helpful'} ({readingArticle.unhelpfulCount})
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Create Article Dialog */}
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t.actions.createArticle}
        description={language === 'ar' ? 'نشر مقال إرشادي جديد لتغذية الخدمة الذاتية وإجابات الذكاء الاصطناعي' : 'Publish a new knowledge base document for self-service and AI answers'}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateArticle} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'عنوان المقال' : 'Article Title'}
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: إعداد مزامنة دليل SCIM' : 'e.g. Setting up SCIM Directory Sync'}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'التصنيف' : 'Category'}
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="API & Developer">{language === 'ar' ? 'واجهات API والمطورين' : 'API & Developer'}</option>
                <option value="Security & SSO">{language === 'ar' ? 'الأمان وتسجيل الدخول الموحد' : 'Security & SSO'}</option>
                <option value="Billing & Account">{language === 'ar' ? 'الاشتراكات والفوترة' : 'Billing & Account'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'ملخص موجز' : 'Short Summary'}
              </label>
              <input
                type="text"
                value={newExcerpt}
                onChange={(e) => setNewExcerpt(e.target.value)}
                placeholder={language === 'ar' ? 'ملخص موجز لمعاينة البحث...' : 'Brief summary for search preview...'}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'المحتوى (ماركداون أو نص عادي)' : 'Content (Markdown / Plain Text)'}
            </label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={8}
              placeholder={language === 'ar' ? '# عنوان فرعي للمقال\n\nاكتب الخطوات والإرشادات هنا بالتفصيل...' : '# Article Heading\n\nWrite the guide steps and instructions...'}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono resize-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              {t.actions.cancel}
            </Button>
            <Button variant="primary" type="submit">
              {t.kb.editor.publish}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

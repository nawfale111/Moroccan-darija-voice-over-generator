import React, { useState } from 'react';
import {
  Wand2,
  FileText,
  Clock,
  Sparkles,
  Check,
  Languages,
  BookOpen,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { MARKETING_TEMPLATES, ScriptTemplate } from '../data/templates';

interface ScriptEditorProps {
  script: string;
  setScript: (val: string) => void;
  language: 'moroccan_darija' | 'modern_standard_arabic';
  setLanguage: (lang: 'moroccan_darija' | 'modern_standard_arabic') => void;
  rate: number;
  onApplyTemplate: (template: ScriptTemplate) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  setScript,
  language,
  setLanguage,
  rate,
  onApplyTemplate,
}) => {
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedResult, setPolishedResult] = useState<any>(null);
  const [showPolishedModal, setShowPolishedModal] = useState(false);

  // Calculate statistics
  const trimmed = script.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = script.length;
  // Average Arabic speech speed: ~130 words per minute at 1.0x rate
  const estimatedSeconds = wordCount > 0 ? Math.round((wordCount / (130 * rate)) * 60) : 0;

  // Insert helper tags into textarea
  const insertTag = (tag: string) => {
    setScript(script ? `${script} ${tag} ` : `${tag} `);
  };

  // Trigger AI Polish
  const handlePolishScript = async () => {
    if (!script.trim()) return;
    try {
      setIsPolishing(true);
      const res = await fetch('/api/voiceover/polish-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          targetLanguage: language,
          tone: 'sales_driven',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPolishedResult(data.data);
        setShowPolishedModal(true);
      }
    } catch (err) {
      console.error('Error polishing script:', err);
    } finally {
      setIsPolishing(false);
    }
  };

  const filteredTemplates = MARKETING_TEMPLATES.filter((tpl) => {
    const matchesLang = tpl.language === language;
    const matchesCat = selectedCategory === 'all' || tpl.category === selectedCategory;
    return matchesLang && matchesCat;
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Top Bar: Language & Templates */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Language Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setLanguage('moroccan_darija')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              language === 'moroccan_darija'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🇲🇦 الدارجة المغربية (Darija)</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('modern_standard_arabic')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              language === 'modern_standard_arabic'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌐 العربية الفصحى (Arabic)</span>
          </button>
        </div>

        {/* Quick Template Picker button */}
        <button
          type="button"
          onClick={() => setShowTemplatesModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Marketing Templates</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
            {filteredTemplates.length}
          </span>
        </button>
      </div>

      {/* Script Textarea Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl backdrop-blur-sm relative focus-within:border-indigo-500/60 transition-colors">
        {/* Textarea header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">Marketing Script</span>
            <span className="text-[11px] text-slate-500">
              {language === 'moroccan_darija' ? 'Moroccan Darija' : 'Modern Standard Arabic'}
            </span>
          </div>

          {/* AI Polish Button */}
          <button
            type="button"
            onClick={handlePolishScript}
            disabled={isPolishing || !script.trim()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-medium transition-all disabled:opacity-40 cursor-pointer"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isPolishing ? 'animate-spin' : ''}`} />
            <span>{isPolishing ? 'Optimizing...' : 'AI Polish & Darija Localize'}</span>
          </button>
        </div>

        {/* Main Text Area */}
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder={
            language === 'moroccan_darija'
              ? 'اكتب هنا نص الإعلان بالدارجة المغربية... مثال: واش باقي كتقلب على الحل؟ اليوم جبنا ليك أقوى منتج مع توصيل مجاني والدفع عند الاستلام...'
              : 'اكتب هنا نص الإعلان بالعربية الفصحى مع التشكيل لضمان أعلى جودة نطق... مثال: هل تبحث عن الحل الأمثل لتنمية مبيعاتك؟ احصل على العرض الحصري الآن...'
          }
          dir="rtl"
          rows={6}
          className="w-full bg-slate-950/60 text-slate-100 text-sm md:text-base leading-relaxed p-3.5 rounded-xl border border-slate-800/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 resize-y font-arabic"
        />

        {/* Voice Direction Insertion Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-500 mr-1 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Voice Tags:
          </span>
          {[
            { label: '[وقفة قصيرة]', tag: '[وقفة قصيرة]' },
            { label: '[تركيز بيعي]', tag: '[تركيز]' },
            { label: '<تنفس>', tag: '<breath>' },
            { label: '<ضحكة>', tag: '<laugh>' },
            { label: 'دابا (الآن)', tag: 'دابا' },
            { label: 'توصيل فابور', tag: 'توصيل فابور' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => insertTag(item.tag)}
              className="px-2 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-arabic border border-slate-700/60 transition-colors cursor-pointer"
            >
              + {item.label}
            </button>
          ))}
        </div>

        {/* Bottom Script Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Words: <strong className="text-slate-200">{wordCount}</strong>
            </span>
            <span>·</span>
            <span>
              Characters: <strong className="text-slate-200">{charCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Est. Voiceover: ~<strong>{estimatedSeconds}s</strong> ({Math.round(rate * 100)}% pace)
            </span>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white text-base">
                  Marketing Voiceover Templates
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-converting scripts crafted for Moroccan Darija & Arabic advertisers
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'ecommerce', label: 'E-commerce COD' },
                { id: 'reels', label: 'TikTok / Reels' },
                { id: 'youtube', label: 'YouTube Hooks' },
                { id: 'realestate', label: 'Real Estate & Luxury' },
                { id: 'saas', label: 'B2B & SaaS' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Templates List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No templates found for this filter. Try switching language or category.
                </div>
              ) : (
                filteredTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-indigo-500/50 transition-all flex flex-col gap-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-200 text-sm">{tpl.title}</h4>
                        <span className="text-xs text-indigo-400 font-arabic">{tpl.titleAr}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onApplyTemplate(tpl);
                          setShowTemplatesModal(false);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <span>Use Script</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">{tpl.description}</p>

                    <div
                      dir="rtl"
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-300 font-arabic leading-relaxed line-clamp-3"
                    >
                      {tpl.script}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>Voice: <strong>{tpl.recommendedVoice}</strong></span>
                      <span>·</span>
                      <span>Tone: <strong className="capitalize">{tpl.recommendedTone}</strong></span>
                      <span>·</span>
                      <span>Speed: <strong>{tpl.recommendedRate}x</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Polish Result Modal */}
      {showPolishedModal && polishedResult && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold text-white text-base">
                  AI Marketing Script Polish
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPolishedModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">
                  Optimized Voiceover Script:
                </label>
                <div
                  dir="rtl"
                  className="p-3 rounded-xl bg-slate-950 text-slate-100 text-sm font-arabic leading-relaxed border border-indigo-500/30"
                >
                  {polishedResult.polishedScript}
                </div>
              </div>

              {polishedResult.hook && (
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
                  <span className="text-indigo-400 font-semibold block mb-0.5">3-Second Hook:</span>
                  <span className="text-slate-300">{polishedResult.hook}</span>
                </div>
              )}

              {polishedResult.tips && polishedResult.tips.length > 0 && (
                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300 block mb-1">Director Notes:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                    {polishedResult.tips.map((tip: string, idx: number) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPolishedModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={() => {
                  setScript(polishedResult.polishedScript);
                  setShowPolishedModal(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Apply to Editor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

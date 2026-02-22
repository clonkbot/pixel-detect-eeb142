import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { AnalysisCard } from "./AnalysisCard";
import type { Id, Doc } from "../../convex/_generated/dataModel";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const analyses = useQuery(api.images.list);
  const submitImage = useMutation(api.images.submit);
  const analyzeImage = useAction(api.images.analyze);
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setError(null);
    setSubmitting(true);

    try {
      const id = await submitImage({ imageUrl: url.trim() });
      setUrl("");
      // Start analysis in background
      analyzeImage({ id: id as Id<"imageAnalyses"> });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit image");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]"
             style={{
               backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
               backgroundSize: '60px 60px'
             }} />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              PIXEL<span className="text-emerald-400">DETECT</span>
            </h1>
          </div>
          <button
            onClick={() => signOut()}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        {/* URL Input Section */}
        <section className="mb-8 sm:mb-12">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                  <line x1="16" y1="5" x2="22" y2="5" />
                  <line x1="19" y1="2" x2="19" y2="8" />
                  <rect x="6" y="12" width="4" height="5" />
                  <rect x="14" y="9" width="4" height="8" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Analyze Image
                </h2>
                <p className="text-zinc-500 text-sm">
                  Paste an image URL from X (Twitter) to detect AI generation, photoshop, or edits
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://pbs.twimg.com/media/..."
                  className="w-full px-4 py-3 sm:py-3.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all pr-12 text-sm sm:text-base"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting || !url.trim()}
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-semibold rounded-xl hover:from-emerald-400 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 whitespace-nowrap text-sm sm:text-base"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    Analyze
                  </span>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-zinc-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                AI Detection
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Photoshop Detection
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                Edit Analysis
              </span>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Analysis History
            </h2>
            {analyses && analyses.length > 0 && (
              <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2.5 py-1 rounded-full">
                {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'}
              </span>
            )}
          </div>

          {analyses === undefined ? (
            <div className="flex items-center justify-center py-16 sm:py-20">
              <div className="w-8 h-8 border-2 border-emerald-500/20 rounded-full animate-spin"
                   style={{ borderTopColor: '#10b981' }} />
            </div>
          ) : analyses.length === 0 ? (
            <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-2xl p-8 sm:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <p className="text-zinc-500 text-sm sm:text-base">No images analyzed yet</p>
              <p className="text-zinc-600 text-xs sm:text-sm mt-1">Paste an image URL above to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {analyses.map((analysis: Doc<"imageAnalyses">) => (
                <AnalysisCard key={analysis._id} analysis={analysis} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 border-t border-zinc-800/30 text-center">
        <p className="text-zinc-600 text-xs">
          Requested by <span className="text-zinc-500">@stringer_kade</span> · Built by <span className="text-zinc-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

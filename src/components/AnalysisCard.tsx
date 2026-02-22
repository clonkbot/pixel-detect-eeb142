import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

interface AnalysisCardProps {
  analysis: Doc<"imageAnalyses">;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const removeAnalysis = useMutation(api.images.remove);

  const getStatusDisplay = () => {
    switch (analysis.status) {
      case "pending":
        return {
          label: "Pending",
          color: "text-zinc-400",
          bg: "bg-zinc-500/10",
          border: "border-zinc-500/20",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          ),
        };
      case "analyzing":
        return {
          label: "Analyzing",
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
          icon: (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ),
        };
      case "complete":
        return analysis.result?.isAiGenerated
          ? { label: "AI Generated", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: <AlertIcon /> }
          : analysis.result?.isPhotoshopped
          ? { label: "Photoshopped", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: <WarningIcon /> }
          : analysis.result?.isEdited
          ? { label: "Edited", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: <EditIcon /> }
          : { label: "Authentic", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: <CheckIcon /> };
      case "error":
        return {
          label: "Error",
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          icon: <XIcon />,
        };
      default:
        return { label: "Unknown", color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", icon: null };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className={`bg-zinc-900/50 backdrop-blur-xl border ${status.border} rounded-2xl overflow-hidden transition-all duration-300 ${expanded ? 'ring-1 ring-zinc-700/50' : ''}`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Image Preview */}
          <div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800/50 border border-zinc-700/30">
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-8 h-8 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            ) : (
              <img
                src={analysis.imageUrl}
                alt="Analyzed"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.color}`}>
                  {status.icon}
                  {status.label}
                </span>
                {analysis.result && (
                  <span className="text-xs text-zinc-500">
                    {analysis.result.confidence}% confidence
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600">
                  {new Date(analysis.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <button
                  onClick={() => removeAnalysis({ id: analysis._id })}
                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete analysis"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* URL */}
            <p className="text-xs text-zinc-500 truncate mb-3 font-mono">
              {analysis.imageUrl}
            </p>

            {/* Flags */}
            {analysis.result?.flags && analysis.result.flags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {analysis.result.flags.map((flag: string, i: number) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded ${
                      flag === 'AI_GENERATED' || flag === 'SYNTHETIC_PATTERNS'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : flag === 'PHOTOSHOPPED' || flag === 'CLONE_STAMP_DETECTED'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : flag === 'AUTHENTIC'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                    }`}
                  >
                    {flag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Expand button */}
            {analysis.result?.detailsMarkdown && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
                {expanded ? 'Hide Details' : 'View Details'}
              </button>
            )}

            {/* Error message */}
            {analysis.status === "error" && analysis.errorMessage && (
              <p className="text-sm text-red-400 mt-2">{analysis.errorMessage}</p>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && analysis.result?.detailsMarkdown && (
        <div className="border-t border-zinc-800/50 p-4 sm:p-6 bg-zinc-900/30">
          <div className="prose prose-sm prose-invert max-w-none">
            <div className="text-sm text-zinc-300 space-y-3">
              {analysis.result.detailsMarkdown.split('\n').map((line: string, i: number) => {
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="text-lg font-semibold text-white mt-4 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-base font-medium text-emerald-400 mt-3 mb-1">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.+?)\*\*(.+)/);
                  if (match) {
                    return (
                      <p key={i} className="flex items-start gap-2 text-zinc-400">
                        <span className="text-zinc-600 mt-1">•</span>
                        <span><span className="font-medium text-zinc-300">{match[1]}</span>{match[2]}</span>
                      </p>
                    );
                  }
                }
                if (line.trim()) {
                  return <p key={i} className="text-zinc-400">{line}</p>;
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AlertIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

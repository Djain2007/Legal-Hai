import { FileText, AlertTriangle, Landmark, Clock, Brain, Plus, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useHistory } from "@/hooks/useHistory";
import { useAuth } from "@/contexts/AuthContext";

function getRiskColor(score: number) {
  if (score > 70) return { text: "text-error", bg: "bg-error/10", border: "border-error/30", label: "High Risk" };
  if (score > 30) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Medium Risk" };
  return { text: "text-surface-tint", bg: "bg-primary/10", border: "border-primary/20", label: "Low Risk" };
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 282.7;
  const offset = circumference - (score / 100) * circumference;
  const { text } = getRiskColor(score);
  const color = score > 70 ? "#ba1a1a" : score > 30 ? "#d97706" : "#4c5e86";
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#f5f3f7" strokeWidth="12" />
        <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold ${text}`}>{score}</span>
      </div>
    </div>
  );
}

export function HistoryPage() {
  const { history, loading, error, refresh } = useHistory();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const handleViewAnalysis = (item: (typeof history)[0]) => {
    navigate("/dashboard", {
      state: {
        analysis: item.result_json,
        filename: item.documents?.file_url?.split("/").pop() || "Contract",
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1280px] mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary">Analysis History</h1>
            <p className="text-on-surface-variant mt-1">All your past contract analyses, sorted newest first.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-all text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <Link
              to="/upload"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-linear-to-r from-primary to-secondary text-on-primary font-semibold text-sm shadow-[0_4px_20px_rgba(86,68,208,0.2)] hover:shadow-[0_8px_24px_rgba(86,68,208,0.3)] hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> New Analysis
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-on-surface-variant">Loading your analyses…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-error-container text-on-error-container rounded-xl p-6 text-center">
            <p className="font-semibold">{error}</p>
            <button onClick={refresh} className="mt-3 text-sm underline">Try again</button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-surface-container-low border border-outline-variant flex items-center justify-center mb-2">
              <Brain className="w-10 h-10 text-outline" />
            </div>
            <h2 className="text-2xl font-bold text-primary">No analyses yet</h2>
            <p className="text-on-surface-variant max-w-sm">
              Upload your first contract image and our AI will analyse it for risks and key clauses.
            </p>
            <Link
              to="/upload"
              className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-primary to-secondary text-on-primary font-semibold shadow-[0_4px_20px_rgba(86,68,208,0.2)] hover:shadow-[0_8px_24px_rgba(86,68,208,0.3)] transition-all"
            >
              <Plus className="w-5 h-5" /> Upload Your First Contract
            </Link>
          </div>
        )}

        {/* History list */}
        {!loading && !error && history.length > 0 && (
          <div className="grid gap-4">
            {history.map((item) => {
              const risk = getRiskColor(item.risk_score);
              const filename = item.documents?.file_url?.split("/").pop()?.replace(/_/g, " ") || "Contract";
              const date = new Date(item.created_at).toLocaleString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              });
              const riskCount = item.result_json?.risks?.length ?? 0;
              const clauseCount = item.result_json?.clauses?.length ?? 0;

              return (
                <div
                  key={item.id}
                  className={`bg-surface-container-lowest border ${risk.border} rounded-xl p-6 shadow-[0_2px_12px_rgba(10,31,68,0.04)] hover:shadow-[0_8px_24px_rgba(86,68,208,0.08)] hover:border-secondary/40 transition-all duration-200 cursor-pointer group`}
                  onClick={() => handleViewAnalysis(item)}
                >
                  <div className="flex items-start gap-4">
                    {/* Score ring */}
                    <ScoreRing score={item.risk_score} />

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-primary text-lg truncate group-hover:text-secondary transition-colors">
                          {filename}
                        </h3>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${risk.bg} ${risk.text} shrink-0`}>
                          {risk.label}
                        </span>
                      </div>

                      <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">
                        {item.result_json?.summary || "No summary available."}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-error/70" />
                          {riskCount} risk{riskCount !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-secondary/70" />
                          {clauseCount} clause{clauseCount !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {date}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <Landmark className="w-5 h-5 text-outline-variant group-hover:text-secondary transition-colors shrink-0 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer note */}
        {!loading && history.length > 0 && (
          <p className="text-center text-xs text-on-surface-variant pb-4">
            Showing {history.length} analysis record{history.length !== 1 ? "s" : ""} for your session.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}

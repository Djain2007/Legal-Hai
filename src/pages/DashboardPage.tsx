import { Sparkles, AlertTriangle, Copy, Gavel, Clock, Landmark, Brain, List } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useEffect } from "react";

interface Risk {
  clause: string;
  risk_level: string;
  reason: string;
  suggestion: string;
}

interface Clause {
  type: string;
  importance: string;
  explanation: string;
}

interface AnalysisResult {
  risk_score: number;
  summary: string;
  risks: Risk[];
  clauses: Clause[];
}

export function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { analysis?: AnalysisResult; filename?: string } | null;
  
  const analysis = state?.analysis;
  const filename = state?.filename || "No Document Selected";

  // If no analysis data, redirect to the history page instead of dead empty state
  useEffect(() => {
    if (!analysis) {
      navigate('/history', { replace: true });
    }
  }, [analysis, navigate]);

  if (!analysis) return null;

  // Calculate percentage for circular gauge
  const circumference = 282.7; // 2 * pi * 45
  const strokeDashoffset = circumference - (analysis.risk_score / 100) * circumference;
  
  // Decide gauge color
  const gaugeColor = analysis.risk_score > 70 ? "#ba1a1a" : analysis.risk_score > 30 ? "#f59e0b" : "#4c5e86";
  const gaugeTextColor = analysis.risk_score > 70 ? "text-error" : analysis.risk_score > 30 ? "text-warning" : "text-surface-tint";
  const RiskIcon = analysis.risk_score > 70 ? AlertTriangle : analysis.risk_score > 30 ? AlertTriangle : Landmark;
  const riskLabel = analysis.risk_score > 70 ? "High Risk" : analysis.risk_score > 30 ? "Medium Risk" : "Low Risk";

  return (
    <DashboardLayout>
      <div className="max-w-[1280px] mx-auto space-y-12">
        
        {/* Page Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Analysis Report: {filename}</h1>
          <p className="text-lg text-on-surface-variant">Comprehensive legal risk assessment and AI-driven clause breakdown.</p>
        </div>

        {/* Top Section: Risk Score & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Visual Risk Score Indicator */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-[0_4px_20px_rgba(10,31,68,0.04)] flex flex-col items-center justify-center relative overflow-hidden h-full">
            <h2 className="text-2xl font-bold text-primary w-full text-left mb-auto">Overall Risk Profile</h2>
            
            <div className="relative w-48 h-48 flex items-center justify-center mt-6 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f5f3f7" strokeWidth="10" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" stroke={gaugeColor} strokeWidth="10" 
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-[12px] bg-surface-container-lowest rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className={`text-5xl font-bold ${gaugeTextColor} leading-none`}>{analysis.risk_score}</span>
                <span className="text-label-caps text-on-surface-variant mt-1">Score</span>
              </div>
            </div>
            
            <div className={`bg-opacity-10 text-label-caps px-4 py-2 rounded-full flex items-center gap-1 mt-auto ${gaugeTextColor}`} style={{ backgroundColor: `${gaugeColor}1A` }}>
              <RiskIcon className="w-4 h-4" /> {riskLabel}
            </div>
          </div>

          {/* Plain English Summary (Glassmorphic Edge) */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-[0_4px_20px_rgba(10,31,68,0.04)] relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-fixed/30 blur-2xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Sparkles className="text-secondary w-6 h-6 fill-secondary" />
              <h2 className="text-2xl font-bold text-primary">Plain English Summary</h2>
            </div>
            
            <div className="space-y-4 relative z-10 text-lg text-on-surface-variant flex-1 whitespace-pre-wrap leading-relaxed">
              {analysis.summary}
            </div>
            
            <div className="mt-8 pt-4 border-t border-outline-variant flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                  <Brain className="text-on-primary w-4 h-4" />
                </div>
                <span className="text-label-caps text-on-surface-variant">AI Generated Insights</span>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(analysis.summary)}
                className="text-label-caps text-secondary hover:text-secondary-container flex items-center gap-1 transition-colors"
              >
                COPY SUMMARY <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Key Risks Section (Bento Cards) */}
        {analysis.risks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-primary">Key Risks Identified</h2>
              <span className="bg-error-container text-on-error-container text-label-caps px-4 py-2 rounded-full">{analysis.risks.length} Actionable Items</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysis.risks.map((risk, idx) => {
                const isHigh = risk.risk_level.toLowerCase() === 'high';
                return (
                  <div key={idx} className={`bg-surface-container-lowest border ${isHigh ? 'border-error/30' : 'border-outline-variant'} rounded-xl p-6 shadow-[0_4px_20px_rgba(10,31,68,0.04)] hover:border-secondary hover:shadow-[0_10px_30px_rgba(86,68,208,0.08)] transition-all group flex flex-col h-full`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className={`${isHigh ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'} text-label-caps px-3 py-1 rounded-full flex items-center gap-1`}>
                        <AlertTriangle className="w-3.5 h-3.5" /> {risk.risk_level} Risk
                      </span>
                      {isHigh ? <Gavel className="w-5 h-5 text-outline-variant group-hover:text-secondary transition-colors" /> : <Clock className="w-5 h-5 text-outline-variant group-hover:text-secondary transition-colors" />}
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2 line-clamp-2">{risk.clause}</h3>
                    <div className={`bg-surface-container-low p-4 rounded-lg mb-4 border-l-4 ${isHigh ? 'border-error' : 'border-warning'}`}>
                      <p className="text-sm text-on-surface-variant leading-relaxed">Risk Reason: {risk.reason}</p>
                    </div>
                    
                    <div className="bg-linear-to-r from-primary-fixed-dim/30 to-transparent p-px rounded-lg mt-auto">
                      <div className="bg-surface-container-lowest p-4 rounded-lg h-full">
                        <span className="text-label-caps text-secondary flex items-center gap-1 mb-1">
                          <Sparkles className="w-3.5 h-3.5 fill-secondary" /> AI Suggestion
                        </span>
                        <p className="text-base text-on-surface-variant">{risk.suggestion}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Clause Breakdown (Table View) */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(10,31,68,0.04)]">
          <div className="p-6 border-b border-outline-variant bg-surface-container/30 flex items-center gap-2">
            <List className="text-primary w-6 h-6" />
            <h2 className="text-3xl font-bold text-primary">Comprehensive Clause Breakdown</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-label-caps border-b border-outline-variant">
                  <th className="p-6 font-semibold w-1/4">Clause Type</th>
                  <th className="p-6 font-semibold w-1/6">Importance</th>
                  <th className="p-6 font-semibold">Simple Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-base text-primary">
                {analysis.clauses.map((clause, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-lowest/50 transition-colors group">
                    <td className="p-6 font-medium text-primary group-hover:text-secondary transition-colors">{idx + 1}. {clause.type}</td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        clause.importance === "Critical" ? "bg-error-container text-on-error-container" :
                        clause.importance === "Important" ? "bg-secondary-fixed text-on-secondary-fixed" :
                        "bg-surface-container-high text-on-surface-variant"
                      }`}>
                        {clause.importance}
                      </span>
                    </td>
                    <td className="p-6 text-on-surface-variant">{clause.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}

import { Link } from "react-router-dom";
import { Sparkles, Image, PlayCircle, Shield, FileText, Brain, Heart, Send, BookOpen, AlertTriangle } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";

export function LandingPage() {
  return (
    <PublicLayout>
      <section className="relative pt-24 pb-32 px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-center text-center w-full min-h-[calc(100vh-80px)]">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-secondary-fixed)_20%,var(--color-background)_100%)] opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
        
        <div className="max-w-4xl mx-auto z-10 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant/30 mb-8 shadow-sm">
            <Sparkles className="text-secondary w-4 h-4 fill-secondary" />
            <span className="text-sm font-semibold text-primary">AI-Powered Legal Analysis</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight tracking-tight">
            Understand Any Contract <br className="hidden sm:block"/>
            <span className="ai-gradient-text">in Seconds</span>
          </h1>
          
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            Legal Hai! uses advanced AI to detect hidden risks, explain complex clauses in plain English, and simplify your legal documents before you sign.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/upload" 
              className="w-full sm:w-auto bg-linear-to-r from-primary to-secondary-container text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-95 transition-all shadow-[0_10px_30px_rgba(108,92,231,0.2)] flex items-center justify-center gap-2"
            >
              <Image className="w-5 h-5" />
              Upload Contract Image
            </Link>
            <Link 
              to="#" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg text-primary border-2 border-outline-variant hover:border-primary transition-all flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm"
            >
              <PlayCircle className="w-5 h-5" />
              See How It Works
            </Link>
          </div>
          
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-surface-container-lowest w-full relative z-10 border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Complete Legal Clarity</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">Our AI breaks down legalese into actionable insights, ensuring you never sign blindly again.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Shield} 
              iconBg="bg-error-container" 
              iconColor="text-error"
              title="Risk Detection"
              desc="Instantly flag unusual terms, one-sided liabilities, and non-standard clauses that could put you at risk."
            />
            <FeatureCard 
              icon={BookOpen} 
              iconBg="bg-secondary-fixed" 
              iconColor="text-secondary"
              title="Clause Breakdown"
              desc="We dissect complex paragraphs into clear, distinct points, comparing them against industry standards."
              isAiConfig
            />
            <FeatureCard 
              icon={Brain} 
              iconBg="bg-primary-fixed" 
              iconColor="text-primary"
              title="Simple Explanations"
              desc="Get plain-English summaries of what each section actually means for you in the real world."
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-surface relative overflow-hidden w-full">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-3xl border border-white/40 shadow-[0_20px_50px_rgba(10,31,68,0.1)] overflow-hidden relative">
            
            {/* Browser/App Header */}
            <div className="h-12 bg-surface-container-low border-b border-outline-variant/20 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-error/50"></div>
                <div className="w-3 h-3 rounded-full bg-outline/50"></div>
                <div className="w-3 h-3 rounded-full bg-secondary/50"></div>
              </div>
              <div className="ml-4 grow flex justify-center">
                <div className="bg-white/50 h-6 w-1/3 rounded-full text-center text-xs text-on-surface-variant flex items-center justify-center font-medium">Non-Disclosure_Agreement_v2.pdf</div>
              </div>
            </div>

            {/* App Body */}
            <div className="flex flex-col md:flex-row min-h-[500px]">
              {/* Document View */}
              <div className="w-full md:w-1/2 p-8 bg-white overflow-y-auto border-r border-outline-variant/20 text-left">
                <h4 className="font-bold text-lg mb-4 text-primary">4. Confidential Information</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  "Confidential Information" means all non-public, proprietary information disclosed by the Disclosing Party to the Receiving Party, whether disclosed orally or in written, electronic, or other form or media, and whether or not marked, designated, or otherwise identified as "confidential."
                </p>
                <div className="p-3 bg-secondary-fixed/30 rounded border border-secondary-fixed mb-4 relative cursor-pointer hover:bg-secondary-fixed/50 transition-colors">
                  <span className="absolute -left-2 -top-2 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">1</span>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    <span className="bg-error-container/50 text-error font-medium px-1 rounded">The Receiving Party shall hold the Confidential Information in strict confidence and shall not disclose it to any third party for a period of ten (10) years following the termination of this Agreement.</span>
                  </p>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  The Receiving Party may disclose Confidential Information to its employees, agents, or representatives who need to know such information for the purpose of evaluating the Proposed Transaction.
                </p>
              </div>

              {/* AI Analysis Panel */}
              <div className="w-full md:w-1/2 bg-surface-container-lowest p-6 flex flex-col relative text-left">
                <div className="absolute inset-0 bg-linear-to-b from-secondary/5 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4 fill-white" />
                  </div>
                  <span className="font-semibold text-primary">AI Analysis</span>
                </div>
                
                <div className="grow space-y-4 relative z-10">
                  {/* AI Chat Bubble */}
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-outline-variant/20">
                    <div className="flex items-center gap-2 mb-2 text-error">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-semibold text-sm">High Risk Flagged</span>
                    </div>
                    <h5 className="font-bold text-primary text-sm mb-1">Unusually Long Term</h5>
                    <p className="text-sm text-on-surface-variant mb-3">
                      The 10-year confidentiality period is significantly longer than the industry standard of 2-3 years for this type of agreement.
                    </p>
                    <div className="bg-surface p-3 rounded-lg border border-outline-variant/30">
                      <span className="text-xs font-semibold text-secondary block mb-1">Suggested Revision:</span>
                      <p className="text-xs text-on-surface-variant italic">"...shall not disclose it to any third party for a period of three (3) years following..."</p>
                    </div>
                  </div>

                  {/* Shimmering Processing Indicator */}
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-outline-variant/20 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-secondary/5 to-transparent"></div>
                    <div className="flex gap-2 items-center opacity-70">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <span className="text-xs text-on-surface-variant ml-2">Analyzing section 5...</span>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="mt-4 relative z-10">
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-secondary/20 shadow-sm overflow-hidden flex items-center p-1 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
                    <input 
                      type="text" 
                      placeholder="Ask a question about this contract..." 
                      className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-3 text-primary placeholder-on-surface-variant/50 focus:outline-none" 
                    />
                    <button className="bg-secondary text-white p-2 rounded-lg hover:bg-secondary-container transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function FeatureCard({ icon: Icon, iconBg, iconColor, title, desc, isAiConfig }: any) {
  return (
    <div className={`bg-white rounded-2xl p-8 border border-outline-variant/30 shadow-[0_4px_20px_rgba(10,31,68,0.04)] hover:shadow-[0_10px_30px_rgba(108,92,231,0.08)] hover:border-secondary-container/50 transition-all duration-300 group relative overflow-hidden ${isAiConfig ? 'ai-glow' : ''}`}>
      <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-48 h-48 text-primary" />
      </div>
      <div className={`h-14 w-14 ${iconBg} rounded-xl flex items-center justify-center mb-6 ${iconColor} group-hover:scale-110 transition-transform`}>
        <Icon className="w-8 h-8 fill-current opacity-20 absolute" />
        <Icon className="w-7 h-7 relative z-10" />
      </div>
      <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-base text-on-surface-variant">{desc}</p>
    </div>
  );
}

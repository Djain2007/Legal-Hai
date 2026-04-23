import React, { useState, useEffect } from "react";
import {
  User, Bell, Shield, Save, CheckCircle, AlertCircle,
  Loader2, SlidersHorizontal, Info
} from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(10,31,68,0.04)]">
      <div className="flex items-center gap-3 p-6 border-b border-outline-variant bg-surface-container/40">
        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-secondary" />
        </div>
        <h2 className="text-xl font-bold text-primary">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 ${checked ? "bg-secondary" : "bg-outline-variant"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export function SettingsPage() {
  const { userId, user } = useAuth();
  const { settings, setSettings, loading, saving, saved, error, saveSettings } = useSettings();

  // Local state for the form (only committed on Save)
  const [form, setForm] = useState({
    display_name: "",
    email_notifications: false,
    default_risk_threshold: 50,
  });

  // Sync form when settings load from backend
  useEffect(() => {
    setForm({
      display_name: settings.display_name ?? "",
      email_notifications: settings.email_notifications ?? false,
      default_risk_threshold: settings.default_risk_threshold ?? 50,
    });
  }, [settings]);

  const handleSave = () => saveSettings(form);

  const riskLabel = form.default_risk_threshold > 70 ? "High 🔴" : form.default_risk_threshold > 30 ? "Medium 🟡" : "Low 🟢";

  return (
    <DashboardLayout>
      <div className="max-w-[860px] mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold text-primary">Settings</h1>
          <p className="text-on-surface-variant mt-1">Manage your profile, notifications, and analysis preferences.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : (
          <>
            {/* Profile Section */}
            <Section title="Your Profile" icon={User}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2" htmlFor="display_name">
                    Display Name
                  </label>
                  <input
                    id="display_name"
                    type="text"
                    value={form.display_name}
                    onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-primary placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-colors"
                  />
                  <p className="text-xs text-on-surface-variant mt-1.5">This is shown in your reports and dashboard.</p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-outline" />
                    <span className="text-sm font-semibold text-on-surface-variant">Session ID</span>
                  </div>
                  <p className="font-mono text-xs text-on-surface-variant break-all">{userId}</p>
                  <p className="text-xs text-outline mt-1">
                    This anonymous ID links your documents to your session. It persists in your browser.
                  </p>
                </div>
              </div>
            </Section>

            {/* Notifications Section */}
            <Section title="Notifications" icon={Bell}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-primary">Email Notifications</p>
                  <p className="text-sm text-on-surface-variant mt-0.5">
                    Receive an email summary when a high-risk contract is detected.
                  </p>
                </div>
                <Toggle
                  id="email_notifications"
                  checked={form.email_notifications}
                  onChange={v => setForm(f => ({ ...f, email_notifications: v }))}
                />
              </div>
            </Section>

            {/* Analysis Preferences */}
            <Section title="Analysis Preferences" icon={SlidersHorizontal}>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-semibold text-primary" htmlFor="risk_threshold">
                      Default Risk Alert Threshold
                    </label>
                    <span className="text-sm font-bold text-secondary">{form.default_risk_threshold} — {riskLabel}</span>
                  </div>
                  <input
                    id="risk_threshold"
                    type="range"
                    min={0}
                    max={100}
                    value={form.default_risk_threshold}
                    onChange={e => setForm(f => ({ ...f, default_risk_threshold: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-xs text-on-surface-variant mt-1.5">
                    <span>0 — Alert on all</span>
                    <span>100 — Only critical</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2">
                    Analyses with a risk score above this threshold will be highlighted as high-priority.
                  </p>
                </div>
              </div>
            </Section>

            {/* Privacy Section */}
            <Section title="Privacy & Data" icon={Shield}>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    <strong className="text-primary">End-to-end confidential.</strong> Your uploaded contract images are stored in a private Supabase bucket and are only accessible via your session. We never share your documents with third parties.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
                  <p className="text-sm font-semibold text-primary mb-1">Data Retention</p>
                  <p className="text-sm text-on-surface-variant">
                    All documents and analyses are retained indefinitely on your anonymous session. Clearing your browser's localStorage will disassociate this session.
                  </p>
                </div>
              </div>
            </Section>

            <div className="sticky z-10 bottom-20 lg:bottom-6">
              <div className="bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant rounded-2xl px-4 sm:px-6 py-4 shadow-[0_8px_30px_rgba(10,31,68,0.10)] flex flex-row items-center justify-between gap-2 sm:gap-4">
                <div className="text-left flex-1">
                  {saved && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-green-700">
                      <CheckCircle className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Settings saved successfully!</span><span className="sm:hidden">Saved!</span>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-error">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                  )}
                  {!saved && !error && (
                    <p className="text-xs sm:text-sm text-on-surface-variant">
                      <span className="hidden sm:inline">Changes are not saved automatically.</span>
                      <span className="sm:hidden">Unsaved changes</span>
                    </p>
                  )}
                </div>
                <button
                  id="save-settings-btn"
                  onClick={handleSave}
                  disabled={saving}
                  className={`shrink-0 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    saving
                      ? "bg-surface-variant text-on-surface-variant cursor-wait"
                      : "bg-linear-to-r from-primary to-secondary text-on-primary shadow-[0_4px_16px_rgba(86,68,208,0.25)] hover:shadow-[0_8px_24px_rgba(86,68,208,0.35)] hover:-translate-y-0.5"
                  }`}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

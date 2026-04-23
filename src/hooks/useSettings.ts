/**
 * useSettings — fetches and persists user settings from the backend.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface UserSettings {
  user_id: string;
  display_name: string;
  email_notifications: boolean;
  default_risk_threshold: number;
}

const DEFAULT_SETTINGS: Omit<UserSettings, 'user_id'> = {
  display_name: '',
  email_notifications: false,
  default_risk_threshold: 50,
};

export function useSettings() {
  const { userId } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({ user_id: userId, ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userId || userId === 'guest_user') {
      // No real auth session yet — show defaults immediately, don't spin forever
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/settings?user_id=${encodeURIComponent(userId)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const saveSettings = async (updates: Partial<Omit<UserSettings, 'user_id'>>) => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const payload: UserSettings = { ...settings, ...updates, user_id: userId };
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save settings.');
      const data = await res.json();
      setSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  return { settings, setSettings, loading, saving, saved, error, saveSettings };
}

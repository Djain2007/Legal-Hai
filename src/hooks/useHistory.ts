/**
 * useHistory — fetches all past analyses for the current user from the backend.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface HistoryItem {
  id: string;
  risk_score: number;
  result_json: {
    summary: string;
    risks: { clause: string; risk_level: string; reason: string; suggestion: string }[];
    clauses: { type: string; importance: string; explanation: string }[];
  };
  created_at: string;
  documents: {
    file_url: string;
    created_at: string;
  };
}

export function useHistory() {
  const { userId } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/history?user_id=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error('Failed to load history.');
      const data = await res.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { history, loading, error, refresh: fetchHistory };
}

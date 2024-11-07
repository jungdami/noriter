import { useState, useEffect, useCallback } from 'react';
import { SessionStorage } from '../utils/sessionStorage';

export const useSession = (sessionId) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      const sessionData = SessionStorage.get(sessionId);
      if (sessionData) {
        setSession(sessionData);
        setError(null);
      } else {
        setError('세션을 찾을 수 없습니다.');
        console.warn('세션을 찾을 수 없음:', sessionId);
      }
      setLoading(false);
    }
  }, [sessionId]);

  const updateSession = useCallback((updates) => {
    if (!sessionId) return null;
    
    const updated = SessionStorage.update(sessionId, updates);
    if (updated) {
      setSession(updated);
      return updated;
    }
    return null;
  }, [sessionId]);

  const endSession = useCallback(() => {
    if (!sessionId) return null;

    const updated = updateSession({
      endTime: new Date().toISOString(),
      status: 'completed'
    });
    return updated;
  }, [sessionId, updateSession]);

  return {
    session,
    loading,
    error,
    updateSession,
    endSession
  };
};

export const SessionStorage = {
    create: (sessionData) => {
      const id = crypto.randomUUID();
      const session = { 
        id, 
        ...sessionData, 
        startTime: new Date().toISOString(),
        status: 'active',
        lastUpdate: new Date().toISOString()
      };
      localStorage.setItem(`session_${id}`, JSON.stringify(session));
      console.log('세션 생성:', session);
      return id;
    },
  
    get: (sessionId) => {
      try {
        const data = localStorage.getItem(`session_${sessionId}`);
        if (!data) {
          console.warn('세션을 찾을 수 없음:', sessionId);
          return null;
        }
        return JSON.parse(data);
      } catch (error) {
        console.error('세션 데이터 파싱 오류:', error);
        return null;
      }
    },
  
    update: (sessionId, updates) => {
      const session = SessionStorage.get(sessionId);
      if (session) {
        const updated = { 
          ...session, 
          ...updates,
          lastUpdate: new Date().toISOString()
        };
        localStorage.setItem(`session_${sessionId}`, JSON.stringify(updated));
        console.log('세션 업데이트:', updated);
        return updated;
      }
      return null;
    },
  
    delete: (sessionId) => {
      localStorage.removeItem(`session_${sessionId}`);
      console.log('세션 삭제:', sessionId);
    }
  };
export const sessionApi = {
    saveSession(sessionData) {
      try {
        localStorage.setItem(`session_${sessionData.id}`, JSON.stringify(sessionData));
        return true;
      } catch (error) {
        console.error('Session save error:', error);
        return false;
      }
    },
  
    getSession(sessionId) {
      try {
        const data = localStorage.getItem(`session_${sessionId}`);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('Session retrieval error:', error);
        return null;
      }
    },
  
    getAllSessions() {
      const sessions = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('session_')) {
          try {
            const session = JSON.parse(localStorage.getItem(key));
            sessions.push(session);
          } catch (error) {
            console.error('Session parsing error:', error);
          }
        }
      }
      return sessions;
    },
  
    deleteSession(sessionId) {
      try {
        localStorage.removeItem(`session_${sessionId}`);
        return true;
      } catch (error) {
        console.error('Session deletion error:', error);
        return false;
      }
    }
  };
  
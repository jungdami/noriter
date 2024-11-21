// src/features/gpt/services/sessionService.js

class SessionService {
  constructor() {
    this.storageKey = 'chat_sessions';
  }

  create() {
    try {
      const sessionId = Date.now().toString();
      const session = {
        id: sessionId,
        startTime: new Date().toISOString(),
        status: 'active',
        responses: []
      };

      // 로컬 스토리지에 저장
      const sessions = this.getAll();
      sessions[sessionId] = session;
      localStorage.setItem(this.storageKey, JSON.stringify(sessions));

      console.log("Session created:", session);
      return session;
    } catch (error) {
      console.error('Session creation error:', error);
      return null;
    }
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      return {};
    }
  }

  saveResponse(sessionId, userMessage, aiResponse) {
    try {
      if (!sessionId) return false;

      const sessions = this.getAll();
      const session = sessions[sessionId];
      if (!session) return false;

      session.responses.push({
        user: userMessage,
        ai: aiResponse
      });

      sessions[sessionId] = session;
      localStorage.setItem(this.storageKey, JSON.stringify(sessions));
      return true;
    } catch (error) {
      return false;
    }
  }

  update(sessionId, updates) {
    try {
      if (!sessionId) return false;

      const sessions = this.getAll();
      const session = sessions[sessionId];
      if (!session) return false;

      sessions[sessionId] = {
        ...session,
        ...updates
      };

      localStorage.setItem(this.storageKey, JSON.stringify(sessions));
      return true;
    } catch (error) {
      return false;
    }
  }
}

const sessionService = new SessionService();
export default sessionService;
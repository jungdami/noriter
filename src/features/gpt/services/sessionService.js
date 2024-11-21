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
        status: 'active'
      };

      const sessions = this.getAll();
      sessions[sessionId] = session;
      localStorage.setItem(this.storageKey, JSON.stringify(sessions));

      return session;
    } catch (error) {
      console.error('Session error:', error);
      return { id: 'temp-' + Date.now() };  // 에러 발생해도 임시 ID 반환
    }
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  saveResponse(sessionId, userMessage, aiResponse) {
    if (!sessionId) return;

    try {
      const sessions = this.getAll();
      if (!sessions[sessionId]) {
        sessions[sessionId] = {
          id: sessionId,
          status: 'active',
          responses: []
        };
      }

      sessions[sessionId].responses = sessions[sessionId].responses || [];
      sessions[sessionId].responses.push({ userMessage, aiResponse });
      
      localStorage.setItem(this.storageKey, JSON.stringify(sessions));
    } catch (error) {
      console.error('Save error:', error);
    }
  }

  update(sessionId, updates) {
    if (!sessionId) return;

    try {
      const sessions = this.getAll();
      sessions[sessionId] = {
        ...sessions[sessionId],
        ...updates
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(sessions));
    } catch (error) {
      console.error('Update error:', error);
    }
  }
}

const sessionService = new SessionService();
export default sessionService;
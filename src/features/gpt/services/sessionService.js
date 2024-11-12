// src/features/gpt/services/sessionService.js

class SessionService {
  constructor() {
    this.storageKey = 'userSessions';
  }

  create() {
    const sessionId = Date.now().toString();
    const sessionData = {
      id: sessionId,
      startTime: new Date().toISOString(),
      responses: [],
      cognitiveScore: 0,
      cognitiveLevel: null,
      assessment: null,
      status: 'active',
    };

    this.save(sessionId, sessionData);
    return sessionData;
  }

  save(sessionId, data) {
    try {
      const sessions = this.getAll();
      sessions[sessionId] = data;
      localStorage.setItem(this.storageKey, JSON.stringify(sessions));
      return true;
    } catch (error) {
      console.error('Session save error:', error);
      return false;
    }
  }

  get(sessionId) {
    try {
      const sessions = this.getAll();
      return sessions[sessionId] || null;
    } catch (error) {
      console.error('Session retrieval error:', error);
      return null;
    }
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Sessions retrieval error:', error);
      return {};
    }
  }

  update(sessionId, updates) {
    try {
      const session = this.get(sessionId);
      if (!session) {
        return false;
      }

      const updatedSession = {
        ...session,
        ...updates,
        lastUpdated: new Date().toISOString()
      };

      return this.save(sessionId, updatedSession);
    } catch (error) {
      console.error('Session update error:', error);
      return false;
    }
  }

  delete(sessionId) {
    try {
      const sessions = this.getAll();
      delete sessions[sessionId];
      localStorage.setItem(this.storageKey, JSON.stringify(sessions));
      return true;
    } catch (error) {
      console.error('Session deletion error:', error);
      return false;
    }
  }

  saveResponse(sessionId, question, answer) {
    try {
      const session = this.get(sessionId);
      if (!session) {
        return false;
      }

      const response = {
        question,
        answer,
        timestamp: new Date().toISOString()
      };

      session.responses = session.responses || [];
      session.responses.push(response);

      return this.save(sessionId, session);
    } catch (error) {
      console.error('Response save error:', error);
      return false;
    }
  }

  calculateScore(sessionId) {
    try {
      const session = this.get(sessionId);
      if (!session) {
        return 0;
      }

      const responses = session.responses || [];
      let score = 0;
      
      responses.forEach(response => {
        if (response.answer && response.answer.length > 10) score += 1;
        if (response.answer && response.answer.includes('?')) score += 0.5;
        if (response.answer && /[0-9]/.test(response.answer)) score += 0.5;
      });

      const normalizedScore = Math.min(Math.round((score / Math.max(responses.length, 1)) * 100), 100);
      session.cognitiveScore = normalizedScore;
      
      this.save(sessionId, session);
      return normalizedScore;
    } catch (error) {
      console.error('Score calculation error:', error);
      return 0;
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const sessionService = new SessionService();
export default sessionService;
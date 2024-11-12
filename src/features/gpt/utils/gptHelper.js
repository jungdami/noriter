// src/features/gpt/utils/gptHelper.js

// 응답 분석기 클래스
class ResponseAnalyzer {
    // 감정 분석 (긍정/부정)
    analyzeSentiment(response) {
      const positiveWords = ['좋아요', '괜찮아요', '행복해요', '기뻐요'];
      const negativeWords = ['싫어요', '나빠요', '슬퍼요', '화나요'];
  
      let score = 0;
      positiveWords.forEach(word => {
        if (response.includes(word)) score += 1;
      });
      negativeWords.forEach(word => {
        if (response.includes(word)) score -= 1;
      });
  
      if (score > 0) return 'positive';
      if (score < 0) return 'negative';
      return 'neutral';
    }
  
    // 응답의 일관성 분석
    analyzeCoherence(responses) {
      // 일관성 분석 로직 구현
      // 응답 내용의 논리적 일관성을 평가합니다.
      let incoherentCount = 0;
  
      responses.forEach(response => {
        const answer = response.answer;
  
        // 간단한 문법 검사 (예: 문장의 길이, 특수문자 여부)
        if (answer.length < 2 || /[^ㄱ-ㅎ가-힣0-9\s\.\,\?]/.test(answer)) {
          incoherentCount += 1;
        }
  
        // 의미 없는 대답 필터링
        const meaninglessAnswers = ['모르겠어요', '잘 모르겠어요', '응', '아니오'];
        if (meaninglessAnswers.includes(answer.trim())) {
          incoherentCount += 1;
        }
      });
  
      const coherenceScore = ((responses.length - incoherentCount) / responses.length) * 100;
      return coherenceScore >= 70 ? 'coherent' : 'incoherent';
    }
  
    // 응답 시간 패턴 분석
    analyzeTimePattern(responses) {
      // 응답 시간 간격을 분석하여 패턴 파악
      const timeIntervals = [];
      for (let i = 1; i < responses.length; i++) {
        const prevTime = new Date(responses[i - 1].timestamp);
        const currentTime = new Date(responses[i].timestamp);
        const interval = (currentTime - prevTime) / 1000; // 초 단위
        timeIntervals.push(interval);
      }
  
      // 평균 응답 시간 계산
      const averageTime = timeIntervals.reduce((a, b) => a + b, 0) / timeIntervals.length;
  
      // 응답 시간이 너무 길거나 짧은 경우 확인
      const abnormalResponses = timeIntervals.filter(interval => interval > 30 || interval < 1).length;
      const consistencyScore = ((timeIntervals.length - abnormalResponses) / timeIntervals.length) * 100;
  
      return consistencyScore >= 80 ? 'consistent' : 'inconsistent';
    }
  }
  
  // 추천 시스템 클래스
  class RecommendationSystem {
    constructor() {
      this.programs = {
        beginner: [
          { id: 1, title: '기초 기억력 훈련', duration: '15분' },
          { id: 2, title: '간단한 퍼즐 게임', duration: '10분' },
        ],
        intermediate: [
          { id: 3, title: '중급 패턴 인식', duration: '20분' },
          { id: 4, title: '순서 맞추기 게임', duration: '15분' },
        ],
        advanced: [
          { id: 5, title: '복합 문제 해결', duration: '25분' },
          { id: 6, title: '전략 게임', duration: '30분' },
        ],
      };
    }
  
    // 인지 점수에 따른 추천 프로그램 제공
    getRecommendations(cognitiveScore) {
      if (cognitiveScore < 40) return this.programs.beginner;
      if (cognitiveScore < 70) return this.programs.intermediate;
      return this.programs.advanced;
    }
  }
  
  export { ResponseAnalyzer, RecommendationSystem };
  
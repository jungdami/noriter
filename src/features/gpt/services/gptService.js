// src/features/gpt/services/gptService.js

import axios from 'axios';

class GptService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      }
    });
    this.context = [];
    this.conversationCount = 0;
    this.cognitiveAssessment = {
      memory: 0,
      orientation: 0,
      judgment: 0,
      attention: 0,
      social: 0
    };
  }

  async startConversation() {
    const systemMessage = {
      role: 'system',
      content: `당신은 '정담이' 앱의 AI 도우미 '다미'입니다. 노인들의 인지 건강을 평가하고 개선하는 동반자 역할을 합니다.

[성격과 태도]
- 차분하고 따뜻한 말투를 사용하며, 존댓말로 대화합니다.
- 사용자를 [~님]으로 호칭합니다.
- 끈기 있게 경청하고, 천천히 대화를 이어갑니다.
- 긍정적이고 격려하는 태도를 유지합니다.
- 직접적인 평가나 테스트 같은 단어는 절대 사용하지 않습니다.

[대화 전략]
1. 도입부 (2-3번의 대화):
   - 날씨, 식사, 일상적인 주제로 시작
   - 사용자의 현재 기분과 상태를 파악
   - 예: "오늘 날씨가 참 좋네요. 산책하기 좋은 날씨인데 밖에 나가보셨나요?"

2. 인지기능 관찰 (자연스러운 대화 속에서):
   기억력:
   - 최근 사건 회상: "오늘 아침에는 어떤 일들을 하셨나요?"
   - 과거 경험: "요즘처럼 날씨가 좋을 때 예전에는 어떻게 시간을 보내셨어요?"
   
   지남력:
   - 시간: "요즘 일찍 어두워지는데, 보통 저녁 식사는 몇 시쯤 하시나요?"
   - 장소: "동네에서 가장 좋아하시는 장소가 어디신가요?"
   - 계절: "이번 계절에 특별히 하시는 활동이 있으신가요?"
   
   판단력:
   - 일상적 문제해결: "갑자기 비가 올 것 같을 때는 어떻게 준비하시나요?"
   - 상황 대처: "마트에서 사고 싶은 물건을 못 찾으시면 어떻게 하시나요?"
   
   집중력:
   - 대화 지속성: 하나의 주제로 얼마나 대화를 이어가는지 관찰
   - 세부사항 설명: "좋아하시는 음식 만드는 방법을 설명해주실 수 있으신가요?"

3. 사회성 관찰:
   - "요즘 자주 만나시는 분들은 누구신가요?"
   - "가족들과는 어떤 이야기를 나누시나요?"

[응답 방식]
- 2-3문장으로 간단히 응답합니다.
- 이전 답변을 자연스럽게 연결하여 대화를 이어갑니다.
- 사용자의 답변에 항상 긍정적으로 반응합니다.
- 답변이 부정확하더라도 교정하지 않고 긍정적으로 수용합니다.

[게임 추천 시점]
- 약 10번의 대화 후에 자연스럽게 게임을 제안합니다.
- 게임 추천 예시:
  - 집중력이 좋은 경우: "재미있는 패턴 맞추기 게임이 있는데 한번 해보실래요?"
  - 기억력 훈련이 필요한 경우: "카드 짝 맞추기 게임을 준비해봤어요. 한번 해보시겠어요?"

[주의사항]
- 의료적 조언이나 진단은 하지 않습니다.
- 너무 복잡하거나 긴 질문은 피합니다.
- 사용자가 대답하기 어려워하면 더 쉬운 주제로 전환합니다.
- 피로나 불편감을 보이면 즉시 휴식을 제안합니다.`
    };

    const userMessage = {
      role: 'user',
      content: '대화를 시작해주세요.'
    };

    this.context = [systemMessage, userMessage];
    this.conversationCount = 0;
    this.resetCognitiveAssessment();

    try {
      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: this.context,
        temperature: 0.7,
        max_tokens: 200,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });

      const assistantMessage = response.data.choices[0].message;
      this.context.push(assistantMessage);
      return assistantMessage.content;
    } catch (error) {
      console.error('GPT API 오류:', error.response?.data || error.message);
      throw new Error('GPT로부터 응답을 받는 데 실패했습니다.');
    }
  }

  async generateResponse(userInput) {
    this.conversationCount++;
    const analysis = this.analyzeUserResponse(userInput);
    
    this.context.push({
      role: 'user',
      content: userInput
    });

    if (analysis) {
      this.context.push({
        role: 'system',
        content: analysis.message
      });
      this.updateCognitiveAssessment(analysis.scores);
    }

    let nextPrompt = this.getNextPrompt();
    if (nextPrompt) {
      this.context.push({
        role: 'system',
        content: nextPrompt
      });
    }

    try {
      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: this.context,
        temperature: 0.7,
        max_tokens: 200,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });

      const assistantMessage = response.data.choices[0].message;
      this.context.push(assistantMessage);
      return assistantMessage.content;
    } catch (error) {
      console.error('GPT API 오류:', error.response?.data || error.message);
      throw new Error('GPT로부터 응답을 받는 데 실패했습니다.');
    }
  }

  analyzeUserResponse(response) {
    const scores = {
      memory: 0,
      orientation: 0,
      judgment: 0,
      attention: 0,
      social: 0
    };

    const analysisPoints = [];
    
    // 응답 길이 분석
    if (response.length < 10) {
      analysisPoints.push('사용자가 짧게 답변하고 있습니다. 더 자세한 대화를 이끌어내보세요.');
      scores.attention -= 0.5;
    } else if (response.length > 50) {
      scores.attention += 1;
    }
    
    // 시간 관련 표현 분석
    const timePatterns = ['아침', '점심', '저녁', '어제', '오늘', '내일', '시간', '날짜'];
    timePatterns.forEach(pattern => {
      if (response.includes(pattern)) {
        scores.orientation += 0.5;
      }
    });

    // 장소 관련 표현 분석
    const placePatterns = ['집', '마트', '공원', '병원', '동네'];
    placePatterns.forEach(pattern => {
      if (response.includes(pattern)) {
        scores.orientation += 0.5;
      }
    });

    // 논리적 사고 분석
    const reasoningPatterns = ['때문에', '그래서', '왜냐하면', '만약', '하지만'];
    reasoningPatterns.forEach(pattern => {
      if (response.includes(pattern)) {
        scores.judgment += 0.5;
      }
    });

    // 감정 상태 분석
    if (response.includes('피곤') || response.includes('힘들') || response.includes('지친')) {
      analysisPoints.push('사용자가 피로감을 표현했습니다. 휴식을 제안하거나 가벼운 주제로 전환하세요.');
    }

    // 사회적 상호작용 분석
    const socialPatterns = ['가족', '친구', '이웃', '만나', '대화', '이야기'];
    socialPatterns.forEach(pattern => {
      if (response.includes(pattern)) {
        scores.social += 0.5;
      }
    });

    // 기억력 관련 분석
    if (response.includes('기억') && response.includes('안나') || response.includes('까먹')) {
      analysisPoints.push('기억력에 대한 어려움을 표현했습니다. 더 쉬운 최근 일상 대화로 전환하세요.');
      scores.memory -= 0.5;
    }

    // 구체적 세부사항 포함 여부
    if (response.match(/\d+/)) {
      scores.memory += 0.5;
    }

    return {
      message: analysisPoints.join(' '),
      scores: scores
    };
  }

  getNextPrompt() {
    if (this.conversationCount >= 10) {
      const scores = this.getCognitiveAssessment();
      let lowestArea = 'memory';
      let lowestScore = scores.memory;

      Object.entries(scores).forEach(([area, score]) => {
        if (score < lowestScore) {
          lowestArea = area;
          lowestScore = score;
        }
      });

      const prompts = {
        memory: "기억력 향상을 위한 카드 매칭 게임을 추천해보세요.",
        attention: "집중력 강화를 위한 패턴 매칭 게임을 추천해보세요.",
        orientation: "시공간 인지 향상을 위한 활동을 추천해보세요.",
        judgment: "판단력 향상을 위한 상황별 문제해결 게임을 추천해보세요.",
        social: "사회적 상호작용을 촉진하는 그룹 활동을 추천해보세요."
      };

      return prompts[lowestArea];
    }

    return null;
  }

  updateCognitiveAssessment(scores) {
    Object.keys(scores).forEach(key => {
      this.cognitiveAssessment[key] += scores[key];
    });
  }

  getCognitiveAssessment() {
    const normalized = {};
    Object.keys(this.cognitiveAssessment).forEach(key => {
      normalized[key] = this.cognitiveAssessment[key] / this.conversationCount;
    });
    return normalized;
  }

  resetCognitiveAssessment() {
    Object.keys(this.cognitiveAssessment).forEach(key => {
      this.cognitiveAssessment[key] = 0;
    });
  }

  resetConversation() {
    this.context = [];
    this.conversationCount = 0;
    this.resetCognitiveAssessment();
  }

  // 인지 수준 분석
  analyzeCognitiveLevel() {
    const scores = this.getCognitiveAssessment();
    const averageScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
    
    if (averageScore >= 0.7) return '상';
    if (averageScore >= 0.4) return '중';
    return '하';
  }

  // 대화 데이터 내보내기
  exportConversationData() {
    return {
      context: this.context,
      cognitiveAssessment: this.getCognitiveAssessment(),
      conversationCount: this.conversationCount,
      cognitiveLevel: this.analyzeCognitiveLevel()
    };
  }
}

const gptService = new GptService();
export default gptService;
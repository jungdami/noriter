// src/features/gpt/services/gptService.js

class GptService {
  constructor() {
    this.messages = [];
    this.messageCount = 0;
  }

  async startConversation() {
    const initialMessage = "안녕하세요! 오늘 날씨가 맑고 따뜻하네요. 산책하기 좋은 날이에요. 오늘 어디 가보실 계획 있으신가요?";
    this.messages = [{role: 'ai', content: initialMessage}];
    return initialMessage;
  }

  async generateResponse(userInput) {
    this.messages.push({ role: 'user', content: userInput });
    this.messageCount++;

    // 시연용 고정 응답
    let response;
    if (this.messageCount === 1) {
      response = "아, 그렇군요. 그럼 집에서 할 만한 활동을 추천해 드릴까요? 어르신이 예전에 말씀하셨던 독서 취미는 어떠세요?";
    } else if (this.messageCount === 2) {
      response = "오늘 아침에는 어떤 음식을 드셨나요?";
    } else if (this.messageCount === 3) {
      response = "된장찌개 맛있죠! 오늘 저녁도 한식으로 드실 계획이신가요?";
    } else if (this.messageCount >= 6) {
      response = "우리 이제 재미있는 게임 한번 해볼까요? 제가 게임방으로 안내해드릴게요!";
    } else {
      response = "네, 잘 알겠습니다. 말씀해 주셔서 감사해요. 다른 이야기도 들려주시겠어요?";
    }

    this.messages.push({ role: 'ai', content: response });
    return response;
  }

  exportConversationData() {
    return {
      cognitiveLevel: '상',
      cognitiveAssessment: {
        memory: 85,
        orientation: 90,
        attention: 88
      }
    };
  }
}

const gptService = new GptService();
export default gptService;
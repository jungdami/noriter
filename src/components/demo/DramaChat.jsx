import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextToSpeech } from '../../features/speech/components/TextToSpeech';
import { Brain, Heart, Star } from 'lucide-react';

const DramaChat = ({ onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [currentStage, setCurrentStage] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [canProgress, setCanProgress] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  
  // 시나리오 대화
  const conversation = [
    {
      id: 1,
      speaker: 'ai',
      message: "어머, 김순자 이웃님! 오늘도 참 좋아 보이세요. 밖을 보니 날씨가 많이 쌀쌀해졌더라고요. 요즘은 어떻게 지내고 계세요?"
    },
    {
      id: 2,
      speaker: 'user',
      message: "아이고, 날씨가 추워져서 아침에 공원 산책하기가 힘들어졌어."
    },
    {
      id: 3,
      speaker: 'ai',
      message: "아, 전에 말씀하셨던 그 공원이요? 단풍도 예쁘게 들었을 것 같은데, 대신 실내에서 할 수 있는 재미있는 활동을 찾아보는 건 어떠세요?"
    },
    {
      id: 4,
      speaker: 'ai',
      message: "어제는 무슨 드라마 보셨어요? 요즘 '무자식 상팔자'라고 재미있는 드라마가 한창이던데."
    },
    {
      id: 5,
      speaker: 'user',
      message: "맞아, 나도 어제 그거 봤어. 큰 며느리하고 작은 며느리가 싸우는 게 우리 집 얘기 같더라고."
    },
    {
      id: 6,
      speaker: 'ai',
      message: "어머, 재미있으시죠? 그런데 보면서 답답하진 않으셨어요? 제가 어제 본 장면에서는 할머니가 손주한테 옛날이야기 해주시는 게 참 감동적이더라고요."
    },
    {
      id: 7,
      speaker: 'ai',
      message: "아, 그러고 보니 이웃님께서 화투 좋아하신다고 하셨죠? 제가 재미있는 카드 게임을 준비해봤어요. 화투패로 짝 맞추기 게임은 어떠세요?"
    }
  ];

  // 키보드 이벤트 리스너
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space' && canProgress && !isSpeaking) {
        event.preventDefault();
        progressConversation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canProgress, isSpeaking]);

  // 대화 진행
  const progressConversation = useCallback(() => {
    if (currentStage < conversation.length - 1) {
      setCurrentStage(prev => prev + 1);
      setCanProgress(false);
      setShowPrompt(false);
    } else {
      onComplete?.();
    }
  }, [currentStage, conversation.length, onComplete]);

  // 새 메시지 표시
  useEffect(() => {
    if (currentStage >= 0 && currentStage < conversation.length) {
      const currentMessage = conversation[currentStage];
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: currentMessage.message,
        type: currentMessage.speaker
      }]);
    }
  }, [currentStage]);

  // 음성 상태 변경 핸들러
  const handleSpeakingChange = useCallback((speaking) => {
    setIsSpeaking(speaking);
    if (!speaking) {
      setCanProgress(true);
      setShowPrompt(true);
    }
  }, []);

  // 컴포넌트 마운트 시 첫 대화 시작
  useEffect(() => {
    if (currentStage === -1) {
      setCurrentStage(0);
    }
  }, []);

  const MetricsDisplay = React.memo(() => (
    <div className="flex justify-around bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-blue-500" />
        <div className="text-sm">
          <div className="font-semibold">기억력</div>
          <div className="text-blue-500">85%</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-purple-500" />
        <div className="text-sm">
          <div className="font-semibold">이해력</div>
          <div className="text-purple-500">90%</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-500" />
        <div className="text-sm">
          <div className="font-semibold">참여도</div>
          <div className="text-red-500">95%</div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="space-y-4">
      <MetricsDisplay />
      
      <div className="bg-white rounded-xl shadow-sm p-4 h-96 overflow-y-auto">
        {messages.map(message => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {message.content}
              {message.type === 'ai' && (
                <div className="mt-2">
                  <TextToSpeech 
                    text={message.content}
                    onSpeakingChange={handleSpeakingChange}
                    autoPlay={true}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm">
        <div className={`text-center transition-opacity duration-300 ${
          showPrompt ? 'opacity-100' : 'opacity-0'
        }`}>
          {canProgress && !isSpeaking ? (
            <div className="text-blue-600 font-medium">
              스페이스바를 눌러서 계속하기
            </div>
          ) : (
            <div className="text-gray-500">
              {isSpeaking ? '대화 진행 중...' : '잠시만 기다려주세요...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DramaChat;
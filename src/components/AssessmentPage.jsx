import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraComponent } from '../features/camera/components/CameraComponent';
import { SpeechToText } from '../features/speech/components/SpeechToText';
import { TextToSpeech } from '../features/speech/components/TextToSpeech';
import gptService from '../features/gpt/services/gptService';
import sessionService from '../features/gpt/services/sessionService';
import { Loader2, AudioWaveform } from 'lucide-react';

const REQUIRED_MESSAGES = 12; // 6번의 왕복 대화

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [error, setError] = useState(null);

  const chatContainerRef = useRef(null);
  const messageCountRef = useRef(0);

  // 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 추가
  const addMessage = useCallback((sender, content) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender,
      content: content.trim()
    }]);
    messageCountRef.current += 1;

    // 일정 메시지 수 이후 게임 추천
    if (messageCountRef.current >= REQUIRED_MESSAGES) {
      setTimeout(handleEndSession, 2000);
    }
  }, []);

  // 사용자 감지 처리
  const handleUserDetected = useCallback(async (detected) => {
    if (detected && !sessionId) {
      console.log('사용자 감지, 대화 시작');
      startConversation();
    }
  }, [sessionId]);

  // 대화 시작
  const startConversation = useCallback(async () => {
    if (sessionId) return;
    
    try {
      setIsProcessing(true);
      setError(null);

      // 세션 생성
      const session = sessionService.create();
      setSessionId(session.id);

      const response = await gptService.startConversation();
      addMessage('ai', response);
    } catch (error) {
      console.error('대화 시작 오류:', error);
      setError('대화 시작에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, addMessage]);

  // 음성 인식 결과 처리
  const handleTranscriptChange = useCallback(async (transcript) => {
    if (!transcript || isProcessing || !sessionId) return;

    try {
      setIsProcessing(true);
      addMessage('user', transcript);

      const response = await gptService.generateResponse(transcript);
      
      // 세션 데이터 저장
      sessionService.saveResponse(sessionId, transcript, response);
      
      addMessage('ai', response);
    } catch (error) {
      console.error('응답 생성 오류:', error);
      setError('응답 생성에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, isProcessing, addMessage]);

  // 게임으로 전환
  const handleEndSession = useCallback(() => {
    const gameResponse = "지금까지 좋은 대화 감사합니다. 이제 재미있는 게임을 해보시는 건 어떠세요?";
    addMessage('ai', gameResponse);

    if (sessionId) {
      // 세션 데이터 업데이트
      const conversationData = gptService.exportConversationData();
      sessionService.update(sessionId, {
        endTime: new Date().toISOString(),
        status: 'completed',
        cognitiveLevel: conversationData.cognitiveLevel,
        assessment: conversationData.cognitiveAssessment
      });
    }

    // 3초 후 게임으로 전환
    setTimeout(() => {
      const gameType = Math.random() > 0.5 ? 'pattern' : 'memory';
      navigate(`/game/${gameType}`);
    }, 3000);
  }, [sessionId, navigate, addMessage]);

  // 음성 상태 관리
  const handleListeningChange = useCallback((listening) => {
    setIsListening(listening);
  }, []);

  const handleSpeakingChange = useCallback((speaking) => {
    setIsSpeaking(speaking);
  }, []);

  // 오디오 토글
  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 카메라 영역 */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <CameraComponent onUserDetected={handleUserDetected} />
        {!sessionId && (
          <button
            onClick={startConversation}
            className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg
                     hover:bg-green-600 transition-colors"
          >
            대화 시작하기
          </button>
        )}
      </div>

      {/* 대화 영역 */}
      <div className="bg-white p-4 rounded-lg shadow-md h-[500px] flex flex-col">
        {/* 상단 컨트롤 */}
        <div className="flex justify-end mb-2">
          <button
            onClick={toggleAudio}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${
              audioEnabled 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <AudioWaveform className="w-4 h-4" />
            <span className="text-sm">
              {audioEnabled ? '소리 켜짐' : '소리 꺼짐'}
            </span>
          </button>
        </div>

        {/* 메시지 목록 */}
        <div 
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto space-y-4 mb-4 p-4"
        >
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>생각하고 있어요...</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* 음성 인터페이스 */}
        <div className="border-t pt-4">
          <TextToSpeech 
            text={messages[messages.length - 1]?.content}
            onSpeakingChange={handleSpeakingChange}
            autoPlay={messages[messages.length - 1]?.sender === 'ai' && audioEnabled}
          />
          
          <div className="mt-4">
            <SpeechToText
              onTranscriptChange={handleTranscriptChange}
              onListeningChange={handleListeningChange}
              disabled={isSpeaking || isProcessing || !sessionId}
              autoStart={!isSpeaking && !isProcessing && !!sessionId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
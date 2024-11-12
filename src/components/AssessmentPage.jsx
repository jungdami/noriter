// src/components/AssessmentPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraComponent } from '../features/camera/components/CameraComponent';
import { SpeechToText } from '../features/speech/components/SpeechToText';
import { TextToSpeech } from '../features/speech/components/TextToSpeech';
import gptService from '../features/gpt/services/gptService';  // 수정됨: new 키워드 없이 직접 가져오기
import sessionService from '../features/gpt/services/sessionService';
import { MessageCircle, Loader2 } from 'lucide-react';

const AssessmentPage = () => {
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [cognitiveLevel, setCognitiveLevel] = useState(null);
  const navigate = useNavigate();

  const chatContainerRef = useRef(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startConversation = async () => {
    // 세션 생성
    const sessionData = sessionService.create();  // createSessionData 대신 create 사용
    setSessionId(sessionData.id);

    try {
      setIsProcessing(true);
      const initialResponse = await gptService.startConversation();
      addMessage('ai', initialResponse);
    } catch (error) {
      console.error('Conversation start error:', error);
      setError('대화를 시작하는 데 문제가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndSession = () => {
    const conversationData = gptService.exportConversationData();
    sessionService.update(sessionId, {  // updateSession 대신 update 사용
      cognitiveLevel: conversationData.cognitiveLevel,
      assessment: conversationData.cognitiveAssessment,
      endTime: new Date().toISOString(),
      status: 'completed'
    });

    const gameType = conversationData.cognitiveLevel === '상' ? 'pattern' : 'memory';
    navigate(`/game/${gameType}`);
  };

  const addMessage = (sender, content) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender,
      content
    }]);
  };

  const handleTranscriptChange = async (newTranscript) => {
    setTranscript(newTranscript);
    setIsProcessing(true);
    setError(null);
    addMessage('user', newTranscript);

    try {
      const response = await gptService.generateResponse(newTranscript);
      addMessage('ai', response);
      
      sessionService.saveResponse(sessionId, newTranscript, response);

      if (messages.length >= 10) {
        const level = gptService.analyzeCognitiveLevel();
        setCognitiveLevel(level);
      }
    } catch (error) {
      console.error('Response generation error:', error);
      setError(error.message);
      addMessage('ai', '죄송합니다. 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <CameraComponent />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md h-[500px] flex flex-col">
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
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>다미가 생각하고 있어요...</span>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p>{error}</p>
              <p className="text-sm mt-1">잠시 후 다시 시도해 주세요.</p>
            </div>
          )}

          <div className="border-t pt-4 space-y-4">
            <TextToSpeech text={messages[messages.length - 1]?.content} />
            
            <div className="flex items-center space-x-2">
              <SpeechToText onTranscriptChange={handleTranscriptChange} />
              <button
                onClick={handleEndSession}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                활동 시작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraComponent } from '../features/camera/components/CameraComponent';
import { SpeechToText } from '../features/speech/components/SpeechToText';
import { TextToSpeech } from '../features/speech/components/TextToSpeech';
import gptService from '../features/gpt/services/gptService';
import sessionService from '../features/gpt/services/sessionService';
import { Loader2 } from 'lucide-react';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const chatContainerRef = useRef(null);
  const messageCountRef = useRef(0);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startConversation = async () => {
    if (sessionId) return;
    
    try {
      setIsProcessing(true);
      const session = sessionService.create();
      setSessionId(session.id);

      const response = await gptService.startConversation();
      addMessage('ai', response);
      setIsReady(true);
    } catch (error) {
      console.error('Start error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUserDetected = (detected) => {
    if (detected && !sessionId) {
      startConversation();
    }
  };

  const addMessage = (sender, content) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender,
      content
    }]);
    messageCountRef.current += 1;
  };

  const handleTranscriptChange = async (transcript) => {
    if (!transcript || isProcessing || !sessionId) return;

    try {
      setIsProcessing(true);
      addMessage('user', transcript);

      const response = await gptService.generateResponse(transcript);
      addMessage('ai', response);
      
      sessionService.saveResponse(sessionId, transcript, response);

      // 메시지 6개 이상이면 게임으로 전환
      if (messageCountRef.current >= 12) {
        setTimeout(() => {
          navigate('/game/pattern');
        }, 5000);
      }

    } catch (error) {
      console.error('Response error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <CameraComponent onUserDetected={handleUserDetected} />
        {!sessionId && (
          <button
            onClick={startConversation}
            className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            대화 시작하기
          </button>
        )}
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
            <div className="flex justify-center">
              <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>생각하고 있어요...</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <TextToSpeech 
            text={messages[messages.length - 1]?.content}
            onSpeakingChange={setIsSpeaking}
            autoPlay={messages[messages.length - 1]?.sender === 'ai'}
          />
          <div className="mt-4">
            <SpeechToText
              onTranscriptChange={handleTranscriptChange}
              disabled={isSpeaking || isProcessing || !isReady}
              autoStart={!isSpeaking && !isProcessing && isReady}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraComponent } from '../features/camera/components/CameraComponent';
import { SpeechToText } from '../features/speech/components/SpeechToText';
import { TextToSpeech } from '../features/speech/components/TextToSpeech';
import gptService from '../features/gpt/services/gptService';
import sessionService from '../features/gpt/services/sessionService';
import { Mic, Loader2, AudioWaveform } from 'lucide-react';

const AssessmentPage = () => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [cognitiveLevel, setCognitiveLevel] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isUserDetected, setIsUserDetected] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [autoListening, setAutoListening] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserDetected = (detected) => {
    console.log("User detected:", detected);
    setIsUserDetected(detected);
    if (detected && !conversationStarted) {
      startConversation();
    }
  };

  const startConversation = async () => {
    if (conversationStarted) return;

    try {
      setIsProcessing(true);
      setError(null);

      const sessionData = sessionService.create();
      setSessionId(sessionData.id);
      console.log("Session created:", sessionData.id);

      const initialResponse = await gptService.startConversation();
      console.log("Initial response:", initialResponse);

      addMessage('ai', initialResponse);
      setConversationStarted(true);
    } catch (error) {
      console.error('Conversation start error:', error);
      setError('대화를 시작하는 데 문제가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const addMessage = (sender, content) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender,
      content
    }]);
    
    // AI 응답이 추가되면 사용자 음성 인식 일시 중지
    if (sender === 'ai') {
      setIsListening(false);
    }
  };

  const handleTranscriptChange = async (newTranscript) => {
    if (!newTranscript || isProcessing) return;

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
      addMessage('ai', '죄송합니다. 잠시 후 다시 이야기해 주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpeakingChange = (speaking) => {
    setIsSpeaking(speaking);
    // AI 응답 말하기가 끝나면 자동으로 사용자 음성 인식 시작
    if (!speaking && autoListening) {
      setIsListening(true);
    }
  };

  const handleListeningChange = (listening) => {
    setIsListening(listening);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const handleEndSession = () => {
    const conversationData = gptService.exportConversationData();
    sessionService.update(sessionId, {
      cognitiveLevel: conversationData.cognitiveLevel,
      assessment: conversationData.cognitiveAssessment,
      endTime: new Date().toISOString(),
      status: 'completed'
    });

    navigate(`/game/${conversationData.cognitiveLevel === '상' ? 'pattern' : 'memory'}`);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <CameraComponent onUserDetected={handleUserDetected} />
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-700 mb-3">
              {isUserDetected 
                ? "얼굴이 잘 보이네요!"
                : "화면에 얼굴이 잘 보이도록 해주세요."}
            </p>
            {!conversationStarted && (
              <>
                <p className="text-gray-600 text-sm mb-3">
                  카메라 {isUserDetected ? '인식과 함께' : '없이도'} 대화할 수 있어요.
                </p>
                <button
                  onClick={startConversation}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  이야기 시작하기
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md h-[500px] flex flex-col">
          {!conversationStarted ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>위의 '이야기 시작하기' 버튼을 눌러주세요.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-end mb-2">
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
                
                <div className="flex justify-center">
                  {isProcessing && (
                    <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>생각하고 있어요...</span>
                    </div>
                  )}
                  {isSpeaking && (
                    <div className="flex items-center space-x-2 text-blue-500 bg-blue-50 px-4 py-2 rounded-full">
                      <AudioWaveform className="w-5 h-5 animate-pulse" />
                      <span>말하고 있어요...</span>
                    </div>
                  )}
                  {isListening && !isSpeaking && (
                    <div className="flex items-center space-x-2 text-green-500 bg-green-50 px-4 py-2 rounded-full">
                      <Mic className="w-5 h-5 animate-pulse" />
                      <span>듣고 있어요...</span>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <p>{error}</p>
                  <p className="text-sm mt-1">잠시 후 다시 시도해 주세요.</p>
                </div>
              )}

              <div className="border-t pt-4">
                <TextToSpeech 
                  text={messages[messages.length - 1]?.content}
                  autoPlay={messages[messages.length - 1]?.sender === 'ai' && audioEnabled}
                  onSpeakingChange={handleSpeakingChange}
                  hideButton={true}
                />
                
                <div className="flex items-center justify-between mt-4">
                  <SpeechToText 
                    onTranscriptChange={handleTranscriptChange}
                    onListeningChange={handleListeningChange}
                    disabled={isSpeaking || isProcessing}
                    autoStart={true}
                    forceStart={!isSpeaking && autoListening}
                  />
                  
                  {messages.length >= 10 && (
                    <button
                      onClick={handleEndSession}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      게임 시작하기
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
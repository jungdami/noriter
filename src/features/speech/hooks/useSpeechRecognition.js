import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  // Speech Recognition 객체 생성
  const recognition = new (window.SpeechRecognition ||
                         window.webkitSpeechRecognition)();

  // 설정
  useEffect(() => {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';  // 한국어 설정

    // 이벤트 핸들러 등록
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };
  }, []);

  // 시작/중지 함수
  const startListening = useCallback(() => {
    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error('음성 인식 시작 오류:', error);
    }
  }, []);

  const stopListening = useCallback(() => {
    recognition.stop();
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  };
};

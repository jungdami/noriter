import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognition = new (window.SpeechRecognition ||
                         window.webkitSpeechRecognition)();

  useEffect(() => {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';

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

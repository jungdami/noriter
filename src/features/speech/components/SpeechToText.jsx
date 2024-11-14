import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

export const SpeechToText = ({ 
  onTranscriptChange, 
  onListeningChange,
  disabled = false,
  autoStart = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // 음성 인식 시작 함수
  const startRecognition = useCallback(() => {
    try {
      if (recognition && !isListening && !disabled) {
        recognition.start();
      }
    } catch (error) {
      console.error('Speech recognition start error:', error);
    }
  }, [recognition, isListening, disabled]);

  // 음성 인식 중지 함수
  const stopRecognition = useCallback(() => {
    try {
      if (recognition && isListening) {
        recognition.stop();
      }
    } catch (error) {
      console.error('Speech recognition stop error:', error);
    }
  }, [recognition, isListening]);

  // 음성 인식 초기화
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = 'ko-KR';

      newRecognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        onListeningChange?.(true);
      };

      newRecognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        onListeningChange?.(false);
        // 자동 시작이 활성화되어 있고 비활성화되지 않은 경우에만 재시작
        if (autoStart && !disabled) {
          setTimeout(() => startRecognition(), 300);
        }
      };

      newRecognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        if (event.results[0].isFinal) {
          onTranscriptChange?.(transcript);
        }
      };

      newRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        onListeningChange?.(false);
      };

      setRecognition(newRecognition);

      return () => {
        newRecognition.onend = null;
        newRecognition.onstart = null;
        newRecognition.onresult = null;
        newRecognition.onerror = null;
        stopRecognition();
      };
    }
  }, [onTranscriptChange, onListeningChange]);

  // autoStart 처리
  useEffect(() => {
    if (autoStart && !disabled && recognition && !isListening) {
      startRecognition();
    }
  }, [autoStart, disabled, recognition, isListening, startRecognition]);

  // disabled 상태 변경 처리
  useEffect(() => {
    if (disabled && isListening) {
      stopRecognition();
    } else if (!disabled && autoStart && !isListening) {
      startRecognition();
    }
  }, [disabled, autoStart, isListening, startRecognition, stopRecognition]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }, [isListening, startRecognition, stopRecognition]);

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : isListening
          ? 'bg-green-100 text-green-600 hover:bg-green-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      <span>{isListening ? '듣는 중...' : '말하기'}</span>
    </button>
  );
};
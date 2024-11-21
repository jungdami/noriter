import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

export const SpeechToText = ({
  onTranscriptChange,
  onListeningChange,
  disabled = false,
  autoStart = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';

    recognition.onstart = () => {
      setIsListening(true);
      onListeningChange?.(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      onListeningChange?.(false);
      if (autoStart && !disabled) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
          }
        }, 300);
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }

      if (finalTranscript) {
        onTranscriptChange?.(finalTranscript.trim());
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [onTranscriptChange, onListeningChange, autoStart, disabled]);

  useEffect(() => {
    if (autoStart && !disabled && recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  }, [autoStart, disabled, isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  };

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
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
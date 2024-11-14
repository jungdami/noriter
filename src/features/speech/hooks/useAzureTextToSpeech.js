import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';

export const useAzureTextToSpeech = (options = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);

  const settings = useMemo(() => ({
    voice: 'ko-KR-SoonBokNeural',
    style: 'calm',
    rate: '1',
    pitch: '1',
    ...options
  }), [options]);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const speak = useCallback(async (text) => {
    if (!text) return;
    
    try {
      cleanup();
      setError(null);
      
      // 임시 해결책: Web Speech API 사용
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setError('음성 재생 중 오류가 발생했습니다.');
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
      setError('음성 변환 중 오류가 발생했습니다.');
      setIsSpeaking(false);
    }
  }, [cleanup]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    cleanup();
    setIsSpeaking(false);
  }, [cleanup]);

  return {
    isSpeaking,
    error,
    speak,
    stop
  };
};
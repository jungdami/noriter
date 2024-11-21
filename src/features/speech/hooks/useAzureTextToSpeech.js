import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { azureTtsApi } from '../api/azureTtsApi';

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

  const generateSSML = useCallback((text) => {
    return `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ko-KR">
        <voice name="${settings.voice}">
          <prosody rate="${settings.rate}" pitch="${settings.pitch}">
            <mstts:express-as style="${settings.style}" xmlns:mstts="http://www.w3.org/2001/mstts">
              ${text}
            </mstts:express-as>
          </prosody>
        </voice>
      </speak>
    `;
  }, [settings]);

  const speak = useCallback(async (text) => {
    if (!text) return;
    
    try {
      cleanup();
      setError(null);

      const ssml = generateSSML(text);
      const audioBlob = await azureTtsApi.synthesizeSpeech(ssml);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onpause = () => setIsSpeaking(false);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioRef.current.onerror = () => {
        setError('오디오 재생 중 오류가 발생했습니다.');
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audioRef.current.play();
    } catch (err) {
      console.error('TTS error:', err);
      setError('음성 변환 중 오류가 발생했습니다.');
      setIsSpeaking(false);
    }
  }, [cleanup, generateSSML]);

  const stop = useCallback(() => {
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
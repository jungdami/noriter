import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { azureTtsApi } from '../api/azureTtsApi';

export const TextToSpeech = ({ text, autoPlay = true, onSpeakingChange }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (!text || !autoPlay) return;
    speak(text);
    return () => stop();
  }, [text, autoPlay]);

  useEffect(() => {
    onSpeakingChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingChange]);

  const speak = async (text) => {
    try {
      console.log('TTS 시작:', text);
      stop(); // 이전 음성 중지

      const ssml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ko-KR">
          <voice name="ko-KR-SunHiNeural">
            <prosody rate="1" pitch="0">
              ${text}
            </prosody>
          </voice>
        </speak>
      `;

      const audioBlob = await azureTtsApi.synthesizeSpeech(ssml);
      console.log('Audio Blob 생성 성공:', audioBlob);

      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('Audio URL:', audioUrl);

      const newAudio = new Audio(audioUrl);

      newAudio.oncanplaythrough = () => console.log('오디오 준비 완료');
      newAudio.onplay = () => {
        console.log('오디오 재생 중');
        setIsSpeaking(true);
      };
      newAudio.onended = () => {
        console.log('오디오 재생 완료');
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      newAudio.onerror = (e) => {
        console.error('오디오 오류:', e);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      setAudio(newAudio);
      newAudio.play().catch((e) => {
        console.error('오디오 재생 오류:', e);
      });
    } catch (error) {
      console.error('TTS 오류:', error);

      // 폴백: Web Speech API 사용
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    if (audio) {
      console.log('오디오 중지');
      audio.pause();
      audio.currentTime = 0;
    }
    window.speechSynthesis.cancel(); // 폴백 음성도 중지
    setIsSpeaking(false);
  };

  return (
    <button
      onClick={() => (isSpeaking ? stop() : speak(text))}
      disabled={!text}
      className={`p-2 rounded-full transition-colors ${
        text ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
      }`}
    >
      {isSpeaking ? (
        <VolumeX className="w-5 h-5 text-green-600" />
      ) : (
        <Volume2 className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

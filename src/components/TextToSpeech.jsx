// src/features/speech/components/TextToSpeech.jsx

import React, { useEffect } from 'react';
import { useAzureTextToSpeech } from '../hooks/useAzureTextToSpeech';
import { Volume2, VolumeX } from 'lucide-react';

export const TextToSpeech = ({ 
  text, 
  autoPlay = true,
  onSpeakingChange = () => {}  // speaking 상태 변경 콜백 추가
}) => {
  const {
    isSpeaking,
    error,
    speak,
    stop
  } = useAzureTextToSpeech({
    voice: 'ko-KR-SoonBokNeural',
    style: 'chat',
    rate: '1.1',
    pitch: '1'
  });

  // speaking 상태가 변경될 때마다 부모에게 알림
  useEffect(() => {
    onSpeakingChange(isSpeaking);
  }, [isSpeaking, onSpeakingChange]);

  // 새로운 메시지 자동 재생
  useEffect(() => {
    if (text && autoPlay) {
      speak(text);
    }
    return () => stop();
  }, [text, autoPlay, speak, stop]);

  return (
    <div className="flex items-center justify-end space-x-2">
      {error && (
        <span className="text-red-500 text-sm">
          음성 출력에 실패했습니다
        </span>
      )}
      <button
        onClick={() => isSpeaking ? stop() : speak(text)}
        disabled={!text}
        className={`p-2 rounded-full transition-colors ${
          text 
            ? 'hover:bg-gray-100 active:bg-gray-200' 
            : 'opacity-50 cursor-not-allowed'
        }`}
        title={isSpeaking ? '음성 중지' : '음성으로 듣기'}
      >
        {isSpeaking ? (
          <VolumeX className="w-5 h-5 text-green-600" />
        ) : (
          <Volume2 className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </div>
  );
};
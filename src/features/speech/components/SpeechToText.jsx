import React, { useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const SpeechToText = ({ onTranscriptChange }) => {
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  } = useSpeechRecognition();

  // 부모 컴포넌트에 변환된 텍스트 전달
  useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript);
    }
  }, [transcript]);

  return (
    <div className="speech-recognition">
      <button
        onClick={isListening ? stopListening : startListening}
        className={isListening ? 'active' : ''}
      >
        {isListening ? '🎤 듣는 중...' : '🎤 시작하기'}
      </button>

      {error && (
        <p className="error">
          오류가 발생했습니다: {error}
        </p>
      )}

      <p className="transcript">
        인식된 텍스트: {transcript}
      </p>
    </div>
  );
};

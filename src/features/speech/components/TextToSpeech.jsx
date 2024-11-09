import React from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

export const TextToSpeech = ({ text }) => {
  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    speak
  } = useTextToSpeech();

  return (
    <div className="text-to-speech">
      <select
        value={selectedVoice?.name}
        onChange={(e) => {
          const voice = voices.find(v => v.name === e.target.value);
          setSelectedVoice(voice);
        }}
      >
        {voices.map(voice => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>

      <button
        onClick={() => speak(text)}
        disabled={isSpeaking}
      >
        {isSpeaking ? '🔊 재생 중...' : '▶️ 재생'}
      </button>
    </div>
  );
};

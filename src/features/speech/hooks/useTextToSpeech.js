import { useState, useCallback, useEffect } from 'react';

export const useTextToSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 사용 가능한 음성 목록 가져오기
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const koreanVoices = availableVoices.filter(
        voice => voice.lang.includes('ko')
      );
      setVoices(koreanVoices);
      setSelectedVoice(koreanVoices[0]);  // 기본 음성 설정
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // 텍스트를 음성으로 변환
  const speak = useCallback((text) => {
    if (!selectedVoice) return;

    // 이전 음성 중지
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = 1.0;  // 속도
    utterance.pitch = 1.0; // 피치
    utterance.volume = 1.0; // 볼륨

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => console.error('음성 출력 오류:', event);

    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    speak
  };
};

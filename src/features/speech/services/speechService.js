export class SpeechService {
    // 음성 인식 품질 향상을 위한 설정
    getOptimalRecognitionConfig() {
      return {
        continuous: true,
        interimResults: true,
        maxAlternatives: 1,
        lang: 'ko-KR'
      };
    }
  
    // 음성 출력 품질 향상을 위한 설정
    getOptimalSynthesisConfig() {
      return {
        rate: 1.0,    // 적절한 속도
        pitch: 1.0,   // 자연스러운 피치
        volume: 1.0   // 적절한 볼륨
      };
    }
  
    // 노이즈 필터링 (간단한 구현)
    filterNoise(transcript) {
      // 불필요한 공백 제거
      let filtered = transcript.trim().replace(/\\s+/g, ' ');
  
      // 특수문자 처리
      filtered = filtered.replace(/[^\\w\\s]/gi, '');
  
      return filtered;
    }
}

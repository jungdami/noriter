// src/services/AudioService.js

class AudioService {
    constructor() {
      this.sounds = {
        cardFlip: new Audio('/sounds/card-flip.mp3'),
        cardMatch: new Audio('/sounds/card-match.mp3'),
        success: new Audio('/sounds/success.mp3'),
        levelUp: new Audio('/sounds/level-up.mp3'),
        click: new Audio('/sounds/click.mp3'),
        background: new Audio('/sounds/background.mp3')
      };
  
      // 배경음악 설정
      this.sounds.background.loop = true;
      this.sounds.background.volume = 0.3;
  
      // 효과음 볼륨 설정
      this.setEffectsVolume(0.5);
    }
  
    setEffectsVolume(volume) {
      Object.keys(this.sounds).forEach(key => {
        if (key !== 'background') {
          this.sounds[key].volume = volume;
        }
      });
    }
  
    async playSound(soundName) {
      try {
        const sound = this.sounds[soundName];
        if (sound) {
          await sound.play();
        }
      } catch (error) {
        console.error('Sound play error:', error);
      }
    }
  
    stopSound(soundName) {
      const sound = this.sounds[soundName];
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    }
  
    startBackgroundMusic() {
      this.sounds.background.play().catch(error => {
        console.error('Background music start error:', error);
      });
    }
  
    stopBackgroundMusic() {
      this.sounds.background.pause();
      this.sounds.background.currentTime = 0;
    }
  
    // 음향 효과 프리셋
    async playCardFlip() {
      await this.playSound('cardFlip');
    }
  
    async playCardMatch() {
      await this.playSound('cardMatch');
    }
  
    async playSuccess() {
      await this.playSound('success');
    }
  
    async playLevelUp() {
      await this.playSound('levelUp');
    }
  
    async playClick() {
      await this.playSound('click');
    }
  }
  
  // 싱글톤 인스턴스 생성
  const audioService = new AudioService();
  export default audioService;
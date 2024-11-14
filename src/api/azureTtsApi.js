import axios from 'axios';

const AZURE_SUBSCRIPTION_KEY = process.env.REACT_APP_AZURE_SUBSCRIPTION_KEY;
const AZURE_REGION = process.env.REACT_APP_AZURE_REGION || 'koreacentral';

export const azureTtsApi = {
  async synthesizeSpeech(ssml) {
    try {
      const response = await axios({
        method: 'post',
        url: `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_SUBSCRIPTION_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
        },
        data: ssml,
        responseType: 'arraybuffer'
      });

      return new Blob([response.data], { type: 'audio/mpeg' });
    } catch (error) {
      console.error('Azure TTS API error:', error);
      throw new Error('음성 변환 중 오류가 발생했습니다.');
    }
  }
};
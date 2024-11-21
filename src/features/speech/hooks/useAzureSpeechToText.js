import { useState, useCallback, useEffect, useRef } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

export const useAzureSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognizerRef = useRef(null);

  const startListening = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (recognizerRef.current || isListening) {
        resolve();
        return;
      }

      try {
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
          process.env.REACT_APP_AZURE_SPEECH_KEY,
          process.env.REACT_APP_AZURE_REGION
        );
        speechConfig.speechRecognitionLanguage = 'ko-KR';

        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

        const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizing = (s, e) => {
          setTranscript(e.result.text);
        };

        recognizer.recognized = (s, e) => {
          if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
            setTranscript(e.result.text);
          } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
            console.log('No speech recognized');
          }
        };

        recognizer.canceled = (s, e) => {
          console.error('음성 인식 취소:', e.reason);
          setError('음성 인식이 취소되었습니다.');
          stopListening();
          reject(new Error('음성 인식이 취소되었습니다.'));
        };

        recognizer.sessionStarted = (s, e) => {
          console.log('음성 인식 세션 시작');
          setIsListening(true);
        };

        recognizer.sessionStopped = (s, e) => {
          console.log('음성 인식 세션 종료');
          setIsListening(false);
          recognizer.close();
          recognizerRef.current = null;
        };

        recognizer.startContinuousRecognitionAsync(
          () => {
            recognizerRef.current = recognizer;
            resolve();
          },
          (err) => {
            console.error('음성 인식 시작 오류:', err);
            setError('음성 인식 시작 중 오류가 발생했습니다.');
            recognizer.close();
            recognizerRef.current = null;
            reject(err);
          }
        );
      } catch (err) {
        console.error('음성 인식 시작 오류:', err);
        setError('음성 인식 시작 중 오류가 발생했습니다.');
        reject(err);
      }
    });
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          recognizerRef.current.close();
          recognizerRef.current = null;
          setIsListening(false);
        },
        (err) => {
          console.error('음성 인식 중지 오류:', err);
        }
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  };
};

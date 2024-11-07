// src/features/camera/components/UserDetection.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@tensorflow-models/face-detection';
import * as tf from '@tensorflow/tfjs-core';
// CPU 백엔드 사용
import '@tensorflow/tfjs-backend-cpu';
// WebGL 백엔드 사용
import '@tensorflow/tfjs-backend-webgl';

export const UserDetection = ({ videoRef, onUserDetected, onUserLeft }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserPresent, setIsUserPresent] = useState(false);
  
  const modelRef = useRef(null);
  const detectionInterval = useRef(null);
  const lastDetectionTimeRef = useRef(Date.now());

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('TensorFlow 백엔드 초기화...');
        // WebGL 백엔드 사용
        await tf.setBackend('webgl');
        const backend = tf.getBackend();
        console.log('현재 백엔드:', backend);
        
        console.log('모델 로딩 시작...');
        const model = faceapi.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig = {
          runtime: 'tfjs',
          modelType: 'short',
          maxFaces: 1,
        };
        
        modelRef.current = await faceapi.createDetector(model, detectorConfig);
        console.log('모델 로딩 완료!');
        setIsLoading(false);
      } catch (error) {
        console.error('모델 로딩 실패:', error);
        setError('모델 로드 실패: ' + (error.message || '알 수 없는 오류'));
        setIsLoading(false);
      }
    };

    loadModel();

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!modelRef.current || !videoRef.current || isLoading) return;

    const detectFaces = async () => {
      if (!modelRef.current || !videoRef.current || !videoRef.current.videoWidth) {
        return;
      }

      const now = Date.now();
      if (now - lastDetectionTimeRef.current < 500) {
        return;
      }
      lastDetectionTimeRef.current = now;

      try {
        const faces = await modelRef.current.estimateFaces(videoRef.current);
        const detected = Array.isArray(faces) && faces.length > 0;

        if (detected !== isUserPresent) {
          setIsUserPresent(detected);
          if (detected) {
            console.log('사용자 감지됨!', faces[0]);
            onUserDetected?.();
          } else {
            console.log('사용자가 없습니다.');
            onUserLeft?.();
          }
        }
      } catch (error) {
        console.error('얼굴 감지 오류:', error);
      }
    };

    const intervalId = setInterval(detectFaces, 500);
    detectionInterval.current = intervalId;
    // 초기 감지 실행
    detectFaces();

    return () => {
      clearInterval(intervalId);
      detectionInterval.current = null;
    };
  }, [isLoading, videoRef, isUserPresent, onUserDetected, onUserLeft]);

  return (
    <div className="absolute top-2 right-2 p-2 bg-gray-800 bg-opacity-75 rounded text-white">
      {error ? (
        <div className="text-red-500">
          <span>⚠️ {error}</span>
        </div>
      ) : isLoading ? (
        <div className="flex items-center">
          <span className="animate-spin h-4 w-4 mr-2 border-2 border-blue-500 rounded-full border-t-transparent"></span>
          모델 로딩중...
        </div>
      ) : (
        <div className={`flex items-center ${isUserPresent ? 'text-green-500' : 'text-yellow-500'}`}>
          <span 
            className={`w-2 h-2 rounded-full mr-2 ${
              isUserPresent ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
            }`} 
          />
          {isUserPresent ? '사용자 감지됨' : '사용자 없음'}
        </div>
      )}
    </div>
  );
};
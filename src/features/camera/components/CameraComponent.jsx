import React, { useState } from 'react';
import { useCamera } from '../hooks/useCamera';
import { UserDetection } from './UserDetection';
import { SessionManager } from './SessionManager';
import { SessionStorage } from '../utils/sessionStorage'; // SessionStorage 임포트 추가

export const CameraComponent = () => {
  const {
    videoRef,
    stream,
    error,
    isLoading,
    startCamera,
    stopCamera
  } = useCamera();

  const [currentSession, setCurrentSession] = useState(null);

  const handleUserDetected = () => {
    const sessionId = SessionStorage.create({
      detectionTime: new Date().toISOString(),
      type: 'face-detection'
    });
    console.log('새 세션 시작:', sessionId);
    setCurrentSession(sessionId);
  };

  const handleUserLeft = () => {
    console.log('사용자가 화면을 벗어났습니다.');
    setCurrentSession(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-video bg-gray-900 rounded"
        />
        {stream && (
          <UserDetection
            videoRef={videoRef}
            onUserDetected={handleUserDetected}
            onUserLeft={handleUserLeft}
          />
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={startCamera}
          disabled={isLoading || stream}
          className={`px-4 py-2 rounded ${
            isLoading || stream 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isLoading ? '카메라 초기화 중...' : '카메라 시작'}
        </button>
        <button
          onClick={stopCamera}
          disabled={!stream}
          className={`px-4 py-2 rounded ${
            !stream 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          카메라 정지
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-medium">오류 발생</p>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2">
            카메라 접근 권한을 확인하시거나 다른 앱에서 카메라를 사용 중인지 확인해주세요.
          </p>
        </div>
      )}

      {currentSession && (
        <SessionManager sessionId={currentSession} />
      )}
    </div>
  );
};

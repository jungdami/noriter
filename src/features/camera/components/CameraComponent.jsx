import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCamera } from '../hooks/useCamera';
import { UserDetection } from './UserDetection';
import { Camera, XCircle } from 'lucide-react';

export const CameraComponent = ({ onUserDetected }) => {
  const {
    videoRef,
    stream,
    error,
    isLoading,
    startCamera,
    stopCamera
  } = useCamera();

  const [isUserDetected, setIsUserDetected] = useState(false);

  // 사용자 감지 시 상태 관리 및 부모 컴포넌트 통지
  const handleUserDetected = () => {
    setIsUserDetected(true);
    onUserDetected?.(true);
  };

  // 사용자가 화면을 벗어날 때 상태 관리 및 부모 컴포넌트 통지
  const handleUserLeft = () => {
    setIsUserDetected(false);
    onUserDetected?.(false);
  };

  // 카메라 스트림이 시작되고 사용자가 감지된 상태라면 부모에게 통지
  useEffect(() => {
    if (stream && videoRef.current && isUserDetected) {
      onUserDetected?.(true);
    }
  }, [stream, isUserDetected, onUserDetected]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-video bg-gray-900 rounded-lg"
        />
        
        {stream && (
          <UserDetection
            videoRef={videoRef}
            onUserDetected={handleUserDetected}
            onUserLeft={handleUserLeft}
          />
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={startCamera}
          disabled={isLoading || stream}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            isLoading || stream 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span>{isLoading ? '초기화 중...' : '카메라 시작'}</span>
        </button>
        
        <button
          onClick={stopCamera}
          disabled={!stream}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            !stream 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          <XCircle className="w-5 h-5" />
          <span>카메라 정지</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h4 className="font-medium mb-2">카메라 오류</h4>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2">
            카메라 접근 권한을 확인하시거나 다른 앱에서 카메라를 사용 중인지 확인해주세요.
          </p>
        </div>
      )}
    </div>
  );
};

CameraComponent.propTypes = {
  onUserDetected: PropTypes.func
};

CameraComponent.defaultProps = {
  onUserDetected: () => {}
};
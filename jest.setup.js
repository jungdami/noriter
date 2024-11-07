const originalError = console.error;
console.error = (...args) => {
  // 특정 에러 메시지 무시
  if (
    args[0]?.includes('Face detection error') ||
    args[0]?.includes('Warning') ||
    /Warning.*not wrapped in act/.test(args[0]) ||
    args[0]?.includes('Model loading error')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// UserDetection.jsx의 detectFaces 함수 부분 수정
const detectFaces = async () => {
  if (!modelRef.current || !videoRef.current) {
    return;
  }

  const now = Date.now();
  if (now - lastDetectionTimeRef.current < 1000) {
    return;
  }
  lastDetectionTimeRef.current = now;

  try {
    const faces = await modelRef.current.estimateFaces(videoRef.current);
    // null이나 undefined 체크 추가
    const detected = Array.isArray(faces) && faces.length > 0;

    if (detected !== isUserPresent) {
      setIsUserPresent(detected);
      if (detected) {
        onUserDetected?.();
      } else {
        onUserLeft?.();
      }
    }
  } catch (error) {
    console.error('Face detection error:', error);
    if (error.message.includes('model') || error.message.includes('runtime')) {
      setError('얼굴 감지 오류');
    }
  }
};
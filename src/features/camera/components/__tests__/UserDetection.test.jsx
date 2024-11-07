import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserDetection } from '../UserDetection';
import * as faceapi from '@tensorflow-models/face-detection';

jest.mock('@tensorflow-models/face-detection', () => ({
  SupportedModels: {
    MediaPipeFaceDetector: 'MediaPipeFaceDetector'
  },
  createDetector: jest.fn()
}));

describe('UserDetection', () => {
  const mockVideoRef = { current: { videoWidth: 640, videoHeight: 480 } };
  const mockOnUserDetected = jest.fn();
  const mockOnUserLeft = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('초기 상태에서 사용자 없음을 표시', async () => {
    const mockEstimateFaces = jest.fn().mockResolvedValue([]);
    const mockDetector = { estimateFaces: mockEstimateFaces };
    faceapi.createDetector.mockResolvedValueOnce(mockDetector);

    await act(async () => {
      render(
        <UserDetection
          videoRef={mockVideoRef}
          onUserDetected={mockOnUserDetected}
          onUserLeft={mockOnUserLeft}
        />
      );
    });

    expect(screen.getByText('사용자 없음')).toBeInTheDocument();
  });

  it('사용자가 감지되면 상태가 업데이트됨', async () => {
    // 테스트 시간 늘리기
    jest.setTimeout(30000);

    const mockEstimateFaces = jest.fn()
      .mockResolvedValueOnce([{ detection: { box: { x: 0, y: 0, width: 100, height: 100 } } }]);
    
    const mockDetector = { estimateFaces: mockEstimateFaces };
    faceapi.createDetector.mockResolvedValueOnce(mockDetector);

    let rendered;
    await act(async () => {
      rendered = render(
        <UserDetection
          videoRef={mockVideoRef}
          onUserDetected={mockOnUserDetected}
          onUserLeft={mockOnUserLeft}
        />
      );
    });

    // 모델 로딩 대기
    await act(async () => {
      // Run only one interval cycle
      jest.advanceTimersByTime(1000);
    });

    // 검증
    expect(mockEstimateFaces).toHaveBeenCalled();
    expect(mockOnUserDetected).toHaveBeenCalled();
    expect(screen.getByText('사용자 감지됨')).toBeInTheDocument();

    rendered.unmount();
  });

  it('에러 상태 처리', async () => {
    const mockError = new Error('모델 로드 실패');
    faceapi.createDetector.mockRejectedValueOnce(mockError);

    let rendered;
    await act(async () => {
      rendered = render(
        <UserDetection
          videoRef={mockVideoRef}
          onUserDetected={mockOnUserDetected}
          onUserLeft={mockOnUserLeft}
        />
      );
    });

    // 에러 상태 업데이트 대기
    await act(async () => {
      await Promise.resolve();
    });

    // 에러 메시지 검증
    const errorElement = screen.getByText('모델 로드 실패');
    expect(errorElement).toBeInTheDocument();

    rendered.unmount();
  });
});
import { renderHook } from '@testing-library/react';
import { useSession } from '../../hooks/useSession';

const mockGet = jest.fn();
const mockUpdate = jest.fn();
const mockCreate = jest.fn();
const mockDelete = jest.fn();

// Mock을 먼저 정의하고 사용
jest.mock('../../utils/sessionStorage', () => ({
  SessionStorage: {
    get: (...args) => mockGet(...args),
    update: (...args) => mockUpdate(...args),
    create: (...args) => mockCreate(...args),
    delete: (...args) => mockDelete(...args)
  }
}));

describe('useSession', () => {
  const mockSession = {
    id: '123',
    startTime: '2024-11-07T10:00:00.000Z',
    status: 'active'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue(mockSession);
  });

  test('loads session data', () => {
    const { result } = renderHook(() => useSession('123'));
    expect(mockGet).toHaveBeenCalledWith('123');
  });
});
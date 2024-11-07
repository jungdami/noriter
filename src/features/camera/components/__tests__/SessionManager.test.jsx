import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SessionManager } from '../SessionManager';

// Mock the useSession hook
jest.mock('../../hooks/useSession', () => ({
  useSession: () => ({
    session: {
      id: '123',
      startTime: '2024-11-07T10:00:00.000Z',
      status: 'active'
    },
    loading: false,
    error: null,
    updateSession: jest.fn()
  })
}));

describe('SessionManager', () => {
  test('renders session information', () => {
    render(<SessionManager sessionId="123" />);
    expect(screen.getByText('현재 세션')).toBeInTheDocument();
  });
});
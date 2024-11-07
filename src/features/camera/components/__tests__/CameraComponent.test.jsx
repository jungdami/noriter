import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CameraComponent } from '../CameraComponent';

// Mock the UserDetection component
jest.mock('../UserDetection', () => ({
  UserDetection: () => <div>User Detection Component</div>
}));

describe('CameraComponent', () => {
  beforeAll(() => {
    // Mock navigator.mediaDevices
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn()
    };
  });

  test('renders camera controls', () => {
    render(<CameraComponent />);
    expect(screen.getByText('카메라 시작')).toBeInTheDocument();
  });
});
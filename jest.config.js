module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleDirectories: ['node_modules', 'src'],
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '^@/(.*)$': '<rootDir>/src/$1',
      '@mediapipe/face_detection': '<rootDir>/src/__mocks__/mediapipeMock.js',
      '@tensorflow-models/face-detection': '<rootDir>/src/__mocks__/tensorflowMock.js'
    },
    testTimeout: 10000, // 전역 타임아웃 설정
    verbose: true
  };
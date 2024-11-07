import React from 'react';
import { CameraComponent } from './features/camera/components/CameraComponent';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">인지 능력 평가 시스템</h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <CameraComponent />
        </div>
      </div>
    </div>
  );
}

export default App;
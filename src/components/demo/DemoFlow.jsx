import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DramaChat from './DramaChat';
import HwatuGame from './HwatuGame';
import { CameraComponent } from '../../features/camera/components/CameraComponent';
import { Camera, MessageCircle, PlayCircle } from 'lucide-react';

const DemoFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('intro');
  const [isUserDetected, setIsUserDetected] = useState(false);

  // 시나리오 단계별 컴포넌트 정의
  const steps = {
    intro: {
      title: "노리와의 첫 만남",
      subtitle: "카메라에 얼굴이 잘 보이도록 해주세요",
      icon: <Camera className="w-12 h-12 text-blue-500" />,
      component: <CameraComponent onUserDetected={(detected) => setIsUserDetected(detected)} />
    },
    chat: {
      title: "노리와의 대화",
      subtitle: "오늘은 어떤 하루를 보내셨나요?",
      icon: <MessageCircle className="w-12 h-12 text-green-500" />,
      component: <DramaChat onComplete={() => setCurrentStep('game')} />
    },
    game: {
      title: "화투 짝맞추기",
      subtitle: "즐거운 게임 한판 어떠세요?",
      icon: <PlayCircle className="w-12 h-12 text-purple-500" />,
      component: <HwatuGame onComplete={() => navigate('/results')} />
    }
  };

  // 사용자 감지 시 자동으로 채팅 시작
  useEffect(() => {
    if (isUserDetected && currentStep === 'intro') {
      setTimeout(() => setCurrentStep('chat'), 2000);
    }
  }, [isUserDetected]);

  const StepHeader = () => (
    <div className="mb-6 text-center">
      <div className="flex justify-center mb-4">
        {steps[currentStep].icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {steps[currentStep].title}
      </h2>
      <p className="text-gray-600">
        {steps[currentStep].subtitle}
      </p>
    </div>
  );

  const ProgressIndicator = () => (
    <div className="flex justify-center gap-2 my-4">
      {Object.keys(steps).map((step, index) => (
        <div
          key={step}
          className={`h-2 w-8 rounded-full transition-all duration-300 ${
            Object.keys(steps).indexOf(currentStep) >= index
              ? 'bg-green-500'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProgressIndicator />
      <StepHeader />
      
      <div className="mb-8">
        {steps[currentStep].component}
      </div>
    </div>
  );
};

export default DemoFlow;
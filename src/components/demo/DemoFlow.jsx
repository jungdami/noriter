import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DramaChat from './DramaChat';
import HwatuGame from './HwatuGame';
import { CameraComponent } from '../../features/camera/components/CameraComponent';
import { ArrowRight, Camera, MessageCircle, PlayCircle, Award } from 'lucide-react';

const DemoFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('intro');
  const [metrics, setMetrics] = useState(null);
  const [isUserDetected, setIsUserDetected] = useState(false);

  // 시나리오 단계별 컴포넌트 정의
  const steps = {
    intro: {
      title: "노리터와의 첫 만남",
      subtitle: "카메라에 얼굴이 잘 보이도록 해주세요",
      icon: <Camera className="w-12 h-12 text-blue-500" />,
      component: <CameraComponent onUserDetected={(detected) => setIsUserDetected(detected)} />
    },
    chat: {
      title: "노리와의 드라마 이야기",
      subtitle: "오늘은 어떤 드라마를 보셨나요?",
      icon: <MessageCircle className="w-12 h-12 text-green-500" />,
      component: <DramaChat onComplete={(results) => {
        setMetrics(results);
        setCurrentStep('game');
      }} />
    },
    game: {
      title: "화투 짝맞추기",
      subtitle: "즐거운 게임 한판 어떠세요?",
      icon: <PlayCircle className="w-12 h-12 text-purple-500" />,
      component: <HwatuGame onComplete={() => setCurrentStep('results')} />
    },
    results: {
      title: "오늘의 활동 결과",
      subtitle: "정말 잘 하셨어요!",
      icon: <Award className="w-12 h-12 text-yellow-500" />
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

  const renderResults = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-green-500 mb-2">
            {metrics?.memory * 20}%
          </div>
          <div className="text-gray-600">기억력</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {metrics?.comprehension * 20}%
          </div>
          <div className="text-gray-600">이해력</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-purple-500 mb-2">
            {metrics?.engagement * 20}%
          </div>
          <div className="text-gray-600">참여도</div>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-green-800 mb-4">
          오늘의 추천 활동
        </h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-green-700">
            <ArrowRight className="w-5 h-5" />
            내일은 날씨가 좋다고 하니, 아침 산책 어떠세요?
          </li>
          <li className="flex items-center gap-2 text-green-700">
            <ArrowRight className="w-5 h-5" />
            구구단 노래 맞추기 게임도 준비해놨어요!
          </li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-green-500 text-white rounded-lg
                   hover:bg-green-600 transition-colors"
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProgressIndicator />
      <StepHeader />
      
      <div className="mb-8">
        {currentStep === 'results' ? renderResults() : steps[currentStep].component}
      </div>
    </div>
  );
};

export default DemoFlow;
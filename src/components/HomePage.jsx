import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Sun } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-green-600" />,
      title: "맞춤형 인지 훈련",
      description: "AI가 자연스러운 대화를 통해 인지 능력을 평가하고 개선하는 훈련을 제공합니다."
    },
    {
      icon: <Heart className="w-12 h-12 text-red-600" />,
      title: "건강한 라이프스타일",
      description: "날씨와 개인 상태에 맞는 외부 활동을 추천하여 신체적, 정신적 건강을 증진합니다."
    },
    {
      icon: <Sun className="w-12 h-12 text-yellow-600" />,
      title: "즐거운 두뇌 게임",
      description: "재미있는 게임을 통해 자연스럽게 인지 능력을 향상시킵니다."
    }
  ];

  return (
    <div className="flex flex-col items-center space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-800">
          당신의 인지 건강 파트너, 정담이
        </h2>
        <p className="text-xl text-gray-600">
          AI와 함께하는 즐거운 두뇌 건강 관리
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            {feature.icon}
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-600 text-center">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/assessment')}
        className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg
                 hover:bg-green-700 transform hover:scale-105 transition-all
                 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        시작하기
      </button>
    </div>
  );
};

export default HomePage;
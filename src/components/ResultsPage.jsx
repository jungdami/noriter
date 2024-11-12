import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity, Brain, Calendar, Clock } from 'lucide-react';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionData = location.state?.sessionData || {
    duration: '25분',
    responseCount: 12,
    averageResponseTime: '3.5초',
    cognitiveScore: 85
  };

  const recommendations = [
    {
      title: '패턴 매칭 게임',
      description: '시각적 패턴을 기억하고 따라하는 게임입니다.',
      duration: '15-20분',
      benefits: ['집중력 향상', '단기 기억력 강화', '패턴 인식 능력 개선'],
      type: 'pattern'
    },
    {
      title: '카드 매칭 게임',
      description: '짝을 맞추며 기억력을 훈련하는 게임입니다.',
      duration: '10-15분',
      benefits: ['기억력 향상', '공간 지각력 개선', '집중력 강화'],
      type: 'memory'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          활동 분석 결과
        </h2>
        <p className="text-gray-600">
          오늘도 즐거운 대화 나누어주셔서 감사합니다!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">대화 시간</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{sessionData.duration}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold">대화 횟수</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{sessionData.responseCount}회</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold">평균 응답 시간</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{sessionData.averageResponseTime}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold">활동 점수</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{sessionData.cognitiveScore}점</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800">
          추천 활동
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((game, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="text-xl font-semibold">{game.title}</h4>
              <p className="text-gray-600">{game.description}</p>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                <span>예상 소요 시간: {game.duration}</span>
              </div>

              <div className="space-y-2">
                <p className="font-medium">기대 효과:</p>
                <ul className="list-disc list-inside text-gray-600">
                  {game.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate(`/game/${game.type}`)}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg
                         hover:bg-green-600 transition-colors"
              >
                시작하기
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
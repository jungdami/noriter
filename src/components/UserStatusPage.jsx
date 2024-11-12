import React from 'react';
import { Brain, Heart, Activity, Calendar } from 'lucide-react';

const UserStatusPage = () => {
  // 목업 데이터
  const userData = {
    name: "김정담",
    age: 68,
    lastVisit: "2024-03-13",
    cognitiveStatus: {
      memory: 85,
      attention: 78,
      orientation: 92,
      judgment: 88
    },
    activities: [
      { date: "2024-03-13", type: "대화", duration: "25분" },
      { date: "2024-03-12", type: "패턴 게임", score: 85 },
      { date: "2024-03-11", type: "카드 매칭", score: 92 },
    ],
    recommendations: [
      "오늘은 산책하기 좋은 날씨네요. 동네 한바퀴 어떠세요?",
      "새로 추가된 패턴 게임에 도전해보세요.",
      "가족들과 오늘 있었던 일을 나눠보세요."
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* 기본 정보 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{userData.name}님의 현황</h2>
          <span className="text-gray-500">최근 방문: {userData.lastVisit}</span>
        </div>

        {/* 인지 능력 상태 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center text-blue-600 mb-2">
              <Brain className="w-5 h-5 mr-2" />
              <span className="font-medium">기억력</span>
            </div>
            <div className="text-2xl font-bold">{userData.cognitiveStatus.memory}%</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center text-green-600 mb-2">
              <Activity className="w-5 h-5 mr-2" />
              <span className="font-medium">집중력</span>
            </div>
            <div className="text-2xl font-bold">{userData.cognitiveStatus.attention}%</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center text-purple-600 mb-2">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-medium">지남력</span>
            </div>
            <div className="text-2xl font-bold">{userData.cognitiveStatus.orientation}%</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center text-yellow-600 mb-2">
              <Heart className="w-5 h-5 mr-2" />
              <span className="font-medium">판단력</span>
            </div>
            <div className="text-2xl font-bold">{userData.cognitiveStatus.judgment}%</div>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">최근 활동</h3>
        <div className="space-y-4">
          {userData.activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{activity.type}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
              <div className="text-right">
                {activity.score ? (
                  <span className="text-green-600 font-medium">{activity.score}점</span>
                ) : (
                  <span className="text-blue-600 font-medium">{activity.duration}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 추천 활동 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">오늘의 추천</h3>
        <div className="space-y-3">
          {userData.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStatusPage;
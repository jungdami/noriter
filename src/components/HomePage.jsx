import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MessageCircle, Gamepad, PlayCircle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <User className="w-8 h-8" />,
      title: "안방",
      description: "인지 능력 상태와 활동 기록을 확인해 보세요",
      path: "/status",
      color: "bg-blue-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "수다방",
      description: "AI 도우미 방방이와 즐거운 대화를 나눠 보세요",
      path: "/assessment",
      color: "bg-green-500"
    },
    {
      icon: <Gamepad className="w-8 h-8" />,
      title: "게임방",
      description: "재미있는 게임으로 두뇌를 활성화해 보세요",
      path: "/games",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            방방이와 함께하는<br />즐거운 두뇌 건강
          </h1>
          <p className="text-xl text-gray-600">
            AI 도우미 방방이가 당신의 건강한 하루를 함께합니다
          </p>
          
          {/* 데모 모드 버튼 추가 */}
          <button
            onClick={() => navigate('/demo')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 
                     text-white rounded-full text-lg font-semibold 
                     hover:shadow-lg transition-all duration-300
                     flex items-center gap-2 mx-auto"
          >
            <PlayCircle className="w-6 h-6" />
            시연 영상 보기
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-left"
            >
              <div className={`${item.color} text-white p-3 rounded-full w-fit mb-4`}>
                {item.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
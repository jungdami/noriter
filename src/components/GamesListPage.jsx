import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Puzzle } from 'lucide-react';

const GamesListPage = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'pattern',
      title: '순서 기억하기',
      description: '순서대로 나타나는 패턴을 기억하고 따라해보세요',
      icon: <Grid className="w-12 h-12 text-purple-500" />,
      recommended: '집중력 향상에 도움이 됩니다',
      difficulty: '중급'
    },
    {
      id: 'memory',
      title: '짝 맞추기',
      description: '짝을 이루는 카드를 찾아보세요',
      icon: <Puzzle className="w-12 h-12 text-blue-500" />,
      recommended: '기억력 향상에 도움이 됩니다',
      difficulty: '초급'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">두뇌 게임</h1>
      
      <div className="grid gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6"
          >
            <div className="flex items-start gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                {game.icon}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">{game.title}</h2>
                  <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                    {game.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{game.description}</p>
                <p className="text-sm text-purple-600 mb-4">{game.recommended}</p>
                
                <button
                  onClick={() => navigate(`/game/${game.id}`)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  시작하기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-xl">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">게임 효과</h3>
        <ul className="space-y-2 text-blue-700">
          <li>• 규칙적인 두뇌 운동으로 인지 기능을 향상시킬 수 있습니다</li>
          <li>• 즐거운 게임을 통해 스트레스를 해소할 수 있습니다</li>
          <li>• 점수와 기록을 통해 발전 과정을 확인할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
};

export default GamesListPage;
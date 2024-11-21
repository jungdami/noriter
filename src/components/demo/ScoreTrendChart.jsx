import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Trophy, Calendar, Star, ArrowRight, PlayCircle } from 'lucide-react';

const ScoreTrendChart = () => {
  const data = [
    { month: '1주차', score: 70 },
    { month: '2주차', score: 75 },
    { month: '3주차', score: 80 },
    { month: '오늘', score: 85 }
  ];

  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const graphWidth = width - (padding.left + padding.right);
  const graphHeight = height - (padding.top + padding.bottom);

  const points = data.map((point, index) => ({
    x: padding.left + (index * (graphWidth / (data.length - 1))),
    y: height - padding.bottom - ((point.score - 60) * (graphHeight / 30))
  }));

  const pathString = points.reduce((path, point, index) => {
    return path + (index === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`);
  }, '');

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">활동 점수 변화</h3>
      <div className="h-52">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          {[60, 70, 80, 90].map((value, index) => (
            <g key={value}>
              <line
                x1={padding.left - 5}
                y1={height - padding.bottom - (index * (graphHeight / 3))}
                x2={width - padding.right}
                y2={height - padding.bottom - (index * (graphHeight / 3))}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={height - padding.bottom - (index * (graphHeight / 3))}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-sm fill-gray-500"
              >
                {value}
              </text>
            </g>
          ))}

          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#E5E7EB"
            strokeWidth="2"
          />

          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#E5E7EB"
            strokeWidth="2"
          />

          <path
            d={pathString}
            fill="none"
            stroke="#22C55E"
            strokeWidth="3"
          />

          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#22C55E"
                stroke="white"
                strokeWidth="2"
              />
              
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                className="text-sm font-semibold fill-gray-700"
              >
                {data[index].score}점
              </text>

              <text
                x={point.x}
                y={height - (padding.bottom - 25)}
                textAnchor="middle"
                className="text-sm fill-gray-500"
              >
                {data[index].month}
              </text>
            </g>
          ))}

          <path
            d={`${pathString} L ${points[points.length-1].x},${height - padding.bottom} L ${points[0].x},${height - padding.bottom} Z`}
            fill="url(#gradient)"
            opacity="0.1"
          />

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

const ActivityResultsPage = () => {
  const navigate = useNavigate();

  const moreActivities = [
    {
      title: "숫자 기억하기",
      description: "순서대로 나오는 숫자를 기억해보세요",
      duration: "10분",
      type: "memory"
    },
    {
      title: "구구단 노래방",
      description: "구구단을 노래로 배워볼까요?",
      duration: "15분",
      type: "song"
    },
    {
      title: "단어 이어가기",
      description: "끝말잇기로 단어를 이어가봐요",
      duration: "10분",
      type: "word"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 점수 그래프 */}
      <ScoreTrendChart />

      {/* 오늘의 활동 결과 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-sm text-gray-600">기억력</div>
              <div className="text-2xl font-bold text-blue-500">85%</div>
            </div>
          </div>
          <p className="text-gray-600">드라마 내용을 잘 기억하고 계세요!</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-sm text-gray-600">집중력</div>
              <div className="text-2xl font-bold text-purple-500">90%</div>
            </div>
          </div>
          <p className="text-gray-600">화투 짝 맞추기를 아주 잘 하셨어요!</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <div>
              <div className="text-sm text-gray-600">참여도</div>
              <div className="text-2xl font-bold text-red-500">95%</div>
            </div>
          </div>
          <p className="text-gray-600">대화에 적극적으로 참여하셨어요!</p>
        </div>
      </div>

      {/* 더 놀기 섹션 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <PlayCircle className="w-8 h-8 text-purple-500" />
          <h3 className="text-xl font-semibold">더 재미있게 놀아볼까요?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {moreActivities.map((activity, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/game/${activity.type}`)}
            >
              <h4 className="font-semibold text-lg mb-2">{activity.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
              <div className="text-purple-500 text-sm">
                예상 소요시간: {activity.duration}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 오늘의 활동 기록 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">오늘의 활동 기록</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-6 h-6 text-green-500 mt-1" />
            <div>
              <div className="font-medium">드라마 이야기 나누기</div>
              <p className="text-gray-600">무자식 상팔자 드라마에 대해 대화를 나누었어요</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Trophy className="w-6 h-6 text-yellow-500 mt-1" />
            <div>
              <div className="font-medium">화투 짝 맞추기 게임</div>
              <p className="text-gray-600">8쌍의 화투패를 모두 찾으셨어요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 다음 활동 추천 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">내일의 추천 활동</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ArrowRight className="w-5 h-5 text-green-600" />
            <p className="text-green-700">날씨가 좋다고 하니, 아침 산책은 어떠세요?</p>
          </div>
          <div className="flex items-center gap-3">
            <ArrowRight className="w-5 h-5 text-green-600" />
            <p className="text-green-700">구구단 노래 맞추기 게임도 준비해놨답니다!</p>
          </div>
        </div>
      </div>

      {/* 홈으로 돌아가기 버튼 */}
      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-green-500 text-white rounded-lg
                   hover:bg-green-600 transition-all shadow-sm"
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ActivityResultsPage;
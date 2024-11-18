import React from 'react';
import { Brain, Heart, Activity, Calendar, Target, Trophy, Sprout, ArrowUp } from 'lucide-react';

const ProgressBar = ({ value, maxValue, colorClass }) => (
  <div className="w-full bg-gray-200 rounded-full h-4">
    <div 
      className={`h-4 rounded-full transition-all duration-500 ${colorClass}`}
      style={{ width: `${(value / maxValue) * 100}%` }}
    />
  </div>
);

const ScoreTrendChart = () => {
  const data = [
    { month: '1월', score: 70 },
    { month: '2월', score: 75 },
    { month: '3월', score: 80 },
    { month: '4월', score: 85 }
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
      <h3 className="text-lg font-semibold text-gray-700 mb-4">평균 점수 변화</h3>
      <div className="h-52">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          {/* Background grid lines */}
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

          {/* X축 기준선 */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#E5E7EB"
            strokeWidth="2"
          />

          {/* Y축 기준선 */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#E5E7EB"
            strokeWidth="2"
          />

          {/* 그래프 라인 */}
          <path
            d={pathString}
            fill="none"
            stroke="#22C55E"
            strokeWidth="3"
          />

          {/* 데이터 포인트와 라벨 */}
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

          {/* Area under the line */}
          <path
            d={`${pathString} L ${points[points.length-1].x},${height - padding.bottom} L ${points[0].x},${height - padding.bottom} Z`}
            fill="url(#gradient)"
            opacity="0.1"
          />

          {/* Gradient definition */}
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

const UserStatusPage = () => {
  const userData = {
    name: "김정담",
    age: 68,
    lastVisit: "2024-03-14",
    healthStatus: {
      현재_점수: 85,
      지난달_점수: 75,
      세부능력: {
        "기억하기": {
          점수: 85,
          설명: "이야기나 물건을 잘 기억하고 계세요",
          향상: "+5",
          색상: "bg-blue-500"
        },
        "집중하기": {
          점수: 78,
          설명: "한 가지 일에 잘 집중하실 수 있어요",
          향상: "+3",
          색상: "bg-green-500"
        },
        "시간과 장소 알기": {
          점수: 92,
          설명: "오늘 날짜와 계신 곳을 잘 알고 계세요",
          향상: "+7",
          색상: "bg-purple-500"
        },
        "이해하기": {
          점수: 88,
          설명: "설명을 잘 이해하고 계시네요",
          향상: "+4",
          색상: "bg-yellow-500"
        }
      }
    },
    오늘의활동: [
      {
        종류: "대화",
        시간: "오늘",
        내용: "다미와 20분 동안 날씨와 동네 소식에 대해 이야기를 나누었어요",
        아이콘: "💬",
        결과: "아주 잘하셨어요"
      },
      {
        종류: "게임",
        시간: "오늘",
        내용: "카드 짝 맞추기에서 최고 기록을 세우셨어요!",
        아이콘: "🎮",
        결과: "92점"
      },
      {
        종류: "산책",
        시간: "어제",
        내용: "동네 한 바퀴를 돌면서 봄꽃 사진도 찍으셨어요",
        아이콘: "🚶‍♂️",
        시간: "30분"
      }
    ],
    도전과제: [
      {
        제목: "봄꽃 이름 맞히기",
        설명: "산책하면서 보신 꽃들의 이름을 맞혀보세요",
        아이콘: "🌸",
        보상: "기억력 +2점"
      },
      {
        제목: "이야기 나누기",
        설명: "다미와 좋아하는 음식에 대해 이야기해보세요",
        아이콘: "👥",
        보상: "말하기 +2점"
      },
      {
        제목: "색깔 순서 맞추기",
        설명: "화면에 나오는 색깔 순서를 기억해보세요",
        아이콘: "🎯",
        보상: "집중력 +2점"
      }
    ],
    주간목표: {
      대화하기: 80,
      게임하기: 60,
      산책하기: 90
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {userData.name}님, 안녕하세요! 👋
            </h2>
            <p className="text-xl text-gray-600 mt-2">
              오늘도 건강한 하루 보내고 계시네요
            </p>
          </div>
          <div className="text-center bg-white p-4 rounded-xl shadow-sm">
            <div className="text-4xl font-bold text-green-600">
              {userData.healthStatus.현재_점수}점
            </div>
            <div className="text-lg text-gray-500">현재 점수</div>
            <div className="text-sm text-green-600 mt-1 flex items-center justify-center">
              <ArrowUp className="w-4 h-4 mr-1" />
              지난달보다 {userData.healthStatus.현재_점수 - userData.healthStatus.지난달_점수}점 좋아지셨어요!
            </div>
          </div>
        </div>

        <ScoreTrendChart />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(userData.healthStatus.세부능력).map(([키, 값]) => (
            <div key={키} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {키 === '기억하기' && <Brain className="w-6 h-6 text-blue-500 mr-2" />}
                  {키 === '집중하기' && <Activity className="w-6 h-6 text-green-500 mr-2" />}
                  {키 === '시간과 장소 알기' && <Calendar className="w-6 h-6 text-purple-500 mr-2" />}
                  {키 === '이해하기' && <Heart className="w-6 h-6 text-yellow-500 mr-2" />}
                  <span className="text-xl font-bold">{키}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{값.점수}</span>
                  <span className="text-green-500 ml-2">{값.향상}</span>
                </div>
              </div>
              <ProgressBar 
                value={값.점수} 
                maxValue={100} 
                colorClass={값.색상}
              />
              <p className="text-gray-600 mt-2 text-lg">
                {값.설명}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          오늘 하신 일
        </h3>
        <div className="space-y-4">
          {userData.오늘의활동.map((활동, index) => (
            <div key={index} className="flex items-center bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl mr-4">{활동.아이콘}</div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-medium">{활동.종류}</h4>
                  <span className="text-gray-500">{활동.시간}</span>
                </div>
                <p className="text-lg text-gray-600">{활동.내용}</p>
              </div>
              {활동.결과 && (
                <div className="ml-4 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                  {활동.결과}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          오늘의 도전 과제
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userData.도전과제.map((과제, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-4xl mb-2">{과제.아이콘}</div>
              <h4 className="text-xl font-medium mb-2">{과제.제목}</h4>
              <p className="text-gray-600 text-lg mb-4">{과제.설명}</p>
              <div className="text-green-600 font-medium">
                성공하면 {과제.보상}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          이번 주 목표 달성
        </h3>
        <div className="space-y-6">
          {Object.entries(userData.주간목표).map(([활동, 달성률]) => (
            <div key={활동} className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>{활동}</span>
                <span className="font-medium">{달성률}%</span>
              </div>
              <ProgressBar 
                value={달성률} 
                maxValue={100}
                colorClass={
                  활동 === '대화하기' ? 'bg-blue-500' :
                  활동 === '게임하기' ? 'bg-purple-500' : 'bg-green-500'
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStatusPage;
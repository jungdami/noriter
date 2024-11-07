import React, { useState, useEffect } from 'react';
import { useSession } from '../hooks/useSession';

const trainingPrograms = [
  {
    id: 1,
    title: '기초 인지 훈련',
    description: '집중력과 기억력 향상을 위한 기본 훈련',
    duration: '15분',
    difficulty: '초급',
    category: 'cognitive',
    exercises: [
      '숫자 기억하기',
      '패턴 찾기',
      '단어 연상'
    ]
  },
  {
    id: 2,
    title: '시각적 인지 강화',
    description: '시각 정보 처리 능력 향상 프로그램',
    duration: '20분',
    difficulty: '중급',
    category: 'visual',
    exercises: [
      '물체 인식',
      '색상 구분',
      '공간 지각'
    ]
  },
  {
    id: 3,
    title: '고급 기억력 훈련',
    description: '장단기 기억력 강화를 위한 심화 과정',
    duration: '25분',
    difficulty: '고급',
    category: 'memory',
    exercises: [
      '이야기 회상',
      '순서 기억하기',
      '위치 기억하기'
    ]
  }
];

export const ProgramRecommendation = ({ sessionId }) => {
  const { session } = useSession(sessionId);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (session) {
      // 세션 데이터 기반으로 프로그램 추천 로직
      const sessionDuration = session.endTime 
        ? new Date(session.endTime) - new Date(session.startTime)
        : new Date() - new Date(session.startTime);
      
      const minutes = Math.floor(sessionDuration / (1000 * 60));
      
      // 간단한 추천 로직 (실제로는 더 복잡한 로직이 필요할 수 있음)
      let recommendedProgram;
      if (minutes < 5) {
        recommendedProgram = trainingPrograms[0]; // 기초 프로그램
      } else if (minutes < 10) {
        recommendedProgram = trainingPrograms[1]; // 중급 프로그램
      } else {
        recommendedProgram = trainingPrograms[2]; // 고급 프로그램
      }
      
      setSelectedProgram(recommendedProgram);
    }
  }, [session]);

  if (!session || !selectedProgram) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">추천 훈련 프로그램</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-md font-medium">{selectedProgram.title}</h4>
            <p className="text-sm text-gray-600">{selectedProgram.description}</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
          >
            {showDetails ? '접기' : '자세히'}
          </button>
        </div>

        <div className="mt-2 flex gap-4 text-sm">
          <span className="text-gray-600">
            <span className="font-medium">난이도:</span> {selectedProgram.difficulty}
          </span>
          <span className="text-gray-600">
            <span className="font-medium">소요시간:</span> {selectedProgram.duration}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h5 className="font-medium mb-2">훈련 내용</h5>
          <ul className="list-disc list-inside space-y-1">
            {selectedProgram.exercises.map((exercise, index) => (
              <li key={index} className="text-sm text-gray-700">{exercise}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button 
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            // 훈련 프로그램 시작 로직
            console.log('Starting program:', selectedProgram.title);
          }}
        >
          프로그램 시작
        </button>
        <button 
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          onClick={() => {
            // 다른 프로그램 추천 요청 로직
            const currentIndex = trainingPrograms.findIndex(p => p.id === selectedProgram.id);
            const nextIndex = (currentIndex + 1) % trainingPrograms.length;
            setSelectedProgram(trainingPrograms[nextIndex]);
          }}
        >
          다른 프로그램
        </button>
      </div>
    </div>
  );
};
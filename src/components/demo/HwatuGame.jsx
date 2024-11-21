import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const HwatuGame = () => {
  // 화투 카드 데이터
  const hwatuPairs = [
    { month: 1, name: "송화", description: "소나무와 흰 꽃" },
    { month: 2, name: "매화", description: "매화" },
    { month: 3, name: "벚화", description: "벚꽃" },
    { month: 4, name: "흑싸리", description: "흑싸리" },
    { month: 5, name: "난초", description: "난초" },
    { month: 6, name: "목단", description: "모란" },
    { month: 7, name: "홍단", description: "붉은 띠" },
    { month: 8, name: "공산", description: "공산" }
  ];

  // 게임에 사용될 카드 배열 (각 쌍이 두 번씩 들어감)
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // 게임 초기화
  useEffect(() => {
    const gameCards = [...hwatuPairs, ...hwatuPairs]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        id: index,
        isFlipped: false,
        isMatched: false
      }));
    setCards(gameCards);
  }, []);

  // 카드 클릭 처리
  const handleCardClick = (cardId) => {
    if (
      flipped.length === 2 || // 이미 두 장이 뒤집혀있거나
      flipped.includes(cardId) || // 이미 선택된 카드이거나
      matched.includes(cardId) // 이미 매칭된 카드인 경우
    ) {
      return;
    }

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    // 두 장이 선택되었을 때
    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.month === secondCard.month) {
        // 매칭 성공
        setMatched([...matched, firstId, secondId]);
        setScore(score + 10);
        setFlipped([]);
        
        // 모든 카드가 매칭되었는지 확인
        if (matched.length + 2 === cards.length) {
          setGameComplete(true);
        }
      } else {
        // 매칭 실패
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  // 카드 컴포넌트
  const Card = ({ card, onClick }) => {
    const isFlipped = flipped.includes(card.id) || matched.includes(card.id);

    return (
      <div
        onClick={() => onClick(card.id)}
        className={`relative w-24 h-36 cursor-pointer transition-transform duration-300 transform 
          ${isFlipped ? 'rotate-y-180' : ''} 
          ${matched.includes(card.id) ? 'opacity-70' : ''}`}
      >
        <div className={`absolute w-full h-full rounded-xl border-2 
          ${isFlipped ? 'bg-white' : 'bg-red-700'} 
          flex items-center justify-center shadow-lg
          ${matched.includes(card.id) ? 'border-green-500' : 'border-gold-500'}`}
        >
          {isFlipped ? (
            <div className="text-center p-2">
              <div className="text-lg font-semibold">{card.name}</div>
              <div className="text-sm text-gray-600">{card.month}월</div>
            </div>
          ) : (
            <div className="text-white text-2xl">花</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-green-50 rounded-xl">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-xl font-semibold">화투 짝맞추기</div>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="text-lg font-semibold">{score}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {cards.map(card => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>

      {gameComplete && (
        <div className="text-center p-4 bg-yellow-100 rounded-xl">
          <h3 className="text-xl font-bold text-yellow-800">축하합니다! 🎉</h3>
          <p className="text-yellow-700">모든 짝을 찾으셨어요!</p>
          <p className="text-yellow-600">최종 점수: {score}점</p>
        </div>
      )}
    </div>
  );
};

export default HwatuGame;
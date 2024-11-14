import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 패턴 매칭 게임
const PatternGame = () => {
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const colors = ['red', 'blue', 'green', 'yellow'];

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const newPattern = [...pattern];
    newPattern.push(colors[Math.floor(Math.random() * colors.length)]);
    setPattern(newPattern);
    setUserPattern([]);
    playPattern(newPattern);
  };

  const playPattern = async (patternToPlay) => {
    for (let color of patternToPlay) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const button = document.querySelector(`[data-color="${color}"]`);
      button.classList.add('opacity-50');
      await new Promise(resolve => setTimeout(resolve, 500));
      button.classList.remove('opacity-50');
    }
  };

  const handleColorClick = (color) => {
    if (gameOver) return;

    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);

    if (newUserPattern[newUserPattern.length - 1] !== pattern[newUserPattern.length - 1]) {
      setGameOver(true);
      return;
    }

    if (newUserPattern.length === pattern.length) {
      setScore(score + 1);
      setTimeout(startNewRound, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold">점수: {score}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {colors.map((color) => (
          <button
            key={color}
            data-color={color}
            onClick={() => handleColorClick(color)}
            className={`w-full h-32 rounded-lg transition-opacity
                     ${color === 'red' ? 'bg-red-500' :
                       color === 'blue' ? 'bg-blue-500' :
                       color === 'green' ? 'bg-green-500' :
                       'bg-yellow-500'}`}
          />
        ))}
      </div>

      {gameOver && (
        <div className="text-center">
          <p className="text-xl font-bold text-red-600">게임 오버!</p>
          <button
            onClick={() => {
              setPattern([]);
              setUserPattern([]);
              setScore(0);
              setGameOver(false);
              startNewRound();
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            다시 시작
          </button>
        </div>
      )}
    </div>
  );
};

// 카드 매칭 게임
const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  
  const symbols = ['🌞', '🌙', '⭐', '🌎', '🌈', '💫', '🌍', '🌏'];

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffledCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol: symbol,
      }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  };

  const handleCardClick = (cardId) => {
    if (
      flipped.length === 2 ||
      flipped.includes(cardId) ||
      solved.includes(cardId)
    ) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setSolved([...solved, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold">시도 횟수: {moves}</h3>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-20 h-20 text-3xl rounded-lg transition-all
                     ${flipped.includes(card.id) || solved.includes(card.id)
                       ? 'bg-white'
                       : 'bg-blue-500'}`}
          >
            {(flipped.includes(card.id) || solved.includes(card.id)) && card.symbol}
          </button>
        ))}
      </div>

      {solved.length === cards.length && (
        <div className="text-center">
          <p className="text-xl font-bold text-green-600">축하합니다!</p>
          <button
            onClick={initGame}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            다시 시작
          </button>
        </div>
      )}
    </div>
  );
};

// 메인 게임 페이지 컴포넌트
const GamePage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          {type === 'pattern' ? '순서 기억하기' : '짝 맞추기'}
        </h2>
        <button
          onClick={() => navigate('/assessment')}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg"
        >
          돌아가기
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        {type === 'pattern' ? <PatternGame /> : <MemoryGame />}
      </div>
    </div>
  );
};

export default GamePage;
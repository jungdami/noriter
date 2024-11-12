// src/components/NotFoundPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-3xl font-semibold mb-4">페이지를 찾을 수 없습니다.</h2>
      <p className="text-lg mb-6">요청하신 페이지가 존재하지 않습니다.</p>
      <button
        onClick={goHome}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        홈으로 이동
      </button>
    </div>
  );
}

export default NotFoundPage;

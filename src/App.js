import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AssessmentPage from './components/AssessmentPage';
import GamePage from './components/GamePage';
import GamesListPage from './components/GamesListPage';
import UserStatusPage from './components/UserStatusPage';
import NotFoundPage from './components/NotFoundPage';
import ActivityResultsPage from './components/demo/ScoreTrendChart';
import DemoFlow from './components/demo/DemoFlow';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-blue-50">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-green-700">노리터</h1>
            <p className="text-sm text-green-600 mt-1">AI 기반 인지 건강 도우미</p>
          </div>
        </header>
        
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/status" element={<UserStatusPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/games" element={<GamesListPage />} />
              <Route path="/game/:type" element={<GamePage />} />
              <Route path="/demo" element={<DemoFlow />} />
              <Route path="/results" element={<ActivityResultsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>

        <footer className="bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-gray-500">© 2024 인의예지 팀</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
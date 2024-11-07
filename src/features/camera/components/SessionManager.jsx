import React from 'react';
import { useSession } from '../hooks/useSession';

export const SessionManager = ({ sessionId }) => {
    const {
      session,
      loading,
      error,
      updateSession
    } = useSession(sessionId);
  
    if (loading) {
      return (
        <div className="p-4 bg-white rounded shadow">
          <div className="flex items-center justify-center">
            <span className="animate-spin h-5 w-5 mr-3 border-2 border-blue-500 rounded-full border-t-transparent"></span>
            세션 로딩 중...
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      );
    }
  
    if (!session) return null;
  
    const sessionDuration = session.endTime 
      ? new Date(session.endTime) - new Date(session.startTime)
      : new Date() - new Date(session.startTime);
  
    const formattedDuration = Math.floor(sessionDuration / 1000);
  
    return (
      <div className="p-4 bg-white rounded shadow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">현재 세션</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">시작 시간</p>
              <p>{new Date(session.startTime).toLocaleTimeString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">상태</p>
              <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${session.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {session.status === 'active' ? '진행 중' : '완료'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">진행 시간</p>
              <p>{formattedDuration}초</p>
            </div>
          </div>
        </div>
  
        {session.status === 'active' && (
          <div className="flex gap-2">
            <button
              onClick={() => updateSession({ status: 'completed' })}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
              세션 종료
            </button>
          </div>
        )}
      </div>
    );
  };
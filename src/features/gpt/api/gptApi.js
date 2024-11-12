// src/features/gpt/api/gptApi.js

import axios from 'axios';

// GPT API를 위한 Axios 인스턴스 생성
export const gptClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
  },
});

// 에러 처리를 위한 인터셉터 추가
gptClient.interceptors.response.use(
  response => response,
  error => {
    console.error('GPT API 오류:', error.response?.data || error.message);
    throw new Error('GPT 서비스 연결 중 문제가 발생했습니다.');
  }
);

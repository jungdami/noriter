# 노리터 - AI 기반 인지 건강 도우미

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=OpenAI&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat-square&logo=TensorFlow&logoColor=white)

## 📋 프로젝트 소개

**노리터**는 '나이 들수록(老) 더 많이 알아가는(Know) 즐거움'이 있는 이로운 곳이라는 의미를 담고 있습니다. AI 도우미 '노리'와 함께하는 자연스러운 대화와 전통 놀이를 통해 어르신들의 인지 건강을 관리하고 증진하는 웹 서비스입니다.

### 🌟 주요 기능

- **자동 사용자 감지**: TensorFlow.js 기반 얼굴 인식으로 사용자를 자동 감지하여 상호작용을 시작합니다.
- **자연스러운 대화 평가**: GPT와의 일상적인 대화를 통해 사용자의 인지 기능을 자연스럽게 평가합니다.
- **음성 기반 상호작용**: 음성 인식과 음성 합성을 통해 자연스러운 대화 환경을 제공합니다.
- **맞춤형 두뇌 훈련**: 평가 결과에 따라 개인화된 인지 훈련 프로그램을 추천합니다.

## 🔍 기술 스택

### Frontend
- React 18
- TailwindCSS
- TensorFlow.js (얼굴 인식)
- Web Speech API (음성 인식/합성)

### Backend
- Node.js
- OpenAI GPT API
- Azure Speech Services
- Web Storage API

### 주요 라이브러리
- `@tensorflow-models/face-detection`
- `lucide-react`
- `react-router-dom`
- `axios`

## 💡 핵심 구현 사항

### 1. 자동화된 사용자 인터랙션
- TensorFlow.js 기반 실시간 얼굴 인식
- 사용자 감지 시 자동 대화 시작
- 세션 기반 사용자 상태 관리

### 2. 자연스러운 인지 기능 평가
- GPT를 활용한 맥락 기반 대화 평가
- 기억력, 지남력, 판단력, 집중력 등 다양한 인지 영역 평가
- 평가 결과의 정량화 및 저장

### 3. 맞춤형 두뇌 훈련
- 패턴 매칭 게임
- 카드 매칭 게임
- 사용자 수준별 난이도 조정

### 4. 다중 모달 인터페이스
- 음성 인식/합성을 통한 자연스러운 대화
- 실시간 얼굴 인식 기반 사용자 감지
- 직관적인 시각적 피드백 제공

## 🚀 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/jungdami/jungdami

# 디렉토리 이동
cd jungdam-e

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

## 👥 팀 구성 및 역할

### 정지현 - Frontend & UI
- 카메라 인터페이스 및 사용자 감지 구현
- UI/UX 디자인 및 개발
- 세션 데이터 관리 및 상태 관리 시스템 구현

### 홍윤기 - Backend & AI
- GPT API 통합 및 최적화
- 실시간 데이터 분석 시스템 구현
- 인지 기능 평가 알고리즘 개발

### 홍서윤 -UX & 음성처리
- 음성 인터페이스 설계 및 구현
- 대화 시나리오 설계
- Azure Speech Services 통합

## 🔜 향후 계획

### 1. 서비스 확장
[] 지역별 특색을 반영한 맞춤형 대화 시스템
[] 다양한 전통 놀이 기반 게임 추가
[] 다국어 지원을 통한 글로벌 서비스

### 2. 기술 확장
[] 실시간 감정 분석 시스템 도입
[] 3D 기반 인터랙티브 게임 추가
[] AR/VR 기술 통합

### 3. 사회적 확장
[] 요양 시설 연계 시스템
[] 가족 구성원 참여 기능
[] 원격 돌봄 서비스 통합

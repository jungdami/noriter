# 방방곡곡 - AI 기반 인지 건강 도우미

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=OpenAI&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat-square&logo=TensorFlow&logoColor=white)

## 📋 프로젝트 소개

**방방곡곡**은 사용자가 다양한 디지털 방을 돌아다니며 인지 건강을 관리하고 증진할 수 있도록 돕는 웹 애플리케이션입니다. AI와의 상호작용을 통해 기억력, 집중력, 판단력 등의 인지 기능을 자연스럽게 평가하고, 맞춤형 두뇌 훈련을 제공하는 디지털 놀이터로 설계되었습니다.

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
- 세션 데이터 관리 및 상태 관리

### 홍윤기 - Backend & API
- GPT API 통합 및 최적화
- 프롬프트 엔지니어링
- 세션 관리 시스템 구현

### 홍서윤 - 음성 인터페이스
- 음성 인식/변환 시스템 구현
- 음성 출력 최적화
- 음성 인터페이스 사용성 개선

## 🔜 향후 계획

- [ ] 다국어 지원 추가
- [ ] 더 다양한 인지 훈련 게임 추가
- [ ] 장기적인 인지 기능 변화 추적 기능
- [ ] 보호자 모니터링 시스템 구축

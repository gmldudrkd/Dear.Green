# Dear Earth - 기술 문서

## 프로젝트 개요

**Dear Earth (친애하는 지구에게)** - 게이미피케이션 기반 채식 커뮤니티 웹앱.
사용자가 식사를 기록하고 Inference Points(IP)를 획득하여 가상 식물을 성장시키며, 다른 사용자들과 함께 숲을 가꾸는 서비스.

---

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.1.6 |
| 언어 | TypeScript | 5.x |
| UI 라이브러리 | React | 19.2.3 |
| 스타일링 | Tailwind CSS | 4.x |
| 애니메이션 | Framer Motion | 12.34.3 |
| 3D 렌더링 | Three.js | 0.183.2 |
| 3D React 바인딩 | @react-three/fiber | 9.5.0 |
| 3D 헬퍼 | @react-three/drei | 10.7.7 |
| 폰트 | Caveat (Google Fonts), Pretendard Variable |  |

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (Caveat 폰트, PointsProvider)
│   ├── page.tsx            # 홈 - TabShell 렌더링
│   ├── globals.css         # Tailwind 테마 (sage/sand/earth 컬러)
│   └── favicon.ico
│
├── components/
│   ├── tabs/               # 탭 네비게이션
│   │   ├── TabShell.tsx    #   탭 상태 관리 + AnimatePresence 전환
│   │   ├── BottomTabBar.tsx#   하단 고정 탭 바
│   │   ├── MyDearTab.tsx   #   나의 식탁 탭
│   │   ├── LiveGreenTab.tsx#   번지는 초록 (피드) 탭
│   │   └── OurForestTab.tsx#   우리의 숲 (3D) 탭
│   │
│   ├── forest/             # 3D 가상 숲
│   │   ├── ForestCanvas3D.tsx # R3F Canvas + 조명 + 대지 + 장식
│   │   ├── VoxelTree.tsx      # 복셀 스타일 나무 (5단계)
│   │   └── TreePopup.tsx      # 나무 클릭 시 유저 정보 바텀시트
│   │
│   ├── feed/               # 실시간 피드
│   │   ├── FeedCard.tsx    #   피드 카드 (닉네임, 식사, 채식 단계)
│   │   ├── FeedBanner.tsx  #   자동 순환 메시지 배너
│   │   └── HeartButton.tsx #   하트 토글 + 잎사귀 파티클
│   │
│   ├── timer/
│   │   └── MindfulnessTimer.tsx # 10초 명상 타이머 (SVG 원형 프로그레스)
│   │
│   ├── Header.tsx          # 상단 헤더 (Caveat 로고 + 지구 아이콘 로그인)
│   ├── BlobCharacter.tsx   # 성장 단계별 캐릭터 (5종)
│   ├── MealLogButtons.tsx  # 아침/점심/저녁 기록 버튼
│   ├── MealLogModal.tsx    # 식사 기록 모달 (3단계: 선택→타이머→완료)
│   ├── PointsStatus.tsx    # IP 표시 + 진행률 바
│   └── PlantEncyclopedia.tsx # 식물 도감 바텀시트
│
├── context/
│   └── PointsContext.tsx   # IP 전역 상태 (localStorage 영속화)
│
├── lib/
│   ├── growth.ts           # 성장 단계 데이터 및 헬퍼 함수
│   ├── mockFeed.ts         # 피드 mock 데이터 생성기
│   ├── mockForest.ts       # 숲 유저 mock 데이터 생성기
│   └── feedMessages.ts     # 자동 메시지 + 빠른 댓글 템플릿
│
└── types/
    ├── feed.ts             # FeedItem, DietLevel 타입
    └── forest.ts           # ForestUser 타입
```

---

## 핵심 시스템

### 1. IP(Inference Points) 시스템

`PointsContext.tsx`에서 전역 관리. localStorage(`dear-earth-ip`)에 영속화.

| 식사 기록 | 획득 IP |
|-----------|---------|
| 비건 | +30 |
| 오보-락토 | +25 |
| 페스코 | +20 |
| 폴로 | +15 |
| 플렉시테리언 | +10 |
| 타협 체크 (폴로/플렉시) | 항목당 +3 |
| 10초 명상 완료 보너스 | +5 |

**하이드레이션 안전**: `DEFAULT_IP=10`으로 서버/클라이언트 초기값 통일, `useEffect`로 localStorage 읽기, `ready` 플래그로 렌더링 제어.

### 2. 성장 단계

`lib/growth.ts`에서 정의. IP 누적에 따라 캐릭터와 도감이 변화.

| Lv | 이름 | 필요 IP | 아이콘 |
|----|------|---------|--------|
| 1 | 잠꾸러기 씨앗 | 0 | 🌰 |
| 2 | 기지개 새싹 | 101 | 🌱 |
| 3 | 초록 소년기 | 501 | 🌿 |
| 4 | 품어주는 나무 | 1,501 | 🌳 |
| 5 | 디어 어스 | 3,001 | 🌍 |

### 3. 탭 네비게이션

클라이언트 사이드 탭 방식 (Next.js 파일 라우팅 아님).

| 탭 | 컴포넌트 | 설명 |
|----|----------|------|
| 나의 식탁 🌱 | MyDearTab | 캐릭터, 식사 기록, IP 현황 |
| 번지는 초록 📋 | LiveGreenTab | 실시간 피드 (mock 18개) |
| 우리의 숲 🌲 | OurForestTab | 3D 복셀 숲 (mock 15명) |

`TabShell`이 `AnimatePresence`로 좌우 슬라이드 전환 애니메이션 처리.

### 4. 식사 기록 흐름

```
버튼 클릭 → MealLogModal 오픈
  → Phase 1: 채식 단계 선택 (+ 타협 체크박스)
  → Phase 2: 10초 명상 타이머 (건너뛰기 가능)
  → Phase 3: 완료 화면 (획득 IP 표시)
```

- 각 끼니 버튼은 하루 1회만 클릭 가능 (localStorage로 날짜별 추적)
- 비활성화된 버튼에 "기록완료" 표시

### 5. 3D 복셀 숲

React Three Fiber + drei로 마인크래프트 스타일 3D 씬 구현.

**기술 구현:**
- `next/dynamic`으로 `ssr: false` 동적 임포트 (WebGL SSR 불가)
- `OrbitControls`: 드래그 회전, 핀치 줌, 자동 회전 (0.5 속도)
- 따뜻한 조명: ambient(`#F5E6D3`) + directional(`#FFE5B4`) + fill(`#B1E1FF`)

**복셀 나무 (5단계):**
- Lv.1: 작은 갈색 박스 (씨앗)
- Lv.2: 줄기 + 초록 박스 1개 (새싹)
- Lv.3: 줄기 + 초록 2단 피라미드 (어린 나무)
- Lv.4: 두꺼운 줄기 + 3단 피라미드 + 분홍 꽃 (큰 나무)
- Lv.5: 큰 줄기 + 뿌리 + 4단 피라미드 + 꽃 + 새 (세계수)

**인터랙션:** 호버 시 나무가 살짝 떠오름, 클릭 시 TreePopup 바텀시트.

---

## 컬러 팔레트

Tailwind CSS 4 `@theme inline` 방식으로 커스텀 컬러 정의.

| 계열 | 용도 | 대표 색상 |
|------|------|-----------|
| **Sage** (초록) | 브랜드, 액센트, 버튼 | `#5c845c` (500) |
| **Sand** (베이지) | 배경, 카드 | `#faf8f5` (50) |
| **Earth** (갈색) | 텍스트, 보조 | `#553a30` (900) |

각 계열 50~900 단계 (10단계) 정의.

---

## 로컬 저장소 키

| 키 | 용도 |
|----|------|
| `dear-earth-ip` | 누적 IP 포인트 |
| `dear-earth-meals` | 일별 식사 기록 상태 (`{date, meals[]}`) |

---

## 개발 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 실행
```

---

## 향후 계획 (미구현)

- Supabase 연동 (인증, DB, 실시간 구독)
- 실제 사용자 피드 및 숲 데이터
- 이미지 업로드 (식사 사진)
- 푸시 알림
- 랭킹 시스템

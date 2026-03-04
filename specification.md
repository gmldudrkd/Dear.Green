# Dear Earth Specification

> 최종 업데이트: 2026-03-04
>
> 이 문서는 Dear Earth 프로젝트의 기획, 디자인, 기술 스펙을 통합 관리하는 단일 소스입니다.
> 모든 스펙 변경사항은 이 파일에 반영합니다.

---

## 1. 서비스 개요

- **서비스명:** Dear Earth (친애하는 지구에게)
- **슬로건:** "완벽하지 않아도 괜찮아요. 당신의 다정한 기록이 모여 지구를 숨 쉬게 합니다."
- **핵심 컨셉:** 개인의 식단 기록이 실시간 피드로 공유되고, 공동의 가상 숲을 일궈가는 소셜 임팩트 플랫폼
- **타겟 사용자:** 완벽한 채식은 부담스럽지만, 환경과 생명을 위해 작은 실천을 시작하고 싶은 모든 사람

### 핵심 철학

- 완벽함보다는 **불완전한 실천**의 가치를 존중합니다.
- 먹이사슬을 부정하기보다 생명과의 **적정한 거리**를 인지합니다.
- 죄책감이 아닌 **재미와 연대**를 통해 지속 가능한 채식 지향 삶을 돕습니다.

---

## 2. 하단 탭 구성 (Navigation)

| 탭 명칭 | 영문 명칭 | 주요 기능 |
|---------|-----------|-----------|
| **나의 식탁** | **My Dear** | 식단 단계 선택, 이미지 업로드, 10초 명상, 새싹 성장 확인 |
| **번지는 초록** | **Live Green** | 전체 사용자의 실시간 식단 카드 피드, 응원(하트) 및 댓글 |
| **우리의 숲** | **Our Forest** | 가상 현실 공간에 심어진 모든 가입자의 나무 탐험 |

클라이언트 사이드 탭 방식 (Next.js 파일 라우팅 아님). `TabShell`이 `AnimatePresence`로 좌우 슬라이드 전환 애니메이션 처리.

---

## 3. 기능 상세 스펙

### 3.1 한 끼 로그 (The Log) - [나의 식탁] 탭

복잡한 칼로리 계산은 빼고, **나의 선택**에만 집중합니다.

- **입력 폼:** [아침], [점심], [저녁] 버튼 클릭 시 입력 창 활성화
  - **이미지 업로드:** 오늘 먹은 음식을 사진으로 첨부 (선택 사항)
  - **단계 선택:** 비건 / 오보-락토 / 페스코 / 폴로 / 플렉시테리언 중 택 1
  - **타협 기록:** 고기를 먹었다면 "그래도 채소를 많이 먹었나요?" 같은 체크박스 1~2개 추가
- **결과:** 선택에 따라 인지 포인트(IP) 지급
- 각 끼니 버튼은 하루 1회만 클릭 가능 (localStorage로 날짜별 추적)
- 비활성화된 버튼에 "기록완료" 표시

#### 식사 기록 흐름

```
버튼 클릭 → MealLogModal 오픈
  → Phase 1: 채식 단계 선택 (+ 타협 체크박스)
  → Phase 2: 사진 업로드 (선택, +5 IP 보너스)
  → Phase 3: 10초 명상 타이머 (건너뛰기 가능)
  → Phase 4: 완료 화면 (획득 IP 표시)
```

### 3.2 10초 숨 고르기 (Mindfulness Timer)

사이트의 철학을 보여주는 가장 쉬운 방법입니다.

- 식사 기록 버튼을 누르기 전, "잠시만요" 팝업과 함께 10초 카운트다운
- "이 식재료의 여정을 10초만 생각해주세요" 문구 노출
- 타이머를 끝까지 보면 추가 포인트 지급

### 3.3 번지는 초록 (Live Green) - 실시간 피드

- **UI 구조:** 수직 스크롤 형태의 실시간 카드 리스트
- **카드 내용:** `유저 닉네임` + `식사 시간` + `단계` + `업로드 사진`
  - 예: "지구지킴이님은 오늘 점심으로 [비건 식]을 먹었어요!"
- **소셜 기능:** '하트(좋아요)' 버튼 클릭 시 화면에 잎사귀가 흩날리는 효과
- **자동 문구:** "방금 누군가 지구와의 거리를 10cm 더 좁혔습니다!" 등의 알림 배너

### 3.4 우리의 숲 (Our Forest) - 가상 공동체 숲

- **비주얼:** 마인크래프트 스타일 3D 복셀 씬 (React Three Fiber + drei)
- **공동체 경험:** 모든 가입자의 나무가 랜덤 위치에 자동 배치
- **상호작용:** 타인의 나무를 클릭하면 해당 유저의 '식물도감'과 최근 식단 피드가 팝업으로 노출
- **환경 효과:** 밤이 되면 반딧불이가 빛나고, 공동 목표 달성 시 숲 전체에 무지개가 뜨는 시각적 보상

**3D 기술 구현:**
- `next/dynamic`으로 `ssr: false` 동적 임포트 (WebGL SSR 불가)
- `OrbitControls`: 드래그 회전, 핀치 줌 (자동 회전 없음, 사용자 직접 조작)
- 따뜻한 조명: ambient(`#F5E6D3`) + directional(`#FFE5B4`) + fill(`#B1E1FF`)
- **구형 대지:** 반지름 18의 구(sphere) 위에 나무·장식 배치 ("리틀 플래닛" 형태)
- **전체 화면 너비:** Our Forest 탭은 `max-w-md` 제약 없이 화면 전체 사용

**복셀 나무 (5단계):**
- Lv.1: 작은 갈색 박스 (씨앗)
- Lv.2: 줄기 + 초록 박스 1개 (새싹)
- Lv.3: 줄기 + 초록 2단 피라미드 (어린 나무)
- Lv.4: 두꺼운 줄기 + 3단 피라미드 + 분홍 꽃 (큰 나무)
- Lv.5: 큰 줄기 + 뿌리 + 4단 피라미드 + 꽃 + 새 (세계수)

**닉네임 라벨:** 각 나무 꼭대기에 sin() 애니메이션으로 둥둥 떠다니는 닉네임 표시. 클릭 시 TreePopup 오픈.

**인터랙션:** 호버 시 나무가 살짝 떠오름, 클릭 시 TreePopup 바텀시트. 작은 나무(씨앗 등)는 투명 히트박스로 클릭 영역 확대. 팝업이 열리면 닉네임 라벨은 숨김 처리.

---

## 4. IP(Inference Points) 시스템

`PointsContext.tsx`에서 전역 관리. localStorage(`dear-earth-ip`)에 영속화.

| 식사 기록 | 획득 IP |
|-----------|---------|
| 비건 | +30 |
| 오보-락토 | +25 |
| 페스코 | +20 |
| 폴로 | +15 |
| 플렉시테리언 | +10 |
| 타협 체크 (폴로/플렉시) | 항목당 +3 |
| 사진 업로드 보너스 | +5 |
| 10초 명상 완료 보너스 | +5 |

**하이드레이션 안전**: `DEFAULT_IP=10`으로 서버/클라이언트 초기값 통일, `useEffect`로 localStorage 읽기, `ready` 플래그로 렌더링 제어.

---

## 5. 성장 단계 시스템 (식물도감)

`lib/growth.ts`에서 정의. IP 누적에 따라 캐릭터와 도감이 변화.

> "이 도감은 완벽한 정답지가 아닙니다. 당신이 지구와 가까워지기 위해 고민한 흔적을 기록한 '성장 일기'입니다."

| Lv | 명칭 | 필요 IP | 아이콘 | 외형 특징 | 도감 설명 |
|----|------|---------|--------|-----------|-----------|
| 1 | 잠꾸러기 씨앗 | 0~100 | 🌰 | 흙 속에 살짝 내민 고개 | "아직은 수줍은 시작이에요. 당신의 첫 번째 인지가 씨앗을 깨우는 노크 소리가 됩니다." |
| 2 | 기지개 새싹 | 101~500 | 🌱 | 앙증맞은 잎사귀 두 개 | "축하해요! 첫 잎이 돋았어요. 당신이 머뭇거린 그 고기 한 점의 무게만큼 잎사귀가 단단해졌네요." |
| 3 | 초록 소년기 | 501~1,500 | 🌿 | 줄기가 굵어지고 잎이 풍성함 | "이제 제법 나무의 결이 보여요. 불완전해도 꾸준한 당신의 기록이 숲의 밑거름이 되었답니다." |
| 4 | 품어주는 나무 | 1,501~3,000 | 🌳 | 꽃이 피고 작은 새가 찾아옴 | "당신의 숲에 첫 손님이 찾아왔어요. 먹이사슬 속에서도 생명을 존중하는 당신의 마음이 꽃피운 결과예요." |
| 5 | 디어 어스(지구의 나무) | 3,001+ | 🌍 | 거대하고 푸른 세계수 | "지구와 당신이 가장 다정한 거리를 찾았군요. 이제 당신의 나무는 수많은 생명이 숨 쉬는 안식처입니다." |

### 도감 특별 요소

- **실천의 결 (Texture):** 사용자가 주로 기록한 식단 단계에 따라 나무의 '결'이나 '분위기'가 미묘하게 달라짐
  - 완벽 비건 위주: 맑고 선명한 에메랄드빛 잎사귀
  - 유연한 타협 위주: 따뜻하고 포근한 파스텔 톤의 다채로운 꽃들이 섞인 나무
- **돌아온 친구들 (Animals):** 특정 포인트 구간마다 새싹 주변에 동물이 추가
  - 꿀벌 (꽃이 피었을 때) → 다람쥐 (열매가 맺혔을 때) → 노루 (나무가 그늘을 만들었을 때)

### 도감 UI

- **도감 보기 버튼:** 메인 화면의 새싹 옆에 작은 '책 모양 아이콘' 배치
- **잠금 해제 시스템:** 아직 도달하지 못한 단계는 실루엣(그림자) 처리, "다음 성장까지 150IP 남았어요!" 문구로 동기 부여
- **공유 카드:** 단계가 올라갈 때마다 성장 알림 이미지 생성

---

## 6. 커뮤니케이션 가이드 (Copywriting)

### 실시간 피드 자동 문구

- "{닉네임}님이 방금 다정한 한 끼를 기록했습니다. 지구의 온도가 조금 내려갔어요!"
- "{닉네임}님이 오늘 세 끼 모두 초록빛으로 채웠습니다! 대단해요"
- "{닉네임}님이 고심 끝에 '차선의 선택'을 기록했습니다. 그 고민의 무게가 숲을 키웁니다."

### 빠른 댓글 추천 (Quick Reply)

- "맛있어 보여요! 저도 내일은 비건 식단 도전해볼게요."
- "포기하지 않고 기록해주셔서 감사해요. 함께 힘내요!"
- "나무가 정말 많이 자랐네요! 부러워요"
- "이 메뉴 어디서 파나요? 저도 적정한 거리를 지켜보고 싶어요."

---

## 7. 기술 스택

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
| 폰트 | Caveat (Google Fonts), Pretendard Variable | |
| Backend/DB | Supabase (Auth, DB, Realtime Feed) | @supabase/supabase-js |
| Storage | Supabase Storage (Image upload) | |
| 아이콘 | 인라인 SVG (크로스 플랫폼 일관성) | |

---

## 8. 프로젝트 구조

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
│   ├── supabase.ts          # Supabase 클라이언트 인스턴스
│   ├── growth.ts            # 성장 단계 데이터 및 헬퍼 함수
│   ├── mockFeed.ts          # 피드 mock 데이터 생성기
│   ├── mockForest.ts        # 숲 유저 mock 데이터 생성기
│   └── feedMessages.ts      # 자동 메시지 + 빠른 댓글 템플릿
│
└── types/
    ├── feed.ts             # FeedItem, DietLevel 타입
    └── forest.ts           # ForestUser 타입
```

---

## 9. 디자인 시스템

### 컬러 팔레트

Tailwind CSS 4 `@theme inline` 방식으로 커스텀 컬러 정의.

| 계열 | 용도 | 대표 색상 |
|------|------|-----------|
| **Sage** (초록) | 브랜드, 액센트, 버튼 | `#5c845c` (500) |
| **Sand** (베이지) | 배경, 카드 | `#faf8f5` (50) |
| **Earth** (갈색) | 텍스트, 보조 | `#553a30` (900) |

각 계열 50~900 단계 (10단계) 정의.

---

## 10. 로컬 저장소 키 (Supabase 마이그레이션 대상)

| 키 | 용도 | 마이그레이션 대상 |
|----|------|-------------------|
| `dear-earth-ip` | 누적 IP 포인트 | `profiles.total_ip` |
| `dear-earth-meals` | 일별 식사 기록 상태 (`{date, meals[]}`) | `meal_logs` 테이블 |

---

## 11. 데이터베이스 (Supabase)

### 11.1 연결 정보

- **Project URL:** 환경변수 `NEXT_PUBLIC_SUPABASE_URL` (`.env.local`)
- **Anon Key:** 환경변수 `NEXT_PUBLIC_SUPABASE_ANON_KEY` (`.env.local`)
- **클라이언트:** `src/lib/supabase.ts`
- **마이그레이션:** `supabase/migrations/00001_initial_schema.sql`

### 11.2 Enum Types (대문자 관리)

| Enum 이름 | 값 |
|-----------|-----|
| `meal_level` | `VEGAN`, `OVO_LACTO`, `PESCO`, `POLLO`, `FLEXITARIAN` |
| `meal_type` | `BREAKFAST`, `LUNCH`, `DINNER` |

### 11.3 테이블 스키마

#### `profiles` — 유저 프로필 (auth.users 확장)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | uuid | PK, FK→auth.users(id) ON DELETE CASCADE | 유저 ID |
| `nickname` | text | NOT NULL | 닉네임 |
| `avatar_emoji` | text | NOT NULL, DEFAULT '🌱' | 아바타 이모지 |
| `total_ip` | integer | NOT NULL, DEFAULT 0, CHECK >= 0 | 누적 IP |
| `forest_x` | real | NOT NULL, DEFAULT 0 | 숲 3D x좌표 (-8~8) |
| `forest_y` | real | NOT NULL, DEFAULT 0 | 숲 3D y좌표 (-5~5) |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | 가입일 |
| `updated_at` | timestamptz | NOT NULL, DEFAULT now() | 수정일 |

> `tree_level`은 저장하지 않음 — `get_tree_level(total_ip)` 함수로 계산

#### `meal_logs` — 식사 기록 (= 피드 아이템)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | 기록 ID |
| `user_id` | uuid | NOT NULL, FK→profiles(id) ON DELETE CASCADE | 작성자 |
| `meal_date` | date | NOT NULL, DEFAULT CURRENT_DATE | 식사 날짜 |
| `meal_type` | meal_type | NOT NULL | BREAKFAST/LUNCH/DINNER |
| `meal_level` | meal_level | NOT NULL | VEGAN~FLEXITARIAN |
| `compromise_checks` | smallint | NOT NULL, DEFAULT 0, CHECK 0~2 | 타협 체크 수 (+3 IP 각) |
| `photo_path` | text | nullable | Supabase Storage 경로 |
| `meditation_completed` | boolean | NOT NULL, DEFAULT false | 명상 완료 여부 |
| `auto_message` | text | nullable | 자동 생성 메시지 |
| `ip_earned` | integer | NOT NULL, DEFAULT 0, CHECK >= 0 | 이 식사로 획득한 IP |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | 생성일 |

> UNIQUE(user_id, meal_date, meal_type) — 하루 한 끼 한 번 제약

#### `feed_likes` — 좋아요

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | ID |
| `meal_log_id` | uuid | NOT NULL, FK→meal_logs(id) ON DELETE CASCADE | 피드 아이템 |
| `user_id` | uuid | NOT NULL, FK→profiles(id) ON DELETE CASCADE | 좋아요 누른 유저 |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | 생성일 |

> UNIQUE(meal_log_id, user_id) — 유저당 1좋아요

#### `feed_comments` — 댓글

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | ID |
| `meal_log_id` | uuid | NOT NULL, FK→meal_logs(id) ON DELETE CASCADE | 피드 아이템 |
| `user_id` | uuid | NOT NULL, FK→profiles(id) ON DELETE CASCADE | 작성자 |
| `text` | text | NOT NULL, CHECK 길이 1~500 | 댓글 내용 |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | 생성일 |

#### `ip_transactions` — IP 변동 감사 로그

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | ID |
| `user_id` | uuid | NOT NULL, FK→profiles(id) ON DELETE CASCADE | 유저 |
| `meal_log_id` | uuid | FK→meal_logs(id) ON DELETE SET NULL | 관련 식사 기록 |
| `amount` | integer | NOT NULL | 변동량 (음수 가능) |
| `reason` | text | NOT NULL | 사유 (e.g. meal:VEGAN,photo,meditation) |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | 생성일 |

### 11.4 Helper Functions

| 함수 | 용도 |
|------|------|
| `get_tree_level(ip integer) → smallint` | IP → 나무 레벨(1-5) 계산. `growth.ts` `getStage()` 포팅 |
| `calculate_meal_ip(meal_level, checks, photo, meditation) → integer` | 식사 IP 계산. `MealLogModal.tsx` 로직 포팅 |

### 11.5 Triggers

| 트리거 | 테이블 | 타이밍 | 동작 |
|--------|--------|--------|------|
| `trg_meal_log_insert` | meal_logs | BEFORE INSERT | IP 자동 계산, `profiles.total_ip` 갱신, `ip_transactions` 감사 로그 기록 |
| `on_auth_user_created` | auth.users | AFTER INSERT | `profiles` 자동 생성 (닉네임, 이모지, 랜덤 숲 좌표) |

### 11.6 Views

| 뷰 | 매칭 인터페이스 | 용도 |
|----|----------------|------|
| `feed_view` | `FeedItem` (feed.ts) | 피드 조회 (meal_logs + profiles + 좋아요/댓글 수 집계) |
| `forest_view` | `ForestUser` (forest.ts) | 숲 조회 (profiles + tree_level 계산 + 최근 meal_level) |

### 11.7 Row Level Security (RLS)

| 테이블 | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| profiles | 전체 공개 | 트리거 자동 | 본인만 | - |
| meal_logs | 전체 공개 | 본인만 | 본인만 | 본인만 |
| feed_likes | 전체 공개 | 본인만 | - | 본인만 |
| feed_comments | 전체 공개 | 본인만 | - | 본인만 |
| ip_transactions | 본인만 | 트리거 자동 | - | - |

### 11.8 Storage

| 버킷 | 공개 여부 | 용량 제한 | 허용 MIME | 경로 규칙 |
|------|-----------|-----------|-----------|-----------|
| `meal-photos` | private | 5MB | jpeg, png, webp, heic | `{user_id}/{meal_log_id}.jpg` |

### 11.9 Realtime 구독

| 테이블 | 이벤트 | 용도 |
|--------|--------|------|
| meal_logs | INSERT | 새 식사 기록이 피드에 실시간 반영 |
| feed_likes | INSERT, DELETE | 좋아요 수 실시간 갱신 |
| feed_comments | INSERT | 새 댓글 실시간 반영 |

---

## 12. 개발 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 실행
```

---

## 13. 기획 전략 메모

1. **데이터 최소화:** MVP 버전에서는 고해상도 이미지보다 가벼운 용량의 이미지를 권장하여 로딩 속도 최적화.
2. **소셜 장치:** 피드 탭에서 '좋아요' 수가 많은 유저의 나무는 숲 탭에서 살짝 빛나게 하여 참여 동기 부여.
3. **포용성:** 고기를 먹었더라도 '남기지 않은 기록'에 대해서는 충분한 칭찬 메시지를 제공하여 이탈 방지.

---

## 14. 향후 계획 (미구현)

- Supabase Auth 연동 (인증 흐름)
- 컴포넌트 Supabase 연동 (localStorage → DB 전환)
- 실시간 피드 구독 (Realtime)
- 푸시 알림
- 랭킹 시스템
- 밤 반딧불이 / 무지개 등 환경 효과
- 실천의 결(Texture) 분기 렌더링
- 동물 친구 등장 애니메이션

---

## Changelog

| 날짜 | 내용 |
|------|------|
| 2026-03-04 | Supabase DB 스키마 설계 및 연동 설정 (섹션 11 추가), 기술 스택·프로젝트 구조·향후 계획 업데이트 |
| 2026-03-01 | README.md, TECHNICAL.md, plan_v2.md 통합하여 초기 문서 생성 |

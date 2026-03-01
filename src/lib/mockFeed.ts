import type { FeedItem, DietLevel } from "@/types/feed";

const nicknames = [
  "지구지킴이", "초록발자국", "다정한식탁", "푸른하늘", "새싹농부",
  "숲속다람쥐", "바다거북이", "해바라기", "민들레씨", "작은정원",
  "초록바람", "따뜻한손", "느린산책", "풀잎이슬", "하늘구름",
];

const avatars = ["🌻", "🐰", "🍀", "🌈", "🐢", "🌸", "🦋", "🍃", "🌾", "🐧"];

const dietLevels: DietLevel[] = ["vegan", "ovo-lacto", "pesco", "pollo", "flexitarian"];

const mealTypes = ["breakfast", "lunch", "dinner"] as const;

const photoPlaceholders = [
  "🥗🍚🥦", "🥙🥕🌽", "🍱🥬🫘", "🥑🍞🥒",
  "🫑🍅🧅", "🥜🍇🍌", "🌯🥝🥕", "🍜🥬🍄",
];

const feedMessages = [
  null,
  null,
  "다정한 한 끼를 기록했습니다!",
  "고심 끝에 차선의 선택을 기록했습니다.",
  "오늘 세 끼 모두 초록빛으로 채웠습니다!",
];

export function generateMockFeed(): FeedItem[] {
  const now = Date.now();
  return Array.from({ length: 18 }, (_, i) => {
    const nickname = nicknames[i % nicknames.length];
    const msg = feedMessages[i % feedMessages.length];
    const hasPhoto = i % 3 === 0;
    return {
      id: `feed-${i}`,
      nickname,
      avatarEmoji: avatars[i % avatars.length],
      mealType: mealTypes[i % 3],
      dietLevel: dietLevels[Math.floor(Math.random() * dietLevels.length)],
      ...(hasPhoto ? { photoPlaceholder: photoPlaceholders[i % photoPlaceholders.length] } : {}),
      timestamp: now - (i * 47 + Math.floor(Math.random() * 30)) * 60 * 1000,
      likes: Math.floor(Math.random() * 35),
      hasLiked: false,
      autoMessage: msg ? `${nickname}님이 ${msg}` : null,
      comments: [],
    };
  });
}

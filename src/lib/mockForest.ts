import type { ForestUser } from "@/types/forest";

const nicknames = [
  "지구지킴이", "초록발자국", "다정한식탁", "푸른하늘", "새싹농부",
  "숲속다람쥐", "바다거북이", "해바라기", "민들레씨", "작은정원",
  "초록바람", "따뜻한손", "느린산책", "풀잎이슬", "하늘구름",
];

const avatars = ["🌻", "🐰", "🍀", "🌈", "🐢", "🌸", "🦋", "🍃", "🌾", "🐧", "🐥", "🦊", "🐝", "🌺", "🎋"];

const diets = ["vegan", "ovo-lacto", "pesco", "pollo", "flexitarian"] as const;

export function generateForestUsers(): ForestUser[] {
  return Array.from({ length: 15 }, (_, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    // 3D 월드 좌표: -8 ~ 8 범위, 행마다 지그재그
    const x = -7 + col * 3.5 + (row % 2 === 1 ? 1.75 : 0);
    const y = -5 + row * 5;
    return {
      id: `forest-${i}`,
      nickname: nicknames[i],
      avatarEmoji: avatars[i],
      treeLevel: (Math.min(Math.floor(Math.random() * 5) + 1, 5)) as 1 | 2 | 3 | 4 | 5,
      ip: Math.floor(Math.random() * 3500) + 10,
      x,
      y,
      joinedDaysAgo: Math.floor(Math.random() * 90) + 1,
      dietLevel: diets[Math.floor(Math.random() * diets.length)],
    };
  });
}

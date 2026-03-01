export interface GrowthStage {
  level: number;
  name: string;
  minIP: number;
  icon: string;
  description: string;
  greeting: string;
}

export const stages: GrowthStage[] = [
  {
    level: 1,
    name: "잠꾸러기 씨앗",
    minIP: 0,
    icon: "🌰",
    description:
      "아직은 수줍은 시작이에요. 당신의 첫 번째 인지가 씨앗을 깨우는 노크 소리가 됩니다.",
    greeting: "씨앗이 당신을 기다리고 있어요",
  },
  {
    level: 2,
    name: "기지개 새싹",
    minIP: 101,
    icon: "🌱",
    description:
      "축하해요! 첫 잎이 돋았어요. 당신이 머뭇거린 그 고기 한 점의 무게만큼 잎사귀가 단단해졌네요.",
    greeting: "새싹이 당신을 기다리고 있어요",
  },
  {
    level: 3,
    name: "초록 소년기",
    minIP: 501,
    icon: "🌿",
    description:
      "이제 제법 나무의 결이 보여요. 불완전해도 꾸준한 당신의 기록이 숲의 밑거름이 되었답니다.",
    greeting: "작은 나무가 당신과 함께 자라고 있어요",
  },
  {
    level: 4,
    name: "품어주는 나무",
    minIP: 1501,
    icon: "🌳",
    description:
      "당신의 숲에 첫 손님이 찾아왔어요. 먹이사슬 속에서도 생명을 존중하는 당신의 마음이 꽃피운 결과예요.",
    greeting: "나무에 꽃이 피고, 새가 찾아왔어요",
  },
  {
    level: 5,
    name: "디어 어스",
    minIP: 3001,
    icon: "🌍",
    description:
      "지구와 당신이 가장 다정한 거리를 찾았군요. 이제 당신의 나무는 수많은 생명이 숨 쉬는 안식처입니다.",
    greeting: "당신의 나무가 지구의 숲이 되었어요",
  },
];

export function getStage(ip: number): GrowthStage {
  for (let i = stages.length - 1; i >= 0; i--) {
    if (ip >= stages[i].minIP) return stages[i];
  }
  return stages[0];
}

export function getNextStage(ip: number): GrowthStage | null {
  const current = getStage(ip);
  const next = stages.find((s) => s.level === current.level + 1);
  return next ?? null;
}

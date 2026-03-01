export interface ForestUser {
  id: string;
  nickname: string;
  avatarEmoji: string;
  treeLevel: 1 | 2 | 3 | 4 | 5;
  ip: number;
  x: number;
  y: number;
  joinedDaysAgo: number;
  dietLevel: "vegan" | "ovo-lacto" | "pesco" | "pollo" | "flexitarian";
}

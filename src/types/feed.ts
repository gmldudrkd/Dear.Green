export type DietLevel = "vegan" | "ovo-lacto" | "pesco" | "pollo" | "flexitarian";

export interface FeedComment {
  id: string;
  text: string;
  timestamp: number;
}

export interface FeedItem {
  id: string;
  nickname: string;
  avatarEmoji: string;
  mealType: "breakfast" | "lunch" | "dinner";
  dietLevel: DietLevel;
  photoPlaceholder?: string;
  timestamp: number;
  likes: number;
  hasLiked: boolean;
  autoMessage: string | null;
  comments: FeedComment[];
}

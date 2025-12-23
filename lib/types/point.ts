export interface PointInfo {
  userId: number;
  totalPoints: number;
  availablePoints: number;
  level: PointLevel;
  tierBadge: string;
  createdAt: string;
  updatedAt: string;
}

export enum PointLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

export interface PointTransaction {
  id: number;
  userId: number;
  amount: number;
  type: PointTransactionType;
  reason: string;
  balanceAfter: number;
  createdAt: string;
}

export enum PointTransactionType {
  EARNED = 'EARNED',
  USED = 'USED',
  ADJUSTED = 'ADJUSTED',
}

export interface PointRanking {
  rank: number;
  user: {
    id: number;
    username: string;
    nickname: string;
    avatarUrl?: string;
  };
  totalPoints: number;
  level: PointLevel;
}

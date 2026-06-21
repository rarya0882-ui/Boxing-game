export interface PlayerStats {
  power: number;
  maxStamina: number;
  stamina: number; // current stamina
  speed: number;
}

export interface EnemyStats {
  name: string;
  stamina: number;
  maxStamina: number;
  power: number;
  speed: number;
  key: "rookie" | "contender" | "heavyweight" | "champion";
  image: string;
}

export interface GameProgress {
  name: string;
  nim: string;
  classCode: string;
  totalPoints: number; // tracks overall score
  trainingRewardPoints: number; // reward points to distribute in current training
  currentStep: number; // 0 to 12
  startTime: number; // time when the game started
  endTime: number; // time when game ended
}

export interface ActivityQuestion {
  id: number;
  question: string;
  options?: string[];
  answer: string | boolean | string[] | any; // depends on type
}

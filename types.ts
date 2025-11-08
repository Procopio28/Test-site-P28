
export enum PlantType {
  PEASHOOTER = 'PEASHOOTER',
  SUNFLOWER = 'SUNFLOWER',
  WALLNUT = 'WALLNUT',
}

export enum ZombieType {
  NORMAL = 'NORMAL',
}

export type GameStatus = 'IDLE' | 'PLAYING' | 'WON' | 'LOST';

export interface Plant {
  id: string;
  type: PlantType;
  row: number;
  col: number;
  health: number;
  fireCooldown?: number;
  sunCooldown?: number;
}

export interface Zombie {
  id: string;
  type: ZombieType;
  row: number;
  x: number;
  health: number;
  isEating: boolean;
}

export interface Pea {
  id:string;
  row: number;
  x: number;
}

export interface Sun {
  id: string;
  x: number;
  y: number;
  isFalling: boolean;
  targetY?: number;
  createdAt: number;
}

export interface PlantDefinition {
  cost: number;
  health: number;
  recharge: number; // in game ticks
  damage?: number;
  fireRate?: number; // in game ticks
  sunProduction?: number; // in game ticks
}

export interface ZombieDefinition {
  health: number;
  speed: number;
  damage: number;
}

export interface GameState {
  sun: number;
  plants: Plant[];
  zombies: Zombie[];
  peas: Pea[];
  suns: Sun[];
  status: GameStatus;
  wave: number;
  zombiesToSpawn: number;
  gameTick: number;
  plantCooldowns: { [key in PlantType]?: number };
}
   
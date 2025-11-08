
import { PlantType, ZombieType, PlantDefinition, ZombieDefinition } from './types';

export const GAME_CONFIG = {
  GRID_ROWS: 5,
  GRID_COLS: 9,
  CELL_WIDTH: 100, // Approximate percentage
  CELL_HEIGHT: 120, // Approximate percentage
  GAME_SPEED: 100, // ms per tick
  SUN_FALL_RATE: 80, // ticks
  SUN_LIFESPAN: 80, // ticks
  SUN_VALUE: 25,
};

export const PLANT_DEFINITIONS: { [key in PlantType]: PlantDefinition } = {
  [PlantType.PEASHOOTER]: {
    cost: 100,
    health: 300,
    recharge: 50, // 5 seconds
    damage: 20,
    fireRate: 15, // 1.5 seconds
  },
  [PlantType.SUNFLOWER]: {
    cost: 50,
    health: 300,
    recharge: 50, // 5 seconds
    sunProduction: 240, // 24 seconds
  },
  [PlantType.WALLNUT]: {
    cost: 50,
    health: 4000,
    recharge: 200, // 20 seconds
  },
};

export const ZOMBIE_DEFINITIONS: { [key in ZombieType]: ZombieDefinition } = {
  [ZombieType.NORMAL]: {
    health: 100,
    speed: 0.25, // percentage of cell width per tick
    damage: 100 / 10, // 100 damage per second, so 10 per tick
  },
};

export const WAVES = [
  { zombies: 1, delay: 50 },
  { zombies: 2, delay: 150 },
  { zombies: 3, delay: 200 },
  { zombies: 5, delay: 250 },
];
   
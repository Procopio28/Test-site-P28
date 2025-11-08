
import { GameState, Plant, Zombie, Pea, Sun, PlantType, ZombieType, GameStatus } from '../types';
import { PLANT_DEFINITIONS, ZOMBIE_DEFINITIONS, GAME_CONFIG, WAVES } from '../constants';

type Action =
  | { type: 'GAME_TICK' }
  | { type: 'START_GAME' }
  | { type: 'PLACE_PLANT', payload: { plantType: PlantType, row: number, col: number } }
  | { type: 'COLLECT_SUN', payload: { id: string } };

export const initialGameState: GameState = {
  sun: 50,
  plants: [],
  zombies: [],
  peas: [],
  suns: [],
  status: 'IDLE',
  wave: 0,
  zombiesToSpawn: 0,
  gameTick: 0,
  plantCooldowns: {},
};

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME':
      return initialGameState;
    case 'PLACE_PLANT': {
      const { plantType, row, col } = action.payload;
      const plantDef = PLANT_DEFINITIONS[plantType];
      const newPlant: Plant = {
        id: `plant-${Date.now()}`,
        type: plantType,
        row, col,
        health: plantDef.health,
        fireCooldown: plantDef.fireRate,
        sunCooldown: plantDef.sunProduction,
      };
      return {
        ...state,
        sun: state.sun - plantDef.cost,
        plants: [...state.plants, newPlant],
        plantCooldowns: { ...state.plantCooldowns, [plantType]: plantDef.recharge },
      };
    }
    case 'COLLECT_SUN': {
      return {
        ...state,
        sun: state.sun + GAME_CONFIG.SUN_VALUE,
        suns: state.suns.filter(s => s.id !== action.payload.id),
      };
    }
    case 'GAME_TICK': {
      if (state.status !== 'PLAYING') return state;

      let newState = { ...state };
      newState.gameTick++;

      // Update plant cooldowns
      const newCooldowns = { ...newState.plantCooldowns };
      for (const key in newCooldowns) {
        if (newCooldowns[key as PlantType]! > 0) {
          newCooldowns[key as PlantType]!--;
        }
      }
      newState.plantCooldowns = newCooldowns;

      // Sun falling
      if (newState.gameTick % GAME_CONFIG.SUN_FALL_RATE === 0) {
        const newSun: Sun = {
          id: `sun-${Date.now()}`,
          x: Math.random() * 80 + 10,
          y: -10,
          isFalling: true,
          targetY: Math.random() * 60 + 20,
          createdAt: newState.gameTick,
        };
        newState.suns.push(newSun);
      }

      // Update suns
      newState.suns = newState.suns.map(sun => {
        if (sun.isFalling && sun.y < sun.targetY!) {
          return { ...sun, y: sun.y + 1 };
        }
        return sun;
      }).filter(sun => newState.gameTick - sun.createdAt < GAME_CONFIG.SUN_LIFESPAN);

      // Zombie spawning
      if (newState.zombies.length === 0 && newState.zombiesToSpawn === 0) {
        if (newState.wave < WAVES.length) {
          const currentWave = WAVES[newState.wave];
          if (newState.gameTick > currentWave.delay) {
            newState.zombiesToSpawn = currentWave.zombies;
            newState.wave++;
          }
        } else if (newState.plants.length > 0) {
          newState.status = 'WON';
        }
      }

      if (newState.zombiesToSpawn > 0 && newState.gameTick % 50 === 0) {
        const newZombie: Zombie = {
          id: `zombie-${Date.now()}`,
          type: ZombieType.NORMAL,
          row: Math.floor(Math.random() * GAME_CONFIG.GRID_ROWS),
          x: 100,
          health: ZOMBIE_DEFINITIONS[ZombieType.NORMAL].health,
          isEating: false,
        };
        newState.zombies.push(newZombie);
        newState.zombiesToSpawn--;
      }
      
      const newPeas: Pea[] = [];
      
      // Plant actions
      newState.plants = newState.plants.map(plant => {
        let { fireCooldown = 0, sunCooldown = 0 } = plant;
        const hasZombieInRow = newState.zombies.some(z => z.row === plant.row && z.x < 95);

        if (plant.type === PlantType.PEASHOOTER && hasZombieInRow) {
          if (fireCooldown <= 0) {
            newPeas.push({
              id: `pea-${Date.now()}-${Math.random()}`,
              row: plant.row,
              x: (plant.col + 0.5) * (100 / GAME_CONFIG.GRID_COLS),
            });
            fireCooldown = PLANT_DEFINITIONS.PEASHOOTER.fireRate!;
          }
        }

        if (plant.type === PlantType.SUNFLOWER) {
          if (sunCooldown <= 0) {
            const sunX = (plant.col) * (100 / GAME_CONFIG.GRID_COLS) + (Math.random() * 4 - 2);
            const sunY = (plant.row + 0.5) * (100 / GAME_CONFIG.GRID_ROWS) + (Math.random() * 4 - 2);
            newState.suns.push({
                id: `sun-${Date.now()}`,
                x: sunX,
                y: sunY,
                isFalling: false,
                createdAt: newState.gameTick,
            });
            sunCooldown = PLANT_DEFINITIONS.SUNFLOWER.sunProduction!;
          }
        }

        fireCooldown = Math.max(0, fireCooldown - 1);
        sunCooldown = Math.max(0, sunCooldown - 1);

        return { ...plant, fireCooldown, sunCooldown };
      });
      newState.peas = [...newState.peas, ...newPeas];

      // Move peas and check for collisions
      const peasToRemove = new Set<string>();
      const zombiesToDamage = new Map<string, number>();

      newState.peas = newState.peas.map(pea => {
        const newX = pea.x + 2;
        let hit = false;
        for (const zombie of newState.zombies) {
          if (zombie.row === pea.row && newX >= zombie.x && newX < zombie.x + 5) {
            zombiesToDamage.set(zombie.id, (zombiesToDamage.get(zombie.id) || 0) + PLANT_DEFINITIONS.PEASHOOTER.damage!);
            hit = true;
            break; 
          }
        }
        if (hit) peasToRemove.add(pea.id);
        return { ...pea, x: newX };
      }).filter(pea => pea.x < 100 && !peasToRemove.has(pea.id));

      let plantsToDamage = new Map<string, number>();

      // Move zombies and check for collisions
      newState.zombies = newState.zombies.map(zombie => {
        let plantInFront: Plant | undefined = undefined;
        for(const p of newState.plants) {
          if (p.row === zombie.row) {
            const plantX = p.col * (100 / GAME_CONFIG.GRID_COLS);
            if (zombie.x > plantX && zombie.x < plantX + (100 / GAME_CONFIG.GRID_COLS)) {
              plantInFront = p;
              break;
            }
          }
        }
        
        const isEating = !!plantInFront;
        const newX = isEating ? zombie.x : zombie.x - ZOMBIE_DEFINITIONS.NORMAL.speed;

        if (isEating) {
            plantsToDamage.set(plantInFront!.id, (plantsToDamage.get(plantInFront!.id) || 0) + ZOMBIE_DEFINITIONS.NORMAL.damage);
        }

        if (newX < -5) {
          newState.status = 'LOST';
        }

        const damage = zombiesToDamage.get(zombie.id) || 0;
        return { ...zombie, x: newX, isEating, health: zombie.health - damage };
      }).filter(zombie => zombie.health > 0);
      
      // Apply damage to plants
      newState.plants = newState.plants.map(plant => {
          const damage = plantsToDamage.get(plant.id) || 0;
          return { ...plant, health: plant.health - damage };
      }).filter(plant => plant.health > 0);

      return newState;
    }
    default:
      return state;
  }
}
   
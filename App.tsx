
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameUI } from './components/GameUI';
import { CrazyDaveDialog } from './components/CrazyDaveDialog';
import { PlantType, GameState, Plant, Zombie, Pea, Sun, PlantDefinition, ZombieDefinition, GameStatus } from './types';
import { PLANT_DEFINITIONS, ZOMBIE_DEFINITIONS, GAME_CONFIG } from './constants';
import { initialGameState, gameReducer } from './services/gameReducer';

const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);

  const { sun, plants, zombies, peas, suns, status, wave } = state;

  const handleCollectSun = useCallback((id: string) => {
    dispatch({ type: 'COLLECT_SUN', payload: { id } });
  }, []);

  const handlePlacePlant = useCallback((row: number, col: number) => {
    if (!selectedPlant) return;
    const plantDef = PLANT_DEFINITIONS[selectedPlant];
    const isOccupied = plants.some(p => p.row === row && p.col === col);

    if (sun >= plantDef.cost && !isOccupied) {
      dispatch({
        type: 'PLACE_PLANT',
        payload: {
          plantType: selectedPlant,
          row,
          col,
        },
      });
      setSelectedPlant(null);
    }
  }, [selectedPlant, sun, plants]);

  const handleSelectPlant = useCallback((plantType: PlantType) => {
    const plantDef = PLANT_DEFINITIONS[plantType];
    const plantCooldown = state.plantCooldowns[plantType] ?? 0;
    if (sun >= plantDef.cost && plantCooldown <= 0) {
      setSelectedPlant(plantType);
    }
  }, [sun, state.plantCooldowns]);

  useEffect(() => {
    if (status !== 'PLAYING') return;

    const gameLoop = setInterval(() => {
      dispatch({ type: 'GAME_TICK' });
    }, GAME_CONFIG.GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [status]);
  
  const startGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black bg-opacity-50 font-sans p-2">
      <div className="w-full max-w-7xl mx-auto">
        {status === 'IDLE' && (
          <div className="text-center text-white p-10 bg-black/70 rounded-lg">
            <h1 className="text-5xl font-bold mb-4 text-green-400">PVZ2 Tutorial Clone</h1>
            <p className="mb-8 text-xl">Defend your lawn from the zombie horde!</p>
            <button onClick={startGame} className="px-8 py-4 bg-green-600 text-white font-bold text-2xl rounded-lg hover:bg-green-700 transition-colors">
              Start Game
            </button>
          </div>
        )}

        {(status === 'PLAYING' || status === 'WON' || status === 'LOST') && (
          <>
            <GameUI
              sun={sun}
              plantCooldowns={state.plantCooldowns}
              onSelectPlant={handleSelectPlant}
              selectedPlant={selectedPlant}
            />
            <GameBoard
              plants={plants}
              zombies={zombies}
              peas={peas}
              suns={suns}
              onPlacePlant={handlePlacePlant}
              onCollectSun={handleCollectSun}
              selectedPlant={selectedPlant}
            />
          </>
        )}
        
        {status === 'WON' && <CrazyDaveDialog />}
        
        {status === 'LOST' && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
            <h2 className="text-6xl font-bold text-red-500 mb-4">THE ZOMBIES ATE YOUR BRAINS!</h2>
            <button onClick={startGame} className="px-6 py-3 bg-red-600 text-white font-bold text-xl rounded-lg hover:bg-red-700 transition-colors">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
   